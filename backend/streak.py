from datetime import timedelta
from config import stats_collection

def calculate_streak(user):

    records=list(stats_collection.find({"user":user}).sort("date",-1))

    streak=0
    prev=None

    for r in records:

        if prev is None:
            prev=r["date"]
            streak+=1
            continue

        if prev-r["date"]==timedelta(days=1):
            streak+=1
            prev=r["date"]
        else:
            break

    return streak