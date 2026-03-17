from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from config import tasks_collection
from models import HABITS
from streak import get_streak_for_habit, get_weekly_completion

stats_bp = Blueprint("stats", __name__, url_prefix="/api/stats")


@stats_bp.route("/overview", methods=["GET"])
def overview():
    today = datetime.utcnow().strftime("%Y-%m-%d")
    log = tasks_collection.find_one({"date": today})
    habits_done = 0
    if log:
        habits_done = sum(1 for v in log.get("habits", {}).values() if v)

    streaks = {}
    for h in HABITS:
        streaks[h["id"]] = get_streak_for_habit(h["id"])

    weekly = get_weekly_completion()

    return jsonify({
        "today_completed": habits_done,
        "total_habits": len(HABITS),
        "weekly_completion": weekly,
        "streaks": streaks,
    })


@stats_bp.route("/weekly", methods=["GET"])
def weekly_chart():
    today = datetime.utcnow()
    week_start = today - timedelta(days=today.weekday())
    dates = [(week_start + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)]
    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    logs = {l["date"]: l for l in tasks_collection.find({"date": {"$in": dates}}, {"_id": 0})}

    chart_data = []
    for i, date in enumerate(dates):
        log = logs.get(date, {})
        habits = log.get("habits", {})
        done = sum(1 for v in habits.values() if v)
        chart_data.append({
            "day": day_names[i],
            "date": date,
            "completed": done,
            "total": len(HABITS),
            "pct": round((done / len(HABITS)) * 100) if done else 0
        })

    return jsonify({"weekly": chart_data})


@stats_bp.route("/monthly", methods=["GET"])
def monthly_chart():
    year = int(request.args.get("year", datetime.utcnow().year))
    month = int(request.args.get("month", datetime.utcnow().month))

    start = f"{year}-{month:02d}-01"
    if month == 12:
        end = f"{year+1}-01-01"
    else:
        end = f"{year}-{month+1:02d}-01"

    logs = list(tasks_collection.find(
        {"date": {"$gte": start, "$lt": end}},
        {"_id": 0}
    ).sort("date", 1))

    result = []
    for log in logs:
        habits = log.get("habits", {})
        done = sum(1 for v in habits.values() if v)
        result.append({
            "date": log["date"],
            "completed": done,
            "total": len(HABITS),
            "pct": round((done / len(HABITS)) * 100) if done else 0,
        })

    return jsonify({"monthly": result})


@stats_bp.route("/per-habit", methods=["GET"])
def per_habit():
    days = int(request.args.get("days", 30))
    cutoff = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
    logs = list(tasks_collection.find({"date": {"$gte": cutoff}}, {"_id": 0}))

    habit_counts = {h["id"]: 0 for h in HABITS}
    for log in logs:
        for hid, done in log.get("habits", {}).items():
            if done and hid in habit_counts:
                habit_counts[hid] += 1

    result = []
    for h in HABITS:
        count = habit_counts[h["id"]]
        result.append({
            **h,
            "completed_days": count,
            "total_days": days,
            "pct": round((count / days) * 100) if days else 0,
        })

    return jsonify({"habits": result, "period_days": days})
