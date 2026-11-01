# ZAVELYN IMMERSIVE COMMERCE THEME V4.0
## ARCHITECTURE & DESIGN SPECIFICATION

**Store:** `tryzavelyn.com` (Shopify Online Store 2.0)  
**Target Theme ID:** `187926020281` (`ZAVELYN — IMMERSIVE SHOWROOM V4.0 — DRAFT` - UNPUBLISHED)  
**Live Theme Preserved:** `187597717689` (`Zavelyn 2.0` - MAIN)  
**Reference Benchmark:** ShopSideK T01 (`https://shopsidek.com/templates/t01/`)  

---

### 1. DESIGN PHILOSOPHY & BRAND DESIGN TOKENS
The theme creates an immersive digital retail showroom that bridges the tactile authenticity of high-end physical retail stores with the conversion-optimized DTC flow of modern ecommerce.

#### Color Tokens
```css
:root {
  --zv-primary: #17352B;          /* Deep Forest Green (Main Brand / Headers / Solid Buttons) */
  --zv-primary-hover: #0F241D;    /* Dark Forest hover */
  --zv-accent: #BCE76A;           /* Soft Lime / High-visibility CTA highlight / Badges */
  --zv-accent-dark: #17352B;      /* Text on accent */
  --zv-bg: #FAFAF6;               /* Warm Off-White / Natural Canvas */
  --zv-surface: #FFFFFF;          /* Pure White for product cards and modals */
  --zv-surface-muted: #F1F3ED;    /* Soft Tint Surface for Secondary Blocks */
  --zv-heading: #17231E;          /* Rich Charcoal Black */
  --zv-body: #454F49;             /* Slate Grey Body text */
  --zv-muted: #738076;            /* Secondary / Hint text */
  --zv-border: #E5E8E2;           /* Crisp Card & Section Border */
  --zv-border-light: rgba(23, 53, 43, 0.08);
  --zv-ok: #2E7D32;               /* Success / In-Stock / Unlocked */
  --zv-ok-tint: #E8F5E9;
  --zv-warn: #D97706;             /* Low Stock / Alert */
  --zv-warn-tint: #FEF3C7;
  
  /* Typography Scale */
  --zv-font-heading: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --zv-font-body: 'Inter', system-ui, -apple-system, sans-serif;
  
  /* Radii & Shadows */
  --zv-radius-sm: 8px;
  --zv-radius-md: 14px;
  --zv-radius-lg: 20px;
  --zv-radius-xl: 28px;
  --zv-radius-full: 9999px;
  --zv-shadow-sm: 0 2px 8px rgba(23, 53, 43, 0.04);
  --zv-shadow-md: 0 10px 24px -8px rgba(23, 53, 43, 0.08);
  --zv-shadow-lg: 0 24px 50px -16px rgba(23, 53, 43, 0.14);
  --zv-shadow-shelf: 0 18px 30px -10px rgba(0, 0, 0, 0.28);
}
```

---

### 2. CORE COMPONENT ARCHITECTURE

#### A. Homepage Retail Showroom Entrance (`sections/zavelyn-v4-stores.liquid`)
- Displays real-world retail store entrances for Zavelyn categories:
  1. **Home & Living Showroom** (Foldable storage bins, kitchen equipment, organizational essentials).
  2. **Power & Tools Workshop** (Cutting tools, magnetic worklights, cordless equipment).
  3. **Wellness & Personal Care Boutique** (BotanaRoots Batana Oil, dental care, intimate wellness).
  4. **Garden & Farm Sanctuary** (Livestock heating lamps, coop doors, outdoor tools).
  5. **Sound & Meditation Studio** (Zavelyn handcrafted rain drums and master handpans).
- Each card has interactive 2.5D tilt/depth on hover, 3 preview thumbnails of real in-stock products, category badge, and direct "Enter Store Showroom" button leading to `collection.showroom.json`.

#### B. Immersive 2.5D Collection Showroom (`sections/zavelyn-v4-showroom.liquid`)
- **Realistic 4-column shelves on desktop** (2-column on mobile).
- Products sit directly on 3D-styled physical shelf ledges with realistic under-shadows.
- 5 configurable shelf themes:
  - `wood`: Warm oak/walnut grain with brass label edge.
  - `metal`: Industrial steel workshop rack with rivets.
  - `boutique`: Minimalist white studio lacquer with gold lip.
  - `tech`: Matte graphite with glowing LED under-rail.
  - `floating`: Modern bevelled glass ledge.
- Includes View Toggle: **Showroom Shelf View** ⟷ **Standard Grid View**.
- Dynamic sorting, filtering, and pagination support.

#### C. Cinematic Zoom & Quick View (`snippets/zavelyn-v4-quickview.liquid`)
- Clicking any product on the shelf triggers smooth positional zoom (FLIP animation).
- Desktop: Quick View card surfaces in place without page reload.
- Mobile: Polished bottom sheet slides up with swipe-to-dismiss.
- Features: Product gallery, real price, variant picker, Add to Cart (Ajax to Willa Cart Drawer), and "View Full Product Page".

#### D. Modular Dynamic PDP (`sections/zavelyn-v4-pdp-main.liquid`, `sections/zavelyn-v4-pdp-story.liquid`)
Inspired by the high-converting mechanics of ShopSideK T01:
1. **Hero Buy Box:**
   - Real variant selector.
   - 3/4-tier bundle cards (Single, Buy 2 Save 45%, Buy 3 Best Value / Free Gift).
   - Dynamic gift unlock progression bar (`Unlocked Free Shipping` + `Free Mystery Accessory`).
   - 1-Click Buy Now & Claim Offer CTAs.
   - Delivery progress stepper: `Ordered Today` → `24-48h Insured Dispatch` → `Doorstep Delivery`.
2. **Interactive Category Explainer:**
   - Tabbed / Interactive selector tailored to category (e.g., Space Suitability for storage bins, Treatment Routine for wellness, Task Compatibility for power tools).
3. **Product Mechanism & Anatomy:**
   - Step-by-step or annotated breakdown of how the product achieves results.
4. **Comparison Matrix (The Zavelyn Difference):**
   - Clean side-by-side ledger comparing Zavelyn vs. Generic alternatives.
5. **What's in the Box:**
   - High-fidelity package inventory with visual icons for each bundle tier.
6. **Verified Social Proof & FAQ:**
   - Review summary with star rating breakdown and accordion objection-killers.
7. **Sticky ATC Bar:**
   - Appears on scroll with product thumbnail, selected variant, price, and instant checkout button.
