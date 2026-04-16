export async function POST(req) {
  try {
    const { url, niche, location } = await req.json();

    const prompt = `Create a Loom script for:
Website: ${url}
Niche: ${niche}
Location: ${location}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const text = await response.text(); // 👈 CLAVE

    // 👇 DEBUG: siempre devuelve algo
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
