import { useState, useEffect } from "react"
import QuoteCard from "../components/QuoteCard"
import TaskList from "../components/TaskList"
import StreakCard from "../components/StreakCard"
import Analytics from "../components/Analytics"
import Heatmap from "../components/Heatmap"
import api from "../api/api"

export default function Home({ activeTab }) {
  return (
    <main style={{
      position: "relative",
      zIndex: 1,
      maxWidth: 1100,
      margin: "0 auto",
      padding: "24px 24px 80px",
    }}>
      {activeTab === "today"     && <TodayView />}
      {activeTab === "analytics" && <AnalyticsView />}
      {activeTab === "heatmap"   && <HeatmapView />}
      {activeTab === "streaks"   && <StreaksView />}
    </main>
  )
}

function TodayView() {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="animate-fade-in" style={{ marginBottom: 8 }}>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 44px)",
          fontWeight: 900,
          letterSpacing: "-1px",
          lineHeight: 1.1,
          marginBottom: 8,
          background: "linear-gradient(135deg, #F0F0FF 0%, #A78BFA 50%, #60A5FA 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundSize: "200% 200%",
          animation: "gradient-shift 6s ease infinite",
        }}>
          {greeting}, Akash 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, fontWeight: 500 }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      <QuoteCard />

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) 340px",
        gap: 20,
        alignItems: "start",
      }}>
        <TaskList />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <MiniStats />
          <StreakCard />
        </div>
      </div>
    </div>
  )
}

function MiniStats() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get("/api/stats/overview")
      .then(r => setData(r.data))
      .catch(() => {})
  }, [])

  const items = [
    { icon: "⚡", label: "Today",     value: data ? `${data.today_completed}/${data.total_habits}` : "—", color: "#7B5CF0" },
    { icon: "📅", label: "This Week", value: data ? `${data.weekly_completion}%` : "—",                   color: "#14B8A6" },
  ]

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {items.map((s, i) => (
        <div key={i} className="glass-card animate-fade-in" style={{
          padding: "18px 16px",
          textAlign: "center",
          animationDelay: `${i * 100}ms`,
          background: `linear-gradient(135deg, ${s.color}14, transparent)`,
          border: `1px solid ${s.color}25`,
        }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.value}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px" }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

function SectionHeader({ tag, title, subtitle, color }) {
  return (
    <div className="animate-fade-in" style={{ marginBottom: 8 }}>
      <div style={{
        fontSize: 11, fontWeight: 700,
        color, letterSpacing: "1.5px",
        textTransform: "uppercase", marginBottom: 8,
      }}>{tag}</div>
      <h1 style={{
        fontSize: "clamp(24px, 4vw, 36px)",
        fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 6,
      }}>{title}</h1>
      <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>{subtitle}</p>
    </div>
  )
}

function AnalyticsView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader tag="📊 Analytics" title="Your Progress"    subtitle="Track your habits over time with detailed insights"        color="var(--accent-blue)"   />
      <Analytics />
    </div>
  )
}

function HeatmapView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader tag="🔥 Activity"  title="Contribution Map" subtitle="Your 90-day habit activity — like GitHub but for your life" color="var(--accent-purple)" />
      <Heatmap />
    </div>
  )
}

function StreaksView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader tag="🏆 Streaks"   title="Streak Board"     subtitle="Keep the fire alive — your streaks and weekly rewards"     color="var(--accent-yellow)"/>
      <StreakCard />
    </div>
  )
}
