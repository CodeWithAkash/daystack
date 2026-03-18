from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from config import tasks_collection
from models import HABITS
from streak import get_streak_for_habit, get_weekly_completion

stats_bp = Blueprint("stats", __name__, url_prefix="/api/stats")


@stats_bp.route("/overview", methods=["GET"])
def overview():
    try:
        today = datetime.utcnow().strftime("%Y-%m-%d")
        log = tasks_collection.find_one({"date": today})
        habits_done = 0
        if log:
            habits_done = sum(1 for v in log.get("habits", {}).values() if v)

        streaks = {}
        for h in HABITS:
            try:
                streaks[h["id"]] = get_streak_for_habit(h["id"])
            except:
                streaks[h["id"]] = {"current": 0, "best": 0}

        try:
            weekly = get_weekly_completion()
        except:
            weekly = 0

        return jsonify({
            "today_completed": habits_done,
            "total_habits": len(HABITS),
            "weekly_completion": weekly,
            "streaks": streaks,
        })
    except Exception as e:
        print(f"[overview] Error: {e}")
        return jsonify({
            "today_completed": 0,
            "total_habits": len(HABITS),
            "weekly_completion": 0,
            "streaks": {h["id"]: {"current": 0, "best": 0} for h in HABITS},
        })


@stats_bp.route("/weekly", methods=["GET"])
def weekly_chart():
    try:
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
    except Exception as e:
        print(f"[weekly] Error: {e}")
        day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        return jsonify({"weekly": [{"day": d, "date": "", "completed": 0, "total": len(HABITS), "pct": 0} for d in day_names]})


@stats_bp.route("/monthly", methods=["GET"])
def monthly_chart():
    try:
        year  = int(request.args.get("year",  datetime.utcnow().year))
        month = int(request.args.get("month", datetime.utcnow().month))
        start = f"{year}-{month:02d}-01"
        end   = f"{year+1}-01-01" if month == 12 else f"{year}-{month+1:02d}-01"

        logs = list(tasks_collection.find(
            {"date": {"$gte": start, "$lt": end}}, {"_id": 0}
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
    except Exception as e:
        print(f"[monthly] Error: {e}")
        return jsonify({"monthly": []})


@stats_bp.route("/per-habit", methods=["GET"])
def per_habit():
    try:
        days   = int(request.args.get("days", 30))
        cutoff = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")
        logs   = list(tasks_collection.find({"date": {"$gte": cutoff}}, {"_id": 0}))

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
    except Exception as e:
        print(f"[per-habit] Error: {e}")
        return jsonify({"habits": [{**h, "completed_days": 0, "total_days": 30, "pct": 0} for h in HABITS], "period_days": 30})