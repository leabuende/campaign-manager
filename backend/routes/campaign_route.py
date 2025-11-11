import os
import shutil
import tempfile
from datetime import datetime
from typing import List

from db import get_db
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from models.campaign import (
    Audience,
    CampaignCreate,
    CampaignOut,
    CampaignUpdate,
    Content,
)
from repository.campaign_repository import CampaignRepository
from services.campaign_service import (
    extract_text_from_pdf,
    process_pdf_text,
    save_uploaded_image,
)

TEMP_FOLDER = "/tmp/campaign_uploads"

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


async def get_repo():
    db = get_db()
    return CampaignRepository(db)


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=CampaignOut)
async def create_campaign(
    payload: CampaignCreate, repo: CampaignRepository = Depends(get_repo)
):
    doc = await repo.create(payload)
    if not doc.get("id"):
        doc["id"] = str(doc.get("_id"))
    return CampaignOut(**doc)


@router.get("/", response_model=List[CampaignOut])
async def list_campaigns(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, gt=0),
    repo: CampaignRepository = Depends(get_repo),
):
    docs = await repo.list(skip=skip, limit=limit)
    out = []
    for d in docs:
        if not d.get("id"):
            d["id"] = str(d.get("_id"))
        out.append(CampaignOut(**d))
    return out


@router.get("/{campaign_id}", response_model=CampaignOut)
async def get_campaign(campaign_id: str, repo: CampaignRepository = Depends(get_repo)):
    doc = await repo.get_by_id(campaign_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Campaign not found")
    if not doc.get("id"):
        doc["id"] = str(doc.get("_id"))
    return CampaignOut(**doc)


@router.put("/{campaign_id}", response_model=CampaignOut)
async def update_campaign(
    campaign_id: str,
    payload: CampaignUpdate,
    repo: CampaignRepository = Depends(get_repo),
):
    changes = {k: v for k, v in payload.dict(exclude_unset=True).items()}
    updated = await repo.update(campaign_id, changes)
    if not updated:
        raise HTTPException(status_code=404, detail="Campaign not found")
    if not updated.get("id"):
        updated["id"] = str(updated.get("_id"))
    return CampaignOut(**updated)


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_campaign(
    campaign_id: str, repo: CampaignRepository = Depends(get_repo)
):
    ok = await repo.delete(campaign_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return None


@router.post("/process_brief", response_model=CampaignOut)
async def process_brief(
    pdf: UploadFile = File(...),
    image: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(...),
    repo: CampaignRepository = Depends(get_repo),
):
    """
    Uploads a campaign brief (PDF + image), extracts text, processes it via AI,
    and creates a new campaign with generated audience data.
    """

    # 1. Save the uploaded PDF to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_pdf:
        shutil.copyfileobj(pdf.file, tmp_pdf)
        pdf_path = tmp_pdf.name

    try:
        pdf_text = extract_text_from_pdf(pdf_path)
        print("pdf text : ", pdf_text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {e}")

    try:
        processed_data = await process_pdf_text(pdf_text)
        print("processed data : ", processed_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {e}")

    audiences_list = []
    for aud in processed_data.get("audiences", []):
        content = aud.get("content", {})
        instagram = content.get("instagramCaption", {})
        tikTok = content.get("tikTokCaption", {})

        audience_content = Content(
            instagramCaption=instagram,
            tikTokCaption=tikTok,
        )

        files = []

        audience = Audience(
            id=aud.get("id"),
            name=aud.get("name"),
            content=audience_content,
            files=files,
        )
        audiences_list.append(audience)

    payload = CampaignCreate(
        name=name,
        description=processed_data.get("campaign_description"),
        audiences=audiences_list,
        date=datetime.utcnow(),
    )
    campaign = await repo.create(payload)
    campaign_id = str(campaign.get("_id") or campaign.get("id"))

    campaign_dir = os.path.join(TEMP_FOLDER, campaign_id)
    os.makedirs(campaign_dir, exist_ok=True)
    image_path = os.path.join(campaign_dir, image.filename)
    with open(image_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    campaign["id"] = campaign_id
    return CampaignOut(**campaign)
