import fs from 'fs';

const cssPath = 'assets/zavelyn-v4-showroom.css';
let content = fs.readFileSync(cssPath, 'utf8');

const targetStart = '/* 4 Products Desktop Row (2 Products Mobile) */';
const targetEnd = '/* ==========================================================================\n   6. POSITIONAL ZOOM: SPATIAL PRODUCT INSPECTION BAY (DESKTOP)';

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error('Target anchors not found:', { startIndex, endIndex });
  process.exit(1);
}

const replacement = `/* ==========================================================================
   2.5D REALISTIC PHYSICAL CONTINUOUS WOODEN SHELF ARCHITECTURE (V4.3)
   Matches the merchant reference image: Continuous Wooden Plank + Front Clip Tags
   ========================================================================== */

.zv-shelf-tier {
  position: relative;
  margin-bottom: 96px;
  perspective: 1200px;
  z-index: 10;
}

.zv-shelf-tier:last-child {
  margin-bottom: 48px;
}

/* Ceiling Directional Lightbar & Spotlights */
.zv-fixture-lightbar {
  position: relative;
  height: 6px;
  background: linear-gradient(90deg, #6B7767 0%, #95A291 50%, #6B7767 100%);
  border-radius: 3px;
  margin-bottom: 28px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.zv-spotlight-beam {
  position: absolute;
  top: 6px;
  transform: translateX(-50%);
  width: 180px;
  height: 300px;
  background: radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
  z-index: 3;
}

/* The Shelf Stage (Container for continuous plank and columns) */
.zv-shelf-stage {
  position: relative;
  width: 100%;
  max-width: 1260px;
  margin: 0 auto;
}

/* ==========================================================================
   CONTINUOUS SOLID WOODEN SHELF PLANK (Behind columns)
   ========================================================================== */
.zv-continuous-wooden-shelf {
  position: absolute;
  left: 0;
  right: 0;
  top: 242px; /* Sits precisely under products */
  z-index: 2;
  pointer-events: none;
}

/* Top Perspective Surface of the Wooden Plank */
.zv-wood-top-surface {
  height: 28px;
  background: linear-gradient(90deg, 
    #B57F44 0%, 
    #C9965B 15%, 
    #D6A66C 35%, 
    #E4B880 50%, 
    #D6A66C 65%, 
    #C9965B 85%, 
    #B57F44 100%);
  transform: perspective(700px) rotateX(28deg);
  transform-origin: bottom center;
  border-radius: 4px;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -1px 2px rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  position: relative;
}

.zv-wood-grain-texture {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, 
    rgba(255, 255, 255, 0.04) 0px, 
    rgba(255, 255, 255, 0.04) 2px, 
    transparent 2px, 
    transparent 12px);
  opacity: 0.7;
}

.zv-wood-top-highlight {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent);
}

/* Front Vertical Fascia Edge of the Wooden Plank */
.zv-wood-front-fascia {
  height: 34px;
  background: linear-gradient(180deg, 
    #9C652E 0%, 
    #875524 35%, 
    #72451A 75%, 
    #5D3712 100%);
  border-top: 2px solid #EEC58E; /* Crisp beveled highlight edge */
  border-bottom: 1px solid rgba(0, 0, 0, 0.45);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 0 0 4px 4px;
  position: relative;
}

.zv-wood-bevel-edge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.55);
}

.zv-wood-front-grain {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, 
    rgba(255, 255, 255, 0.035) 0px, 
    rgba(255, 255, 255, 0.035) 1px, 
    transparent 1px, 
    transparent 5px);
}

.zv-wood-bottom-bevel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(0, 0, 0, 0.35);
}

/* Ambient Soft Drop Shadow on Wall Beneath the Shelf */
.zv-wood-under-shadow {
  height: 42px;
  background: linear-gradient(180deg, 
    rgba(35, 18, 8, 0.36) 0%, 
    rgba(35, 18, 8, 0.14) 40%, 
    rgba(35, 18, 8, 0) 100%);
  filter: blur(4px);
  pointer-events: none;
}

/* ==========================================================================
   SHELF COLUMNS GRID (1, 2, 3, or 4 products)
   ========================================================================== */
.zv-shelf-columns-grid {
  display: grid;
  width: 100%;
  position: relative;
  z-index: 5;
  padding: 0 16px;
  align-items: flex-end;
}

/* 4 Products Full Desktop Row */
.zv-grid--4 {
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media screen and (min-width: 992px) {
  .zv-grid--4 {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    padding: 0 28px;
  }
}

/* 3 Products Row - Balanced Center Spacing */
.zv-grid--3 {
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media screen and (min-width: 992px) {
  .zv-grid--3 {
    grid-template-columns: repeat(3, 1fr);
    max-width: 980px;
    margin: 0 auto;
    gap: 36px;
  }
}

/* 2 Products Row - Symmetrical Distribution */
.zv-grid--2 {
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 720px;
  margin: 0 auto;
}

/* 1 Product Row - Centered Featured Display (Exact Reference Match!) */
.zv-grid--1 {
  grid-template-columns: 1fr;
  max-width: 380px;
  margin: 0 auto;
}

/* Shelf Column: Contains Product (Top) + Hanging Tag (Bottom) */
.zv-shelf-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* ==========================================================================
   PRODUCT MERCHANDISING DISPLAY ON TOP OF SHELF
   ========================================================================== */
.zv-shelf-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 270px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
  z-index: 5;
}

.zv-shelf-item:hover,
.zv-shelf-item:focus-visible {
  transform: translateY(-6px);
}

.zv-shelf-item.zv-shelf-dimmed {
  opacity: 0.32;
  filter: blur(1.5px);
  pointer-events: none;
  transition: all 0.35s ease;
}

.zv-merch-display {
  position: relative;
  width: 100%;
  height: 250px;
  max-width: 260px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 2px;
}

/* Transparent Cutout Container */
.zv-cutout-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 2;
}

.zv-cutout-img {
  max-width: 92%;
  max-height: 94%;
  object-fit: contain;
  filter: drop-shadow(0 14px 20px rgba(0, 0, 0, 0.38));
  transition: transform 0.28s ease;
}

.zv-shelf-item:hover .zv-cutout-img {
  transform: scale(1.05);
}

/* Restrained Fallback Presentation for Non-Cutout Items */
.zv-fallback-container {
  position: relative;
  width: 86%;
  height: 86%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 6px 18px rgba(23, 53, 43, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  transition: all 0.28s ease;
  overflow: hidden;
  z-index: 2;
}

.zv-shelf-item:hover .zv-fallback-container {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 28px rgba(23, 53, 43, 0.16);
  border-color: var(--zv-primary, #17352B);
}

.zv-fallback-img {
  max-width: 88%;
  max-height: 88%;
  object-fit: contain;
  transition: transform 0.28s ease;
}

.zv-shelf-item:hover .zv-fallback-img {
  transform: scale(1.06);
}

/* Realistic Ground Contact & Ambient Shadow Discs */
.zv-shelf-contact-shadow {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: var(--shadow-w, 68%);
  height: 12px;
  background: radial-gradient(ellipse at center, rgba(35, 18, 8, var(--shadow-op, 0.70)) 0%, rgba(35, 18, 8, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  transition: transform 0.28s ease, opacity 0.28s ease;
}

.zv-shelf-ambient-shadow {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 85%;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(35, 18, 8, 0.28) 0%, rgba(35, 18, 8, 0) 75%);
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}

.zv-shelf-item:hover .zv-shelf-contact-shadow {
  transform: translateX(-50%) scale(0.92);
  opacity: 0.85;
}

/* ==========================================================================
   AUTHENTIC SHELF-EDGE PRICE TAG (Matches Merchant Reference Image)
   ========================================================================== */
.zv-shelf-clip-tag {
  position: relative;
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 240px;
  cursor: pointer;
  outline: none;
  margin-top: 10px; /* Positions clip right over the front wooden fascia */
  transition: transform 0.22s ease;
}

.zv-shelf-clip-tag:hover,
.zv-shelf-clip-tag:focus-visible {
  transform: translateY(-2px);
}

/* Physical Clip Bracket Hooking over Front Shelf Edge */
.zv-tag-clip-bracket {
  width: 44px;
  height: 10px;
  background: linear-gradient(180deg, #FFFFFF 0%, #DCE0E4 100%);
  border-radius: 4px 4px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-bottom: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.22);
  margin-bottom: -1px;
  position: relative;
  z-index: 3;
}

/* White Price Card Hanging from Shelf Edge */
.zv-tag-card {
  width: 100%;
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 10px 14px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.22s ease;
  position: relative;
  z-index: 2;
}

.zv-shelf-clip-tag:hover .zv-tag-card,
.zv-shelf-item:hover + .zv-shelf-clip-tag .zv-tag-card {
  border-color: var(--zv-primary, #17352B);
  box-shadow: 0 12px 24px rgba(23, 53, 43, 0.16), 0 4px 8px rgba(0, 0, 0, 0.08);
}

.zv-tag-title {
  font-family: var(--zv-font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: 13.5px;
  font-weight: 700;
  color: #18181B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  line-height: 1.25;
  margin-bottom: 5px;
}

.zv-tag-pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.zv-tag-price-curr {
  font-size: 16px;
  font-weight: 800;
  color: #0F5132;
}

.zv-tag-price-old {
  font-size: 12.5px;
  color: #9CA3AF;
  text-decoration: line-through;
  font-weight: 500;
}

.zv-tag-save-badge {
  font-size: 11px;
  font-weight: 800;
  color: #15803D;
  background: #DCFCE7;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: -0.2px;
}

.zv-tag-action-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.zv-tag-action-hint {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: #4B5563;
  text-transform: uppercase;
}

/* Mobile Viewport Adjustments (< 768px) */
@media screen and (max-width: 767px) {
  .zv-shelf-tier {
    margin-bottom: 64px;
  }

  .zv-merch-display {
    height: 190px;
  }

  .zv-continuous-wooden-shelf {
    top: 184px;
  }

  .zv-wood-top-surface {
    height: 22px;
  }

  .zv-wood-front-fascia {
    height: 28px;
  }

  .zv-tag-card {
    padding: 8px 10px;
  }

  .zv-tag-title {
    font-size: 12px;
  }

  .zv-tag-price-curr {
    font-size: 14px;
  }

  .zv-tag-price-old {
    font-size: 11px;
  }

  .zv-tag-save-badge {
    font-size: 10px;
    padding: 1px 4px;
  }
}

`;

content = content.slice(0, startIndex) + replacement + content.slice(endIndex);
fs.writeFileSync(cssPath, content, 'utf8');
console.log('Successfully patched assets/zavelyn-v4-showroom.css with V4.3 shelf styles');
