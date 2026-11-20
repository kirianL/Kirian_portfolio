---
title: "Web Performance Beyond Lighthouse 100"
description: "A 100 Lighthouse score is the starting line, not the finish. Real-world speed comes down to asset weight, critical CSS, and zero layout shift."
date: "August 18, 2026"
category: "Performance"
image: "/blog/cover-web-performance.jpg"
---

Hitting 100 across all four Lighthouse categories feels great—until you open your site on a throttled 4G connection and watch a 1.7 MB hero image stall the first paint while fonts flash twice.

Synthetic scores measure a lab baseline. Real users experience network jitter, cold caches, and mid-tier mobile CPUs.

---

## Audit Bytes Before Optimizing Code

Before reaching for complex caching strategies, inspect what actually travels over the wire:

- **Images**: An uncompressed `.webp` or `.png` hero can outweigh your entire JavaScript bundle by 20x. Resize to the maximum rendered width, target `< 200 KB`, and always declare explicit `width` and `height` to lock aspect ratio.
- **Fonts**: Drop legacy `.eot`, `.ttf`, and `.woff` files. Modern browsers ship full `.woff2` support, and a single variable `.woff2` file often replaces six static weights.
- **Third-party scripts**: Defer analytics until idle or load them asynchronously so they never compete with the main thread during hydration.

---

## Let Critical CSS Inline Automatically

Disabling stylesheet inlining forces an extra network round-trip before the browser can paint the first frame. Letting your framework inline small critical stylesheets—while keeping larger shared styles cached—eliminates render-blocking flashes without bloating HTML.

---

## Perceived Speed Matters Just as Much

Prefetching routes on viewport or hover (`data-astro-prefetch`) combined with `View Transitions` makes navigation feel instantaneous even before the server responds. Speed isn't only milliseconds on a waterfall—it's whether the interface responds the moment a user commits to a click.
