export async function POST(req) {
  try {
    const { url, niche, location, name, style } = await req.json();

    const person = name || "there";

    const baseContext = `
Website: ${url}
Niche: ${niche}
Location: ${location}
Name: ${person}
`;

    // 🎯 BASE STRUCTURE
    const basePrompt = `
You are an elite appointment setter.

Write a Loom script (60-90 sec), natural tone.

${baseContext}

IMPORTANT:
- Start EXACTLY like:
"Hey ${person}, Francisco from Endolead here — I just ran a quick ChatGPT search..."

- Conversational
- No bullet points
- No generic marketing language
- Sound human

STRUCTURE:
- Show search (show results)
- Competitors ARE showing, they are NOT (highlight competitors)
- Say: people are going to competitors instead
- Scroll → say they COULD be included
- Explain: visibility / authority issue
- Explain lost inbound leads
`;

    // 🎛 STYLE VARIATIONS (con SYSTEM integrado)
    const styles = {
      safe: `
Introduce the system softly:
"That’s actually something we help with through our AI Search Visibility System..."

Keep it natural and low pressure.

CTA:
"If you want, I can walk you through how it works."
`,

      optimized: `
Introduce the system clearly:
"That’s actually what we fix with our AI Search Visibility System — helping companies show up in these AI-driven searches."

Add light urgency and opportunity framing.

CTA:
"If you want, I can show you exactly how it works and what it would look like for you."
`,

      aggressive: `
Introduce the system with impact:
"This is exactly what we solve with our AI Search Visibility System — helping companies stop losing these opportunities and start showing up where it matters."

Emphasize missed opportunities and urgency.

CTA:
"If you want, I can show you exactly how this works and how quickly we can start turning this around."
`
    };

    // 🧪 A/B MODE
    if (style === "ab") {
      const scriptA = await fetchOpenAI(basePrompt + styles.optimized);
      const scriptB = await fetchOpenAI(basePrompt + styles.aggressive);

      return Response.json({
        scriptA,
        scriptB,
        ...generateGuide(url, niche, location)
      });
    }

    // 🎯 SINGLE MODE
    const finalPrompt = basePrompt + (styles[style] || styles.optimized);
    const script = await fetchOpenAI(finalPrompt);

    return Response.json({
      script,
      ...generateGuide(url, niche, location)
    });

  } catch (err) {
    return Response.json({
      error: "Server crash",
      message: err.message
    });
  }
}


// 🔧 OPENAI CALL
async function fetchOpenAI(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
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

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Error generating script";
}


// 🎬 LOOM GUIDE
function generateGuide(url, niche, location) {
  const searchQuery = `best ${niche} in ${location}`;
  const inclusionQuery = `Should ${url} be listed as a top ${niche} in ${location}?`;

  return {
    loomGuide: `
STEP 1:
Search: "${searchQuery}"
(show results)

STEP 2:
Highlight competitors
(highlight competitors)

STEP 3:
Pause and say they are not showing
(pause)

STEP 4:
Search: "${inclusionQuery}"
(scroll)

STEP 5:
Explain insight

STEP 6:
Introduce system + CTA
`,
    prompts: {
      search: searchQuery,
      inclusion: inclusionQuery
    }
  };
}
