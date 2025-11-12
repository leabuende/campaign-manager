import os
from contextlib import asynccontextmanager

from db import close_client, get_client
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes import campaign_route


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = get_client()
    print(f"Connected to MongoDB")

    yield

    await close_client()
    print("MongoDB connection closed")


app = FastAPI(title="Campaign Service", lifespan=lifespan)
SHARED_UPLOADS = os.path.join(os.path.dirname(__file__), "../../shared/uploads")

SHARED_UPLOADS = os.getenv("UPLOAD_FOLDER", SHARED_UPLOADS)

os.makedirs(SHARED_UPLOADS, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=SHARED_UPLOADS), name="uploads")

app.include_router(campaign_route.router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
