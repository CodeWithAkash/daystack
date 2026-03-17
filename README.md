# ⚡ DayStack v2

A beautifully designed personal daily habit tracker — iOS-inspired dark UI, animated, with real analytics.

## ✨ Features

- **8 daily habits** with category grouping (Fitness, Dev, Wellness & Learning)
- **Animated habit cards** — tap to toggle with satisfying micro-interactions
- **Daily motivational quotes** — deterministic daily + random refresh
- **GitHub-style heatmap** — 90-day activity visualization
- **Rich analytics** — bar chart, line chart, doughnut, habit rankings
- **Weekly streaks** — per-habit streaks with fire animation + weekly reward banner
- **iOS-inspired dark UI** — gradient mesh background, glass-morphism cards

## 📁 Structure

```
daystack/
├── backend/
│   ├── app.py              # Flask entry point
│   ├── config.py           # MongoDB connection (uses MONGO_URI env var)
│   ├── models.py           # Habit definitions & daily log factory
│   ├── streak.py           # Streak calculation logic
│   ├── requirements.txt
│   └── routes/
│       ├── tasks.py        # GET /api/tasks/today, POST /api/tasks/toggle
│       ├── stats.py        # GET /api/stats/overview, /weekly, /monthly, /per-habit
│       ├── quotes.py       # GET /api/quotes/today, /random
│       └── heatmap.py      # GET /api/heatmap/
│
├── frontend-web/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css       # Design tokens, animations, utility classes
│   │   ├── api/api.js      # Axios client → https://api.day.akash-codes.space
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── QuoteCard.jsx
│   │   │   ├── HabitCard.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── StreakCard.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Heatmap.jsx
│   │   └── pages/Home.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── render.yaml             # Render deploy config
```

## 🚀 Setup

### Backend (Render)

1. Set `MONGO_URI` environment variable in Render dashboard
2. Deploy with `render.yaml` or manually:
   ```
   Build: pip install -r requirements.txt
   Start: gunicorn app:app --bind 0.0.0.0:$PORT
   Root:  backend/
   ```

### Frontend (Vercel)

```bash
cd frontend-web
npm install
npm run build        # → dist/
```

Deploy `dist/` to Vercel. Set root directory to `frontend-web/`.

### Local dev

```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend
cd frontend-web
npm install
npm run dev
```

## 🎨 Design System

- **Font**: Plus Jakarta Sans (display)
- **Theme**: Deep midnight `#0A0A0F` + vivid accent ramp
- **Cards**: Glass-morphism with `backdrop-filter: blur`
- **Animations**: CSS keyframes — fadeIn, float, streak-fire, gradient-shift
- **Charts**: Chart.js via react-chartjs-2

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/habits` | All habit definitions |
| GET | `/api/tasks/today` | Today's log |
| POST | `/api/tasks/toggle` | Toggle a habit `{habit_id, date}` |
| GET | `/api/stats/overview` | Today count + weekly % + all streaks |
| GET | `/api/stats/weekly` | This week's daily counts |
| GET | `/api/stats/per-habit?days=30` | Per-habit completion % |
| GET | `/api/quotes/today` | Deterministic daily quote |
| GET | `/api/quotes/random` | Random quote |
| GET | `/api/heatmap/?days=90` | Activity heatmap data |
