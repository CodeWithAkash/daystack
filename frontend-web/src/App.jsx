import { useState } from "react"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"

export default function App() {
  const [activeTab, setActiveTab] = useState("today")

  return (
    <>
      {/* Animated mesh background */}
      <div className="mesh-bg">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
      </div>

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <Home activeTab={activeTab} />
      </div>
    </>
  )
}
