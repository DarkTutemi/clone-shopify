# Zavelyn Hair Care — PDP & Bundle Engineering Specification

## 1. High-Converting DTC Buy Box Architecture

The PDP Buy Box in `sections/zvhc-pdp-main.liquid` is constructed to maximize Average Order Value (AOV) and conversion rate through behavioral pricing cues:

### Visual Hierarchy:
1. **Social Proof Row:** `★★★★★ 4.9/5.0 (2,418+ Verified Reviews)` + live active pulse badge (`● 38 viewing right now`).
2. **Product Title & Editorial Subtitle:** Clear botanical value proposition focusing on follicle awakening and scalp restoration.
3. **Formula Selector:** 2-column cards enabling seamless switching between `100% Pure Raw Batana` and `Batana + Rosemary Scalp Infusion`.
4. **Kaching-Style Bundle Tiers:** 3 distinct value tiers with auto-selection on Tier 2.
5. **Dynamic Savings Callout:** Green botanical pill recalculating total dollar savings in real-time.
6. **2-Line CTA Button:**
   - **Line 1:** `ADD TO CART — $79.98` (Dynamic price update based on tier selection)
   - **Line 2:** `🔒 60-DAY 100% EMPTY-BOTTLE GUARANTEE`
7. **Trust & Fulfillment Stepper:** 3-step visual delivery timeline (Ordered Today -> Dispatched in 24h -> Delivered in 2-4 Days).
8. **Sticky Mobile Dock:** Fixed-bottom dock sliding up when primary CTA scrolls out of viewport.

---

## 2. Bundle Card Tier Engineering

```
┌────────────────────────────────────────────────────────────────────────┐
│ [○] 1 Bottle (Starter Supply)                                   $39.99 │
│     Starter 30-day course for edges & hairline                $80.00   │
└────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ ★ MOST POPULAR                                                         │
│ [●] 2 Bottles Duo (Save 45% + Free US Express Shipping)        $79.98  │
│     60-day intensive course · $39.99/bottle                   $160.00  │
│     ✔ FREE US Express Shipping included                                │
│     🎁 Unlocked: Soft Silicone Scalp Massaging Comb (FREE)             │
└────────────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────────────┐
│ 💎 BEST VALUE                                                          │
│ [○] 3 Bottles Full Course (Buy 2 Get 1 FREE)                   $95.99  │
│     90-day comprehensive scalp renewal · $31.99/bottle        $240.00  │
│     ✔ FREE US Express Shipping included                                │
│     🎁 Unlocked: Scalp Massager + Silk Sleep Bonnet (FREE)             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Dynamic Free Shipping Meter & Cart Drawer

In `sections/zvhc-cart-drawer.liquid`:
- **Free Shipping Threshold:** `$50.00 USD` (5000 cents).
- **Cart Progress Calculation:**
  ```liquid
  {% assign shipping_percent = cart.total_price | times: 100 | divided_by: shipping_threshold %}
  {% if shipping_percent > 100 %}{% assign shipping_percent = 100 %}{% endif %}
  ```
- **Dynamic Messaging:**
  - Below $50: `Only $X.XX away from FREE US EXPRESS SHIPPING!`
  - Above $50: `🎉 You've unlocked FREE US EXPRESS SHIPPING!`
- **In-Cart 1-Click Upsell:** Soft Silicone Scalp Massaging Brush (`+$9.99`).
- **AJAX Line Updates:** Instant quantity modification (`+`, `-`, `remove`) without page refresh.
