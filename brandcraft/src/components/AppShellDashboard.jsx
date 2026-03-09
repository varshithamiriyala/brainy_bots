import { useState, useEffect, useRef } from "react";
import Icon from "./Icon";
import { useLanguage } from "../hooks/useLanguage";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    const t = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    }, 100);
    return () => { clearTimeout(t); observer.disconnect(); };
  }, []);
}

function MeshLayer() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      background: "radial-gradient(ellipse 70% 55% at 10% 20%, rgba(124,77,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 90% 15%, rgba(240,80,168,0.05) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 50% 90%, rgba(0,201,180,0.03) 0%, transparent 55%)",
    }} />
  );
}

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

export function AppShell({ page, onNav, user, children }) {
  const { language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const langs = [
    { name:"English", flag:"🇺🇸" }, { name:"Spanish", flag:"🇪🇸" },
    { name:"French", flag:"🇫🇷" }, { name:"German", flag:"🇩🇪" },
    { name:"Japanese", flag:"🇯🇵" }, { name:"Arabic", flag:"🇸🇦" },
    { name:"Hindi", flag:"🇮🇳" }, { name:"Portuguese", flag:"🇧🇷" },
    { name:"Chinese", flag:"🇨🇳" }, { name:"Italian", flag:"🇮🇹" },
    { name:"Korean", flag:"🇰🇷" },
  ];
  const currentLang = langs.find(l => l.name === language) || langs[0];

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

      {/* SIDEBAR */}
      <aside className="sidebar" style={{ zIndex: 50 }}>
        {/* Logo */}
        <div style={{ padding:"24px 20px 18px", borderBottom:"1.5px solid var(--border)" }}>
          <div
            onClick={() => onNav("landing")}
            style={{ fontFamily:"Fredoka One", fontSize:21, color:"var(--violet)", cursor:"pointer", display:"flex", alignItems:"center", gap:8, transition:"opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            📖 BrandCraft
          </div>
          <div style={{ fontSize:10, color:"var(--text3)", fontWeight:700, marginTop:3, letterSpacing:"0.8px", textTransform:"uppercase" }}>Brand Story Studio</div>
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:"14px 0" }}>
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
        <div style={{ padding:"14px", borderTop:"1.5px solid var(--border)", display:"flex", flexDirection:"column", gap:9 }}>
          {/* ⌘K tip */}
          <div style={{
            display:"flex", alignItems:"center", gap:8,
            padding:"9px 12px", borderRadius:12,
            background:"rgba(124,77,255,0.05)",
            border:"1px solid var(--border)",
            fontSize:12, color:"var(--text3)", fontWeight:600, cursor:"default",
          }}>
            <span style={{ fontSize:14 }}>⌘</span>
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
                transition:"all 0.2s var(--spring)", boxShadow:"var(--shadow-xs)",
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
                borderRadius:14, zIndex:200, boxShadow:"var(--shadow-lg)",
                maxHeight:200, overflowY:"auto",
                animation:"panelIn 0.22s var(--spring)", backdropFilter:"blur(20px)",
              }}>
                {langs.map(l => (
                  <div key={l.name} onClick={() => { setLanguage(l.name); setLangOpen(false); }}
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

      {/* MAIN CONTENT */}
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

      {/* MOBILE NAV */}
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

// ── Dashboard ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "🌅" };
  if (h < 17) return { text: "Good afternoon", emoji: "☀️" };
  return { text: "Good evening", emoji: "🌙" };
}

const toolGroups = [
  {
    label: "Brand Identity",
    id: "brand-identity",
    color: "#7C4DFF",
    tools: [
      { name:"Brand Names", emoji:"✨", color:"#7C4DFF" },
      { name:"Logo Creator", emoji:"🎨", color:"#F050A8" },
      { name:"Color Palette", emoji:"🌈", color:"#FFAD00" },
      { name:"Font Pairing", emoji:"🖋️", color:"#00C9B4" },
    ],
  },
  {
    label: "Content & Copy",
    id: "content-copy",
    color: "#F050A8",
    tools: [
      { name:"Ad Copy", emoji:"📣", color:"#4CAF50" },
      { name:"Social Bio", emoji:"🌟", color:"#FF9800" },
      { name:"Email Builder", emoji:"💌", color:"#E91E63" },
      { name:"Content Calendar", emoji:"📅", color:"#9C27B0" },
    ],
  },
  {
    label: "Voice & Style",
    id: "voice-style",
    color: "#00C9B4",
    tools: [
      { name:"Voice & Tone", emoji:"🎙️", color:"#7C4DFF" },
      { name:"Sentiment Analysis", emoji:"💡", color:"#00ACC1" },
    ],
  },
];

// flat tool list for checking outputs
const allTools = toolGroups.flatMap(g => g.tools.map(t => ({ ...t, id: g.id })));

export function Dashboard({ brandProfile, onNav, outputs, favorites, selectedOutputs, onDownloadPDF }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [circleReady, setCircleReady] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);
  const greeting = getGreeting();
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
    if (s <= 30) return { text: "Your story is just beginning…", emoji: "🌱" };
    if (s <= 60) return { text: "The plot is thickening!", emoji: "⚡" };
    if (s <= 80) return { text: "Your brand is heating up!", emoji: "🔥" };
    return { text: "A legendary brand story!", emoji: "🏆" };
  };
  const scoreMsg = getScoreMessage(score);

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

  const usedCount = allTools.filter(t => outputs.some(o => o.feature === t.name)).length;
  const profileComplete = brandProfile ? Math.min(100, Object.values(brandProfile).filter(Boolean).length * 10) : 0;

  return (
    <div style={{ maxWidth:1180, margin:"0 auto" }}>

      {/* ── HEADER ── */}
      <div className="reveal" style={{ marginBottom:36 }}>
        {/* Greeting row */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:24 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"var(--violet)", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
              <span>📖</span> Chapter 1
            </div>
            <h1 style={{ fontSize:"clamp(28px,3.5vw,42px)", color:"var(--text)", lineHeight:1.1, marginBottom:6, fontFamily:"Fredoka One" }}>
              {greeting.emoji} {greeting.text}, Founder!
            </h1>
            <p style={{ fontSize:15, color:"var(--text2)", fontStyle:"italic", fontWeight:500 }}>
              Every great brand starts with a single chapter. Yours is just beginning.
            </p>
          </div>
          <div style={{ display:"flex", gap:10, flexShrink:0 }}>
            <button className="btn-ghost btn-sm" onClick={() => onNav("onboarding")}>📝 Edit Profile</button>
            <button className="btn-primary btn-sm" onClick={() => onNav("brand-identity")}>🎨 Build Brand</button>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12 }}>
          {[
            { label:"Brand Score", value:`${score}/100`, color:"var(--violet)", emoji:"📊", sub: scoreMsg.emoji + " " + scoreMsg.text },
            { label:"Tools Used", value:`${usedCount}/${allTools.length}`, color:"var(--teal)", emoji:"🛠️", sub:"Keep exploring!" },
            { label:"Selections", value:`${selectedCount}/${requiredOutputs.length}`, color:"var(--gold)", emoji:"✅", sub:"Confirmed assets" },
            { label:"Outputs", value:outputs.length, color:"var(--pink)", emoji:"📝", sub:"Generated so far" },
          ].map((stat, i) => (
            <div key={i} style={{
              background:"rgba(255,253,255,0.8)", backdropFilter:"blur(16px)",
              border:"1.5px solid var(--border)", borderRadius:18, padding:"16px 18px",
              boxShadow:"var(--shadow-xs)",
              transition:"transform 0.22s var(--spring), box-shadow 0.22s",
              animation:`cardIn 0.5s var(--spring) both`,
              animationDelay:`${i * 0.06}s`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="var(--shadow-md)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="var(--shadow-xs)"; }}
            >
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--text3)", fontFamily:"Nunito" }}>{stat.label}</div>
                <span style={{ fontSize:16 }}>{stat.emoji}</span>
              </div>
              <div style={{ fontFamily:"Fredoka One", fontSize:26, color:stat.color, lineHeight:1, marginBottom:4 }}>{stat.value}</div>
              <div style={{ fontSize:11, color:"var(--text3)", fontWeight:600, lineHeight:1.3 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SCORE + BRAND PROFILE ROW ── */}
      <div style={{ display:"grid", gridTemplateColumns:"290px 1fr", gap:20, marginBottom:24 }}>

        {/* Score ring card */}
        <div className="glass-card reveal reveal-d1" style={{ padding:"28px 24px", display:"flex", flexDirection:"column", alignItems:"center" }}>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--text)", marginBottom:18, display:"flex", alignItems:"center", gap:8 }}>
            Story Progress
            <span style={{ animation:"pulseBeat 2s infinite", display:"inline-block" }}>📊</span>
          </div>

          {/* Ring */}
          <div style={{ position:"relative", marginBottom:16 }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ overflow:"visible" }}>
              <defs>
                <filter id="glowFilter">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C4DFF"/>
                  <stop offset="100%" stopColor="#F050A8"/>
                </linearGradient>
              </defs>
              {/* Track */}
              <circle cx="80" cy="80" r="66" fill="none" stroke="rgba(124,77,255,0.1)" strokeWidth="9"/>
              {/* Secondary tick marks */}
              {[0,25,50,75].map(pct => {
                const angle = (pct / 100) * 360 - 90;
                const rad = angle * Math.PI / 180;
                const x1 = 80 + 58 * Math.cos(rad), y1 = 80 + 58 * Math.sin(rad);
                const x2 = 80 + 66 * Math.cos(rad), y2 = 80 + 66 * Math.sin(rad);
                return <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(124,77,255,0.15)" strokeWidth="2" strokeLinecap="round"/>;
              })}
              {/* Fill */}
              <circle
                cx="80" cy="80" r="66" fill="none"
                stroke={scoreColor} strokeWidth="9"
                strokeDasharray={2 * Math.PI * 66}
                strokeDashoffset={circleReady ? (2 * Math.PI * 66) - (score / 100) * (2 * Math.PI * 66) : 2 * Math.PI * 66}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                filter="url(#glowFilter)"
                style={{ transition: circleReady ? "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" : "none" }}
              />
              {/* Score text */}
              <text x="80" y="73" textAnchor="middle" fill={scoreColor} fontSize="40" fontFamily="Fredoka One" fontWeight="400">{animatedScore}</text>
              <text x="80" y="91" textAnchor="middle" fill="var(--text3)" fontSize="12" fontFamily="Nunito" fontWeight="700">/100</text>
              <text x="80" y="107" textAnchor="middle" fontSize="16">{scoreMsg.emoji}</text>
            </svg>
          </div>

          {/* Progress bar */}
          <div className="progress-bar" style={{ width:"100%", marginBottom:12 }}>
            <div className="progress-fill" style={{ width:`${score}%` }} />
          </div>
          <div style={{ fontSize:13, color:"var(--text2)", textAlign:"center", lineHeight:1.5, fontWeight:600 }}>{scoreMsg.text}</div>

          {/* Next step hint */}
          {score < 100 && (
            <div style={{
              marginTop:16, padding:"10px 14px", borderRadius:12,
              background:"rgba(124,77,255,0.06)", border:"1px solid rgba(124,77,255,0.14)",
              fontSize:11, fontWeight:700, color:"var(--violet)", lineHeight:1.4, textAlign:"center", width:"100%",
            }}>
              {!brandProfile ? "💡 Complete your profile to boost your score!" : outputs.length < 5 ? "💡 Generate more outputs to level up!" : "💡 Select your favourite assets to finish!"}
            </div>
          )}
        </div>

        {/* Brand profile card */}
        <div className="glass-card reveal reveal-d2" style={{ padding:"28px 24px", position:"relative", overflow:"hidden" }}>
          {/* Decorative blob */}
          <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,77,255,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div style={{ fontSize:18, fontWeight:400, color:"var(--text)", display:"flex", alignItems:"center", gap:8, fontFamily:"Fredoka One" }}>
              Meet Your Brand 🧡
            </div>
            {brandProfile && (
              <button className="btn-ghost btn-sm" onClick={() => onNav("onboarding")} style={{ fontSize:11 }}>✏️ Edit</button>
            )}
          </div>

          {brandProfile ? (
            <>
              {/* Profile completeness bar */}
              <div style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:11, fontWeight:800, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.6px" }}>Profile completeness</span>
                  <span style={{ fontSize:11, fontWeight:800, color:"var(--violet)" }}>{profileComplete}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${profileComplete}%` }} />
                </div>
              </div>

              <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
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
                  <div key={item.key} style={{
                    background:`rgba(${hexToRgb(item.color)},0.08)`,
                    border:`1.5px solid rgba(${hexToRgb(item.color)},0.18)`,
                    borderRadius:12, padding:"9px 13px",
                    minWidth:100, textAlign:"center",
                    animation:"cardIn 0.5s var(--spring) both",
                    animationDelay:`${i * 0.05}s`,
                    transition:"transform 0.2s var(--spring), box-shadow 0.2s",
                    cursor:"default",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px) scale(1.04)"; e.currentTarget.style.boxShadow=`0 8px 20px rgba(${hexToRgb(item.color)},0.18)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="translateY(0) scale(1)"; e.currentTarget.style.boxShadow="none"; }}
                  >
                    <div style={{ fontSize:9, color:"var(--text3)", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:3 }}>{item.key}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:`rgb(${hexToRgb(item.color)})`, lineHeight:1.3 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"28px 20px" }}>
              <div style={{ fontSize:52, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>📭</div>
              <div style={{ fontSize:20, color:"var(--text)", marginBottom:8, fontFamily:"Fredoka One" }}>No story yet!</div>
              <div style={{ fontSize:14, color:"var(--text2)", marginBottom:22, fontWeight:500, lineHeight:1.5 }}>Complete your brand profile to unlock all AI tools and get a personalised brand score.</div>
              <button className="btn-primary" onClick={() => onNav("onboarding")}>Start Your Story ✨</button>
            </div>
          )}
        </div>
      </div>

      {/* ── SELECTION PROGRESS ── */}
      {selectedCount > 0 && (
        <div className="reveal" style={{
          background:"linear-gradient(135deg, rgba(0,201,180,0.07), rgba(124,77,255,0.05))",
          border:"1.5px solid rgba(0,201,180,0.22)",
          borderRadius:20, padding:"22px 24px", marginBottom:24,
          animation:"cardIn 0.5s var(--spring)",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:3, display:"flex", alignItems:"center", gap:7 }}>
                📋 Brand Selections
                {allSelected && <span style={{ background:"var(--teal)", color:"#fff", fontSize:10, fontWeight:800, padding:"2px 8px", borderRadius:99 }}>COMPLETE!</span>}
              </div>
              <div style={{ fontSize:12, color:"var(--text2)", fontWeight:500 }}>{selectedCount} of {requiredOutputs.length} assets confirmed</div>
            </div>
            <div style={{
              width:52, height:52, borderRadius:"50%", flexShrink:0,
              background:`conic-gradient(var(--teal) 0deg ${(selectedCount/requiredOutputs.length)*360}deg, rgba(0,201,180,0.12) ${(selectedCount/requiredOutputs.length)*360}deg)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, fontWeight:800, color:"var(--teal)",
            }}>
              {selectedCount}/{requiredOutputs.length}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8, marginBottom:14 }}>
            {requiredOutputs.map(req => {
              const sel = selectedOutputs[req.key];
              return (
                <div key={req.key} style={{
                  display:"flex", alignItems:"center", gap:7, padding:"8px 11px",
                  background: sel ? "rgba(0,201,180,0.1)" : "rgba(0,0,0,0.03)",
                  borderRadius:10, borderLeft:`3px solid ${sel ? "var(--teal)" : "transparent"}`,
                  transition:"all 0.3s var(--spring)",
                }}>
                  <span style={{ fontSize:13, transition:"transform 0.3s var(--spring)", transform: sel ? "scale(1.2)" : "scale(1)" }}>{sel ? "✅" : "⬜"}</span>
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

      {/* ── TOOLBOX — GROUPED ── */}
      <div className="reveal" style={{ marginBottom:36 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:12 }}>
          <div style={{ fontFamily:"Fredoka One", fontSize:26, color:"var(--text)", display:"flex", alignItems:"center", gap:10 }}>
            Your Toolbox 🧰
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:"var(--text3)" }}>
            {usedCount}/{allTools.length} tools explored
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {toolGroups.map((group, gi) => (
            <div key={group.id}>
              {/* Group header */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:group.color, boxShadow:`0 0 8px ${group.color}88` }} />
                <span style={{ fontSize:12, fontWeight:800, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"1px", fontFamily:"Nunito" }}>{group.label}</span>
                <div style={{ flex:1, height:1, background:"var(--border)" }} />
                <button
                  onClick={() => onNav(group.id)}
                  style={{ fontSize:11, fontWeight:800, color:group.color, background:`rgba(${hexToRgb(group.color)},0.08)`, border:`1px solid rgba(${hexToRgb(group.color)},0.2)`, borderRadius:99, padding:"4px 12px", cursor:"pointer", fontFamily:"Nunito", transition:"all 0.18s" }}
                  onMouseEnter={e => { e.currentTarget.style.background=`rgba(${hexToRgb(group.color)},0.16)`; }}
                  onMouseLeave={e => { e.currentTarget.style.background=`rgba(${hexToRgb(group.color)},0.08)`; }}
                >
                  Open all →
                </button>
              </div>

              {/* Tool cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 }}>
                {group.tools.map((tool, i) => {
                  const used = outputs.some(o => o.feature === tool.name);
                  const rgb = hexToRgb(tool.color);
                  const isHovered = hoveredTool === tool.name;
                  return (
                    <div
                      key={tool.name}
                      onClick={() => onNav(group.id)}
                      style={{
                        background: isHovered ? `rgba(${rgb},0.09)` : "rgba(255,252,255,0.9)",
                        backdropFilter:"blur(12px)",
                        border:`1.5px solid ${isHovered ? `rgba(${rgb},0.3)` : "var(--border)"}`,
                        borderRadius:16, padding:"16px 14px",
                        cursor:"pointer",
                        transition:"all 0.26s var(--spring)",
                        transform: isHovered ? "translateY(-5px) scale(1.02)" : "translateY(0) scale(1)",
                        boxShadow: isHovered ? `0 12px 32px rgba(${rgb},0.16)` : "var(--shadow-xs)",
                        animation:`cardIn 0.5s var(--spring) both`,
                        animationDelay:`${(gi * 4 + i) * 0.04}s`,
                        position:"relative", overflow:"hidden",
                      }}
                      onMouseEnter={() => setHoveredTool(tool.name)}
                      onMouseLeave={() => setHoveredTool(null)}
                    >
                      {/* Used badge */}
                      {used && (
                        <div style={{ position:"absolute", top:10, right:10, width:8, height:8, borderRadius:"50%", background:"var(--teal)", boxShadow:"0 0 6px rgba(0,201,180,0.5)" }} />
                      )}

                      <div style={{
                        width:40, height:40, borderRadius:11, marginBottom:10,
                        background:`rgba(${rgb},0.13)`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:18,
                        transition:"transform 0.26s var(--spring)",
                        transform: isHovered ? "scale(1.2) rotate(6deg)" : "scale(1) rotate(0deg)",
                      }}>
                        {tool.emoji}
                      </div>
                      <div style={{ fontSize:13, fontWeight:700, color:"var(--text)", marginBottom:7, lineHeight:1.2 }}>{tool.name}</div>
                      <div style={{
                        display:"inline-flex", alignItems:"center", gap:4,
                        padding:"3px 8px", borderRadius:99,
                        fontSize:10, fontWeight:800,
                        background: used ? "rgba(0,201,180,0.1)" : "rgba(107,91,138,0.07)",
                        color: used ? "var(--teal)" : "var(--text3)",
                        border:`1px solid ${used ? "rgba(0,201,180,0.2)" : "rgba(107,91,138,0.12)"}`,
                      }}>
                        {used ? "✓ Used" : "Try it"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RECENT OUTPUTS ── */}
      {outputs.length > 0 && (
        <div className="glass-card reveal" style={{ padding:"26px 28px", marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
            <div style={{ fontFamily:"Fredoka One", fontSize:22, color:"var(--text)", display:"flex", alignItems:"center", gap:8 }}>
              Recent Chapters 📚
            </div>
            <div style={{ fontSize:12, fontWeight:700, color:"var(--text3)" }}>{outputs.length} total</div>
          </div>
          <div style={{ position:"relative" }}>
            {/* Timeline line */}
            <div style={{ position:"absolute", left:5, top:8, bottom:8, width:2, background:"linear-gradient(180deg, var(--violet), var(--pink), rgba(240,80,168,0))", borderRadius:1, opacity:0.25 }} />
            {outputs.slice(-6).reverse().map((output, i) => (
              <div key={i} style={{
                display:"flex", gap:20, paddingLeft:24, paddingBottom:18, position:"relative",
                animation:"cardIn 0.5s var(--spring) both",
                animationDelay:`${i * 0.07}s`,
              }}>
                {/* Timeline dot */}
                <div style={{
                  position:"absolute", left:0, top:8,
                  width:12, height:12, borderRadius:"50%",
                  background:"linear-gradient(135deg, var(--violet), var(--pink))",
                  boxShadow:"0 0 10px var(--violet-glow)",
                  border:"2px solid var(--bg)",
                }} />
                <div style={{
                  flex:1, background:"rgba(124,77,255,0.03)", borderRadius:14, padding:"13px 16px",
                  border:"1px solid var(--border)",
                  transition:"background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(124,77,255,0.06)"; e.currentTarget.style.borderColor="rgba(124,77,255,0.22)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(124,77,255,0.03)"; e.currentTarget.style.borderColor="var(--border)"; }}
                >
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--text)" }}>{output.feature}</div>
                    <div style={{ fontSize:10, color:"var(--text3)", fontWeight:600 }}>{new Date(output.time).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}</div>
                  </div>
                  <div style={{ fontSize:11, color:"var(--text3)", marginBottom:5, fontWeight:600 }}>{new Date(output.time).toLocaleDateString([], { weekday:"short", month:"short", day:"numeric" })}</div>
                  <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{output.preview}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NEXT STEPS ── */}
      {!brandProfile && (
        <div className="reveal" style={{
          background:"linear-gradient(135deg, rgba(124,77,255,0.07), rgba(240,80,168,0.05))",
          border:"1.5px solid rgba(124,77,255,0.18)",
          borderRadius:20, padding:"24px 26px", marginBottom:24,
        }}>
          <div style={{ fontFamily:"Fredoka One", fontSize:18, color:"var(--text)", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
            🗺️ Your Next Chapter
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { done:false, text:"Complete your brand profile", action:() => onNav("onboarding"), cta:"Start" },
              { done:false, text:"Generate your first brand name", action:() => onNav("brand-identity"), cta:"Go" },
              { done:false, text:"Pick a color palette", action:() => onNav("brand-identity"), cta:"Go" },
            ].map((step, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 14px", background:"rgba(255,253,255,0.7)", borderRadius:12, border:"1px solid var(--border)" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", border:"2px solid", borderColor: step.done ? "var(--teal)" : "rgba(124,77,255,0.3)", background: step.done ? "var(--teal)" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11 }}>
                  {step.done ? "✓" : <span style={{ color:"var(--text3)", fontSize:10, fontWeight:800 }}>{i+1}</span>}
                </div>
                <span style={{ flex:1, fontSize:13, fontWeight:600, color: step.done ? "var(--text3)" : "var(--text)", textDecoration: step.done ? "line-through" : "none" }}>{step.text}</span>
                {!step.done && (
                  <button onClick={step.action} style={{ fontSize:11, fontWeight:800, color:"var(--violet)", background:"var(--violet-soft)", border:"1px solid rgba(124,77,255,0.2)", borderRadius:99, padding:"4px 12px", cursor:"pointer", fontFamily:"Nunito" }}>{step.cta} →</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── QUICK ACTIONS ── */}
      <div className="reveal" style={{ display:"flex", gap:12, flexWrap:"wrap", paddingBottom:40 }}>
        <button className="btn-primary" onClick={() => onNav("content-copy")}>✨ Generate Content</button>
        <button className="btn-ghost" onClick={() => onNav("onboarding")}>📝 Update Profile</button>
        <button className="btn-ghost" onClick={() => onNav("brand-identity")}>🎨 Brand Identity</button>
        {outputs.length > 0 && (
          <button className="btn-ghost" onClick={onDownloadPDF}>📥 Export PDF</button>
        )}
      </div>
    </div>
  );
}
