import os
import re
from typing import Any, Dict, List

from google import genai
from google.genai import types
from models.campaign import CampaignAnalysis
from PIL import Image
from PyPDF2 import PdfReader
from rembg import remove
from repository.campaign_repository import CampaignRepository

TEMP_FOLDER = "/tmp/campaign_uploads"
os.makedirs(TEMP_FOLDER, exist_ok=True)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../shared/uploads")
)


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text content from a PDF using PyPDF2."""
    text = ""
    reader = PdfReader(pdf_path)
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


async def process_pdf_text(text: str, context: str = "") -> Dict[str, Any]:
    """
    Uses Gemini AI to extract structured audience data from PDF text.
    Returns structured audience data with campaign details and content.
    """

    prompt = f"""Given this campaign brief, analyze and generate a structured marketing campaign plan.

Campaign Brief:
{text}

{f"Additional Context: {context}" if context else ""}

Analyze this campaign brief and generate:
1. A comprehensive campaign description (overview of the campaign strategy)
2. A detailed product description (what is being marketed and its key features)
3. Main goals (3-5 key objectives of the campaign)
4. Target audiences (generate 2-4 distinct audience segments)

For EACH target audience segment:
- Create a unique ID (format: aud-1, aud-2, aud-3, etc.)
- Define the audience name/demographic (e.g., "Women 25-35", "Tech-Savvy Millennials")
- Generate tailored social media content:
  * Instagram Caption: Create an engaging, platform-appropriate caption. Include a warning if the language could be perceived as exclusionary. Provide a confidence score (0-1) based on how well it fits the audience.
  * TikTok Caption: Create a short, trendy caption with emojis. Provide a confidence score (0-1).

Make the content creative, diverse, and platform-appropriate. Ensure each audience segment has distinct messaging."""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_json_schema": CampaignAnalysis.model_json_schema(),
            },
        )

        # Parse and validate response using Pydantic
        campaign_analysis = CampaignAnalysis.model_validate_json(response.text)

        # Convert to dict for return
        return campaign_analysis.model_dump()

    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Return fallback structure
        return {
            "campaign_description": f"Error processing campaign brief: {str(e)}",
            "product_description": "N/A",
            "main_goals": "N/A",
            "audiences": [],
        }


async def generate_background_prompt(
    campaign_repo: CampaignRepository, campaign_description: str, audience_name: str
) -> str:
    prompt_text = (
        f"Generate a detailed, realistic background description for a product photoshoot "
        f"for the campaign: '{campaign_description}' and the audience: '{audience_name}'. "
        f"The background should fit the product and campaign tone, and could include settings, materials, "
        f"lighting, and colors (e.g., white marble, dramatic cinematic lighting, soft natural light, sand, water, urban setting). "
        f"Focus on creating a visually striking but simple and professional scene that highlights the product. "
        f"No humans should be displayed in the scene; the composition should be fully focused on the product. "
        f"Keep it concise and descriptive, suitable for an AI image generation prompt."
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash-exp",
        contents=prompt_text,
    )

    background_prompt = response.text
    return background_prompt


def remove_product_background(input_path: str, output_path: str) -> str:
    """Removes the background from the product image using rembg."""
    with Image.open(input_path) as img:
        output_image = remove(img, only_mask=False)
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        output_image.save(output_path)
    return output_path


def generate_final_images(
    product_path: str,
    output_path: str,
    audience_id: str,
    prompt: str,
) -> List[str]:
    """Generates AI images using Gemini with the cut-out product and following prompt:
    context"""
    paths = []

    aspect_ratios = ["1:1", "3:4", "9:16"]

    with Image.open(product_path) as product_img:
        for ratio in aspect_ratios:
            final_prompt = f"Generate a ad from a professional photoshoot, based on the product given, and the following instructions: {prompt}"

            response = client.models.generate_content(
                model="gemini-2.5-flash-image",
                contents=[final_prompt, product_img],
                config=types.GenerateContentConfig(
                    image_config=types.ImageConfig(aspect_ratio=ratio)
                    # TODO: Add person not allowed parameter, not sure if compatible with gen_content
                ),
            )

            for part in response.parts:
                if part.inline_data is not None:
                    image_output_path = os.path.join(
                        output_path,
                        f"generated_{audience_id}_{ratio.replace(':', 'x')}.png",
                    )
                    os.makedirs(os.path.dirname(output_path), exist_ok=True)
                    image = part.as_image()
                    image.save(image_output_path)
                    print(
                        f"Saved image for aspect ratio {ratio} at: {image_output_path}"
                    )

    return paths


def modify_image_with_gemini(
    image_path: str,
    modification_prompt: str,
) -> str:
    filename = os.path.basename(image_path)
    match = re.search(r"_(\d+x\d+)\.png$", filename)
    if match:
        aspect_ratio = match.group(1).replace("x", ":")
    else:
        aspect_ratio = "1:1"

    final_prompt = f"""Apply the following instructions carefully while preserving the original style, product and composition : {modification_prompt}
        Do not add any additional text or elements to the image, and do not apply any dramatic differences."""

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[final_prompt, image_path],
        config=types.GenerateContentConfig(
            image_config=types.ImageConfig(aspect_ratio=aspect_ratio)
        ),
    )

    for part in response.parts:
        if part.inline_data is not None:
            part.as_image().save(image_path)
            break
    else:
        raise ValueError("No image was generated by Gemini for the modification.")

    return image_path
