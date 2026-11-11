// Funzione Vercel: risponde alle domande della sezione «Chiedi AI».
// Serve la variabile d'ambiente ANTHROPIC_API_KEY (vedi README). La chiave resta sul server, mai nella pagina.
const KB = require("../knowledge.js");

const MODEL = process.env.ASK_MODEL || "claude-sonnet-5-5";
const MAX_MSG = 3000;     // caratteri per messaggio
const MAX_CTX = 24000;    // caratteri di dati allegati

function clean(messages) {
  if (!Array.isArray(messages)) return null;
  let out = messages
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_MSG) }))
    .slice(-8);
  while (out.length && out[0].role !== "user") out.shift();
  // ruoli alternati, si finisce con una domanda
  const alt = [];
  out.forEach(m => { if (!alt.length || alt[alt.length - 1].role !== m.role) alt.push(m); else alt[alt.length - 1] = m; });
  if (!alt.length || alt[alt.length - 1].role !== "user") return null;
  return alt;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "method" });

  // accetta solo richieste che arrivano dalla pagina stessa
  const origin = req.headers.origin;
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) return res.status(403).json({ error: "origin" }); }
    catch (e) { return res.status(403).json({ error: "origin" }); }
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "no_key" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  const messages = clean(body && body.messages);
  if (!messages) return res.status(400).json({ error: "bad_request" });
  const context = String((body && body.context) || "").slice(0, MAX_CTX);

  const system = KB + "\n\n# DATI AGGIORNATI (dalla pagina, ora)\n" + context;

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 50000);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 900, system, messages }),
      signal: ctl.signal
    });
    const j = await r.json().catch(() => null);
    if (!r.ok || !j) {
      const detail = String((j && j.error && (j.error.message || j.error.type)) || "").slice(0, 200);
      console.error("Anthropic API error", r.status, detail);
      return res.status(r.status === 429 ? 429 : 502).json({ error: r.status === 429 ? "rate_limited" : "upstream", status: r.status, detail });
    }
    const text = (j.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    if (!text) return res.status(502).json({ error: "empty" });
    return res.status(200).json({ text });
  } catch (e) {
    console.error("ask.js failure", e && e.message);
    return res.status(504).json({ error: "timeout", detail: String((e && e.message) || "").slice(0, 120) });
  } finally {
    clearTimeout(timer);
  }
};
