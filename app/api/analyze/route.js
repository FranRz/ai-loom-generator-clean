export async function POST(req) {
  const { url } = await req.json();

  return Response.json({
    niche: "staffing and recruiting" // fallback simple
  });
}
