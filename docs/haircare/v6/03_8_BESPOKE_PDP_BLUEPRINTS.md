# ZAVELYN HAIR CARE V6 — 8 BESPOKE PDP BLUEPRINTS

**Document ID:** `DOC-ZVHC-V6-03`  
**Storefront:** `tryzavelyn.com` (`dsdujr-vn.myshopify.com`)  
**Target Theme ID:** `189192831161` ("ZAVELYN HAIR CARE — V6 BESPOKE REBUILD")  
**Preview URL:** `https://tryzavelyn.com/?preview_theme_id=189192831161`  
**Status:** IMPLEMENTED & VERIFIED  

---

## 1. ARCHITECTURAL OVERVIEW

In accordance with Section 4 of `ZAVELYN_V6_MASTER_8_SKU_BESPOKE_PDP_SITE_REBUILD.md`, every one of the 8 SKUs features an individually authored, bespoke PDP architecture. Rather than using a generic template that merely swaps product titles, each PDP reflects a distinct product category journey:

1. **Short, Premium Canonical H1 Titles:** Free of repetitive, keyword-stuffed SEO suffixes.
2. **Standardized Spec Pill:** Directly below H1 detailing formulation tier, volume/weight, and primary container.
3. **All Accordions Collapsed by Default:** Every `<details>` element in both Buybox and FAQ initializes in a closed state on page load.
4. **Renamed Buybox Accordion (`30-Day Guarantee`):** Shipping, dispatch, and warehouse carrier logistics have been completely purged from inside the guarantee accordion. Guarantee microcopy is focused purely on customer satisfaction, strand results, and return instructions to `support@tryzavelyn.com`.
5. **Educational Zavelyn Formulation Insight Card:** Rendered directly below the FAQ accordion group, providing authentic cosmetic science biochemical mechanisms attributed to `Zavelyn Hair Care · Product Formulation Team (Cosmetic Science & Botanical R&D)`. Zero fake doctor endorsements, degrees, or stock physician images.
6. **Bespoke Section Sequencing:** Templates customize the section order based on customer buying psychology (e.g. instant application guides high up for styling powders and fibers, lipid breakdown and ingredients high up for pure oils, balms, and masques).

---

## 2. INDIVIDUAL SKU BLUEPRINTS

### P01 — Pure Batana Hair & Scalp Oil
- **Handle:** `zvhc-batana-hair-growth-oil`
- **Shopify Product ID:** `8995577626937`
- **Canonical H1:** `Pure Batana Hair & Scalp Oil`
- **Spec Pill:** `Pure Raw Unrefined | 60 ml / 2 fl oz`
- **Container Form Factor:** 60 ml Amber Glass Apothecary Dropper Bottle with UV protection
- **Template:** `templates/product.zvhc-batana.json`
- **Section Order:** `["main", "marquee", "package", "how_it_works", "reviews", "faq", "shipping"]`
- **Core Benefits:**
  1. Deeply replenishes scalp moisture and conditions fragile, dry roots.
  2. Lubricates cuticles to minimize mechanical styling friction and combing breakage.
  3. 100% cold-pressed botanical lipids with zero silicones, mineral oil, or synthetic dyes.
- **How It Works (4 Steps):**
  - Step 01: Warm & Activate (4–6 drops in clean dry palms, rub vigorously for 5s)
  - Step 02: Scalp Massage (Section hair, massage in circular motions for 2–3 min)
  - Step 03: Coat Lengths & Ends (Smooth remaining oil to protect against friction)
  - Step 04: Absorb & Rinse (Leave on 30 min before shampooing, or overnight)
- **Verified INCI:** `Elaeis Oleifera Kernel Oil (Batana Oil), Rosmarinus Officinalis (Rosemary) Leaf Extract, Tocopherol (Vitamin E).`
- **Package Title:** `What's Inside Your Pure Batana Hair & Scalp Oil`
- **Formulation Insight Focus:** High oleic acid (~50–60%) and linoleic acid affinity for the epicuticular lipid membrane, intercellular cuticle penetration, antioxidant protection via natural tocopherol and rosemary extract.

---

### P02 — Keratin Hair Building Fibers
- **Handle:** `zvhc-keratin-hair-building-fibers`
- **Shopify Product ID:** `8995577692473`
- **Canonical H1:** `Keratin Hair Building Fibers`
- **Spec Pill:** `Micro-Keratin Complex | 100g / 3.5 oz Refill Pouch`
- **Container Form Factor:** 100g Resealable Moisture-Barrier Refill Pouch (3 Shades: Black, Dark Brown, Medium Brown)
- **Variants:** 9 Variants (3 shades × 3 pack sizes: 1 Pouch, 2 Pouches, 3 Pouches)
- **Template:** `templates/product.zvhc-fibers.json`
- **Section Order:** `["main", "marquee", "how_it_works", "package", "reviews", "faq", "shipping"]` (How-It-Works elevated to showcase instant 60-second cosmetic transformation)
- **Core Benefits:**
  1. Instantly disguises exposed scalp and wide parts with realistic dimensional depth.
  2. Electrostatic grip stays locked through wind, sweat, and long workdays.
  3. Washes out completely with regular shampoo; zero staining or sticky residue.
- **How It Works (4 Steps):**
  - Step 01: Dry & Style First (Ensure hair and scalp are 100% dry)
  - Step 02: Angle & Shake (Hold container at 45° angle 2–3 inches above thinning areas)
  - Step 03: Pat to Settle (Lightly pat hair with flat palms to interlock fibers)
  - Step 04: Lock with Mist (Apply light hairspray mist for weather resistance)
- **Verified INCI:** `Keratin, Gossypium Herbaceum (Cotton) Fiber, Silica, DMDM Hydantoin, [+/- CI 77491, CI 77492, CI 77499 (Iron Oxides)].`
- **Package Title:** `What's Inside Your Keratin Fibers Pouch`
- **Formulation Insight Focus:** 0.3–0.5 mm micro-milled organic keratin and cotton fibers, triboelectric electrostatic charge induction, opposite dielectric hair potential, van der Waals bonding for weightless volumetric optical density.

---

### P03 — Root Lift Volumizing Powder
- **Handle:** `zvhc-root-lift-styling-powder`
- **Shopify Product ID:** `8995577758009`
- **Canonical H1:** `Root Lift Volumizing Powder`
- **Spec Pill:** `Directional Micro-Puff | 10g / 0.35 oz`
- **Container Form Factor:** 10g Precision Directional Pump Dispenser Bottle
- **Template:** `templates/product.zvhc-powder.json`
- **Section Order:** `["main", "marquee", "how_it_works", "package", "reviews", "faq", "shipping"]`
- **Core Benefits:**
  1. Delivers instant, gravity-defying root volume to flat, fine, or second-day hair.
  2. Absorbs excess surface oils for a clean, velvety matte finish.
  3. Fully reworkable throughout the day—just massage roots to reactivate lift.
- **How It Works (4 Steps):**
  - Step 01: Section Dry Roots (Part dry hair where fullness and structural lift are needed)
  - Step 02: Tap Directly (Lightly tap 2–3 shakes/puffs directly onto roots)
  - Step 03: Massage to Activate (Work fingertips firmly in upward lifting motions)
  - Step 04: Rework Anytime (Re-fluff volume anytime by fingertip massage)
- **Verified INCI:** `Aqua, Silica Silylate, Sodium Benzoate, Octylacrylamide/Acrylates/Butylaminoethyl Methacrylate Copolymer, Citric Acid.`
- **Package Title:** `What's Inside Your Root-Lift Styling Powder`
- **Formulation Insight Focus:** Micronized Silica Silylate porous mineral matrix with ultra-high surface area, selective sebum adsorption, physical micro-friction between hair fibers creating mechanical separation and reworkable root lift.

---

### P04 — Hairline Shadow Touch-Up Compact
- **Handle:** `zvhc-precision-hairline-compact`
- **Shopify Product ID:** `8995577823545`
- **Canonical H1:** `Hairline Shadow Touch-Up Compact`
- **Spec Pill:** `Dual-Mirror Compact with Ergonomic Applicator Sponge | 4g / 0.14 oz`
- **Container Form Factor:** 4g Concealed Dual-Compartment Compact with Mirror & Bottom High-Density Sponge (3 Shades: #01 Black, #02 Dark Brown, #03 Medium Brown)
- **Variants:** 9 Variants (3 shades × 3 pack sizes: 1 Compact, 2 Compacts, 3 Compacts)
- **Template:** `templates/product.zvhc-hairline.json`
- **Section Order:** `["main", "marquee", "how_it_works", "package", "reviews", "faq", "shipping"]`
- **Core Benefits:**
  1. Shapes and defines uneven hairlines, thin edges, and temples in seconds.
  2. Precision bottom-puff applicator ensures mess-free, targeted application without fallout.
  3. Water and sweat-resistant mineral formula stays in place until shampooed out.
- **How It Works (4 Steps):**
  - Step 01: Retrieve Bottom Puff (Open concealed compartment for sponge access)
  - Step 02: Dab Mineral Pigment (Dab gently into pressed powder cake)
  - Step 03: Stipple & Blend (Press and blend along temples, edges, or gray regrowth)
  - Step 04: Natural Matte Finish (Layer lightly for natural scalp shadow depth)
- **Verified INCI:** `Mica, Squalane, Tocopherol (Vitamin E), Magnesium Stearate, Caprylic/Capric Triglyceride, Phenoxyethanol, [+/- CI 77491, CI 77492, CI 77499 (Iron Oxides)].`
- **Package Title:** `What's Inside Your Hairline Shadow Compact`
- **Formulation Insight Focus:** Anhydrous pressed pigment suspension, pharmaceutical-grade mica and iron oxides, biocompatible squalane mimicking skin sebum, perspiration resistance without caking or migration.

---

### P05 — Nourishing Batana Scalp Balm
- **Handle:** `zvhc-raw-batana-scalp-balm`
- **Shopify Product ID:** `8995577889081`
- **Canonical H1:** `Nourishing Batana Scalp Balm`
- **Spec Pill:** `Solid Botanical Emollient | 100g / 3.5 oz Metal Tin`
- **Container Form Factor:** 100g Recyclable Protective Twist-Top Aluminum Metal Tin
- **Template:** `templates/product.zvhc-balm.json`
- **Section Order:** `["main", "marquee", "package", "how_it_works", "reviews", "faq", "shipping"]`
- **Core Benefits:**
  1. Solid-to-oil melting consistency provides rich, mess-free lipid protection.
  2. Deeply conditions dry scalp patches, rough cuticles, and fragile hairline edges.
  3. 100% natural formula in a leak-proof travel tin—ideal for on-the-go barrier care.
- **How It Works (4 Steps):**
  - Step 01: Scoop Pea Size (Scoop small portion with clean fingertip)
  - Step 02: Warm Between Palms (Body heat melts beeswax and butter into golden oil in 5s)
  - Step 03: Target Dry Patches (Massage directly onto dry scalp spots or flyaways)
  - Step 04: Overnight End Seal (Smooth through split ends before bed)
- **Verified INCI:** `Elaeis Oleifera Kernel Oil (Batana Butter), Butyrospermum Parkii (Shea) Butter, Ricinus Communis (Castor) Seed Oil, Cera Alba (Beeswax), Tocopherol (Vitamin E).`
- **Package Title:** `What's Inside Your Nourishing Batana Scalp Balm`
- **Formulation Insight Focus:** Anhydrous occlusive lipid butter with calibrated 35°C melting point, transepidermal water loss (TEWL) reduction via beeswax-ester semi-breathable film, intensive barrier restoration.

---

### P06 — Batana Hydrating Curl Cream
- **Handle:** `zvhc-botanical-curl-cream`
- **Shopify Product ID:** `8995577954617`
- **Canonical H1:** `Batana Hydrating Curl Cream`
- **Spec Pill:** `Botanical Curl Definition Complex | 100 ml / 3.4 fl oz Squeeze Tube`
- **Container Form Factor:** 100 ml Protective Ergonomic Squeeze Tube with Flip-Cap
- **Template:** `templates/product.zvhc-curl.json`
- **Section Order:** `["main", "marquee", "package", "how_it_works", "reviews", "faq", "shipping"]`
- **Core Benefits:**
  1. Enhances natural curl pattern definition from loose 2A waves to tight 4C coils.
  2. Weightless botanical moisture locks cuticles against humidity without stiff gel cast.
  3. Infused with Moroccan argan oil and hydrolyzed keratin to reinforce strand elasticity.
- **How It Works (4 Steps):**
  - Step 01: Apply to Damp Hair (Start with clean, damp curls and detangle)
  - Step 02: Rake & Distribute (Dispense 1–2 pumps/squeezes, rake evenly mid-lengths to ends)
  - Step 03: Scrunch to Shape (Cup curls and scrunch upward toward scalp)
  - Step 04: Air Dry or Diffuse (Allow to air dry or diffuse on low heat for soft bounce)
- **Verified INCI:** `Aqua, Argania Spinosa (Argan) Kernel Oil, Hydrolyzed Keratin, Butyrospermum Parkii (Shea) Butter, Glycerin, Cetearyl Alcohol, Stearamidopropyl Dimethylamine, Polyquaternium-37, Phenoxyethanol, Ethylhexylglycerin, Citric Acid, Fragrance.`
- **Package Title:** `What's Inside Your Batana Hydrating Curl Cream`
- **Formulation Insight Focus:** Engineered oil-in-water micro-emulsion, low-molecular hydrolyzed keratin penetration into porous curl cortex, cohesive curl clumping, humidity resistance without crunch.

---

### P07 — 7-in-1 Botanical Hair Growth Oil
- **Handle:** `zvhc-7-in-1-growth-elixir`
- **Shopify Product ID:** `8995578020153`
- **Canonical H1:** `7-in-1 Botanical Hair Growth Oil`
- **Spec Pill:** `Multi-Botanical Nutrient Infusion | 60 ml / 2 fl oz`
- **Container Form Factor:** 60 ml Amber Glass Apothecary Dropper Bottle
- **Template:** `templates/product.zvhc-7in1.json`
- **Section Order:** `["main", "marquee", "package", "how_it_works", "reviews", "faq", "shipping"]`
- **Core Benefits:**
  1. Synergistic 7-oil botanical complex addresses dry scalp and dull hair in one step.
  2. Peppermint and rosemary provide an immediate refreshing, cooling scalp sensation.
  3. Multi-use formula: daily scalp drops, hot oil soak, or protective style maintenance.
- **How It Works (4 Steps):**
  - Step 01: Part & Dispense (Part hair into 4 sections, draw half dropper along scalp)
  - Step 02: 3-Minute Scalp Massage (Massage circular motions to feel cooling tingle)
  - Step 03: Coat Fragile Ends (Smooth remaining drops along mid-lengths to ends)
  - Step 04: Versatile Leave-in (Leave in daily, or use as pre-shampoo hot oil soak)
- **Verified INCI:** `Elaeis Oleifera Kernel Oil (Batana), Rosmarinus Officinalis (Rosemary) Leaf Oil, Ricinus Communis (Black Castor) Seed Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Argania Spinosa (Argan) Kernel Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Mentha Piperita (Peppermint) Oil, Tocopherol (Vitamin E).`
- **Package Title:** `What's Inside Your 7-in-1 Multi-Oil Scalp Elixir`
- **Formulation Insight Focus:** Multi-tiered lipid profile (7 botanical oils), ricinoleic acid emollient cushion, jojoba wax esters matching cutaneous sebum, refreshing peppermint menthol and rosemary 1,8-cineole sensory activation.

---

### P08 — Batana Deep Conditioning Hair Mask
- **Handle:** `zvhc-batana-deep-conditioning-hair-mask`
- **Shopify Product ID:** `8995641753913`
- **Canonical H1:** `Batana Deep Conditioning Hair Mask`
- **Spec Pill:** `Deep Restorative Masque | 120g / 4.2 oz Wide-Mouth Jar`
- **Container Form Factor:** 120g Wide-Mouth Protective Moisture-Seal Jar
- **Template:** `templates/product.zvhc-mask.json`
- **Section Order:** `["main", "marquee", "package", "how_it_works", "reviews", "faq", "shipping"]`
- **Core Benefits:**
  1. Instantly softens coarse, brittle textures and dramatically reduces comb-through snagging.
  2. Rich high-slip lipid formula with Coconut, Camellia, and Biotin for reflective shine.
  3. Free from sulfates, parabens, phthalates, and artificial coloring.
- **How It Works (4 Steps):**
  - Step 01: Cleanse & Prep (Wash hair with sulfate-free shampoo, gently squeeze damp)
  - Step 02: Coat Mid-Lengths & Ends (Scoop generous amount, rake thoroughly ear down)
  - Step 03: 5–10 Min Deep Soak (Detangle with fingers/comb; leave 10–20 min under cap)
  - Step 04: Lukewarm Rinse (Rinse until clean for instant silk-soft slip and bounce)
- **Verified INCI:** `Aqua, Cetearyl Alcohol, Steartrimonium Chloride, Elaeis Oleifera Kernel Oil (Batana Oil), Cocos Nucifera (Coconut) Oil, Ricinus Communis (Castor) Seed Oil, Camellia Japonica Seed Oil, Zingiber Officinale (Ginger) Root Extract, Biotin, Glycerin, Hydroxyethylcellulose, Dimethiconol, Phenoxyethanol, Ethylhexylglycerin, Aroma.`
- **Package Title:** `What's Inside Your Batana Deep Conditioning Hair Mask`
- **Formulation Insight Focus:** Cationic conditioning matrix (Steartrimonium Chloride) neutralizing negative electrostatic charge on damaged cuticles, lipid deposition (Batana, Coconut, Camellia), biotin-ginger root fortification, dramatic comb-through snag reduction.

---

## 3. AUDIT CONCLUSION & COMPLIANCE

Every single PDP has been verified against the master criteria:
- [x] Zero generic stock fallbacks (P08 has its own dedicated package, how-it-works, INCI, FAQs, and insight card).
- [x] All 8 H1 titles are short, elegant, and canonical.
- [x] All 8 spec pills are clearly visible with correct volume/weight.
- [x] All buybox accordions are closed by default on page load.
- [x] The 3rd buybox accordion is titled `30-Day Guarantee` with 0 carrier text.
- [x] All FAQ accordions are closed by default.
- [x] Every FAQ is followed by the authentic `Zavelyn Formulation Insight` card.
