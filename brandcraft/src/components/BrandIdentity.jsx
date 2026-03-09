import { useState } from "react";
import { callAIJSON } from "../utils/api";
import { generateLogoImage } from "../utils/imageProviders";
import { SkeletonCard, OutputActions, GenerateMorePanel, ToolSection } from "./UI";
import Icon from "./Icon";

// ─── Brand Names ───────────────────────────────────────────────────────────────
export function BrandNamesTool({ brandProfile, onOutput, favorites, onFavorite, selectedOutputs, onSelect }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async (spec = "") => {
    setLoading(true); setError("");
    try {
      const result = await callAIJSON(
        "You are a creative brand naming expert. Return JSON with a 'names' array of 6 objects, each with 'name' (string) and 'reason' (1-sentence string).",
        `Brand profile: ${JSON.stringify(brandProfile)}. ${spec ? `Focus: ${spec}` : "Generate unique brand names that fit this brand perfectly."}`
      );
      if (result.names) {
        setRounds(r => [...r, { names: result.names, spec, round: r.length + 1 }]);
        onOutput("Brand Names", result.names[0]?.name);
      }
    } catch { setError("Generation failed. Please try again."); }
    setLoading(false);
  };

  return (
    <ToolSection title="Brand Name Generator" desc="AI-powered names tailored to your brand profile.">
      {rounds.length === 0 && !loading && (
        <button className="btn-primary" onClick={() => generate()}>Generate Names</button>
      )}
      {loading && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>{[...Array(6)].map((_, i) => <SkeletonCard key={i} lines={2} />)}</div>}
      {error && <div style={{ color: "#FF6B6B", fontSize: 14 }}>{error} <button className="btn-ghost btn-sm" onClick={() => generate()}>Retry</button></div>}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round}{round.spec ? ` · ${round.spec}` : ""}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {round.names.map((n, i) => {
              const id = `names-${ri}-${i}`;
              return (
                <div key={i} className="card output-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800, color: "var(--teal)", marginBottom: 8 }}>{n.name}</div>
                    <OutputActions text={n.name} starred={favorites.includes(id)} onStar={() => onFavorite(id)} onSelect={onSelect} selected={selectedOutputs["Brand Names"] === id} feature="Brand Names" id={id} />
                  </div>
                  <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.6 }}>{n.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["More Playful","More Professional","Shorter Names","Unique/Invented","More Descriptive","International Feel"]} />
      )}
    </ToolSection>
  );
}

// ─── Color Palette ─────────────────────────────────────────────────────────────
export function ColorPaletteTool({ brandProfile, onOutput, favorites, onFavorite, selectedOutputs, onSelect }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedHex, setCopiedHex] = useState("");

  const generate = async (spec = "") => {
    setLoading(true);
    try {
      const result = await callAIJSON(
        "You are a brand color expert. Return JSON with a 'palette' array of exactly 5 objects, each with 'hex' (e.g. #FF5733), 'name' (string), 'role' (Primary/Secondary/Accent/Neutral/Background).",
        `Brand profile: ${JSON.stringify(brandProfile)}. ${spec || "Generate a professional brand color palette."}`
      );
      if (result.palette) {
        setRounds(r => [...r, { palette: result.palette, spec, round: r.length + 1 }]);
        onOutput("Color Palette", result.palette.map(c => c.hex).join(", "));
      }
    } catch {}
    setLoading(false);
  };

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(""), 1500);
  };

  return (
    <ToolSection title="Color Palette Generator" desc="Perfect colors that match your brand vibe.">
      {rounds.length === 0 && !loading && <button className="btn-primary" onClick={() => generate()}>Generate Palette</button>}
      {loading && <div style={{ display: "flex", gap: 12 }}>{[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, flex: 1, borderRadius: 12 }} />)}</div>}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round}</div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <OutputActions text={`Color Palette: ${round.palette.map(c => `${c.name} (${c.hex}) - ${c.role}`).join(', ')}`} onSelect={onSelect} selected={selectedOutputs["Color Palette"] === `palette-${ri}`} feature="Color Palette" id={`palette-${ri}`} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {round.palette.map((c, i) => (
              <div key={i} style={{ flex: "1 1 100px", minWidth: 90 }}>
                <div onClick={() => copyHex(c.hex)}
                  style={{ height: 100, borderRadius: 12, background: c.hex, cursor: "pointer", transition: "transform 0.2s", display: "flex", alignItems: "flex-end", padding: 8, position: "relative" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  {copiedHex === c.hex && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", borderRadius: 12, color: "#fff", fontSize: 12, fontWeight: 600 }}>Copied!</div>}
                </div>
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{c.hex}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{c.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["Darker","Lighter","More Vibrant","More Muted","Warmer","Cooler","More Contrast","Pastel"]} />
      )}
    </ToolSection>
  );
}

// ─── Font Pairing ──────────────────────────────────────────────────────────────
export function FontPairingTool({ brandProfile, onOutput, selectedOutputs, onSelect }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async (spec = "") => {
    setLoading(true);
    try {
      const result = await callAIJSON(
        "You are a typography expert. Return JSON: {pairs: [{heading: string, body: string, reason: string, css: string}]} with 3 Google Font pairs.",
        `Brand: ${JSON.stringify(brandProfile)}. ${spec || "Suggest professional font pairings."}`
      );
      if (result.pairs) {
        setRounds(r => [...r, { pairs: result.pairs, spec, round: r.length + 1 }]);
        onOutput("Font Pairing", result.pairs[0]?.heading + " + " + result.pairs[0]?.body);
      }
    } catch {}
    setLoading(false);
  };

  return (
    <ToolSection title="Typography Pairing" desc="Font combinations that look professionally made.">
      {rounds.length === 0 && !loading && <button className="btn-primary" onClick={() => generate()}>Generate Font Pairs</button>}
      {loading && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={4} />)}</div>}
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <div className="round-label">Round {round.round}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {round.pairs.map((pair, i) => (
              <div key={i} className="card">
                <link href={`https://fonts.googleapis.com/css2?family=${pair.heading?.replace(/ /g,"+")}:wght@700&family=${pair.body?.replace(/ /g,"+")}:wght@400;500&display=swap`} rel="stylesheet" />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div></div>
                  <OutputActions text={`Font Pairing: ${pair.heading} + ${pair.body} - ${pair.reason}`} onSelect={onSelect} selected={selectedOutputs["Font Pairing"] === `font-${ri}-${i}`} feature="Font Pairing" id={`font-${ri}-${i}`} />
                </div>
                <div style={{ fontFamily: `'${pair.heading}', serif`, fontSize: 32, fontWeight: 700, marginBottom: 8 }}>The quick brown fox</div>
                <div style={{ fontFamily: `'${pair.body}', sans-serif`, fontSize: 15, color: "var(--text2)", lineHeight: 1.7, marginBottom: 12 }}>
                  Your brand story deserves typography that communicates trust and identity.
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 12, color: "var(--teal)", fontWeight: 600 }}>{pair.heading}</span>
                    <span style={{ fontSize: 12, color: "var(--text3)", margin: "0 6px" }}>+</span>
                    <span style={{ fontSize: 12, color: "var(--text2)" }}>{pair.body}</span>
                    {pair.reason && <span style={{ fontSize: 11, color: "var(--text3)", display: "block", marginTop: 4 }}>{pair.reason}</span>}
                  </div>
                  <button className="btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(pair.css || `font-family: '${pair.heading}', serif;`)}>
                    <Icon name="copy" size={12} /> Copy CSS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["More Modern","More Classic","More Playful","More Elegant","Bolder Heading","Lighter Body"]} />
      )}
    </ToolSection>
  );
}

// ─── Logo Creator ──────────────────────────────────────────────────────────────
export function LogoCreatorTool({ brandProfile, onOutput, selectedOutputs, onSelect }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState(-1);
  const [error, setError] = useState("");
  const [styleNotes, setStyleNotes] = useState("");
  const [colorPref, setColorPref] = useState("");
  const [avoid, setAvoid] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const buildPrompts = (spec = "") => {
    const industry = brandProfile?.industry || "business";
    const aesthetic = brandProfile?.aesthetic || "modern";
    const colorMood = brandProfile?.colorMood || "cool";
    const voice = brandProfile?.voice || "professional";
    const extras = [styleNotes && `Style notes: ${styleNotes}`, colorPref && `Color preference: ${colorPref}`, avoid && `Avoid: ${avoid}`, spec].filter(Boolean).join(". ");
    const base = `professional logo design for ${industry} brand, ${aesthetic} aesthetic, ${colorMood} color palette, ${voice} feel, ${extras}, clean white background, vector style, isolated logo mark`;
    return [
      { style: "Minimal Icon", prompt: `${base}, minimal geometric icon logo, simple bold symbol, negative space, flat design, single icon mark` },
      { style: "Wordmark", prompt: `${base}, wordmark logo, elegant custom typography, lettering design, typographic logo, text based logo, creative font` },
      { style: "Badge / Emblem", prompt: `${base}, emblem badge logo, circular seal design, symmetrical, detailed crest, premium feel, enclosed design` },
      { style: "Abstract Mark", prompt: `${base}, abstract logo mark, creative fluid shapes, modern abstract symbol, gradient colors, dynamic form, innovative design` },
    ];
  };

  const generate = async (spec = "") => {
    setLoading(true); setError(""); setStatusMsg("");
    const prompts = buildPrompts(spec);
    const logos = [];
    try {
      for (let i = 0; i < prompts.length; i++) {
        setLoadingIdx(i);
        setStatusMsg(`Generating ${prompts[i].style}...`);
        const imageUrl = await generateLogoImage(prompts[i].prompt, (msg) => setStatusMsg(`[${i+1}/4] ${prompts[i].style}: ${msg}`));
        logos.push({ style: prompts[i].style, imageUrl, prompt: prompts[i].prompt });
        setStatusMsg(`✓ ${prompts[i].style} done`);
      }
      setRounds(r => [...r, { logos, spec, round: r.length + 1 }]);
      onOutput("Logo Creator", "4 AI logo images generated");
      setStatusMsg("");
    } catch (e) {
      setError(e.message || "Generation failed.");
      setStatusMsg("");
    }
    setLoading(false);
    setLoadingIdx(-1);
  };

  const downloadImage = (imageUrl, name) => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `logo-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  };

  const styleLabels = ["Minimal Icon", "Wordmark", "Badge / Emblem", "Abstract Mark"];

  return (
    <ToolSection title="Logo Creator" desc="Real AI-generated logo images powered by Stable Diffusion XL.">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20, maxWidth: 560 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6 }}>Style notes</label>
            <input className="input-base" placeholder="e.g. use geometric shapes" value={styleNotes} onChange={e => setStyleNotes(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6 }}>Color preference</label>
            <input className="input-base" placeholder="e.g. navy blue and gold" value={colorPref} onChange={e => setColorPref(e.target.value)} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, color: "var(--text2)", display: "block", marginBottom: 6 }}>Avoid</label>
          <input className="input-base" placeholder="e.g. no circles, no dark backgrounds" value={avoid} onChange={e => setAvoid(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={() => generate()} disabled={loading} style={{ alignSelf: "flex-start" }}>
          {loading ? `Generating… (${Math.max(loadingIdx, 0) + 1}/4)` : "Generate Logos"}
        </button>
      </div>

      {loading && (
        <div style={{ marginBottom: 20 }}>
          {statusMsg && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(78,205,196,0.07)", border: "1px solid rgba(78,205,196,0.2)", borderRadius: 8, marginBottom: 12, fontSize: 12, color: "var(--teal)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--teal)", animation: "pulse-glow 1s infinite" }} />
              {statusMsg}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {styleLabels.map((label, i) => (
              <div key={i} style={{ borderRadius: 14, border: `1px solid ${i === loadingIdx ? "rgba(78,205,196,0.4)" : "var(--border)"}`, background: "var(--card)", overflow: "hidden" }}>
                <div className="skeleton" style={{ height: 200, borderRadius: 0, opacity: i === loadingIdx ? 1 : i < loadingIdx ? 0.2 : 0.4 }} />
                <div style={{ padding: "10px 14px", fontSize: 12, color: i < loadingIdx ? "#4ECDC4" : i === loadingIdx ? "var(--teal)" : "var(--text3)", fontWeight: i <= loadingIdx ? 600 : 400 }}>
                  {i < loadingIdx ? `✓ ${label}` : i === loadingIdx ? `⟳ ${label}` : label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ padding: "16px 18px", background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ color: "#FF6B6B", fontWeight: 600, fontSize: 14 }}>⚠ Image generation failed</span>
            <button className="btn-ghost btn-sm" onClick={() => generate()}>Retry</button>
          </div>
          <pre style={{ color: "rgba(255,107,107,0.8)", fontSize: 11, whiteSpace: "pre-wrap", lineHeight: 1.6, margin: 0, fontFamily: "monospace" }}>{error}</pre>
        </div>
      )}

      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 28 }}>
          <div className="round-label">Round {round.round}{round.spec ? ` · ${round.spec}` : ""}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {round.logos.map((logo, i) => (
              <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220 }}>
                  <img src={logo.imageUrl} alt={logo.style} style={{ width: "100%", height: 220, objectFit: "contain", display: "block" }} />
                </div>
                <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{logo.style}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>512 × 512 · PNG</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <OutputActions text={`Logo: ${logo.style} - ${logo.prompt}`} onSelect={onSelect} selected={selectedOutputs["Logo Creator"] === `logo-${ri}-${i}`} feature="Logo Creator" id={`logo-${ri}-${i}`} />
                    <button className="action-btn" title="Download PNG" onClick={() => downloadImage(logo.imageUrl, logo.style)}>
                      <Icon name="download" size={13} />
                    </button>
                    <button className="action-btn" title="Copy prompt" onClick={() => navigator.clipboard.writeText(logo.prompt)}>
                      <Icon name="copy" size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {rounds.length > 0 && (
        <GenerateMorePanel loading={loading} onGenerate={generate}
          chips={["More Minimal","More Bold","Different Colors","More Premium","More Playful","More Modern","More Classic","Darker Theme","Lighter Theme"]} />
      )}
    </ToolSection>
  );
}

// ─── Brand Identity Page ───────────────────────────────────────────────────────
export function BrandIdentityPage({ brandProfile, onOutput, favorites, onFavorite, selectedOutputs, onSelect }) {
  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>Brand Identity</h1>
      <p style={{ color: "var(--text2)", marginBottom: 40 }}>Build the visual and verbal foundation of your brand.</p>
      <BrandNamesTool brandProfile={brandProfile} onOutput={onOutput} favorites={favorites} onFavorite={onFavorite} selectedOutputs={selectedOutputs} onSelect={onSelect} />
      <LogoCreatorTool brandProfile={brandProfile} onOutput={onOutput} favorites={favorites} onFavorite={onFavorite} selectedOutputs={selectedOutputs} onSelect={onSelect} />
      <ColorPaletteTool brandProfile={brandProfile} onOutput={onOutput} favorites={favorites} onFavorite={onFavorite} selectedOutputs={selectedOutputs} onSelect={onSelect} />
      <FontPairingTool brandProfile={brandProfile} onOutput={onOutput} favorites={favorites} onFavorite={onFavorite} selectedOutputs={selectedOutputs} onSelect={onSelect} />
    </div>
  );
}
