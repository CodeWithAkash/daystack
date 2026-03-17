import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["daystack"]

tasks_collection = db["tasks"]
stats_collection = db["stats"]
streaks_collection = db["streaks"]
quotes_collection = db["quotes"]
