# Zavelyn Hair Care — Store Architecture & Migration Blueprint

## 1. Executive Architectural Overview

Shopify enforces a strict single published theme paradigm per online store: `dsdujr-vn.myshopify.com` (`https://tryzavelyn.com`). It is architecturally impossible and fundamentally unreliable to attempt multi-theme routing based on HTTP `Referer`, UTM campaign parameters, or Facebook Click IDs (`fbclid`).

To simultaneously satisfy:
1. Rebranding the main storefront into **Zavelyn Hair Care** (Premium Beauty DTC)
2. Preserving 100% functionality and visual fidelity for active paid advertising campaigns pointing to legacy PDP URLs (`breakout-2-0-holster-built-for-maximum-concealment-copy`, `zavelyn-rehabilitation-glove`, `babiguard-head-protector`, etc.)

We engineered a **Unified Route-Aware Isolated Architecture** on dedicated Draft Theme `189127983289` (`ZAVELYN HAIR CARE — V1 — DRAFT`).

---

## 2. Route-Aware Conditional Chrome Engine

Inside `layout/theme.liquid`, the theme executes route inspection at runtime:

```liquid
{%- liquid
  assign is_haircare_route = false
  if request.page_type == 'index' or template.suffix contains 'zvhc' or product.tags contains 'haircare' or product.handle contains 'batana' or collection.handle contains 'haircare'
    assign is_haircare_route = true
  endif

  if is_haircare_route
    assign brand_name = 'Zavelyn Hair Care'
    assign meta_title = 'Zavelyn Hair Care — Pure Raw Honduran Batana Oil & Botanical Scalp Rituals'
  else
    assign brand_name = 'Zavelyn'
    assign meta_title = page_title
    if request.page_type == 'index' or meta_title == blank or meta_title == shop.name or meta_title == 'My Store' or meta_title contains 'Sakerplus'
      assign meta_title = 'Zavelyn Official Store — Heavy Duty Tools & Homestead Essentials'
    endif
  endif
-%}
```

### Layout Chrome Branching:

```liquid
{% if is_haircare_route %}
  {% section 'zvhc-announcement-bar' %}
  {% section 'zvhc-header' %}
{% else %}
  {% sections 'header-group' %}
{% endif %}

<main id="MainContent" class="main-content" role="main" tabindex="-1">
  {{ content_for_layout }}
</main>

{% if is_haircare_route %}
  {% section 'zvhc-footer' %}
  {% section 'zvhc-cart-drawer' %}
{% else %}
  {% sections 'footer-group' %}
  {% section 'willa-cart-drawer' %}
{% endif %}
```

---

## 3. Strict Namespace & Style Isolation

To prevent CSS cascade contamination:

| Layer | Namespace / Scoping | Stylesheet | Target Routes |
|---|---|---|---|
| **Hair Care Core** | `.zvhc-wrapper`, `.zvhc-*` | `assets/zvhc-haircare.css` | `/`, `product.zvhc-*`, Batana products |
| **Hair Care PDP** | `.zvhc-pdp-section`, `.zvhc-buybox` | `assets/zvhc-pdp.css` | `product.zvhc-batana.json`, `product.zvhc-fibers.json` |
| **Hair Care Engine** | `window.ZvhcPdp` | `assets/zvhc-pdp.js` | Hair Care PDPs only |
| **Legacy Global** | `:root`, `.template-*` | `assets/zavelyn-base.css`, `zavelyn.css` | All legacy product funnels |
| **Legacy PDPs** | Scoped per section | Preserved original stylesheets | Holster, Glove, BabiGuard, etc. |

---

## 4. Environment & Theme Inventory

- **Production Live Theme (Protected):**
  - Theme ID: `187597717689` (`Zavelyn 2.0` [main])
  - Role: `main` (Live traffic)
  - Status: **UNTOUCHED / PRESERVED**
- **Autonomous Draft Theme:**
  - Theme ID: `189127983289` (`ZAVELYN HAIR CARE — V1 — DRAFT`)
  - Role: `unpublished`
  - Status: Fully deployed with complete baseline sync + Zavelyn Hair Care modules.
- **Git Branch:** `feature/zavelyn-haircare-v1`
