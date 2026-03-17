from flask import Blueprint, jsonify
import random
from datetime import datetime

quotes_bp = Blueprint("quotes", __name__, url_prefix="/api/quotes")

QUOTES = [
    {"text": "The secret of getting ahead is getting started.", "author": "Mark Twain"},
    {"text": "Small daily improvements over time lead to stunning results.", "author": "Robin Sharma"},
    {"text": "You don't have to be great to start, but you have to start to be great.", "author": "Zig Ziglar"},
    {"text": "Discipline is the bridge between goals and accomplishment.", "author": "Jim Rohn"},
    {"text": "The only bad workout is the one that didn't happen.", "author": "Unknown"},
    {"text": "Code is like humor. When you have to explain it, it's bad.", "author": "Cory House"},
    {"text": "First, solve the problem. Then, write the code.", "author": "John Johnson"},
    {"text": "Progress, not perfection.", "author": "Unknown"},
    {"text": "Every expert was once a beginner.", "author": "Helen Hayes"},
    {"text": "Motivation gets you going. Habit keeps you growing.", "author": "John Maxwell"},
    {"text": "Success is the sum of small efforts repeated day in and day out.", "author": "Robert Collier"},
    {"text": "The difference between try and triumph is a little umph.", "author": "Marvin Phillips"},
    {"text": "Don't watch the clock; do what it does. Keep going.", "author": "Sam Levenson"},
    {"text": "Push yourself, because no one else is going to do it for you.", "author": "Unknown"},
    {"text": "Great things never come from comfort zones.", "author": "Unknown"},
    {"text": "Dream it. Wish it. Do it.", "author": "Unknown"},
    {"text": "Stay foolish to stay sane.", "author": "Maxime Lagacé"},
    {"text": "Consistency is what transforms average into excellence.", "author": "Unknown"},
    {"text": "Wake up with determination. Go to bed with satisfaction.", "author": "Unknown"},
    {"text": "It always seems impossible until it's done.", "author": "Nelson Mandela"},
    {"text": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
    {"text": "You are never too old to set another goal or dream a new dream.", "author": "C.S. Lewis"},
    {"text": "Believe you can and you're halfway there.", "author": "Theodore Roosevelt"},
    {"text": "Act as if what you do makes a difference. It does.", "author": "William James"},
    {"text": "Start where you are. Use what you have. Do what you can.", "author": "Arthur Ashe"},
]


@quotes_bp.route("/today", methods=["GET"])
def today_quote():
    # Deterministic daily quote based on day of year
    day_of_year = datetime.utcnow().timetuple().tm_yday
    quote = QUOTES[day_of_year % len(QUOTES)]
    return jsonify(quote)


@quotes_bp.route("/random", methods=["GET"])
def random_quote():
    return jsonify(random.choice(QUOTES))
