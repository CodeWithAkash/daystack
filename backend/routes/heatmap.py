from flask import Blueprint,jsonify
from config import stats_collection

heatmap_bp=Blueprint("heatmap",__name__)

@heatmap_bp.route("/heatmap/<user>")
def heatmap(user):

    records=list(stats_collection.find({"user":user}))

    data=[{
        "date":str(r["date"]),
        "count":r["count"]
    } for r in records]

    return jsonify(data)