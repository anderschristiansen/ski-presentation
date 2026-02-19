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

## Content Language

All slide content is in Danish. Maintain Danish for any user-facing text.
