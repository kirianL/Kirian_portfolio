export default async function handler(req: any, res: any) {
  const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

  if (!GITHUB_ACCESS_TOKEN) {
    return res.status(500).json({ error: "Missing GitHub Token" });
  }

  const query = `
    query {
      viewer {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("GitHub API Errors:", data.errors);
      return res
        .status(500)
        .json({ error: "GitHub API Error", details: data.errors });
    }

    return res
      .status(200)
      .json(data.data.viewer.contributionsCollection.contributionCalendar);
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
