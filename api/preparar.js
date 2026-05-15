export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { briefing } = req.body;
  if (!briefing) return res.status(400).json({ error: "Briefing ausente" });

  const conhecimento = `
TRAFEGA MIDIA:
- Servico: gestao completa de trafego pago (Meta Ads + Google Ads) + processo comercial + consultoria de conversao
- Para quem: empresas em geral (comercio, servicos, qualquer segmento) que querem gerar demanda digital
- Time entregue: coordenador de projetos, gestor de campanhas, consultor comercial, designer de performance
- Linha do tempo: 7 dias integracao, 30 dias campanhas no ar, 2o mes metricas, 3o mes equilibrio, 4o mes+ escala
- Resultado exemplo: R$64.340 em vendas com R$2.858 investidos (ROAS 22,51x) em fevereiro/2026
- Precos: Trimestral R$3.000/mes (ou R$8.500 a vista), Semestral R$2.500/mes (ou R$14.000 a vista), Anual R$2.000/mes (ou R$22.000 a vista)
- Mais escolhido: Semestral

AUTOSCALE (Trafega Auto):
- Servico: sistema especializado EXCLUSIVAMENTE para centros automotivos e oficinas mecanicas
- Metodo: Qualificacao Inteligente + Conversao Comercial + Escala e Previsibilidade
- Inclui: Meta Ads + Google Ads + auditoria oculta de conversao + acompanhamento de dados de vendas
- Diferencial: foco em lotar o patio, atrair clientes de maior ticket, aumentar conversao de orcamentos
- Linha do tempo: 5 dias integracao, 30 dias primeiros clientes aparecem, 2o mes metricas, 3o mes equilibrio, 4o mes+ escala
- Resultado exemplo: Anderson +25% clientes locais; Carlos Motors carros agendados em 3 dias
- Precos: Trimestral R$3.000/mes (ou R$8.500 a vista), Semestral R$2.500/mes (ou R$14.000 a vista), Anual R$2.000/mes (ou R$22.000 a vista)
- Mais escolhido: Semestral

CASES REAIS DA TRAFEGA:

1. Evolux | Piso Vinilico | AutoScale
   Dor: Comecando negocio do zero, inseguro
   Resultado: 17 obras nos primeiros 20 dias de anuncios ativos, parceria de 8+ meses
   Depoimento: "Nao esperava esse resultado, foi melhor que imaginei"
   Link: https://www.instagram.com/reel/DTOklBHEgTs/
   Quebra objecao: Medo de comecar / investir
   Prova: ALTO

2. DiskPizza | Delivery de Pizza | Trafega Midia
   Dor: Ja investia com agencia e resultado nao vinha
   Resultado: R$100.000 em vendas no segundo mes, triplicou volume de pedidos, passou de R$60k para R$120k/mes
   Depoimento: "A gente triplicou o volume de pedidos"
   Link: https://www.instagram.com/reel/DSBNVVojsTK/
   Quebra objecao: Resultado demora acontecer / ja tentei agencia antes
   Prova: ALTO

3. Jormaq | Moveis Corporativos | Trafega Midia
   Dor: Dono fazia os proprios anuncios sem tempo e sem resultado profissional
   Resultado: Custo por lead caiu, conversao aumentou, cliente desde jan/2025 ate hoje (maio/2026)
   Depoimento: "Alcancamos um historico faturamento"
   Link: https://www.instagram.com/reel/DL485s2OuR8/
   Quebra objecao: Longevidade / relacionamento de longo prazo
   Prova: ALTO

4. Carlos Motors | Centro Automotivo | AutoScale
   Dor: Nunca havia investido em marketing digital
   Resultado: 4 carros agendados 3 dias apos campanhas irem ao ar, R$21.000 em vendas nas primeiras semanas
   Depoimento: "Resultado veio antes do que esperava"
   Link: https://www.instagram.com/reel/DYM8hREgYEy/
   Quebra objecao: Centro automotivo nao precisa de trafego / nicho especifico
   Prova: ALTO

5. Printbox 3D | Impressao 3D | Trafega Midia
   Dor: Leads desqualificados e ticket medio baixo (R$70)
   Resultado: Ticket medio foi de R$70 para R$1.000-2.000, leads qualificados chegando
   Depoimento: "Mudou drasticamente o resultado da empresa"
   Link: https://www.instagram.com/reel/DI4iQm0vss3/
   Quebra objecao: Realmente da resultado / ticket baixo
   Prova: ALTO

6. Atlantico Sul Containers | Container | Trafega Midia
   Dor: Leads desqualificados e baixo volume
   Resultado: Volume de leads aumentou e qualidade melhorou muito
   Depoimento: "Ja notei um crescimento e uma qualidade muito grande nos leads"
   Link: https://www.instagram.com/reel/DPzkeynEqv6/
   Prova: ALTO

7. Outlet dos Oculos | Otica | Trafega Midia
   Dor: Agencia anterior sem suporte e sem resultado
   Resultado: Leads chegando todo dia online e presencial, vendas acontecendo
   Depoimento: "Apliquei o script que voces montaram e o cliente responde, ate agenda"
   Link: https://www.instagram.com/reel/DU6wPbFjtKz/
   Quebra objecao: Ja tentei agencia antes e nao funcionou
   Prova: ALTO

8. Andercar | Centro Automotivo | AutoScale
   Dor: Reconhecimento so nacional, pouco reconhecimento local
   Resultado: +25% no faturamento em 6 meses, bate meta de agendamento toda semana
   Depoimento: "Recomendo fazer um trabalho com o time da Trafega"
   Link: https://www.instagram.com/reel/DXr3cCjgMIx/
   Prova: ALTO

REGRA DE ESCOLHA DE CASES:
- Se o produto for AUTOSCALE: usar APENAS Carlos Motors e/ou Andercar. NUNCA usar cases de outros segmentos.
- Se o produto for TRAFEGA MIDIA: escolher pelo contexto abaixo:
  * Comercio / loja fisica -> Outlet dos Oculos, DiskPizza
  * B2B / servicos -> Jormaq, Printbox 3D, Atlantico Sul
  * Nunca investiu em digital -> Evolux, DiskPizza
  * Ja teve agencia ruim -> DiskPizza, Outlet dos Oculos, Jormaq
  * Ticket baixo / leads ruins -> Printbox 3D
  * Medo de comecar -> Evolux

REGRA DE ESCOLHA DO PRODUTO:
- Se o lead e oficina mecanica, centro automotivo, autoeletrica, mecanica -> AUTOSCALE
- Se o lead e qualquer outro segmento (comercio, loja, servicos, industria) -> TRAFEGA MIDIA
- Se tiver duvida, analisar pelo segmento principal do negocio

SCRIPT DA REUNIAO DE DIAGNOSTICO (closer):
1. ABERTURA (rapport): retomar o que o SDR levantou, mostrar que conhece o negocio do lead
2. DIAGNOSTICO PROFUNDO: aprofundar dores, entender processo comercial atual, perguntar sobre tentativas anteriores
3. APRESENTACAO DA SOLUCAO: mostrar o metodo especifico para o perfil do lead com cases do segmento
4. PROPOSTA: apresentar os 3 planos, recomendar o semestral como mais escolhido
5. FECHAMENTO: perguntar o que falta para tomar a decisao, tratar objecoes, propor inicio
`;

  const systemPrompt = `Voce e um especialista em preparacao de reunioes de vendas consultivas. Recebera o briefing de qualificacao de um lead feito pelo SDR e deve montar um roteiro completo para o closer entrar na reuniao preparado para fechar.

Use o conhecimento dos produtos da Trafega para identificar qual produto entregar e personalizar toda a preparacao.

Responda APENAS com JSON valido, sem markdown, sem comentarios, sem texto fora do JSON.

${conhecimento}

Estrutura JSON exigida:
{
  "nome_lead": "string",
  "empresa": "string",
  "produto_recomendado": "AutoScale | Trafega Midia",
  "justificativa_produto": "string (por que esse produto e nao o outro)",
  "plano_recomendado": "Trimestral | Semestral | Anual",
  "justificativa_plano": "string",
  "resumo_executivo": "string (2-3 frases: quem e o lead, qual o momento, o que ele precisa)",
  "abertura_sugerida": "string (frase exata para o closer abrir a reuniao retomando o contexto do SDR)",
  "perguntas_diagnostico": [
    { "pergunta": "string", "objetivo": "string" }
  ],
  "como_apresentar_solucao": "string (como posicionar o produto para esse perfil especifico)",
  "cases_para_usar": ["string"],
  "objecoes_previstas": [
    { "objecao": "string", "resposta": "string" }
  ],
  "como_apresentar_preco": "string (estrategia de apresentacao de preco para esse lead)",
  "sinal_de_fechamento": "string (o que observar para saber que o lead esta pronto para fechar)",
  "alertas": ["string"],
  "checklist_pre_reuniao": ["string"]
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
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: "Briefing do SDR:\n\n" + briefing }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || "Erro na API" });
    }

    const text = data.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    let clean = text.replace(/```json|```/g, "").trim();
    // Find first { and last } to extract valid JSON
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
