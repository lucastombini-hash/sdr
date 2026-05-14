export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { script } = req.body;
  if (!script) return res.status(400).json({ error: "Script ausente" });

  const systemPrompt = `Voce e um especialista em vendas consultivas e qualificacao de leads. Recebera scripts ou transcricoes de ligacoes de SDR e deve gerar um briefing estruturado e objetivo para o closer fechar a venda. Responda APENAS com um JSON valido, sem markdown, sem comentarios, sem texto fora do JSON.

Estrutura JSON exigida:
{
  "nome_lead": "string",
  "empresa": "string",
  "cargo": "string",
  "cidade": "string",
  "temperatura": "Quente | Morno | Frio",
  "score": 0,
  "urgencia": 0,
  "faturamento_atual": "string",
  "meta_faturamento": "string",
  "budget": "Confirmado | Pronto para investir | Indefinido | Sem budget",
  "dores": ["string"],
  "desejos": ["string"],
  "necessidades": ["string"],
  "objecoes": ["string"],
  "contexto": "Resumo em 3-4 frases do momento atual do lead",
  "gancho_closer": "1 frase de abertura recomendada para o closer usar",
  "alertas": ["string"]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: "user", content: "Script:\n\n" + script }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || "Erro na API" });
    }

    const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
