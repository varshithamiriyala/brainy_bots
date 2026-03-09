// ─── Logo Image Generation — cascade across 5 providers ────────────────────
// Falls through providers in order; first success wins.

const IMAGE_API_KEY = process.env.REACT_APP_IMAGE_API_KEY;

// 1. Unsplash API — 100% free, no auth required for basic use
async function tryUnsplash(prompt) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt + " logo")}&client_id=YOUR_UNSPLASH_ACCESS_KEY&count=1`;
  // Fallback: use a placeholder-based approach if API key not available
  const searchUrl = `https://source.unsplash.com/512x512/?${encodeURIComponent(prompt)},logo,design`;
  const res = await fetch(searchUrl, { method: 'GET' });
  if (!res.ok) throw new Error(`Unsplash ${res.status}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// 2. Pollinations.ai — 100% free, improved with better parameters
async function tryPollinations(prompt) {
  const encoded = encodeURIComponent(
    prompt + ", modern professional logo design, vector art, minimalist, clean white background, high quality"
  );
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations ${res.status}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// 3. getimg.ai (via local proxy)
async function tryGetimgAI(prompt) {
  const res = await fetch("/api/image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: prompt + ", modern logo design, professional, clean",
      negative_prompt: "blurry, watermark, low quality, distorted, photo, realistic, text overlay, ugly",
      width: 1024,
      height: 1024,
      steps: 30,
      guidance: 8,
      output_format: "jpeg",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`getimg.ai ${res.status}: ${data?.error?.message || JSON.stringify(data).slice(0, 100)}`);
  if (!data.image) throw new Error("getimg.ai: no image in response");
  return `data:image/jpeg;base64,${data.image}`;
}

// 4. Leonardo.ai — async polling
async function tryLeonardoAI(prompt) {
  const createRes = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${IMAGE_API_KEY}` },
    body: JSON.stringify({
      prompt: prompt + ", modern professional logo design, vector art, clean background",
      negative_prompt: "blurry, watermark, low quality, photo, realistic, text",
      modelId: "b24e16ff-06e3-43eb-8d33-4416c2d75876",
      width: 1024,
      height: 1024,
      num_images: 1,
      guidance_scale: 8,
      num_inference_steps: 30,
    }),
  });
  const createData = await createRes.json();
  if (!createRes.ok) throw new Error(`Leonardo ${createRes.status}: ${JSON.stringify(createData).slice(0, 100)}`);
  const genId = createData?.sdGenerationJob?.generationId;
  if (!genId) throw new Error("Leonardo: no generationId");

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const pollRes = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${genId}`, {
      headers: { Authorization: `Bearer ${IMAGE_API_KEY}` },
    });
    const pollData = await pollRes.json();
    const gen = pollData?.generations_by_pk;
    if (gen?.status === "COMPLETE") {
      const imgUrl = gen.generated_images?.[0]?.url;
      if (!imgUrl) throw new Error("Leonardo: no image URL");
      return imgUrl;
    }
    if (gen?.status === "FAILED") throw new Error("Leonardo: generation failed");
  }
  throw new Error("Leonardo: timed out");
}

// 5. Stability AI — fixed dimensions for SDXL compliance
async function tryStabilityAI(prompt) {
  const res = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      Accept: "application/json", 
      Authorization: `Bearer ${IMAGE_API_KEY}` 
    },
    body: JSON.stringify({
      text_prompts: [
        { text: prompt + ", modern professional logo design, vector art, clean", weight: 1 },
        { text: "blurry, photo, watermark, low quality, text overlay, ugly, distorted", weight: -1 }
      ],
      cfg_scale: 8,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Stability ${res.status}: ${data?.message || JSON.stringify(data).slice(0, 100)}`);
  if (!data.artifacts?.[0]?.base64) throw new Error("Stability: no image");
  return `data:image/png;base64,${data.artifacts[0].base64}`;
}

/**
 * Fallback: Generate placeholder SVG logo if all providers fail
 */
function generatePlaceholderLogo(prompt) {
  const colors = ["#4ECDC4", "#FF6B6B", "#FFE66D", "#95E1D3", "#F38181"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const initials = prompt
    .split(" ")
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join("");
  
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.6" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="#f0f4ff"/>
      <circle cx="256" cy="256" r="180" fill="url(#grad)"/>
      <text x="256" y="300" font-size="120" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">
        ${initials || "?"}
      </text>
      <text x="256" y="420" font-size="24" text-anchor="middle" fill="${color}" font-family="Arial" font-weight="500">
        ${prompt.slice(0, 20)}
      </text>
    </svg>
  `;
  
  const blob = new Blob([svg], { type: "image/svg+xml" });
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * Master cascade: tries all providers in order, returns first success
 */
export async function generateLogoImage(prompt, onStatus) {
  const providers = [
    { name: "Unsplash (free)",         fn: tryUnsplash },
    { name: "Pollinations.ai (free)",  fn: tryPollinations },
    { name: "getimg.ai",               fn: tryGetimgAI },
    { name: "Leonardo.ai",             fn: tryLeonardoAI },
    { name: "Stability AI",            fn: tryStabilityAI },
  ];
  const errors = [];
  for (const p of providers) {
    try {
      onStatus?.(`Trying ${p.name}…`);
      const result = await p.fn(prompt);
      onStatus?.(`✓ ${p.name}`);
      return result;
    } catch (e) {
      console.warn(`${p.name} failed:`, e.message);
      errors.push(`${p.name}: ${e.message}`);
    }
  }
  
  // Fallback to placeholder
  console.warn("All image providers failed, using placeholder:", errors.join(" | "));
  onStatus?.("⚠ Using placeholder logo");
  try {
    return await generatePlaceholderLogo(prompt);
  } catch (e) {
    throw new Error(`All providers failed:\n${errors.join("\n")}`);
  }
}
