// ─── Logo Image Generation ────────────────────────────────────────────────────
// Provider cascade: Gemini Imagen 3 → Stability AI v2beta Core → Placeholder SVG

// Shared negative prompt — prevents common AI logo failures
const NEGATIVE =
  "text, words, letters, watermark, blurry, noisy, photo, realistic, 3d render, " +
  "low quality, distorted, ugly, extra elements, cluttered background, dark background, " +
  "shadow, gradient background, multiple logos, duplicate, frame, border";

// Enrich prompt specifically for logo generation quality
function buildLogoPrompt(rawPrompt, style) {
  const styleGuides = {
    "Minimal Icon":     "single clean geometric icon, flat design, minimal shapes, negative space, bold silhouette, one or two colors max",
    "Wordmark":         "custom lettering wordmark, elegant typography, creative font treatment, text-only logo, refined kerning",
    "Badge / Emblem":   "circular badge emblem, symmetrical crest, enclosed design, detailed seal, premium heraldic style",
    "Abstract Mark":    "abstract geometric symbol, dynamic fluid shapes, modern mark, creative composition, bold abstract form",
  };
  const guide = styleGuides[style] || "professional logo mark";
  return (
    `${rawPrompt}. ${guide}. ` +
    `Pure white background, isolated logo, centered composition, vector graphic style, ` +
    `professional brand identity, scalable icon, crisp clean edges, high contrast, ` +
    `ready for business use, award-winning logo design`
  );
}

// ── 1. Gemini Imagen 3 (via /api/gemini-image) ────────────────────────────────
async function tryGemini(prompt, style) {
  const res = await fetch("/api/gemini-image", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ prompt: buildLogoPrompt(prompt, style) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini: ${data.error || res.status}`);
  if (!data.imageBase64) throw new Error("Gemini: no image returned");
  return `data:${data.mimeType ?? "image/png"};base64,${data.imageBase64}`;
}

// ── 2. Stability AI v2beta Core (via /api/stability-image) ───────────────────
async function tryStabilityAI(prompt, style) {
  const res = await fetch("/api/stability-image", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({
      prompt:          buildLogoPrompt(prompt, style),
      negative_prompt: NEGATIVE,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Stability: ${data.error || res.status}`);
  if (!data.imageBase64) throw new Error("Stability: no image returned");
  return `data:image/png;base64,${data.imageBase64}`;
}

// ── Placeholder SVG — only shown if BOTH APIs fail ───────────────────────────
function generatePlaceholderLogo(prompt, style) {
  const palettes = {
    "Minimal Icon":   ["#7C4DFF", "#5E35B1"],
    "Wordmark":       ["#F050A8", "#AD1457"],
    "Badge / Emblem": ["#FFB300", "#E65100"],
    "Abstract Mark":  ["#00C9B4", "#006064"],
  };
  const [c1, c2] = palettes[style] || ["#7C4DFF", "#F050A8"];
  const initials  = prompt.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).filter(Boolean).join("") || "BC";

  const shapes = {
    "Minimal Icon":   `<rect x="156" y="156" width="200" height="200" rx="40" fill="url(#g)" transform="rotate(45 256 256)"/>`,
    "Wordmark":       `<text x="256" y="278" font-size="96" font-weight="900" text-anchor="middle" fill="url(#g)" font-family="Georgia, serif">${initials}</text>`,
    "Badge / Emblem": `<circle cx="256" cy="256" r="170" fill="none" stroke="url(#g)" stroke-width="14"/><circle cx="256" cy="256" r="140" fill="none" stroke="url(#g)" stroke-width="4"/>`,
    "Abstract Mark":  `<polygon points="256,80 400,380 112,380" fill="none" stroke="url(#g)" stroke-width="16" stroke-linejoin="round"/>`,
  };
  const shape = shapes[style] || shapes["Minimal Icon"];

  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" fill="#ffffff"/>
    ${shape}
    ${style !== "Wordmark" ? `<text x="256" y="290" font-size="88" font-weight="700" text-anchor="middle" fill="${c1}" font-family="Arial, sans-serif" opacity="0.15">${initials}</text>` : ""}
    <text x="256" y="460" font-size="22" text-anchor="middle" fill="${c1}" font-family="Arial, sans-serif" font-weight="600" opacity="0.7">${style}</text>
  </svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// ── Master export ─────────────────────────────────────────────────────────────
// style = "Minimal Icon" | "Wordmark" | "Badge / Emblem" | "Abstract Mark"
export async function generateLogoImage(prompt, onStatus, style = "") {
  const providers = [
    { name: "Gemini Imagen 3",   fn: () => tryGemini(prompt, style)      },
    { name: "Stability AI Core", fn: () => tryStabilityAI(prompt, style) },
  ];

  const errors = [];
  for (const p of providers) {
    try {
      onStatus?.(`⚡ ${p.name}…`);
      const result = await p.fn();
      onStatus?.(`✓ ${p.name}`);
      return result;
    } catch (e) {
      console.warn(`[${p.name}] failed:`, e.message);
      errors.push(`${p.name}: ${e.message}`);
      onStatus?.(`↳ ${p.name} failed, trying next…`);
    }
  }

  // Last resort placeholder — much better than before, style-specific shapes
  console.warn("All providers failed:", errors.join(" | "));
  onStatus?.("⚠ Using placeholder — check API keys in .env");
  return generatePlaceholderLogo(prompt, style);
}
