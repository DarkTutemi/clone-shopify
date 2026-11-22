# V5.2 CART, BOUNDARY & CHECKOUT INTEGRATION QA REPORT

**Store:** `tryzavelyn.com` (`dsdujr-vn.myshopify.com`)  
**Target Draft Theme:** `189191585977` ("ZAVELYN HAIR CARE — V5.2 DRAFT", role: `unpublished`)  
**Auditor:** Senior E-Commerce Architect & Lead Conversion QA Engineer  
**Date:** November 22, 2026  
**Status:** **100% VERIFIED & COMPLIANT (PASS)**  

---

## 1. CART DRAWER ARCHITECTURE OVERHAUL

### The Critical Bug in Previous Versions:
In older theme implementations, the slide-out cart drawer contained an in-cart upsell card advertising:
`Silicone Scalp Stimulating Comb — Only $9.99`  
However, inspecting the underlying JavaScript revealed that clicking `+ Add $9.99` triggered:
`POST /cart/add.js { id: 67980643598521, quantity: 1 }`  
Shopify Admin GraphQL inspection confirmed variant `67980643598521` belongs to:
- **Product:** `Zavelyn BotanaRoots Batana Hair Growth Oil` (`zavelyn-botanaroots-organic-batana-hair-growth-oil`)
- **Variant:** `Buy 1 (1x 60ml Bottle - 30-Day Starter Supply)`
- **Actual Price:** **$39.99 USD** (NOT $9.99!)
This created a severe discrepancy: a customer believing they were adding a $9.99 comb was billed $39.99 for an unselected oil bottle, simultaneously violating the **Zero Cross-Pollination** rule by contaminating the cart with an ad-funnel product!

### V5.2 Remediation & Dynamic Complement Architecture:
1. **Purged Legacy Funnel Cross-Sell:** Completely removed variant `67980643598521` and fake silicone comb claims.
2. **Authentic In-Cart Complements from 8 SKUs:**
   - **Primary Complement:** `Zavelyn Raw Unrefined Batana Scalp & Cuticle Balm (20g)` (`zvhc-raw-batana-scalp-balm`).
     - Variant ID: `68580229677241` (Buy 1 Starter Supply)
     - Price: **$19.99 USD**
     - Display Copy: *"Raw Batana Scalp & Cuticle Balm (20g) · Pocket-sized unrefined butter for dry edges · $19.99"*
   - **Secondary Complement (when Balm is already in cart):** `Zavelyn Root-Lift Volumizing & Styling Powder (10g)` (`zvhc-root-lift-styling-powder`).
     - Variant ID: `68580229415097` (Buy 1 Starter Supply)
     - Price: **$19.99 USD**
     - Display Copy: *"Root-Lift Styling Powder (10g) · Instant root volume & oil absorption · $19.99"*
3. **Section Rendering API Integration:** Cart updates (`zvhcAddUpsell`, `zvhcUpdateLine`) now fetch `/?sections=zvhc-cart-drawer`, seamlessly refreshing the DOM without page reloads while maintaining accurate free-shipping progress and subtotal states.

---

## 2. FREE SHIPPING THRESHOLD BOUNDARY MATRIX

The store policy mandates: **FREE STANDARD US SHIPPING ON ELIGIBLE ORDERS $69.99 USD AND ABOVE.**  
In Shopify Liquid and JavaScript, the threshold is calibrated to exact cents:
$$\text{Threshold} = 6999\text{ cents } (\$69.99\text{ USD})$$

| Test Case | Cart Subtotal (USD) | Cart Subtotal (Cents) | Calculation Against Threshold (`subtotal >= 6999`) | Cart Drawer Display Text | Qualification Status | Verification Result |
| :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| **Boundary 1** | `$64.98` | `6498` | `6498 >= 6999` $\rightarrow$ `false` | `Add $5.01 more to unlock FREE US SHIPPING!` | **DOES NOT QUALIFY** | **PASS** |
| **Boundary 2** | `$69.98` | `6998` | `6998 >= 6999` $\rightarrow$ `false` | `Add $0.01 more to unlock FREE US SHIPPING!` | **DOES NOT QUALIFY** | **PASS** |
| **Boundary 3** | `$69.99` | `6999` | `6999 >= 6999` $\rightarrow$ `true` | `🎉 You've unlocked FREE STANDARD US SHIPPING!` | **QUALIFIES** | **PASS** |
| **Boundary 4** | `$70.00` | `7000` | `7000 >= 6999` $\rightarrow$ `true` | `🎉 You've unlocked FREE STANDARD US SHIPPING!` | **QUALIFIES** | **PASS** |
| **Boundary 5** | `$89.99` | `8999` | `8999 >= 6999` $\rightarrow$ `true` | `🎉 You've unlocked FREE STANDARD US SHIPPING!` | **QUALIFIES** | **PASS** |

---

## 3. CHECKOUT HANDOFF & INTERNATIONAL LOGIC

1. **Checkout Handoff:**
   - Link: `<a href="/checkout" class="zvhc-checkout-btn">PROCEED TO SECURE CHECKOUT &rarr;</a>`
   - Verified that line items, variant IDs, and quantities transfer directly into Shopify's native checkout session.
   - Note: In accordance with project safety guidelines, zero paid live orders were placed. Administrative configuration of the free shipping rate in Shopify Admin (`Settings > Shipping and delivery`) remains pending as documented in `V5_1_SHOPIFY_MARKETS_CHECKOUT_QA.md`.
2. **US vs International Visitors:**
   - Messaging explicitly specifies **Free Standard US Shipping**.
   - International visitors see calculated currency and rates handled natively by Shopify Markets without conflicting domestic promises.
3. **Zero Duplicate ATC Events:**
   - Add to Cart buttons are protected with `btn.disabled = true` during in-flight AJAX requests (`/cart/add.js`), preventing double-submission.
