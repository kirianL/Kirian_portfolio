export const prerender = false;

import type { APIRoute } from "astro";
import { getReactions, incrementReaction, DEFAULT_REACTION_COUNTS } from "../../lib/redis";

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      // Return default 200 during static build or when query param is missing
      return new Response(
        JSON.stringify({
          slug: "default",
          counts: { ...DEFAULT_REACTION_COUNTS },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const counts = await getReactions(slug);
    return new Response(JSON.stringify({ slug, counts }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const { slug, type } = body || {};

    if (!slug || typeof slug !== "string" || !/^[a-z0-9-_]+$/i.test(slug)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing 'slug'" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const validTypes = ["pinch", "thumb", "clap", "ok"];
    if (!type || !validTypes.includes(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid reaction 'type'" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const counts = await incrementReaction(slug, type);
    return new Response(
      JSON.stringify({ success: true, slug, counts }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
