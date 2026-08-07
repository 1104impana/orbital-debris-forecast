from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.spacetrack import fetch_live_debris

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Backend Running"}

from datetime import datetime
import os

@app.get("/live-debris")
def live_debris():

    debris = fetch_live_debris()

    return {
        "last_fetch": datetime.fromtimestamp(
            os.path.getmtime("cache.json")
        ).isoformat(),

        "count": len(debris),

        "epoch": debris[0]["EPOCH"],

        "debris": debris
    }