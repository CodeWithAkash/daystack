from datetime import datetime

HABITS = [
    {"id": "morning_walk",      "label": "Morning Walk",         "icon": "🌅", "category": "fitness",   "color": "#FF9F43"},
    {"id": "gardening",         "label": "Gardening",            "icon": "🌱", "category": "wellness",  "color": "#1DD1A1"},
    {"id": "morning_coding",    "label": "Morning Coding",       "icon": "💻", "category": "dev",       "color": "#5F27CD"},
    {"id": "evening_walk_gym",  "label": "Evening Walk / Gym",   "icon": "🏋️", "category": "fitness",   "color": "#EE5A24"},
    {"id": "github",            "label": "GitHub Contribution",  "icon": "🐙", "category": "dev",       "color": "#2C3E50"},
    {"id": "leetcode",          "label": "LeetCode",             "icon": "⚡", "category": "dev",       "color": "#FFA502"},
    {"id": "hackerrank",        "label": "HackerRank",           "icon": "🏆", "category": "dev",       "color": "#2ECC71"},
    {"id": "new_skills",        "label": "New Skills",           "icon": "🚀", "category": "learning",  "color": "#A29BFE"},
    {"id": "painting",          "label": "Painting",             "icon": "🎨", "category": "wellness",  "color": "#EC4899"},]

def make_daily_log(date_str=None):
    today = date_str or datetime.utcnow().strftime("%Y-%m-%d")
    return {
        "date": today,
        "habits": {h["id"]: False for h in HABITS},
        "notes": "",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
