# ZAVELYN HAIR CARE V6 — DEFERRED MERCHANT ADMIN ACTIONS REGISTER

**Document ID:** `DOC-ZVHC-V6-10`  
**Storefront:** `tryzavelyn.com` (`dsdujr-vn.myshopify.com`)  
**Context:** Actions Requiring Merchant Owner Authorization & Administrative Access  
**Status:** FORMALLY DEFERRED (Action Register Maintained)  

---

## 1. PURPOSE OF THIS REGISTER

In previous audits and recovery phases (V5.0, V5.1, V5.2), two operational tasks were identified that fall strictly outside automated agent scope because they involve administrative owner credentials, security keys, or legal store ownership settings.

The merchant owner has explicitly postponed these two items. As instructed by the user prompt:
> *"Không thực hiện hai việc Admin mà chủ store đã tạm hoãn."*  
> *"Do not execute the two Admin actions that the store owner has deferred."*

This register formally logs both deferred actions, explains their purpose, and provides precise, click-by-click instructions so the store owner can execute them whenever convenient.

---

## 2. REGISTER OF DEFERRED ACTIONS

### Item 01: Shopify Custom App Secret & Access Token Rotation
- **Category:** Infrastructure & API Security
- **Deferred Reason:** Rotating API credentials terminates active session access for all connected CLI tools, integration webhooks, and deployment scripts until the new token is manually pasted into local environment configs (`.env`).
- **Owner Action Steps:**
  1. Log into Shopify Admin: `https://admin.shopify.com/store/dsdujr-vn/settings/apps/development`
  2. Select the active Custom App (`CLONE SPF` or equivalent).
  3. Under **API credentials**, click **Revoke access tokens** (or generate a fresh Admin API Access Token with `write_themes`, `read_products`, `write_products`, `read_orders` scopes).
  4. Copy the new token (starts with `shpat_`).
  5. Update the local `.env` file with `SHOPIFY_ADMIN_ACCESS_TOKEN=<NEW_TOKEN>`.

---

### Item 02: Native Shopify Legal Policy Text Direct Copy-Paste
- **Category:** Store Settings & Legal Compliance
- **Deferred Reason:** The Shopify GraphQL Admin API allows reading and writing policies, but native checkout footer links in Shopify Checkout render directly from `Settings > Policies`. While the theme provides dedicated accessible policy pages at `/pages/shipping-policy`, `/pages/refund-policy`, etc., pasting the finalized text into native settings requires merchant legal sign-off.
- **Required Final Text:**
  - **Refund Policy:** 30-Day Strand Satisfaction Guarantee. Customers may request an RMA within 30 days of package delivery by emailing `support@tryzavelyn.com`.
  - **Shipping Policy:** Free Standard US Shipping for orders $69.99 USD and above. Dispatch in 24–48 business hours with standard US carrier tracking.
  - **Terms of Service:** Clean cosmetic conditioning standard; no medical or disease claims.
  - **Privacy Policy:** California Consumer Privacy Act (CCPA) compliance and US privacy standards.
- **Owner Action Steps:**
  1. Log into Shopify Admin: `https://admin.shopify.com/store/dsdujr-vn/settings/legal`
  2. For each policy field (Refund Policy, Privacy Policy, Terms of Service, Shipping Policy), click **Replace with template** or paste the verified text from `docs/haircare/v6/00_BASELINE_AND_PROTECTION.md`.
  3. Click **Save** in the top right corner.

---

## 3. AUDITOR SIGN-OFF

Both deferred items have zero impact on the storefront theme code, PDP layout, buybox styling, or variant cart functionality on Draft Theme `189192831161`. They remain safely tracked in this register.
