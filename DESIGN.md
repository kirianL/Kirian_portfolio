---
version: alpha
name: "kirian.dev Personal Portfolio"
description: "Primary visual anchor uses #171717 with primary interactive elements, nav active state, badge fills. Typography baseline relies on Inter for primary body text, paragraph content."
colors:
  primary: "#171717"
  background: "#fcfcfc"
  card-surface: "#ffffff"
  muted-secondary: "#f5f5f5"
  foreground: "#0a0a0a"
  muted-text: "#646464"
  primary-foreground: "#fafafa"
  primary-text: "#202020"
  border: "#e5e5e5"
  ring: "#a1a1a1"
typography:
  body-default:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
  body-small:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "20px"
  badge-label:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: "500"
    lineHeight: "16px"
  section-heading:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: "600"
    lineHeight: "20px"
  project-title:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: "600"
    lineHeight: "20px"
    letterSpacing: "-0.35px"
  body-tight:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "22.75px"
    letterSpacing: "-0.4px"
  nav-link:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: "500"
    lineHeight: "20px"
rounded:
  card: "14px"
  badge-pill: "16px"
  base-radius: "0.625rem"
spacing:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
  3xl: "64px"
  4xl: "96px"
  card-padding: "16px 24px"
  container-md: "304px"
components:
  author-identity-block:
    display: "flex"
    alignItems: "center"
    gap: "{spacing.lg}"
    fontSize: "16px"
    fontWeight: "600"
    textColor: "{colors.primary-text}"
  category-badge-dark-fill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.badge-pill}"
    fontSize: "12px"
    fontWeight: "500"
    lineHeight: "{spacing.xl}"
    padding: "2px 8px"
  navigation-bar-fixed-top:
    position: "fixed"
    backgroundColor: "oklab(0.991098 -0.00000977516 0.0000231862 / 0.6)"
    rounded: "0px"
    boxShadow: "none"
    padding: "0px"
    fontSize: "16px"
    textColor: "{colors.foreground}"
  project-card:
    backgroundColor: "{colors.card-surface}"
    rounded: "{rounded.card}"
    boxShadow: "rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.06) 0px 1px 2px -1px, rgba(0,0,0,0.04) 0px 2px 4px 0px"
    padding: "{spacing.md}"
    fontSize: "16px"
    textColor: "{colors.foreground}"
    display: "flex"
    alignItems: "center"
  resource-row:
    display: "flex"
    justifyContent: "space-between"
    alignItems: "center"
    fontSize: "14px"
    textColor: "{colors.foreground}"
  section-heading-h2:
    fontSize: "14px"
    fontWeight: "600"
    lineHeight: "20px"
    textColor: "{colors.primary-text}"
    padding: "0px"
    rounded: "0px"
  section-heading-h3:
    fontSize: "14px"
    fontWeight: "600"
    lineHeight: "20px"
    textColor: "{colors.primary-text}"
---

## Overview

Primary visual anchor uses #171717 with primary interactive elements, nav active state, badge fills. Typography baseline relies on Inter for primary body text, paragraph content.

This system uses a 4px base grid with scale values 2, 4, 8, 12, 16, 24, 64, 96.

**Signature traits:**

- Core token rhythm: Token evidence indicates consistent color, spacing, and radius rhythm across visible UI.

## Colors

The palette uses 10 validated color tokens across 1 theme profile. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**

- **surface-background** maps to `background`: Role "background" is grounded by usage context "Page background surface".
- **content-text** maps to `foreground`: Role "text" is grounded by usage context "Default body and UI text".
- **content-primary** maps to `primary`: Role "primary" is grounded by usage context "Primary interactive elements, nav active state, badge fills".
- **action-text** maps to `primary-foreground`: Role "text" is grounded by usage context "Text on primary/dark fills (badges, buttons)".

### Primary Brand

- **Primary** (#171717): Primary interactive elements, nav active state, badge fills. Role: primary.

### Text Scale

- **Foreground** (#0a0a0a): Default body and UI text. Role: text.
- **Muted Text** (#646464): Subtitles, secondary descriptors, muted labels. Role: text.
- **Primary Foreground** (#fafafa): Text on primary/dark fills (badges, buttons). Role: text.
- **Primary Text** (#202020): Heading and primary label text. Role: text.

### Interactive

- **Border** (#e5e5e5): Dividers, input outlines, card hairlines. Role: border.
- **Ring** (#a1a1a1): Focus ring color. Role: border.

### Surface & Shadows

- **Background** (#fcfcfc): Page background surface. Role: background.
- **Card Surface** (#ffffff): Card and popover surface fill. Role: background.
- **Muted / Secondary** (#f5f5f5): Muted surface, secondary and accent backgrounds. Role: background.

## Typography

Typography uses Inter across extracted hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Uses Inter throughout for a uniform feel. Weight range spans regular, medium, semi-bold. Sizes range from 12px to 16px.

### Font Roles

- **Headline Font**: Inter
- **Body Font**: Inter

### Type Scale Evidence

| Role                                           | Font  | Size | Weight | Line Height | Letter Spacing | Stack / Features      | Notes           |
| ---------------------------------------------- | ----- | ---- | ------ | ----------- | -------------- | --------------------- | --------------- |
| Primary body text, paragraph content           | Inter | 16px | 400    | 24px        | normal         | Inter, Inter Fallback | Extracted token |
| Secondary body text, nav links, descriptions   | Inter | 14px | 400    | 20px        | normal         | Inter, Inter Fallback | Extracted token |
| Category badge text (AI, Tool)                 | Inter | 12px | 500    | 16px        | normal         | Inter, Inter Fallback | Extracted token |
| Section labels (Projects, Resources)           | Inter | 14px | 600    | 20px        | normal         | Inter, Inter Fallback | Extracted token |
| Project card title text                        | Inter | 14px | 600    | 20px        | -0.35px        | Inter, Inter Fallback | Extracted token |
| Bio/intro paragraph text with tighter tracking | Inter | 14px | 400    | 22.75px     | -0.4px         | Inter, Inter Fallback | Extracted token |
| Navigation link items                          | Inter | 14px | 500    | 20px        | normal         | Inter, Inter Fallback | Extracted token |

## Layout

Responsive system uses 1 breakpoint tier(s): desktop.

### Responsive Strategy

- **desktop (Unknown)**: Expand layout density and horizontal composition for wide viewports.

### Spacing System

| Token        | Value     | Px  | Notes                   |
| ------------ | --------- | --- | ----------------------- |
| xs           | 2px       | 2   | Extracted spacing token |
| sm           | 4px       | 4   | Extracted spacing token |
| md           | 8px       | 8   | Extracted spacing token |
| lg           | 12px      | 12  | Extracted spacing token |
| xl           | 16px      | 16  | Extracted spacing token |
| card-padding | 16px 24px | 16  | Extracted spacing token |
| 2xl          | 24px      | 24  | Extracted spacing token |
| 3xl          | 64px      | 64  | Extracted spacing token |
| 4xl          | 96px      | 96  | Extracted spacing token |
| container-md | 304px     | 304 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence

| Shadow Token   | Layers | Details                             |
| -------------- | ------ | ----------------------------------- |
| card-elevation | 3      | 0px 0px 0px 1px rgba(0, 0, 0, 0.06) |

### Interaction Signals

| Theme | Signal          | Evidence                                          |
| ----- | --------------- | ------------------------------------------------- |
| Light | backdrop-filter | blur(4px)                                         |
| Light | outline-color   | oklab(0.707999 -0.00000712276 0.0000166297 / 0.5) |
| Light | outline-width   | 3px                                               |
| Light | outline-offset  | 0px                                               |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles

| Token       | Value    | Px  | Role Mapping   |
| ----------- | -------- | --- | -------------- |
| base-radius | 0.625rem | 10  | Control corner |
| card        | 14px     | 14  | Card corner    |
| badge-pill  | 16px     | 16  | Card corner    |

### Geometry Evidence

| Radius Token | Shape    | Units |
| ------------ | -------- | ----- |
| card         | 14px     | px    |
| badge-pill   | 16px     | px    |
| base-radius  | 0.625rem | rem   |

## Components

Components should be recreated from token references first, then tuned with variant notes and probe-backed state guidance.

- **Project Card**: Linked card row for portfolio projects with icon, title, description, and external arrow indicator
- **Resource Row**: Flat list row linking to external resources with a category badge on the right
- **Category Badge**: Pill-shaped dark badge used to categorize resources (AI, Tool)
- **Navigation Bar**: Fixed top navigation with semi-transparent frosted background and text links
- **Author Identity Block**: Avatar with dithered/halftone treatment alongside name and role title
- **Section Heading**: Small semibold label marking content sections (Projects, Resources)

### Author Identity Block

**Default**

- display: flex
- alignItems: center
- gap: 12px
- fontSize: 16px
- fontWeight: 600
- textColor: #202020
- State guidance: Avatar uses a dithered/pixel-art halftone visual treatment; name in semibold, role in muted text

### Category Badge

**Dark Fill**

- backgroundColor: #171717
- textColor: #fafafa
- rounded: 16px
- fontSize: 12px
- fontWeight: 500
- lineHeight: 16px
- padding: 2px 8px
- State guidance: Fully-rounded pill; uses --primary fill with --primary-foreground text

### Navigation Bar

**Fixed Top**

- position: fixed
- backgroundColor: oklab(0.991098 -0.00000977516 0.0000231862 / 0.6)
- rounded: 0px
- boxShadow: none
- padding: 0px
- fontSize: 16px
- textColor: #0a0a0a
- State guidance: Probe-confirmed: nav.fixed with 60% opacity near-white background for frosted glass effect

### Project Card

**Default**

- backgroundColor: #ffffff
- rounded: 14px
- boxShadow: rgba(0,0,0,0.06) 0px 0px 0px 1px, rgba(0,0,0,0.06) 0px 1px 2px -1px, rgba(0,0,0,0.04) 0px 2px 4px 0px
- padding: 8px
- fontSize: 16px
- textColor: #0a0a0a
- display: flex
- alignItems: center
- State guidance: Probe-confirmed: a.group and a.flex both show borderRadius 14px, card-elevation shadow, padding 8px, white background

### Resource Row

**Default**

- display: flex
- justifyContent: space-between
- alignItems: center
- fontSize: 14px
- textColor: #0a0a0a
- State guidance: No card shadow; flat row with badge aligned to trailing edge

### Section Heading

**h2**

- fontSize: 14px
- fontWeight: 600
- lineHeight: 20px
- textColor: #202020
- padding: 0px
- rounded: 0px
- State guidance: Probe-confirmed: h2.text-primary-text color lab(12.304) ≈ #202020, fontSize 14px

**h3**

- fontSize: 14px
- fontWeight: 600
- lineHeight: 20px
- textColor: #202020
- State guidance: Probe-confirmed: h3.text-primary-text same computed style as h2

## Do's and Don'ts

Guardrails protect Core token rhythm without adding unsupported visual claims.

| Do                                                                            | Don't                                                      |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Do maintain consistent spacing using the base grid                            | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text)                   | Don't mix rounded and sharp corners in the same view       |
| Do use the primary color only for the single most important action per screen |                                                            |
| Do verify evidence before writing new design-system guidance                  |                                                            |

## Responsive Evidence

### Breakpoints

| Name         | Width   | Key Changes                      |
| ------------ | ------- | -------------------------------- |
| Breakpoint 1 | Unknown | (prefers-reduced-motion: reduce) |

