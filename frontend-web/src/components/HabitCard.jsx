import { useState } from "react"
import api from "../api/api"

const HABIT_META = {
  morning_walk:    { icon: "🌅", gradient: ["#FF9F43","#FFCD60"], glow: "rgba(255,159,67,0.35)"  },
  gardening:       { icon: "🌱", gradient: ["#1DD1A1","#55E6C1"], glow: "rgba(29,209,161,0.35)"  },
  morning_coding:  { icon: "💻", gradient: ["#7B5CF0","#A78BFA"], glow: "rgba(123,92,240,0.35)"  },
  evening_walk_gym:{ icon: "🏋️", gradient: ["#EE5A24","#F97316"], glow: "rgba(238,90,36,0.35)"   },
  github:          { icon: "🐙", gradient: ["#6E7681","#CDD9E5"], glow: "rgba(110,118,129,0.35)" },
  leetcode:        { icon: "⚡", gradient: ["#FFA502","#FFDA79"], glow: "rgba(255,165,2,0.35)"   },
  hackerrank:      { icon: "🏆", gradient: ["#2ECC71","#A8E063"], glow: "rgba(46,204,113,0.35)"  },
  new_skills:      { icon: "🚀", gradient: ["#A29BFE","#DDD6FE"], glow: "rgba(162,155,254,0.35)" },
  painting:        { icon: "🎨", gradient: ["#6D4697","#A29BFE"], glow: "rgba(109,70,151,0.35)" },
}

export default function HabitCard({ habit, done, date, onToggle }) {
  const [animating, setAnimating] = useState(false)
  const [localDone, setLocalDone] = useState(done)
  const meta = HABIT_META[habit.id] || { icon: "✅", gradient: ["#7B5CF0","#A78BFA"], glow: "rgba(123,92,240,0.3)" }

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
    <div
      onClick={handleToggle}
      style={{
        position: "relative",
        borderRadius: "var(--radius-xl)",
        padding: "22px 20px",
        cursor: "pointer",
        overflow: "hidden",
        border: localDone
          ? `1px solid ${meta.gradient[0]}55`
          : "1px solid var(--border)",
        background: localDone
          ? `linear-gradient(145deg, ${meta.gradient[0]}22, ${meta.gradient[1]}11)`
          : "var(--bg-card)",
        boxShadow: localDone ? `0 8px 24px ${meta.glow}` : "none",
        transform: animating ? "scale(0.96)" : "scale(1)",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        userSelect: "none",
      }}
    >
      {/* Glow pulse when done */}
      {localDone && (
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "var(--radius-xl)",
          background: `radial-gradient(circle at 50% 0%, ${meta.gradient[0]}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
      )}

      {/* Icon circle */}
      <div style={{
        width: 52, height: 52,
        borderRadius: 16,
        background: localDone
          ? `linear-gradient(135deg, ${meta.gradient[0]}, ${meta.gradient[1]})`
          : "rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26,
        marginBottom: 14,
        boxShadow: localDone ? `0 4px 16px ${meta.glow}` : "none",
        transition: "all 0.25s ease",
        filter: localDone ? "none" : "grayscale(0.5)",
      }}>
        {meta.icon}
      </div>

      {/* Label */}
      <div style={{
        fontSize: 13,
        fontWeight: 700,
        color: localDone ? "var(--text-primary)" : "var(--text-secondary)",
        lineHeight: 1.3,
        marginBottom: 8,
        transition: "color 0.2s",
      }}>
        {habit.label}
      </div>

      {/* Status chip */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 50,
        fontSize: 11,
        fontWeight: 700,
        background: localDone
          ? `${meta.gradient[0]}33`
          : "rgba(255,255,255,0.05)",
        color: localDone ? meta.gradient[0] : "var(--text-muted)",
        border: localDone ? `1px solid ${meta.gradient[0]}44` : "1px solid transparent",
        transition: "all 0.2s",
      }}>
        {localDone ? "✓ Done" : "○ Pending"}
      </div>

      {/* Check overlay animation */}
      {animating && localDone && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "var(--radius-xl)",
          background: `${meta.gradient[0]}22`,
          animation: "fadeInScale 0.3s ease both",
          pointerEvents: "none",
          fontSize: 36,
        }}>✓</div>
      )}
    </div>
  )
}