const fetch = require("node-fetch");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  const { prompt } = req.body;

  if (!GEMINI_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }

  try {
    // Try Imagen 3 first
    const imagenRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            safetyFilterLevel: "block_only_high",
            personGeneration: "allow_adult",
          },
        }),
      }
    );

    const imagenData = await imagenRes.json();

    if (imagenRes.ok && imagenData?.predictions?.[0]?.bytesBase64Encoded) {
      return res.json({
        imageBase64: imagenData.predictions[0].bytesBase64Encoded,
        mimeType: imagenData.predictions[0].mimeType ?? "image/png",
      });
    }

    // Fallback to gemini-2.0-flash
    const gemRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      }
    );

    const gemData = await gemRes.json();
    if (!gemRes.ok) {
      return res.status(gemRes.status).json({ error: gemData?.error?.message || "Gemini API error" });
    }

    const parts = gemData?.candidates?.[0]?.content?.parts ?? [];
    const imgPart = parts.find(p => p.inlineData?.data);
    
    if (!imgPart) {
      return res.status(502).json({
        error: "Gemini returned no image",
        modelText: parts.find(p => p.text)?.text ?? null,
      });
    }

    return res.json({
      imageBase64: imgPart.inlineData.data,
      mimeType: imgPart.inlineData.mimeType ?? "image/png",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

