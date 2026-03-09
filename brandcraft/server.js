const express = require("express");
const cors    = require("cors");
const fetch   = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_KEY      = process.env.GROQ_API_KEY;       // existing
const GEMINI_KEY    = process.env.GEMINI_API_KEY;     // get free key at aistudio.google.com
const STABILITY_KEY = process.env.STABILITY_API_KEY;  // get at platform.stability.ai

// ── Groq chat proxy (unchanged) ──────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
      body:    JSON.stringify(req.body),
    });
    if (req.body.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      groqRes.body.pipe(res);
    } else {
      res.json(await groqRes.json());
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Gemini 2.0 Flash image generation ───────────────────────────────────────
// POST /api/gemini-image  { prompt: string }
// Returns { imageBase64: string, mimeType: string }
app.post("/api/gemini-image", async (req, res) => {
  if (!GEMINI_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not set in .env" });
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  try {
    const gemRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_KEY}`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      }
    );

    const data = await gemRes.json();
    if (!gemRes.ok) {
      return res.status(gemRes.status).json({ error: data?.error?.message || "Gemini API error" });
    }

    // Navigate candidates → content → parts to find the image
    const parts   = data?.candidates?.[0]?.content?.parts ?? [];
    const imgPart = parts.find(p => p.inlineData?.data);
    if (!imgPart) {
      const txt = parts.find(p => p.text)?.text ?? null;
      return res.status(502).json({ error: "Gemini returned no image", modelText: txt });
    }

    res.json({
      imageBase64: imgPart.inlineData.data,
      mimeType:    imgPart.inlineData.mimeType ?? "image/png",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Stability AI SDXL image generation ──────────────────────────────────────
// POST /api/stability-image  { prompt, negative_prompt, width, height, steps, cfg_scale }
// Returns { imageBase64: string }
app.post("/api/stability-image", async (req, res) => {
  if (!STABILITY_KEY) return res.status(500).json({ error: "STABILITY_API_KEY not set in .env" });
  const { prompt, negative_prompt, width = 1024, height = 1024, steps = 30, cfg_scale = 8 } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  try {
    const stabRes = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept":        "application/json",
          "Authorization": `Bearer ${STABILITY_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            { text: prompt,          weight:  1 },
            { text: negative_prompt || "blurry, low quality, watermark, distorted", weight: -1 },
          ],
          cfg_scale,
          width,
          height,
          samples: 1,
          steps,
        }),
      }
    );

    const data = await stabRes.json();
    if (!stabRes.ok) {
      return res.status(stabRes.status).json({ error: data?.message || "Stability API error" });
    }

    const b64 = data?.artifacts?.[0]?.base64;
    if (!b64) return res.status(502).json({ error: "Stability returned no image" });

    res.json({ imageBase64: b64 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ BrandCraft proxy running on http://localhost:${PORT}`));
