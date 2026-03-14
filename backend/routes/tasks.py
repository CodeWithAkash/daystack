from flask import Blueprint,jsonify
from models import TASKS

tasks_bp=Blueprint("tasks",__name__)

@tasks_bp.route("/tasks")
def tasks():
    return jsonify(TASKS)