# SHOPSIDEK T01 — DESIGN TOKENS SPECIFICATION

This document outlines the official design tokens extracted directly from `https://shopsidek.com/templates/t01/` to serve as the single source of truth for the Zavelyn Hair Care V3 design reset.

---

## 1. COLOR TOKENS

```css
:root {
  /* Canvas & Backgrounds */
  --zvhc-t01-bg: #E9E4E6;              /* Main page background */
  --zvhc-t01-bg-alt: #FBEDE8;          /* Warm peach/rose secondary section background */
  --zvhc-t01-bg-card: #FFFFFF;         /* White card & container background */
  --zvhc-t01-header-bg: #1B1418;       /* Deep obsidian/plum header */
  
  /* Text & Typography */
  --zvhc-t01-text-main: #2B1B24;       /* Primary dark plum text */
  --zvhc-t01-text-muted: #5A4651;      /* Secondary descriptive text */
  --zvhc-t01-text-subtle: #7A6670;     /* Tertiary captions & labels */
  --zvhc-t01-text-light: #FFFFFF;      /* Inverted white text */
  
  /* Primary Action & Brand Accents */
  --zvhc-t01-cta-bg: #6B1E46;          /* Deep berry / plum CTA button */
  --zvhc-t01-cta-hover: #521636;       /* CTA hover state */
  --zvhc-t01-cta-shadow: rgba(107, 30, 70, 0.45);
  --zvhc-t01-accent-rose: #B0476E;     /* Rose active borders & badges */
  --zvhc-t01-card-sel-bg: #FDF2F6;     /* Selected bundle card tint */
  --zvhc-t01-pill-bg: #F8E4EB;         /* Offer & discount pill background */
  
  /* Borders & Dividers */
  --zvhc-t01-border: #EAD7DD;          /* Default soft card/input border */
  --zvhc-t01-border-subtle: #F0E6E9;   /* Subtle divider lines */
  
  /* Status & Functional */
  --zvhc-t01-star-gold: #E0A33A;       /* Verified star rating gold */
  --zvhc-t01-trust-green: #3F8F6B;     /* Free shipping & verified check green */
}
```

---

## 2. TYPOGRAPHY TOKENS

```css
:root {
  /* Font Families */
  --zvhc-font-serif: 'Fraunces', Georgia, serif;
  --zvhc-font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  /* Font Sizes */
  --zvhc-fs-h1: clamp(2rem, 3.5vw, 2.4rem);   /* 32px - 38px */
  --zvhc-fs-h2: clamp(1.8rem, 3vw, 2.6rem);     /* 28px - 42px */
  --zvhc-fs-h3: clamp(1.2rem, 2vw, 1.5rem);     /* 19px - 24px */
  --zvhc-fs-body: 1rem;                         /* 16px */
  --zvhc-fs-sm: 0.875rem;                       /* 14px */
  --zvhc-fs-xs: 0.75rem;                        /* 12px */
}
```

---

## 3. GEOMETRY & ELEVATION

```css
:root {
  /* Radii */
  --zvhc-radius-btn: 12px;
  --zvhc-radius-card: 14px;
  --zvhc-radius-pill: 9999px;
  --zvhc-radius-img: 16px;

  /* Shadows */
  --zvhc-shadow-btn: 0 10px 24px -10px var(--zvhc-t01-cta-shadow);
  --zvhc-shadow-card: 0 4px 16px rgba(43, 27, 36, 0.04);
  --zvhc-shadow-sticky: 0 -4px 20px rgba(43, 27, 36, 0.08);

  /* Container */
  --zvhc-container-max: 1180px;
  --zvhc-container-pad: 20px;
}
```
