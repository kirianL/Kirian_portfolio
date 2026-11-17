import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const rootDir = process.cwd();

const machineFiles = [
  "public/llms.txt",
  "public/llms-full.txt",
  "public/AGENT_INSTRUCTIONS.md",
  "public/agent-instructions.txt",
  "public/.well-known/agent-instructions",
  "public/.well-known/agent-instructions.txt",
];

for (const relPath of machineFiles) {
  const fullPath = path.join(rootDir, relPath);
  assert.ok(fs.existsSync(fullPath), `Missing machine-readable file: ${relPath}`);
  const content = fs.readFileSync(fullPath, "utf-8");
  assert.match(
    content,
    /## When to Use This/i,
    `${relPath} must include a "When to Use This" section`,
  );
  assert.match(
    content,
    /kirianluna\.u@gmail\.com|https:\/\/kirian\.dev\/contact\//,
    `${relPath} must include actionable contact/routing guidance`,
  );
}

console.log(`✓ Verified ${machineFiles.length} machine-readable files.`);

const entryPath = path.join(
  rootDir,
  ".vercel/output/functions/_render.func/dist/server/entry.mjs",
);

if (!process.env.VERIFY_BASE_URL && !fs.existsSync(entryPath)) {
  console.log("Skipping live SSR checks (run `npm run build` first).");
  process.exit(0);
}

let server = null;
let baseUrl = process.env.VERIFY_BASE_URL;

if (!baseUrl) {
  const { default: handler } = await import(
    new URL(`file:///${entryPath.replace(/\\/g, "/")}`).href
  );
  const staticRoot = path.join(rootDir, ".vercel/output/static");

  server = http.createServer((req, res) => {
    const urlPath = (req.url || "/").split("?")[0];
    const staticFile = path.join(staticRoot, urlPath === "/" ? "" : urlPath);
    if (
      urlPath !== "/" &&
      fs.existsSync(staticFile) &&
      fs.statSync(staticFile).isFile()
    ) {
      res.writeHead(200);
      fs.createReadStream(staticFile).pipe(res);
      return;
    }
    handler(req, res);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  baseUrl = `http://127.0.0.1:${addr.port}`;
}

const stripNonContent = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

try {
  // 1. Homepage raw HTML & content ratio without JS
  const homeRes = await fetch(`${baseUrl}/`);
  assert.equal(homeRes.status, 200, "GET / must return 200");
  const homeHtml = await homeRes.text();
  const homeText = stripNonContent(homeHtml);
  const ratio = (homeText.length / homeHtml.length) * 100;
  const sum = (re) => (homeHtml.match(re) || []).reduce((a, b) => a + b.length, 0);
  console.log("HTML breakdown:", {
    total: homeHtml.length,
    text: homeText.length,
    ratio: `${ratio.toFixed(2)}%`,
    scripts: sum(/<script[\s\S]*?<\/script>/gi),
    styles: sum(/<style[\s\S]*?<\/style>/gi),
    svgs: sum(/<svg[\s\S]*?<\/svg>/gi),
    head: sum(/<head[\s\S]*?<\/head>/i),
    footer: sum(/<footer[\s\S]*?<\/footer>/i),
    techstack: sum(/<section id="habilidades"[\s\S]*?<\/section>/i),
    projects: sum(/<section id="proyectos"[\s\S]*?<\/section>/i),
    experience: sum(/<section id="experiencia"[\s\S]*?<\/section>/i),
  });

  assert.ok(
    homeText.length >= 500,
    `Homepage raw text too short: ${homeText.length} chars`,
  );
  assert.ok(
    ratio >= 5.0,
    `Homepage content ratio ${ratio.toFixed(2)}% is below 5% target (${homeText.length}/${homeHtml.length})`,
  );
  assert.match(homeHtml, /<html[^>]+lang="en"/i, "Missing <html lang>");
  assert.match(homeHtml, /<h1[\s>]/i, "Missing <h1> on homepage");
  assert.match(
    homeHtml,
    /<link\s+rel="canonical"\s+href="https?:\/\/[^"]+"/i,
    "Missing canonical link",
  );
  assert.match(homeHtml, /<meta\s+property="og:image"/i, "Missing og:image");
  assert.match(homeHtml, /<meta\s+property="og:type"/i, "Missing og:type");

  console.log(
    `✓ Homepage raw HTML: ${homeText.length} text chars / ${homeHtml.length} HTML bytes = ${ratio.toFixed(2)}%`,
  );

  // 2. Canonical host alignment for www.kirian.dev vs kirian.dev
  for (const host of ["kirian.dev", "www.kirian.dev"]) {
    const res = await fetch(`${baseUrl}/`, {
      headers: { "x-forwarded-host": host, "x-forwarded-proto": "https" },
    });
    const html = await res.text();
    assert.match(
      html,
      new RegExp(`<link\\s+rel="canonical"\\s+href="https://${host}/"`, "i"),
      `Canonical URL on ${host} must match ${host}`,
    );
  }
  console.log("✓ Verified canonical host alignment for kirian.dev and www.kirian.dev.");

  // 3. Inner pages without JS
  for (const route of ["/about/", "/projects/", "/blog/", "/contact/", "/privacy/", "/es/"]) {
    const res = await fetch(`${baseUrl}${route}`);
    assert.equal(res.status, 200, `GET ${route} must return 200`);
    const html = await res.text();
    const text = stripNonContent(html);
    assert.ok(text.length >= 300, `${route} raw text too short: ${text.length}`);
  }
  console.log("✓ Verified 6 sampled inner pages without JS.");

  // 4. Machine-readable endpoints and Markdown negotiation
  for (const endpoint of [
    "/llms.txt",
    "/llms-full.txt",
    "/.well-known/agent-instructions",
  ]) {
    const res = await fetch(`${baseUrl}${endpoint}`);
    assert.equal(res.status, 200, `GET ${endpoint} must return 200`);
    const body = await res.text();
    assert.match(body, /## When to Use This/i, `${endpoint} missing When to Use This`);
  }

  const mdRes = await fetch(`${baseUrl}/`, {
    headers: { Accept: "text/markdown" },
  });
  assert.equal(mdRes.status, 200, "GET / with Accept: text/markdown must return 200");
  const mdBody = await mdRes.text();
  assert.match(mdBody, /## When to Use This/i, "Markdown / missing When to Use This");
  console.log("✓ Verified machine-readable endpoints and Markdown negotiation.");
} finally {
  if (server) server.close();
}
