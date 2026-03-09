import { useState } from "react";
import { callAIJSON } from "../utils/api";
import { useLanguage } from "../hooks/useLanguage";
import { useTheme } from "../hooks/useTheme";
import { SkeletonCard, OutputActions, GenerateMorePanel, ToolSection } from "./UI";
import Icon from "./Icon";

// ─── Voice Rewriter ────────────────────────────────────────────────────────────
export function VoiceTool({ brandProfile, onOutput }) {
  const [inputText, setInputText] = useState("");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    if (!inputText && !spec) return;
    setLoading(true);
    try {
      const result = await callAIJSON(
        "You are a brand voice expert. Rewrite text to match the brand voice. Return JSON: {rewritten: string, changes: string[]}",
        `Brand profile: ${JSON.stringify(brandProfile)}. Original: "${inputText}". ${spec || "Rewrite in brand voice."}`
      );
      if (result.rewritten) {
        setRounds(r => [...r, { original: inputText, rewritten: result.rewritten, changes: result.changes, spec, round: r.length + 1 }]);
        onOutput("Voice & Tone", result.rewritten);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <ToolSection title="Voice & Tone Customizer" desc="Make your brand sound consistent everywhere.">
      <div style={{ marginBottom: 16 }}>
        {brandProfile?.voice && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "var(--teal-glow)", border: "1px solid rgba(78,205,196,0.2)", borderRadius: 8, fontSize: 13, color: "var(--teal)", marginBottom: 14 }}>
            <Icon name="voice" size={13} /> Brand voice: <strong>{brandProfile.voice}</strong>
          </div>
        )}
        <textarea className="input-base" rows={4} placeholder="Paste any text here to rewrite it in your brand voice..." value={inputText} onChange={e => setInputText(e.target.value)} style={{ resize: "none", marginBottom: 12 }} />
        <button className="btn-primary" onClick={() => generate()} disabled={loading || !inputText}>
          {loading ? "Rewriting…" : "Rewrite in Brand Voice"}
        </button>
      </div>

      {loading && <SkeletonCard lines={5} />}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="card" style={{ opacity: 0.7 }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>ORIGINAL</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text2)" }}>{round.original}</p>
            </div>
            <div className="card" style={{ border: "1px solid rgba(78,205,196,0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "var(--teal)" }}>REWRITTEN</div>
                <OutputActions text={round.rewritten} />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7 }}>{round.rewritten}</p>
              {round.changes?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}>Changes made:</div>
                  {round.changes.map((c, i) => <div key={i} style={{ fontSize: 12, color: "var(--text2)", padding: "2px 0" }}>· {c}</div>)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["Even More Formal","More Casual","Shorter Version","Add Personality","Make it Punchy","Sound More Human"]} />
      )}
    </ToolSection>
  );
}

// ─── Sentiment Analysis ────────────────────────────────────────────────────────
export function SentimentTool({ brandProfile, onOutput }) {
  const [inputText, setInputText] = useState("");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    if (!inputText) return;
    setLoading(true);
    try {
      const result = await callAIJSON(
        "Sentiment analyzer. Return JSON: {score: 0-100 (higher=more positive), emotions: {joy:0-100,trust:0-100,fear:0-100,surprise:0-100,sadness:0-100,anger:0-100}, sentiment: 'Positive|Neutral|Negative', recommendation: string, keyWords: [{word:string,emotion:string}]}",
        `Analyze: "${inputText}". Context: brand for ${brandProfile?.industry || "business"}. ${spec || ""}`
      );
      if (result.score !== undefined) {
        setRounds(r => [...r, { ...result, text: inputText, spec, round: r.length + 1 }]);
        onOutput("Sentiment Analysis", `Score: ${result.score}/100`);
      }
    } catch {}
    setLoading(false);
  };

  const emotions = ["joy","trust","fear","surprise","sadness","anger"];
  const emotionColors = { joy: "#FFD700", trust: "#4ECDC4", fear: "#7C3AED", surprise: "#FF9F43", sadness: "#6BB5FF", anger: "#FF6B6B" };

  return (
    <ToolSection title="Sentiment Analysis" desc="Know how your content makes people feel.">
      <textarea className="input-base" rows={5} placeholder="Paste any content to analyse..." value={inputText} onChange={e => setInputText(e.target.value)} style={{ resize: "none", marginBottom: 12 }} />
      <button className="btn-primary" onClick={() => generate()} disabled={loading || !inputText} style={{ marginBottom: 24 }}>
        {loading ? "Analysing…" : "Analyse Sentiment"}
      </button>

      {loading && <SkeletonCard lines={6} />}
      {rounds.map((round, ri) => {
        const scoreColor = round.score >= 60 ? "#4ECDC4" : round.score >= 40 ? "#FFC107" : "#FF6B6B";
        const circ = 2 * Math.PI * 50;
        return (
          <div key={ri} style={{ marginBottom: 24 }}>
            <div className="round-label">Round {round.round}</div>
            <div className="card">
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 24, marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <svg width="120" height="120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="8"
                      strokeDasharray={circ} strokeDashoffset={circ - (round.score / 100) * circ}
                      strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 1s ease" }} />
                    <text x="60" y="64" textAnchor="middle" dominantBaseline="middle" fill={scoreColor} fontSize="24" fontFamily="Syne" fontWeight="800">{round.score}</text>
                  </svg>
                  <div style={{ fontSize: 13, color: scoreColor, fontWeight: 600, marginTop: 8 }}>{round.sentiment}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>Emotion Breakdown</div>
                  {emotions.map(em => (
                    <div key={em} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                        <span style={{ color: emotionColors[em], textTransform: "capitalize", fontWeight: 500 }}>{em}</span>
                        <span style={{ color: "var(--text2)" }}>{round.emotions?.[em] || 0}%</span>
                      </div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: emotionColors[em], width: `${round.emotions?.[em] || 0}%`, borderRadius: 2, transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {round.recommendation && (
                <div style={{ padding: 14, background: "var(--teal-glow)", border: "1px solid rgba(78,205,196,0.15)", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: "var(--teal)", fontWeight: 600, marginBottom: 5 }}>RECOMMENDATION</div>
                  <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{round.recommendation}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["Focus on Positive Words","Focus on Negative Words","Suggest Improvements","How would Gen Z feel?","How would Boomers feel?"]} />
      )}
    </ToolSection>
  );
}

// ─── Voice Style Page ──────────────────────────────────────────────────────────
export function VoiceStylePage({ brandProfile, onOutput }) {
  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Voice & Style</h1>
      <p style={{ color: "var(--text2)", marginBottom: 40 }}>Shape how your brand sounds and how it makes people feel.</p>
      <VoiceTool brandProfile={brandProfile} onOutput={onOutput} />
      <SentimentTool brandProfile={brandProfile} onOutput={onOutput} />
    </div>
  );
}

// ─── Settings Page ─────────────────────────────────────────────────────────────
export function SettingsPage({ user, onNav }) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, themes: themeList } = useTheme();
  const [darkMode, setDarkMode] = useState(true);
  const [saved, setSaved] = useState(false);

  const langs = [
    { name: "English", flag: "🇺🇸" }, { name: "Spanish", flag: "🇪🇸" },
    { name: "French", flag: "🇫🇷" }, { name: "German", flag: "🇩🇪" },
    { name: "Japanese", flag: "🇯🇵" }, { name: "Arabic", flag: "🇸🇦" },
    { name: "Hindi", flag: "🇮🇳" }, { name: "Portuguese", flag: "🇧🇷" },
    { name: "Chinese", flag: "🇨🇳" }, { name: "Italian", flag: "🇮🇹" },
    { name: "Korean", flag: "🇰🇷" },
  ];

  const handleSaveLanguage = () => {
    setLanguage(language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleThemeChange = (themeName) => {
    setTheme(themeName);
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>{t("settings.title")}</h1>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t("settings.profile")}</h2>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6 }}>{t("settings.email")}</label>
            <input className="input-base" defaultValue={user?.email} readOnly style={{ opacity: 0.7 }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6 }}>{t("settings.displayName")}</label>
            <input className="input-base" placeholder={t("settings.displayName")} />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t("settings.language")}</h2>
        <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>{t("settings.languageDesc")}</p>
        <div className="card">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginBottom: 16 }}>
            {langs.map(l => (
              <div key={l.name} onClick={() => setLanguage(l.name)}
                style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${language === l.name ? "var(--teal)" : "var(--border)"}`, background: language === l.name ? "var(--teal-glow)" : "var(--card)", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}>
                <span>{l.flag}</span>
                <span style={{ fontSize: 13, fontWeight: language === l.name ? 600 : 400, color: language === l.name ? "var(--teal)" : "var(--text2)" }}>{l.name}</span>
              </div>
            ))}
          </div>
          <button className="btn-primary btn-sm" onClick={handleSaveLanguage}>
            {saved ? <><Icon name="check" size={13} /> {t("settings.saved")}</> : t("settings.saveLanguage")}
          </button>
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>App Theme</h2>
        <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>Customize the look and feel of your app.</p>
        <div className="card">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
            {Object.entries(themeList).map(([key, themeData]) => (
              <div
                key={key}
                onClick={() => handleThemeChange(key)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: `2px solid ${theme === key ? "var(--teal)" : "var(--border)"}`,
                  background: theme === key ? "var(--teal-glow)" : "var(--card)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  textAlign: "center",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "var(--teal)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = theme === key ? "var(--teal)" : "var(--border)";
                }}
              >
                <div style={{ fontSize: 24 }}>{themeData.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: theme === key ? 600 : 400, color: theme === key ? "var(--teal)" : "var(--text2)" }}>
                  {themeData.name}
                </div>
                {/* Color Preview */}
                <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: themeData.colors["--teal"] }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: themeData.colors["--purple"] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t("settings.brandProfile")}</h2>
        <button className="btn-ghost" onClick={() => onNav("onboarding")}>{t("settings.editProfile")}</button>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t("settings.appearance")}</h2>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 500 }}>{t("settings.darkMode")}</div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>{t("settings.appearance")}</div>
            </div>
            <div onClick={() => setDarkMode(!darkMode)} style={{ width: 48, height: 26, background: darkMode ? "var(--teal)" : "var(--border)", borderRadius: 99, cursor: "pointer", position: "relative", transition: "background 0.3s" }}>
              <div style={{ position: "absolute", top: 3, left: darkMode ? 24 : 3, width: 20, height: 20, background: "#fff", borderRadius: "50%", transition: "left 0.3s" }} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#FF6B6B" }}>{t("settings.dangerZone")}</h2>
        <button style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #FF6B6B", background: "transparent", color: "#FF6B6B", cursor: "pointer", fontSize: 14, fontWeight: 500 }}>{t("settings.deleteAccount")}</button>
      </section>
    </div>
  );
}
