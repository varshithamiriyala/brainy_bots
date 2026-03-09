const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const IMAGE_KEY = process.env.REACT_APP_IMAGE_API_KEY;

// ── Groq proxy ──────────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    // Stream back if requested
    if (req.body.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      groqRes.body.pipe(res);
    } else {
      const data = await groqRes.json();
      res.json(data);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── getimg.ai image proxy ───────────────────────────────────────────────────
app.post("/api/image", async (req, res) => {
  try {
    const imgRes = await fetch("https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${IMAGE_KEY}`,
      },
      body: JSON.stringify(req.body),
    });
    const data = await imgRes.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Proxy server running at http://localhost:${PORT}`));
