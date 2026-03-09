import { useState, useEffect } from "react";
import Icon from "./Icon";
import { useLanguage } from "../hooks/useLanguage";

// Google Fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// ─── App Shell ─────────────────────────────────────────────────────────────────
export function AppShell({ page, onNav, user, children }) {
  const { language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [chatTooltip, setChatTooltip] = useState(false);

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
    { id: "dashboard", label: "Dashboard", icon: "dashboard", emoji: "🏠" },
    { id: "brand-identity", label: "Brand Identity", icon: "brand", emoji: "🎨" },
    { id: "content-copy", label: "Content & Copy", icon: "content", emoji: "✍️" },
    { id: "voice-style", label: "Voice & Style", icon: "voice", emoji: "🎙️" },
  ];

  return (
    <div style={{ display: "flex", background: "#FAF6FF", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: 280,
        background: "#FFFFFF",
        borderRight: "1px solid rgba(124,77,255,0.12)",
        display: "flex",
        flexDirection: "column",
        backgroundImage: "radial-gradient(circle, rgba(124,77,255,0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px"
      }}>
        <div style={{ padding: "32px 24px", marginBottom: 32 }}>
          <div style={{
            fontFamily: "Fredoka One",
            fontSize: 24,
            fontWeight: 400,
            color: "#7C4DFF",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            BrandCraft ✨
          </div>
        </div>

        <div style={{ flex: 1, padding: "0 16px" }}>
          {links.map(l => (
            <div
              key={l.id}
              onClick={() => onNav(l.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                marginBottom: 4,
                borderRadius: "12px 0 0 12px",
                cursor: "pointer",
                transition: "all 0.25s",
                fontFamily: "Nunito",
                fontSize: 14,
                fontWeight: 600,
                color: page === l.id ? "#2D1B69" : "#6B5B8A",
                background: page === l.id ? "rgba(124,77,255,0.08)" : "transparent",
                borderLeft: page === l.id ? "4px solid #7C4DFF" : "4px solid transparent",
                position: "relative"
              }}
              onMouseEnter={e => {
                if (page !== l.id) {
                  e.currentTarget.style.background = "rgba(124,77,255,0.04)";
                  e.currentTarget.style.transform = "translateX(2px)";
                }
              }}
              onMouseLeave={e => {
                if (page !== l.id) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }
              }}
            >
              <span style={{ fontSize: 16 }}>{l.emoji}</span>
              <span>{l.label}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto", padding: "24px 16px", borderTop: "1px solid rgba(124,77,255,0.12)" }}>
          {/* Language Selector */}
          <div style={{ marginBottom: 20, position: "relative" }}>
            <div
              onClick={() => setLangOpen(!langOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                background: "#FFFFFF",
                border: "1px solid rgba(124,77,255,0.12)",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "Nunito",
                fontWeight: 500,
                color: "#2D1B69",
                transition: "all 0.25s",
                boxShadow: "0 2px 8px rgba(124,77,255,0.08)"
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(124,77,255,0.15)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(124,77,255,0.08)"}
            >
              <span style={{ fontSize: 16 }}>{currentLang.flag}</span>
              <span style={{ flex: 1 }}>{language}</span>
              <span style={{ fontSize: 12, color: "#6B5B8A", transition: "transform 0.25s" }}
                    className={langOpen ? "rotate-180" : ""}>▼</span>
            </div>

            {langOpen && (
              <div style={{
                position: "absolute",
                bottom: "100%",
                left: 0,
                right: 0,
                marginBottom: 8,
                background: "#FFFFFF",
                border: "1px solid rgba(124,77,255,0.12)",
                borderRadius: 12,
                zIndex: 1000,
                boxShadow: "0 8px 24px rgba(124,77,255,0.15)",
                maxHeight: 200,
                overflowY: "auto"
              }}>
                {langs.map(l => (
                  <div
                    key={l.name}
                    onClick={() => {
                      setLanguage(l.name);
                      setLangOpen(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 14px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: language === l.name ? "rgba(124,77,255,0.08)" : "transparent",
                      color: language === l.name ? "#7C4DFF" : "#2D1B69",
                      fontWeight: language === l.name ? 600 : 500,
                      fontFamily: "Nunito",
                      fontSize: 13,
                      borderBottom: "1px solid rgba(124,77,255,0.06)"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(124,77,255,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = language === l.name ? "rgba(124,77,255,0.08)" : "transparent"}
                  >
                    <span style={{ fontSize: 14 }}>{l.flag}</span>
                    <span>{l.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Avatar Area */}
          <div
            onClick={() => onNav("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              padding: "12px",
              borderRadius: 12,
              transition: "all 0.25s",
              background: "rgba(124,77,255,0.02)"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(124,77,255,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(124,77,255,0.02)"}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7C4DFF, #FF6B9D)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: "Fredoka One"
            }}>
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#2D1B69",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "Nunito"
              }}>
                {user?.email || "User"}
              </div>
              <div style={{
                fontSize: 11,
                color: "#6B5B8A",
                fontFamily: "Nunito",
                fontWeight: 500
              }}>
                Settings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "32px 48px", background: "#FAF6FF" }}>
        <div>{children}</div>
      </div>

      {/* Mobile Nav */}
      <div style={{
        display: window.innerWidth < 768 ? "flex" : "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#FFFFFF",
        borderTop: "1px solid rgba(124,77,255,0.12)",
        padding: "12px 24px",
        justifyContent: "space-around",
        zIndex: 1000
      }}>
        {links.map(l => (
          <div
            key={l.id}
            onClick={() => onNav(l.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "8px",
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.25s",
              color: page === l.id ? "#7C4DFF" : "#6B5B8A",
              background: page === l.id ? "rgba(124,77,255,0.08)" : "transparent"
            }}
          >
            <span style={{ fontSize: 16 }}>{l.emoji}</span>
            <span style={{ fontSize: 10, fontFamily: "Nunito", fontWeight: 600 }}>{l.label.split(" ")[0]}</span>
          </div>
        ))}
      </div>

      {/* Floating AI Chat Button */}
      <div style={{ position: "relative" }}>
        {chatTooltip && (
          <div style={{
            position: "absolute",
            bottom: 80,
            right: 0,
            background: "#2D1B69",
            color: "#FFFFFF",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "Nunito",
            fontWeight: 500,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 1001,
            animation: "fadeIn 0.2s ease-out"
          }}>
            Need help? Chat with our AI! 🤖
          </div>
        )}
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7C4DFF, #FF6B9D)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 0 20px rgba(124,77,255,0.4)",
          transition: "all 0.3s",
          zIndex: 1000,
          animation: "pulse 2s infinite"
        }}
        onMouseEnter={() => {
          setChatTooltip(true);
        }}
        onMouseLeave={() => {
          setChatTooltip(false);
        }}
        onClick={() => onNav("ai-chat")}
        >
          <span style={{ fontSize: 24 }}>🤖</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(124,77,255,0.4); }
          50% { box-shadow: 0 0 40px rgba(255,107,157,0.6); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawCircle {
          from { stroke-dashoffset: ${2 * Math.PI * 70}; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes timelineDot {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export function Dashboard({ brandProfile, onNav, outputs, favorites, selectedOutputs, onDownloadPDF }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [circleDrawn, setCircleDrawn] = useState(false);

  // Check which required outputs are selected
  const requiredOutputs = [
    { key: "Brand Names", feature: "Brand Names" },
    { key: "Color Palette", feature: "Color Palette" },
    { key: "Font Pairing", feature: "Font Pairing" },
    { key: "Logo Creator", feature: "Logo Creator" },
    { key: "Ad Copy", feature: "Ad Copy" },
    { key: "Social Bio", feature: "Social Bio" },
    { key: "Email Templates", feature: "Email Templates" },
  ];

  const selectedCount = requiredOutputs.filter(r => selectedOutputs[r.feature]).length;
  const allSelected = selectedCount === requiredOutputs.length;

  const score = Math.min(100, 20 + (brandProfile ? 30 : 0) + Math.min(50, outputs.length * 3));
  const scoreColor = score >= 80 ? "#4ECDC4" : score >= 50 ? "#FFC107" : "#FF6B6B";
  const circumference = 2 * Math.PI * 70;

  const getScoreMessage = (score) => {
    if (score <= 30) return "🌱 Your story is just beginning…";
    if (score <= 60) return "⚡ The plot is thickening!";
    if (score <= 80) return "🔥 Your brand is heating up!";
    return "🏆 A legendary brand story!";
  };

  const tools = [
    { name: "Brand Names", id: "brand-identity", emoji: "✨", color: "#7C4DFF" },
    { name: "Logo Creator", id: "brand-identity", emoji: "🎨", color: "#FF6B9D" },
    { name: "Color Palette", id: "brand-identity", emoji: "🌈", color: "#FFB300" },
    { name: "Font Pairing", id: "brand-identity", emoji: "🖋️", color: "#00BCD4" },
    { name: "Ad Copy", id: "content-copy", emoji: "📣", color: "#4CAF50" },
    { name: "Social Bio", id: "content-copy", emoji: "🌟", color: "#FF9800" },
    { name: "Email Builder", id: "content-copy", emoji: "💌", color: "#E91E63" },
    { name: "Content Calendar", id: "content-copy", emoji: "📅", color: "#9C27B0" },
    { name: "Voice & Tone", id: "voice-style", emoji: "🎙️", color: "#7C4DFF" },
    { name: "Sentiment Analysis", id: "voice-style", emoji: "💡", color: "#00ACC1" },
  ];

  useEffect(() => {
    // Animate circle drawing
    setTimeout(() => setCircleDrawn(true), 500);

    // Animate score counting
    let current = 0;
    const increment = score / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Chapter Heading */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#7C4DFF",
          fontFamily: "Nunito",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          📖 Chapter 1
        </div>
        <h1 style={{
          fontSize: 48,
          fontWeight: 400,
          marginBottom: 16,
          color: "#2D1B69",
          fontFamily: "Fredoka One"
        }}>
          Your Brand Story So Far
        </h1>
        <p style={{
          fontSize: 18,
          color: "#6B5B8A",
          fontFamily: "Nunito",
          fontStyle: "italic",
          fontWeight: 500,
          maxWidth: 600,
          margin: "0 auto"
        }}>
          Every great brand starts with a single chapter. Yours is just beginning.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 32, marginBottom: 48 }}>
        {/* Story Progress Card */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 8px 32px rgba(124,77,255,0.1)",
          border: "1px solid rgba(124,77,255,0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#2D1B69",
            fontFamily: "Fredoka One",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            Story Progress 📊
          </div>

          <svg width="180" height="180" viewBox="0 0 180 180" style={{ marginBottom: 20 }}>
            <circle cx="90" cy="90" r="75" fill="none" stroke="rgba(124,77,255,0.1)" strokeWidth="8" />
            <circle
              cx="90"
              cy="90"
              r="75"
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circleDrawn ? circumference - (score / 100) * circumference : circumference}
              strokeLinecap="round"
              transform="rotate(-90 90 90)"
              style={{
                transition: circleDrawn ? "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)" : "none"
              }}
            />
            <text
              x="90"
              y="85"
              textAnchor="middle"
              fill={scoreColor}
              fontSize="42"
              fontFamily="Fredoka One"
              fontWeight="400"
              style={{
                animation: "countUp 0.5s ease-out",
                opacity: animatedScore > 0 ? 1 : 0,
                transform: animatedScore > 0 ? "scale(1)" : "scale(0.8)"
              }}
            >
              {animatedScore}
            </text>
            <text
              x="90"
              y="105"
              textAnchor="middle"
              fill="rgba(107,91,138,0.6)"
              fontSize="14"
              fontFamily="Nunito"
              fontWeight="600"
            >
              /100
            </text>
          </svg>

          <div style={{
            fontSize: 16,
            color: "#6B5B8A",
            textAlign: "center",
            fontFamily: "Nunito",
            fontWeight: 500,
            lineHeight: 1.4
          }}>
            {getScoreMessage(score)}
          </div>
        </div>

        {/* Meet Your Brand Card */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 8px 32px rgba(124,77,255,0.1)",
          border: "1.5px solid rgba(124,77,255,0.15)",
          position: "relative"
        }}>
          <div style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#2D1B69",
            fontFamily: "Fredoka One",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            Meet Your Brand 🧡
          </div>

          <button
            onClick={() => onNav("onboarding")}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "transparent",
              border: "2px solid #7C4DFF",
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "Nunito",
              fontWeight: 600,
              color: "#7C4DFF",
              transition: "all 0.25s",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#7C4DFF";
              e.currentTarget.style.color = "#FFFFFF";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#7C4DFF";
            }}
          >
            ✏️ Edit
          </button>

          {brandProfile ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {[
                { key: "Business", value: brandProfile.businessDo, color: "#7C4DFF" },
                { key: "Industry", value: brandProfile.industry, color: "#FF6B9D" },
                { key: "Stage", value: brandProfile.businessStage, color: "#00BCD4" },
                { key: "Target Age", value: brandProfile.targetAge?.join(", "), color: "#4CAF50" },
                { key: "Gender Focus", value: brandProfile.genderFocus, color: "#FFB300" },
                { key: "Color Mood", value: brandProfile.colorMood, color: "#9C27B0" },
                { key: "Logo Style", value: brandProfile.logoStyle, color: "#E91E63" },
                { key: "Design Aesthetic", value: brandProfile.designAesthetic, color: "#3F51B5" },
                { key: "Imagery Style", value: brandProfile.imageryStyle, color: "#009688" },
                { key: "Brand Voice", value: brandProfile.brandVoice, color: "#FF9800" },
                { key: "Brand Goals", value: brandProfile.brandGoals?.join(", "), color: "#795548" },
                { key: "Personality", value: `Playful: ${brandProfile.personality?.playful}%, Minimal: ${brandProfile.personality?.minimal}%, Modern: ${brandProfile.personality?.modern}%`, color: "#607D8B" },
              ].filter(item => item.value).map((item, index) => (
                <div
                  key={item.key}
                  style={{
                    background: `rgba(${item.color === "#7C4DFF" ? "124,77,255" : item.color === "#FF6B9D" ? "255,107,157" : item.color === "#00BCD4" ? "0,188,212" : item.color === "#4CAF50" ? "76,175,80" : item.color === "#FFB300" ? "255,179,0" : item.color === "#9C27B0" ? "156,39,176" : item.color === "#E91E63" ? "233,30,99" : item.color === "#3F51B5" ? "63,81,181" : item.color === "#009688" ? "0,150,136" : item.color === "#FF9800" ? "255,152,0" : item.color === "#795548" ? "121,85,72" : "96,125,139"}, 0.1)`,
                    border: `1px solid rgba(${item.color === "#7C4DFF" ? "124,77,255" : item.color === "#FF6B9D" ? "255,107,157" : item.color === "#00BCD4" ? "0,188,212" : item.color === "#4CAF50" ? "76,175,80" : item.color === "#FFB300" ? "255,179,0" : item.color === "#9C27B0" ? "156,39,176" : item.color === "#E91E63" ? "233,30,99" : item.color === "#3F51B5" ? "63,81,181" : item.color === "#009688" ? "0,150,136" : item.color === "#FF9800" ? "255,152,0" : item.color === "#795548" ? "121,85,72" : "96,125,139"}, 0.2)`,
                    borderRadius: 16,
                    padding: "12px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    minWidth: 120,
                    animation: "cardEntrance 0.5s ease-out",
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both"
                  }}
                >
                  <div style={{
                    fontSize: 11,
                    color: "#6B5B8A",
                    fontFamily: "Nunito",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    {item.key}
                  </div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#2D1B69",
                    fontFamily: "Nunito",
                    textAlign: "center",
                    lineHeight: 1.3
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <div style={{
                fontSize: 20,
                fontWeight: 400,
                color: "#2D1B69",
                fontFamily: "Fredoka One",
                marginBottom: 8
              }}>
                No story yet!
              </div>
              <div style={{
                fontSize: 14,
                color: "#6B5B8A",
                fontFamily: "Nunito",
                fontWeight: 500,
                marginBottom: 24
              }}>
                Let's build your brand profile
              </div>
              <button
                onClick={() => onNav("onboarding")}
                style={{
                  background: "linear-gradient(135deg, #7C4DFF, #FF6B9D)",
                  border: "none",
                  borderRadius: 20,
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "Nunito",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  transition: "all 0.25s",
                  boxShadow: "0 4px 16px rgba(124,77,255,0.3)"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Start Your Story ✨
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selection Progress Card - Show when user has made selections */}
      {selectedCount > 0 && (
        <div style={{
          background: "linear-gradient(135deg, rgba(78,205,196,0.1) 0%, rgba(124,77,255,0.08) 100%)",
          border: "1px solid rgba(78,205,196,0.3)",
          borderRadius: 20,
          padding: 28,
          marginBottom: 40,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#2D1B69", marginBottom: 4 }}>
                📋 Your Brand Selections
              </div>
              <p style={{ color: "#6B5B8A", fontSize: 13 }}>
                {selectedCount} of {requiredOutputs.length} items confirmed
              </p>
            </div>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `conic-gradient(#4ECDC4 0deg ${(selectedCount / requiredOutputs.length) * 360}deg, rgba(78,205,196,0.1) ${(selectedCount / requiredOutputs.length) * 360}deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
              color: "#4ECDC4",
            }}>
              {selectedCount}/{requiredOutputs.length}
            </div>
          </div>

          {/* Selections Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
            {requiredOutputs.map((req) => {
              const isSelected = selectedOutputs[req.feature];
              return (
                <div
                  key={req.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    background: isSelected ? "rgba(78,205,196,0.15)" : "rgba(0,0,0,0.03)",
                    borderRadius: 10,
                    borderLeft: `3px solid ${isSelected ? "#4ECDC4" : "transparent"}`,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{isSelected ? "✅" : "⬜"}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: isSelected ? "#2D1B69" : "#6B5B8A" }}>
                    {req.key}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div style={{ height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #4ECDC4, #7C4DFF)",
              width: `${(selectedCount / requiredOutputs.length) * 100}%`,
              transition: "width 0.3s ease",
              borderRadius: 3,
            }} />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            {allSelected ? (
              <button
                onClick={onDownloadPDF}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #7C4DFF, #FF6B9D)",
                  border: "none",
                  borderRadius: 16,
                  padding: "14px 24px",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 16px rgba(124,77,255,0.3)"
                }}
              >
                🎉 Download Complete Brand PDF
              </button>
            ) : (
              <button
                onClick={() => onNav("brand-identity")}
                style={{
                  flex: 1,
                  background: "#7C4DFF",
                  border: "none",
                  borderRadius: 16,
                  padding: "14px 24px",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                🎨 Continue Building Your Brand
              </button>
            )}
          </div>
        </div>
      )}

      {/* Your Toolbox */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontSize: 32,
          fontWeight: 400,
          color: "#2D1B69",
          fontFamily: "Fredoka One",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          Your Toolbox 🧰
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 20
        }}>
          {tools.map((tool, index) => {
            const used = outputs.some(o => o.feature === tool.name);
            return (
              <div
                key={tool.name}
                onClick={() => onNav(tool.id)}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 18,
                  padding: 20,
                  cursor: "pointer",
                  transition: "all 0.25s",
                  border: "1px solid rgba(124,77,255,0.12)",
                  boxShadow: "0 4px 16px rgba(124,77,255,0.08)",
                  animation: "cardEntrance 0.5s ease-out",
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "both"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,77,255,0.15)";
                  e.currentTarget.style.borderColor = tool.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,77,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(124,77,255,0.12)";
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `rgba(${tool.color === "#7C4DFF" ? "124,77,255" : tool.color === "#FF6B9D" ? "255,107,157" : tool.color === "#FFB300" ? "255,179,0" : tool.color === "#00BCD4" ? "0,188,212" : tool.color === "#4CAF50" ? "76,175,80" : tool.color === "#FF9800" ? "255,152,0" : tool.color === "#E91E63" ? "233,30,99" : tool.color === "#9C27B0" ? "156,39,176" : "0,172,193"}, 0.15)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  marginBottom: 12
                }}>
                  {tool.emoji}
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#2D1B69",
                  fontFamily: "Fredoka One",
                  marginBottom: 8
                }}>
                  {tool.name}
                </div>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 8px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontFamily: "Nunito",
                  fontWeight: 600,
                  background: used ? "rgba(76,205,196,0.1)" : "rgba(107,91,138,0.1)",
                  color: used ? "#4ECDC4" : "#6B5B8A",
                  border: `1px solid ${used ? "rgba(76,205,196,0.2)" : "rgba(107,91,138,0.2)"}`
                }}>
                  {used ? "✓ Used" : "Not used"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Download Brand PDF */}
      {selectedOutputs['brand-identity'] && selectedOutputs['content-copy'] && selectedOutputs['voice-style'] && (
        <div style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 8px 32px rgba(124,77,255,0.1)",
          border: "1px solid rgba(124,77,255,0.12)",
          textAlign: "center",
          marginBottom: 48
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#2D1B69",
            fontFamily: "Fredoka One",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8
          }}>
            🎉 Ready to Download Your Brand PDF!
          </div>
          <p style={{
            color: "#6B5B8A",
            fontSize: 16,
            fontFamily: "Nunito",
            marginBottom: 24
          }}>
            You've selected all your brand assets. Download your complete brand package now!
          </p>
          <button
            onClick={() => {
              // Simulate download
              const link = document.createElement('a');
              link.href = '#'; // placeholder
              link.download = 'brandcraft-brand-package.pdf';
              link.click();
              showToast("📄 Brand PDF downloaded!");
            }}
            style={{
              background: "linear-gradient(135deg, #7C4DFF, #FF6B9D)",
              border: "none",
              borderRadius: 20,
              padding: "16px 32px",
              cursor: "pointer",
              fontSize: 16,
              fontFamily: "Nunito",
              fontWeight: 600,
              color: "#FFFFFF",
              transition: "all 0.25s",
              boxShadow: "0 4px 16px rgba(124,77,255,0.3)"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            📥 Download Brand PDF
          </button>
        </div>
      )}

      {/* Recent Chapters */}
      {outputs.length > 0 && (
        <div style={{
          background: "#FFFFFF",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 8px 32px rgba(124,77,255,0.1)",
          border: "1px solid rgba(124,77,255,0.12)"
        }}>
          <div style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#2D1B69",
            fontFamily: "Fredoka One",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            Recent Chapters 📚
          </div>

          <div style={{ position: "relative" }}>
            {outputs.slice(-6).reverse().map((output, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  padding: "20px 0",
                  borderBottom: index < Math.min(5, outputs.length - 1) ? "1px solid rgba(124,77,255,0.08)" : "none",
                  animation: "cardEntrance 0.5s ease-out",
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both"
                }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 2
                }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#7C4DFF",
                    animation: "timelineDot 0.5s ease-out",
                    animationDelay: `${index * 100 + 300}ms`,
                    animationFillMode: "both"
                  }}></div>
                  {index < Math.min(5, outputs.length - 1) && (
                    <div style={{
                      width: 2,
                      height: 40,
                      background: "rgba(124,77,255,0.2)",
                      borderRadius: 1
                    }}></div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#2D1B69",
                    fontFamily: "Fredoka One",
                    marginBottom: 4
                  }}>
                    {output.feature}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: "#6B5B8A",
                    fontFamily: "Nunito",
                    fontWeight: 500,
                    marginBottom: 8
                  }}>
                    {new Date(output.time).toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: "#2D1B69",
                    fontFamily: "Nunito",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {output.preview}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div style={{
        display: "flex",
        gap: 16,
        marginTop: 48,
        flexWrap: "wrap",
        justifyContent: "center"
      }}>
        <button
          onClick={() => onNav("content-copy")}
          style={{
            background: "linear-gradient(135deg, #7C4DFF, #FF6B9D)",
            border: "none",
            borderRadius: 20,
            padding: "14px 28px",
            cursor: "pointer",
            fontSize: 16,
            fontFamily: "Fredoka One",
            fontWeight: 400,
            color: "#FFFFFF",
            transition: "all 0.25s",
            boxShadow: "0 4px 16px rgba(124,77,255,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          ✨ Generate New Content
        </button>

        <button
          onClick={() => onNav("onboarding")}
          style={{
            background: "#FFFFFF",
            border: "2px solid #7C4DFF",
            borderRadius: 20,
            padding: "14px 28px",
            cursor: "pointer",
            fontSize: 16,
            fontFamily: "Nunito",
            fontWeight: 600,
            color: "#7C4DFF",
            transition: "all 0.25s",
            boxShadow: "0 2px 8px rgba(124,77,255,0.1)"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#7C4DFF";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.color = "#7C4DFF";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          📝 Update Brand Profile
        </button>

        <button
          onClick={() => onNav("brand-identity")}
          style={{
            background: "#FFFFFF",
            border: "2px solid #FF6B9D",
            borderRadius: 20,
            padding: "14px 28px",
            cursor: "pointer",
            fontSize: 16,
            fontFamily: "Nunito",
            fontWeight: 600,
            color: "#FF6B9D",
            transition: "all 0.25s",
            boxShadow: "0 2px 8px rgba(255,107,157,0.1)"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#FF6B9D";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#FFFFFF";
            e.currentTarget.style.color = "#FF6B9D";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          🎨 Build Brand Identity
        </button>
      </div>
    </div>
  );
}
