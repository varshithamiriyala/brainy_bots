import { useState } from "react";
import Icon from "./Icon";
import { useLanguage } from "../hooks/useLanguage";

// ─── App Shell ─────────────────────────────────────────────────────────────────
export function AppShell({ page, onNav, user, children }) {
  const { language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  
  const langs = [
    { name: "English", flag: "🇺🇸" }, { name: "Spanish", flag: "🇪🇸" },
    { name: "French", flag: "🇫🇷" }, { name: "German", flag: "🇩🇪" },
    { name: "Japanese", flag: "🇯🇵" }, { name: "Arabic", flag: "🇸🇦" },
    { name: "Hindi", flag: "🇮🇳" }, { name: "Portuguese", flag: "🇧🇷" },
    { name: "Chinese", flag: "🇨🇳" }, { name: "Italian", flag: "🇮🇹" },
    { name: "Korean", flag: "🇰🇷" },
  ];

  const currentLang = langs.find(l => l.name === language) || langs[0];

  const links = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "brand-identity", label: "Brand Identity", icon: "brand" },
    { id: "content-copy", label: "Content & Copy", icon: "content" },
    { id: "voice-style", label: "Voice & Style", icon: "voice" },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ padding: "0 20px", marginBottom: 32 }}>
          <div style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 800, background: "linear-gradient(135deg, var(--teal), #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BrandCraft</div>
        </div>
        {links.map(l => (
          <div key={l.id} className={`sidebar-link ${page === l.id ? "active" : ""}`} onClick={() => onNav(l.id)}>
            <Icon name={l.icon} size={16} /> {l.label}
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {/* Language Selector */}
          <div style={{ marginBottom: 16, position: "relative" }}>
            <div 
              onClick={() => setLangOpen(!langOpen)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontSize: 12, transition: "all 0.2s" }}
            >
              <span style={{ fontSize: 14 }}>{currentLang.flag}</span>
              <span style={{ flex: 1, color: "var(--text)", fontWeight: 500 }}>{language}</span>
              <Icon name={langOpen ? "chevronUp" : "chevronDown"} size={12} style={{ color: "var(--text3)" }} />
            </div>
            {langOpen && (
              <div style={{ position: "absolute", top: "100%", left: 12, right: 12, marginTop: 8, background: "var(--card)", border: "1px solid rgba(78,205,196,0.3)", borderRadius: 8, zIndex: 1000, boxShadow: "0 10px 30px rgba(0,0,0,0.3)", maxHeight: 240, overflowY: "auto" }}>
                {langs.map(l => (
                  <div
                    key={l.name}
                    onClick={() => {
                      setLanguage(l.name);
                      setLangOpen(false);
                    }}
                    style={{ 
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", 
                      borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", 
                      transition: "all 0.2s",
                      background: language === l.name ? "rgba(78,205,196,0.15)" : "transparent",
                      color: language === l.name ? "var(--teal)" : "var(--text2)",
                      fontWeight: language === l.name ? 600 : 400,
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(78,205,196,0.1)"}
                    onMouseLeave={e => e.currentTarget.style.background = language === l.name ? "rgba(78,205,196,0.15)" : "transparent"}
                  >
                    <span style={{ fontSize: 14 }}>{l.flag}</span>
                    <span>{l.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Settings */}
          <div
            onClick={() => onNav("settings")}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", color: "var(--text2)", fontSize: 13, padding: "10px 0", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--teal)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text2)"}
          >
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#080B14" }}>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email || "User"}</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>Settings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ flex: 1 }}>
        <div className="page-enter">{children}</div>
      </div>

      {/* Mobile Nav */}
      <div className="mobile-nav">
        {links.map(l => (
          <div key={l.id} className={`mobile-nav-item ${page === l.id ? "active" : ""}`} onClick={() => onNav(l.id)}>
            <Icon name={l.icon} size={18} /><span>{l.label.split(" ")[0]}</span>
          </div>
        ))}
        <div className={`mobile-nav-item ${page === "settings" ? "active" : ""}`} onClick={() => onNav("settings")}>
          <Icon name="settings" size={18} /><span>Settings</span>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export function Dashboard({ brandProfile, onNav, outputs, favorites }) {
  const score = Math.min(100, 20 + (brandProfile ? 30 : 0) + Math.min(50, outputs.length * 3));
  const scoreColor = score >= 80 ? "#4ECDC4" : score >= 50 ? "#FFC107" : "#FF6B6B";
  const circumference = 2 * Math.PI * 70;
  const dashOffset = circumference - (score / 100) * circumference;

  const tools = [
    { name: "Brand Names", id: "brand-identity", icon: "zap" },
    { name: "Logo Creator", id: "brand-identity", icon: "image" },
    { name: "Color Palette", id: "brand-identity", icon: "palette" },
    { name: "Font Pairing", id: "brand-identity", icon: "type" },
    { name: "Ad Copy", id: "content-copy", icon: "mail" },
    { name: "Social Bio", id: "content-copy", icon: "user" },
    { name: "Email Builder", id: "content-copy", icon: "mail" },
    { name: "Content Calendar", id: "content-copy", icon: "calendar" },
    { name: "Voice & Tone", id: "voice-style", icon: "voice" },
    { name: "Sentiment Analysis", id: "voice-style", icon: "activity" },
  ];

  return (
    <div style={{ maxWidth: 1000 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Dashboard</h1>
      <p style={{ color: "var(--text2)", marginBottom: 32 }}>Your brand at a glance.</p>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, marginBottom: 24 }}>
        {/* Score Gauge */}
        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 28 }}>
          <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16, fontWeight: 500 }}>Brand Score</div>
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <circle cx="80" cy="80" r="70" fill="none" stroke={scoreColor} strokeWidth="10"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              strokeLinecap="round" transform="rotate(-90 80 80)"
              style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" }} />
            <text x="80" y="80" textAnchor="middle" dominantBaseline="central" fill={scoreColor} fontSize="36" fontFamily="Syne" fontWeight="800">{score}</text>
            <text x="80" y="104" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="11" fontFamily="DM Sans">/100</text>
          </svg>
          <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", marginTop: 8 }}>
            {score >= 80 ? "🔥 Excellent brand health" : score >= 50 ? "⚡ Good progress" : "🚀 Just getting started"}
          </div>
        </div>

        {/* Brand Profile Summary */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>Brand Profile</div>
            <button className="btn-ghost btn-sm" onClick={() => onNav("onboarding")}>
              <Icon name="edit" size={13} /> Edit
            </button>
          </div>
          {brandProfile ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["Industry", brandProfile.industry],
                ["Stage", brandProfile.stage],
                ["Voice", brandProfile.voice],
                ["Color Mood", brandProfile.colorMood],
                ["Aesthetic", brandProfile.aesthetic],
                ["Goals", brandProfile.goals?.join(", ")],
              ].map(([k, v]) => v ? (
                <div key={k}>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                </div>
              ) : null)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ color: "var(--text2)", marginBottom: 14, fontSize: 14 }}>No brand profile yet.</p>
              <button className="btn-primary btn-sm" onClick={() => onNav("onboarding")}>Create Profile</button>
            </div>
          )}
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "Syne", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Tools</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {tools.map(t => {
            const used = outputs.some(o => o.feature === t.name);
            return (
              <div key={t.name} className="card" style={{ cursor: "pointer", padding: 16 }} onClick={() => onNav(t.id)}>
                <div style={{ color: used ? "var(--teal)" : "var(--text3)", marginBottom: 8 }}><Icon name={t.icon} size={18} /></div>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: used ? "var(--teal)" : "var(--text3)" }}>{used ? "✓ Used" : "Not used"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {outputs.length > 0 && (
        <div className="card">
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Recent Activity</div>
          {outputs.slice(-8).reverse().map((o, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < Math.min(7, outputs.length - 1) ? "1px solid var(--border)" : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{o.feature}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{new Date(o.time).toLocaleString()}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.preview}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <button className="btn-primary btn-sm" onClick={() => onNav("content-copy")}>Generate New Content</button>
        <button className="btn-ghost btn-sm" onClick={() => onNav("onboarding")}>Update Brand Profile</button>
        <button className="btn-ghost btn-sm" onClick={() => onNav("brand-identity")}>Build Brand Identity</button>
      </div>
    </div>
  );
}
