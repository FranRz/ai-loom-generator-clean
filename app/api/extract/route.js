export async function POST(req) {
  try {
    const { url } = await req.json();

    return Response.json({
      niche: "Staffing & Recruitment",
      location: "United States"
    });

  } catch (err) {
    return Response.json({
      error: err.message
    });
  }
}
