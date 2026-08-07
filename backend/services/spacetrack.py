import os
import json
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

USERNAME = os.getenv("SPACE_TRACK_USERNAME")
PASSWORD = os.getenv("SPACE_TRACK_PASSWORD")

CACHE_FILE = "cache.json"

LOGIN_URL = "https://www.space-track.org/ajaxauth/login"

QUERY_URL = (
    "https://www.space-track.org/basicspacedata/query/"
    "class/gp/"
    "DECAY_DATE/null-val/"
    "OBJECT_TYPE/DEBRIS/"
    "orderby/NORAD_CAT_ID asc/"
    "format/json"
)

def fetch_live_debris():

    if os.path.exists(CACHE_FILE):

        modified = datetime.fromtimestamp(os.path.getmtime(CACHE_FILE))

        if datetime.now() - modified < timedelta(hours=1):

            print("Using cached data")

            with open(CACHE_FILE, "r") as f:
                return json.load(f)

    print("Downloading latest debris...")

    session = requests.Session()

    login = session.post(
        LOGIN_URL,
        data={
            "identity": USERNAME,
            "password": PASSWORD
        }
    )

    login.raise_for_status()

    response = session.get(QUERY_URL)

    response.raise_for_status()

    data = response.json()

    with open(CACHE_FILE, "w") as f:
        json.dump(data, f)

    print("Downloaded", len(data), "debris objects")

    return data