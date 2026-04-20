export async function POST(req) {
  try {
    const { url, niche, location, name, style } = await req.json();

    const person = name || "there";

    // 🔧 Helpers
    const companyName = extractCompanyName(url);
    const domain = url.replace("https://", "").replace("http://", "").replace("www.", "");

    const firstPrompt = `Give me 10 ${niche} companies in ${location}`;
    const secondPrompt = `Should ${companyName} be listed here?`;

    // 🟢 SAFE MODE (Frederik script casi literal)
    if (style === "safe") {
      const script = `
Hey ${person}, Francisco from EndoLead here, I wanted to quickly show you the ChatGPT search I just did to see if ${companyName} would show up if I searched for "${firstPrompt}", and as you can see, ChatGPT gives us these competitors (show results), with ${companyName} unfortunately nowhere to be found (highlight competitors), and if we look at my next prompt, I asked "${secondPrompt}" (scroll)

And as you can see ChatGPT tells us that it should be included in this search. So ${person}, this clearly tells us that ChatGPT already knows that you guys are offering a quality service, but what ChatGPT is looking at primarily when it’s deciding who to put in these recommendations is what’s called domain authority, meaning how much ChatGPT trusts your domain, ${domain}.

And as you probably know, more and more prospects are making their research and decisions based on AI search recommendations, so the fact that you’re not in the top of a search like the one I made here unfortunately means that you’re currently missing out on new business every single month right now.

But the good news is that we recently finished testing and implementing a completely done-for-you AI Search Visibility System, which is designed to specifically boost your domain authority and from that increase your likelihood of making the cut in ChatGPT searches like the one I just did.

So ${person}, if you’d like to get this fixed so that the people who are looking for ${niche} in ${location} on ChatGPT are going to come to you instead of your competitors moving forward, let me know, and I’d be very happy to show you exactly how we can make that happen for you with our AI Search Visibility System. We can go ahead and schedule in a meeting — let me know which time works best for you? and we´ll make it happen. Speak soon!
`;

      return Response.json({
        script,
        ...generateGuide(url, niche, location)
      });
    }

    // 🔥 BASE PROMPT (para AI modes)
    const basePrompt = `
You are an elite appointment setter.

Write a Loom script (60-90 sec), natural tone.

IMPORTANT:
- Start EXACTLY like:
"Hey ${person}, Francisco from Endolead here — I just ran a quick ChatGPT search..."

Context:
- Website: ${url}
- Niche: ${niche}
- Location: ${location}

STRUCTURE:
- Show search
- Competitors vs them
- Lost opportunity
- Domain authority explanation
- Introduce AI Search Visibility System
- CTA
`;

    const styles = {
      optimized: `
Make it persuasive but natural.
Highlight competitors and lost opportunities.
`,
      aggressive: `
Make it more direct and urgent.
Emphasize missed business.
`
    };

    // 🧪 A/B
    if (style === "ab") {
      const scriptA = await fetchOpenAI(basePrompt + styles.optimized);
      const scriptB = await fetchOpenAI(basePrompt + styles.aggressive);

      return Response.json({
        scriptA,
        scriptB,
        ...generateGuide(url, niche, location)
      });
    }

    // 🎯 SINGLE AI MODE
    const script = await fetchOpenAI(basePrompt + (styles[style] || styles.optimized));

    return Response.json({
      script,
      ...generateGuide(url, niche, location)
    });

  } catch (err) {
    return Response.json({
      error: err.message
    });
  }
}


// 🔧 OpenAI helper
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


// 🎬 Loom Guide
function generateGuide(url, niche, location) {
  const searchQuery = `best ${niche} in ${location}`;
  const inclusionQuery = `Should ${url} be listed as a top ${niche} in ${location}?`;

  return {
    loomGuide: `
STEP 1: Search "${searchQuery}"
STEP 2: Highlight competitors
STEP 3: Show absence
STEP 4: Search "${inclusionQuery}"
STEP 5: Explain insight
STEP 6: CTA
`,
    prompts: {
      search: searchQuery,
      inclusion: inclusionQuery
    }
  };
}


// 🧠 Helper para nombre empresa
function extractCompanyName(url) {
  try {
    const domain = new URL(url).hostname;
    const name = domain.replace("www.", "").split(".")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return "your company";
  }
}
