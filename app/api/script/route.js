export async function POST(req) {
  try {
    const { url, niche, location } = await req.json();

    const prompt = `
You are an appointment setter creating a Loom video script.

STRICT RULES:
- Follow this exact structure
- Keep it short (60-90 seconds)
- Make it sound natural, not robotic
- Focus on AI search visibility (ChatGPT)
- Do NOT create a generic company intro

Context:
- Website: ${url}
- Niche: ${niche}
- Location: ${location}

SCRIPT STRUCTURE:

1. Start like:
"Hey [Name], [Your Name] here — I just ran a quick ChatGPT search..."

2. Show search:
Explain that you searched for their service in their location

3. Highlight problem:
Say they are NOT being recommended, but competitors are

4. Second prompt insight:
Explain that ChatGPT says they COULD be mentioned

5. Insight:
Explain that the issue is domain authority / visibility

6. Opportunity:
Mention they are missing inbound opportunities

7. CTA:
Offer to show how to fix it and suggest booking a call

IMPORTANT:
- Keep it conversational
- No bullet points
- No markdown
- No generic marketing language
- Make it feel like a real Loom recording
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

    // Intentar parsear la respuesta
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

    } catch (parseError) {
      return Response.json({
        error: "Invalid JSON from OpenAI",
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
