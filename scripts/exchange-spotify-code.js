const CLIENT_ID = "29dcc86b96094c3084aadacf03194c56";
const CLIENT_SECRET = "3673286e80b2413b94fe0d3dd398dc9d";
const REDIRECT_URI = "https://www.kirian.dev/";

const code = process.argv[2];

if (!code) {
  console.log("\n❌ Uso: node scripts/exchange-spotify-code.js <CODIGO_DE_LA_URL>\n");
  process.exit(1);
}

async function exchange() {
  try {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code.trim(),
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await res.json();
    if (data.refresh_token) {
      console.log("\n==========================================");
      console.log("🎉 SPOTIFY REFRESH TOKEN GENERADO:");
      console.log("==========================================\n");
      console.log(`SPOTIFY_CLIENT_ID=${CLIENT_ID}`);
      console.log(`SPOTIFY_CLIENT_SECRET=${CLIENT_SECRET}`);
      console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
      console.log("==========================================\n");

      // Auto write to .env
      const fs = await import("fs");
      let envContent = fs.existsSync(".env") ? fs.readFileSync(".env", "utf-8") : "";
      
      const newVars = [
        `SPOTIFY_CLIENT_ID=${CLIENT_ID}`,
        `SPOTIFY_CLIENT_SECRET=${CLIENT_SECRET}`,
        `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`
      ];

      for (const line of newVars) {
        const key = line.split("=")[0];
        if (envContent.includes(`${key}=`)) {
          envContent = envContent.replace(new RegExp(`${key}=.*`), line);
        } else {
          envContent += `\n${line}`;
        }
      }

      fs.writeFileSync(".env", envContent.trim() + "\n", "utf-8");
      console.log("✓ ¡Guardado automáticamente en tu archivo .env local!\n");
    } else {
      console.error("\n❌ Error de Spotify:", data);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

exchange();
