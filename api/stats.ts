export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");

  const apiKey =
    process.env.POSTHOG_PERSONAL_API_KEY ||
    process.env.PUBLIC_POSTHOG_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID || "657608";
  const posthogHost = process.env.PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  const fallbackData = { pageviews: 1964, visitors: 257 };

  if (!apiKey || !apiKey.startsWith("phx_")) {
    return res.status(200).json(fallbackData);
  }

  try {
    const response = await fetch(`${posthogHost}/api/projects/${projectId}/query/`, {
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
        refresh: "force_blocking",
      }),
    });

    if (!response.ok) {
      return res.status(200).json(fallbackData);
    }

    const data = await response.json();
    const baseViews = 1964;
    const baseVisitors = 257;
    const pageviews = baseViews + (Number(data?.results?.[0]?.[0]) || 0);
    const visitors = baseVisitors + (Number(data?.results?.[0]?.[1]) || 0);

    return res.status(200).json({ pageviews, visitors });
  } catch (error) {
    return res.status(200).json(fallbackData);
  }
}
