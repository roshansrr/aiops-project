import { useState, useEffect } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "../utils/api";
import LiquidGlass from "../components/LiquidGlass";


const SEVERITY_CONFIG = {
  CRITICAL: { color: "#6577ff", bg: "rgba(255, 74, 100, .12)", border: "rgba(255, 101, 122, .42)" },
  HIGH: { color: "#ff9b62", bg: "rgba(255, 139, 82, .12)", border: "rgba(255, 155, 98, .42)" },
  MEDIUM: { color: "#ffd166", bg: "rgba(255, 209, 102, .12)", border: "rgba(255, 209, 102, .42)" },
  LOW: { color: "#6ee7ae", bg: "rgba(79, 220, 157, .12)", border: "rgba(110, 231, 174, .4)" },
};

export default function Anomalies() {
  const [anomalies, setAnomalies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fixing, setFixing] = useState(null);
  const [fixResult, setFixResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const load = async () => {
    try {
      const data = await api.get("/anomalies");
      setAnomalies(data);
      if (data.length > 0 && !selected) setSelected(data[0]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, []);

  const handleFix = async (anomaly) => {
    setFixing(anomaly.id);
    setFixResult(null);
    const result = await api.post("/remediate", { issue_type: anomaly.issue_type });
    setFixResult(result);
    setFixing(null);
  };

  const filtered = filter === "ALL" ? anomalies : anomalies.filter(a => a.severity === filter);
  const sc = selected ? SEVERITY_CONFIG[selected.severity] || SEVERITY_CONFIG.LOW : null;

  const radarData = selected ? [
    { metric: "CPU", value: selected.log.cpu_usage },
    { metric: "Memory", value: selected.log.memory_usage },
    { metric: "Disk", value: selected.log.disk_usage },
    { metric: "Errors", value: Math.min(100, selected.log.error_count * 2) },
    { metric: "Response", value: Math.min(100, selected.log.response_time_ms / 100) },
    { metric: "Security", value: Math.min(100, selected.log.failed_logins * 5) },
  ] : [];

  return (
    <div className="anomalies-page" style={{ display: "flex", gap: 20, height: "calc(100vh - 120px)" }}>
      {/* Left: Anomaly List */}
      <div style={{ width: 380, display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
        {/* Filter tabs */}
        <LiquidGlass className="anomaly-filter-bar" padding="6px">
          {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map(f => (
            <LiquidGlass
              as="button"
              key={f}
              onClick={() => setFilter(f)}
              className={`anomaly-filter${filter === f ? " is-active" : ""}`}
              padding="7px 4px"
              style={{
                width: "100%",
                minWidth: 0,
                minHeight: 36,
                borderRadius: 7,
                borderColor: filter === f ? (SEVERITY_CONFIG[f]?.border || "rgba(125, 211, 252, .45)") : "rgba(156, 196, 235, .12)",
                color: filter === f ? (SEVERITY_CONFIG[f]?.color || "#9fe3ff") : "#a9d9f6",
                background: filter === f ? (SEVERITY_CONFIG[f]?.bg || "rgba(56, 189, 248, .12)") : "rgba(8, 21, 42, .4)",
                fontSize: 9,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >{f}</LiquidGlass>
          ))}
        </LiquidGlass>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {loading && <div style={{ color: "#9acbf0", textAlign: "center", marginTop: 40 }}>Analyzing logs...</div>}
          {!loading && filtered.length === 0 && (
            <div style={{ color: "#9acbf0", textAlign: "center", marginTop: 40 }}>
              <div style={{ marginTop: 8 }}>No anomalies detected</div>
            </div>
          )}
          {filtered.map(a => {
            const cfg = SEVERITY_CONFIG[a.severity] || SEVERITY_CONFIG.LOW;
            return (
              <LiquidGlass
                as="button"
                key={a.id}
                onClick={() => setSelected(a)}
                className={`anomaly-item${selected?.id === a.id ? " is-selected" : ""}`}
                padding="14px 16px"
                style={{
                  width: "100%",
                  borderRadius: 10,
                  borderLeft: `4px solid ${cfg.color}`,
                  borderTopColor: selected?.id === a.id ? "rgba(151, 211, 255, .42)" : "rgba(155, 196, 255, .18)",
                  borderRightColor: selected?.id === a.id ? "rgba(151, 211, 255, .3)" : "rgba(155, 196, 255, .18)",
                  borderBottomColor: selected?.id === a.id ? "rgba(151, 211, 255, .3)" : "rgba(155, 196, 255, .18)",
                  background: selected?.id === a.id ? "rgba(12, 37, 68, .9)" : "rgba(7, 18, 37, .78)",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>
                    {a.issue_type.replace(/_/g, " ")}
                  </span>
                  <span style={{
                    marginLeft: "auto", fontSize: 9, padding: "2px 6px",
                    background: cfg.bg, border: `1px solid ${cfg.border}`,
                    color: cfg.color, borderRadius: 4, fontWeight: 700,
                  }}>{a.severity}</span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    { l: "CPU", v: `${a.log.cpu_usage}%` },
                    { l: "Memory", v: `${a.log.memory_usage}%` },
                    { l: "Score", v: a.anomaly_score },
                  ].map(m => (
                    <div key={m.l}>
                      <div style={{ fontSize: 9, color: "#8fc7ed" }}>{m.l}</div>
                      <div style={{ fontSize: 12, color: "#c9eaff", fontWeight: 600 }}>{m.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: "#8fc7ed", marginTop: 6 }}>{a.log.server}</div>
              </LiquidGlass>
            );
          })}
        </div>
      </div>

      {/* Right: Detail Panel */}
      {selected && sc && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          {/* Header */}
          <LiquidGlass className="anomaly-detail" padding="20px" style={{
            borderColor: sc.border,
            borderTop: `3px solid ${sc.color}`,
            borderRadius: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: sc.color }}>
                      {selected.issue_type.replace(/_/g, " ")}
                    </div>
                    <div style={{ fontSize: 12, color: "#a9d9f6" }}>{selected.log.server} · {selected.log.service}</div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#9acbf0" }}>Confidence</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: sc.color }}>{selected.confidence}%</div>
              </div>
            </div>

            <div className="anomaly-recommendation" style={{ marginTop: 12, padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#9acbf0", marginBottom: 4 }}>RECOMMENDED ACTION</div>
              <div style={{ fontSize: 13, color: "#c9eaff" }}>{selected.recommended_action}</div>
            </div>

            {selected.auto_fixable && (
              <button
                onClick={() => handleFix(selected)}
                disabled={!!fixing}
                style={{
                  marginTop: 14, padding: "10px 24px", fontSize: 13, fontWeight: 700,
                  background: fixing ? "#1a2d4a" : "linear-gradient(135deg, #087ca8, #1763b5)",
                  color: fixing ? "#9acbf0" : "white", border: "none", borderRadius: 8,
                  cursor: fixing ? "not-allowed" : "pointer", width: "100%",
                }}
              >
                {fixing ? "Applying auto-fix..." : "Apply auto-fix"}
              </button>
            )}
          </LiquidGlass>

          {/* Fix Result */}
          {fixResult && (
            <LiquidGlass variant="success" className="anomaly-fix-result" padding="20px">
              <div style={{ fontSize: 14, fontWeight: 700, color: "#86efac", marginBottom: 12 }}>
                Fix applied successfully
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {fixResult.steps?.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#b8f5d1" }}>
                    <span style={{ color: "#86efac" }}>Done</span> {step}
                  </div>
                ))}
              </div>
              {fixResult.freed_gb && (
                <div style={{ marginTop: 10, padding: 8, background: "rgba(34, 197, 94, .1)", borderRadius: 6 }}>
                  <span style={{ fontSize: 12, color: "#b8f5d1" }}>Freed {fixResult.freed_gb}GB of disk space</span>
                </div>
              )}
            </LiquidGlass>
          )}

          {/* Radar Chart */}
          <LiquidGlass className="anomaly-chart-panel" padding="20px">
            <div style={{ fontSize: 13, fontWeight: 600, color: "#c9eaff", marginBottom: 12 }}>
              Anomaly Signature — Metric Fingerprint
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1a2d4a" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "#a9d9f6", fontSize: 11 }} />
                <Radar dataKey="value" stroke={sc.color} fill={sc.color} fillOpacity={0.15} strokeWidth={2} />
                <Tooltip contentStyle={{ background: "#081629", border: "1px solid #31577b", borderRadius: 8, color: "#d9f1ff" }} />
              </RadarChart>
            </ResponsiveContainer>
          </LiquidGlass>

          {/* Raw Metrics */}
          <LiquidGlass className="anomaly-metrics-panel" padding="20px">
            <div style={{ fontSize: 13, fontWeight: 600, color: "#c9eaff", marginBottom: 12 }}>Raw metrics at detection time</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { l: "CPU", v: `${selected.log.cpu_usage}%`, c: selected.log.cpu_usage > 85 ? "#ef4444" : "#3b82f6" },
                { l: "Memory", v: `${selected.log.memory_usage}%`, c: selected.log.memory_usage > 85 ? "#ef4444" : "#8b5cf6" },
                { l: "Disk", v: `${selected.log.disk_usage}%`, c: selected.log.disk_usage > 90 ? "#ef4444" : "#f59e0b" },
                { l: "Errors", v: selected.log.error_count, c: selected.log.error_count > 20 ? "#ef4444" : "#10b981" },
                { l: "Response", v: `${selected.log.response_time_ms}ms`, c: selected.log.response_time_ms > 2000 ? "#ef4444" : "#06b6d4" },
                { l: "Failed Logins", v: selected.log.failed_logins, c: selected.log.failed_logins > 10 ? "#ef4444" : "#81d4fa" },
              ].map(m => (
                <div key={m.l} className="anomaly-metric" style={{ padding: "10px 12px", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: "#9acbf0" }}>{m.l}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
                </div>
              ))}
            </div>
          </LiquidGlass>
        </div>
      )}
    </div>
  );
}
