// Interpreta a descrição (e o print, se houver) e sugere personagens prováveis.
// Precisa da variável ANTHROPIC_API_KEY. O modelo pode ser trocado em AI_MODEL.
const MODEL = process.env.AI_MODEL || "claude-sonnet-5-5";

export function aiEnabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function buildPrompt(description, hasImage) {
  return `Você identifica personagens de anime pela aparência (rosto, cabelo, olhos, marcas, roupas, acessórios).
Descrição do usuário: """${description || "(sem texto)"}"""
${hasImage ? "Há um print de uma cena anexado. Use-o junto com a descrição." : ""}
Responda SOMENTE com JSON, neste formato:
{"resultados":[{"personagem":"nome do personagem como é mais conhecido","nomes_busca":["nome em romaji na ordem japonesa","nome na ordem ocidental","grafia do AniList, ex. com ou longo"],"anime":"nome do anime em romaji","anime_br":"nome do anime como é conhecido no Brasil","confianca":0-100,"por_que":"1-2 frases em português do Brasil ligando a descrição ao personagem"}]}
Regras: até 4 resultados, do mais provável ao menos provável. Só personagens que existem de verdade. Nada de conteúdo adulto. Se nada combinar, responda {"resultados":[]}.`;
}

export function parseJson(text) {
  const t = String(text || "").trim();
  try { return JSON.parse(t); } catch {}
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) { try { return JSON.parse(fence[1]); } catch {} }
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch {} }
  return null;
}

export async function guessCharacters(description, image) {
  const content = [];
  if (image) content.push({ type: "image", source: { type: "base64", media_type: image.mediaType, data: image.base64 } });
  content.push({ type: "text", text: buildPrompt(description, Boolean(image)) });

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 1200, messages: [{ role: "user", content }] }),
  });
  if (!r.ok) throw new Error(`IA respondeu ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  const text = (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
  const data = parseJson(text);
  return Array.isArray(data?.resultados) ? data.resultados.slice(0, 4) : [];
}
