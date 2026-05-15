export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { script } = req.body;
  if (!script) return res.status(400).json({ error: "Script ausente" });

  const systemPrompt = `Voce e um especialista em analise de performance de closers e reunioes de vendas consultivas. Sera fornecida a transcricao de uma reuniao de vendas da Trafega e voce deve analisar a performance do closer com rigor e clareza, como um gestor experiente faria em uma sessao de coaching.

A reuniao de vendas da Trafega segue este roteiro:
1. ABERTURA: retomar contexto do SDR, mostrar que conhece o negocio do lead, criar conexao
2. DIAGNOSTICO PROFUNDO: aprofundar dores, entender processo comercial atual, historico com marketing, metas
3. APRESENTACAO DA SOLUCAO: apresentar o metodo (AutoScale ou Trafega Midia) personalizado para o perfil
4. USO DE CASES: apresentar cases relevantes do mesmo segmento ou mesma dor
5. PROPOSTA COMERCIAL: apresentar os 3 planos (trimestral, semestral, anual), recomendar o semestral
6. MANEJO DE OBJECOES: tratar objecoes de preco, tempo, concorrencia, desconfianca
7. FECHAMENTO: identificar sinal de compra, propor inicio, definir proximo passo concreto

Produtos da Trafega:
- AUTOSCALE: exclusivo para centros automotivos e oficinas mecanicas
- TRAFEGA MIDIA: para todos os outros segmentos
- Precos: Trimestral R$3.000/mes, Semestral R$2.500/mes (mais escolhido), Anual R$2.000/mes

Analise com base nos seguintes criterios:
1. Abertura e retomada de contexto do SDR
2. Profundidade do diagnostico
3. Escuta ativa e perguntas de aprofundamento
4. Apresentacao da solucao personalizada
5. Uso de cases e provas sociais
6. Apresentacao e ancoragem de preco
7. Manejo de objecoes
8. Tentativas de fechamento
9. Definicao de proximo passo concreto
10. Tom, confianca e postura consultiva

Responda APENAS com JSON valido, sem markdown, sem comentarios, sem texto fora do JSON.

Estrutura JSON exigida:
{
  "nome_closer": "string",
  "nome_lead": "string",
  "empresa_lead": "string",
  "produto_apresentado": "AutoScale | Trafega Midia | Nao identificado",
  "resultado": "Fechou | Nao fechou | Reagendou | Em negociacao",
  "nota_geral": 0,
  "classificacao": "Excelente | Bom | Regular | Precisa melhorar | Critico",
  "notas_por_criterio": {
    "abertura_contexto": { "nota": 0, "observacao": "string" },
    "diagnostico": { "nota": 0, "observacao": "string" },
    "escuta_ativa": { "nota": 0, "observacao": "string" },
    "apresentacao_solucao": { "nota": 0, "observacao": "string" },
    "uso_de_cases": { "nota": 0, "observacao": "string" },
    "apresentacao_preco": { "nota": 0, "observacao": "string" },
    "manejo_objecoes": { "nota": 0, "observacao": "string" },
    "tentativas_fechamento": { "nota": 0, "observacao": "string" },
    "proximo_passo": { "nota": 0, "observacao": "string" },
    "postura_consultiva": { "nota": 0, "observacao": "string" }
  },
  "pontos_positivos": ["string"],
  "falhas": ["string"],
  "o_que_corrigir": ["string"],
  "como_melhorar": ["string"],
  "objecoes_identificadas": [
    { "objecao": "string", "como_foi_tratada": "string", "deveria_ter_sido": "string" }
  ],
  "tentativas_fechamento_identificadas": ["string"],
  "sugestao_roleplay": "string",
  "resumo_coach": "string"
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
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: "user", content: "Transcricao da reuniao de vendas:\n\n" + script }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || "Erro na API" });
    }

    const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    let clean = text.replace(/```json|```/g, "").trim();
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      clean = clean.slice(firstBrace, lastBrace + 1);
    }
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
