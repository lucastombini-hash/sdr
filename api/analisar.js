export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { script } = req.body;
  if (!script) return res.status(400).json({ error: "Script ausente" });

  const scriptPadrao = `SCRIPT PADRAO TRAFEGA:
[PRIMEIRO CONTATO] Bom dia, Joao? Aqui e [NOME] tudo bem contigo?
[CONFIRMAR INTERESSE] Entao Joao, acabei de receber seu contato aqui para participar de uma consultoria gratuita com nosso time de especialistas em marketing e vendas da TRAFEGA, Confirma se foi isso mesmo?
[EXPLICA O PROCESSO] Beleza meu querido, entao veja so... A nossa ligacao e bem rapida e o objetivo e entender um pouco mais sobre o seu negocio e os desafios que vem enfrentando, assim eu vou conseguir te dizer se a TRAFEGA realmente consegue te ajudar e com isso agendar nossa consultoria gratuita.
[PERGUNTAS DE QUALIFICACAO]
1. Voce pode me contar um pouco sobre o seu negocio? Que tipo de produto ou servico voces oferecem, e o que voces estao buscando hoje?
2. Voce ja fez trafego pago alguma vez? Se sim: Quanto ja investiu? Como foi a experiencia?
3. Falando nos objetivos, qual e o principal desafio que voce gostaria de resolver? Voces estao focados em aumentar as vendas, atrair mais leads, ou talvez fortalecer a marca?
4. Voce esta satisfeito com o volume de vendas que esta tendo atualmente?
5. E hoje voce tem algum socio? Tem mais alguem que voce ache relevante para participar da reuniao?
6. [VALIDACAO] Joao, deixa eu ver se entendi, hoje voce possui um NEGOCIO X, que faz entre X e Y por mes e seu principal desafio e acelerar a geracao de clientes, certo?
7. [PRIORIDADE] Hoje mudar esse cenario de vendas e ter uma empresa que vai te ajudar nisso, e algo que voce pretende investir por agora ou so mais para frente?
[AGENDAMENTO] Propoe 2 horarios, confirma email, cria grupo, explica que nao e so reuniao de vendas, pede para avisar se nao puder comparecer.`;

  const systemPrompt = `Voce e um especialista em treinamento de times comerciais e analise de performance de SDR. Sera fornecido o script padrao da empresa e a transcricao de uma ligacao real de um SDR. Sua funcao e analisar a performance do SDR com rigor e clareza, como um gestor experiente faria em uma sessao de coaching.

Analise com base nos seguintes criterios:

1. BANT: Budget (orcamento/faturamento identificado), Authority (decisor identificado), Need (necessidade/dor aprofundada), Timeline (urgencia e timing para investir)
2. Aderencia ao script padrao: verificar se seguiu as etapas na ordem correta
3. Abertura e rapport: apresentacao clara, conexao antes das perguntas
4. Qualificacao: profundidade das perguntas, se explorou as dores ou ficou na superficie
5. Escuta ativa: deixou o lead falar, fez perguntas de continuidade, nao atropelou
6. Controle da ligacao: manteve fio condutor, recuperou quando lead desviou
7. Manejo de objecoes: identificou e rebateu objecoes implicitas e explicitas
8. Agendamento: criou urgencia, confirmou decisor, deixou claro o proximo passo
9. Tom e confianca: seguranca na voz, linguagem adequada, evitou vicio de linguagem (ne, entendeu, tipo)
10. Nota geral de performance

Responda APENAS com JSON valido, sem markdown, sem comentarios, sem texto fora do JSON.

Estrutura JSON exigida:
{
  "nome_sdr": "string (tente identificar pelo contexto ou use Nao identificado)",
  "nome_lead": "string",
  "nota_geral": 0,
  "classificacao": "Excelente | Bom | Regular | Precisa melhorar | Critico",
  "bant": {
    "budget": { "identificado": true, "nota": 0, "observacao": "string" },
    "authority": { "identificado": true, "nota": 0, "observacao": "string" },
    "need": { "identificado": true, "nota": 0, "observacao": "string" },
    "timeline": { "identificado": true, "nota": 0, "observacao": "string" }
  },
  "aderencia_script": {
    "nota": 0,
    "etapas_seguidas": ["string"],
    "etapas_puladas": ["string"],
    "etapas_fora_de_ordem": ["string"]
  },
  "pontos_positivos": ["string"],
  "falhas": ["string"],
  "melhorias": ["string"],
  "o_que_corrigir": ["string"],
  "como_melhorar": ["string"],
  "sugestao_roleplay": "string (descreva um cenario de roleplay especifico para treinar o ponto mais critico identificado)",
  "resumo_coach": "string (paragrafo direto como um gestor falaria para o SDR em uma sessao de feedback)"
}`;

  const userMessage = scriptPadrao + "\n\n---\n\nTRANSCRICAO DA LIGACAO REAL:\n\n" + script;

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
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
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
