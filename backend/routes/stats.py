from flask import Blueprint,request,jsonify
from datetime import datetime
from config import stats_collection

stats_bp = Blueprint("stats",__name__)

@stats_bp.route("/save-day",methods=["POST"])
def save_day():

    data = request.json

    record = {
        "user": data["user"],
        "date": datetime.now().strftime("%Y-%m-%d"),
        "completed": data["tasks"],
        "score": len(data["tasks"])
    }

    stats_collection.insert_one(record)

    return jsonify({"status":"saved"})


@stats_bp.route("/analytics/<user>")
def analytics(user):

    records = list(stats_collection.find({"user":user}))

    history = []

    for r in records:
        history.append({
            "date": r["date"],
            "score": r["score"]
        })

    return jsonify({"history":history})