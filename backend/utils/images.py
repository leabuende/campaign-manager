import os
import shutil
from typing import Union

from fastapi import UploadFile


def save_uploaded_image(
    image_file: Union[UploadFile, bytes],
    campaign_id: str,
    filename: str,
    base_path: str,
) -> str:
    """
    Save an uploaded image to a folder on disk.

    Args:
        image_file: UploadFile from FastAPI or bytes content
        campaign_id: Unique campaign identifier to create a subfolder
        filename: Name of the file to save (e.g., "hero_1x1.png")
        base_path: Base folder where all campaign images are stored

    Returns:
        The full path to the saved image
    """
    os.makedirs(base_path, exist_ok=True)

    campaign_dir = os.path.join(base_path, campaign_id)
    os.makedirs(campaign_dir, exist_ok=True)

    image_path = os.path.join(campaign_dir, filename)

    if isinstance(image_file, UploadFile):
        with open(image_path, "wb") as f:
            shutil.copyfileobj(image_file.file, f)
    else:
        with open(image_path, "wb") as f:
            f.write(image_file)

    return image_path
