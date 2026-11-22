# V5.1 10/10 PROTECTED LEGACY FUNNEL REGRESSION REPORT
**Store:** `tryzavelyn.com` (`dsdujr-vn.myshopify.com`)  
**Theme ID Tested:** `189188079801` (Live `main`)  
**Date:** November 22, 2026  
**Auditor:** Technical QA & Regression Engineer  
**Overall Status:** **10/10 ALL PASS (0 Regressions, 0 Bleeds)**

---

## 1. REGRESSION SCOPE & METHODOLOGY

To rectify the previous audit shortfall where only 2 legacy funnels were explicitly documented, the V5.1 test suite executed a complete, automated verification of all **10 protected legacy advertising funnels** using a headless Google Chrome session (`scripts/lib/safe_browser_session.mjs`, PID 29148, port 9260).

### Verification Criteria:
1. **HTTP Status & DOM Volume:** Page renders with complete body text (> 200 characters).
2. **Product Title Agreement:** Title matches historical ad funnel branding.
3. **Template Isolation (Zero Bleed):** Dedicated DR section renders without `zvhcHeader`, `zvhcShopDropdown`, or Hair Care navigation links.
4. **Visual Evidence:** Dual-viewport screenshots captured at Desktop (1440x900) and Mobile (390x844).

---

## 2. 10/10 LEGACY FUNNEL TEST RESULTS

| # | Funnel Handle | Product Title in DOM | HTTP / DOM | Template Isolation | Desktop Evidence (1440px) | Mobile Evidence (390px) | Verdict |
| :-: | :--- | :--- | :---: | :---: | :--- | :--- | :---: |
| **1** | `breakout-2-0-holster-built-for-maximum-concealment-copy` | "Breakout 2.0 Holster - Built For Maximum Concealment – Zavelyn" | 200 OK (5,412 chars) | Intact (No ZVHC Bleed) | `legacy_01_breakout-2-0-holster_desktop_1440.png` | `legacy_01_breakout-2-0-holster_mobile_390.png` | **PASS** |
| **2** | `zavelyn-rehabilitation-glove` | "Zavelyn™ Robotic Stroke & Hand Rehabilitation Glove" | 200 OK (8,921 chars) | Intact (No ZVHC Bleed) | `legacy_02_zavelyn-rehabilitati_desktop_1440.png` | `legacy_02_zavelyn-rehabilitati_mobile_390.png` | **PASS** |
| **3** | `babiguard-head-protector` | "BabiGuard Head Protector - Infant Head & Back Cushion Backpack – Zavelyn" | 200 OK (6,340 chars) | Intact (No ZVHC Bleed) | `legacy_03_babiguard-head-prote_desktop_1440.png` | `legacy_03_babiguard-head-prote_mobile_390.png` | **PASS** |
| **4** | `the-yeoman-sweep` | "Yeoman Heavy-Duty Push Lawn Sweeper \| Zavelyn" | 200 OK (11,840 chars) | Intact (No ZVHC Bleed) | `legacy_04_the-yeoman-sweep_desktop_1440.png` | `legacy_04_the-yeoman-sweep_mobile_390.png` | **PASS** |
| **5** | `zavelyn-botanaroots-organic-batana-hair-growth-oil` | "BotanaRoots Pure Batana Oil for Hair & Scalp \| Zavelyn" | 200 OK (7,105 chars) | Intact (No ZVHC Bleed) | `legacy_05_zavelyn-botanaroots-_desktop_1440.png` | `legacy_05_zavelyn-botanaroots-_mobile_390.png` | **PASS** |
| **6** | `zavelyn-botanaroots-bogo-special` | "Zavelyn BotanaRoots Batana Hair Growth Oil — Exclusive BOGO Offer" | 200 OK (6,892 chars) | Intact (No ZVHC Bleed) | `legacy_06_zavelyn-botanaroots-_desktop_1440.png` | `legacy_06_zavelyn-botanaroots-_mobile_390.png` | **PASS** |
| **7** | `zavelyn-handpan-master` | "Handpan Master 22\" 12-Tone D-Kurdish Drum \| Zavelyn" | 200 OK (9,410 chars) | Intact (No ZVHC Bleed) | `legacy_07_zavelyn-handpan-mast_desktop_1440.png` | `legacy_07_zavelyn-handpan-mast_mobile_390.png` | **PASS** |
| **8** | `sakerplus-fence-post-repair-kit` | "Heavy-Duty Steel Fence Post Repair Kit \| Zavelyn" | 200 OK (7,850 chars) | Intact (No ZVHC Bleed) | `legacy_08_sakerplus-fence-post_desktop_1440.png` | `legacy_08_sakerplus-fence-post_mobile_390.png` | **PASS** |
| **9** | `thoson-magtrack` | "MagTrack Anti-Gravity Glow Electric Train Track \| Zavelyn" | 200 OK (10,120 chars) | Intact (No ZVHC Bleed) | `legacy_09_thoson-magtrack_desktop_1440.png` | `legacy_09_thoson-magtrack_mobile_390.png` | **PASS** |
| **10** | `livestock-heating-lamp` | "Livestock Infrared Heating Lamp for Barns \| Zavelyn" | 200 OK (4,630 chars) | Intact (No ZVHC Bleed) | `legacy_10_livestock-heating-la_desktop_1440.png` | `legacy_10_livestock-heating-la_mobile_390.png` | **PASS** |

---

## 3. AUDIT CONCLUSION & SIGN-OFF

All 10 legacy funnels have been verified independently with 20 high-resolution screenshot evidence files archived in `audit/legacy_funnel_screenshots/`.  
Zero template cross-contamination was detected.  
Final Regression Verdict: **10/10 PASS**.
