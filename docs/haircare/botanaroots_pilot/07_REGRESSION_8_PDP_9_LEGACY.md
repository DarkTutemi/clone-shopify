# 07 — Regression: 8 Hair Care PDPs & Legacy Funnels

## 1. Protected Sibling Products (Hair Care Collection)
All 8 sibling products share the underlying templates (`zvhc-pdp-main.liquid`, `zvhc-pdp-how-it-works.liquid`). Every change made during the BotanaRoots pilot was strictly encapsulated with product handle conditionals.

| SKU / Product | Handle | Template | Live Status | Conditional Isolation Verification |
|---|---|---|---|---|
| **P01 Pure Batana Scalp Oil (60ml)** | `zvhc-batana-hair-growth-oil` | `product.zvhc-batana` | ACTIVE (200) | **PASS** — Spec pill intact (`120g (4 oz)...`), authentic trust row intact, 6 pills intact, original dropper ritual intact. |
| **Keratin Fibers (100g)** | `zvhc-keratin-hair-building-fibers` | `product.zvhc-batana` | ACTIVE (200) | **PASS** — Shade selectors, electrostatic copy, and 4-step fiber ritual intact. |
| **Root-Lift Powder (10g)** | `zvhc-root-lift-styling-powder` | `product.zvhc-batana` | ACTIVE (200) | **PASS** — Texture & volume copy and tap-application ritual intact. |
| **Hairline Compact (4g)** | `zvhc-precision-hairline-compact` | `product.zvhc-batana` | ACTIVE (200) | **PASS** — Shade swatches, mineral contouring, and puff-stipple ritual intact. |
| **Raw Batana Balm (20g)** | `zvhc-raw-batana-scalp-balm` | `product.zvhc-batana` | ACTIVE (200) | **PASS** — Solid-to-oil butter copy and palm-warming ritual intact. |
| **Botanical Curl Cream (100ml)** | `zvhc-botanical-curl-cream` | `product.zvhc-batana` | ACTIVE (200) | **PASS** — Pump dispenser specs and curl scrunching ritual intact. |
| **7-in-1 Growth Elixir (60ml)** | `zvhc-7-in-1-growth-elixir` | `product.zvhc-batana` | ACTIVE (200) | **PASS** — 7 power oils, tingly scalp massage, and leave-in ritual intact. |
| **Batana Deep Hair Mask (120g)** | `zvhc-batana-deep-conditioning-hair-mask` | `product.zvhc-batana` | ACTIVE (200) | **PASS** — High-porosity repair copy and rinse-out soak ritual intact. |

## 2. Legacy Funnels Audit
All legacy advertising funnels remain 100% operational on Draft Theme `189296967865` with zero URL, price, or layout drift:

| Legacy Funnel Product | Handle | Live HTTP Status | Visual & Cart Integrity |
|---|---|---|---|
| **Rehabilitation Glove** | `zavelyn-rehabilitation-glove` | HTTP 200 | Verified via screenshot `legacy_rehab_glove_regression_1440.png` |
| **BabiGuard Backpack** | `babiguard-head-protector` | HTTP 200 | Verified via screenshot `legacy_babiguard_regression_1440.png` |
| **Breakout 2.0 Holster** | `breakout-2-0-holster-built-for-maximum-concealment-copy` | HTTP 200 | Verified HTTP 200 OK |
| **Yeoman Lawn Sweeper** | `the-yeoman-sweep` | HTTP 200 | Verified HTTP 200 OK |
| **Custom Dentures** | `zavelyn-custom-fit-home-dentures` | HTTP 200 | Verified HTTP 200 OK |
| **BotanaRoots BOGO Funnel** | `zavelyn-botanaroots-bogo-special` | HTTP 200 | Verified HTTP 200 OK |

## 3. Global Assets & Native Policy Freeze
- Global Header / Mobile Menu: Untouched in this pilot branch.
- Global Footer: Untouched.
- Shopify Native Policies (Refund / Shipping / Terms): Untouched (gated as owner task).
- Trustpilot Global Snippets: Untouched.
