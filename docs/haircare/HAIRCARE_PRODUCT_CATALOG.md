# Zavelyn Hair Care — Product Catalog Specification

## 1. Catalog Overview & Funnel Hierarchy

The Zavelyn Hair Care brand operates two high-intent DTC conversion funnels:

```mermaid
graph TD
  A["Zavelyn Hair Care Storefront"] --> B["Funnel B (Primary / Hero): Batana Hair Growth Routine"]
  A --> C["Funnel A (Secondary): Instant Hair Coverage & Fibers"]
  
  B --> B1["Hero: Organic Batana Hair Growth Oil (50ml/60ml)"]
  B --> B2["Upsell 1: Batana Intensive Hair Mask"]
  B --> B3["Upsell 2: Rosemary & Batana Scalp Leave-in Serum"]
  B --> B4["Complement: Silicone Scalp Massager Comb"]
  
  C --> C1["Hero: Hair Building Keratin Fibers (25g)"]
  C --> C2["Upsell 1: Precision Spray Applicator Kit"]
  C --> C3["Upsell 2: Hairline Optimizer Shield"]
  C --> C4["Upsell 3: 100g Fiber Refill Pouch"]
```

---

## 2. Primary Funnel (Funnel B): Batana Hair Care Routine

### Product Identification:
- **Title:** `Zavelyn BotanaRoots Batana Hair Growth Oil`
- **Shopify Product ID:** `15461545935033`
- **Public Handle:** `zavelyn-botanaroots-organic-batana-hair-growth-oil`
- **URL Path:** `/products/zavelyn-botanaroots-organic-batana-hair-growth-oil`
- **Active Template:** `templates/product.zvhc-batana.json` (or `product.json`)
- **Key Sourcing Candidate:** Lewedo Hair Care / Pure Honduran Batana Nut Oil

### Live Variant & Bundle Mapping:

| Variant ID | Bundle Course | Formula | Price (USD) | Compare At (USD) | Unit / Bottle | In-Cart Savings |
|---|---|---|---|---|---|---|
| `67980643598521` | Buy 1 (Starter Supply) | 100% Pure Raw Honduran Batana (60ml) | $39.99 | $80.00 | $39.99 | $40.01 (50%) |
| `67980643631289` | Buy 1 (Starter Supply) | Batana + Rosemary Scalp Infusion (60ml) | $39.99 | $80.00 | $39.99 | $40.01 (50%) |
| `67980643664057` | Buy 2 (Duo Intensive Care - **Most Popular**) | 100% Pure Raw Honduran Batana (60ml) | $79.98 | $160.00 | $39.99 | $80.02 (Save 45% + Free US Ship) |
| `67980643696825` | Buy 2 (Duo Intensive Care - **Most Popular**) | Batana + Rosemary Scalp Infusion (60ml) | $79.98 | $160.00 | $39.99 | $80.02 (Save 45% + Free US Ship) |
| `67980643729593` | Buy 3 (Restoration Course - **Best Value**) | 100% Pure Raw Honduran Batana (60ml) | $95.99 | $240.00 | $31.99 | $144.01 (Buy 2 Get 1 FREE) |
| `67980643762361` | Buy 3 (Restoration Course - **Best Value**) | Batana + Rosemary Scalp Infusion (60ml) | $95.99 | $240.00 | $31.99 | $144.01 (Buy 2 Get 1 FREE) |
| `68036047831225` | Buy 1 (120ml Double Size) | 100% Pure Raw Honduran Batana (120ml) | $49.99 | $100.00 | $49.99 | $50.01 |
| `68036048453817` | Buy 2 (120ml Duo Course) | 100% Pure Raw Honduran Batana (120ml) | $99.98 | $200.00 | $49.99 | $100.02 |
| `68036048715961` | Buy 3 (120ml Restoration) | 100% Pure Raw Honduran Batana (120ml) | $125.99 | $300.00 | $41.99 | $174.01 |

### Special Promo Landing:
- **Title:** `Botanaroots™ BOGO Special`
- **Shopify Product ID:** `15469942145209`
- **Public Handle:** `zavelyn-botanaroots-bogo-special`
- **Offers:** Buy 2 Get 2 FREE ($79.98), Buy 4 Get 4 FREE ($159.96)

---

## 3. Secondary Funnel (Funnel A): Instant Hair Coverage & Fibers

### Product Identification:
- **Product Role:** Immediate cosmetic density for thinning crowns and visible scalp parts.
- **Template:** `templates/product.zvhc-fibers.json`
- **Candidate Hero:** Instant Keratin Hair Building Fibers (25g)
- **Target Shades:** Black, Dark Brown, Medium Brown, Light Brown, Gray/Salt & Pepper.
- **Cross-sell Funnel:**
  1. Precision Spray Applicator ($12.99 with order)
  2. Hairline Optimizer Edge Comb ($7.99 with order)
  3. Fiber Locking Botanical Holding Mist ($14.99 with order)
