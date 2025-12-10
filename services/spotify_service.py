import os
import random

from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials


# Read Spotify credentials
SPOTIFY_CLIENT_ID = os.environ.get("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")

# Authenticate
client_credentials_manager = SpotifyClientCredentials(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET
)
sp = Spotify(client_credentials_manager=client_credentials_manager)


MOOD_KEYWORDS = {
    "happy": ["happy", "joyful", "cheerful", "uplifting", "feel good"],
    "sad": ["sad", "melancholy", "blue", "emotional"],
    "calm": ["calm", "relaxing", "ambient", "chill"],
    "energetic": ["energetic", "workout", "hype", "pump up"]
}


def search_playlists_by_mood(mood: str, limit: int = 50):
    """
    Search Spotify playlists using mood keywords.

    :param mood: Mood chosen by the user.
    :param limit: Max. amount of playlists returned by the search.

    :return: List of Spotify playlists.
    """
    if mood not in MOOD_KEYWORDS:
        return []

    # Build regex-like OR pattern: (happy OR joyful OR uplifting)
    keywords = MOOD_KEYWORDS[mood]
    or_pattern = " OR ".join([f'"{k}"' for k in keywords])
    query = f"({or_pattern}) playlist"

    # Perform Spotify search
    results = sp.search(q=query, type="playlist", limit=limit)

    playlists = []
    for item in results['playlists']['items']:
        if not item:
            continue
        playlists.append({
            'name': item['name'],
            'url': item['external_urls']['spotify'],
            'image': item['images'][0]['url'] if item['images'] else None
        })

    # Randomly choose 5 playlists
    random.shuffle(playlists)
    return playlists[:5]
