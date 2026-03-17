from datetime import datetime, timedelta
from config import tasks_collection

def get_streak_for_habit(habit_id):
    """Calculate current and best streak for a single habit."""
    logs = list(tasks_collection.find(
        {f"habits.{habit_id}": True},
        {"date": 1}
    ).sort("date", -1))

    if not logs:
        return {"current": 0, "best": 0}

    dates = sorted([l["date"] for l in logs], reverse=True)
    today = datetime.utcnow().strftime("%Y-%m-%d")
    yesterday = (datetime.utcnow() - timedelta(days=1)).strftime("%Y-%m-%d")

    # current streak
    current = 0
    check = today if dates[0] == today else (yesterday if dates[0] == yesterday else None)
    if check:
        for d in dates:
            if d == check:
                current += 1
                check = (datetime.strptime(check, "%Y-%m-%d") - timedelta(days=1)).strftime("%Y-%m-%d")
            else:
                break

    # best streak
    best = 0
    streak = 1
    for i in range(1, len(dates)):
        prev = datetime.strptime(dates[i-1], "%Y-%m-%d")
        curr = datetime.strptime(dates[i], "%Y-%m-%d")
        if (prev - curr).days == 1:
            streak += 1
            best = max(best, streak)
        else:
            streak = 1
    best = max(best, current)

    return {"current": current, "best": best}


def get_weekly_completion():
    """Get this week's completion rate (Mon–Sun)."""
    today = datetime.utcnow()
    week_start = today - timedelta(days=today.weekday())
    dates = [(week_start + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)]

    logs = {l["date"]: l for l in tasks_collection.find({"date": {"$in": dates}})}
    from models import HABITS

    total = len(HABITS) * 7
    completed = 0
    for date in dates:
        if date in logs:
            habits = logs[date].get("habits", {})
            completed += sum(1 for v in habits.values() if v)

    return round((completed / total) * 100, 1) if total else 0
