# 08 — Deployment Read-After-Write & No-Go Checklists

## 1. Deployment Audit & Hash Verification
All modifications were deployed exclusively to **Draft Theme ID `189296967865`** (`[Draft] BotanaRoots 120ml Jar Pilot`). Main Theme `189240967353` was NOT modified.

| Theme Asset File | Local SHA-256 (Normalized) | Remote Readback SHA-256 | Verification Result | Updated Timestamp |
|---|---|---|---|---|
| `sections/zvhc-pdp-main.liquid` | `a6d48d5c0fbc6f97f748ce6ae90547bbd5ce40bc634ff9991823eb52119159d3` | `a6d48d5c0fbc6f97f748ce6ae90547bbd5ce40bc634ff9991823eb52119159d3` | **HASH MATCH PASS** | 2026-11-24T06:30:36-07:00 |
| `sections/zvhc-pdp-how-it-works.liquid` | `808184b47983eaaece5b93d1f05781ee9221147e8f5fb9fba9a6fb586b62fcad` | `808184b47983eaaece5b93d1f05781ee9221147e8f5fb9fba9a6fb586b62fcad` | **HASH MATCH PASS** | 2026-11-24T06:32:14-07:00 |

## 2. Guardrails & Safety Checklist (No-Go / Go Decision)

| Guardrail / Rule | Status | Evidence / Notes |
|---|---|---|
| **Do NOT publish Draft Theme to Main** | **COMPLIED** | Role of `189296967865` is `unpublished`. Main theme remains `189240967353`. |
| **Do NOT merge to `main` branch** | **COMPLIED** | All work committed cleanly on branch `fix/zvhc-botanaroots-120ml-jar-pilot`. |
| **Trustpilot Freeze 100%** | **COMPLIED** | 4.9 rating, 28,490 reviews, SVG stars completely untouched. |
| **Zero Impact on Personal Chrome** | **COMPLIED** | Executed strictly via `scripts/lib/safe_browser_session.mjs` on dynamic isolated ports. Zero user tabs closed. |
| **Protect P01 and Legacy Funnels** | **COMPLIED** | P01 verified with full spec pill and original ritual. Legacy funnels return HTTP 200 with matching screenshots. |
| **Pilot Isolation (1 of 9 SKUs)** | **COMPLIED** | Not applied to any of the other 8 SKUs. Awaiting merchant signoff on BotanaRoots pilot. |

## 3. Product Variant Cutover Gate (Admin Mutate Status)
- **Current State:** The 3 target 120ml variants (`68036047831225`, `68036048453817`, `68036048715961`) are active, verified, and mapped to Tier 1 ($49.99), Tier 2 ($99.98), Tier 3 ($125.99) on the Draft Theme.
- **Legacy 60ml & Rosemary Variants (9 variants):** Retained in Shopify Admin backend to avoid breaking past order history (Order #1001, #1002) and external links until final merchant cutover.
- **Classification:** **`BLOCKED — VARIANT CUTOVER GATED FOR MERCHANT FINAL CUTOVER CALL`**.
  - No destructive Admin variant deletion was performed blindly on live data.
  - The Draft Theme operates with 100% precision on the 3 approved variants, completely hiding all 60ml and Rosemary references from customer-facing UI.

## 4. Merchant Recommendation for Rollout
1. Review Draft Theme preview on desktop and mobile: `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=189296967865`
2. Test Add to Cart across all 3 tiers.
3. Upon approval:
   - Step A: Publish Draft Theme `189296967865` to replace Main Theme.
   - Step B: Run the Admin variant cleanup script (`scratch/cleanup_unused_variants.mjs`) to permanently archive/delete the 9 unused 60ml and Rosemary variants from Admin.
   - Step C: Decide whether to apply the luxury 4-step education module to the remaining 8 Hair Care SKUs.
