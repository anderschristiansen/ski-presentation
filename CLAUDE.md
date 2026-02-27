# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static HTML/CSS/JS slide deck presentation for SKI (Danish public procurement organization) about their "DIMS Base Components" design system. No build tools, bundlers, or package manager — just open `index.html` in a browser.

## Running

Open `index.html` directly in a browser. No server required.

## Architecture

Three files make up the entire app:

- **index.html** — All 14 slides defined as `<section class="slide" data-slide="N">` elements inside a `.presentation` container. Each slide has optional `step-item` children that reveal progressively.
- **app.js** — `Presentation` class that handles slide navigation and step-by-step content reveal. Builds a `stepMap` on init counting `.step-item` elements per slide. Navigation: Arrow keys (left/right for steps, up/down for slides), Space/click to advance, Home/End to jump.
- **styles.css** — All styling including SKI brand palette as CSS custom properties in `:root`, slide transitions, step-item animations (fade-up, pop-in, slide-left), and responsive breakpoints.

## Key Patterns

**Slide structure:** Each slide is a `<section class="slide" data-slide="N">`. The active slide gets class `active`. Only one slide is visible at a time.

**Step-item reveal system:** Elements with class `step-item` and `data-step="N"` are hidden by default (opacity: 0) and revealed one-by-one when advancing. Adding class `visible` triggers the animation. Animation variants: `fade-up`, `pop-in`, `slide-left`.

**Staggered children:** `.stagger-children` on a container causes its children (e.g., `.person-card`) to animate in with sequential delays via nth-child CSS rules.

**SKI brand colors:** Defined as CSS custom properties (`--ski-green`, `--cherry`, `--accent-sand`, etc.) with a theme mapping layer (`--bg-primary`, `--text-primary`, `--accent-cherry`, etc.).

**Fonts:** JetBrains Mono (mono/code) and Inter (sans-serif), loaded from Google Fonts.

## Image display components

- **`.dialog-showcase` + `.dialog-card`** — Uses `position: absolute` for stacking dialog screenshots on top of each other. **Only use on the dialog slide.** The absolute positioning takes cards out of flow and will overlap slide titles/content on other slides.
- **`.image-card`** — Generic in-flow image card for displaying screenshots on any slide. Stays in normal document flow, so it won't overlap titles or other content. Use this for standalone screenshot displays.
- **`.alert-showcase` + `.alert-card`** — Flex-wrap grid for displaying multiple horizontal alert screenshots side by side.

**Rule:** Never use `dialog-showcase`/`dialog-card` outside the dialog slide. For any other slide that needs to show a screenshot, use `.image-card` or a slide-specific component.

## Responsive Design

Slides must fit within the viewport at all sizes — there is no scrolling on the body (`overflow: hidden`). Content that exceeds viewport height is clipped.

**Breakpoints** (in `styles.css`):
- **≤ 1200px** — Laptop: reduced padding/spacing, smaller button images (48px), tighter team cards
- **≤ 900px** — Tablet: team sections stack vertically, DIMS showcase images stack vertically, comparison grids stack, all fonts/spacing significantly reduced
- **≤ 600px** — Phone: minimal padding, smallest button images (32px), alert cards go single-column

**Flex-shrink pattern for content areas:** Content-heavy containers (`.teams-container`, `.button-wall`, `.icon-count-reveal`, `.showcase-container`, `.tooling-content`, `.claude-content`) use `flex-shrink: 1; min-height: 0` so they shrink to fit available viewport height instead of overflowing.

**Image height constraints:** Large images use `max-height: calc(100vh - Npx)` to prevent them from pushing slide titles off-screen. The deduction accounts for title, subtitle, and slide padding.

**Scrollable overflow:** `.tooling-content` and `.claude-content` use `overflow-y: auto` as a last resort — if content still exceeds the viewport after shrinking, users can scroll within the content area.

**Rule:** When adding new image-heavy slides, always add `flex-shrink: 1; min-height: 0` to the content container and `max-height: calc(100vh - Npx)` on images to prevent vertical overflow.

## Content Language

All slide content is in Danish. Maintain Danish for any user-facing text.
