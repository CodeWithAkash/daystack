import { useState, useEffect } from "react"
import api from "../api/api"

const LEVELS = [
  "transparent",
  "rgba(123,92,240,0.2)",
  "rgba(123,92,240,0.45)",
  "rgba(123,92,240,0.7)",
  "rgba(123,92,240,1)",
]

export default function Heatmap() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    api.get("/api/heatmap/?days=90")
      .then(r => setData(r.data.heatmap))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="glass-card skeleton" style={{ height: 200 }} />
  )

  // Group by week columns
  const weeks = []
  let week = []
  data.forEach((d, i) => {
    week.push(d)
    if (week.length === 7 || i === data.length - 1) {
      weeks.push(week)
      week = []
    }
  })

  const totalDone = data.filter(d => d.value > 0).length
  const streak = (() => {
    let s = 0
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].value > 0) s++
      else break
    }
    return s
  })()

  const monthLabels = (() => {
    const labels = {}
    data.forEach((d, i) => {
      const month = new Date(d.date).toLocaleString("default", { month: "short" })
      const weekIdx = Math.floor(i / 7)
      if (!labels[month]) labels[month] = weekIdx
    })
    return labels
  })()

  return (
    <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 24, flexWrap: "wrap", gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-purple)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>
            🔥 Activity Map
          </div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>90-Day Heatmap</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            {totalDone} active days · {streak} day current streak
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
          <span>Less</span>
          {LEVELS.map((c, i) => (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: 3,
              background: c || "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.07)",
            }} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        {/* Month labels */}
        <div style={{ display: "flex", gap: 3, marginBottom: 4, paddingLeft: 24 }}>
          {weeks.map((_, wi) => {
            const date = weeks[wi]?.[0]?.date
            if (!date) return <div key={wi} style={{ width: 14 }} />
            const month = new Date(date).toLocaleString("default", { month: "short" })
            const show = wi === 0 || new Date(date).getDate() <= 7
            return (
              <div key={wi} style={{
                width: 14, fontSize: 9,
                color: show ? "var(--text-muted)" : "transparent",
                fontWeight: 700, letterSpacing: "0.5px",
              }}>{month}</div>
            )
          })}
        </div>

        <div style={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          {/* Day labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 4 }}>
            {["M","","W","","F","","S"].map((d, i) => (
              <div key={i} style={{ height: 14, fontSize: 9, color: "var(--text-muted)", fontWeight: 700, lineHeight: "14px" }}>{d}</div>
            ))}
          </div>

          {/* Cells */}
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {Array(7).fill(null).map((_, di) => {
                const cell = week[di]
                if (!cell) return (
                  <div key={di} style={{ width: 14, height: 14 }} />
                )
                return (
                  <div
                    key={di}
                    onMouseEnter={e => setTooltip({ date: cell.date, value: cell.value, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      width: 14, height: 14,
                      borderRadius: 3,
                      background: cell.value > 0 ? LEVELS[cell.value] : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      transition: "transform 0.1s, box-shadow 0.1s",
                      boxShadow: cell.value >= 3 ? `0 0 6px ${LEVELS[cell.value]}` : "none",
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = "scale(1.3)" }}
                    onMouseOut={e => { e.currentTarget.style.transform = "scale(1)" }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed",
          left: tooltip.x + 12,
          top: tooltip.y - 40,
          zIndex: 999,
          background: "#1C1C28",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "var(--radius-sm)",
          padding: "8px 12px",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-primary)",
          pointerEvents: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          <div>{tooltip.date}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 11 }}>
            {tooltip.value === 0 ? "No activity" :
             tooltip.value === 1 ? "Light activity" :
             tooltip.value === 2 ? "Moderate" :
             tooltip.value === 3 ? "Active" : "🔥 On fire!"}
          </div>
        </div>
      )}
    </div>
  )
}