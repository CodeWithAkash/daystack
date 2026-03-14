from flask import Flask
from flask_cors import CORS

from routes.tasks import tasks_bp
from routes.quotes import quotes_bp
from routes.stats import stats_bp
from routes.heatmap import heatmap_bp

app=Flask(__name__)
CORS(app)

app.register_blueprint(tasks_bp)
app.register_blueprint(quotes_bp)
app.register_blueprint(stats_bp)
app.register_blueprint(heatmap_bp)

if __name__=="__main__":
    app.run(host="0.0.0.0", port=10000)