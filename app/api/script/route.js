export async function POST(req) {
  const { url, niche, location } = await req.json();

  const prompt = `
  Create a Loom script (60-90 seconds).

  Context:
  - Website: ${url}
  - Niche: ${niche}
  - Location: ${location}

  Structure:
  1. Hook
  2. Show they are not listed
  3. Confirm they could be listed
  4. Explain domain authority
  5. Missed opportunity
  6. CTA

  Include subtle visual cues like:
  (show results), (highlight competitors), (pause)
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const script = data.choices[0].message.content;

  return Response.json({ script });
}
