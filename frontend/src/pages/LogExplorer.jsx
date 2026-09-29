import { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";
import LiquidGlass from "../components/LiquidGlass";


const LEVEL_CFG = {
  INFO:     { color: "#ebeef1", bg: "#0d1729", border: "#1a2d4a" },
  WARN:     { color: "#fbbf24", bg: "#1a1400", border: "#78490f" },
  ERROR:    { color: "#f87171", bg: "#1a0a0a", border: "#7f1d1d" },
  CRITICAL: { color: "#ff4d4d", bg: "#200000", border: "#9b1c1c" },
};

export default function LogExplorer() {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [live, setLive] = useState(true);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const loadLive = async () => {
    if (!live) return;
    const data = await api.get("/logs/live?count=5");
    setLogs(prev => [...data, ...prev].slice(0, 200));
    if (bottomRef.current && live) {
      // don't auto-scroll if live mode; let user read
    }
  };

  const search = async () => {
    setLoading(true);
    setLive(false);
    const data = await api.post("/logs/search", { query, level });
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLive();
    if (live) {
      const t = setInterval(loadLive, 2000);
      return () => clearInterval(t);
    }
  }, [live]);

  const clearAndResume = () => {
    setQuery("");
    setLevel("all");
    setLogs([]);
    setLive(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "calc(100vh - 120px)" }}>
      {/* Search Bar */}
      <LiquidGlass className="log-search-panel" padding="16px">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <LiquidGlass className="log-search-field" padding="0" style={{ flex: 1, display: "flex", gap: 0, borderRadius: 9 }}>
            <span style={{ padding: "0 12px", display: "flex", alignItems: "center", color: "#9bdcff", fontSize: 18 }}>⌕</span>
            <input
              aria-label="Search logs"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="Search logs... (server, service, message, IP)"
              className="log-search-input"
            />
          </LiquidGlass>
          <select value={level} onChange={e => setLevel(e.target.value)} style={{
            background: "transparent", border: "1px solid #1a2d4a", color: "#94a3b8",
            padding: "10px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer",
          }}>
            <option value="all">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
          <button onClick={search} style={{
            padding: "10px 20px", background: "#1d4ed8", color: "white",
            border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>Search</button>
          <button onClick={clearAndResume} style={{
            padding: "10px 16px", background: live ? "#0d1f0d" : "#1a2d4a",
            color: live ? "#22c55e" : "#64748b",
            border: `1px solid ${live ? "#1a4a1a" : "#2a3f5f"}`, borderRadius: 8, cursor: "pointer", fontSize: 12,
          }}>
            {live ? "● LIVE" : "▶ Resume Live"}
          </button>
        </div>

        <div className="log-summary" style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {[
            { label: "Total Logs", value: logs.length },
            { label: "CRITICAL", value: logs.filter(l => l.level === "CRITICAL").length, color: "#ef4444" },
            { label: "ERROR", value: logs.filter(l => l.level === "ERROR").length, color: "#f87171" },
            { label: "WARN", value: logs.filter(l => l.level === "WARN").length, color: "#fbbf24" },
            { label: "INFO", value: logs.filter(l => l.level === "INFO").length, color: "#60a5fa" },
          ].map(s => (
            <div key={s.label} style={{ fontSize: 11 }}>
              <span style={{ color: "#4a6fa5" }}>{s.label}: </span>
              <span style={{ color: s.color || "#94a3b8", fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </LiquidGlass>

      {/* Log Stream */}
      <LiquidGlass className="log-stream" padding="0" shimmer={false}>
        <LiquidGlass as="div" className="log-table-head" padding="10px 16px" shimmer={false}>
          <span className="log-time-column">TIMESTAMP</span>
          <span className="log-level-column">LEVEL</span>
          <span className="log-server-column">SERVER</span>
          <span className="log-service-column">SERVICE</span>
          <span className="log-message-column">MESSAGE</span>
        </LiquidGlass>

        {loading && <div style={{ padding: 20, color: "#9bdcff", textAlign: "center" }}>Searching...</div>}

        {logs.map((log, i) => {
          const cfg = LEVEL_CFG[log.level] || LEVEL_CFG.INFO;
          return (
            <LiquidGlass as="div" key={log.id || i} className="log-row" padding="7px 16px" shimmer={false} style={{
              background: log.level === "CRITICAL" ? "rgba(100, 15, 25, .2)" : log.level === "ERROR" ? "rgba(90, 20, 20, .16)" : "rgba(5, 17, 35, .22)",
            }}>
              <span className="log-time-column">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className="log-level-column" style={{
                padding: "2px 6px", borderRadius: 4,
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                color: cfg.color, fontSize: 9, fontWeight: 700, textAlign: "center",
              }}>{log.level}</span>
              <span className="log-server-column">
                {log.server}
              </span>
              <span className="log-service-column">{log.service}</span>
              <span className="log-message-column">
                {log.message}
              </span>
            </LiquidGlass>
          );
        })}
        <div ref={bottomRef} />
      </LiquidGlass>
    </div>
  );
}
