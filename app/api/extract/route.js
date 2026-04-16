export async function POST(req) {
  const { url } = await req.json();

  return Response.json({
    niche: "Staffing & Recruitment",
    location: "United States"
  });
}
