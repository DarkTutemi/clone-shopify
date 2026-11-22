# V5.2 PROTECTED LEGACY ADVERTISING FUNNEL REGRESSION REPORT

**Store:** `tryzavelyn.com` (`dsdujr-vn.myshopify.com`)  
**Auditor:** Technical Security Auditor & Infrastructure Lead  
**Date:** November 22, 2026  
**Status:** **100% ISOLATED — 10/10 PASS (ZERO REGRESSION)**  

---

## 1. MULTI-FUNNEL ISOLATION MANDATE

Per repository safety guidelines (`AGENTS.md`) and project instructions:
> *"Never alter URLs, pricing, or templates of legacy ad funnels (Holster, Rehab Glove, BabiGuard, Yeoman, BotanaRoots). Preserve all active advertising funnels and their handles, pricing, PDP templates and functionality."*

During V5.2 recovery, all 10 legacy funnels were tested via automated browser navigation using an isolated Chromium session (PID `21224`, port `9270`) without terminating or interfering with personal Chrome sessions.

---

## 2. AUTOMATED REGRESSION RESULTS (10/10 PASS)

| ID | Funnel Name | Handle & Live URL | Page Title Verified | HTTP Status | ZVHC Header Bleed | ZVHC Delivery Bleed | Isolation Status |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **01** | **Breakout 2.0 Holster** | `/products/breakout-2-0-holster-built-for-maximum-concealment-copy` | `Breakout 2.0 Holster - Built For Maximum Concealment – Zavelyn` | `200 OK` | `None (false)` | `None (false)` | **PASS** |
| **02** | **Rehabilitation Glove** | `/products/zavelyn-rehabilitation-glove` | `Zavelyn™ Robotic Stroke & Hand Rehabilitation Glove` | `200 OK` | `None (false)` | `None (false)` | **PASS** |
| **03** | **BabiGuard Head Protector** | `/products/babiguard-head-protector` | `BabiGuard Head Protector - Infant Head & Back Cushion Backpack – Zavelyn` | `200 OK` | `None (false)` | `None (false)` | **PASS** |
| **04** | **Yeoman Lawn Sweeper** | `/products/the-yeoman-sweep` | `Yeoman Heavy-Duty Push Lawn Sweeper | Zavelyn` | `200 OK` | `None (false)` | `None (false)` | **PASS** |
| **05** | **BotanaRoots Hair Growth Oil** | `/products/zavelyn-botanaroots-organic-batana-hair-growth-oil` | `BotanaRoots Pure Batana Oil for Hair & Scalp | Zavelyn` | `200 OK` | `None (false)` | `None (false)` | **PASS** |
| **06** | **BotanaRoots BOGO Special** | `/products/zavelyn-botanaroots-bogo-special` | `Zavelyn BotanaRoots Batana Hair Growth Oil — Exclusive BOGO Offer` | `200 OK` | `None (false)` | `None (false)` | **PASS** |
| **07** | **Handpan Master 432Hz** | `/products/zavelyn-handpan-master` | `Handpan Master 22" 12-Tone D-Kurdish Drum | Zavelyn` | `200 OK` | `None (false)` | `None (false)` | **PASS** |
| **08** | **Fence Post Repair Kit** | `/products/sakerplus-fence-post-repair-kit` | `Heavy-Duty Steel Fence Post Repair Kit | Zavelyn` | `200 OK` | `None (false)` | `None (false)` | **PASS** |
| **09** | **Thoson MagTrack Train** | `/products/thoson-magtrack` | `MagTrack Anti-Gravity Glow Electric Train Track | Zavelyn` | `200 OK` | `None (false)` | `None (false)` | **PASS** |
| **10** | **Livestock Heating Lamp** | `/products/livestock-heating-lamp` | `Livestock Infrared Heating Lamp for Barns | Zavelyn` | `200 OK` | `None (false)` | `None (false)` | **PASS** |

---

## 3. KEY REGRESSION FINDINGS

1. **Zero Template Bleed:** None of the 10 legacy funnels render `#zvhcHeader`, `#zvhcShopDropdown`, or the `#zvhc-doorstep-delivery` section.
2. **Cart Cross-Pollination Eliminated:** In older theme builds, the cart drawer upsell cross-sold variant `67980643598521` (belonging to Funnel 05: BotanaRoots Oil). V5.2 purged this variant, ensuring complete separation between the organic Hair Care storefront and the paid advertising funnel.
3. **Template Integrity:** Each legacy funnel retains its dedicated Liquid template suffix (e.g. `product.sakerplus-livestock-heating-lamp.json`, `product.thoson-magtrack.json`, `product.sakerplus-fence-post-repair-kit.json`, etc.).
