from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from config import tasks_collection
from models import HABITS

heatmap_bp = Blueprint("heatmap", __name__, url_prefix="/api/heatmap")


@heatmap_bp.route("/", methods=["GET"])
def heatmap():
    try:
        days      = int(request.args.get("days", 90))
        habit_id  = request.args.get("habit_id")
        today     = datetime.utcnow()
        start     = (today - timedelta(days=days)).strftime("%Y-%m-%d")

        logs = list(tasks_collection.find({"date": {"$gte": start}}, {"_id": 0}).sort("date", 1))

        all_dates = {}
        for log in logs:
            habits = log.get("habits", {})
            if habit_id:
                value = 1 if habits.get(habit_id, False) else 0
            else:
                done  = sum(1 for v in habits.values() if v)
                total = len(HABITS)
                value = 0
                if done > 0:
                    pct = done / total
                    value = 1 if pct <= 0.25 else 2 if pct <= 0.5 else 3 if pct <= 0.75 else 4
            all_dates[log["date"]] = value

        filled = []
        for i in range(days + 1):
            d = (today - timedelta(days=days - i)).strftime("%Y-%m-%d")
            filled.append({"date": d, "value": all_dates.get(d, 0)})

        return jsonify({"heatmap": filled, "days": days})
    except Exception as e:
        print(f"[heatmap] Error: {e}")
        return jsonify({"heatmap": [], "days": 90})