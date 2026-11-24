# ZAVELYN BOTANAROOTS — FINAL LIVE ACCEPTANCE & CHECKOUT VERIFICATION REPORT

**Store:** `tryzavelyn.com` (`dsdujr-vn.myshopify.com`)  
**Product:** `zavelyn-botanaroots-organic-batana-hair-growth-oil` (ID: `15461545935033`)  
**LIVE Theme ID:** `189296967865` (`[Draft] BotanaRoots 120ml Jar Pilot`, Role: `main`)  
**Git Branch:** `fix/zvhc-botanaroots-120ml-jar-pilot`  
**Execution Timestamp:** 2026-11-25T01:45:00+07:00  
**Final Release Verdict:** **GO** (100% Verified Across Storefront Runtime & Shopify Backend Checkout)  
**Safety Guardrail:** **TRUSTPILOT REMAINS 100% UNTOUCHED.**

---

## 1. Executive Summary & Audit Matrix

| Audit Item | Validation Level | Expected Behavior | Actual Verified Result | Status |
|---|---|---|---|---|
| **Variant Preservation** | GraphQL Admin API | 3 Canonical Variants (`68036047831225`, `68036048453817`, `68036048715961`) | Preserved in-place with exact SKUs, physical jar mappings, and prices | **PASS** |
| **Pricing Precision** | Storefront & Backend Checkout | Cent-accurate subscription prices: $34.99, $69.98, $125.96 | $34.99, $69.98, $125.96 calculated exactly via native fixed discounts | **PASS** |
| **Selling Plan Architecture** | GraphQL Admin API | Variant-specific Selling Plan Groups with fixed discounts | Group 1 (`$6.17` off), Group 2 (`$12.34` off), Group 3 (`$22.22` off) | **PASS** |
| **Shopify Cart Integration** | Storefront Ajax Cart | Line item receives variant selling_plan; line price matches to the cent | Status 200 OK; line items carry exact subscription allocation | **PASS** |
| **Checkout Verification** | Shopify Native Checkout | Subtotal = $69.98; Recurring = $69.98/mo; Shipping calculated correctly | Verified on live checkout `/checkouts/...` with screenshot proof | **PASS** |
| **Shipping Logic & Truth** | Storefront Runtime & Checkout | Store shipping threshold is $69.99; Tier 2 Sub ($69.98) charges $4.95 | PDP dynamically hides Free Shipping badge on Tier 2 Sub, shows on OT | **PASS** |
| **PDP Buybox Defaults** | Storefront Runtime | Default to Subscribe & Save 15%; Default to Buy 2 Get 2 FREE | Verified across Desktop (1440px), Tablet (768px), Mobile (375px) | **PASS** |
| **Unit Economics Display** | Storefront Runtime | Clear per-jar price calculation for all tiers ($34.99, ~$17.50, ~$15.75) | Accurately rendered in green badge under each tier card | **PASS** |
| **P01 Regression Protection** | Storefront Runtime | P01 (`zvhc-batana-hair-growth-oil`) retains dropper ritual & rosemary | Dropper FAQ & Rosemary cosmetic science 100% intact | **PASS** |
| **Trustpilot Protection** | Storefront Runtime | Trustpilot widget, rating, stars, SVG, review count frozen | 100% untouched and identical to baseline | **PASS** |
| **Theme Asset Integrity** | Remote Theme API | SHA-256 read-after-write hash match on LIVE Theme 189296967865 | All remote assets matched local SHA-256 bit-for-bit | **PASS** |
| **Personal Browser Safety** | Process Guardrails | Zero impact on user's personal Google Chrome processes/tabs | Automated CDP tests executed on isolated temporary profiles/ports | **PASS** |

---

## 2. Six-Combination Acceptance Matrix

All 6 commercial combinations were validated by simulating actual user clicks on the live PDP, adding to cart, inspecting line items, and querying Shopify's live shipping calculation engine:

| # | Bundle Offer | Physical Fulfillment | Purchase Type | Variant ID | Selling Plan ID | Expected Subtotal | Shopify Actual Subtotal | Calculated US Shipping | Overall Status |
|---|---|---|---|---|---|---:|---:|---:|---|
| **1** | Buy 1 | 1 jar × 120ml | One-Time Purchase | `68036047831225` | `null` | $41.16 | **$41.16** | $4.95 | **PASS** |
| **2** | Buy 1 | 1 jar × 120ml | Subscribe & Save 15% | `68036047831225` | `6200033465` | $34.99 | **$34.99** | $4.95 | **PASS** |
| **3** | Buy 2 Get 2 FREE | 4 jars × 120ml | One-Time Purchase | `68036048453817` | `null` | $82.32 | **$82.32** | $0.00 (Free) | **PASS** |
| **4** | Buy 2 Get 2 FREE | 4 jars × 120ml | Subscribe & Save 15% *(Default)* | `68036048453817` | `6199771321` | $69.98 | **$69.98** | $4.95 | **PASS** |
| **5** | Buy 4 Get 4 FREE | 8 jars × 120ml | One-Time Purchase | `68036048715961` | `null` | $148.18 | **$148.18** | $0.00 (Free) | **PASS** |
| **6** | Buy 4 Get 4 FREE | 8 jars × 120ml | Subscribe & Save 15% | `68036048715961` | `6200066233` | $125.96 | **$125.96** | $0.00 (Free) | **PASS** |

---

## 3. Shopify-Native Subscription Architecture Resolution (Phase 2)

### Root Cause Analysis of Previous 1-Cent Discrepancies
When using a flat 15% percentage adjustment on base prices:
- Tier 1: $41.16 × 0.85 = $34.986 -> rounded to $34.99 (matched).
- Tier 2: $82.32 × 0.85 = $69.972 -> rounded to **$69.97** (1 cent short of approved $69.98).
- Tier 3: $148.18 × 0.85 = $125.953 -> rounded to **$125.95** (1 cent short of approved $125.96).

### Implemented Native Solution
We implemented variant-specific Selling Plan Groups with fixed-amount price adjustments (`adjustmentType: FIXED_AMOUNT`). Each Selling Plan Group attaches strictly at the variant resource level:

1. **Tier 1 (Buy 1 — 1 Jar):**
   - Selling Plan Group: `gid://shopify/SellingPlanGroup/3657728185` (`Subscribe & Save 15% — Tier 1 (Buy 1)`)
   - Selling Plan: `gid://shopify/SellingPlan/6200033465` (`Delivered Every 1 Month (Save 15%)`)
   - Fixed Discount: **$6.17**
   - Backend Price: $41.16 - $6.17 = **$34.99**

2. **Tier 2 (Buy 2 Get 2 FREE — 4 Jars):**
   - Preserved Existing Selling Plan Group: `gid://shopify/SellingPlanGroup/3657466041`
   - Preserved Existing Selling Plan: `gid://shopify/SellingPlan/6199771321` (`Delivered Every 1 Month (Save 15%)`)
   - Resource Attachment: Scoped strictly to Variant `68036048453817`
   - Fixed Discount: **$12.34**
   - Backend Price: $82.32 - $12.34 = **$69.98**

3. **Tier 3 (Buy 4 Get 4 FREE — 8 Jars):**
   - Selling Plan Group: `gid://shopify/SellingPlanGroup/3657760953` (`Subscribe & Save 15% — Tier 3 (Buy 4 Get 4 FREE)`)
   - Selling Plan: `gid://shopify/SellingPlan/6200066233` (`Delivered Every 1 Month (Save 15%)`)
   - Fixed Discount: **$22.22**
   - Backend Price: $148.18 - $22.22 = **$125.96**

---

## 4. Shipping Logic & Truthful Disclosure Verification (Phase 4)

- **Store-wide Shipping Policy:** Standard Shipping is **$4.95** for orders under **$69.99**; **FREE ($0.00)** for orders **$69.99 and above**.
- **Tier 2 Discrepancy Disclosed:**
  - One-Time Purchase: Subtotal is **$82.32** (>= $69.99) -> Qualified for **Free US Standard Shipping ($0.00)**.
  - Subscribe & Save: Subtotal is **$69.98** ($0.01 below $69.99) -> Shopify calculates **Standard Shipping $4.95** (Total at Checkout: **$74.93**).
- **PDP Truthful Enforcement:**
  - `sections/zvhc-pdp-main.liquid` line 707 was assigned `id="zvhcTier2ShipBadge"` and defaulted to `display: none`.
  - `assets/zvhc-t01.js` dynamically evaluates `isSubscription`:
    - When `isSubscription == true`: Tier 2 shipping badge is hidden (`display: none`), preventing any false promise of free shipping.
    - When `isSubscription == false`: Tier 2 shipping badge is displayed (`display: flex`) because $82.32 qualifies for free shipping.
  - Tier 3 ($125.96 Sub / $148.18 OT) always qualifies for free shipping and retains the badge in both modes.

---

## 5. Live Checkout Acceptance & Verification Proof

Live navigation to `https://tryzavelyn.com/checkout` with Tier 2 Subscribe & Save confirmed:
```text
Item: Zavelyn BotanaRoots Batana Hair Growth Oil
Variant: Buy 2 Get 2 FREE (4x 120ml Jars) / 100% Pure Raw Honduran Batana
Selling Plan: Delivered Every 1 Month (Save 15%)
Quantity: 1
Item Price: $69.98
Subtotal: $69.98
Shipping: $4.95 (Standard Shipping)
Total: $74.93
Recurring subtotal: $69.98 every month
```
- Checkout Screenshot saved at: `checkout_tier2_subscribe.png`

---

## 6. Deployed Code Checksums & Git Traceability (Phase 6)

### File Modification & Read-After-Write Verification
Target Theme: `189296967865` (`role: "main"`)

| File Key | Local SHA-256 | Remote SHA-256 | Verification Status |
|---|---|---|---|
| `sections/zvhc-pdp-main.liquid` | `9e77c3afa1e2...` | `9e77c3afa1e2...` | **MATCH (PASS)** |
| `sections/zvhc-pdp-faq.liquid` | `9ea337acc687...` | `9ea337acc687...` | **MATCH (PASS)** |
| `assets/zvhc-t01.js` | `c3c661ad9e63...` | `c3c661ad9e63...` | **MATCH (PASS)** |
| `assets/zvhc-t01-pdp.css` | `d881aced0d00...` | `d881aced0d00...` | **MATCH (PASS)** |

### Git Remote & Commit Details
- **Repository Remote:** `origin (https://github.com/DarkTutemi/clone-shopify)`
- **Working Branch:** `fix/zvhc-botanaroots-120ml-jar-pilot`
- **Prior Commit:** `1f9fc07` (`feat(botanaroots): live variant recovery, subscribe & save 15%, 3-bundle architecture and FAQ decoupling`)
- **Release Commit:** `feat(botanaroots): exact cent subscription pricing, variant-specific selling plans, shipping truth enforcement`

---

## 7. Artifact Links & Visual Verification

- **Live Desktop QA (1440px):** [botanaroots_final_live_desktop.png](file:///C:/Users/Admin/.gemini/antigravity/brain/2f3e6b33-be3a-4971-95cb-b168e69dafef/botanaroots_final_live_desktop.png)
- **Live Tablet QA (768px):** [botanaroots_final_live_tablet.png](file:///C:/Users/Admin/.gemini/antigravity/brain/2f3e6b33-be3a-4971-95cb-b168e69dafef/botanaroots_final_live_tablet.png)
- **Live Mobile QA (375px):** [botanaroots_final_live_mobile.png](file:///C:/Users/Admin/.gemini/antigravity/brain/2f3e6b33-be3a-4971-95cb-b168e69dafef/botanaroots_final_live_mobile.png)
- **Checkout Real Screen:** [checkout_tier2_subscribe.png](file:///C:/Users/Admin/.gemini/antigravity/brain/2f3e6b33-be3a-4971-95cb-b168e69dafef/checkout_tier2_subscribe.png)
- **P01 Regression Verification:** [botanaroots_final_live_p01_regression.png](file:///C:/Users/Admin/.gemini/antigravity/brain/2f3e6b33-be3a-4971-95cb-b168e69dafef/botanaroots_final_live_p01_regression.png)
