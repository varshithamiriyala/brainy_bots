import { useState } from "react";
import { callAIJSON } from "../utils/api";
import { SkeletonCard, OutputActions, GenerateMorePanel, ToolSection } from "./UI";

// ─── Ad Copy ───────────────────────────────────────────────────────────────────
export function AdCopyTool({ brandProfile, onOutput, favorites, onFavorite }) {
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
    <ToolSection title="Ad Copy Generator" desc="Write ads that actually convert.">
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
                <div key={i} className="card output-card">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: "var(--teal)", fontWeight: 600 }}>Variation {i + 1}</div>
                    <OutputActions text={`${ad.headline}\n${ad.body}\n${ad.cta}`} starred={favorites.includes(id)} onStar={() => onFavorite(id)} />
                  </div>
                  <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{ad.headline}</div>
                  <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7, marginBottom: 10 }}>{ad.body}</p>
                  <div style={{ display: "inline-block", padding: "6px 16px", background: "var(--teal-glow)", border: "1px solid rgba(78,205,196,0.3)", borderRadius: 8, fontSize: 13, color: "var(--teal)", fontWeight: 600 }}>{ad.cta}</div>
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
    </ToolSection>
  );
}

// ─── Social Bio ────────────────────────────────────────────────────────────────
export function SocialBioTool({ brandProfile, onOutput, favorites, onFavorite }) {
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
    <ToolSection title="Social Media Bio Generator" desc="Bios that make people hit follow.">
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
                <div key={i} className="card output-card">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--teal)", fontWeight: 600 }}>{bio.length}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "var(--text3)" }}>{bio.charCount || bio.text?.length || 0} chars</span>
                      <OutputActions text={bio.text} starred={favorites.includes(id)} onStar={() => onFavorite(id)} />
                    </div>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{bio.text}</p>
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
    </ToolSection>
  );
}

// ─── Email Builder ─────────────────────────────────────────────────────────────
export function EmailBuilderTool({ brandProfile, onOutput }) {
  const [type, setType] = useState("Welcome");
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    setLoading(true);
    try {
      const result = await callAIJSON(
        "You are an email marketing expert. Return JSON: {subject: string, preheader: string, body: string}. Body should be well-structured email copy.",
        `Brand: ${JSON.stringify(brandProfile)}. Email type: ${type}. ${spec || "Write a compelling email."}`
      );
      if (result.subject) {
        setRounds(r => [...r, { ...result, spec, round: r.length + 1 }]);
        onOutput("Email Template", result.subject);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <ToolSection title="Email Template Builder" desc="Emails your audience will actually open.">
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
          <div className="card output-card">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
              <OutputActions text={`Subject: ${round.subject}\n\n${round.body}`} />
            </div>
            <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 8, marginBottom: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>SUBJECT LINE</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{round.subject}</div>
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
    </ToolSection>
  );
}

// ─── Content Calendar ──────────────────────────────────────────────────────────
export function ContentCalendarTool({ brandProfile, onOutput }) {
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
    <ToolSection title="Content Calendar" desc="7 days of ready-to-post content ideas.">
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
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Day","Platform","Post Idea","Hashtags"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text2)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {round.calendar.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px", fontWeight: 600, color: "var(--teal)" }}>{row.day}</td>
                    <td style={{ padding: "12px", color: "var(--text2)" }}>{row.platform}</td>
                    <td style={{ padding: "12px", lineHeight: 1.5 }}>{row.idea}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {(row.hashtags || []).slice(0, 3).map(h => (
                          <span key={h} style={{ padding: "2px 8px", background: "var(--teal-glow)", border: "1px solid rgba(78,205,196,0.2)", borderRadius: 4, color: "var(--teal)", fontSize: 11 }}>#{h.replace("#","")}</span>
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
    </ToolSection>
  );
}

// ─── Content Copy Page ─────────────────────────────────────────────────────────
export function ContentCopyPage({ brandProfile, onOutput, favorites, onFavorite }) {
  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Content & Copy</h1>
      <p style={{ color: "var(--text2)", marginBottom: 40 }}>AI-powered content that sounds like you, scales like a team.</p>
      <AdCopyTool brandProfile={brandProfile} onOutput={onOutput} favorites={favorites} onFavorite={onFavorite} />
      <SocialBioTool brandProfile={brandProfile} onOutput={onOutput} favorites={favorites} onFavorite={onFavorite} />
      <EmailBuilderTool brandProfile={brandProfile} onOutput={onOutput} />
      <ContentCalendarTool brandProfile={brandProfile} onOutput={onOutput} />
    </div>
  );
}
