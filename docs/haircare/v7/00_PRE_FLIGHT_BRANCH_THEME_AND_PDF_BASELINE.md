# ZAVELYN HAIR CARE V7 — PRE-FLIGHT BRANCH, THEME & BASELINE AUDIT

## 1. Environment & Pre-Flight Verification
- **Store Domain:** `https://tryzavelyn.com`
- **Shopify Admin Domain:** `dsdujr-vn.myshopify.com`
- **GitHub Repository:** `DarkTutemi/clone-shopify`
- **V6.1 Source Branch:** `feat/zvhc-v6-1-audit-recovery`
- **V6.1 Source Commit SHA:** `c2cca2244a0df107c6d6df5745bda6ef893f0628`
- **V7 Active Branch:** `feat/zvhc-v7-integrated-premium-cro`
- **Dedicated V7 Draft Theme ID:** `189240967353` ("ZAVELYN HAIR CARE — V7 INTEGRATED PREMIUM DRAFT", role: `unpublished`)
- **V7 Draft Preview URL:** `https://tryzavelyn.com/?preview_theme_id=189240967353`
- **Protected Live Theme ID:** `189188079801` ("ZAVELYN HAIR CARE — V5 INTEGRATED DRAFT", role: `main` — **STRICTLY PROTECTED & UNTOUCHED**)
- **Rollback Themes Preserved:**
  - `189237559481` (V6.1 Draft)
  - `189192831161` (V6 Draft)
  - `189191585977` (V5.2 Draft)
  - `189127983289` (V1 Draft)
  - `187597717689` (Legacy Zavelyn 2.0 Archive)

---

## 2. Platform State & Permission Readbacks

| Component | Verified Admin State | V7 Implementation Requirement | Impact / Action |
| :--- | :--- | :--- | :--- |
| **Live Theme Protection** | Theme `189188079801` is MAIN | Never write to theme `189188079801` | All V7 development isolated to `189240967353` |
| **Shopify Subscriptions** | App **NOT installed** | Zero selling plan groups exist in Shopify Admin | Subscription UI disabled/hidden on customer storefront; reported as `BLOCKED (PENDING OWNER APP INSTALL)` |
| **Selling Plan Groups** | `sellingPlanGroupsCount: 0` | No selling plan IDs available | Cart additions must remain strictly 1-time purchase without fake subscription promises |
| **Review Integrations** | No review apps installed | Trustpilot figures are unauthenticated | Scrub unauthenticated Trustpilot 4.9/20k review numbers per §9; replace with authentic botanical trust signals |
| **US Free Shipping** | Market threshold = `$69.99 USD` | Preserve exact $69.99 threshold | Test boundaries: $69.98 (locked) vs $69.99 (unlocked). Preserve Australian shipping rules |
| **Legacy Ad Funnels** | 10 independent products/templates | Zero cross-pollination from Hair Care | All 10 legacy routes verified 100% preserved |

---

## 3. PDF Audit Crosswalk Mapping

| PDF Page / Section | Audit Finding / Requirement | V6.1 Residual Defect | V7 Architecture Fix |
| :--- | :--- | :--- | :--- |
| **pp. 2–4 (Hero / Layout)** | Desktop gallery overwhelmingly huge (65%+ width); buybox cramped into a sidebar. | Desktop hero was unbalanced; H1 typography cramped; padding excessive. | Target **48% gallery / 52% buybox** grid (`minmax(0, 0.48fr) minmax(0, 0.52fr)`), max container 1280px, fluid gutters. |
| **pp. 7–13 (Mobile CRO)** | Severe horizontal overflow on iPhone 16 Pro Max (440×956) and smaller screens (320–390px). | Overflow caused by rigid thumbnail flex rows, unconstrained badge widths, and table padding. | Fix root-cause geometry: `min-width: 0`, flexible CSS grid, scrollable gallery wrapper. Zero `overflow-x: hidden` hacks! |
| **pp. 14–18 (Product Body)** | Unstyled product body: gigantic repeated supplier hero image followed by raw numbered text. | Sections relied on massive supplier banner and generic 7-section boilerplate. | Complete structural overhaul: 8 bespoke section sequences, rich macro cards, structured timelines, and clear typography. |
| **pp. 20–22 (Trust & Compliance)** | Contradictory product specs (Balm 100g vs 20g, Curl Tube vs Bottle) and unauthenticated reviews. | Speculative OEM concepts leaked into storefront; unauthenticated Trustpilot numbers. | Rigid physical inventory alignment: Balm strictly 20g Tin, Curl strictly 100ml Pump Bottle; unauthenticated review removal per §9. |
