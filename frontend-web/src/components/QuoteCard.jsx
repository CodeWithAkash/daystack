import { useState, useEffect } from "react"
import api from "../api/api"

export default function QuoteCard() {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchQuote = async (random = false) => {
    try {
      const url = random ? "/api/quotes/random" : "/api/quotes/today"
      const res = await api.get(url)
      setQuote(res.data)
    } catch {
      setQuote({ text: "Progress, not perfection.", author: "Unknown" })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchQuote() }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchQuote(true)
  }

  return (
    <div className="glass-card animate-fade-in" style={{
      padding: "28px 32px",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, rgba(123,92,240,0.15), rgba(59,130,246,0.10))",
      border: "1px solid rgba(123,92,240,0.25)",
    }}>
      {/* Decorative quote marks */}
      <div style={{
        position: "absolute", top: 12, left: 20,
        fontSize: 80, lineHeight: 1,
        color: "rgba(123,92,240,0.15)",
        fontFamily: "Georgia, serif",
        pointerEvents: "none",
        fontWeight: 900,
      }}>"</div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 16,
        }}>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: "var(--accent-purple)",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}>✨ Daily Spark</span>
          <button onClick={handleRefresh} style={{
            background: "rgba(123,92,240,0.15)",
            border: "1px solid rgba(123,92,240,0.3)",
            color: "var(--accent-purple)",
            borderRadius: 50,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            transition: "all 0.2s",
            transform: refreshing ? "rotate(180deg)" : "rotate(0deg)",
          }}>↺ New</button>
        </div>

        {loading ? (
          <div>
            <div className="skeleton" style={{ height: 24, width: "80%", marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 24, width: "60%", marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 14, width: "30%" }} />
          </div>
        ) : (
          <div className="animate-fade-scale" key={quote?.text}>
            <p style={{
              fontSize: 20,
              fontWeight: 600,
              lineHeight: 1.5,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}>
              {quote?.text}
            </p>
            <p style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}>— {quote?.author}</p>
          </div>
        )}
      </div>
    </div>
  )
}