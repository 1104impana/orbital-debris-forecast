from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.spacetrack import fetch_live_debris

import json
import os

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

@app.get("/future-debris")
def future_debris(year: int):

    prediction_file = "future_predictions.json"

    if not os.path.exists(prediction_file):
        return {
            "error": "Future predictions file not found"
        }

    with open(prediction_file, "r") as f:
        predictions = json.load(f)

    # Find requested year
    result = next(
        (item for item in predictions if int(item["Year"]) == year),
        None
    )

    if result is None:
        return {
            "error": f"No prediction available for {year}"
        }

    return {
        "year": year,
        "predicted": round(
            float(result["Predicted_Debris"]),
            2
        )
    }