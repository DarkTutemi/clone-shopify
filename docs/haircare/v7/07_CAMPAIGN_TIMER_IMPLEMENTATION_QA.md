# ZAVELYN HAIR CARE — V7 CAMPAIGN COUNTDOWN TIMER IMPLEMENTATION & QA

## 1. THEME EDITOR SCHEMA ARCHITECTURE
- Located in `sections/zvhc-pdp-main.liquid`:
  - Setting ID: `countdown_enabled` (Type: checkbox, Default: false).
  - Setting ID: `campaign_badge` (Type: text, Default: "LIMITED BOTANICAL ALLOCATION").
  - Setting ID: `campaign_heading` (Type: text, Default: "Save up to 45% + Free US Shipping over $69.99").
  - Setting ID: `countdown_end` (Type: text, Default: "2026-12-01T23:59:59").

## 2. JAVASCRIPT ENGINE & CRO HYGIENE
- Script: `window.zvhcInitCountdown` in `assets/zvhc-t01.js`.
- Real-time client countdown calculation updating Hours, Minutes, and Seconds.
- Zero fake stock counters or artificial decrementing popups. Clean campaign promotion controlled entirely from Theme Customizer.
