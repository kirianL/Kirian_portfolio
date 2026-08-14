import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  try {
    const authRes = await fetch("https://cloud.umami.is/analytics/us/api/share/IKILGPgXIuMcSBcX");
    if (!authRes.ok) {
      return new Response(JSON.stringify({ pageviews: 0, visitors: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { token, websiteId } = await authRes.json();
    const startAt = new Date("2024-01-01").getTime();
    const endAt = Date.now();
    const statsRes = await fetch(
      `https://cloud.umami.is/analytics/us/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
      {
        headers: {
          "x-umami-share-token": token,
          "x-umami-share-context": "share",
        },
      }
    );
    if (!statsRes.ok) {
      return new Response(JSON.stringify({ pageviews: 0, visitors: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    const data = await statsRes.json();
    return new Response(
      JSON.stringify({
        pageviews: data.pageviews || 0,
        visitors: data.visitors || 0,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
        },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ pageviews: 0, visitors: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};
