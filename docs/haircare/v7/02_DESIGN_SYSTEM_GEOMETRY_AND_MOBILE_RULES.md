# ZAVELYN HAIR CARE — V7 DESIGN SYSTEM GEOMETRY & MOBILE SPECIFICATION

## 1. DESKTOP GEOMETRY & VISUAL RHYTHM (1024px – 1920px)
- **Container Max-Width:** 1280px (increased from cramped 1180px in V6).
- **Desktop Grid Ratio:** 48% Sticky Gallery / 52% Buybox column.
  - CSS implementation: `grid-template-columns: minmax(0, 0.48fr) minmax(0, 0.52fr);`.
  - Column gap: 40px; container padding: 24px desktop / 16px mobile.
  - Column containment: `min-width: 0` applied to prevent flex/grid blowouts.
- **Gallery Constraints:** Max-width 620px sticky on desktop.
  - Sticky offset: `top: 32px`.
- **Card Radius & Elevation:**
  - Radius: 16px (`--zvhc-radius-card: 16px`, `--zvhc-radius-img: 16px`).
  - Subtle botanical shadow: `0 10px 30px rgba(43,27,36,0.06)`.

## 2. MOBILE RESPONSIVE ENGINE (320px – 440px)
- **Tested Reference Devices:**
  - iPhone 16 Pro Max (440px width)
  - iPhone 11 / XR (414px width)
  - iPhone 14 / 15 Pro (390px width)
  - iPhone SE (375px width)
  - Samsung Galaxy S20 (360px width)
  - iPhone 5 / SE1 (320px legacy width)
- **Zero-Overflow Enforcement:**
  - Total mobile overflow tests executed: 24.
  - Pass rate: 100% (`scrollWidth <= innerWidth` verified on all devices).
  - Architectural fix: Zero reliance on `body { overflow-x: hidden }`. Geometry root cause resolved via `width: 100%`, `max-width: 100%`, `box-sizing: border-box`, and flex wraps.
- **Mobile Sticky Dock:**
  - Dock height: 68px.
  - Fixed bottom with safe-area padding: `bottom: 0; padding-bottom: max(12px, env(safe-area-inset-bottom))`.
  - Elevated above fold: Appears automatically when primary CTA scrolls out of viewport via `IntersectionObserver`.
