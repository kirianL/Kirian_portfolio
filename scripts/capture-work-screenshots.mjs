import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const require = createRequire("C:\\Users\\Kirian\\Desktop\\LandingFactory\\package.json");
const { chromium } = require("playwright");

const PROJECTS_ROOT = "C:\\Users\\Kirian\\Desktop\\LandingFactory\\projects";
const OUT_DIR = path.join(PROJECTS_ROOT, "Portfolio-Kirian", "public", "work");
fs.mkdirSync(OUT_DIR, { recursive: true });

// 1280x800 @ 3x = 3840x2400 (true 4K UHD, 16:10).
const VIEWPORT = { width: 1280, height: 800 };
const SCALE_FACTOR = 3;

const TARGETS = [
  { id: "koragrid", dir: "KoraGrid", port: 4401, hasNativeEnToggle: true },
  {
    id: "customerup",
    dir: "DataWebsite",
    port: 4402,
    hasNativeEnToggle: false,
    enTranslations: [
      { from: "Últimas noticias — la sincronización en tiempo real para comercios del GAM ya está activa.", to: "Latest news — real-time sync for GAM retailers is now live." },
      { from: "Nosotros", to: "About" },
      { from: "Plataforma", to: "Platform" },
      { from: "Servicios", to: "Services" },
      { from: "Perspectivas", to: "Insights" },
      { from: "Ingresar", to: "Sign in" },
      { from: "Probar gratis", to: "Try free" },
      { from: "Conecta con tus clientes en", to: "Connect with your customers in" },
      { from: "usando datos propios.", to: "using first-party data." },
      { from: "Customerup te ayuda a crear recorridos personalizados desde San José para cada canal, con claridad, rapidez y control total sobre las señales de tu audiencia.", to: "Customerup helps you build personalized journeys from San José for every channel, with clarity, speed, and full control over your audience signals." },
      { from: "Empezar ahora", to: "Get started" },
      { from: "Agendar demo", to: "Book demo" },
      { from: "Última campaña de producto", to: "Latest product campaign" },
      { from: "Diseña, previsualiza y colabora en nuestra plataforma de activación hecha para equipos de datos en Costa Rica.", to: "Design, preview, and collaborate in our activation platform built for data teams in Costa Rica." },
      { from: "Segmento: Clientes leales San José", to: "Audience: Loyal customers San José" },
      { from: "Correo", to: "Email" },
      { from: "En la app", to: "In-app" },
      { from: "Compradores recurrentes", to: "Repeat buyers" },
      { from: "Tasa de conversión", to: "Conversion rate" },
      { from: "Ingresos atribuidos", to: "Attributed revenue" },
    ],
  },
  {
    id: "kora-finance",
    dir: "financewebsite",
    port: 4403,
    hasNativeEnToggle: false,
    enTranslations: [
      { from: "Funciones", to: "Features" },
      { from: "Impacto", to: "Impact" },
      { from: "Planes", to: "Pricing" },
      { from: "Bancos CR", to: "CR Banks" },
      { from: "Ingresar a", to: "Sign in to" },
      { from: "Ingresar", to: "Sign in" },
      { from: "Tesorería moderna en", to: "Modern Treasury in" },
      { from: "y SINPE.", to: "and SINPE." },
      { from: "Kora conecta tus cuentas del BAC, BCR, BN y SINPE empresarial con tipo de cambio MONEX en tiempo real, conciliación automática y liquidez en colones y dólares.", to: "Kora connects your corporate accounts across BAC, BCR, BN, and SINPE with real-time MONEX FX rates, automated reconciliation, and dual-currency liquidity in CRC and USD." },
      { from: "Conectar banca CR", to: "Connect CR Banking" },
      { from: "Ver simulación", to: "Live Demo" },
      { from: "Disponible en Costa Rica", to: "Available in Costa Rica" },
    ],
  },
  {
    id: "alder-psicologia",
    dir: "healthwebsite",
    port: 4404,
    hasNativeEnToggle: false,
    enTranslations: [
      { from: "Servicios", to: "Services" },
      { from: "Enfoque", to: "Approach" },
      { from: "Equipo", to: "Team" },
      { from: "Preguntas", to: "FAQ" },
      { from: "Portal de pacientes", to: "Patient Portal" },
      { from: "Agendar sesión", to: "Book Session" },
      { from: "Psicología clínica", to: "Clinical Psychology" },
      { from: "Comprende tu mente,", to: "Understand your mind," },
      { from: "sana a tu propio ritmo.", to: "heal at your own pace." },
      { from: "Terapia individual, de pareja y familiar, presencial en San José o en línea.", to: "Individual, couples, and family therapy, in person in San José or online." },
      { from: "Agendar consulta", to: "Book Consultation" },
      { from: "Explorar terapias", to: "Explore Therapies" },
      { from: "Psicóloga clínica principal", to: "Lead Clinical Psychologist" },
      { from: "Seguimiento emocional", to: "Mood Tracker" },
      { from: "Semanal", to: "Weekly" },
      { from: "DOM", to: "SUN" },
      { from: "LUN", to: "MON" },
      { from: "MAR", to: "TUE" },
      { from: "MIÉ", to: "WED" },
      { from: "JUE", to: "THU" },
      { from: "VIE", to: "FRI" },
      { from: "SÁB", to: "SAT" },
      { from: "Las sesiones semanales constantes ayudan a ordenar pensamientos antes de llegar al desgaste.", to: "Consistent weekly sessions help you organize your thoughts before burnout sets in." },
      { from: "Nuestros pacientes sienten escucha genuina y respaldo clínico desde la primera sesión.", to: "Our patients feel genuinely heard and clinically supported from the first session." },
      { from: "Psicoterapia basada en evidencia (TCC y EMDR) adaptada a tu ritmo e historia.", to: "Evidence-based psychotherapy (CBT and EMDR) tailored to your pace and history." },
      { from: "Estabilidad emocional duradera construida con herramientas prácticas y acompañamiento humano.", to: "Lasting emotional stability built with practical tools and human support." },
      { from: "Resultados clínicos", to: "Clinical Outcomes" },
      { from: "El 86% de las personas reporta alivio medible en ansiedad y estado de ánimo en 8 sesiones.", to: "86% of clients report measurable relief in anxiety and mood within 8 sessions." },
      { from: "Bienestar emocional", to: "Emotional Wellbeing" },
      { from: "Calma", to: "Calm" },
      { from: "Ánimo bajo", to: "Low mood" },
      { from: "Ansiedad", to: "Anxiety" },
      { from: "Agotamiento", to: "Burnout" },
      { from: "Etapas de atención", to: "Care Journey" },
      { from: "Evaluación inicial", to: "Initial Assessment" },
      { from: "Entrevista clínica de 50 min", to: "50-min clinical intake" },
      { from: "Completado", to: "Completed" },
      { from: "Plan terapéutico", to: "Therapy Plan" },
      { from: "Objetivos personalizados", to: "Tailored goals" },
      { from: "Activo", to: "Active" },
      { from: "Supervisor clínico", to: "Clinical Supervisor" },
    ],
  },
  {
    id: "mp-legal",
    dir: "legalWebsite",
    port: 4405,
    hasNativeEnToggle: false,
    enTranslations: [
      { from: "Grupo de Servicios Privados", to: "Private Wealth Advisory Group" },
      { from: "Servicios", to: "Services" },
      { from: "Temas clave", to: "Key Areas" },
      { from: "Nosotros", to: "About Us" },
      { from: "Contacto", to: "Contact" },
      { from: "Contáctenos", to: "Get in touch" },
      { from: "Protegemos y", to: "Protecting and" },
      { from: "preservamos", to: "preserving" },
      { from: "lo que usted construyó", to: "what you have built" },
      { from: "Asesoría legal y financiera para clientes privados y empresas — más de 30 años de trayectoria en la región", to: "Legal and financial counsel for private clients and enterprises — over 30 years of excellence across the region" },
      { from: "Consultar con un socio", to: "Consult a partner" },
      { from: "Conocer nuestras áreas", to: "Explore practice areas" },
    ],
  },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function withTimeout(promise, ms, label) {
  let timer;
  return Promise.race([
    Promise.resolve(promise).finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timeout ${label} tras ${ms}ms`)), ms);
    }),
  ]);
}

async function waitForUrl(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await delay(400);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function startVite(projectDir, port) {
  const viteBin = path.join(projectDir, "node_modules", "vite", "bin", "vite.js");
  return spawn(process.execPath, [viteBin, "--port", String(port), "--strictPort"], {
    cwd: projectDir,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function killTree(pid) {
  try {
    spawn("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
  } catch {}
}

async function ensureImagesLoaded(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll("img")).filter(
      (img) => !(img.complete && img.naturalWidth > 0)
    );
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          })
      )
    );
  });
}

// Headlines split across <span>/<em> need the phrase matched across text nodes.
// Each match is redistributed proportionally at word boundaries so highlighted
// fragments keep their text instead of being emptied.
function applyDomTranslations(page, translations) {
  return page.evaluate((pairs) => {
    const skipped = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);

    const collect = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent || skipped.has(parent.tagName) || !node.textContent.trim()) continue;
        nodes.push(node);
      }
      return nodes;
    };

    const splitAtWord = (text, ideal) => {
      if (ideal <= 0 || ideal >= text.length) return ideal;
      const before = text.lastIndexOf(" ", ideal);
      const after = text.indexOf(" ", ideal);
      // Prefer the closest word boundary to the proportional split point.
      if (before !== -1 && ideal - before <= after - ideal) return before + 1;
      if (after !== -1) return after + 1;
      return ideal;
    };

    let applied = 0;
    for (const { from, to } of pairs) {
      // Re-collect after every pair: earlier replacements change the DOM.
      for (let pass = 0; pass < 4; pass += 1) {
        const nodes = collect();
        const full = nodes.map((n) => n.textContent).join("");
        const start = full.indexOf(from);
        if (start === -1) break;

        const end = start + from.length;
        const segments = [];
        let cursor = 0;
        nodes.forEach((node) => {
          const nodeEnd = cursor + node.textContent.length;
          const segStart = Math.max(cursor, start);
          const segEnd = Math.min(nodeEnd, end);
          if (segEnd > segStart) {
            segments.push({ node, from: segStart - cursor, to: segEnd - cursor, length: segEnd - segStart });
          }
          cursor = nodeEnd;
        });
        if (!segments.length) break;

        const totalLength = segments.reduce((sum, seg) => sum + seg.length, 0);
        let offset = 0;
        segments.forEach((seg, index) => {
          const text = seg.node.textContent;
          let count =
            index === segments.length - 1
              ? to.length - offset
              : splitAtWord(to, Math.round((to.length * seg.length) / totalLength) + offset) - offset;
          count = Math.max(1, Math.min(count, to.length - offset));
          const replacement = to.slice(offset, offset + count);
          seg.node.textContent = text.slice(0, seg.from) + replacement + text.slice(seg.to);
          offset += count;
        });
        applied += 1;
      }
    }
    return applied;
  }, translations);
}

const SPANISH_CONTROL = [
  "que", "para", "con", "los", "las", "del", "una", "nuestro", "nuestra",
  "clientes", "sesión", "sesiones", "usted", "tus", "noticias", "pacientes",
  "conecta", "plataforma", "sobre", "desde", "tiempo real", "datos propios",
  "contacto", "servicios", "preservamos", "protegemos", "tesorería", "banca",
];

async function scanSpanish(page, id) {
  const found = await page.evaluate((words) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const hits = [];
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;
      const text = node.textContent.trim();
      if (!text) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const r = range.getBoundingClientRect();
      if (r.width === 0 || r.height === 0 || r.top >= innerHeight || r.bottom <= 0) continue;
      const lower = text.toLocaleLowerCase("es");
      for (const word of words) {
        if (lower.includes(word)) hits.push({ text: text.slice(0, 140), word });
      }
    }
    return hits;
  }, SPANISH_CONTROL);

  if (found.length) {
    console.warn(`[${id}] Spanish remnants in the EN viewport:`);
    found.forEach((hit) => console.warn(`  "${hit.word}" -> ${hit.text}`));
  } else {
    console.log(`[${id}] EN viewport clean: no Spanish control words found.`);
  }
  return found;
}

async function captureTarget(browser, target) {
  const projectDir = path.join(PROJECTS_ROOT, target.dir);
  const esUrl = `http://localhost:${target.port}${target.hasNativeEnToggle ? "/es" : "/"}`;
  const enUrl = `http://localhost:${target.port}${target.hasNativeEnToggle ? "/en" : "/"}`;
  console.log(`\n=== Starting ${target.id} (${target.dir}) ES=${esUrl} EN=${enUrl}`);
  const proc = startVite(projectDir, target.port);

  try {
    await waitForUrl(esUrl);
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: SCALE_FACTOR,
    });

    const page = await context.newPage();
    page.setDefaultTimeout(20000);

    // Deterministic reveals + no browser chrome (header/nav) in "cover" mode.
    // Hiding in-flow headers reflows the hero up; fixed headers simply vanish.
    await page.emulateMedia({ reducedMotion: "reduce" });
    const COVER = process.env.COVER === "1";
    const HIDE_HEADER = `header, header.site-nav, header.site-header, .skip-link { display: none !important; }`;

    console.log(`[${target.id}] ES loading...`);
    await page.goto(esUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (COVER) await page.addStyleTag({ content: HIDE_HEADER });
    await withTimeout(page.evaluate(() => document.fonts?.ready), 6000, "fonts ES");
    await withTimeout(ensureImagesLoaded(page), 8000, "images ES").catch((e) =>
      console.warn(`[${target.id}] ${e.message} (continuing)`)
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(1200);

    const esPath = path.join(OUT_DIR, `${target.id}-es.jpg`);
    await page.screenshot({ path: esPath, type: "jpeg", quality: 92 });
    console.log(`[${target.id}] ES ok -> ${esPath}`);

    console.log(`[${target.id}] EN preparing...`);
    if (target.hasNativeEnToggle) {
      // The project has real i18n: navigate to /en instead of clicking a toggle.
      await page.goto(enUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      if (COVER) await page.addStyleTag({ content: HIDE_HEADER });
      await delay(800);
      console.log(`[${target.id}] loaded native EN route ${enUrl}`);
    } else if (target.enTranslations?.length) {
      const applied = await applyDomTranslations(page, target.enTranslations);
      await delay(600);
      console.log(`[${target.id}] applied ${applied} DOM translations`);
    }

    await withTimeout(page.evaluate(() => document.fonts?.ready), 6000, "fonts EN");
    await withTimeout(ensureImagesLoaded(page), 8000, "images EN").catch((e) =>
      console.warn(`[${target.id}] ${e.message} (continuing)`)
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(1000);

    const enPath = path.join(OUT_DIR, `${target.id}-en.jpg`);
    await page.screenshot({ path: enPath, type: "jpeg", quality: 92 });
    console.log(`[${target.id}] EN ok -> ${enPath}`);

    const warnings = await scanSpanish(page, target.id);
    await context.close();
    return { id: target.id, warnings };
  } finally {
    killTree(proc.pid);
  }
}

async function captureAll() {
  const browser = await chromium.launch({ headless: true });
  const failed = [];

  const only = process.env.ONLY?.split(",").map((s) => s.trim()).filter(Boolean);
  const targets = only ? TARGETS.filter((t) => only.includes(t.id)) : TARGETS;

  const reports = [];
  for (const target of targets) {
    try {
      const report = await withTimeout(captureTarget(browser, target), 100000, target.id);
      if (report) reports.push(report);
    } catch (err) {
      failed.push(target.id);
      console.error(`[error] ${target.id}:`, err.message);
    }
  }

  await browser.close();
  const reportPath = path.join(OUT_DIR, "english-capture-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));
  console.log(`\nFinished. Failed: ${failed.length ? failed.join(", ") : "none"}`);
  console.log(`Language report -> ${reportPath}`);
  if (failed.length) process.exitCode = 1;
}

captureAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
