from flask import Blueprint, request, jsonify
from datetime import datetime
from config import tasks_collection
from models import make_daily_log, HABITS

tasks_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


@tasks_bp.route("/habits", methods=["GET"])
def get_habit_definitions():
    """Return the list of habit definitions."""
    return jsonify({"habits": HABITS})


@tasks_bp.route("/today", methods=["GET"])
def get_today():
    today = datetime.utcnow().strftime("%Y-%m-%d")
    log = tasks_collection.find_one({"date": today}, {"_id": 0})
    if not log:
        log = make_daily_log(today)
        tasks_collection.insert_one({**log})
        log = tasks_collection.find_one({"date": today}, {"_id": 0})
    return jsonify(log)


@tasks_bp.route("/toggle", methods=["POST"])
def toggle_habit():
    data = request.get_json()
    date = data.get("date", datetime.utcnow().strftime("%Y-%m-%d"))
    habit_id = data.get("habit_id")

    log = tasks_collection.find_one({"date": date})
    if not log:
        log = make_daily_log(date)
        tasks_collection.insert_one(log)
        log = tasks_collection.find_one({"date": date})

    current = log.get("habits", {}).get(habit_id, False)
    tasks_collection.update_one(
        {"date": date},
        {
            "$set": {
                f"habits.{habit_id}": not current,
                "updated_at": datetime.utcnow().isoformat(),
            }
        }
    )
    return jsonify({"success": True, "new_value": not current})


@tasks_bp.route("/log/<date>", methods=["GET"])
def get_log(date):
    log = tasks_collection.find_one({"date": date}, {"_id": 0})
    if not log:
        log = make_daily_log(date)
    return jsonify(log)


@tasks_bp.route("/history", methods=["GET"])
def get_history():
    days = int(request.args.get("days", 30))
    logs = list(tasks_collection.find({}, {"_id": 0}).sort("date", -1).limit(days))
    return jsonify({"logs": logs})
