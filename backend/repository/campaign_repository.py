import uuid
from typing import List, Optional

from bson.objectid import ObjectId
from db import get_db
from models.campaign import CampaignCreate, CampaignInDB, CampaignUpdate
from motor.motor_asyncio import AsyncIOMotorDatabase

COLLECTION = "campaigns"


class CampaignRepository:
    def __init__(self, db: AsyncIOMotorDatabase | None = None):
        self._db = db if db is not None else get_db()
        self.collection = self._db[COLLECTION]

    async def create(self, campaign: CampaignCreate) -> dict:
        doc = campaign.model_dump()
        if not doc.get("id"):
            doc["id"] = str(uuid.uuid4())

        result = await self.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    async def list(self, skip: int = 0, limit: int = 50) -> List[dict]:
        cursor = self.collection.find().skip(skip).limit(limit)
        return [doc async for doc in cursor]

    async def get_by_id(self, id: str) -> Optional[dict]:
        doc = await self.collection.find_one({"id": id})
        if doc:
            return doc
        try:
            obj = ObjectId(id)
            doc = await self.collection.find_one({"_id": obj})
            return doc
        except Exception:
            return None

    async def update(self, id: str, changes: dict) -> Optional[dict]:
        res = await self.collection.find_one_and_update(
            {"id": id}, {"$set": changes}, return_document=True
        )
        if res:
            return res
        try:
            obj = ObjectId(id)
            res = await self.collection.find_one_and_update(
                {"_id": obj}, {"$set": changes}, return_document=True
            )
            return res
        except Exception:
            return None

    async def delete(self, id: str) -> bool:
        res = await self.collection.delete_one({"id": id})
        if res.deleted_count:
            return True
        try:
            obj = ObjectId(id)
            res = await self.collection.delete_one({"_id": obj})
            return res.deleted_count > 0
        except Exception:
            return False
