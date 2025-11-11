from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel, Field


class Caption(BaseModel):
    label: str
    value: str
    warning: Optional[str] = None
    confidence_score: Optional[float] = None


class Content(BaseModel):
    instagramCaption: Optional[Caption] = None
    tikTokCaption: Optional[Caption] = None


class FileItem(BaseModel):
    id: str
    name: str
    type: str
    url: Optional[str] = None
    content: Optional[str] = None


class Audience(BaseModel):
    id: str
    name: str
    content: Optional[Content] = None
    files: Optional[List[FileItem]] = []


class Metrics(BaseModel):
    reach: Optional[int] = 0
    roi: Optional[float] = 0.0
    audienceMatch: Optional[int] = 0


class CampaignAnalysis(BaseModel):
    campaign_description: str = Field(description="Overview of the marketing campaign")
    product_description: str = Field(
        description="Description of the product being marketed"
    )
    main_goals: str = Field(description="Key objectives and goals of the campaign")
    audiences: List[Audience] = Field(
        description="List of target audience segments with tailored content"
    )


class CampaignCreate(BaseModel):
    id: Optional[str] = None
    name: str
    date: Optional[datetime] = Field(default_factory=datetime.utcnow)
    description: Optional[str] = None
    audiences: Optional[List[Audience]] = []
    metrics: Optional[Metrics] = None


class CampaignUpdate(BaseModel):
    name: Optional[str]
    date: Optional[datetime]
    description: Optional[str]
    audiences: Optional[List[Audience]]
    metrics: Optional[Metrics]


class CampaignInDB(CampaignCreate):
    _id: Optional[Any] = None


class CampaignOut(CampaignCreate):
    id: str
