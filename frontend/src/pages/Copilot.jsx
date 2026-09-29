import { useState, useRef, useEffect } from "react";
import { api } from "../utils/api";
import LiquidGlass, { GlassPanel, GlassStatCard, GlassAlert } from "../components/LiquidGlass";


const SUGGESTIONS = [
  "Any issues overnight I should know about?",
  "Why did the website crash yesterday?",
  "What's the database performance like?",
  "Any security threats detected?",
  "What will fail in the next 24 hours?",
  "Show me all server status",
  "How much revenue did we save today?",
  "Fix all critical issues automatically",
];

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex", gap: 12, flexDirection: isUser ? "row-reverse" : "row",
      marginBottom: 20,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: isUser ? "linear-gradient(135deg, #1d4ed8, #6d28d9)" : "linear-gradient(135deg, #0d9488, #1d4ed8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 700, color: "white",
      }}>{isUser ? "OP" : "⬡"}</div>

      <div style={{ maxWidth: "75%" }}>
        <div style={{
          padding: "12px 16px",
          background: isUser ? "#0f1e3a" : "#0d1729",
          border: `1px solid ${isUser ? "#1e3a6a" : "#1a2d4a"}`,
          borderRadius: isUser ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
          fontSize: 13, lineHeight: 1.7, color: "#e2e8f0",
          whiteSpace: "pre-wrap",
        }}>
          {msg.content}
        </div>
        <div style={{ fontSize: 10, color: "#2a3f5f", marginTop: 4, textAlign: isUser ? "right" : "left" }}>
          {new Date(msg.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default function Copilot() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "👋 I'm your **AIOps Copilot**. I have full visibility into your 12-server infrastructure.\n\nAsk me anything — in plain English:\n• \"What crashed overnight?\"\n• \"Any security threats?\"\n• \"Fix the memory leak\"\n• \"What will fail next?\"\n\nOr click a suggestion below to get started.",
    timestamp: new Date().toISOString(),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const q = text || input.trim();
    if (!q || loading) return;
    setInput("");

    const userMsg = { role: "user", content: q, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const data = await api.post("/copilot/chat", { question: q, history });
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        timestamp: data.timestamp,
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Backend connection failed. Make sure the Flask server is running on port 5000.",
        timestamp: new Date().toISOString(),
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", gap: 0 }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d0a1e, #0a1020)",
        border: "1px solid #2e1065", borderRadius: "12px 12px 0 0",
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: "linear-gradient(135deg, #1d4ed8, #6d28d9)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>⬡</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>AIOps Copilot</div>
          <div style={{ fontSize: 11, color: "#6d28d9" }}>Powered by Groq · Llama 3 · Real-time data</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ fontSize: 11, color: "#22c55e" }}>Connected · 12 servers</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflow: "auto", padding: "20px",
        background: "transparent", border: "1px solid #1a2d4a", borderTop: "none", borderBottom: "none",
      }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}

        {loading && (
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #0d9488, #1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "white",
            }}>⬡</div>
            <div style={{
              padding: "12px 16px", background: "transparent", border: "1px solid #1a2d4a",
              borderRadius: "4px 12px 12px 12px",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#3b82f6",
                  animation: `bounce 1.2s ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length < 3 && (
        <div style={{
          padding: "10px 16px", background: "transparent",
          border: "1px solid #1a2d4a", borderTop: "none",
          display: "flex", flexWrap: "wrap", gap: 6,
        }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{
              padding: "5px 12px", fontSize: 11, background: "transparent",
              border: "1px solid #1a2d4a", color: "#64748b", borderRadius: 20,
              cursor: "pointer", transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.color = "#60a5fa"; }}
              onMouseLeave={e => { e.target.style.borderColor = "#1a2d4a"; e.target.style.color = "#64748b"; }}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="copilot-composer-wrap">
        <div className="copilot-composer">
          <div className="copilot-composer-toolbar">
            <span className="copilot-composer-label">Command Copilot</span>
            <span className="copilot-composer-context">Live infrastructure context</span>
          </div>
          <div className="copilot-composer-row">
            <button className="copilot-attach" type="button" aria-label="Attach a log or file">+</button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask about incidents, systems, or next steps..."
            disabled={loading}
            aria-label="Ask AIOps Copilot"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="copilot-send"
            aria-label="Send prompt"
          >
            <span>{loading ? "Working" : "Send"}</span>
            <span className="copilot-send-icon">&#8593;</span>
          </button>
          </div>
          <div className="copilot-composer-footer">
            <span>Press Enter to send</span>
            <span className="copilot-secure-status"><i /> Secure session</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>
    </div>
  );
}
