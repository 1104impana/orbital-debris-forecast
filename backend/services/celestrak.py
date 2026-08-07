import requests
import json
import os
from datetime import datetime, timedelta

CACHE_FILE = "cache.json"

URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=fengyun-1c-debris&FORMAT=json"

def fetch_live_debris():

    if os.path.exists(CACHE_FILE):

        modified = datetime.fromtimestamp(os.path.getmtime(CACHE_FILE))

        # 👇 ADD THIS
        print("Cache modified:", modified)

        if datetime.now() - modified < timedelta(hours=1):

            # 👇 ADD THIS
            print("Using cached data")

            with open(CACHE_FILE, "r") as f:
                return json.load(f)

    # 👇 Already existed (keep it)
    print("Downloading latest GP data...")

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(URL, headers=headers, timeout=30)
    response.raise_for_status()

    data = response.json()

    with open(CACHE_FILE, "w") as f:
        json.dump(data, f)

    # 👇 ADD THIS
    print("Downloaded and updated cache.")

    return data