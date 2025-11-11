from contextlib import asynccontextmanager

from db import close_client, get_client
from fastapi import FastAPI
from routes import campaign_route


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = get_client()
    print(f"Connected to MongoDB")

    yield

    await close_client()
    print("MongoDB connection closed")


app = FastAPI(title="Campaign Service", lifespan=lifespan)
app.include_router(campaign_route.router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
