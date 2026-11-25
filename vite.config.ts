import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";

function getLastCommitIso(): string {
  try {
    return execSync("git log -1 --format=%cI", { encoding: "utf-8" }).trim();
  } catch {
    return new Date().toISOString();
  }
}

function localApiDevPlugin(): Plugin {
  return {
    name: "local-vercel-api-dev",
    configureServer(server) {
      const env = loadEnv("development", process.cwd(), "");
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) {
          process.env[key] = value;
        }
      }

      server.middlewares.use("/api", async (req, res, next) => {
        const rawUrl = req.url || "/";
        const urlObj = new URL(rawUrl, "http://localhost");
        const endpoint = urlObj.pathname.replace(/^\/+|\/+$/g, "");
        if (!endpoint || endpoint.includes("..")) {
          return next();
        }

        const tsPath = path.resolve(process.cwd(), "api", `${endpoint}.ts`);
        if (!fs.existsSync(tsPath)) {
          return next();
        }

        try {
          const bodyChunks: Buffer[] = [];
          await new Promise<void>((resolve, reject) => {
            req.on("data", (chunk) => bodyChunks.push(Buffer.from(chunk)));
            req.on("end", resolve);
            req.on("error", reject);
          });
          const rawBody = Buffer.concat(bodyChunks).toString("utf-8");

          const reqAny = req as unknown as Record<string, unknown>;
          reqAny.query = Object.fromEntries(urlObj.searchParams.entries());
          reqAny.body = rawBody;

          let statusCode = 200;
          const resAdapter = {
            setHeader(name: string, value: string | string[]) {
              res.setHeader(name, value);
              return resAdapter;
            },
            status(code: number) {
              statusCode = code;
              res.statusCode = code;
              return resAdapter;
            },
            json(payload: unknown) {
              if (!res.headersSent) {
                res.setHeader("Content-Type", "application/json; charset=utf-8");
              }
              res.statusCode = statusCode;
              res.end(JSON.stringify(payload));
              return resAdapter;
            },
            send(payload: unknown) {
              res.statusCode = statusCode;
              if (Buffer.isBuffer(payload) || typeof payload === "string") {
                res.end(payload);
              } else {
                if (!res.headersSent) {
                  res.setHeader("Content-Type", "application/json; charset=utf-8");
                }
                res.end(JSON.stringify(payload));
              }
              return resAdapter;
            },
            end(payload?: string | Buffer) {
              res.statusCode = statusCode;
              res.end(payload);
              return resAdapter;
            },
          };

          const mod = await server.ssrLoadModule(`/api/${endpoint}.ts`);
          if (typeof mod.default === "function") {
            await mod.default(reqAny, resAdapter);
            return;
          }
          next();
        } catch (err) {
          console.error(`[local-api-dev] Error handling /api/${endpoint}:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ error: "Internal Server Error" }));
          }
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiDevPlugin()],
  envPrefix: ["VITE_", "PUBLIC_"],
  server: {
    port: 4322,
  },
  define: {
    __BUILD_DATE__: JSON.stringify(getLastCommitIso()),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
