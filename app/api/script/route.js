export async function POST(req) {
  try {
    const { url, niche, location, name, style } = await req.json();

    let styleInstruction = "";

    if (style === "safe") {
      styleInstruction = "Keep very close to the original framework.";
    }

    if (style === "optimized") {
      styleInstruction = `
      Improve clarity, make it more natural, and slightly more persuasive.
      Add light competitor framing.
      `;
    }

    if (style === "aggressive") {
      styleInstruction = `
      Make it more direct and impactful.
      Emphasize competitors taking their opportunities.
      Increase urgency.
      `;
    }

    const prompt = `
You are an appointment setter creating a Loom video script.

STRICT RULES:
- Keep it 60-90 seconds
- Conversational tone
- No bullet points
- No markdown

Context:
- Website: ${url}
- Niche: ${niche}
- Location: ${location}
- Prospect name: ${name || "there"}

STRUCTURE:

Start like:
"Hey ${name || "there"}, this is Francisco — I just ran a quick ChatGPT search..."

Then:

1. Say you searched for their service in their location
   (show screen)

2. Explain competitors are showing up but they are not
   (highlight competitors)

3. Mention ChatGPT says they COULD be included
   (scroll slightly)

4. Explain issue = domain authority / visibility

5. Explain missed opportunity (lost inbound leads)

6. CTA:
Offer to show how to fix it and suggest booking a call

VISUAL CUES:
- (show results)
- (highlight competitors)
- (pause)
- (scroll)

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
          { role: "system", content: "You are a high-performing appointment setter." },
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
