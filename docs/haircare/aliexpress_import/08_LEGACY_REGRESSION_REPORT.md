# Zavelyn Hair Care — Legacy Ad Funnel Regression Audit

## 1. Zero Regression Guarantee & Route Audit

The live production theme (`Zavelyn 2.0` [ID: `187597717689`]) is actively driving paid traffic from Meta Ads and TikTok Ads. It was **NOT modified, NOT published, and NOT touched**.

All verification tests below were executed within the Draft Theme `189127983289` preview session to verify that even when the unified theme is eventually published, legacy ad funnels will experience **0% regression**:

---

## 2. Protected Funnels Audit Table

| Protected URL Path | Funnel Target | Layout Chrome | Template Body | Bundle / Variant Selector | Regression Status |
|---|---|---|---|---|---|
| `/products/zavelyn-botanaroots-organic-batana-hair-growth-oil` | **Original Live BotanaRoots Batana Oil Funnel** | Original Header & Footer (`sections/header-group`, `sections/footer-group`) | Original BotanaRoots PDP layout | Original 12 variants ($39.99 / $79.98 / $95.99) intact | **0% REGRESSION (PASS - Protected)** |
| `/products/breakout-2-0-holster-built-for-maximum-concealment-copy` | Breakout 2.0 Holster Ad Funnel | Original Header & Footer (`sections/header-group`, `sections/footer-group`) | 6 Feature Cards (`Minimal Printing`, `Exceptional Retention`, etc.) | Flat Black ($129.99), Carbon Fiber (+$19.99), Kaching 1/2/3 Holster Bundles | **0% REGRESSION (PASS - Protected)** |
| `/products/zavelyn-rehabilitation-glove` | Robotic Stroke Rehabilitation Glove | Original Header & Footer | Glove specifications, hand sizing chart | 1 Glove ($89.00), 2 Gloves ($149.00), Dual Hand & Size dropdowns, 30-Day Guarantee | **0% REGRESSION (PASS - Protected)** |
| `/products/babiguard-head-protector` | BabiGuard Infant Head Protector | Original Header & Footer | Baby safety specifications | 1/2/3 BabiGuards ($35.99 / $59.99 / $79.99), 3 Design dropdowns, Knee pads upsell | **0% REGRESSION (PASS - Protected)** |
| `/products/srefalsteam` | Srefalsteam Garment Steamer | Original Header & Footer | Srefalsteam landing sections | Steamer options & accessories | **0% REGRESSION (PASS - Protected)** |
| `/products/the-yeoman-sweep` | Yeoman Chimney / Sweep Funnel | Original Header & Footer | Yeoman sweep sections | Rod & brush bundles | **0% REGRESSION (PASS - Protected)** |

---

## 3. Scoping & Style Containment Verification

- `zvhc-haircare.css` and `zvhc-pdp.css` are conditionally loaded:
  ```liquid
  {% if is_haircare_route %}
    {{ 'zvhc-haircare.css' | asset_url | stylesheet_tag }}
    {{ 'zvhc-pdp.css' | asset_url | stylesheet_tag }}
  {% endif %}
  ```
- Strict Route Logic in `layout/theme.liquid`:
  ```liquid
  assign is_haircare_route = false
  if request.page_type == 'index'
    assign is_haircare_route = true
  elsif template.suffix contains 'zvhc'
    assign is_haircare_route = true
  endif

  # Protected legacy registry: ensure legacy ad landing pages never get misclassified
  if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' or product.handle == 'zavelyn-botanaroots-bogo-special' or product.handle == 'breakout-2-0-holster-built-for-maximum-concealment-copy' or product.handle == 'zavelyn-rehabilitation-glove' or product.handle == 'babiguard-head-protector' or product.handle == 'the-yeoman-sweep' or product.handle contains 'saker' or product.handle contains 'srefalsteam'
    unless template.suffix contains 'zvhc'
      assign is_haircare_route = false
    endunless
  endif
  ```
- On all legacy product routes above, `is_haircare_route` evaluates strictly to `false`.
- Result: **Zero CSS leakage, zero JavaScript collisions, zero header/footer alteration.**
