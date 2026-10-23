import { getReactions, incrementReaction, DEFAULT_REACTION_COUNTS } from "../src/lib/redis";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    try {
      const slug = (req.query?.slug as string) || "";
      if (!slug) {
        return res.status(200).json({
          slug: "default",
          counts: { ...DEFAULT_REACTION_COUNTS },
        });
      }

      const counts = await getReactions(slug);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.status(200).json({ slug, counts });
    } catch (error: any) {
      console.error("Reactions GET error:", error);
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const { slug, type } = body;

      if (!slug || typeof slug !== "string" || !/^[a-z0-9-_]+$/i.test(slug)) {
        return res.status(400).json({ error: "Invalid or missing 'slug'" });
      }

      const validTypes = ["pinch", "thumb", "clap", "ok"];
      if (!type || !validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid reaction 'type'" });
      }

      const counts = await incrementReaction(slug, type);
      return res.status(200).json({ success: true, slug, counts });
    } catch (error: any) {
      console.error("Reactions POST error:", error);
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
