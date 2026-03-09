import { useState } from "react";
import { callAIJSON } from "../utils/api";
import { SkeletonCard, OutputActions, GenerateMorePanel } from "./UI";

// ─── Shared Page Shell (same pattern as BrandIdentity) ─────────────────────────
function PageShell({ emoji, title, desc, tools, activeId, onSetActive, children }) {
  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", gap: 0 }}>
      <aside style={{
        width: 234, flexShrink: 0, borderRight: "1px solid var(--border)",
        paddingBottom: 40, background: "var(--bg2)",
      }}>
        <div style={{ position: "sticky", top: 0, paddingTop: 32 }}>
          <div style={{ padding: "0 20px 24px" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 6, fontFamily: "Fredoka One" }}>{title}</h1>
            <p style={{ color: "var(--text2)", fontSize: 12, lineHeight: 1.5 }}>{desc}</p>
          </div>
          <div style={{ padding: "0 10px" }}>
            {tools.map(t => (
              <div key={t.id} onClick={() => onSetActive(t.id)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 14px", borderRadius: 12, cursor: "pointer", marginBottom: 3,
                background: activeId === t.id ? "var(--teal-glow)" : "transparent",
                border: `1.5px solid ${activeId === t.id ? "var(--teal)" : "transparent"}`,
                color: activeId === t.id ? "var(--teal)" : "var(--text2)",
                fontWeight: activeId === t.id ? 700 : 500,
                fontSize: 13, transition: "all 0.18s ease",
              }}
              onMouseEnter={e => { if (activeId !== t.id) e.currentTarget.style.background = "var(--teal-glow)"; }}
              onMouseLeave={e => { if (activeId !== t.id) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{t.emoji}</span>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
      <main style={{ flex: 1, minWidth: 0, padding: "32px 40px 80px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}

// ─── Ad Copy ───────────────────────────────────────────────────────────────────
function AdCopyTool({ brandProfile, onOutput, favorites, onFavorite, selectedOutputs, onSelect }) {
  const [platform, setPlatform] = useState("Instagram");
  const [goal, setGoal] = useState("Awareness");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    setLoading(true);
    try {
      const result = await callAIJSON(
        "You are an expert ad copywriter. Return JSON with an 'ads' array of 3 objects, each with 'headline', 'body', 'cta' fields.",
        `Brand: ${JSON.stringify(brandProfile)}. Platform: ${platform}. Goal: ${goal}. ${spec || "Write high-converting ad copy."}`
      );
      if (result.ads) {
        setRounds(r => [...r, { ads: result.ads, spec, round: r.length + 1 }]);
        onOutput("Ad Copy", result.ads[0]?.headline);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>📣 Ad Copy Generator</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Write ads that actually convert.</p>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select className="select-base" style={{ width: "auto", minWidth: 160 }} value={platform} onChange={e => setPlatform(e.target.value)}>
          {["Instagram","Facebook","Google","LinkedIn","TikTok"].map(p => <option key={p}>{p}</option>)}
        </select>
        <select className="select-base" style={{ width: "auto", minWidth: 160 }} value={goal} onChange={e => setGoal(e.target.value)}>
          {["Awareness","Engagement","Conversion"].map(g => <option key={g}>{g}</option>)}
        </select>
        <button className="btn-primary" onClick={() => generate()} disabled={loading}>
          {loading ? "Generating…" : "Generate Ad Copy"}
        </button>
      </div>
      {loading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={4} />)}</div>}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round} · {platform} · {goal}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {round.ads.map((ad, i) => {
              const id = `ad-${ri}-${i}`;
              return (
                <div key={i} className="card output-card" style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--teal)", fontWeight: 700 }}>Variation {i + 1}</div>
                    <OutputActions text={`${ad.headline}\n${ad.body}\n${ad.cta}`} starred={favorites.includes(id)} onStar={() => onFavorite(id)} onSelect={onSelect} selected={selectedOutputs["Ad Copy"] === id} feature="Ad Copy" id={id} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8, color: "var(--text)" }}>{ad.headline}</div>
                  <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{ad.body}</p>
                  <div style={{ display: "inline-block", padding: "6px 18px", background: "var(--teal-glow)", border: "1px solid var(--teal)", borderRadius: 8, fontSize: 13, color: "var(--teal)", fontWeight: 700 }}>{ad.cta}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["More Urgent","More Casual","Shorter","Longer","Funnier","More Direct","Different Angle"]} />
      )}
    </div>
  );
}

// ─── Social Bio ────────────────────────────────────────────────────────────────
function SocialBioTool({ brandProfile, onOutput, favorites, onFavorite, selectedOutputs, onSelect }) {
  const [platform, setPlatform] = useState("Instagram");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    setLoading(true);
    try {
      const result = await callAIJSON(
        "You are a social media expert. Return JSON with a 'bios' array of 3 objects: {length: 'Short|Medium|Full', text: string, charCount: number}.",
        `Brand: ${JSON.stringify(brandProfile)}. Platform: ${platform}. ${spec || "Write compelling bios."}`
      );
      if (result.bios) {
        setRounds(r => [...r, { bios: result.bios, spec, round: r.length + 1 }]);
        onOutput("Social Bio", result.bios[0]?.text);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>🌟 Social Media Bio</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Bios that make people hit follow.</p>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select className="select-base" style={{ width: "auto", minWidth: 160 }} value={platform} onChange={e => setPlatform(e.target.value)}>
          {["Instagram","Twitter","LinkedIn","TikTok","YouTube"].map(p => <option key={p}>{p}</option>)}
        </select>
        <button className="btn-primary" onClick={() => generate()} disabled={loading}>
          {loading ? "Generating…" : "Generate Bios"}
        </button>
      </div>
      {loading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={3} />)}</div>}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round} · {platform}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {round.bios.map((bio, i) => {
              const id = `bio-${ri}-${i}`;
              return (
                <div key={i} className="card output-card" style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: "var(--teal)", fontWeight: 700 }}>{bio.length}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "var(--text3)" }}>{bio.charCount || bio.text?.length || 0} chars</span>
                      <OutputActions text={bio.text} starred={favorites.includes(id)} onStar={() => onFavorite(id)} onSelect={onSelect} selected={selectedOutputs["Social Bio"] === id} feature="Social Bio" id={id} />
                    </div>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--text)" }}>{bio.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["Add Emoji","Remove Emoji","More Punchy","More Professional","Add CTA","Shorter","Funnier"]} />
      )}
    </div>
  );
}

// ─── Email Builder ─────────────────────────────────────────────────────────────
function EmailBuilderTool({ brandProfile, onOutput, selectedOutputs, onSelect, saveToolOutput, getToolOutputs }) {
  const [type, setType] = useState("Welcome");
  const [rounds, setRounds] = useState(() => getToolOutputs ? getToolOutputs("email-builder") : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (spec = "") => {
    if (!brandProfile) { setError("Please complete your brand profile first"); return; }
    setLoading(true); setError(null);
    try {
      const result = await callAIJSON(
        "You are an email marketing expert. Return JSON: {subject: string, preheader: string, body: string}. Body should be well-structured email copy.",
        `Brand: ${JSON.stringify(brandProfile)}. Email type: ${type}. ${spec || "Write a compelling email."}`
      );
      if (result.subject) {
        const newRound = { ...result, spec, round: rounds.length + 1 };
        setRounds(prev => { const updated = [...prev, newRound]; if (saveToolOutput) saveToolOutput("email-builder", newRound); return updated; });
        onOutput("Email Template", result.subject);
      } else { setError("Failed to generate email. Please try again."); }
    } catch { setError("Connection error. Please try again."); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>💌 Email Template Builder</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Emails your audience will actually open.</p>
      </div>
      {error && <div style={{ padding: "12px 16px", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 8, marginBottom: 20, color: "#FF6B6B", fontSize: 14 }}>⚠️ {error}</div>}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <select className="select-base" style={{ width: "auto", minWidth: 180 }} value={type} onChange={e => setType(e.target.value)}>
          {["Welcome","Promotional","Newsletter","Follow-up","Abandoned Cart"].map(t => <option key={t}>{t}</option>)}
        </select>
        <button className="btn-primary" onClick={() => generate()} disabled={loading}>
          {loading ? "Generating…" : "Generate Email"}
        </button>
      </div>
      {loading && <SkeletonCard lines={8} />}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round} · {type}</div>
          <div className="card output-card" style={{ padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
              <OutputActions text={`Subject: ${round.subject}\n\n${round.body}`} onSelect={onSelect} selected={selectedOutputs["Email Templates"] === `email-${ri}`} feature="Email Templates" id={`email-${ri}`} />
            </div>
            <div style={{ padding: "12px 16px", background: "var(--bg2)", borderRadius: 10, marginBottom: 14, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4, fontWeight: 700, letterSpacing: "0.05em" }}>SUBJECT LINE</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>{round.subject}</div>
              {round.preheader && <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>{round.preheader}</div>}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text2)", whiteSpace: "pre-wrap" }}>{round.body}</div>
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["More Formal","More Friendly","Add Urgency","Shorter","Add Offer","Catchier Subject","Add PS"]} />
      )}
    </div>
  );
}

// ─── Content Calendar ──────────────────────────────────────────────────────────
function ContentCalendarTool({ brandProfile, onOutput, selectedOutputs, onSelect }) {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("Post");
  const [frequency, setFrequency] = useState("Daily");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    setLoading(true);
    try {
      const result = await callAIJSON(
        "You are a social media strategist. Return JSON with 'calendar': array of 7 objects: {day:string, platform:string, idea:string, hashtags:string[]}.",
        `Brand: ${JSON.stringify(brandProfile)}. Topic: ${topic || "general brand content"}. Type: ${contentType}. Frequency: ${frequency}. ${spec || ""}`
      );
      if (result.calendar) {
        setRounds(r => [...r, { calendar: result.calendar, spec, round: r.length + 1 }]);
        onOutput("Content Calendar", result.calendar[0]?.idea);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>📅 Content Calendar</h2>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>7 days of ready-to-post content ideas.</p>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <input className="input-base" placeholder="Campaign or topic idea..." value={topic} onChange={e => setTopic(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        <select className="select-base" style={{ width: "auto", minWidth: 120 }} value={contentType} onChange={e => setContentType(e.target.value)}>
          {["Post","Thread","Story","Reel Script"].map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="select-base" style={{ width: "auto", minWidth: 120 }} value={frequency} onChange={e => setFrequency(e.target.value)}>
          {["Daily","3x Week","Weekly"].map(f => <option key={f}>{f}</option>)}
        </select>
        <button className="btn-primary" onClick={() => generate()} disabled={loading}>
          {loading ? "Generating…" : "Generate Calendar"}
        </button>
      </div>
      {loading && <SkeletonCard lines={8} />}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round}</div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <OutputActions text={`Content Calendar\n\n${round.calendar.map(row => `${row.day}: ${row.idea} (${row.platform})`).join('\n')}`} onSelect={onSelect} selected={selectedOutputs["Content Calendar"] === `calendar-${ri}`} feature="Content Calendar" id={`calendar-${ri}`} />
          </div>
          <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--border)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--bg2)" }}>
                  {["Day","Platform","Post Idea","Hashtags"].map(h => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "var(--text2)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {round.calendar.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "var(--bg2)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--teal)", whiteSpace: "nowrap" }}>{row.day}</td>
                    <td style={{ padding: "12px 14px", color: "var(--text2)", whiteSpace: "nowrap" }}>{row.platform}</td>
                    <td style={{ padding: "12px 14px", lineHeight: 1.5, color: "var(--text)" }}>{row.idea}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {(row.hashtags || []).slice(0, 3).map(h => (
                          <span key={h} style={{ padding: "2px 8px", background: "var(--teal-glow)", border: "1px solid var(--teal)", borderRadius: 4, color: "var(--teal)", fontSize: 11, fontWeight: 600 }}>#{h.replace("#","")}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["Different Platforms","More Variety","Focus on Reels","Add Stories","More Hashtags","Product Launch Focus"]} />
      )}
    </div>
  );
}

// ─── Content Copy Page ─────────────────────────────────────────────────────────
export function ContentCopyPage({ brandProfile, onOutput, favorites, onFavorite, selectedOutputs, onSelect, toolOutputs, saveToolOutput, getToolOutputs }) {
  const [activeTool, setActiveTool] = useState("ads");

  const tools = [
    { id: "ads",      emoji: "📣", label: "Ad Copy" },
    { id: "bio",      emoji: "🌟", label: "Social Bio" },
    { id: "email",    emoji: "💌", label: "Email Builder" },
    { id: "calendar", emoji: "📅", label: "Content Calendar" },
  ];

  return (
    <PageShell
      emoji="✍️" title="Content & Copy"
      desc="AI-powered content that sounds like you, scales like a team."
      tools={tools} activeId={activeTool} onSetActive={setActiveTool}
    >
      {activeTool === "ads"      && <AdCopyTool brandProfile={brandProfile} onOutput={onOutput} favorites={favorites} onFavorite={onFavorite} selectedOutputs={selectedOutputs} onSelect={onSelect} />}
      {activeTool === "bio"      && <SocialBioTool brandProfile={brandProfile} onOutput={onOutput} favorites={favorites} onFavorite={onFavorite} selectedOutputs={selectedOutputs} onSelect={onSelect} />}
      {activeTool === "email"    && <EmailBuilderTool brandProfile={brandProfile} onOutput={onOutput} selectedOutputs={selectedOutputs} onSelect={onSelect} saveToolOutput={saveToolOutput} getToolOutputs={getToolOutputs} />}
      {activeTool === "calendar" && <ContentCalendarTool brandProfile={brandProfile} onOutput={onOutput} selectedOutputs={selectedOutputs} onSelect={onSelect} />}
    </PageShell>
  );
}
