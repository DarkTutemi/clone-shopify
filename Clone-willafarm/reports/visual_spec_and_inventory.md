# ZAVELYN — WILLA FARMS UX/UI RECONSTRUCTION
## Comprehensive Visual Specification, Catalog Inventory & Architecture Blueprint

---

### 1. Executive Summary & Context
- **Store Being Rebuilt**: [https://tryzavelyn.com/](https://tryzavelyn.com/) (`dsdujr-vn.myshopify.com`)
- **Reference Benchmark**: [https://willafarm.com/](https://willafarm.com/)
- **Core Strategy**: 
  - 80% mobile traffic requires strict **Mobile-First Priority**.
  - Replicate Willa Farms' warm, earthy, high-converting visual hierarchy, typography, section rhythm, bundle selection mechanics, sticky purchase interactions, and slide-out cart drawer.
  - Retain Zavelyn's actual 57 active products, genuine pricing, real inventory, brand identity, and policies.

---

### 2. Design System Tokens (Extracted from Willa Farm)
| Token Category | Value | Application |
| :--- | :--- | :--- |
| **Primary CTA Color** | `#8a2c13` (Terracotta Crimson) | Primary "Claim Offer", "Add to Cart", Checkout buttons |
| **CTA Hover Color** | `#71230e` | Button active / hover interaction |
| **Warm Page Background** | `#faf7f4` / `#fbf8f4` | Base body, drawer, and card backgrounds |
| **Card Surface Color** | `#ffffff` | Elevated product cards, bundle boxes, review cards |
| **Deep Espresso Accent** | `#3b2b2f` / `#231f20` | Announcement bar, footer, primary headings |
| **Muted Charcoal Text** | `#59514f` / `#75696c` | Subtitles, body descriptions, specs |
| **Subtle Border Color** | `#e7e4df` / `#d8d3cb` | Clean container lines, accordions, bundle borders |
| **Success / Trust Green** | `#2e7d32` / `#059669` | Verified buyer tags, free shipping badges, stock tags |
| **Body Typography** | `'Montserrat', sans-serif` | Clean geometric weights (400, 500, 600, 700) |
| **Heading Typography** | `'Playfair Display', 'Recollecta', serif` | Expressive artisanal titles (600, 700, 900) |
| **Card Border Radius** | `16px` / `20px` / `24px` | Pill tags (`9999px`), inputs (`12px`) |
| **Shadow Treatment** | `0 4px 20px rgba(59, 43, 47, 0.08)` | Subtle warm elevation without harsh dark drop-shadows |

---

### 3. Willa Farm UX/UI Section Hierarchy (Mobile & Desktop)
1. **Announcement Bar**:
   - Background `#3b2b2f`, white text, star icons: `★ FREE US SHIPPING OVER $49 ★ 100% SATISFACTION GUARANTEED ★`
2. **Header**:
   - Mobile: Hamburger menu (left), Zavelyn Brand Logo (center), Cart Drawer Icon with count pill (right).
   - Sticky with subtle shadow on scroll.
3. **Mobile-First Hero**:
   - Expressive serif headline: *"Engineered for Performance. Built for Reliability."*
   - Subtitle: *"Discover high-performance farm repair tools, precision instruments, and workshop essentials built to last."*
   - Social proof row: `⭐⭐⭐⭐⭐ 4.9/5 Rating (12,400+ Verified Customers)`
   - Primary CTA: Large `#8a2c13` button: `SHOP BEST SELLERS ➔`
   - Trust points: `90-Day Money-Back Guarantee • Fast Insured US Delivery`
4. **Value Props & Proof Pillars (Pills & Icons)**:
   - 4 Icon Cards:
     - 🛡️ **Heavy-Duty Durability**: Industrial-grade materials engineered for tough jobs.
     - ⚡ **Precision Performance**: High-efficiency operation that saves time and labor.
     - 🔒 **Safe & Certified**: Rigorously tested for maximum workplace and farm safety.
     - 🚚 **Free Fast Delivery**: Free US shipping on all orders over $49.
5. **Featured Flagship Innovations (Direct-to-Offer Buy Box)**:
   - Showcase top hero product (e.g. Sakerplus® Fence Post Repair Kit / Livestock Heating Lamp / Ultrasonic Precision Cutter) with interactive multi-pack bundle selector:
     - 1-Pack, 2-Pack (Best Seller), 4-Pack (Best Value)
     - Dynamic total calculation & instant Add to Cart.
6. **Curated Collections Grid / Carousel**:
   - Visual category cards:
     - Fence & Farm Repair
     - Power & Precision Tools
     - Lawn, Garden & Outdoor
     - Home & Workshop Solutions
7. **3-Step How It Works Section**:
   - 01 Select Your Tool or Repair Kit
   - 02 Quick & Seamless Setup
   - 03 Long-Lasting Peace of Mind
8. **Comparison Table: Zavelyn vs Generic Alternatives**:
   - Clear checkmarks vs red crosses highlighting build quality, warranty, customer support, and direct pricing.
9. **Real Customer Reviews & Social Proof**:
   - Verified buyer cards with stars, customer names, use cases, and quotes.
10. **Frequently Asked Questions (Accordion)**:
    - Clean toggle questions on shipping times, guarantees, warranty, and returns.
11. **Deep Espresso Footer (`#3b2b2f`)**:
    - Zavelyn logo, newsletter subscription, navigation links, policy links, and payment security badges.

---

### 4. Catalog Audit & Collection Architecture
**Total Active Products**: 57

#### Recommended Collection Architecture:
1. **Best Sellers (`/collections/best-sellers`)**:
   - Curated top converting items: Fence Post Repair Kit, Livestock Heating Lamp, 40kHz Ultrasonic Cutter, The Yeoman Sweep, SrefalSteam, Thoson MagTrack.
2. **Fence & Farm Repair (`/collections/fence-and-farm`)**:
   - Products: Fence Post Repair Kit, Livestock Heating Lamp, Livestock Scratch Brush, Auto Coop Door, Cordless Garden Tiller.
3. **Power & Precision Tools (`/collections/power-tools`)**:
   - Products: 40kHz Ultrasonic Cutter, Cordless Hydraulic Pipe Crimper, Thermal Imaging Camera, Battery Cable Lug Crimper, Laser Wall Chaser, Laser Level with Tripod, Portable Welding Machine, Gypsum Board Cutter, Bench Vise Clamp, Wheel Alignment Kit.
4. **Lawn, Garden & Outdoor (`/collections/garden-and-outdoor`)**:
   - Products: The Yeoman Sweep, Rolling Nut & Ball Picker, Downspout Catch Basin, Solar Street Lights, Solar Motion Security Lights, Flexible Work Flashlight, Magnetic 360 Work Light, Industrial String Lights.
5. **Home & Workshop Solutions (`/collections/home-and-workshop`)**:
   - Products: SrefalSteam Cleaner, UV Mattress Vacuum, Flame Space Heater, Bathroom Exhaust Fan, Desk Organizer, Drawer Liners, Titanium Pry Bar, Cooking Oil Sprayer.
6. **Shop All Products (`/collections/all-products`)**:
   - Complete 57 active product catalog.
7. **Special Deals & Clearance (`/collections/deals-of-the-day`)**:
   - Discounted and clearance items.
