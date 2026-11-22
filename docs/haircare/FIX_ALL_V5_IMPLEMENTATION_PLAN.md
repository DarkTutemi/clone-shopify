# ZAVELYN HAIR CARE — MASTER FIX ALL V5 IMPLEMENTATION PLAN

**Target Store:** `https://tryzavelyn.com` (`dsdujr-vn.myshopify.com`)  
**Currency:** USD (Primary target market: United States)  
**Main Theme (Confirmed):** `189127983289` ("ZAVELYN HAIR CARE — V1 — DRAFT", role: `main`)  
**Protected Legacy Theme:** `187597717689` ("Zavelyn 2.0", role: `unpublished`)  
**Integration Branch:** `fix/zavelyn-haircare-v5-integrated`  
**Base Commit:** `898a96a4613dee4e5cdee43f64feeacdffb29484` (main)  
**Execution Authority:** Lead Solutions Architect + DTC Creative Director + Technical QA Auditor  

---

## 1. SCOPE & INVENTORY BASELINE

### 1.1 Storefront & Theme Architecture
- **Active Live Theme:** `189127983289` (role: `main`). Must NOT be modified directly.
- **Dedicated Draft Theme:** Cloned dynamically from Live Theme `189127983289` via Shopify Admin API to create the isolated V5 Integration Theme.
- **Legacy Funnel Protection:** 10 core active advertising funnels (`breakout-holster`, `rehab-glove`, `babiguard`, `the-yeoman-sweep`, `botanaroots`, `botanaroots-bogo`, `handpans`, `sakerplus`, `thoson-magtrack`, `livestock-heating-lamp`) remain 100% untouched.

### 1.2 Target Product Catalog (8 SKUs)
| SKU | Product ID | Handle | Role | Unit Price |
| :--- | :--- | :--- | :--- | :--- |
| **P01** | `15542795731129` | `zvhc-batana-hair-growth-oil` | Flagship Batana Oil (60ml) | $39.99 |
| **P02** | `15542795763897` | `zvhc-keratin-hair-building-fibers` | Keratin Density Fibers (100g, 3 shades) | $34.99 |
| **P03** | `15542795796665` | `zvhc-root-lift-styling-powder` | Root-Lift Styling Powder (10g) | $19.99 |
| **P04** | `15542795862201` | `zvhc-precision-hairline-compact` | Hairline Concealer Compact (4g, 3 shades) | $24.99 |
| **P05** | `15542795894969` | `zvhc-raw-batana-scalp-balm` | Raw Batana Scalp Balm (20g) | $19.99 |
| **P06** | `15542795927737` | `zvhc-botanical-curl-cream` | Botanical Curl Cream (100ml) | $29.99 |
| **P07** | `15542795960505` | `zvhc-7-in-1-growth-elixir` | 7-Botanical Multi-Oil Elixir (60ml) | $39.99 |
| **P08** | `15543912169657` | `zvhc-batana-deep-conditioning-hair-mask` | Batana Deep Conditioning Mask (120g) | $29.99 |

---

## 2. POLICY SINGLE SOURCE OF TRUTH

### 2.1 US Free Standard Shipping Policy
- **Sole Rule:** **FREE STANDARD SHIPPING FOR ELIGIBLE US ORDERS $69.99 USD AND ABOVE**.
- **Cart Eligibility Boundaries:**
  - Cart subtotal **$69.98 USD**: NOT ELIGIBLE for free shipping.
  - Cart subtotal **$69.99 USD**: ELIGIBLE (Free Standard Shipping rate = $0.00).
  - Cart subtotal **$70.00 USD**: ELIGIBLE (Free Standard Shipping rate = $0.00).
- **International / AU Markets:**
  - Australia: A$100 AUD threshold or standard calculated international delivery.
  - Worldwide (WW): Clearly separated from US domestic shipping logic; no misleading "$69.99 US Free Shipping" claims shown on non-US market views.

---

## 3. DEPENDENCY GRAPH & EXECUTION PHASES

```
[Phase 0: Baseline & Security Scan]
   ├── Secret scan across working tree & git log (AUD-18)
   ├── Live Shopify theme & market state query (AUD-13, AUD-17)
   └── Safe browser baseline screenshot capture (Desktop + Mobile)
            │
            ▼
[Phase 1: Design & Data Contracts]
   ├── Product Content Matrix (All 8 SKUs) (AUD-01, AUD-10, AUD-11)
   ├── OEM R&D Roadmap (AUD-03)
   └── Implementation Plan & Audit Matrix (AUD-01 to AUD-18)
            │
            ▼
[Phase 2: Integrated Implementation on Dedicated Draft Theme]
   ├── Clone Live Theme 189127983289 -> V5 Integration Draft
   ├── Dynamic Data Model in sections/zvhc-pdp-main.liquid (AUD-01, AUD-09, AUD-10)
   ├── Remove fabricated social proof & fake review counts (AUD-02)
   ├── Sanitize medical/hair growth claims (AUD-03)
   ├── Update policy pages & remove placeholders (AUD-04, AUD-05, AUD-07)
   ├── Sanitize Sakerplus brand metadata (AUD-06)
   ├── Enforce clean Hair Care navigation (AUD-08)
   ├── Fix real order tracking & contact form (AUD-12)
   └── Implement schema.org without fake ratings (AUD-14)
            │
            ▼
[Phase 3: Automated Regression & Visual Verification]
   ├── Verify all 8 PDPs (Desktop 1440px & Mobile 390px)
   ├── Verify variant switching, pricing math, bundle ATC
   ├── Multi-Funnel Isolation: Verify 10 legacy funnels HTTP 200 & no DOM bleed
   └── Compile docs/haircare/FIX_ALL_V5_REGRESSION_REPORT.md
            │
            ▼
[Phase 4: Shipping Admin Verification & Theme Release]
   ├── Verify / configure US $69.99 shipping threshold in Shopify Admin
   ├── Verify cart boundaries ($69.98, $69.99, $70.00)
   ├── Publish V5 Integration Draft to MAIN role
   └── Compile docs/haircare/FIX_ALL_V5_GO_NO_GO.md
            │
            ▼
[Phase 5: Repository Synchronization & Handoff]
   ├── Commit all source files, documentation, and manifests
   ├── Push to origin/main and verify remote SHA
   └── Generate final executive handoff report
```

---

## 4. SAFETY GATES & ROLLBACK PROTOCOL

| Gate | Verification Target | Action on Failure |
| :--- | :--- | :--- |
| **Gate 1: Browser Protection** | Zero kill commands (`taskkill /IM chrome.exe` or `Stop-Process -Name chrome`). Only single-PID session cleanup. | Immediate process abort. |
| **Gate 2: Isolation Guard** | 10 legacy advertising funnels must return HTTP 200, retain exact template rendering, and have zero `zvhc-` CSS/JS leakage. | Revert theme edits; enforce `is_haircare_route` condition. |
| **Gate 3: Pricing & Math Gate** | Every PDP variant, duo bundle, and trio bundle Add-to-Cart must submit exact displayed price and quantity to cart. | Fix JavaScript cart payload in `zvhc-pdp-main.liquid`. |
| **Gate 4: Preflight Go/No-Go** | All 18 audit items verified PASS; zero critical blockers. | If any item fails, hold release on draft theme, do NOT publish to live. |
| **Rollback Plan** | If live release encounters severe regression, restore Live Theme to original backup ID `189127983289` snapshot in under 60 seconds via Shopify Admin API. | Re-publish pre-release snapshot theme. |

---

## 5. SOURCE CODE PRECEDENCE HIERARCHY
1. **Manufacturer / OEM Product Specifications & Verified COA:** Absolute authority on INCI ingredients, net weights, and cosmetic form.
2. **Approved Brand Policy Directives:** Absolute authority on pricing ($29.99–$39.99), bundle discounts, and shipping threshold ($69.99 USD).
3. **ShopSideK T01 Design System:** Authority on color tokens (`#FBF8F5`, `#F5ECE6`, `#2B1B24`, `#5C1D38`, `#EAD7DD`), typography, and editorial layouts.
4. **Zero-Cross-Pollination Rules:** Subordinate all global stylesheets to route-aware scoping.
