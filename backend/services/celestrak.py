import requests

def fetch_live_debris():

    url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=fengyun-1c-debris&FORMAT=json"

    response = requests.get(url)

    return response.json()