export default async function handler(req: any, res: any) {
  const { z, x, y } = req.query;
  const MAPTILER_KEY = process.env.MAPTILER_API_KEY;

  if (!z || !x || !y) {
    return res.status(400).send("Missing parameters");
  }

  const url = `https://api.maptiler.com/maps/streets-v2-dark/${z}/${x}/${y}.png?key=${MAPTILER_KEY}`;

  try {
    const mapRes = await fetch(url);
    if (!mapRes.ok) throw new Error("Failed to fetch tile");

    const arrayBuffer = await mapRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, s-maxage=86400"); // Cache for 1 day
    return res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching map tile");
  }
}
