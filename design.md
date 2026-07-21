# Design System: Hum (Playful Bubble Template)

This project has been redesigned to use the **Hum** theme, a warm, playful, and responsive bubble-style template inspired by friendly tactile interfaces.

## Typography
- **Display & Body**: `Plus Jakarta Sans` — rounded humanist sans with soft terminals.
- **Labels & Numbers**: `JetBrains Mono` — uppercase metadata, counts, and calculators.

## Color Palette (OKLCH)
- **Paper (Surface)**: `oklch(97% 0.012 95)` — cream base.
- **Ink (Text)**: `oklch(20% 0.012 250)` — cool near-black (never `#000`).
- **Primary Accent (Pear)**: `oklch(86% 0.18 95)` — main brand accent, streaks, primary CTAs.
- **Secondary Accent (Cyan)**: `oklch(66% 0.18 235)` — links, hover tints, helper widgets.
- **Pop Accent (Coral)**: `oklch(68% 0.24 18)` — high-energy alert moments, streak completions, badges.

## Component Signatures

### 1. Thick Push Buttons (`.btn`)
All primary controls use thick rounded buttons with dimensional border-bottom edges that depress on hover/click:
- Default: Pear-yellow face, active edge offset.
- Variants: `.btn--cyan`, `.btn--coral`, `.btn--ink`, and `.btn--soft`.

### 2. Physics-Based Hover Cards (`.card-bubble`)
Cards have custom border outlines, soft drop shadows, and lift upward on hover:
- Interactive feedback uses color-mix tinting on hover (e.g. `.card-bubble--pear`, `.card-bubble--cyan`, `.card-bubble--coral`).

### 3. Star-burst Particles (`.star-burst`)
Bouncy, self-destructing star shapes explode outward from the mouse pointer on success actions (like clicking "Feed Starter" or "Mark Completed").

### 4. Text Highlighting (`.hl`)
Linear gradient underlines that slide beneath key phrases inside upright roman headings.
