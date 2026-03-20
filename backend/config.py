import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")
    db = client["daystack"]
except Exception as e:
    print(f"[config] MongoDB connection error: {e}")
    client = None
    db = None

tasks_collection    = db["tasks"]    if db is not None else None
stats_collection    = db["stats"]    if db is not None else None
streaks_collection  = db["streaks"]  if db is not None else None
quotes_collection   = db["quotes"]   if db is not None else None