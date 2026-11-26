/**
 * Re-capture section-by-section screenshots for the portfolio case studies
 * from the live Vercel builds, in both Spanish and English.
 *
 * Output: public/work/<slug>/<locale>/01.png .. 06.png
 * Viewport 1440x900 @2x, exact section bounding box per capture.
 */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PROJECT = "C:/Users/Kirian/Desktop/LandingFactory/projects/Portfolio-Kirian";
const OUT_ROOT = path.join(PROJECT, "public", "work");
const REPORT_PATH = path.join(PROJECT, "captures", "section-capture-report.json");

const VIEWPORT = { width: 1440, height: 900 };
const DSF = 2;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForImages(page) {
  await page.evaluate(async () => {
    const pending = Array.from(document.querySelectorAll("img")).filter(
      (img) => img.loading !== "lazy" || img.getBoundingClientRect().top < 4000
    );
    await Promise.all(
      pending.map(
        (img) =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
                setTimeout(resolve, 6000);
              })
      )
    );
  }).catch(() => {});
}

async function slowScroll(page) {
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.round(innerHeight * 0.6);
    for (let pass = 0; pass < 2; pass += 1) {
      const height = document.documentElement.scrollHeight;
      for (let y = 0; y < height; y += step) {
        window.scrollTo(0, y);
        await pause(80);
      }
      window.scrollTo(0, height);
      await pause(350);
      window.scrollTo(0, 0);
      await pause(350);
    }
  });
}

async function hideStickyChrome(page) {
  return page.evaluate(() => {
    const hidden = [];
    const candidates = new Set();
    document.querySelectorAll("header, nav, [role='banner'], [class*='nav'], [class*='header']").forEach((el) => candidates.add(el));
    document.querySelectorAll("body *").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.position === "sticky") candidates.add(el);
    });
    candidates.forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") return;
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top > 220 || r.height > 220) return;
      el.style.setProperty("display", "none", "important");
      hidden.push(el.tagName + "." + String(el.className || "").slice(0, 40));
    });
    return hidden;
  });
}

async function measure(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const topAbs = r.top + scrollY;
    const leftAbs = r.left + scrollX;
    return {
      top: Math.floor(topAbs),
      height: Math.ceil(topAbs + r.height) - Math.floor(topAbs),
      width: Math.ceil(leftAbs + r.width) - Math.floor(leftAbs),
      left: Math.floor(leftAbs),
    };
  }, selector);
}

async function captureRegion(page, file, clip) {
  await page.screenshot({
    path: file,
    type: "png",
    clip,
    fullPage: true,
    animations: "disabled",
  });
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20), bytes: b.length };
}

/* ---------------------------------------------------------------- *
 * Spanish -> English DOM translation (sites without native i18n).
 * ---------------------------------------------------------------- */
function applyTranslations(page, pairs) {
  return page.evaluate((entries) => {
    const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);
    const collected = [];

    const walk = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      let node;
      while ((node = walker.nextNode())) {
        const p = node.parentElement;
        if (!p || SKIP.has(p.tagName) || !node.textContent.trim()) continue;
        nodes.push(node);
      }
      return nodes;
    };

    const nodes = walk();
    const sorted = [...entries].sort((a, b) => b.from.length - a.from.length);

    // 1) Whole-node replacement (covers most spans, headings, links).
    const replaced = new Set();
    for (const { from, to } of sorted) {
      for (const node of nodes) {
        if (replaced.has(node)) continue;
        const raw = node.textContent;
        if (raw.trim() !== from) continue;
        const lead = raw.match(/^\s*/)[0];
        const trail = raw.match(/\s*$/)[0];
        node.textContent = lead + to + trail;
        replaced.add(node);
        collected.push(from);
      }
    }

    // 2) Phrase replacement across adjacent text nodes (headlines split in spans).
    const splitAtWord = (text, ideal) => {
      if (ideal <= 0 || ideal >= text.length) return ideal;
      const before = text.lastIndexOf(" ", ideal);
      const after = text.indexOf(" ", ideal);
      if (before !== -1 && ideal - before <= after - ideal) return before + 1;
      if (after !== -1) return after + 1;
      return ideal;
    };

    for (const { from, to } of sorted) {
      if (from.length < 20) continue;
      for (let pass = 0; pass < 8; pass += 1) {
        const current = walk();
        const full = current.map((n) => n.textContent).join("");
        const start = full.indexOf(from);
        if (start === -1) break;
        const end = start + from.length;
        const segments = [];
        let cursor = 0;
        current.forEach((node) => {
          const nodeEnd = cursor + node.textContent.length;
          const s = Math.max(cursor, start);
          const e = Math.min(nodeEnd, end);
          if (e > s) segments.push({ node, from: s - cursor, to: e - cursor, length: e - s });
          cursor = nodeEnd;
        });
        if (!segments.length) break;
        const total = segments.reduce((sum, seg) => sum + seg.length, 0);
        let offset = 0;
        segments.forEach((seg, index) => {
          const text = seg.node.textContent;
          let count =
            index === segments.length - 1
              ? to.length - offset
              : splitAtWord(to, Math.round((to.length * seg.length) / total) + offset) - offset;
          count = Math.max(1, Math.min(count, to.length - offset));
          seg.node.textContent =
            text.slice(0, seg.from) + to.slice(offset, offset + count) + text.slice(seg.to);
          offset += count;
        });
        collected.push(from);
      }
    }
    return collected.length;
  }, pairs);
}

const CUSTOMERUP_EN = [
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
  { from: "Agendar demo", to: "Book a demo" },
  { from: "Última campaña de producto", to: "Latest product campaign" },
  { from: "Diseña, previsualiza y colabora en nuestra plataforma de activación hecha para equipos de datos en Costa Rica.", to: "Design, preview, and collaborate in our activation platform built for data teams in Costa Rica." },
  { from: "Correo", to: "Email" },
  { from: "En la app", to: "In-app" },

  { from: "Escala, adapta e innova", to: "Scale, adapt, and innovate" },
  { from: "Pensada para equipos en todo Costa Rica, nuestra plataforma reduce la carga operativa y asegura un retorno medible para empresas de cualquier tamaño.", to: "Built for teams across Costa Rica, our platform reduces operational load and delivers measurable returns for companies of any size." },
  { from: "Disponibilidad de la plataforma", to: "Platform availability" },
  { from: "Mensajes enviados en 2024", to: "Messages sent in 2024" },
  { from: "Webhooks enviados en 2024", to: "Webhooks delivered in 2024" },
  { from: "Soporte directo desde San José", to: "Direct support from San José" },
  { from: "Datos + activación", to: "Data + activation" },
  { from: "Gestiona y personaliza los mensajes a tus clientes en un solo lugar. Porque cuando nacen de datos propios, un mensaje vale más que un clic: construye confianza.", to: "Manage and personalize customer messages in one place. When they come from first-party data, a message is worth more than a click: it builds trust." },
  { from: "Recorrido de datos", to: "Data journey" },
  { from: "Crea y automatiza mensajes por correo, WhatsApp o app con total flexibilidad y reglas locales.", to: "Create and automate email, WhatsApp, or in-app messages with full flexibility and local rules." },
  { from: "Flujos de datos", to: "Data flows" },
  { from: "Centraliza tus eventos de facturación electrónica de Hacienda, SINPE y web en tiempo real.", to: "Centralize your Hacienda e-invoicing, SINPE, and web events in real time." },
  { from: "Kit de integración", to: "Integration kit" },
  { from: "Programa, prueba y despliega webhooks y plantillas junto a tu equipo técnico sin enredos.", to: "Build, test, and ship webhooks and templates with your engineering team, without friction." },

  { from: "Arquitectura de activación de datos Customerup", to: "Customerup data activation architecture" },
  { from: "mensajes activados al año", to: "messages activated per year" },
  { from: "webhooks enviados en tiempo real", to: "webhooks delivered in real time" },
  { from: "para el primer evento en vivo", to: "to first live event" },
  { from: "Tu hub de datos Customerup", to: "Your Customerup data hub" },
  { from: "Ver mapa completo", to: "View full map" },

  { from: "Por qué elegirnos", to: "Why choose us" },
  { from: "Ayudamos a las empresas ticas a crecer con estrategia", to: "We help Costa Rican companies grow with strategy" },
  { from: "Un equipo de ingenieros y estrategas de datos en San José que convierte señales dispersas en decisiones claras para cada punto de contacto.", to: "A team of data engineers and strategists in San José who turn scattered signals into clear decisions at every touchpoint." },
  { from: "Solicitar cotización", to: "Request a quote" },
  { from: "Estrategia alineada", to: "Aligned strategy" },
  { from: "Planes de datos diseñados a la medida de tu negocio, no plantillas genéricas.", to: "Data plans built around your business, not generic templates." },
  { from: "Práctico", to: "Practical" },
  { from: "Transparente", to: "Transparent" },
  { from: "Escalable", to: "Scalable" },
  { from: "Atribución en vivo visible para todo el equipo.", to: "Live attribution visible to the whole team." },
  { from: "Crecimiento comprobado", to: "Proven growth" },
  { from: "Empresas en el GAM logran pipelines hasta 4X más sólidos con datos de primera mano.", to: "Companies across the GAM build pipelines up to 4X stronger with first-party data." },
  { from: "Estimación 2026", to: "2026 estimate" },
  { from: "Ejecución más rápida", to: "Faster execution" },
  { from: "Salimos a producción en semanas, no en meses, para que veas resultados pronto.", to: "We ship to production in weeks, not months, so you see results sooner." },
  { from: "Planificación", to: "Planning" },
  { from: "1 semana", to: "1 week" },
  { from: "Ejecución", to: "Execution" },
  { from: "17 semanas", to: "17 weeks" },
  { from: "Lanzamiento", to: "Launch" },
  { from: "0.2 semanas", to: "0.2 weeks" },
  { from: "Te ayudamos a destacar en cada canal con mensajes claros que de verdad conectan.", to: "We help you stand out in every channel with clear messages that truly connect." },

  { from: "El problema", to: "The problem" },
  { from: "Los stacks de datos fallan", to: "Data stacks fail" },
  { from: "cuando crece la demanda", to: "when demand grows" },
  { from: "eventos", to: "events" },
  { from: "Señales de clientes perdidas cada día entre silos", to: "Customer signals lost every day between silos" },
  { from: "Este desfase provoca", to: "This lag causes" },
  { from: "disparadores tardíos, datos", to: "late triggers, stale data" },
  { from: "viejos y ventas perdidas.", to: "and missed sales." },
  { from: "Retraso al mediodía", to: "Midday delay" },
  { from: "Las cargas por lotes se frenan", to: "Batch loads stall" },
  { from: "justo cuando sube el tráfico", to: "right when traffic rises" },
  { from: "Pico en la noche", to: "Nightly spike" },
  { from: "La demanda en tiempo real sube", to: "Real-time demand climbs" },
  { from: "al lanzar campañas de quincena", to: "when payday campaigns launch" },

  { from: "Qué hacemos", to: "What we do" },
  { from: "Nuestros servicios", to: "Our services" },
  { from: "Ingeniería de datos y estrategia desde Costa Rica para construir infraestructura confiable para tu equipo y tus clientes.", to: "Data engineering and strategy from Costa Rica to build reliable infrastructure for your team and your customers." },
  { from: "Consultoría de crecimiento estratégico", to: "Strategic growth consulting" },
  { from: "Atribución de primera mano, modelado de ciclo de vida y orquestación de canales.", to: "First-party attribution, lifecycle modeling, and channel orchestration." },
  { from: "Identidad del cliente y gobernanza", to: "Customer identity and governance" },
  { from: "Perfiles unificados, manejo de consentimiento y cumplimiento con la Ley 8968.", to: "Unified profiles, consent management, and compliance with Law 8968." },
  { from: "Telemetría web y de producto", to: "Web and product telemetry" },
  { from: "SDKs ligeros de eventos y sincronización en tiempo real con tu warehouse.", to: "Lightweight event SDKs and real-time sync with your warehouse." },
  { from: "Operaciones y automatización", to: "Operations and automation" },
  { from: "Webhooks automatizados, pruebas de QA y monitoreo de campañas al instante.", to: "Automated webhooks, QA testing, and instant campaign monitoring." },
];

const KORA_FINANCE_EN = [
  { from: "Saltar al contenido", to: "Skip to content" },
  { from: "Funciones", to: "Features" },
  { from: "Impacto", to: "Impact" },
  { from: "Planes", to: "Plans" },
  { from: "Bancos CR", to: "CR banks" },
  { from: "Ingresar a", to: "Sign in to" },
  { from: "Ingresar", to: "Sign in" },

  { from: "Tesorería moderna en", to: "Modern treasury in" },
  { from: "y SINPE.", to: "and SINPE." },
  { from: "Kora conecta tus cuentas del BAC, BCR, BN y SINPE empresarial con tipo de cambio MONEX en tiempo real, conciliación automática y liquidez en colones y dólares.", to: "Kora connects your BAC, BCR, BN, and corporate SINPE accounts with real-time MONEX exchange rates, automated reconciliation, and liquidity in colones and dollars." },
  { from: "Conectar banca CR", to: "Connect CR banking" },

  { from: "PLATAFORMA", to: "PLATFORM" },
  { from: "Control", to: "Full" },
  { from: "total para", to: "control over" },
  { from: "finanzas", to: "finance" },
  { from: "en Costa Rica", to: "in Costa Rica" },
  { from: "Centraliza cuentas en colones y dólares con tipo de cambio MONEX y flujo de caja al día.", to: "Centralize accounts in colones and dollars with MONEX exchange rates and up-to-date cash flow." },
  { from: "Liquidez total", to: "Total liquidity" },
  { from: "6.4% vs. mes anterior", to: "6.4% vs. last month" },
  { from: "Cuentas y divisas", to: "Accounts and currencies" },
  { from: "Ver todas", to: "View all" },
  { from: "Activa", to: "Active" },
  { from: "Tesorería multimoneda y SINPE", to: "Multi-currency treasury and SINPE" },
  { from: "Consolida saldos en colones, dólares y euros de BAC, BCR, BN y Banco Popular en un solo panel con tipo de cambio del BCCR.", to: "Consolidate colón, dollar, and euro balances from BAC, BCR, BN, and Banco Popular in a single panel with BCCR exchange rates." },
  { from: "Ejecución de gastos", to: "Spend execution" },
  { from: "de ₡25,000,000", to: "of ₡25,000,000" },
  { from: "Anual", to: "Annual" },
  { from: "Trimestral", to: "Quarterly" },
  { from: "Mensual", to: "Monthly" },
  { from: "Ene", to: "Jan" },
  { from: "Abr", to: "Apr" },
  { from: "Ago", to: "Aug" },
  { from: "Dic", to: "Dec" },
  { from: "Flujo de caja y Hacienda", to: "Cash flow and Hacienda" },
  { from: "Visualiza ingresos, gastos deducibles y ejecución presupuestaria con reportes listos para cierre fiscal y Hacienda.", to: "See revenue, deductible expenses, and budget execution with reports ready for fiscal close and Hacienda." },

  { from: "FLUJO EN VIVO", to: "LIVE FLOW" },
  { from: "Conecta", to: "Connect" },
  { from: "tu banca", to: "your banking" },
  { from: "en tiempo", to: "in real" },
  { from: "real", to: "time" },
  { from: "Tus cuentas bancarias de Costa Rica se sincronizan automáticamente con Kora, SINPE, MONEX y Hacienda.", to: "Your Costa Rican bank accounts sync automatically with Kora, SINPE, MONEX, and Hacienda." },

  { from: "ECOSISTEMA CR", to: "CR ECOSYSTEM" },
  { from: "Conexión", to: "Direct" },
  { from: "directa con", to: "connection to" },
  { from: "la banca", to: "Costa Rican" },
  { from: "costarricense", to: "banking" },
  { from: "Integra Kora con BAC, Banco Nacional, BCR, Banco Popular, BCCR, cooperativas, SINPE y tu ERP.", to: "Connect Kora with BAC, Banco Nacional, BCR, Banco Popular, BCCR, cooperatives, SINPE, and your ERP." },

  { from: "CUMPLIMIENTO CR", to: "CR COMPLIANCE" },
  { from: "Respaldo", to: "Regulatory" },
  { from: "regulatorio y", to: "backing and" },
  { from: "control", to: "financial" },
  { from: "financiero", to: "control" },
  { from: "Diseñado para operar bajo los estándares de auditoría, facturación y tipo de cambio oficiales de Costa Rica.", to: "Built to operate under Costa Rica's official audit, invoicing, and exchange-rate standards." },
  { from: "Trazabilidad estándar SUGEF", to: "SUGEF-standard traceability" },
  { from: "Trazabilidad", to: "Traceability" },
  { from: "Multimoneda", to: "Multi-currency" },
  { from: "Bancos y cooperativas CR", to: "CR banks and cooperatives" },
  { from: "Seguridad", to: "Security" },
  { from: "Cifrado TLS 1.3 y validación Hacienda", to: "TLS 1.3 encryption and Hacienda validation" },

  { from: "creados para", to: "built for" },
  { from: "equipos", to: "finance" },
  { from: "financieros", to: "teams" },
  { from: "Desde pymes en crecimiento hasta corporativos multibanco y zonas francas en Costa Rica.", to: "From growing SMBs to multi-bank corporations and free-trade zones in Costa Rica." },
  { from: "Plan pyme CR", to: "CR SMB plan" },
  { from: "Ideal para pymes costarricenses que buscan automatizar su conciliación en colones y dólares.", to: "Ideal for Costa Rican SMBs looking to automate reconciliation in colones and dollars." },
  { from: "/ mes", to: "/ month" },
  { from: "Comenzar ahora", to: "Get started" },
  { from: "Incluye:", to: "Includes:" },
  { from: "Conciliación con 2 bancos de Costa Rica", to: "Reconciliation with 2 Costa Rican banks" },
  { from: "Control de transferencias SINPE e IBAN", to: "SINPE and IBAN transfer control" },
  { from: "Validación de factura electrónica de Hacienda", to: "Hacienda e-invoice validation" },
  { from: "Hasta 3 miembros del equipo", to: "Up to 3 team members" },
  { from: "Soporte local en horario CR", to: "Local support during CR hours" },
  { from: "Recomendado para gerentes financieros", to: "Recommended for finance managers" },
  { from: "Plan empresarial", to: "Business plan" },
  { from: "Para empresas en crecimiento con cuentas en múltiples bancos, cooperativas y divisas.", to: "For growing companies with accounts across multiple banks, cooperatives, and currencies." },
  { from: "Probar 14 días gratis", to: "Try 14 days free" },
  { from: "Todo lo incluido en el plan pyme CR", to: "Everything in the CR SMB plan" },
  { from: "Conexión ilimitada a bancos y cooperativas CR", to: "Unlimited connections to CR banks and cooperatives" },
  { from: "Tipo de cambio MONEX (BCCR) en tiempo real", to: "Real-time MONEX (BCCR) exchange rates" },
  { from: "Reportes ejecutivos y flujo multimoneda", to: "Executive reports and multi-currency cash flow" },
  { from: "Hasta 20 miembros del equipo", to: "Up to 20 team members" },
  { from: "Soporte prioritario en Costa Rica", to: "Priority support in Costa Rica" },
  { from: "Plan corporativo", to: "Corporate plan" },
  { from: "Para grupos empresariales y zonas francas que requieren dispersión masiva, controles y ERP.", to: "For business groups and free-trade zones that need mass disbursements, controls, and ERP." },
  { from: "A medida", to: "Custom" },
  { from: "Hablar con ventas", to: "Talk to sales" },
  { from: "Todo lo incluido en el plan empresarial", to: "Everything in the business plan" },
  { from: "Usuarios y cédulas jurídicas ilimitadas", to: "Unlimited users and legal entities" },
  { from: "Integración ERP (SAP, Softland CR, Exactus)", to: "ERP integration (SAP, Softland CR, Exactus)" },
  { from: "Dispersión masiva de planillas e IBAN", to: "Mass payroll and IBAN disbursements" },
  { from: "Seguridad y trazabilidad estándar SUGEF", to: "SUGEF-standard security and traceability" },
  { from: "Gerente de cuenta dedicado en San José", to: "Dedicated account manager in San José" },
];

const TARGETS = [
  {
    slug: "koragrid",
    esUrl: "https://kora-grid-website.vercel.app/es",
    enUrl: "https://kora-grid-website.vercel.app/en",
    nativeEn: true,
    sections: [
      { selector: "#plataforma", fromTop: true },
      { selector: "#trazabilidad" },
      { selector: "#desafios" },
      { selector: "#modelado" },
      { selector: "#subestacion" },
      { selector: "#cobertura" },
    ],
  },
  {
    slug: "customerup",
    esUrl: "https://data-website-sandy.vercel.app/",
    nativeEn: false,
    translations: CUSTOMERUP_EN,
    sections: [
      { selector: "#root > div > main > section:nth-of-type(1)", fromTop: true },
      { selector: "#activation" },
      { selector: "#arquitectura" },
      { selector: "#why-choose-us" },
      { selector: "#root > div > main > section:nth-of-type(5)" },
      { selector: "#services" },
    ],
  },
  {
    slug: "kora-finance",
    esUrl: "https://financewebsite-three.vercel.app/",
    nativeEn: false,
    translations: KORA_FINANCE_EN,
    sections: [
      { selector: "#hero", fromTop: true },
      { selector: "#features" },
      { selector: "#process" },
      { selector: "#integrations" },
      { selector: "#security" },
      { selector: "#pricing" },
    ],
  },
];

const SPANISH_CONTROL = [
  "que", "para", "con", "los", "las", "del", "una", "nuestro", "nuestra",
  "clientes", "usted", "noticias", "conecta", "plataforma", "desde",
  "servicios", "tesorería", "empresas", "cuentas", "gastos", "equipo",
  "planes", "cifrado", "sincronizan", "dispersión", "gerente", "creados",
  "elegirnos", "hacemos", "trabajamos", "funciones", "cotización",
];

async function scanSpanish(page, selectors, slug) {
  return page.evaluate(({ sels, words }) => {
    const hits = [];
    const patterns = words.map((w) => ({
      word: w,
      re: new RegExp(`(^|[^a-záéíóúñü])(${w})(?=$|[^a-záéíóúñü])`, "i"),
    }));
    sels.forEach((sel) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const p = node.parentElement;
        if (!p || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(p.tagName)) continue;
        const text = node.textContent.trim();
        if (text.length < 2) continue;
        for (const { word, re } of patterns) {
          if (re.test(text)) {
            hits.push({ sel, word, text: text.slice(0, 90) });
            break;
          }
        }
      }
    });
    return hits;
  }, { sels: selectors.map((s) => s.selector), words: SPANISH_CONTROL });
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded").catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await delay(1200);
  await waitForImages(page);
  await slowScroll(page);
  await waitForImages(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await delay(500);
}

async function loadLocale(page, target, locale) {
  const url = locale === "en" && target.nativeEn ? target.enUrl : target.esUrl;
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      break;
    } catch (err) {
      if (attempt === 2) throw err;
      await delay(1500);
    }
  }
  await settle(page);

  if (locale === "en" && !target.nativeEn) {
    await page.evaluate(() => {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    });
    const applied = await applyTranslations(page, target.translations);
    await delay(600);
    await settle(page);
    return { translated: applied };
  }
  return {};
}

async function captureSet(browser, target) {
  const results = { slug: target.slug, captures: [], warnings: [], errors: [] };
  const locales = (process.env.LOCALES || "es,en").split(",").map((s) => s.trim()).filter(Boolean);

  for (const locale of locales) {
    const outDir = path.join(OUT_ROOT, target.slug, locale);
    fs.mkdirSync(outDir, { recursive: true });

    const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: DSF });
    const page = await context.newPage();
    page.setDefaultTimeout(30000);
    const consoleErrors = [];
    page.on("pageerror", (e) => consoleErrors.push(String(e).slice(0, 160)));

    try {
      const meta = await loadLocale(page, target, locale);
      console.log(`[${target.slug}/${locale}] loaded${meta.translated ? ` (${meta.translated} translations)` : ""}`);

      if (process.env.DUMP_TEXT === "1") {
        const texts = await page.evaluate((sels) => {
          const out = [];
          sels.forEach((sel) => {
            const el = document.querySelector(sel);
            if (!el) return;
            out.push(`\n### ${sel}`);
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            let n;
            while ((n = walker.nextNode())) {
              const p = n.parentElement;
              if (!p || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(p.tagName)) continue;
              const t = n.textContent.trim();
              if (t) out.push(`${p.tagName}: ${t}`);
            }
          });
          return out;
        }, target.sections.map((s) => s.selector));
        console.log(texts.join("\n"));
      }

      const first = target.sections[0];
      const firstRect = await measure(page, first.selector);
      if (!firstRect) throw new Error(`section not found: ${first.selector}`);
      console.log(`[${target.slug}/${locale}] section 01 ${first.selector} ${firstRect.width}x${firstRect.height} @${firstRect.top}`);

      await page.evaluate(() => window.scrollTo(0, 0));
      await delay(400);

      const firstHeight = first.fromTop ? Math.round(firstRect.top + firstRect.height) : firstRect.height;
      const firstTop = first.fromTop ? 0 : firstRect.top;
      const file1 = path.join(outDir, "01.png");
      await captureRegion(page, file1, { x: 0, y: firstTop, width: VIEWPORT.width, height: firstHeight });
      results.captures.push({ locale, index: 1, selector: first.selector, rect: { top: firstTop, height: firstHeight }, file: file1, ...pngSize(file1) });
      console.log(`[${target.slug}/${locale}] 01 -> ${firstHeight * DSF}px tall`);

      // Sections 2+: remove fixed/sticky chrome so it never bleeds into a frame.
      if (firstRect.top > 0 || true) {
        const hidden = await hideStickyChrome(page);
        if (hidden.length) console.log(`[${target.slug}/${locale}] hid chrome: ${hidden.join(", ")}`);
        await delay(350);
      }

      for (let i = 1; i < target.sections.length; i += 1) {
        const section = target.sections[i];
        let rect = await measure(page, section.selector);
        if (!rect) throw new Error(`section not found: ${section.selector}`);
        await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 180)), rect.top);
        await delay(500);
        rect = await measure(page, section.selector);
        const clip = { x: 0, y: rect.top, width: VIEWPORT.width, height: rect.height };
        const file = path.join(outDir, String(i + 1).padStart(2, "0") + ".png");
        await captureRegion(page, file, clip);
        const size = pngSize(file);
        results.captures.push({ locale, index: i + 1, selector: section.selector, rect: clip, file, ...size });
        console.log(`[${target.slug}/${locale}] 0${i + 1} ${section.selector} -> ${size.width}x${size.height}`);
        if (size.width !== VIEWPORT.width * DSF) {
          results.warnings.push(`${locale}/0${i + 1}: width ${size.width} != ${VIEWPORT.width * DSF}`);
        }
        if (size.height !== rect.height * DSF) {
          results.warnings.push(`${locale}/0${i + 1}: height ${size.height} != ${rect.height * DSF}`);
        }
      }

      if (locale === "en" && !target.nativeEn) {
        const hits = await scanSpanish(page, target.sections, target.slug);
        if (hits.length) {
          results.warnings.push(`Spanish remnants: ${hits.length}`);
          hits.slice(0, 25).forEach((h) => results.warnings.push(`  "${h.word}" in ${h.text}`));
        } else {
          console.log(`[${target.slug}/en] no Spanish control words in captured sections`);
        }
      }

      if (consoleErrors.length) {
        results.warnings.push(`page errors: ${consoleErrors.slice(0, 3).join(" | ")}`);
      }
    } catch (err) {
      results.errors.push(`${locale}: ${err.message}`);
      console.error(`[${target.slug}/${locale}] ERROR ${err.message}`);
    } finally {
      await context.close();
    }
  }

  return results;
}

async function main() {
  const only = (process.env.ONLY || "").split(",").map((s) => s.trim()).filter(Boolean);
  const targets = only.length ? TARGETS.filter((t) => only.includes(t.slug)) : TARGETS;

  const browser = await chromium.launch({ headless: true, executablePath: CHROME });
  const report = [];

  for (const target of targets) {
    console.log(`\n=== ${target.slug} ===`);
    report.push(await captureSet(browser, target));
  }

  await browser.close();
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\nReport -> ${REPORT_PATH}`);
  const failed = report.filter((r) => r.errors.length);
  if (failed.length) {
    console.error(`Failures: ${failed.map((f) => f.slug).join(", ")}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
