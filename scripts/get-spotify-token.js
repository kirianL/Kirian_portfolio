import http from "http";
import { exec } from "child_process";

const CLIENT_ID = "29dcc86b96094c3084aadacf03194c56";
const CLIENT_SECRET = process.argv[2];
const REDIRECT_URI = "http://localhost:8888/callback";
const SCOPES = ["user-read-currently-playing", "user-read-playback-state"].join(" ");

if (!CLIENT_SECRET) {
  console.log("\n❌ Por favor ejecuta el script pasando tu Client Secret:");
  console.log("   node scripts/get-spotify-token.js TU_CLIENT_SECRET\n");
  process.exit(1);
}

const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}`;

console.log("\n🎵 === OBTENER SPOTIFY REFRESH TOKEN ===");
console.log("1. Asegúrate de tener en Redirect URIs de tu Spotify Dashboard:");
console.log(`   👉 ${REDIRECT_URI}`);
console.log("\n2. Abriendo el navegador para autorizar Spotify...");
console.log(`   (Si no abre, ingresa a: ${authUrl})\n`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:8888");
  const code = url.searchParams.get("code");

  if (code) {
    try {
      const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
      const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const data = await tokenRes.json();

      if (data.refresh_token) {
        console.log("\n🎉 ¡TOKEN OBTENIDO CON ÉXITO!\n");
        console.log("Agrega estas variables a tu archivo .env y a Vercel:\n");
        console.log(`SPOTIFY_CLIENT_ID=${CLIENT_ID}`);
        console.log(`SPOTIFY_CLIENT_SECRET=${CLIENT_SECRET}`);
        console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
          <div style="font-family:sans-serif; text-align:center; padding:50px;">
            <h1 style="color:#1DB954;">✓ ¡Spotify conectado con éxito!</h1>
            <p>Ya puedes regresar a la terminal para ver tus variables configuradas.</p>
          </div>
        `);
      } else {
        console.error("Error al obtener token:", data);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Error al obtener token: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error("Error en la petición:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error: " + err.message);
    } finally {
      setTimeout(() => server.close(), 1000);
    }
  }
});

server.listen(8888, () => {
  const openCmd =
    process.platform === "win32"
      ? `start "" "${authUrl}"`
      : process.platform === "darwin"
      ? `open "${authUrl}"`
      : `xdg-open "${authUrl}"`;
  exec(openCmd);
});
