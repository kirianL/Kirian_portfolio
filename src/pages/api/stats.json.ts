import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const apiKey =
    process.env.POSTHOG_PERSONAL_API_KEY ||
    import.meta.env.POSTHOG_PERSONAL_API_KEY;
  const projectId =
    process.env.POSTHOG_PROJECT_ID ||
    import.meta.env.POSTHOG_PROJECT_ID ||
    "657608";
  const posthogHost =
    process.env.PUBLIC_POSTHOG_HOST ||
    import.meta.env.PUBLIC_POSTHOG_HOST ||
    "https://us.i.posthog.com";

  if (!apiKey) {
    return new Response(JSON.stringify({ pageviews: 0, visitors: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch(`${posthogHost}/api/projects/${projectId}/query/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          kind: "HogQLQuery",
          query:
            "SELECT count(), count(DISTINCT distinct_id) FROM events WHERE event = '$pageview'",
        },
      }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ pageviews: 0, visitors: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const pageviews = Number(data?.results?.[0]?.[0]) || 0;
    const visitors = Number(data?.results?.[0]?.[1]) || 0;

    return new Response(
      JSON.stringify({
        pageviews,
        visitors,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ pageviews: 0, visitors: 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
};
