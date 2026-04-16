export async function POST(req) {
  const { url, niche, location } = await req.json();

  return Response.json({
    script: `Demo script for ${url}

Niche: ${niche}
Location: ${location}

This is a working version of your app.`
  });
}
