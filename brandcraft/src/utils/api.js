// ─── Groq AI Calls (via local proxy) ─────────────────────────────────────────
const GROQ_MODEL = "llama-3.3-70b-versatile";

/**
 * Streaming AI call — calls onStream(text) incrementally
 */
export async function callAI(systemPrompt, userPrompt, onStream) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1500,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ") && line !== "data: [DONE]") {
          try {
            const data = JSON.parse(line.slice(6));
            const text = data.choices?.[0]?.delta?.content;
            if (text) {
              full += text;
              onStream?.(full);
            }
          } catch {}
        }
      }
    }
    return full;
  } catch (e) {
    throw new Error("Generation failed. Please try again.");
  }
}

/**
 * Non-streaming AI call that returns parsed JSON
 */
export async function callAIJSON(systemPrompt, userPrompt) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 1500,
        stream: false,
        messages: [
          { role: "system", content: systemPrompt + "\n\nRespond with valid JSON only, no markdown, no backticks." },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "{}";
    try {
      return JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      return { error: text };
    }
  } catch (e) {
    throw new Error("Generation failed. Please try again.");
  }
}
