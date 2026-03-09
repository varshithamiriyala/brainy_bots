import { useState, useRef, useEffect } from "react";
import { callAI } from "../utils/api";
import Icon from "./Icon";

const starterChips = [
  "Write my brand mission",
  "What should I post?",
  "Review my brand",
  "Write my tagline",
  "How to position brand?",
  "Analyse my competitors",
];

export default function AIChatWidget({ brandProfile }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  const send = async (text) => {
    if (!text.trim() || streaming) return;
    const userMsg = { role: "user", content: text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setStreaming(true);
    setStreamText("");

    try {
      let full = "";
      await callAI(
        `You are BrandCraft AI, an expert brand strategist. Brand profile: ${JSON.stringify(brandProfile || {})}. Help with branding, strategy, naming, positioning, content and creative direction. Always tie advice to their specific brand. Keep responses concise and actionable.`,
        text,
        (t) => { full = t; setStreamText(t); }
      );
      setMessages(m => [...m, { role: "assistant", content: full }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    }
    setStreaming(false);
    setStreamText("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position: "fixed", bottom: 24, right: 24, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), #7C3AED)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, animation: "pulse-glow 3s ease-in-out infinite", boxShadow: "0 4px 20px rgba(78,205,196,0.4)" }}
        title="Ask BrandCraft AI"
      >
        {open ? <Icon name="x" size={22} color="#fff" /> : <Icon name="sparkle" size={22} color="#fff" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div style={{ position: "fixed", bottom: 90, right: 24, width: 380, height: 520, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, display: "flex", flexDirection: "column", zIndex: 999, boxShadow: "0 20px 60px rgba(0,0,0,0.5)", animation: "chatSlideUp 0.3s ease" }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="sparkle" size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14 }}>BrandCraft AI</div>
              <div style={{ fontSize: 11, color: "var(--teal)" }}>● Online</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text2)", cursor: "pointer" }}>
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
            {messages.length === 0 ? (
              <div>
                <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 14, lineHeight: 1.6 }}>
                  Hi! I'm your AI brand strategist. Ask me anything about building your brand. 👋
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {starterChips.map(c => (
                    <span key={c} className="chip" onClick={() => send(c)} style={{ cursor: "pointer" }}>{c}</span>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 14, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "85%", padding: "10px 14px",
                    borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    background: m.role === "user" ? "linear-gradient(135deg, var(--teal), #3BBDB4)" : "rgba(255,255,255,0.05)",
                    border: m.role === "user" ? "none" : "1px solid var(--border)",
                    fontSize: 13, lineHeight: 1.6,
                    color: m.role === "user" ? "#080B14" : "var(--text)",
                  }}>
                    {m.content}
                  </div>
                </div>
              ))
            )}
            {streaming && streamText && (
              <div style={{ marginBottom: 14, display: "flex", justifyContent: "flex-start" }}>
                <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: "14px 14px 14px 4px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", fontSize: 13, lineHeight: 1.6 }}>
                  {streamText}<span style={{ animation: "blink 1s infinite", color: "var(--teal)" }}>▍</span>
                </div>
              </div>
            )}
            {streaming && !streamText && (
              <div style={{ display: "flex", gap: 4, padding: "10px 14px" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--teal)", animation: `typing 1.2s ${i * 0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              className="input-base"
              placeholder="Ask about your brand..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              style={{ flex: 1, padding: "10px 14px", fontSize: 13 }}
            />
            <button
              onClick={() => send(input)}
              disabled={streaming || !input.trim()}
              style={{ width: 38, height: 38, borderRadius: 10, background: input.trim() ? "var(--teal)" : "var(--border)", border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
            >
              <Icon name="send" size={14} color={input.trim() ? "#080B14" : "var(--text3)"} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
