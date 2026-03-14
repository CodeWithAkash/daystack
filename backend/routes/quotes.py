import random
from flask import Blueprint,jsonify

quotes_bp=Blueprint("quotes",__name__)

quotes=[
"Success is built on daily discipline.",
"Small habits create powerful results.",
"Consistency beats intensity.",
"Do the work even when motivation fades."
]

@quotes_bp.route("/quote")
def quote():
    return jsonify({"quote":random.choice(quotes)})