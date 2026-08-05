from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.celestrak import fetch_live_debris

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

@app.get("/live-debris")
def live_debris():
    return fetch_live_debris()