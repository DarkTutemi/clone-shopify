# ZAVELYN HAIR CARE V3.1 — BUNDLE FUNCTIONAL QA REPORT

**Date:** 2026-11-22  
**Implementation:** `sections/zvhc-bundles.liquid` & `assets/zvhc-t01.js`  
**Test Engine:** Direct Line-Item Batch Addition (`POST /cart/add.js`)

---

## 1. Bundle Architecture & Mechanics

Unlike previous decorative implementations that redirected customers away to individual PDPs, V3.1 introduces a fully functional multi-product bundle engine.

Each bundle card displays:
1. Complete list of included products with clear thumbnail photography.
2. Direct inline variant/shade selectors for multi-variant items (e.g. Hairline Compact and Keratin Fibers).
3. Mathematically verified pricing representing the exact sum of the included products.
4. Direct `POST /cart/add.js` submission adding all selected items simultaneously in a single HTTP request.
5. Error boundary with accessible notification (`#zvhcBundle...Error`) if any variant is unavailable.
6. Automatic cart drawer refresh displaying all items and matching checkout subtotal.

---

## 2. Bundle Test Specifications & Verification

### Bundle 1: Scalp & Edge Care Duo
* **Target Audience:** Daily edge recovery & scalp nourishment.
* **Included Products:**
  1. Pure Batana Scalp Oil (60ml) — Variant ID: `68580229218489` ($39.99)
  2. Precision Hairline Compact (4g) — Variant ID selectable:
     * `#01 Black`: `68580492705977` ($24.99)
     * `#02 Dark Brown`: `68580492804281` ($24.99)
     * `#03 Medium Brown`: `68580492902585` ($24.99)
* **Calculated Total:** $39.99 + $24.99 = **$64.98**
* **Compare-At Total:** $49.99 + $32.00 = **$81.99**
* **Payload Dispatched:**
  ```json
  {
    "items": [
      { "id": 68580229218489, "quantity": 1 },
      { "id": 68580492705977, "quantity": 1 }
    ]
  }
  ```
* **Functional Test Result:** **PASS** (Added 2 line items to cart, drawer opened, total: $64.98).

---

### Bundle 2: Instant Density 3-Piece Kit
* **Target Audience:** Total cosmetic fullness and instant root lift.
* **Included Products:**
  1. Keratin Building Fibers (100g) — Variant ID selectable:
     * `Black`: `68580492312761` ($34.99)
     * `Dark Brown`: `68580492411065` ($34.99)
     * `Medium Brown`: `68580492509369` ($34.99)
  2. Root-Lift Volumizing Styling Powder (10g) — Variant ID: `68580229415097` ($19.99)
  3. Precision Hairline Compact (4g) — Variant ID selectable:
     * `#01 Black`: `68580492705977` ($24.99)
     * `#02 Dark Brown`: `68580492804281` ($24.99)
     * `#03 Medium Brown`: `68580492902585` ($24.99)
* **Calculated Total:** $34.99 + $19.99 + $24.99 = **$79.97**
* **Compare-At Total:** $44.99 + $25.00 + $32.00 = **$101.99**
* **Payload Dispatched:**
  ```json
  {
    "items": [
      { "id": 68580492312761, "quantity": 1 },
      { "id": 68580229415097, "quantity": 1 },
      { "id": 68580492705977, "quantity": 1 }
    ]
  }
  ```
* **Functional Test Result:** **PASS** (Added 3 line items to cart, drawer opened, total: $79.97).

---

### Bundle 3: Wash-to-Style 4-Piece Routine
* **Target Audience:** Complete botanical regimen from scalp barrier to styling.
* **Included Products:**
  1. Raw Batana Scalp Balm (20g) — Variant ID: `68580229677241` ($19.99)
  2. Pure Batana Scalp Oil (60ml) — Variant ID: `68580229218489` ($39.99)
  3. Botanical Curl Defining Cream (100ml) — Variant ID: `68580229775545` ($29.99)
  4. 7-in-1 Multi-Oil Scalp Elixir (60ml) — Variant ID: `68580229873849` ($39.99)
* **Calculated Total:** $19.99 + $39.99 + $29.99 + $39.99 = **$129.96**
* **Compare-At Total:** $25.00 + $49.99 + $38.00 + $49.99 = **$162.98**
* **Payload Dispatched:**
  ```json
  {
    "items": [
      { "id": 68580229677241, "quantity": 1 },
      { "id": 68580229218489, "quantity": 1 },
      { "id": 68580229775545, "quantity": 1 },
      { "id": 68580229873849, "quantity": 1 }
    ]
  }
  ```
* **Functional Test Result:** **PASS** (Added 4 line items to cart, drawer opened, total: $129.96).
