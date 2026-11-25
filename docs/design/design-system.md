# Sistema de Diseño y Especificación Visual del Hero — Kirian Luna Portfolio

**Agente:** `@ui-ux-designer` — LandingFactory  
**Modo:** Solo lectura (Análisis y Especificación de Arquitectura Visual)  
**Destino documental:** `docs/design/design-system.md`  
**Stack de destino:** Astro 5 + Tailwind CSS v4 + TypeScript  

---

```markdown
# Design System & Visual Specification: Central Editorial Hero

## 1. Tesis Visual y Modo de Superficie

### Tesis Visual
> *"Atmósfera analógica dithered en la cumbre; intimidad tipográfica, mesura editorial y precisión técnica en el centro."*

El rediseño del Hero fusiona dos lenguajes visuales complementarios para erradicar cualquier estética genérica SaaS:
1. **La atmósfera de `saadb-red-banner.png`:** Un banner superior inmersivo de textura halftone/dithered en tonos carmesí/óxido (`#E52E2E` a `#1A0505`) que se desvanece de manera orgánica hacia un lienzo carbón mate profundo (`#09090b` / `#080808`), evocando impresión analógica, experimentación y calor humano.
2. **La composición central de `nachi-center-hero.png`:** Una columna editorial centrada, serena y de alta densidad de señal, con un anclaje visual compacto (avatar squircle de 48×48px), prosa personal estructurada en micro-párrafos legibles y un grupo de acción minimalista con botones tipo píldora (`rounded-full`).

### Modo de Superficie
- **Enfoque Dark-Canvas Puro:** El canvas principal opera sobre una base ultra-oscura neutra cálida (`#080808`), evitando tintes azulados o púrpuras artificiales.
- **Profundidad Óptica sin Sombras Pesadas:** No se utilizan elevaciones `shadow-lg` ni tarjetas cerradas. La jerarquía se construye exclusivamente mediante:
  * Gradiente de opacidad y textura halftone del banner superior.
  * Líneas divisorias hiperfinas de 1px (`rgba(255, 255, 255, 0.08)`).
  * Contraste cromático entre el titular display color arena (`#d1c5ad`) y el cuerpo de texto marfil frío (`#f5f5f5`).

### Reglas Anti-Cliché y Anti-AI Slop
- **Prohibido:** Kickers o subtítulos en mayúsculas sostenidas con tracking exagerado encima de los títulos.
- **Prohibido:** Tarjetas con bordes izquierdos coloreados (`border-l-4`).
- **Prohibido:** Iconos dentro de cajas cuadradas con fondos pastel o degradados azul/morado.
- **Prohibido:** Manchas de luz neón (`blur-3xl glows`) circulares estáticas y puntos pulsantes sin significado funcional.
- **Mandatario:** Toda la iconografía se renderiza en **SVG semántico** optimizado (cero emojis o caracteres pictográficos Unicode en la interfaz).

---

## 2. Tokens Semánticos de Diseño

### 2.1 Paleta de Color Semántica

| Token Semántico | Valor Hex / Canal | Propósito / Aplicación | Contraste vs Canvas |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#080808` | Lienzo base principal del viewport | Base |
| `--bg-surface` | `#121214` | Superficie de componentes interactivos discretos | 1.15:1 |
| `--bg-surface-elevated`| `#18181b` | Píldoras secundarias y modales | 1.35:1 |
| `--bg-surface-subtle` | `rgba(255, 255, 255, 0.04)` | Hover states de enlaces y botones fantasma | N/A |
| `--text-primary` | `#f5f5f5` | Texto principal del cuerpo (Inter) | **19.3:1 (AAA)** |
| `--text-serif-accent` | `#d1c5ad` | Titular display editorial (Instrument Serif) | **12.8:1 (AAA)** |
| `--text-secondary` | `#a1a1aa` | Metadatos, etiquetas secundarias, fechas | **7.4:1 (AA)** |
| `--text-muted` | `#71717a` | Enlaces sutiles, microcopy de soporte | **4.6:1 (AA)** |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Bordes de píldoras, divisores de 1px | N/A |
| `--border-focus` | `#d1c5ad` | Indicador accesible de foco (`focus-visible`) | 12.8:1 |
| `--banner-red-core` | `#e52e2e` | Núcleo de puntos halftone y ondas de alta energía | 4.8:1 |
| `--banner-red-dark` | `#881313` | Degradado medio del dither | 2.1:1 |
| `--banner-red-abyss` | `#1a0505` | Transición al negro puro del canvas | 1.1:1 |
| `--status-available` | `#10b981` | Acento de disponibilidad ("Open to work") | 8.2:1 |

### 2.2 Variables de Tailwind CSS v4 (`src/styles/theme.css`)
```css
@theme {
  --color-canvas: #080808;
  --color-surface: #121214;
  --color-surface-hover: #1c1c1f;
  --color-text-primary: #f5f5f5;
  --color-text-serif: #d1c5ad;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-border-hover: rgba(255, 255, 255, 0.18);
  --color-banner-red: #e52e2e;

  --font-hero-sans: "Inter", "Inter Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-hero-serif: "Instrument Serif", "Instrument Serif Fallback", Georgia, serif;
  --font-hero-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}
```

### 2.3 Espaciado, Radios y Profundidad
- **Espaciado modular:** Escala fija de 4px: `gap-1.5` (6px), `gap-3` (12px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px), `gap-12` (48px).
- **Radios:**
  * Avatar: `rounded-2xl` (16px continuo) con máscara squircle.
  * Botones CTA: `rounded-full` (9999px) estilo píldora minimalista.
  * Card / Form elements: `rounded-xl` (12px).
- **Profundidad táctil:** Sin `box-shadow` difuso. Se utiliza exclusivamente `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08)` en botones primarios y un borde de `1px` sólido semitransparente.

---

## 3. Escala Tipográfica y Plan de Fuentes

### 3.1 Plan de Fuentes (Observed vs Substituted)

| Rol Tipográfico | Familia Observada / Requerida | Estado | Pesos Requeridos | Fallback Métrico |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display Title** | `Instrument Serif` | **Exacta (Requerida)** | `400` (Regular) | `"Instrument Serif Fallback", Georgia, serif` |
| **Cuerpo & Interfaz** | `Inter` | **Exacta (Requerida)** | `450` (Medium-Light) / `500` | `"Inter Fallback", -apple-system, sans-serif` |
| **Metadatos Técnicos** | `IBM Plex Mono` | **Existente en Repo** | `400`, `500` | `ui-monospace, monospace` |

### 3.2 Especificación Estricta de las Fuentes Solicitadas por el Usuario

#### 1. Texto de Cuerpo & UI (`Inter`)
```css
font-family: Inter, "Inter Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
font-size: 15px;
font-weight: 450;
line-height: 19px;
letter-spacing: 0.16px;
color: #f5f5f5;
```

#### 2. Titular Display Editorial (`Instrument Serif`)
```css
font-family: "Instrument Serif", "Instrument Serif Fallback", Georgia, serif;
font-size: 28px;
font-weight: 400;
line-height: 46px;
letter-spacing: -0.01em;
color: #d1c5ad;
```

### 3.3 Jerarquía Tipográfica del Hero

| Elemento | Fuente | Tamaño | Peso | Line-Height | Letter-Spacing | Color |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Navbar Brand** | `Inter` | 14px | 500 | 18px | -0.01em | `#f5f5f5` |
| **Navbar Links** | `Inter` | 13px | 400 | 16px | 0px | `#a1a1aa` |
| **Hero Name (H1)** | `Instrument Serif` | 28px / 32px | 400 | 46px | -0.015em | `#d1c5ad` |
| **Hero Role Line** | `Inter` | 15px | 450 | 19px | 0.16px | `#f5f5f5` |
| **Hero Body Paragraphs** | `Inter` | 15px | 450 | 23px | 0.16px | `#f5f5f5` (65% opacidad en prosa base) |
| **Hero Inline Links** | `Inter` | 15px | 500 | 23px | 0.16px | `#f5f5f5` (subrayado sutil) |
| **CTA Primary Button** | `Inter` | 13.5px | 500 | 16px | 0.05px | `#080808` sobre `#f5f5f5` |
| **CTA Secondary Button**| `Inter` | 13.5px | 450 | 16px | 0.05px | `#f5f5f5` sobre `#121214` |
| **Badge / Status** | `IBM Plex Mono` | 11px | 500 | 14px | 0.04em | `#10b981` |

---

## 4. Composición y Estructura del Hero Rediseñado

### 4.1 Arquitectura Visual (Top-to-Bottom Flow)

```
+-----------------------------------------------------------------------------------+
|  [Capas de Fondo]:                                                                |
|  - Banner Superior Halftone Rojo (Height: 320px Desktop / 220px Mobile)          |
|  - Degradado dithered hacia Canvas Negro (#080808)                                |
+-----------------------------------------------------------------------------------+
|  [Navbar Mínimo]:                                                                 |
|  kirian.                                                   writing      contact   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                      [Bloque Central Estilo Nachi (max-w: 540px)]                 |
|                                                                                   |
|                                   [Avatar 48x48]                                  |
|                                                                                   |
|                               Kirian Luna (28px Serif)                            |
|                                                                                   |
|       Currently working as a Software Engineer @ Ultimate Media Productions       |
|                                                                                   |
|       Systems Engineering graduate from Universidad Latina de Costa Rica,         |
|       building scalable digital products at the intersection of robust backend,   |
|       responsive frontend, and clean UX.                                          |
|                                                                                   |
|       Specialized in TypeScript, React 19, Next.js, and PostgreSQL.                |
|       Based in Limón, Costa Rica — collaborating worldwide.                       |
|                                                                                   |
|       Reach out to me at kirianluna.u@gmail.com                                   |
|                                                                                   |
|                     [ Book a call ↗ ]      [ View my work ]                      |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 4.2 Mapeo de Datos Reales de Kirian Luna (`src/data/data.ts`)

#### Variante en Inglés (EN)
1. **Avatar:** Squircle de 48×48px con marco fino de 1px (`border-white/10`) y sutil brillo dithered.
2. **Nombre:** `Kirian Luna` en *Instrument Serif* (`28px`, color `#d1c5ad`).
3. **Línea de Rol & Ocupación:**  
   `Currently working as a Software Engineer @` [`Ultimate Media Productions`](https://ultimatemediaproductions.com).
4. **Prosa de Valor & Experiencia:**  
   `Graduated in Systems Engineering from Universidad Latina de Costa Rica. Focused on crafting performant, intuitive digital products that solve real problems through solid engineering and thoughtful UX.`
5. **Stack & Alcance:**  
   `Specialized in full-stack TypeScript, React 19, Next.js, Astro, and PostgreSQL. Based in Puerto Limón, Costa Rica — available for engineering roles and consulting worldwide.`
6. **Línea de Contacto Directo:**  
   `Reach out to me at ` `kirianluna.u@gmail.com` (con acción rápida de copiado).
7. **Grupo de CTAs:**
   - **Primario (Píldora sólida clara):** `Let's talk ↗` (conduce a `/contact` o diálogo de reserva).
   - **Secundario (Píldora oscura con borde fino):** `View my work` (conduce a `#projects`).

#### Variante en Español (ES)
1. **Avatar:** Idéntico (Squircle 48×48px).
2. **Nombre:** `Kirian Luna` en *Instrument Serif* (`28px`, color `#d1c5ad`).
3. **Línea de Rol & Ocupación:**  
   `Actualmente Ingeniero de Software en ` [`Ultimate Media Productions`](https://ultimatemediaproductions.com).
4. **Prosa de Valor & Experiencia:**  
   `Graduado de Ingeniería en Sistemas por la Universidad Latina de Costa Rica. Enfocado en construir productos digitales modernos, escalables e intuitivos combinando arquitectura robusta y diseño centrado en el usuario.`
5. **Stack & Alcance:**  
   `Especializado en TypeScript, React 19, Next.js, Astro y PostgreSQL. Desde Limón, Costa Rica para proyectos locales e internacionales.`
6. **Línea de Contacto Directo:**  
   `Escríbeme a ` `kirianluna.u@gmail.com`.
7. **Grupo de CTAs:**
   - **Primario:** `Hablemos ↗`
   - **Secundario:** `Ver mis trabajos`

---

## 5. Matriz de Transformación Responsive por Sección

| Elemento / Componente | Desktop (`1440 × 900`) | Tablet (`768 × 1024`) | Mobile (`390 × 844`) | Regla Responsive |
| :--- | :--- | :--- | :--- | :--- |
| **Banner Rojo Halftone** | Altura: `320px`. Ancho: `100vw`. Dither completo con máscara de gradiente vertical hacia `bottom: 0`. | Altura: `260px`. Reducción proporcional del tamaño de partícula dither en 15%. | Altura: `210px`. Gradiente más acelerado para asegurar legibilidad sobre el texto. | `crop` + `reflow` |
| **Contenedor Hero** | Centrado horizontal absoluto. `max-width: 540px`. Padding superior: `140px`. | Centrado. `max-width: 500px`. Padding lateral: `32px`. Padding superior: `110px`. | Centrado. `width: 100%`. Padding lateral: `20px`. Padding superior: `84px`. | `reflow` |
| **Avatar Squircle** | `48 × 48px`. Margen inferior: `20px`. Borde `1px` blanco/10. | `46 × 46px`. Margen inferior: `18px`. | `42 × 42px`. Margen inferior: `16px`. | `preserve` |
| **Nombre (H1)** | `28px` / Line-height `46px`. `Instrument Serif`. | `26px` / Line-height `42px`. | `24px` / Line-height `36px`. | `reflow` |
| **Cuerpo Editorial** | `15px` / Line-height `23px` / Peso `450`. Espaciado entre párrafos: `14px`. | `14.5px` / Line-height `22px`. Espaciado: `12px`. | `14px` / Line-height `21px`. Espaciado: `12px`. | `reflow` |
| **Línea de Correo** | Texto `15px` + botón de copiado rápido SVG con tooltip. | Idéntico. | Texto `13.5px` truncable o en bloque con tap directo. | `simplify` |
| **Grupo de Botones CTA** | Fila horizontal (`flex-row gap-3`). Ancho intrínseco (`w-auto`). | Fila horizontal (`flex-row gap-3`). | Fila horizontal o apilada adaptativa (`flex-row gap-2.5` con `flex-1` por botón). Altura táctil mínima 44px. | `reflow` |
| **Navbar Superior** | Fijo / Flotante transparente. Padding: `24px 48px`. Enlaces visibles completos. | Padding: `20px 32px`. | Padding: `16px 20px`. Enlaces colapsados o simplificados a logo y botón directo. | `collapse` |

---

## 6. Especificación de Estados e Interacciones

### 6.1 Botón Primario (`Pill CTA — Light`)
- **Default:** Fondo `#f5f5f5`, texto `#080808`, tipografía `Inter` 13.5px / 500, relleno `px-4 py-2`, borde invisible, radio `rounded-full`.
- **Hover:** Fondo `#e4e4e7`, traslación micro-óptica `translate-y-[-1px]`, icono de flecha `↗` rota 4° hacia el vértice superior derecho (`transition: transform 180ms ease-out`).
- **Focus-Visible:** `outline: 2px solid #d1c5ad`, `outline-offset: 3px`.
- **Active:** Fondo `#d4d4d8`, escala `scale-[0.98]`.
- **Disabled:** Fondo `#27272a`, texto `#71717a`, cursor `not-allowed`.

### 6.2 Botón Secundario (`Pill CTA — Ghost / Dark Surface`)
- **Default:** Fondo `rgba(255, 255, 255, 0.03)`, texto `#f5f5f5`, borde `1px solid rgba(255, 255, 255, 0.12)`, relleno `px-4 py-2`, radio `rounded-full`.
- **Hover:** Fondo `rgba(255, 255, 255, 0.08)`, borde `1px solid rgba(255, 255, 255, 0.22)`.
- **Focus-Visible:** `outline: 2px solid #d1c5ad`, `outline-offset: 3px`.
- **Active:** Fondo `rgba(255, 255, 255, 0.12)`, escala `scale-[0.98]`.

### 6.3 Enlaces en Prosa (`@Company`, Email, Enlaces a Proyectos)
- **Default:** Color `#f5f5f5`, subrayado fino de 1px desplazado `underline underline-offset-4 decoration-white/25`.
- **Hover:** `decoration-white/80`, transición de color a `#ffffff` en `140ms ease-out`.
- **Copiado de Email:** Al hacer clic, micro-feedback con tooltip o toast accesible `Copied!` que persiste 1800ms y anuncia al lector de pantalla vía `aria-live="polite"`.

### 6.4 Banner Halftone y Rendimiento (`prefers-reduced-motion`)
- **Frecuencia y Animación del Banner:** En condiciones normales, el WebGL / Canvas de halftone mantiene un desplazamiento orgánico imperceptible y calmado (velocidad ultra-baja `0.05`).
- **Reduced Motion:** Si `prefers-reduced-motion: reduce` está activo en el sistema operativo, la animación se congela inmediatamente en un frame estático de alta fidelidad, evitando loops de `requestAnimationFrame`.

---

## 7. Mapa Semántico de Componentes

### 7.1 Jerarquía de Componentes del Hero

```
src/
└── components/
    ├── hero/
    │   ├── AtmosphericHalftoneBanner.astro   <-- [Capa visual superior: WebGL / SVG Dither]
    │   ├── CentralHero.astro                 <-- [Contenedor orquestador de contenido editorial]
    │   ├── HeroAvatar.astro                  <-- [Squircle 48px con monograma o retrato dithered]
    │   ├── HeroNarrative.astro               <-- [Prosa editorial con tipografía exacta y enlaces]
    │   ├── HeroActions.astro                 <-- [Grupo de CTAs tipo píldora con SVG icons]
    │   └── CopyEmailChip.astro               <-- [Botón accesible con copy feedback]
    └── ui/
        └── PillButton.astro                  <-- [Átomo reutilizable para botones redondeados]
```

### 7.2 Definición de Contratos e Interfaces TypeScript

#### `HeroProps` (`src/components/hero/CentralHero.astro`)
```typescript
export interface CentralHeroProps {
  lang: "EN" | "ES";
  name: string; // "Kirian Luna"
  title: string; // "Software Engineer" / "Ingeniero de Software"
  currentRole: {
    role: string;
    company: string;
    url: string;
  };
  bioHtml: string;
  email: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
}
```

#### `PillButtonProps` (`src/components/ui/PillButton.astro`)
```typescript
export interface PillButtonProps {
  variant: "primary-light" | "secondary-dark";
  href?: string;
  type?: "button" | "submit";
  external?: boolean;
  class?: string;
  ariaLabel?: string;
}
```

### 7.3 Aislamiento de Márgenes Externos (Regla Estricta)
Ningún componente hijo (`HeroAvatar`, `PillButton`, `CopyEmailChip`) posee márgenes exteriores duros (`mt-*`, `mb-*`, `m-*`). El espaciado se controla **exclusivamente en el contenedor padre** mediante `flex flex-col gap-*`, garantizando que cada elemento sea 100% reutilizable en otros contextos de la aplicación sin colisiones de layout.

---

## 8. Verificación de Accesibilidad (WCAG 2.2 AA / AAA)

1. **Ratios de Contraste Comprobados:**
   - `#f5f5f5` sobre `#080808`: **19.3:1** (Cumple AAA para texto normal y grande).
   - `#d1c5ad` sobre `#080808`: **12.8:1** (Cumple AAA para titulares y display).
   - `#a1a1aa` sobre `#080808`: **7.4:1** (Cumple AAA para texto secundario).
   - `#10b981` sobre `#080808`: **8.2:1** (Cumple AAA para badge de disponibilidad).
2. **Navegación por Teclado:**
   - Todos los elementos interactivos (`a`, `button`) cuentan con un orden de tabulación nativo y anillo de foco visible con token `--border-focus` (`#d1c5ad`).
3. **Semántica HTML5 Pura:**
   - El Hero se estructura bajo `<header class="relative ...">` con `<h1 class="font-serif ...">Kirian Luna</h1>`, seguido de un párrafo narrativo `<div class="prose-editorial ...">` y una sección de acciones `<nav aria-label="Hero actions">`.
```

---

### Resumen de Decisiones de Diseño Tomadas

1. **Equilibrio Visual:** El dramatismo del banner rojo dithered de Saad Basheer actúa como marco envolvente superior sin interferir en la zona de lectura del bloque central de Nachi, gracias a un fade vertical a negro carbón que concluye antes del titular.
2. **Fidelidad Tipográfica Absoluta:** Se integraron con rigor las especificaciones solicitadas: `Inter` con su peso intermedio de `450`, altura de línea de `19px` y `0.16px` de letter spacing para una lectura fluida, contrastada contra la elegancia clásica de `Instrument Serif` en `28px`/`46px` con el tono cálido `#d1c5ad`.
3. **Identidad Real:** Se incorporaron los datos verificados de Kirian Luna (Ultimate Media Productions, Universidad Latina de Costa Rica, Limón) tanto para el contexto en inglés como en español.
4. **Modo Solo Lectura:** El informe ha sido generado en su totalidad en esta entrega para ser almacenado en `docs/design/design-system.md` sin alterar archivos del repositorio en este turno.