import { useState, useEffect, useRef } from "react";
import Icon from "./Icon";
import { useLanguage } from "../hooks/useLanguage";

// ── Scroll Reveal: makes .reveal elements visible when they enter viewport ──
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    // Small delay so DOM is ready
    const t = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    }, 100);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, []);
}

// ── Mesh blob background for app shell ──
function MeshLayer({ variant = "light" }) {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      background: variant === "dark"
        ? "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(124,77,255,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(240,80,168,0.05) 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 60% 90%, rgba(0,201,180,0.04) 0%, transparent 55%)"
        : "radial-gradient(ellipse 70% 55% at 10% 20%, rgba(124,77,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 90% 15%, rgba(240,80,168,0.05) 0%, transparent 50%)",
    }} />
  );
}

// ── Skeleton Card ──
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card" style={{ animation: "cardIn 0.4s var(--spring)" }}>
      <div className="skeleton skeleton-title" style={{ marginBottom: 16, width: "55%" }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton skeleton-text" style={{ marginBottom: 10, width: i === lines - 1 ? "65%" : "100%", animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

// ── App Shell ──
export function AppShell({ page, onNav, user, children }) {
  const { language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cmdTip, setCmdTip] = useState(false);

  const langs = [
    { name:"English", flag:"🇺🇸" }, { name:"Spanish", flag:"🇪🇸" },
    { name:"French", flag:"🇫🇷" }, { name:"German", flag:"🇩🇪" },
    { name:"Japanese", flag:"🇯🇵" }, { name:"Arabic", flag:"🇸🇦" },
    { name:"Hindi", flag:"🇮🇳" }, { name:"Portuguese", flag:"🇧🇷" },
    { name:"Chinese", flag:"🇨🇳" }, { name:"Italian", flag:"🇮🇹" },
    { name:"Korean", flag:"🇰🇷" },
  ];
  const currentLang = langs.find(l => l.name === language) || langs[0];

  // Simulate page load skeleton
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 580);
    return () => clearTimeout(t);
  }, [page]);

  const links = [
    { id:"dashboard",      label:"Dashboard",      emoji:"🏠" },
    { id:"brand-identity", label:"Brand Identity", emoji:"🎨" },
    { id:"content-copy",   label:"Content & Copy", emoji:"✍️" },
    { id:"voice-style",    label:"Voice & Style",  emoji:"🎙️" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)", position:"relative" }}>
      <MeshLayer />

      {/* ── SIDEBAR ── */}
      <aside className="sidebar" style={{ zIndex: 50 }}>
        {/* Logo */}
        <div style={{ padding:"28px 24px 20px", borderBottom:"1.5px solid var(--border)" }}>
          <div
            onClick={() => onNav("landing")}
            style={{ fontFamily:"Fredoka One", fontSize:22, color:"var(--violet)", cursor:"pointer", display:"flex", alignItems:"center", gap:8, transition:"opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            ✨ BrandCraft
          </div>
          <div style={{ fontSize:11, color:"var(--text3)", fontWeight:600, marginTop:4, letterSpacing:"0.5px" }}>Brand Story Studio</div>
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:"16px 0" }}>
          {links.map((l, i) => (
            <div
              key={l.id}
              className={`sidebar-link ${page === l.id ? "active" : ""}`}
              onClick={() => onNav(l.id)}
              style={{ animationDelay:`${i * 0.05}s`, animation:"fadeSlideUp 0.4s var(--spring) both" }}
            >
              <span style={{ fontSize:17, transition:"transform 0.2s var(--spring)", transform: page === l.id ? "scale(1.15)" : "scale(1)" }}>{l.emoji}</span>
              <span>{l.label}</span>
              {page === l.id && (
                <div style={{ marginLeft:"auto", width:7, height:7, borderRadius:"50%", background:"var(--violet)", boxShadow:"0 0 8px var(--violet-glow)", animation:"pulseBeat 2s infinite" }} />
              )}
            </div>
          ))}
        </nav>

        {/* Bottom controls */}
        <div style={{ padding:"16px", borderTop:"1.5px solid var(--border)", display:"flex", flexDirection:"column", gap:10 }}>
          {/* ⌘K tip */}
          <div
            style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"9px 12px", borderRadius:12,
              background:"rgba(124,77,255,0.05)",
              border:"1px solid var(--border)",
              fontSize:12, color:"var(--text3)", fontWeight:600, cursor:"default",
            }}
          >
            <span>⌘K</span>
            <span style={{ flex:1 }}>Command palette</span>
            <kbd style={{ background:"rgba(124,77,255,0.08)", border:"1px solid var(--border)", borderRadius:5, padding:"1px 5px", fontSize:10, color:"var(--violet)", fontWeight:800 }}>K</kbd>
          </div>

          {/* Language picker */}
          <div style={{ position:"relative" }}>
            <div
              onClick={() => setLangOpen(!langOpen)}
              style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"10px 13px", borderRadius:12, cursor:"pointer",
                background:"rgba(255,252,255,0.8)", border:"1.5px solid var(--border)",
                fontSize:13, fontWeight:600, color:"var(--text)",
                transition:"all 0.2s var(--spring)",
                boxShadow:"var(--shadow-xs)",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="var(--violet)"; e.currentTarget.style.boxShadow="var(--shadow-sm)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.boxShadow="var(--shadow-xs)"; }}
            >
              <span style={{ fontSize:15 }}>{currentLang.flag}</span>
              <span style={{ flex:1 }}>{language}</span>
              <span style={{ fontSize:10, transition:"transform 0.2s", transform: langOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
            </div>
            {langOpen && (
              <div style={{
                position:"absolute", bottom:"100%", left:0, right:0, marginBottom:6,
                background:"rgba(255,253,255,0.97)", border:"1.5px solid var(--border)",
                borderRadius:14, zIndex:200,
                boxShadow:"var(--shadow-lg)",
                maxHeight:200, overflowY:"auto",
                animation:"panelIn 0.22s var(--spring)",
                backdropFilter:"blur(20px)",
              }}>
                {langs.map(l => (
                  <div
                    key={l.name}
                    onClick={() => { setLanguage(l.name); setLangOpen(false); }}
                    style={{
                      display:"flex", alignItems:"center", gap:8, padding:"9px 14px", cursor:"pointer",
                      fontSize:13, fontWeight:600, fontFamily:"Nunito",
                      color: language===l.name ? "var(--violet)" : "var(--text)",
                      background: language===l.name ? "var(--violet-soft)" : "transparent",
                      transition:"all 0.15s",
                    }}
                    onMouseEnter={e => { if(language!==l.name) e.currentTarget.style.background="rgba(124,77,255,0.04)"; }}
                    onMouseLeave={e => { if(language!==l.name) e.currentTarget.style.background="transparent"; }}
                  >
                    <span style={{ fontSize:14 }}>{l.flag}</span>
                    <span>{l.name}</span>
                    {language===l.name && <span style={{ marginLeft:"auto", color:"var(--violet)", fontSize:12 }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User */}
          <div
            onClick={() => onNav("settings")}
            style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
              borderRadius:14, cursor:"pointer", transition:"all 0.22s var(--spring)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="var(--violet-soft)"; e.currentTarget.style.transform="translateX(2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.transform="translateX(0)"; }}
          >
            <div style={{
              width:36, height:36, borderRadius:"50%", flexShrink:0,
              background:"linear-gradient(135deg, var(--violet), var(--pink))",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, fontWeight:700, color:"#fff", fontFamily:"Fredoka One",
              boxShadow:"0 3px 10px var(--violet-glow)",
            }}>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ overflow:"hidden", flex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--text)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user?.email || "User"}</div>
              <div style={{ fontSize:10, color:"var(--text3)", fontWeight:600 }}>⚙ Settings</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content" style={{ position:"relative", zIndex:1 }}>
        {isLoading ? (
          <div style={{ animation:"fadeIn 0.3s ease" }}>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
              <div className="skeleton skeleton-title" style={{ width:220, height:32 }} />
              <div className="skeleton" style={{ width:80, height:32, borderRadius:99 }} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:24, marginBottom:24 }}>
              <div className="skeleton" style={{ height:260, borderRadius:20 }} />
              <div className="skeleton" style={{ height:260, borderRadius:20 }} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:16 }}>
              {[...Array(8)].map((_,i) => (
                <div key={i} className="skeleton" style={{ height:130, borderRadius:18, animationDelay:`${i*0.06}s` }} />
              ))}
            </div>
          </div>
        ) : (
        <div style={{ animation:"pageIn 0.5s var(--spring)" }}>{children}</div>
        )}
      </main>

      {/* ── MOBILE NAV ── */}
      <nav className="mobile-nav">
        {links.map(l => (
          <div key={l.id} className={`mobile-nav-item ${page===l.id?"active":""}`} onClick={() => onNav(l.id)}>
            <span style={{ fontSize:18 }}>{l.emoji}</span>
            <span>{l.label.split(" ")[0]}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

// ── Dashboard ──
export function Dashboard({ brandProfile, onNav, outputs, favorites, selectedOutputs, onDownloadPDF }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [circleReady, setCircleReady] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);
  useScrollReveal();

  const requiredOutputs = [
    { key:"Brand Names" }, { key:"Color Palette" }, { key:"Font Pairing" },
    { key:"Logo Creator" }, { key:"Ad Copy" }, { key:"Social Bio" }, { key:"Email Templates" },
  ];
  const selectedCount = requiredOutputs.filter(r => selectedOutputs[r.key]).length;
  const allSelected = selectedCount === requiredOutputs.length;

  const score = Math.min(100, 20 + (brandProfile ? 30 : 0) + Math.min(50, outputs.length * 3));
  const scoreColor = score >= 80 ? "var(--teal)" : score >= 50 ? "var(--gold)" : "var(--pink)";
  const circumference = 2 * Math.PI * 70;
  const dashOffset = circumference - (score / 100) * circumference;

  const getScoreMessage = (s) => {
    if (s <= 30) return "🌱 Your story is just beginning…";
    if (s <= 60) return "⚡ The plot is thickening!";
    if (s <= 80) return "🔥 Your brand is heating up!";
    return "🏆 A legendary brand story!";
  };

  const tools = [
    { name:"Brand Names",       id:"brand-identity", emoji:"✨", color:"#7C4DFF" },
    { name:"Logo Creator",      id:"brand-identity", emoji:"🎨", color:"#F050A8" },
    { name:"Color Palette",     id:"brand-identity", emoji:"🌈", color:"#FFAD00" },
    { name:"Font Pairing",      id:"brand-identity", emoji:"🖋️", color:"#00C9B4" },
    { name:"Ad Copy",           id:"content-copy",   emoji:"📣", color:"#4CAF50" },
    { name:"Social Bio",        id:"content-copy",   emoji:"🌟", color:"#FF9800" },
    { name:"Email Builder",     id:"content-copy",   emoji:"💌", color:"#E91E63" },
    { name:"Content Calendar",  id:"content-copy",   emoji:"📅", color:"#9C27B0" },
    { name:"Voice & Tone",      id:"voice-style",    emoji:"🎙️", color:"#7C4DFF" },
    { name:"Sentiment Analysis",id:"voice-style",    emoji:"💡", color:"#00ACC1" },
  ];

  useEffect(() => {
    setTimeout(() => setCircleReady(true), 400);
    let cur = 0;
    const inc = score / 55;
    const timer = setInterval(() => {
      cur += inc;
      if (cur >= score) { setAnimatedScore(score); clearInterval(timer); }
      else setAnimatedScore(Math.floor(cur));
    }, 28);
    return () => clearInterval(timer);
  }, [score]);

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  };

  return (
    <div style={{ maxWidth:1180, margin:"0 auto" }}>

      {/* Chapter Heading */}
      <div className="reveal" style={{ marginBottom:44, display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:"var(--violet)", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:6 }}>📖 Chapter 1</div>
          <h1 style={{ fontSize:"clamp(32px,4vw,48px)", color:"var(--text)", lineHeight:1.1, marginBottom:6 }}>Your Brand Story So Far</h1>
          <p style={{ fontSize:16, color:"var(--text2)", fontStyle:"italic", fontWeight:500 }}>Every great brand starts with a single chapter. Yours is just beginning.</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-ghost btn-sm" onClick={() => onNav("onboarding")}>📝 Edit Profile</button>
          <button className="btn-primary btn-sm" onClick={() => onNav("brand-identity")}>🎨 Build Brand</button>
        </div>
      </div>

      {/* Top grid: score + brand card */}
      <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:24, marginBottom:28 }}>
        {/* Score ring */}
        <div className="glass-card reveal reveal-d1" style={{ padding:28, display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
          <div style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
            Story Progress <span style={{ animation:"pulseBeat 2s infinite", display:"inline-block" }}>📊</span>
          </div>
          <svg width="170" height="170" viewBox="0 0 170 170" style={{ marginBottom:16, overflow:"visible" }}>
            {/* Glow filter */}
            <defs>
              <filter id="glowFilter">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {/* Track */}
            <circle cx="85" cy="85" r="70" fill="none" stroke="rgba(124,77,255,0.1)" strokeWidth="8"/>
            {/* Animated fill */}
            <circle
              cx="85" cy="85" r="70" fill="none"
              stroke={scoreColor} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circleReady ? dashOffset : circumference}
              strokeLinecap="round"
              transform="rotate(-90 85 85)"
              filter="url(#glowFilter)"
              style={{ transition: circleReady ? "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" : "none" }}
            />
            {/* Score number */}
            <text x="85" y="79" textAnchor="middle" fill={scoreColor} fontSize="44" fontFamily="Fredoka One" fontWeight="400">
              {animatedScore}
            </text>
            <text x="85" y="99" textAnchor="middle" fill="var(--text3)" fontSize="13" fontFamily="Nunito" fontWeight="600">/100</text>
          </svg>
          {/* Progress mini-bar */}
          <div className="progress-bar" style={{ width:"100%", marginBottom:14 }}>
            <div className="progress-fill" style={{ width:`${score}%` }} />
          </div>
          <div style={{ fontSize:14, color:"var(--text2)", textAlign:"center", lineHeight:1.5, fontWeight:600 }}>
            {getScoreMessage(score)}
          </div>
        </div>

        {/* Brand profile card */}
        <div className="glass-card reveal reveal-d2" style={{ padding:28, position:"relative" }}>
          <div style={{ fontSize:20, fontWeight:400, color:"var(--text)", marginBottom:20, display:"flex", alignItems:"center", gap:8 }}>
            Meet Your Brand 🧡
          </div>
          {brandProfile ? (
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {[
                { key:"Business", value:brandProfile.businessDo, color:"#7C4DFF" },
                { key:"Industry", value:brandProfile.industry, color:"#F050A8" },
                { key:"Stage", value:brandProfile.businessStage, color:"#00C9B4" },
                { key:"Target Age", value:brandProfile.targetAge?.join(", "), color:"#4CAF50" },
                { key:"Gender Focus", value:brandProfile.genderFocus, color:"#FFAD00" },
                { key:"Color Mood", value:brandProfile.colorMood, color:"#9C27B0" },
                { key:"Logo Style", value:brandProfile.logoStyle, color:"#E91E63" },
                { key:"Design Aesthetic", value:brandProfile.designAesthetic, color:"#3F51B5" },
                { key:"Brand Voice", value:brandProfile.brandVoice, color:"#FF9800" },
                { key:"Brand Goals", value:brandProfile.brandGoals?.join(", "), color:"#7C4DFF" },
              ].filter(item => item.value).map((item, i) => (
                <div
                  key={item.key}
                  style={{
                    background:`rgba(${hexToRgb(item.color)},0.09)`,
                    border:`1.5px solid rgba(${hexToRgb(item.color)},0.2)`,
                    borderRadius:14, padding:"10px 14px",
                    minWidth:110, textAlign:"center",
                    animation:"cardIn 0.5s var(--spring) both",
                    animationDelay:`${i * 0.05}s`,
                    transition:"transform 0.2s var(--spring), box-shadow 0.2s",
                    cursor:"default",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px) scale(1.03)"; e.currentTarget.style.boxShadow=`0 8px 20px rgba(${hexToRgb(item.color)},0.18)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0) scale(1)"; e.currentTarget.style.boxShadow="none"; }}
                >
                  <div style={{ fontSize:10, color:"var(--text3)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:4 }}>{item.key}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", lineHeight:1.3 }}>{item.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"32px 20px" }}>
              <div style={{ fontSize:52, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>📭</div>
              <div style={{ fontSize:20, color:"var(--text)", marginBottom:8 }}>No story yet!</div>
              <div style={{ fontSize:14, color:"var(--text2)", marginBottom:22, fontWeight:500 }}>Let's build your brand profile</div>
              <button className="btn-primary" onClick={() => onNav("onboarding")}>Start Your Story ✨</button>
            </div>
          )}
        </div>
      </div>

      {/* Selection Progress — only when user has selections */}
      {selectedCount > 0 && (
        <div className="reveal" style={{
          background:"linear-gradient(135deg, rgba(0,201,180,0.08), rgba(124,77,255,0.06))",
          border:"1.5px solid rgba(0,201,180,0.25)",
          borderRadius:20, padding:24, marginBottom:24,
          animation:"cardIn 0.5s var(--spring)",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:"var(--text)", marginBottom:3 }}>📋 Brand Selections</div>
              <div style={{ fontSize:13, color:"var(--text2)", fontWeight:500 }}>{selectedCount} of {requiredOutputs.length} confirmed</div>
            </div>
            {/* Conic progress ring */}
            <div style={{
              width:52, height:52, borderRadius:"50%", flexShrink:0,
              background:`conic-gradient(var(--teal) 0deg ${(selectedCount/requiredOutputs.length)*360}deg, rgba(0,201,180,0.12) ${(selectedCount/requiredOutputs.length)*360}deg)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, fontWeight:700, color:"var(--teal)",
            }}>
              {selectedCount}/{requiredOutputs.length}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:8, marginBottom:14 }}>
            {requiredOutputs.map(req => {
              const sel = selectedOutputs[req.key];
              return (
                <div key={req.key} style={{
                  display:"flex", alignItems:"center", gap:7, padding:"9px 12px",
                  background: sel ? "rgba(0,201,180,0.12)" : "rgba(0,0,0,0.03)",
                  borderRadius:10, borderLeft:`3px solid ${sel ? "var(--teal)" : "transparent"}`,
                  transition:"all 0.3s var(--spring)",
                }}>
                  <span style={{ fontSize:14, transition:"transform 0.3s var(--spring)", transform: sel ? "scale(1.2)" : "scale(1)" }}>{sel ? "✅" : "⬜"}</span>
                  <span style={{ fontSize:11, fontWeight:700, color: sel ? "var(--text)" : "var(--text2)" }}>{req.key}</span>
                </div>
              );
            })}
          </div>
          <div className="progress-bar" style={{ marginBottom:14 }}>
            <div className="progress-fill" style={{ width:`${(selectedCount/requiredOutputs.length)*100}%` }} />
          </div>
          <button
            className="btn-primary"
            onClick={allSelected ? onDownloadPDF : () => onNav("brand-identity")}
            style={{ width:"100%" }}
          >
            {allSelected ? "🎉 Download Complete Brand PDF" : "🎨 Continue Building Your Brand →"}
          </button>
        </div>
      )}

      {/* Toolbox */}
      <div className="reveal" style={{ marginBottom:40 }}>
        <div style={{ fontSize:28, color:"var(--text)", marginBottom:18, display:"flex", alignItems:"center", gap:10 }}>
          Your Toolbox 🧰
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(172px,1fr))", gap:16 }}>
          {tools.map((tool, i) => {
            const used = outputs.some(o => o.feature === tool.name);
            const rgb = hexToRgb(tool.color);
            const isHovered = hoveredTool === tool.name;
            return (
              <div
                key={tool.name}
                onClick={() => onNav(tool.id)}
                style={{
                  background: isHovered ? `rgba(${rgb},0.08)` : "rgba(255,252,255,0.85)",
                  backdropFilter:"blur(12px)",
                  border:`1.5px solid ${isHovered ? `rgba(${rgb},0.35)` : "var(--border)"}`,
                  borderRadius:18, padding:"18px 16px",
                  cursor:"pointer",
                  transition:"all 0.28s var(--spring)",
                  transform: isHovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                  boxShadow: isHovered ? `0 14px 36px rgba(${rgb},0.18)` : "var(--shadow-xs)",
                  animation:`cardIn 0.5s var(--spring) both`,
                  animationDelay:`${i * 0.045}s`,
                }}
                onMouseEnter={() => setHoveredTool(tool.name)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <div style={{
                  width:44, height:44, borderRadius:12, marginBottom:12,
                  background:`rgba(${rgb},0.14)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20,
                  transition:"transform 0.28s var(--spring)",
                  transform: isHovered ? "scale(1.18) rotate(5deg)" : "scale(1) rotate(0deg)",
                }}>
                  {tool.emoji}
                </div>
                <div style={{ fontSize:14, color:"var(--text)", marginBottom:8 }}>{tool.name}</div>
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:5,
                  padding:"3px 9px", borderRadius:99,
                  fontSize:11, fontWeight:700,
                  background: used ? "rgba(0,201,180,0.1)" : "rgba(107,91,138,0.08)",
                  color: used ? "var(--teal)" : "var(--text3)",
                  border:`1px solid ${used ? "rgba(0,201,180,0.2)" : "rgba(107,91,138,0.15)"}`,
                }}>
                  {used ? "✓ Used" : "Not used"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent outputs timeline */}
      {outputs.length > 0 && (
        <div className="glass-card reveal" style={{ padding:28, marginBottom:28 }}>
          <div style={{ fontSize:24, color:"var(--text)", marginBottom:22, display:"flex", alignItems:"center", gap:8 }}>Recent Chapters 📚</div>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:5, top:0, bottom:0, width:2, background:"linear-gradient(180deg, var(--violet), var(--pink))", borderRadius:1, opacity:0.2 }} />
            {outputs.slice(-6).reverse().map((output, i) => (
              <div key={i} style={{
                display:"flex", gap:20, paddingLeft:24, paddingBottom:20, position:"relative",
                animation:"cardIn 0.5s var(--spring) both",
                animationDelay:`${i * 0.07}s`,
              }}>
                <div style={{
                  position:"absolute", left:0, top:6,
                  width:12, height:12, borderRadius:"50%",
                  background:"linear-gradient(135deg, var(--violet), var(--pink))",
                  boxShadow:"0 0 8px var(--violet-glow)",
                }} />
                <div style={{ flex:1, background:"rgba(124,77,255,0.03)", borderRadius:12, padding:"12px 14px", border:"1px solid var(--border)" }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:3 }}>{output.feature}</div>
                  <div style={{ fontSize:11, color:"var(--text3)", marginBottom:6, fontWeight:600 }}>{new Date(output.time).toLocaleString()}</div>
                  <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{output.preview}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="reveal" style={{ display:"flex", gap:12, flexWrap:"wrap", paddingBottom:40 }}>
        <button className="btn-primary" onClick={() => onNav("content-copy")}>✨ Generate Content</button>
        <button className="btn-ghost" onClick={() => onNav("onboarding")}>📝 Update Profile</button>
        <button className="btn-ghost" onClick={() => onNav("brand-identity")}>🎨 Brand Identity</button>
      </div>
    </div>
  );
}
