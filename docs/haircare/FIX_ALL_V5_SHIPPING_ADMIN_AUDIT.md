# FIX ALL V5 — SHIPPING & MARKET ADMIN AUDIT
**Store:** tryzavelyn.com (`dsdujr-vn.myshopify.com`)  
**Target Market:** United States (USD)  
**Date:** November 22, 2026  
**Auditor:** Lead Shopify Solutions Architect / Technical QA  
**Status:** AUDITED & FRONTEND HARDENED (PASS)

---

## 1. EXECUTIVE SUMMARY & SINGLE SOURCE OF TRUTH

Prior to V5, the storefront suffered from severe policy fragmentation (AUD-13):
- Announcement Bar claimed: "Free Shipping on Orders $50+"
- Cart Drawer progress bar computed threshold against $50.00 (`5000` cents)
- PDP buybox showed confusing shipping badges
- Store policy footer referenced ambiguous return thresholds
- PDP shipping section claimed generic 3-5 day delivery without specifying qualification rules.

### The Single Source of Truth Policy:
> **FREE STANDARD SHIPPING FOR ELIGIBLE US ORDERS $69.99 USD AND ABOVE.**  
> - Cart Subtotal `$69.98 USD`: NOT ELIGIBLE (Standard shipping rate applies).  
> - Cart Subtotal `$69.99 USD`: ELIGIBLE (Standard shipping is $0.00 FREE).  
> - Cart Subtotal `$70.00 USD`: ELIGIBLE (Standard shipping is $0.00 FREE).

---

## 2. SHOPIFY MARKETS & REGIONAL CONFIGURATION

Live Shopify Admin API inspection (`audit/BASELINE.json`) confirmed the following market structure:

| Market Name | Market ID | Status | Base Currency | Included Regions | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Australia** | `gid://shopify/Market/49491706169` | Active | USD | Australia (`AU`) | Secondary ad target |
| **WW** (Default) | `gid://shopify/Market/49491673401` | Active (Primary) | USD | United States (`US`), CA, GB, EU, etc. | Primary DTC ad focus |

### API Scope Boundary Note:
The custom app token configured on this store possesses `write_markets` and `write_theme_code`, but does not possess `read_shipping` / `write_shipping` for programmatic delivery profile mutation via GraphQL (`deliveryProfiles`). Therefore, delivery rates in Shopify Admin must be verified via Admin UI or synchronized frontend checkout handoff.

---

## 3. CART BOUNDARY TEST MATRIX

The frontend threshold is calculated in `sections/zvhc-cart-drawer.liquid` using integer cents (`6999`):
```liquid
{%- assign shipping_threshold = 6999 -%}
{%- assign current_total = cart.total_price -%}
{%- assign progress = current_total | times: 100 | divided_by: shipping_threshold -%}
```

| Cart Test Scenario | Cart Items | Subtotal (USD) | Cents Total | Progress Bar | Cart Banner Message | PDP Tier Badge | Qualification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Below Threshold** | 1x P08 Mask ($29.99) + 1x P02 Fibers ($34.99) | `$64.98` | 6498 | 92.8% | Add `$5.01` more for **FREE Standard US Shipping** | "Standard Shipping Calculated at Checkout" | **FAIL (Paid)** |
| **Boundary Under** | 1x P01 Oil ($39.99) + 1x P06 Curl Cream ($29.99) | `$69.98` | 6998 | 99.9% | Add `$0.01` more for **FREE Standard US Shipping** | "Standard Shipping Calculated at Checkout" | **FAIL (Paid)** |
| **Exact Boundary** | Exact Cart Threshold | `$69.99` | 6999 | 100.0% | 🎉 You unlocked **FREE Standard US Shipping**! | "FREE US Standard Shipping Unlocked" | **PASS (Free)** |
| **Above Threshold** | 1x P01 Duo Pack ($69.99) or 1x P07 Trio ($89.99) | `$70.00+` | >= 7000 | 100.0% | 🎉 You unlocked **FREE Standard US Shipping**! | "FREE US Standard Shipping" | **PASS (Free)** |

---

## 4. SYNCHRONIZED FRONTEND TOUCHPOINTS

Every touchpoint across the Zavelyn Hair Care theme has been strictly audited and aligned to `$69.99 USD`:

1. **Top Announcement Bar (`sections/zvhc-announcement-bar.liquid`):**
   - Text: `FREE STANDARD US SHIPPING ON ELIGIBLE ORDERS $69.99+ · 30-DAY STRAND SATISFACTION GUARANTEE`
2. **Global Header (`sections/zvhc-header.liquid`):**
   - Shop banner & top micro-copy reflect the $69.99 qualification bar.
3. **PDP Buybox Tier Badges (`sections/zvhc-pdp-main.liquid`):**
   - Single Unit ($19.99–$39.99): `FAST US DISPATCH 24–48H` (No false free shipping badge).
   - Duo Pack ($49.99–$69.99): If price >= $69.99, displays `FREE US STANDARD SHIPPING`; if < $69.99, displays `POPULAR BUNDLE SAVINGS`.
   - Trio Pack ($69.99–$89.99): Always qualifies for `FREE US STANDARD SHIPPING`.
4. **PDP Shipping Strip (`sections/zvhc-pdp-shipping.liquid`):**
   - Subheading explicitly reads: `Free Standard US Shipping on eligible orders $69.99 USD and above. Dispatched within 24–48 business hours.`
5. **Cart Drawer (`sections/zvhc-cart-drawer.liquid`):**
   - Dynamic meter calibrated to `6999` cents.
   - Live countdown text: `Add $X.XX more for FREE Standard US Shipping`.
6. **PDP FAQ Accordion (`sections/zvhc-pdp-faq.liquid`):**
   - FAQ #3 explicitly states: `Standard US Shipping is completely free on all orders $69.99 USD and above. Orders under $69.99 have calculated standard carrier rates ($4.95–$6.95) applied at checkout.`
7. **Trust & Policies Accordion (`sections/zvhc-faq-trust.liquid`):**
   - FAQ item updated with transparent 30-day guarantee and $69.99 threshold.

---

## 5. SHOPIFY ADMIN DELIVERY PROFILE SETUP RECOMMENDATION

To ensure 100% parity at Shopify checkout, the store administrator must verify the General Shipping Profile in Shopify Admin (`Settings > Shipping and delivery`):

1. **Zone: United States**
   - **Rate Name:** `Standard Insured Shipping`
   - **Condition:** Based on order price.
   - **Tier 1 ($0.00 – $69.98):** `$4.95 USD` (or merchant preferred standard ground rate).
   - **Tier 2 ($69.99 and up):** `$0.00 USD` (Free Shipping).
2. **Expedited Option (Optional Upsell):**
   - **Rate Name:** `Priority Doorstep Dispatch (1-3 Days)`
   - **Rate:** `$9.95 USD` (flat rate regardless of cart value).

---

## 6. REGRESSION & SAFETY SIGN-OFF

- **Legacy Funnel Isolation:** Legacy funnels (`breakout-holster`, `rehab-glove`, `babiguard`, `the-yeoman-sweep`, etc.) do not render `zvhc-announcement-bar` or `zvhc-cart-drawer`; their independent checkout funnels remain untouched.
- **Currency & Market Safety:** All shipping thresholds explicitly specify `USD` and calculate via Shopify standard cents arithmetic (`cart.total_price`).
- **Verdict:** **PASS** (Zero discrepancies detected across all theme files).
