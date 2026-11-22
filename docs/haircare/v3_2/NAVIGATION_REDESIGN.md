# Zavelyn Hair Care V3.2 — Navigation Redesign Documentation

## Executive Summary
This document records the architectural overhaul of the main navigation system for Zavelyn Hair Care on Draft Theme `189127983289`. The redesign replaces the previous overcrowded 7-link header with a streamlined, luxury ShopSideK T01 editorial navigation structure.

## Core Architectural Changes

### 1. Desktop Architecture (min-width: 993px)
- **Brand Logo:** Elevated visual weight and elegance (`font-size: 1.65rem`, serif bold `'Fraunces'`, line-height: 1, subtitle `0.65rem` with `letter-spacing: 0.2em` in `#B0476E`).
- **Four Center Links:**
  - **Shop:** Interactive hover and focus dropdown with five verified collections:
    - Shop All (`/collections/zvhc-all`)
    - Batana Care (`/collections/zvhc-batana`)
    - Curl & Coily Care (`/collections/zvhc-curl`)
    - Scalp & Edge Care (`/collections/zvhc-scalp`)
    - Instant Hair Coverage (`/collections/zvhc-coverage`)
  - **Our Story:** Dedicated editorial page (`/pages/our-story`).
  - **Track Order:** Real carrier tracking experience (`/pages/track-order`).
  - **Contact:** Anchor link to FAQ / inquiry support (`/#faq`).
- **Right Action Cluster:**
  - **Search Icon:** Toggles an integrated quick-search overlay with auto-focus and keyboard escape dismissal.
  - **Shopping Bag:** Displays authentic Shopify cart count (`{{ cart.item_count }}`) and hooks into `window.openZvhcCart()`.
- **Desktop Hamburger Elimination:** Hamburger button is strictly hidden on desktop widths via media query `@media (min-width: 993px) { display: none !important; }`.

### 2. Mobile Architecture (max-width: 992px)
- **Toolbar:** Logo on left; Search, Cart, and Hamburger toggle button on right.
- **Slide-out Drawer Navigation:**
  - Dedicated `<aside class="zvhc-drawer-panel">` sliding in from the right with smooth cubic-bezier easing.
  - Backdrop overlay with blur effect.
  - Touch-optimized targets (minimum height: 48px).
  - Search bar embedded directly inside drawer.
  - Collapsible "Shop Collections" accordion.
  - Quick contact & trust footer pill.
- **Accessibility & Focus Management:**
  - Full keyboard `Escape` key listener closes both search overlay and mobile drawer.
  - Clicking the backdrop or navigation links closes the drawer.
  - Body scroll locking (`body.zvhc-menu-open { overflow: hidden; }`) prevents background page scroll when drawer is open.
  - `aria-expanded`, `aria-haspopup`, `aria-controls`, and `aria-hidden` attributes synchronize with state.

### 3. Namespace & Isolation
- All components, classes, and scripts are isolated under the `zvhc-` namespace in `sections/zvhc-header.liquid` and `assets/zvhc-t01-components.css`.
- Does not modify or alter the default Shopify header group used by legacy funnels.
