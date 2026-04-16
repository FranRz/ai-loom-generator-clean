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

    const prompt = `
You are an elite appointment setter.

Write a Loom script (60-90 sec), natural tone.

${baseContext}

Structure:
- Start: "Hey ${person}, this is Francisco..."
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
`;

    const script = await fetchOpenAI(prompt);

    // 🔥 GENERATE LOOM GUIDE
    const searchQuery = `best ${niche} in ${location}`;
    const inclusionQuery = `Could ${url} be recommended as one of the top ${niche} in ${location}?`;

    const loomGuide = `
--- LOOM GUIDE ---

STEP 1 (SHOW SEARCH)
Search in ChatGPT:
"${searchQuery}"

Say:
"I ran this search to see which companies show up..."

(show results)

STEP 2 (COMPETITORS)
Highlight competitors in results

Say:
"These companies are showing up here..."

(highlight competitors)

STEP 3 (PROBLEM)
Say:
"But your company isn’t showing up at all..."

(pause)

STEP 4 (SECOND SEARCH)
Search:
"${inclusionQuery}"

(scroll)

STEP 5 (INSIGHT)
Say:
"ChatGPT actually says you could be included..."

STEP 6 (EXPLANATION)
Say:
"This usually comes down to domain authority and visibility..."

STEP 7 (CTA)
Say:
"If you want, I can show you exactly how to fix this..."
`;

    return Response.json({
      script,
      loomGuide,
      prompts: {
        search: searchQuery,
        inclusion: inclusionQuery
      }
    });

  } catch (err) {
    return Response.json({
      error: err.message
    });
  }
}


// helper
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
  return data.choices?.[0]?.message?.content || "Error";
}
