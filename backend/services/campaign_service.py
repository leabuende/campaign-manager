import os
import shutil
import tempfile
from typing import Any, Dict

from google import genai
from models.campaign import CampaignAnalysis
from PyPDF2 import PdfReader

TEMP_FOLDER = "/tmp/campaign_uploads"
os.makedirs(TEMP_FOLDER, exist_ok=True)


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
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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


def save_uploaded_image(image_file, campaign_id: str, filename: str) -> str:
    """Save uploaded image to a temp folder named by campaign ID."""
    campaign_dir = os.path.join(TEMP_FOLDER, campaign_id)
    os.makedirs(campaign_dir, exist_ok=True)
    image_path = os.path.join(campaign_dir, filename)
    with open(image_path, "wb") as f:
        shutil.copyfileobj(image_file, f)
    return image_path
