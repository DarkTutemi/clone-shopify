# 00 — Live Baseline vs. GitHub & Backup Audit

## 1. Storefront & Theme Baseline
- **Shopify Store Domain:** `dsdujr-vn.myshopify.com` / `https://tryzavelyn.com`
- **Target Product Handle:** `zavelyn-botanaroots-organic-batana-hair-growth-oil`
- **Shopify Product ID:** `gid://shopify/Product/15461545935033`
- **Protected Sibling Product (P01):** `gid://shopify/Product/15542795731129` (`zvhc-batana-hair-growth-oil`)
- **Live Theme ID (Source of Truth):** `189240967353` (`ZAVELYN HAIR CARE — V7 INTEGRATED PREMIUM DRAFT`, role: `main`)
- **Draft Theme ID (Isolated Pilot):** `189296967865` (`[Draft] BotanaRoots 120ml Jar Pilot`, role: `unpublished`)
  - Duplicated via `themeDuplicate` mutation from live theme `189240967353` on 2026-11-24.
  - Preview URL: `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=189296967865`
- **Git Branch:** `fix/zvhc-botanaroots-120ml-jar-pilot`

## 2. Live Theme Asset State vs. Local Git Repository
Prior to pilot modifications, the active theme files were fetched and compared:
- `sections/zvhc-pdp-main.liquid`:
  - Live Theme was grouping `zvhc-batana-hair-growth-oil` and `zavelyn-botanaroots-organic-batana-hair-growth-oil` under the same `when` clause.
  - Spec label was hardcoded to `120g (4 oz) · 100% Raw Honduran Batana · Cold-Pressed`.
  - Container nomenclature was hardcoded to `Bottle`.
  - Dispatch badge contained `• Free shipping on 2+ bottles`.
- `sections/zvhc-pdp-how-it-works.liquid`:
  - Live Theme fell through to generic fallback ritual instructing "Dispense 4–6 drops directly onto roots" (dropper instructions incompatible with a jar).
  - CSS classes `.zvhc-ritual-grid` lacked dedicated styling rules on mobile/desktop, causing unstyled text flow.

## 3. Order History & Variant Reference Audit
Shopify GraphQL query on live orders (`orders(first: 10)`):
- **Order #1001** (2026-10-26): Line item referenced `variantId: 67980643598521` (`Buy 1 (1x 60ml Bottle) / 100% Pure Raw Honduran Batana (60ml)`).
- **Order #1002** (2026-10-27): Line item referenced `variantId: 67980643598521`.
- **Finding:** Legacy 60ml variants have historical order associations. Deleting them destructively on live admin would orphan past order references and could break live traffic if external ads point to old variant IDs.
- **Decision:** Safe gating implemented. Draft Theme is isolated to the 3 approved 120ml variants; destructive admin bulk delete is gated pending merchant cutover confirmation.

## 4. Backups Stored
- Product Variant Snapshot: `docs/haircare/botanaroots_pilot/variant_snapshot_before.json`
- Pre-edit theme state preserved on Main Theme `189240967353`.
