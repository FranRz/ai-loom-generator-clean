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

    // 🔥 BASE PROMPT (con tu identidad real)
    const basePrompt = `
You are an elite appointment setter.

Write a Loom script (60-90 sec), natural tone.

${baseContext}

IMPORTANT:
- Start EXACTLY like:
"Hey ${person}, Francisco from Endolead here — I just ran a quick ChatGPT search..."

- Conversational tone
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
- CTA: show how to fix it
`;

    // 🎛 STYLE VARIATIONS
    const styles = {
      safe: `
Keep it neutral, low pressure, informative.
`,
      optimized: `
Make it persuasive:
- Clear competitor contrast
- Mention lost opportunities
- Light urgency
`,
      aggressive: `
Make it direct:
- Strong urgency
- Emphasize lost business
- Still avoid sounding spammy
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
    return Response.json({ error: err.message });
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
  return data.choices?.[0]?.message?.content || "Error";
}


// 🎬 LOOM GUIDE GENERATOR
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
Transition to CTA
`,
    prompts: {
      search: searchQuery,
      inclusion: inclusionQuery
    }
  };
}
