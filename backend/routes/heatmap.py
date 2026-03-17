from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from config import tasks_collection
from models import HABITS

heatmap_bp = Blueprint("heatmap", __name__, url_prefix="/api/heatmap")


@heatmap_bp.route("/", methods=["GET"])
def heatmap():
    days = int(request.args.get("days", 90))
    habit_id = request.args.get("habit_id")  # optional filter

    today = datetime.utcnow()
    start = (today - timedelta(days=days)).strftime("%Y-%m-%d")

    query = {"date": {"$gte": start}}
    logs = list(tasks_collection.find(query, {"_id": 0}).sort("date", 1))

    result = []
    for log in logs:
        habits = log.get("habits", {})
        if habit_id:
            value = 1 if habits.get(habit_id, False) else 0
        else:
            done = sum(1 for v in habits.values() if v)
            total = len(HABITS)
            # intensity 0-4
            value = 0
            if done > 0:
                pct = done / total
                if pct <= 0.25:   value = 1
                elif pct <= 0.5:  value = 2
                elif pct <= 0.75: value = 3
                else:             value = 4

        result.append({"date": log["date"], "value": value})

    # fill missing dates with 0
    all_dates = {}
    for entry in result:
        all_dates[entry["date"]] = entry["value"]

    filled = []
    for i in range(days + 1):
        d = (today - timedelta(days=days - i)).strftime("%Y-%m-%d")
        filled.append({"date": d, "value": all_dates.get(d, 0)})

    return jsonify({"heatmap": filled, "days": days})
