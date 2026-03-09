// ─── Logo Image Generation ────────────────────────────────────────────────────
// Two providers only: Gemini 2.0 Flash → Stability AI → Placeholder SVG

// ── 1. Gemini 2.0 Flash Image Generation (via /api/gemini-image proxy) ────────
async function tryGemini(prompt) {
  const enhancedPrompt =
    `${prompt}, professional logo design, clean vector art style, minimalist, ` +
    `solid white background, sharp edges, brand identity, high quality`;

  const res = await fetch("/api/gemini-image", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ prompt: enhancedPrompt }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Gemini: ${data.error || res.status}`);
  if (!data.imageBase64) throw new Error("Gemini: no image in response");

  return `data:${data.mimeType ?? "image/png"};base64,${data.imageBase64}`;
}

// ── 2. Stability AI SDXL (via /api/stability-image proxy) ────────────────────
async function tryStabilityAI(prompt) {
  const res = await fetch("/api/stability-image", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({
      prompt:          `${prompt}, modern professional logo design, vector art, clean white background, high quality`,
      negative_prompt: "blurry, photo, watermark, low quality, text overlay, ugly, distorted, noise",
      width:  1024,
      height: 1024,
      steps:  30,
      cfg_scale: 8,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Stability: ${data.error || res.status}`);
  if (!data.imageBase64) throw new Error("Stability: no image in response");

  return `data:image/png;base64,${data.imageBase64}`;
}

// ── Placeholder SVG (always works — last resort) ───────────────────────────────
function generatePlaceholderLogo(prompt) {
  const colors   = ["#7C4DFF", "#F050A8", "#FFB300", "#00C9B4", "#FF6B6B"];
  const color    = colors[Math.floor(Math.random() * colors.length)];
  const initials = prompt.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("") || "BC";

  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1"/>
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.55"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" fill="#f7f0ff"/>
    <circle cx="256" cy="220" r="160" fill="url(#g)"/>
    <text x="256" y="268" font-size="110" font-weight="bold" text-anchor="middle"
          fill="white" font-family="Arial, sans-serif">${initials}</text>
    <text x="256" y="420" font-size="26" text-anchor="middle"
          fill="${color}" font-family="Arial, sans-serif" font-weight="600"
          opacity="0.85">${prompt.slice(0, 22)}</text>
  </svg>`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

// ── Master cascade ─────────────────────────────────────────────────────────────
export async function generateLogoImage(prompt, onStatus) {
  const providers = [
    { name: "Gemini 2.0 Flash",  fn: tryGemini      },
    { name: "Stability AI SDXL", fn: tryStabilityAI },
  ];

  const errors = [];
  for (const p of providers) {
    try {
      onStatus?.(`Trying ${p.name}…`);
      const result = await p.fn(prompt);
      onStatus?.(`✓ Generated with ${p.name}`);
      return result;
    } catch (e) {
      console.warn(`${p.name} failed:`, e.message);
      errors.push(`${p.name}: ${e.message}`);
      onStatus?.(`⚠ ${p.name} failed, trying next…`);
    }
  }

  // Both failed — use placeholder
  console.warn("All providers failed, using placeholder:", errors.join(" | "));
  onStatus?.("⚠ Using placeholder logo (add API keys for real generation)");
  return generatePlaceholderLogo(prompt);
}
