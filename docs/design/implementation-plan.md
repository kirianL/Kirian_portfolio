# Plan de Implementación — Rediseño del Hero (Portfolio-Kirian)

> **Agente:** `@implementation-planner` — LandingFactory (solo lectura)  
> **Destino:** `docs/design/implementation-plan.md`  
> **Alcance de esta iteración:** rediseño del Hero en `index.astro` y `es/index.astro`. Secciones inferiores (`WorkExperience`, `Projects`, `TechStack`, `blog`, `connect`, `Footer`) se preservan intactas para no perder información.  
> **Stack respetado:** Astro 5 + Tailwind CSS v4 + TypeScript (sin cambios de framework ni package manager).

---

## 1. Stack y Dependencias

- **Framework:** Astro 5 (existente). Sin cambios.
- **Estilos:** Tailwind CSS v4 (existente). Se añaden tokens aditivos en `@theme` (no se rompen los existentes).
- **Fuentes (Google Fonts):** se extiende el `fontsHref` de `Layout.astro` para incluir `Inter` (pesos 400/450/500) además de `Instrument Serif` (ya previsto en `loadSerifFonts`). No se añade ninguna dependencia npm nueva.
- **Gráficos:** WebGL2 nativo en el navegador (ya usado por `BannerHero.astro`), sin librerías nuevas. `public/profile.webp` ya existe (1169×1483, 116 KB).
- **Iconos:** SVG inline (regla LandingFactory: cero emojis, cero raster para iconos). Se reutiliza el path `ArrowUpRight` del inventario de assets para la flecha `↗` del botón primario.
- **Animación/motion:** se mantiene la infraestructura existente (`IntersectionObserver`, `prefers-reduced-motion`, gestión de contexto WebGL). No se introduce `motion`/`framer` nuevo.

---

## 2. Organización de Archivos

### Archivos a CREAR

```
src/
└── components/
    └── hero/
        ├── RedDitherBanner.astro      # Banner full-width WebGL2 dither rojo + fade vertical
        ├── CentralHero.astro           # Columna centrada max-w-[540px] (avatar, nombre, bio, email, CTAs)
        ├── HeroAvatar.astro            # Squircle 48×48 con public/profile.webp
        └── (opcional) HeroBio.astro    # Subcomponente de prosa si se prefiere descomponer
    └── ui/
        └── PillButton.astro            # Átomo de botón pill (primary-light / secondary-dark)
```

### Archivos a MODIFICAR

```
src/
├── layouts/
│   └── Layout.astro                 # fontsHref: añadir Inter cuando loadSerifFonts=true
├── pages/
│   ├── index.astro                   # Reemplazar <BannerHero/> por bloque Hero; mantener secciones inferiores
│   └── es/index.astro                # Idem en español
└── styles/
    └── global.css                    # @theme: añadir --font-hero-sans / --font-hero-serif (aditivo)
```

### Archivos NO TOCAR (preservar)

- `src/components/BannerHero.astro` (se deja como está; deja de importarse en las páginas índice). No se elimina para evitar rupturas.
- `src/components/Navbar.astro` (integración "limpia": se reutiliza tal cual como barra superior). Cambio opcional documentado en §6.
- `src/components/WorkExperience.astro`, `Projects.astro`, `TechStack.astro`, `Footer.astro`, `EmailMeta.astro`, `ExperienceMeta.astro` y todo el bloque "about-intro" / "sobre-mi-intro".
- `src/data/data.ts` (solo lectura de datos reales de Kirian).

---

## 3. Arquitectura de Componentes

### 3.1 `RedDitherBanner.astro`

- **Responsabilidad:** renderizar el fondo rojo dithered/halftone full-width con fade vertical suave a `#0a0a0a`, en código (WebGL2), sin screenshots como fondo.
- **Props:** ninguna (autocontenido). Acepta `class` opcional para altura responsive.
- **Altura:** `h-[180px] sm:h-[240px]` (mobile 180px, desktop 240px). `w-full`, `relative`, `overflow-hidden`, `pointer-events-none`.
- **Técnica:** reutiliza la infraestructura de `BannerHero.astro` (VS/FS, gestión de contexto, `IntersectionObserver`, `prefers-reduced-motion`, `webglcontextlost`). Cambios en el FS:
  1. **Paleta:** `accent = #e80100` (peak red), midtone `#990a0a`, base `#0a0a0a`.
  2. **Dither Bayer 4×4** aplicado al campo de ruido orgánico existente (`swirl`/`glassDepthField`) para producir puntos discretos:
     ```glsl
     float bayer[16] = float[16](
       0.0, 8.0, 2.0, 10.0,
       12.0, 4.0, 14.0, 6.0,
       3.0, 11.0, 1.0, 9.0,
       15.0, 7.0, 13.0, 5.0
     );
     int bx = int(mod(gl_FragCoord.x, 4.0));
     int by = int(mod(gl_FragCoord.y, 4.0));
     float threshold = bayer[by * 4 + bx] / 16.0;
     float intensity = clamp(noiseField, 0.0, 1.0); // del campo orgánico existente
     float dotted = step(threshold, intensity);
     ```
  3. **Fade vertical:** `float fade = 1.0 - smoothstep(0.35, 1.0, vUV.y);` (sólido arriba, transparente hacia abajo). Multiplicar `dotted *= fade`.
  4. **Color final:** `mix(#0a0a0a, #e80100, dotted)` con leve variación hacia `#990a0a` en midtones.
- **Fallback estático (contingencia):** si WebGL2 no está disponible, fondo sólido `#0a0a0a` (sin degradación visual grave).
- **Reduced motion:** congelar en un frame estático (comportamiento ya implementado).

### 3.2 `HeroAvatar.astro`

- **Props:** `src` (default `/profile.webp`), `alt` (default `"Kirian Luna"`), `size` (default `48`).
- **Clases:** `w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-xs` (squircle ~12px; alternativa `rounded-2xl`/16px según design-system).
- **Imagen:** `<img src={src} alt={alt} width="48" height="48" loading="eager" decoding="async" class="w-full h-full object-cover object-[center_28%]" />`.
- **Aislamiento de márgenes:** sin `m-*`/`mt-*`/`mb-*` externos; el espaciado lo controla el padre vía `gap`.

### 3.3 `PillButton.astro`

- **Props (TypeScript):**
  ```ts
  interface PillButtonProps {
    variant: "primary-light" | "secondary-dark";
    href?: string;
    type?: "button" | "submit";
    external?: boolean;
    ariaLabel?: string;
    class?: string;
  }
  ```
- **Slot:** texto del botón (puede incluir SVG inline para la flecha).
- **Estilos:**
  - `primary-light`: `h-9 px-4 rounded-full bg-[#f5f5f5] text-[#0a0a0a] text-[13.5px] font-medium tracking-[-0.01em] hover:bg-[#e4e4e7] hover:-translate-y-px active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d1c5ad] focus-visible:outline-offset-3 transition-[background-color,transform] duration-180`.
  - `secondary-dark`: `h-9 px-4 rounded-full bg-white/[0.03] text-[#f5f5f5] border border-white/10 text-[13.5px] font-medium hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98] focus-visible:outline ...`.
- **Accesibilidad:** si `href` presente, renderiza `<a>` con `target="_blank" rel="noopener noreferrer"` cuando `external`; si no, `<button type={type}>`. Incluye `aria-label` opcional.

### 3.4 `CentralHero.astro`

- **Props:**
  ```ts
  interface CentralHeroProps {
    lang: "EN" | "ES";
  }
  ```
- **Comportamiento:** selecciona el diccionario interno (o recibe datos) para textos bilingües. Para mantener el componente autocontenido y tipado, se le pasan props explícitas desde la página (ver §4) en lugar de importar `data.ts` dentro del componente. Props completas:
  ```ts
  interface CentralHeroProps {
    lang: "EN" | "ES";
    name: string;            // "Kirian Luna"
    roleLine: string;        // "Software Engineer @ Ultimate Media Productions" / "Ingeniero de Software en Ultimate Media Productions"
    roleUrl?: string;        // "https://ultimatemediaproductions.com"
    bio: string;             // párrafo corto (2-3 líneas)
    stackLine?: string;       // "TypeScript, React 19, Next.js, Astro, PostgreSQL"
    locationLine?: string;    // "Puerto Limón, Costa Rica — available worldwide"
    email: string;           // "kirianluna.u@gmail.com"
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  }
  ```
- **Layout interno (contenedor padre controla espaciado con `flex flex-col gap-*`):**
  ```astro
  <div class="flex flex-col gap-5">
    <HeroAvatar />
    <h1 class="font-hero-serif text-[28px] font-normal leading-[46px] tracking-[-0.01em] text-[#d1c5ad]">
      {name}
    </h1>
    <p class="font-hero-sans text-[15px] font-[450] leading-[19px] tracking-[0.16px] text-[#f5f5f5]">
      {roleLine}  <!-- con enlace al rol si roleUrl -->
    </p>
    <p class="font-hero-sans text-[15px] font-[450] leading-[19px] tracking-[0.16px] text-[#f5f5f5] opacity-90">
      {bio}
    </p>
    {stackLine && <p class="... text-[#b0b0b0]">{stackLine}</p>}
    {locationLine && <p class="... text-[#b0b0b0]">{locationLine}</p>}
    <button type="button" data-copy-email={email} class="... email copy chip ..." aria-label="Copy email">
      <EnvelopeIcon /> {email}
    </button>
    <nav aria-label="Hero actions" class="flex flex-wrap items-center gap-2.5">
      <PillButton variant="primary-light" href={ctaPrimary.href} external>
        {ctaPrimary.label} <ArrowUpRightIcon />
      </PillButton>
      <PillButton variant="secondary-dark" href={ctaSecondary.href}>
        {ctaSecondary.label}
      </PillButton>
    </nav>
  </div>
  ```
- **Semántica:** `<header>` envolvente con `<h1>` para el nombre. Email como `<button data-copy-email>` para reutilizar el handler de copiado existente en `index.astro` (que consulta todos `[data-copy-email]` y muestra el toast `#copy-toast`).
- **Aislamiento de márgenes:** ningún hijo tiene `m-*` externo; el espaciado se controla con `gap` del contenedor padre.

---

## 4. Textos bilingües (datos reales de Kirian)

### EN
- **name:** `Kirian Luna`
- **roleLine:** `Software Engineer @ Ultimate Media Productions` (enlace a `https://ultimatemediaproductions.com`)
- **bio:** `Systems Engineering graduate from Universidad Latina de Costa Rica. I build scalable digital products at the intersection of robust backend, responsive frontend, and clean UX.`
- **stackLine:** `Specialized in TypeScript, React 19, Next.js, Astro, and PostgreSQL.`
- **locationLine:** `Based in Puerto Limón, Costa Rica — available for engineering roles and consulting worldwide.`
- **email:** `kirianluna.u@gmail.com`
- **ctaPrimary:** `{ label: "book a call ↗", href: "/contact" }` (o URL de Cal.com configurable)
- **ctaSecondary:** `{ label: "view my work", href: "/projects" }` (o `#projects` si existe ancla)

### ES
- **name:** `Kirian Luna`
- **roleLine:** `Ingeniero de Software en Ultimate Media Productions` (enlace)
- **bio:** `Graduado de Ingeniería en Sistemas por la Universidad Latina de Costa Rica. Construyo productos digitales escalables combinando arquitectura robusta, frontend responsivo y UX limpia.`
- **stackLine:** `Especializado en TypeScript, React 19, Next.js, Astro y PostgreSQL.`
- **locationLine:** `Desde Limón, Costa Rica para proyectos locales e internacionales.`
- **email:** `kirianluna.u@gmail.com`
- **ctaPrimary:** `{ label: "agendar llamada ↗", href: "/es/contact" }`
- **ctaSecondary:** `{ label: "ver mi trabajo", href: "/es/projects" }`

> Nota: los textos siguen Sentence case (regla LandingFactory). Los nombres propios (`Ultimate Media Productions`, `Universidad Latina de Costa Rica`, `Costa Rica`, `Limón`) conservan mayúscula. No se usan palabras cliché ("potencia", "eleva", "revoluciona", "sin fisuras").

---

## 5. Plan de Tipografía y Tokens

### 5.1 `Layout.astro` — `fontsHref`

Modificar la rama `loadSerifFonts` para incluir Inter:

```astro
const fontsHref = loadSerifFonts
  ? "https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500&family=IBM+Plex+Mono:wght@400;500;600&family=Caveat:wght@500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400;1,6..72,500&family=Instrument+Serif:ital@0;1&display=swap"
  : "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Caveat:wght@500;600&display=swap";
```

`index.astro` y `es/index.astro` deben pasar `loadSerifFonts={true}` al `Layout`.

### 5.2 `src/styles/global.css` — tokens aditivos en `@theme`

Añadir (sin eliminar los existentes):

```css
@theme {
  --font-hero-sans: "Inter", "Inter Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-hero-serif: "Instrument Serif", "Instrument Serif Fallback", Georgia, serif;
}
```

Y un `@font-face` de fallback para Inter (opcional, siguiendo el patrón de `Inter-Fallback` ya existente). Las clases Tailwind resultantes: `font-hero-sans`, `font-hero-serif`.

### 5.3 Colores del Hero (valores literales, no tokens nuevos obligatorios)

Para no contaminar el sistema de grises global, el Hero usa valores literales:
- Canvas: `#0a0a0a`
- Texto primario: `#f5f5f5`
- Nombre (serif): `#d1c5ad`
- Texto secundario/muted: `#b0b0b0`
- Botón primario: bg `#f5f5f5`, texto `#0a0a0a`
- Botón secundario: bg `rgba(255,255,255,0.03)`, borde `rgba(255,255,255,0.10)`, texto `#f5f5f5`
- Banner: `#e80100` / `#990a0a` sobre `#0a0a0a`

---

## 6. Estrategia Responsive e Interacciones

### 6.1 Breakpoints (verificación obligatoria en 1440×900, 768×1024, 390×844)

| Elemento | Desktop (1440) | Tablet (768) | Mobile (390) |
|---|---|---|---|
| Banner rojo | `h-[240px]`, dither completo, fade vertical | `h-[200px]` | `h-[180px]`, fade más acelerado |
| Contenedor hero | `max-w-[540px] mx-auto px-5 sm:px-0`, padding superior `48px` | `max-w-[500px]`, padding lateral `32px` | `w-full px-5`, padding superior `32px` |
| Avatar | `48×48`, `rounded-xl`, margen inferior `20px` | `46×46` | `42×42` |
| Nombre (H1) | `28px` / `line-height 46px` | `26px` / `42px` | `24px` / `36px` |
| Bio | `15px` / `19px` / peso 450 / tracking 0.16px | `14.5px` / `22px` | `14px` / `21px` |
| Email | texto + botón copiar SVG con tooltip | idéntico | texto en bloque, tap directo |
| CTAs | fila horizontal `gap-2.5` | fila horizontal | `flex-wrap` o apilado, altura táctil mínima 44px |
| Top bar | reutiliza `Navbar.astro` (fijo, translúcido) | idem | menú móvil existente |

### 6.2 Top bar (`kirian.` + social)

- **Enfoque recomendado (integración limpia):** reutilizar `Navbar.astro` tal cual. Ya provee brand + nav + theme toggle + language selector + menú móvil. No duplicar barra en el Hero.
- **Alternativa opcional (si se quiere fidelidad al `kirian.` del reference):** en `Navbar.astro`, reemplazar el `<img src="/LogoKirian.png">` del brand por el texto `kirian.` en `font-hero-sans text-[15px] font-medium text-[#f5f5f5]`. Esto afecta a todo el sitio; documentar como decisión de scope antes de ejecutar. Recomendación: mantener el logo por defecto para minimizar riesgo, y dejar el texto `kirian.` como mejora opcional.

### 6.3 Interacciones

- **Botón primario ("book a call ↗"):** hover `bg-[#e4e4e7]`, `translate-y-[-1px]`, flecha SVG rota 4°; focus-visible anillo `#d1c5ad`; active `scale-[0.98]`.
- **Botón secundario ("view my work"):** hover `bg-white/[0.08]`, borde `white/20`.
- **Email copiable:** reutiliza el handler existente en `index.astro` (`[data-copy-email]` + toast `#copy-toast`). Feedback `Copied!` 1800ms, `aria-live="polite"`.
- **Banner:** `prefers-reduced-motion` congela el frame; `IntersectionObserver` apaga el render al hacer scroll (infraestructura existente).
- **Coexistencia con tema claro/oscuro:** el Hero es siempre oscuro (`#0a0a0a`) como en las referencias. Las secciones inferiores conservan su comportamiento theme-aware (`bg-grayscale-1`). En modo oscuro la transición es casi imperceptible (`#0a0a0a` → `#111113`); en modo claro hay un corte deliberado Hero-oscuro / cuerpo-claro (límite de sección aceptable).

---

## 7. Integración en las páginas

### 7.1 `src/pages/index.astro` (y `es/index.astro` análogo)

Reemplazar:

```astro
import BannerHero from "../components/BannerHero.astro";
...
<BannerHero name={data.name} title={data.title} />
```

Por el bloque Hero, manteniendo el resto del contenido:

```astro
---
import Layout from "../layouts/Layout.astro";
import Navbar from "../components/Navbar.astro";
import RedDitherBanner from "../components/hero/RedDitherBanner.astro";
import CentralHero from "../components/hero/CentralHero.astro";
import EmailMeta from "../components/EmailMeta.astro";
import ExperienceMeta from "../components/ExperienceMeta.astro";
import Projects from "../components/Projects.astro";
import WorkExperience from "../components/WorkExperience.astro";
import TechStack from "../components/TechStack.astro";
import Footer from "../components/Footer.astro";
import { dictionaries } from "../data/data";
import { professionalServiceSchema } from "../lib/seo";

const data = dictionaries.EN;
const isEs = false; // true en es/index.astro
---

<Layout
  title="Kirian Luna | Software Engineer"
  description="..."
  lang="en"
  pageType="ProfilePage"
  schema={professionalServiceSchema}
  loadSerifFonts={true}
>
  <Navbar />

  <!-- HERO (nuevo) -->
  <section class="relative bg-[#0a0a0a] text-[#f5f5f5]">
    <RedDitherBanner />
    <div class="max-w-[540px] mx-auto px-5 sm:px-0 pt-12 sm:pt-16 pb-16 sm:pb-20">
      <CentralHero
        lang="EN"
        name="Kirian Luna"
        roleLine="Software Engineer @ Ultimate Media Productions"
        roleUrl="https://ultimatemediaproductions.com"
        bio="Systems Engineering graduate from Universidad Latina de Costa Rica. I build scalable digital products at the intersection of robust backend, responsive frontend, and clean UX."
        stackLine="Specialized in TypeScript, React 19, Next.js, Astro, and PostgreSQL."
        locationLine="Based in Puerto Limón, Costa Rica — available for engineering roles and consulting worldwide."
        email="kirianluna.u@gmail.com"
        ctaPrimary={{ label: "book a call ↗", href: "/contact" }}
        ctaSecondary={{ label: "view my work", href: "/projects" }}
      />
    </div>
  </section>

  <!-- SECCIONES INFERIORES (preservadas) -->
  <main id="main-content" class="min-h-screen bg-grayscale-1">
    <div class="max-w-2xl mx-auto px-5 sm:px-0 pt-8 sm:pt-10 pb-14 sm:pb-16 flex flex-col gap-12 sm:gap-14">
      <header class="flex flex-col gap-y-0">
        <!-- Metadata row (preservada) -->
        <div class="grid grid-cols-3 sm:flex sm:items-start gap-x-3 gap-y-4 sm:gap-8 mt-6">
          ... (Location, EmailMeta, ExperienceMeta, Time Zone) ...
        </div>
      </header>
      <!-- About / Narrative (preservado) -->
      <section id="about-intro" class="flex flex-col gap-4"> ... </section>
      <div class="border-t border-grayscale-3/50 dark:border-grayscale-3/25 -mt-8 -mb-8"></div>
      <WorkExperience />
      <Projects />
      <TechStack />
      <!-- Blog (preservado) -->
      <section id="blog" class="flex flex-col gap-5"> ... </section>
      <!-- Contact (preservado) -->
      <section id="contacto" class="flex flex-col gap-5"> ... </section>
      <Footer />
    </div>

    <!-- Toast (preservado) -->
    <div id="copy-toast" ...> ... </div>
  </main>
  <!-- scripts preservados -->
</Layout>
```

> En `es/index.astro`: `lang="es"`, `loadSerifFonts={true}`, `CentralHero lang="ES"` con textos en español, rutas `/es/contact`, `/es/projects`, `id="copy-toast-es"`.

### 7.2 `CentralHero.astro` — iconos SVG inline

Incluir (sin dependencias) los SVG del inventario:
- `EnvelopeIcon` (para el email copiable).
- `ArrowUpRightIcon` (para el botón primario): `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10" /></svg>`.

---

## 8. Orden Paso a Paso de Implementación (macro → micro)

1. **Tokens y fuentes:** añadir `--font-hero-sans`/`--font-hero-serif` en `global.css` y extender `fontsHref` en `Layout.astro` (rama `loadSerifFonts`).
2. **Crear `PillButton.astro`** (átomo reutilizable).
3. **Crear `HeroAvatar.astro`** (48×48, `public/profile.webp`, `object-[center_28%]`).
4. **Crear `RedDitherBanner.astro`** (WebGL2 rojo + Bayer 4×4 + fade vertical + reduced-motion).
5. **Crear `CentralHero.astro`** (columna `max-w-[540px]`, avatar, nombre serif, bio Inter, email copiable, 2 CTAs).
6. **Actualizar `index.astro`** y **`es/index.astro`**: insertar bloque Hero, mantener secciones inferiores, pasar `loadSerifFonts={true}`.
7. **(Opcional, scope decision)** Ajustar brand en `Navbar.astro` a `kirian.` (si se aprueba).
8. **Verificación:** `npm run build` (0 errores), `npm run typecheck`, Playwright en 1440×900 / 768×1024 / 390×844, consola sin errores,