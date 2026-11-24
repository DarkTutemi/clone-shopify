# 04 — Premium Four-Step Ritual Design QA

## 1. Architectural Rebuild
The previous How-It-Works section suffered from missing CSS rules in the loaded stylesheets, causing the four steps to render as an unstyled vertical text list. Furthermore, the content instructed using a "dropper" and "4–6 drops", which directly conflicted with the 120ml twist-top jar physical packaging.

For the BotanaRoots pilot, a bespoke luxury skincare education module was engineered in `sections/zvhc-pdp-how-it-works.liquid`, conditionally scoped to `zavelyn-botanaroots-organic-batana-hair-growth-oil`.

## 2. Module Specifications

- **Container:** `.zvhc-botanaroots-ritual-section` with soft ivory/blush background `#FFFFFF`, top border `#F3EAEF`, max-width `1160px`.
- **Header:**
  - Eyebrow: `✦ FOUR-STEP RESTORATIVE APPLICATION` (uppercase, bold letter-spacing `#B0476E`).
  - Heading (H2): `How To Practice The Batana Edge & Follicle Ritual` (`#2B1B24`, font-size `2rem`, letter-spacing `-0.02em`).
  - Subtitle: `A simple, transformative ritual designed for natural coils and protective styles. Unrefined Honduran Batana butter warms to liquid gold in seconds.`
- **Grid Layout:**
  - Desktop (>=1024px): 2x2 symmetrical grid (`repeat(2, 1fr)`), `24px` gap.
  - Tablet (768px–1023px): 2 columns (`repeat(2, 1fr)`), `16px` gap.
  - Mobile (<=767px): Single vertical flow (`1fr`), `16px` gap.
- **Card Aesthetics:**
  - Background `#FAF6F8`, border `1px solid #ECDCE2`, border-radius `14px`, padding `28px 24px`.
  - Step Number Badge: Elevated white tile `42x42px` with deep rose border `#EAD7DD`, number `01`–`04` in font-weight `900`.
  - Phase Pill: Micro-capsule `#F3E4EB` with label text in `#7A3550`.
  - Pro Tip Box: Dedicated white inset tile with star icon and actionable advice for protective styles.

## 3. Four-Step Step-by-Step Copy (Jar Packaging Aligned)

### Step 01: Section Your Hair
- **Phase:** `SECTION & ACCESS`
- **Instruction:** *Part dry or lightly damp hair into four workable sections. Expose the hairline, temples, crown, or parting lines where follicle nourishment is needed most.*
- **Pro Tip:** *✦ Pro Tip: Ideal for targeted scalp access under box braids, twists, and sew-ins.*

### Step 02: Warm a Small Amount
- **Phase:** `WARM FROM JAR`
- **Instruction:** *Scoop a pea-sized amount directly from the 120ml jar with clean fingertips. Rub your palms together for three seconds until the raw butter melts into a rich, golden lipid oil.*
- **Pro Tip:** *✦ Pro Tip: A little goes a long way — body heat instantly liquefies pure raw Batana. No dropper, no dilution.*

### Step 03: Massage & Nourish
- **Phase:** `MASSAGE & NOURISH`
- **Instruction:** *Gently press and massage the melted oil into your scalp, hairline, temples, and nape using circular fingertip motions for 60 seconds. Boosts microcirculation without stressing delicate baby hairs.*
- **Pro Tip:** *✦ Pro Tip: Use the pads of your fingers, never nails, to protect sensitive hairlines.*

### Step 04: Complete Your Ritual
- **Phase:** `SEAL & PROTECT`
- **Instruction:** *Smooth any remaining oil down the lengths and ends to seal the cuticle. Leave on overnight under a satin bonnet, or apply 30 minutes before wash day as a deep lipid soak.*
- **Pro Tip:** *✦ Pro Tip: Practice 3–4 nights weekly for visible new edge growth within 3–6 weeks.*

## 4. Packaging Alignment Check
- Dropper mentioned: **0 times (PASS)**
- Number of drops mentioned: **0 times (PASS)**
- Bottle mentioned: **0 times (PASS)**
- Jar / Scoop mentioned: **Properly instructed (PASS)**
- 60ml mentioned: **0 times (PASS)**
- 120ml specified: **Yes (PASS)**
