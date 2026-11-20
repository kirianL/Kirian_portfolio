---
title: "Design Systems That Actually Scale: Tokens, Constraints, and Restraint"
description: "Why most design systems collapse under their own variants—and how strict token layers and concentric geometry keep UI consistent."
date: "July 4, 2026"
category: "Design Systems"
image: "/blog/cover-design-systems.jpg"
---

Most design systems don't fail because they lack components. They fail because every new feature adds another one-off prop, another custom spacing value, or another shade of gray that looks almost—but not quite—identical to the rest of the product.

After building and maintaining component libraries across Next.js and Astro codebases, the pattern is clear: a design system only scales when **constraints are cheaper than exceptions**.

---

## Separate Raw Palette From Semantic Intent

A common mistake is exposing raw color scales directly inside components (`gray-200`, `blue-500`). The moment you introduce dark mode or a second surface tier, every component needs conditional overrides.

Instead, split tokens into two strict layers:

1. **Scale tokens**: calibrated steps (`grayscale-1` through `grayscale-12`) that define contrast relationships.
2. **Semantic roles**: surface, border, muted text, primary text, and interactive ring.

When a card uses a semantic surface and a `1px` neutral outline (`oklch(0 0 0 / 0.1)` in light mode, `oklch(1 0 0 / 0.1)` in dark mode), theme switching becomes a token swap instead of a component rewrite.

---

## Concentric Radii and Surface Depth

Nothing gives away a rushed interface faster than mismatched border radii on nested containers. If an outer card has `16px` radius and `8px` padding, the inner image should have `8px` radius—because `outerRadius = innerRadius + padding`.

Similarly, reserve borders for **structure** (dividers, focus states, input fields) and use layered transparent shadows for **elevation**. Shadows sit cleanly over any background without picking up color tint.

---

## Keep Variants Boring

A button doesn't need twelve variants. Four sizes, three intents, and predictable keyboard focus states cover 98% of product surfaces. The remaining 2% belongs in composition, not in a bloated `Button.tsx` prop table.
