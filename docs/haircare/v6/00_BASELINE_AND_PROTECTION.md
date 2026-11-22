# V6.00 BASELINE, ENVIRONMENT & MULTI-FUNNEL PROTECTION REGISTER

**Store:** `tryzavelyn.com` (`dsdujr-vn.myshopify.com`)  
**Base Commit:** `af78d9aab252c82b9b1f591c6b1f0fad8485b85e` (`origin/feat/zavelyn-v5-2-recovery`)  
**Active Working Branch:** `feat/zvhc-v6-bespoke-rebuild`  
**Live Production Theme:** `189188079801` ("ZAVELYN HAIR CARE — V5 INTEGRATED DRAFT", role: `main` — **STRICTLY PROTECTED**)  
**Source V5.2 Draft Theme:** `189191585977` ("ZAVELYN HAIR CARE — V5.2 DRAFT", role: `unpublished` — **FROZEN**)  
**Dedicated V6 Draft Theme:** `189192831161` ("ZAVELYN HAIR CARE — V6 BESPOKE REBUILD", role: `unpublished` — **ACTIVE V6 WORKSPACE**)  
**Rollback Fallback Theme:** `189127983289` ("ZAVELYN HAIR CARE — V1 — DRAFT", role: `unpublished`)  
**Protected Historical Theme:** `187597717689` ("Zavelyn 2.0", role: `unpublished` — **STRICTLY PROTECTED**)  
**Interactive V6 Draft Preview URL:** [https://tryzavelyn.com/?preview_theme_id=189192831161](https://tryzavelyn.com/?preview_theme_id=189192831161)  
**Date:** November 22, 2026  
**Auditor & Release Lead:** Lead Shopify Solutions Architect & Technical Auditor  

---

## 1. IMMUTABLE THEME IDENTIFIERS & ROLES

Shopify Admin REST API inspection of all themes on `dsdujr-vn.myshopify.com`:

```json
[
  { "id": 189188079801, "name": "ZAVELYN HAIR CARE — V5 INTEGRATED DRAFT", "role": "main", "status": "STRICTLY PROTECTED (LIVE)" },
  { "id": 189191585977, "name": "ZAVELYN HAIR CARE — V5.2 DRAFT", "role": "unpublished", "status": "FROZEN V5.2 SOURCE" },
  { "id": 189192831161, "name": "ZAVELYN HAIR CARE — V6 BESPOKE REBUILD", "role": "unpublished", "status": "ACTIVE V6 DEVELOPMENT" },
  { "id": 189127983289, "name": "ZAVELYN HAIR CARE — V1 — DRAFT", "role": "unpublished", "status": "EMERGENCY ROLLBACK" },
  { "id": 187597717689, "name": "Zavelyn 2.0", "role": "unpublished", "status": "HISTORICAL PROTECTED" }
]
```

### Safety Guardrail:
- **Zero Live Modifcation:** No write requests, theme publishes, or asset updates may target Theme `189188079801`.
- **Zero Automatic Main Merge:** All code changes remain strictly on `feat/zvhc-v6-bespoke-rebuild`.
- **Zero Process Termination:** Adhere 100% to `AGENTS.md`. Never terminate user Google Chrome processes.

---

## 2. AUDITED 8-SKU CATALOG & 36-VARIANT BASELINE

Live GraphQL verification confirmed **exactly 36 individual Shopify variants** across the 8 portfolio products:

| SKU ID | Official Handle | Verified Packaging Specification | Variant Count | Variant Option Structure | Tiers & Retail Pricing |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **P01** | `zvhc-batana-hair-growth-oil` | 60ml Amber Glass Dropper Bottle | **3** | Quantity (1x, 2x, 3x) | $39.99 (Buy 1) / $69.99 (Buy 2) / $89.99 (Buy 3) |
| **P02** | `zvhc-keratin-hair-building-fibers` | 100g Resealable Refill Pouch | **9** | Shade (Black, Dark Brown, Med Brown) × Quantity (1x, 2x, 3x) | $34.99 (Buy 1) / $59.99 (Buy 2) / $79.99 (Buy 3) |
| **P03** | `zvhc-root-lift-styling-powder` | 10g Directional Dispenser | **3** | Quantity (1x, 2x, 3x) | $19.99 (Buy 1) / $34.99 (Buy 2) / $44.99 (Buy 3) |
| **P04** | `zvhc-precision-hairline-compact` | 4g Mirror + Sponge Compact | **9** | Shade (#01 Black, #02 Dark Brown, #03 Med Brown) × Quantity (1x, 2x, 3x) | $24.99 (Buy 1) / $42.99 (Buy 2) / $54.99 (Buy 3) |
| **P05** | `zvhc-raw-batana-scalp-balm` | 20g Aluminum Pocket Tin | **3** | Quantity (1x, 2x, 3x) | $19.99 (Buy 1) / $34.99 (Buy 2) / $44.99 (Buy 3) |
| **P06** | `zvhc-botanical-curl-cream` | 100ml Squeeze Tube | **3** | Quantity (1x, 2x, 3x) | $29.99 (Buy 1) / $49.99 (Buy 2) / $64.99 (Buy 3) |
| **P07** | `zvhc-7-in-1-growth-elixir` | 60ml Amber Glass Dropper Bottle | **3** | Quantity (1x, 2x, 3x) | $39.99 (Buy 1) / $69.99 (Buy 2) / $89.99 (Buy 3) |
| **P08** | `zvhc-batana-deep-conditioning-hair-mask` | 120g Wide-Mouth Jar | **3** | Quantity (1x, 2x, 3x) | $29.99 (Buy 1) / $49.99 (Buy 2) / $64.99 (Buy 3) |
| **TOTAL** | **8 Active Products** | **All 8 Form Factors Accounted For** | **36** | **Zero Missing Variants** | **All 36 Variants Mapped & Audited** |

---

## 3. PROTECTED 10 LEGACY ADVERTISING FUNNELS (MULTI-FUNNEL ISOLATION)

The 10 protected advertising funnels operate on independent templates and paid media traffic. They must remain 100% isolated with zero template bleed:

1. `/products/breakout-2-0-holster-built-for-maximum-concealment-copy` — Breakout 2.0 Holster
2. `/products/zavelyn-rehabilitation-glove` — Robotic Rehabilitation Glove
3. `/products/babiguard-head-protector` — BabiGuard Head Protector Backpack
4. `/products/the-yeoman-sweep` — Yeoman Push Lawn Sweeper
5. `/products/zavelyn-botanaroots-organic-batana-hair-growth-oil` — BotanaRoots Batana Hair Growth Oil
6. `/products/zavelyn-botanaroots-bogo-special` — BotanaRoots BOGO Offer
7. `/products/zavelyn-handpan-master` — Handpan Master 432Hz Drum
8. `/products/sakerplus-fence-post-repair-kit` — Heavy-Duty Fence Post Repair Kit
9. `/products/thoson-magtrack` — MagTrack Anti-Gravity Glow Train
10. `/products/livestock-heating-lamp` — Livestock Infrared Heating Lamp

---

## 4. DEFERRED MERCHANT ACTIONS REGISTER (NON-BLOCKING FOR DRAFT)

Per master specification Section 15.10, the following two administrative tasks were postponed by the store owner and must NOT be executed programmatically during V6:

1. **Custom App Client Secret Invalidation:** Must be performed by the store owner in Shopify Admin > Settings > Apps > Develop apps > Rotate secret.
2. **Native Shopify Policies Sync:** Must be pasted by the store owner in Shopify Admin > Settings > Policies (Refund Policy & Shipping Policy) due to Custom App token lacking `write_legal_policies` scope.

Both items are tracked as `DEFERRED_OWNER_ACTION` in `10_SECURITY_POLICY_DEFERRED_REGISTER.md`.
