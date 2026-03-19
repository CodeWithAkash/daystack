import { useState, useEffect } from "react"
import api from "../api/api"

const HABIT_META = {
  morning_walk:    { icon: "🌅", color: "#FF9F43" },
  gardening:       { icon: "🌱", color: "#1DD1A1" },
  morning_coding:  { icon: "💻", color: "#7B5CF0" },
  evening_walk_gym:{ icon: "🏋️", color: "#F97316" },
  github:          { icon: "🐙", color: "#CDD9E5" },
  leetcode:        { icon: "⚡", color: "#FFA502" },
  hackerrank:      { icon: "🏆", color: "#2ECC71" },
  new_skills:      { icon: "🚀", color: "#A29BFE" },
  painting:        { icon: "🎨", color: "#6D4697" },
}

function StreakBadge({ habit, streakData }) {
  const meta = HABIT_META[habit.id] || { icon: "✅", color: "#7B5CF0" }
  const current = streakData?.current || 0
  const best = streakData?.best || 0
  const isHot = current >= 3

  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: "12px 16px",
      borderRadius: "var(--radius-md)",
      background: isHot ? `${meta.color}12` : "var(--bg-glass)",
      border: `1px solid ${isHot ? meta.color + "33" : "var(--border)"}`,
      gap: 12,
      transition: "all 0.3s ease",
    }}>
      <div style={{
        fontSize: 22,
        width: 40, height: 40,
        borderRadius: 12,
        background: `${meta.color}22`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>{meta.icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 700,
          color: "var(--text-secondary)",
          marginBottom: 2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{habit.label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Progress bar */}
          <div style={{
            flex: 1, height: 4, borderRadius: 2,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${Math.min((current / Math.max(best, 7)) * 100, 100)}%`,
              background: `linear-gradient(90deg, ${meta.color}, ${meta.color}bb)`,
              borderRadius: 2,
              transition: "width 0.8s ease",
            }} />
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{
          fontSize: 20,
          fontWeight: 800,
          color: isHot ? meta.color : "var(--text-primary)",
          fontFamily: "var(--font-display)",
          display: "flex", alignItems: "center", gap: 4,
          filter: isHot ? `drop-shadow(0 0 8px ${meta.color})` : "none",
        }}>
          {isHot && <span style={{ fontSize: 14, animation: "streak-fire 2s ease-in-out infinite" }}>🔥</span>}
          {current}
        </div>
        <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>
          Best: {best}
        </div>
      </div>
    </div>
  )
}

export default function StreakCard() {
  const [data, setData] = useState(null)
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [overviewRes, habitsRes] = await Promise.all([
          api.get("/api/stats/overview"),
          api.get("/api/tasks/habits"),
        ])
        setData(overviewRes.data)
        setHabits(habitsRes.data.habits)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const weeklyPct = data?.weekly_completion || 0

  return (
    <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 24,
      }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: "var(--accent-yellow)",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: 4,
          }}>🏆 Weekly Streaks</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>Habit Fire</div>
        </div>

        {/* Weekly ring */}
        <div style={{ position: "relative", width: 72, height: 72 }}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6"/>
            <circle
              cx="36" cy="36" r="30"
              fill="none"
              stroke="url(#weekGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 30}`}
              strokeDashoffset={`${2 * Math.PI * 30 * (1 - weeklyPct / 100)}`}
              transform="rotate(-90 36 36)"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
            <defs>
              <linearGradient id="weekGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7B5CF0"/>
                <stop offset="100%" stopColor="#3B82F6"/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column",
          }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>{weeklyPct}%</span>
          </div>
        </div>
      </div>

      {/* Weekly reward banner */}
      {weeklyPct >= 80 && (
        <div style={{
          background: "linear-gradient(135deg, rgba(234,179,8,0.2), rgba(251,146,60,0.15))",
          border: "1px solid rgba(234,179,8,0.35)",
          borderRadius: "var(--radius-md)",
          padding: "12px 16px",
          marginBottom: 20,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 24 }}>🎉</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#EAB308" }}>
              Weekly Champion!
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              You're crushing it — {weeklyPct}% done this week!
            </div>
          </div>
        </div>
      )}

      {loading ? (
        Array(4).fill(0).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 64, marginBottom: 8, borderRadius: "var(--radius-md)" }} />
        ))
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {habits.map((habit, i) => (
            <div key={habit.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
              <StreakBadge
                habit={habit}
                streakData={data?.streaks?.[habit.id]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}