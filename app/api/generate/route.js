export async function POST(req) {
  const { name, niche } = await req.json();

  return Response.json({
    scriptA: `Hey ${name}, quick one —

I ran a ChatGPT search to see how companies in the ${niche} space are being recommended when people look for solutions…

…and it’s interesting how some companies show up consistently, while others don’t appear as much.

This usually comes down to how much visibility and authority a company has across the web.

So I recorded a quick Loom walking through what I found — curious to get your thoughts on it.`,

    scriptB: `Hey ${name},

I noticed something interesting about how companies in the ${niche} space are showing up on ChatGPT.

Happy to share a short Loom breaking it down if you're open to it 👍`,

    prompts: {
      search: `Give me 10 companies in the ${niche} space`,
      logic: `What factors influence which companies appear in ChatGPT recommendations?`
    }
  });
}
