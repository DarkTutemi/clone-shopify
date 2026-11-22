# V5.1 SHOPIFY NATIVE POLICY PARITY REPORT
**Store:** `tryzavelyn.com` (`dsdujr-vn.myshopify.com`)  
**Domain:** `https://tryzavelyn.com`  
**Date:** November 22, 2026  
**Auditor:** Legal Compliance & DTC Solutions Architect  
**Status:** **POLICY TEXT COMPILED / BLOCKED — ADMIN ACTION REQUIRED (AWAITING ADMIN UI PASTE)**

---

## 1. NATIVE SHOPIFY POLICY AUDIT FINDINGS

Direct REST inspection of native policies (`/admin/api/2024-01/policies.json`) revealed the following verified discrepancies:

| Policy Name | Native URL | Verified Audit Finding |
| :--- | :--- | :--- |
| **Refund Policy** | `/policies/refund-policy` | 1. Contains unrendered merchant placeholder: `[INSERT RETURN ADDRESS]`.<br>2. Restricts returns on all personal-care goods ("such as beauty products cannot be returned"), directly contradicting the PDP's prominent 30-Day Strand Satisfaction Guarantee. |
| **Shipping Policy** | `/policies/shipping-policy` | 1. States estimated transit time of 7–15 business days, whereas PDP promises 2–5 business days.<br>2. Contains zero mention of the store's **$69.99 USD Free Standard US Shipping** qualification rule. |
| **Terms of Service** | `/policies/terms-of-service` | Contains boilerplate legal notes and outdated placeholder links. |

### API Mutation Scope Restriction:
Programmatic execution of `shopPolicyUpdate` via GraphQL returned:
```json
{
  "message": "Access denied for shopPolicyUpdate field. Required access: `write_legal_policies` access scope."
}
```
Because the Custom App token lacks `write_legal_policies`, Shopify enforces that native policies must be saved directly by the merchant via the Shopify Admin UI.

---

## 2. PRODUCTION-READY STANDARDIZED POLICY TEXTS

Below are the approved, standardized policy texts ready for the merchant to copy and paste directly into Shopify Admin (`Settings > Policies`).

### A. Approved Refund Policy (30-Day Strand Satisfaction Guarantee)
```markdown
# 30-Day Strand Satisfaction Guarantee & Refund Policy

At Zavelyn Hair Care, we stand behind the botanical purity and cosmetic performance of our formulations. We want you to feel completely confident trying our hair and scalp rituals.

### 30-Day Strand Satisfaction Guarantee
If you try any Zavelyn Hair Care product for at least 14 days and are not fully satisfied with your strand hydration, scalp comfort, or curl definition, you may request a refund or store credit within 30 days of parcel delivery.

### How to Request a Return or RMA
To ensure rapid processing and avoid lost packages, please do not send parcels to fulfillment warehouses without prior authorization.
1. Contact our customer care team at **support@tryzavelyn.com** with your 5-digit Order Number and reason for return.
2. Our team will issue an official Return Merchandise Authorization (RMA) number along with the designated regional return facility address.
3. Once your return is received and inspected at our facility, refunds are processed back to your original payment method within 3–5 business days.

### Return Shipping
Standard return shipping postage is the responsibility of the customer unless the product arrived damaged, defective, or incorrect.

### Damaged or Incorrect Orders
If your parcel arrived damaged in transit or contains an incorrect item, please email photos of the packaging and items to **support@tryzavelyn.com** within 48 hours of delivery for an immediate, complimentary replacement.
```

### B. Approved Shipping & Doorstep Delivery Policy
```markdown
# Shipping & Doorstep Delivery Policy

Every Zavelyn order is cushioned in protective packaging, inspected for quality, and dispatched from regional US fulfillment hubs.

### Free Standard US Shipping Threshold
- **Free Standard Shipping:** Available on all eligible US orders with a cart subtotal of **$69.99 USD and above** (after discounts and before taxes).
- **Orders Under $69.99 USD:** Calculated standard ground shipping ($4.95–$5.95 USD) applies at checkout.

### Order Processing & Dispatch
- **Dispatch Window:** Orders are processed and dispatched within 24–48 business hours (Monday through Friday, excluding major federal holidays).
- **Tracking Notifications:** Once your parcel is scanned into carrier transit (USPS, FedEx, or DHL Express), an automated shipping confirmation with live tracking links will be delivered via email and SMS.

### Estimated Delivery Timelines
- **Standard US Doorstep Transit:** 2–5 business days following dispatch.
- **Priority Expedited Transit (Optional):** 1–3 business days.
- **International Transit (WW & Australia):** 7–14 business days depending on customs clearance.

### Undeliverable & Address Errors
Please verify your shipping address during checkout. Zavelyn is not responsible for delays or non-delivery caused by incomplete or incorrect addresses provided at the time of purchase.
```

---

## 3. MERCHANT STEP-BY-STEP PASTE INSTRUCTIONS

1. Log in to Shopify Admin (`https://admin.shopify.com/store/dsdujr-vn`).
2. Click **Settings** (gear icon in lower left corner) > **Policies**.
3. Under **Refund policy**:
   - Paste the approved text from **Section 2A** above.
   - Ensure `[INSERT RETURN ADDRESS]` is completely removed.
4. Under **Shipping policy**:
   - Paste the approved text from **Section 2B** above.
   - Confirm the $69.99 threshold and 2–5 day estimates are present.
5. Click **Save** in the top right corner.

---

## 4. AUDIT STATUS & SIGN-OFF

- **Theme Policy Pages (`templates/page.zvhc-shipping-policy.json`):** Aligned and sanitized.
- **Footer Routing:** Links to `/policies/shipping-policy` and `/policies/refund-policy`.
- **Native Shopify Policies:** Gated by `write_legal_policies` scope.
- **Verdict:** **BLOCKED — ADMIN ACTION REQUIRED** until merchant executes Section 3 in Shopify Admin.
