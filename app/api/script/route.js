export async function POST(req) {
  try {
    const { url, niche, location, name, style } = await req.json();

    let styleInstruction = "";

    if (style === "safe") {
      styleInstruction = `
Keep very close to the original framework.
Do not add pressure.
Keep it neutral and informative.
`;
    }

    if (style === "optimized") {
      styleInstruction = `
Make it more persuasive by:
- Clearly contrasting them with competitors
- Highlighting lost opportunities
- Creating light urgency without sounding pushy
- Making the CTA feel specific and valuable

Include a line that implies competitors are getting their potential clients.
`;
    }

    if (style === "aggressive") {
      styleInstruction = `
Make it direct and high-impact:
- Strong competitor contrast
- Emphasize they are losing business
- Increase urgency
- Make CTA feel like a missed opportunity if ignored
`;
    }

    const prompt = `
You are a high-performing appointment setter creating a Loom video script.

STRICT RULES:
- 60-90 seconds max
- Conversational tone
- No bullet points
- No markdown
- Sound like a real human recording a Loom

Context:
- Website: ${url}
- Niche: ${niche}
- Location: ${location}
- Prospect name: ${name || "there"}

SCRIPT:

Start like:
"Hey ${name || "there"}, this is Francisco — I just ran a quick ChatGPT search..."

Then:

- Say you searched for their service in their location (show results)

- Say competitors ARE showing up but they are NOT
(make this contrast clear)

- Add this idea naturally:
"which usually means people looking for your service are going to them instead"

- Mention ChatGPT says they COULD be included (scroll)

- Explain the issue:
domain authority / visibility

- Explain the opportunity:
they are missing inbound leads

- CTA:
"If you want, I can show you exactly what’s causing this and how to fix it so you start showing up in these searches."

VISUAL CUES:
Include naturally:
(show results)
(highlight competitors)
(scroll)
(pause)

STYLE:
${styleInstruction}
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "You are an elite appointment setter." },
          { role: "user", content: prompt }
        ]
      })
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);

      if (!response.ok) {
        return Response.json({
          error: "OpenAI error",
          details: data
        });
      }

      const script = data.choices?.[0]?.message?.content;

      return Response.json({ script });

    } catch {
      return Response.json({
        error: "Invalid JSON",
        raw: text
      });
    }

  } catch (err) {
    return Response.json({
      error: "Server crash",
      message: err.message
    });
  }
}
