export async function POST(req) {
  try {
    const { url, niche, location, name, style } = await req.json();

    const baseContext = `
Website: ${url}
Niche: ${niche}
Location: ${location}
Name: ${name || "there"}
`;

    // 🔥 DEFAULT OPTIMIZED PRO
    const optimizedPrompt = `
You are an elite appointment setter.

Write a Loom script (60-90 sec), natural tone.

${baseContext}

Structure:
- Start: "Hey ${name || "there"}, this is Francisco..."
- Show search (show results)
- Competitors ARE showing, they are NOT (highlight competitors)
- Say: people are going to competitors instead
- Scroll → say they COULD be included
- Explain: visibility / authority issue
- Explain lost inbound leads
- CTA: show how to fix it

IMPORTANT:
- Conversational
- No fluff
- No bullet points
- Real Loom tone
`;

    // 🔥 VARIATION B (más presión ligera)
    const variationBPrompt = `
You are an elite appointment setter.

Write a Loom script (60-90 sec), slightly more direct.

${baseContext}

Structure:
- Same as above
- Add more urgency
- Emphasize competitors taking opportunities
- Make impact stronger but NOT pushy

IMPORTANT:
- Still natural
- No aggressive sales tone
`;

    // 👉 si es AB mode
    if (style === "ab") {
      const responses = await Promise.all([
        fetchOpenAI(optimizedPrompt),
        fetchOpenAI(variationBPrompt)
      ]);

      return Response.json({
        scriptA: responses[0],
        scriptB: responses[1]
      });
    }

    // 👉 default = optimized pro
    const script = await fetchOpenAI(optimizedPrompt);

    return Response.json({ script });

  } catch (err) {
    return Response.json({
      error: "Server crash",
      message: err.message
    });
  }
}


// 🔧 helper reutilizable
async function fetchOpenAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a high-performing appointment setter." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Error generating";
}
