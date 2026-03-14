from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["daystack"]
tasks_collection = db["tasks"]
stats_collection = db["stats"]