import { useState, useEffect } from "react"
import api from "../api/api"

const HABIT_META = {
  morning_walk:     { icon: "🌅", gradient: ["#FF9F43","#FFCD60"], glow: "rgba(255,159,67,0.35)"  },
  gardening:        { icon: "🌱", gradient: ["#1DD1A1","#55E6C1"], glow: "rgba(29,209,161,0.35)"  },
  morning_coding:   { icon: "💻", gradient: ["#7B5CF0","#A78BFA"], glow: "rgba(123,92,240,0.35)"  },
  evening_walk_gym: { icon: "🏋️", gradient: ["#EE5A24","#F97316"], glow: "rgba(238,90,36,0.35)"   },
  github:           { icon: "🐙", gradient: ["#6E7681","#CDD9E5"], glow: "rgba(110,118,129,0.35)" },
  leetcode:         { icon: "⚡", gradient: ["#FFA502","#FFDA79"], glow: "rgba(255,165,2,0.35)"   },
  hackerrank:       { icon: "🏆", gradient: ["#2ECC71","#A8E063"], glow: "rgba(46,204,113,0.35)"  },
  new_skills:       { icon: "🚀", gradient: ["#A29BFE","#DDD6FE"], glow: "rgba(162,155,254,0.35)" },
  painting:         { icon: "🎨", gradient: ["#EC4899","#F9A8D4"], glow: "rgba(236,72,153,0.35)" },
}

function HabitCard({ habit, done, date, onToggle }) {
  const [animating, setAnimating] = useState(false)
  const [localDone, setLocalDone] = useState(done)
  const meta = HABIT_META[habit.id] || { icon: "✅", gradient: ["#7B5CF0","#A78BFA"], glow: "rgba(123,92,240,0.3)" }

  useEffect(() => { setLocalDone(done) }, [done])

  const handleToggle = async () => {
    setAnimating(true)
    const next = !localDone
    setLocalDone(next)
    onToggle && onToggle(habit.id, next)
    try {
      await api.post("/api/tasks/toggle", { habit_id: habit.id, date })
    } catch {
      setLocalDone(!next)
      onToggle && onToggle(habit.id, !next)
    }
    setTimeout(() => setAnimating(false), 400)
  }

  return (
    <div onClick={handleToggle} style={{
      position: "relative", borderRadius: "var(--radius-xl)",
      padding: "22px 20px", cursor: "pointer", overflow: "hidden",
      border: localDone ? `1px solid ${meta.gradient[0]}55` : "1px solid var(--border)",
      background: localDone
        ? `linear-gradient(145deg, ${meta.gradient[0]}22, ${meta.gradient[1]}11)`
        : "var(--bg-card)",
      boxShadow: localDone ? `0 8px 24px ${meta.glow}` : "none",
      transform: animating ? "scale(0.96)" : "scale(1)",
      transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      userSelect: "none",
    }}>
      {localDone && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "var(--radius-xl)",
          background: `radial-gradient(circle at 50% 0%, ${meta.gradient[0]}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
      )}
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: localDone
          ? `linear-gradient(135deg, ${meta.gradient[0]}, ${meta.gradient[1]})`
          : "rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, marginBottom: 14,
        boxShadow: localDone ? `0 4px 16px ${meta.glow}` : "none",
        transition: "all 0.25s ease",
        filter: localDone ? "none" : "grayscale(0.5)",
      }}>
        {meta.icon}
      </div>
      <div style={{
        fontSize: 13, fontWeight: 700,
        color: localDone ? "var(--text-primary)" : "var(--text-secondary)",
        lineHeight: 1.3, marginBottom: 8, transition: "color 0.2s",
      }}>
        {habit.label}
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "3px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700,
        background: localDone ? `${meta.gradient[0]}33` : "rgba(255,255,255,0.05)",
        color: localDone ? meta.gradient[0] : "var(--text-muted)",
        border: localDone ? `1px solid ${meta.gradient[0]}44` : "1px solid transparent",
        transition: "all 0.2s",
      }}>
        {localDone ? "✓ Done" : "○ Pending"}
      </div>
      {animating && localDone && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "var(--radius-xl)",
          background: `${meta.gradient[0]}22`,
          animation: "fadeInScale 0.3s ease both",
          pointerEvents: "none", fontSize: 36,
        }}>✓</div>
      )}
    </div>
  )
}

function Section({ label, habits, todayLog, today, onToggle }) {
  if (!habits.length) return null
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
        letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12,
      }}>{label}</div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 12,
      }}>
        {habits.map((h, i) => (
          <div key={h.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <HabitCard
              habit={h}
              done={todayLog[h.id] || false}
              date={today}
              onToggle={onToggle}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TaskList() {
  const [habits, setHabits]     = useState([])
  const [todayLog, setTodayLog] = useState({})
  const [loading, setLoading]   = useState(true)
  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitsRes, todayRes] = await Promise.all([
          api.get("/api/tasks/habits"),
          api.get("/api/tasks/today"),
        ])
        setHabits(habitsRes.data.habits)
        setTodayLog(todayRes.data.habits || {})
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleToggle = (habitId, newVal) => {
    setTodayLog(prev => ({ ...prev, [habitId]: newVal }))
  }

  const completedCount = Object.values(todayLog).filter(Boolean).length
  const totalCount     = habits.length
  const pct            = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

  const fitness = habits.filter(h => h.category === "fitness")
  const dev     = habits.filter(h => h.category === "dev")
  const other   = habits.filter(h => ["wellness","learning"].includes(h.category))

  return (
    <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 24,
      }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "var(--accent-teal)",
            letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4,
          }}>⚡ Today's Habits</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>
            {completedCount} / {totalCount} Done
          </div>
        </div>
        <div style={{ position: "relative", width: 64, height: 64 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5"/>
            <circle
              cx="32" cy="32" r="26" fill="none"
              stroke={pct === 100 ? "#22C55E" : "#14B8A6"}
              strokeWidth="5" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
              transform="rotate(-90 32 32)"
              style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontSize: 13, fontWeight: 800,
              color: pct === 100 ? "#22C55E" : "var(--text-primary)",
            }}>{pct}%</span>
          </div>
        </div>
      </div>

      <div style={{
        height: 6, borderRadius: 3,
        background: "rgba(255,255,255,0.06)",
        overflow: "hidden", marginBottom: 28,
      }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: pct === 100
            ? "linear-gradient(90deg, #22C55E, #86EFAC)"
            : "linear-gradient(90deg, #7B5CF0, #14B8A6)",
          borderRadius: 3, transition: "width 0.6s ease",
          boxShadow: pct > 0 ? "0 0 12px rgba(20,184,166,0.4)" : "none",
        }} />
      </div>

      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 14,
        }}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 130, borderRadius: "var(--radius-xl)" }} />
          ))}
        </div>
      ) : (
        <>
          <Section label="🏃 Fitness"             habits={fitness} todayLog={todayLog} today={today} onToggle={handleToggle} />
          <Section label="💻 Development"         habits={dev}     todayLog={todayLog} today={today} onToggle={handleToggle} />
          <Section label="🌿 Wellness & Learning" habits={other}   todayLog={todayLog} today={today} onToggle={handleToggle} />
        </>
      )}

      {!loading && pct === 100 && (
        <div className="animate-fade-scale" style={{
          marginTop: 24,
          background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(20,184,166,0.1))",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "var(--radius-lg)",
          padding: "18px 22px",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <span style={{ fontSize: 36, animation: "float 2s ease-in-out infinite" }}>🎉</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#22C55E" }}>Perfect Day!</div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
              You completed all {totalCount} habits today. Absolutely legendary.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}