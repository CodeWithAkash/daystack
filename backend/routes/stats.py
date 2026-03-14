from flask import Blueprint,jsonify,request
from datetime import datetime
from config import stats_collection
from streak import calculate_streak
from ai_coach import generate_advice

stats_bp=Blueprint("stats",__name__)

@stats_bp.route("/save",methods=["POST"])
def save():

    data=request.json
    user=data["user"]
    tasks=data["tasks"]

    today=datetime.now().date()

    stats_collection.insert_one({
        "user":user,
        "count":len(tasks),
        "date":today
    })

    advice=generate_advice(len(tasks))

    return jsonify({
        "status":"saved",
        "advice":advice
    })

@stats_bp.route("/streak/<user>")
def streak(user):

    s=calculate_streak(user)
    return jsonify({"streak":s})