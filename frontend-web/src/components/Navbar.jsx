import { useState, useEffect } from "react"

export default function Navbar({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const tabs = [
    { id: "today",     icon: "⚡", label: "Today"     },
    { id: "analytics", icon: "📊", label: "Analytics" },
    { id: "heatmap",   icon: "🔥", label: "Heatmap"   },
    { id: "streaks",   icon: "🏆", label: "Streaks"   },
  ]

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36,
          borderRadius: 10,
          background: "linear-gradient(135deg, #7B5CF0, #3B82F6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
          boxShadow: "0 0 16px rgba(123,92,240,0.4)",
        }}>⚡</div>
        <span style={{
          fontWeight: 800,
          fontSize: 20,
          background: "linear-gradient(135deg, #E0D7FF, #B3CDFF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px",
        }}>DayStack</span>
      </div>

      {/* Pill nav */}
      <div style={{
        display: "flex",
        gap: 4,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 50,
        padding: "4px",
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              transition: "all 0.2s ease",
              background: activeTab === tab.id
                ? "linear-gradient(135deg, #7B5CF0, #3B82F6)"
                : "transparent",
              color: activeTab === tab.id ? "#fff" : "var(--text-secondary)",
              boxShadow: activeTab === tab.id
                ? "0 2px 12px rgba(123,92,240,0.4)"
                : "none",
            }}
          >
            <span>{tab.icon}</span>
            <span style={{ display: window.innerWidth < 600 ? "none" : "inline" }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Date badge */}
      <div style={{
        fontSize: 12,
        color: "var(--text-secondary)",
        fontWeight: 600,
        letterSpacing: "0.5px",
        background: "var(--bg-glass)",
        border: "1px solid var(--border)",
        padding: "6px 12px",
        borderRadius: 50,
      }}>
        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </div>
    </nav>
  )
}