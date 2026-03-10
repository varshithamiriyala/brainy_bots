const fetch = require("node-fetch");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const GROQ_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify(req.body),
    });

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
}

