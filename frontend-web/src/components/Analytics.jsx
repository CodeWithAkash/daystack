import { useState, useEffect, useRef } from "react"
import api from "../api/api"
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Tooltip, Legend, Filler,
} from "chart.js"
import { Bar, Line, Doughnut } from "react-chartjs-2"

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Tooltip, Legend, Filler,
)

const chartDefaults = {
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1C1C28",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
      titleColor: "#F0F0FF",
      bodyColor: "#9898BB",
      padding: 12,
      cornerRadius: 10,
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(255,255,255,0.04)" },
      ticks: { color: "#5A5A7A", font: { family: "Plus Jakarta Sans", size: 11, weight: "600" } },
    },
    y: {
      grid: { color: "rgba(255,255,255,0.04)" },
      ticks: { color: "#5A5A7A", font: { family: "Plus Jakarta Sans", size: 11 } },
      beginAtZero: true,
    },
  },
}

const HABIT_COLORS = [
  "#FF9F43","#1DD1A1","#7B5CF0","#F97316",
  "#CDD9E5","#FFA502","#2ECC71","#A29BFE",
]

export default function Analytics() {
  const [weekly, setWeekly]   = useState(null)
  const [perHabit, setPerHabit] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [wRes, phRes] = await Promise.all([
          api.get("/api/stats/weekly"),
          api.get("/api/stats/per-habit?days=30"),
        ])
        setWeekly(wRes.data.weekly)
        setPerHabit(phRes.data.habits)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {[200, 260, 200].map((h, i) => (
        <div key={i} className="skeleton glass-card" style={{ height: h }} />
      ))}
    </div>
  )

  const weeklyBarData = weekly ? {
    labels: weekly.map(d => d.day),
    datasets: [{
      data: weekly.map(d => d.completed),
      backgroundColor: weekly.map((d, i) => {
        const today = new Date().getDay()
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
        return days[today] === d.day ? "#7B5CF0" : "rgba(123,92,240,0.3)"
      }),
      borderRadius: 8,
      borderSkipped: false,
      hoverBackgroundColor: "#A78BFA",
    }],
  } : null

  const habitLineData = perHabit ? {
    labels: perHabit.map(h => h.label.split(" ")[0]),
    datasets: [{
      data: perHabit.map(h => h.pct),
      borderColor: "#7B5CF0",
      backgroundColor: "rgba(123,92,240,0.12)",
      pointBackgroundColor: HABIT_COLORS,
      pointBorderColor: HABIT_COLORS,
      pointRadius: 6,
      pointHoverRadius: 9,
      fill: true,
      tension: 0.4,
      borderWidth: 2,
    }],
  } : null

  const doughnutData = perHabit ? {
    labels: perHabit.map(h => h.label),
    datasets: [{
      data: perHabit.map(h => h.completed_days),
      backgroundColor: HABIT_COLORS.map(c => c + "CC"),
      borderColor: HABIT_COLORS,
      borderWidth: 1,
      hoverOffset: 8,
    }],
  } : null

  const totalCompleted = perHabit?.reduce((s, h) => s + h.completed_days, 0) || 0
  const avgPct = perHabit ? Math.round(perHabit.reduce((s, h) => s + h.pct, 0) / perHabit.length) : 0

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Summary stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Total completions", value: totalCompleted, icon: "✅", color: "#22C55E" },
          { label: "Avg completion", value: `${avgPct}%`, icon: "📊", color: "#7B5CF0" },
          { label: "Habits tracked", value: perHabit?.length || 0, icon: "🎯", color: "#F97316" },
        ].map((s, i) => (
          <div key={i} className="glass-card animate-fade-in" style={{
            padding: "20px 18px",
            textAlign: "center",
            animationDelay: `${i * 80}ms`,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{
              fontSize: 28, fontWeight: 800,
              color: s.color,
              marginBottom: 4,
              fontFamily: "var(--font-display)",
            }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly bar chart */}
      <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-blue)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>📅 This Week</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Daily Completions</div>
        </div>
        {weeklyBarData && (
          <Bar
            data={weeklyBarData}
            options={{
              ...chartDefaults,
              responsive: true,
              maintainAspectRatio: true,
              animation: { duration: 800, easing: "easeOutQuart" },
              scales: {
                ...chartDefaults.scales,
                y: {
                  ...chartDefaults.scales.y,
                  max: 8,
                  ticks: { ...chartDefaults.scales.y.ticks, stepSize: 2 },
                },
              },
            }}
            height={120}
          />
        )}
      </div>

      {/* Per-habit line chart */}
      <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-teal)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>📈 30-Day View</div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Habit Completion Rate</div>
        </div>
        {habitLineData && (
          <Line
            data={habitLineData}
            options={{
              ...chartDefaults,
              responsive: true,
              animation: { duration: 1000, easing: "easeOutQuart" },
              scales: {
                ...chartDefaults.scales,
                y: { ...chartDefaults.scales.y, max: 100, ticks: { ...chartDefaults.scales.y.ticks, callback: v => `${v}%` } },
              },
            }}
            height={110}
          />
        )}
      </div>

      {/* Doughnut + per-habit list */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-orange)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>🍩 Distribution</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>30-Day Split</div>
          </div>
          {doughnutData && (
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                animation: { duration: 1000 },
                plugins: {
                  legend: { display: false },
                  tooltip: chartDefaults.plugins.tooltip,
                },
                cutout: "65%",
              }}
            />
          )}
        </div>

        <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-green)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>🏅 Rankings</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Best Habits</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {perHabit?.slice().sort((a, b) => b.pct - a.pct).slice(0, 5).map((h, i) => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, width: 16 }}>{i+1}</span>
                <span style={{ fontSize: 16 }}>{h.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 3 }}>
                    {h.label.split(" ").slice(0, 2).join(" ")}
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${h.pct}%`,
                      background: HABIT_COLORS[i % HABIT_COLORS.length],
                      borderRadius: 2,
                      transition: "width 1s ease",
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: HABIT_COLORS[i % HABIT_COLORS.length], width: 36, textAlign: "right" }}>{h.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}