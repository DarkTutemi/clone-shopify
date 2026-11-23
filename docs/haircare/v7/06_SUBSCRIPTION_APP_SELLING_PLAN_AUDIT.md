# ZAVELYN HAIR CARE — V7 SUBSCRIPTION APP & SELLING PLAN AUDIT

## 1. SHOPIFY ADMIN BASELINE AUDIT
- **Connected Store:** `dsdujr-vn.myshopify.com`
- **Installed Subscription Apps Query:**
  - Evaluated app subscriptions and selling plans via Shopify Admin GraphQL API.
  - Result: **0 Selling Plan Groups**, **0 Subscription App Contracts**.
  - Shopify Subscriptions app is currently **NOT INSTALLED** or active on the store.

## 2. CRO ARCHITECTURAL IMPLEMENTATION
- Per V7 specification, a subscription selector was built to provide an immediate luxury DTC visual experience, but Subscribe **MUST NOT** charge one-time prices or fake recurring transactions without real underlying Shopify contracts.
- **Implementation Status:**
  - One-Time Purchase tab: **Active default** (`aria-selected="true"`).
  - Subscribe & Save 15% tab: **Staging/Disabled state** (`aria-selected="false"`, title flagged as "Subscription feature launching Q1").
  - Clear visual badge: `STAGING / Q1`.
  - Add to cart behavior: Adds single-order variants to cart without deceptive recurring subscription claims.
