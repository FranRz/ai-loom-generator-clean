export async function POST(req) {
  const { name, niche } = await req.json();

  return Response.json({
    scriptA: `Hey ${name}, quick idea for ${niche} companies...`,
    scriptB: `Alternative version for ${name}...`,
    prompts: {
      search: `Give me 10 ${niche} companies`
    }
  });
}
