import { useState, useEffect } from "react";
import LiquidGlass from "./LiquidGlass";

export default function TopBar({ page, theme = "dark", onToggleTheme }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <LiquidGlass as="header" variant="regular" className="app-navbar" padding="0" style={{
      height: 98,
      display: "flex", alignItems: "center", padding: "0 34px", gap: 26,
      flexShrink: 0,
    }}>
      <div className="topbar-left">
        <div className="topbar-live" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "rgba(48,179,128,.16)", border: "1px solid rgba(93,220,170,.38)", borderRadius: 999 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#62e49d", display: "inline-block", boxShadow: "0 0 8px #4ade80" }} />
          <span style={{ fontSize: 13, color: "#72e9ae", fontWeight: 600 }}>All Systems Live</span>
        </div>
        <div className="topbar-search" style={{ width: 390, display: "flex", alignItems: "center", gap: 12, padding: "13px 17px", color: "#7185a8", background: "rgba(8,18,42,.52)", border: "1px solid rgba(144,175,233,.2)", borderRadius: 10, fontSize: 14 }}>
          <span style={{ fontSize: 19 }}>⌕</span><span>Search systems, logs, alerts...</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-date" style={{ padding: "9px 12px", color: "#94a9ca", fontSize: 13, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
          {time.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <button
          className="topbar-theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          <span aria-hidden="true">{theme === "light" ? "◐" : "☼"}</span>
          <span>{theme === "light" ? "Dark" : "Light"}</span>
        </button>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer",
        }}>AT</div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </LiquidGlass>
  );
}
