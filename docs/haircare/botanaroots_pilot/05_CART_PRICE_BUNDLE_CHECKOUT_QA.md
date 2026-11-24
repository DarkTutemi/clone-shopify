# 05 — Cart, Price, Bundle & Checkout QA

## 1. Approved Pricing Matrix & Math Verification

| Tier | Units | Display Title | Live Variant ID | Price | Compare-At | Unit Baseline | Real Unit Savings | Rendered Badge |
|---|---|---|---|---|---|---|---|---|
| **Tier 1** | 1 Jar (120ml) | `1 Jar (120ml)` | `68036047831225` | **$49.99** | $100.00 | $49.99 | 0% (baseline) | `Starter` |
| **Tier 2** | 2 Jars (120ml) | `2 Jars (120ml)` | `68036048453817` | **$99.98** | $200.00 | 2 × $49.99 = $99.98 | $0.00 (0%) | `MOST POPULAR` (NO false "Save XX%") |
| **Tier 3** | 3 Jars (120ml) | `3 Jars (120ml)` | `68036048715961` | **$125.99** | $300.00 | 3 × $49.99 = $149.97 | $23.98 (16.0%) | `Save 16%` + `BEST VALUE` |

### Mathematical Validation:
- Tier 2: $99.98 / 2 = $49.99/jar. Real discount vs single jar = 0%. False "Save 45%" badge was completely eliminated.
- Tier 3: $125.99 vs $149.97. Discount = $23.98 ($149.97 - $125.99). Percentage = 23.98 / 149.97 = 15.99% ≈ **16%**. Badge displays `Save 16%`. "Buy 2 Get 1 Free" was completely eliminated because 2 × 49.99 = 99.98 ≠ 125.99.

## 2. Interactive Selection & CTA State Machine (Verified via CDP)
- **Initial Load:**
  - Active Tier: Tier 2 (Most Popular / Duo) selected by default.
  - CTA Button Label: `RECLAIM MY EDGES · $99.98`
  - Subtext: `60-DAY STRAND SATISFACTION GUARANTEE`
- **Click Tier 1:**
  - Card 1 gains `.is-selected`, Card 2 loses `.is-selected`.
  - Resolved Variant ID: `gid://shopify/ProductVariant/68036047831225`
  - CTA Button updates to: `RECLAIM MY EDGES · $49.99`
  - Error Banner: Hidden / None.
- **Click Tier 2:**
  - Card 2 gains `.is-selected`.
  - Resolved Variant ID: `gid://shopify/ProductVariant/68036048453817`
  - CTA Button updates to: `RECLAIM MY EDGES · $99.98`
- **Click Tier 3:**
  - Card 3 gains `.is-selected`.
  - Resolved Variant ID: `gid://shopify/ProductVariant/68036048715961`
  - CTA Button updates to: `RECLAIM MY EDGES · $125.99`

## 3. Ajax Add to Cart Live Test
- Target Variant: `68036048453817` (Tier 2, 2 Jars 120ml)
- Request: `POST /cart/add.js` with payload `{ items: [{ id: 68036048453817, quantity: 1 }] }`
- HTTP Status: `200 OK`
- Cart Verification:
  - `item_count`: `1` bundle line item (representing the 2-jar bundle)
  - `total_price`: `9998` ($99.98)
  - Quantity multipliers: `quantity=1` verified (does not erroneously multiply quantity).

## 4. Contextual Upsell Validation
- Upsell Product: `Nourishing Raw Batana Scalp & Edge Balm (20g)`
- Variant ID: `68580229677241`
- Price: `+$19.99`
- State: Unchecked by default. When checked, added as independent cart line item without corrupting base tier price.
