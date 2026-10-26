import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';
const LIVE_THEME_ID = '186607567033';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function uploadAsset(token, key, content) {
  console.log(`Uploading ${key} to Draft Theme ${DRAFT_THEME_ID}...`);
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value: content }
    })
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ Failed uploading ${key}:`, err);
    throw new Error(err);
  }
  const data = await res.json();
  console.log(`✔ Successfully uploaded ${key} (${content.length} chars)`);
  return data;
}

// ============================================================================
// 1. ASSET: assets/zavelyn-pdp-body.css
// Universal DTC Design System (Strict Specification Conformance)
// ============================================================================
const bodyCss = `/* ==========================================================================
   ZAVELYN ELIXIR — UNIVERSAL PRODUCT BODY V2 DESIGN SYSTEM
   Curated for High-End DTC Experience & High Conversion
   ========================================================================== */

:root {
  --zv-green-primary: #17433C;
  --zv-green-deep: #0D2622;
  --zv-green-light: #24695C;
  --zv-lime-accent: #C6FA54;
  --zv-lime-subtle: #EEFACC;
  --zv-text-main: #121212;
  --zv-text-muted: #556860;
  --zv-bg-white: #FFFFFF;
  --zv-bg-warm: #FFFAF7;
  --zv-bg-subtle: #F7F9F7;
  --zv-border: #E2E8E3;
  --zv-border-light: #EEF2EE;
  --zv-radius-sm: 8px;
  --zv-radius-md: 14px;
  --zv-radius-lg: 16px;
  --zv-shadow-subtle: 0 4px 20px rgba(23, 67, 60, 0.05);
  --zv-shadow-hover: 0 12px 30px rgba(23, 67, 60, 0.08);
}

/* Base Container & Sections */
.zv-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

.zv-body-section {
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.zv-bg-white { background-color: var(--zv-bg-white); }
.zv-bg-warm { background-color: var(--zv-bg-warm); }
.zv-bg-subtle { background-color: var(--zv-bg-subtle); }

/* Typography Tokens */
.zv-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--zv-green-primary);
  background: rgba(23, 67, 60, 0.08);
  padding: 6px 14px;
  border-radius: 30px;
  margin-bottom: 14px;
}

.zv-badge-lime {
  background: var(--zv-lime-subtle);
  color: var(--zv-green-primary);
}

.zv-section-header {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 52px;
}

.zv-section-title {
  font-size: 34px;
  line-height: 1.25;
  font-weight: 800;
  color: var(--zv-green-primary);
  letter-spacing: -0.5px;
  margin: 0 0 14px;
}

.zv-section-subtitle {
  font-size: 16px;
  line-height: 1.6;
  color: var(--zv-text-muted);
  margin: 0;
}

/* ==========================================================================
   1. PRODUCT VALUE PROPOSITION
   ========================================================================== */
.zv-value-prop-card {
  background: #FFFFFF;
  border: 1px solid var(--zv-border);
  border-radius: var(--zv-radius-lg);
  padding: 56px;
  box-shadow: var(--zv-shadow-subtle);
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 52px;
  align-items: center;
}

.zv-value-prop-content h2 {
  font-size: 36px;
  line-height: 1.22;
  font-weight: 800;
  color: var(--zv-green-primary);
  letter-spacing: -0.5px;
  margin: 0 0 18px;
}

.zv-value-prop-content p {
  font-size: 16px;
  line-height: 1.65;
  color: var(--zv-text-muted);
  margin: 0 0 28px;
}

.zv-value-prop-media {
  position: relative;
  text-align: center;
}

.zv-value-prop-media img {
  width: 100%;
  max-height: 440px;
  object-fit: cover;
  border-radius: var(--zv-radius-md);
  box-shadow: var(--zv-shadow-subtle);
}

.zv-value-prop-highlights {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.zv-vp-highlight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--zv-green-primary);
}

.zv-vp-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E8FCCC;
  color: var(--zv-green-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}

/* ==========================================================================
   2. KEY FEATURES GRID (3 Columns)
   ========================================================================== */
.zv-features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.zv-feature-card {
  background: #FFFFFF;
  border: 1px solid var(--zv-border);
  border-radius: var(--zv-radius-md);
  padding: 36px 28px;
  box-shadow: var(--zv-shadow-subtle);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
}

.zv-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--zv-shadow-hover);
}

.zv-feature-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #EEF5F2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-bottom: 20px;
}

.zv-feature-card h3 {
  font-size: 19px;
  font-weight: 800;
  color: var(--zv-green-primary);
  margin: 0 0 10px;
  line-height: 1.35;
}

.zv-feature-card p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--zv-text-muted);
  margin: 0;
}

/* ==========================================================================
   3. IMAGE & TEXT STORYTELLING (Alternating 50/50 Z-Pattern)
   ========================================================================== */
.zv-story-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 72px;
}

.zv-story-row:last-child {
  margin-bottom: 0;
}

.zv-story-row.zv-reverse {
  direction: rtl;
}

.zv-story-row.zv-reverse .zv-story-content,
.zv-story-row.zv-reverse .zv-story-media {
  direction: ltr;
}

.zv-story-media {
  position: relative;
  border-radius: var(--zv-radius-md);
  overflow: hidden;
  box-shadow: var(--zv-shadow-subtle);
}

.zv-story-media img {
  width: 100%;
  height: auto;
  max-height: 480px;
  object-fit: cover;
  display: block;
  border-radius: var(--zv-radius-md);
}

.zv-story-content h3 {
  font-size: 28px;
  line-height: 1.28;
  font-weight: 800;
  color: var(--zv-green-primary);
  letter-spacing: -0.4px;
  margin: 0 0 16px;
}

.zv-story-content p {
  font-size: 15px;
  line-height: 1.65;
  color: var(--zv-text-muted);
  margin: 0 0 24px;
}

/* ==========================================================================
   4. HOW IT WORKS / PRECISION MODES
   ========================================================================== */
.zv-steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.zv-step-card {
  background: #FFFFFF;
  border: 1px solid var(--zv-border);
  border-radius: var(--zv-radius-md);
  padding: 36px 28px;
  box-shadow: var(--zv-shadow-subtle);
  position: relative;
  border-top: 4px solid var(--zv-green-primary);
}

.zv-step-tag {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--zv-green-primary);
  margin-bottom: 8px;
  display: block;
  letter-spacing: 0.5px;
}

.zv-step-card h4 {
  font-size: 18px;
  font-weight: 800;
  color: var(--zv-green-primary);
  margin: 0 0 12px;
}

.zv-step-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--zv-text-muted);
  margin: 0;
}

/* ==========================================================================
   5. PRODUCT SPECIFICATIONS (Clean Modern Table)
   ========================================================================== */
.zv-specs-card {
  background: #FFFFFF;
  border: 1px solid var(--zv-border);
  border-radius: var(--zv-radius-md);
  overflow: hidden;
  box-shadow: var(--zv-shadow-subtle);
  max-width: 900px;
  margin: 0 auto;
}

.zv-specs-table {
  width: 100%;
  border-collapse: collapse;
}

.zv-specs-row {
  display: flex;
  border-bottom: 1px solid var(--zv-border-light);
}

.zv-specs-row:last-child {
  border-bottom: none;
}

.zv-specs-row:nth-child(even) {
  background: #FAFCFA;
}

.zv-specs-label {
  width: 38%;
  padding: 16px 24px;
  font-size: 14px;
  font-weight: 700;
  color: var(--zv-green-primary);
  border-right: 1px solid var(--zv-border-light);
  box-sizing: border-box;
}

.zv-specs-value {
  width: 62%;
  padding: 16px 24px;
  font-size: 14px;
  color: var(--zv-text-main);
  line-height: 1.5;
  box-sizing: border-box;
}

/* ==========================================================================
   6. PRODUCT COMPARISON (DTC Highlight Table)
   ========================================================================== */
.zv-comp-table-wrap {
  max-width: 960px;
  margin: 0 auto;
  border: 1px solid var(--zv-border);
  border-radius: var(--zv-radius-md);
  overflow: hidden;
  box-shadow: var(--zv-shadow-subtle);
  background: #FFFFFF;
}

.zv-comp-table {
  width: 100%;
  border-collapse: collapse;
}

.zv-comp-table th {
  padding: 20px 24px;
  text-align: left;
  font-size: 15px;
  font-weight: 800;
}

.zv-comp-table th.zv-target-col {
  background: var(--zv-green-primary);
  color: #FFFFFF;
}

.zv-comp-table th.zv-comp-col {
  background: #F4F6F4;
  color: #64748B;
}

.zv-comp-table td {
  padding: 16px 24px;
  font-size: 14px;
  border-bottom: 1px solid var(--zv-border-light);
}

.zv-comp-table tr:last-child td {
  border-bottom: none;
}

.zv-comp-table td.zv-target-cell {
  background: #F7FAF8;
  font-weight: 700;
  color: var(--zv-green-primary);
}

.zv-comp-table td.zv-comp-cell {
  background: #FFFFFF;
  color: #64748B;
}

/* ==========================================================================
   7. WHAT'S INCLUDED (Package Checklist)
   ========================================================================== */
.zv-included-card {
  background: #FFFFFF;
  border: 1px solid var(--zv-border);
  border-radius: var(--zv-radius-lg);
  padding: 52px;
  box-shadow: var(--zv-shadow-subtle);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
}

.zv-included-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.zv-included-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--zv-green-primary);
}

.zv-inc-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #EEF5F2;
  color: var(--zv-green-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.zv-included-media img {
  width: 100%;
  max-height: 380px;
  object-fit: cover;
  border-radius: var(--zv-radius-md);
}

/* ==========================================================================
   8. EXTENDED PRODUCT FAQ
   ========================================================================== */
.zv-faq-accordion {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.zv-faq-item {
  background: #FFFFFF;
  border: 1px solid var(--zv-border);
  border-radius: var(--zv-radius-sm);
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.zv-faq-question {
  width: 100%;
  padding: 20px 24px;
  text-align: left;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 700;
  color: var(--zv-green-primary);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.zv-faq-answer {
  padding: 0 24px 20px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--zv-text-muted);
  display: none;
}

.zv-faq-item.active .zv-faq-answer {
  display: block;
}

/* ==========================================================================
   9. DESCRIPTION FALLBACK (For non-normalized products)
   ========================================================================== */
.zv-fallback-description-container {
  max-width: 960px;
}

.zv-rte-content {
  font-size: 16px;
  line-height: 1.7;
  color: var(--zv-text-main);
}

.zv-rte-content p {
  margin: 0 0 20px;
}

.zv-rte-content img {
  max-width: 100%;
  height: auto;
  border-radius: var(--zv-radius-md);
  margin: 24px auto;
  display: block;
}

.zv-rte-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  overflow-x: auto;
  display: block;
}

.zv-rte-content th,
.zv-rte-content td {
  border: 1px solid var(--zv-border-light);
  padding: 12px 16px;
  text-align: left;
}

.zv-rte-content ul,
.zv-rte-content ol {
  padding-left: 24px;
  margin-bottom: 20px;
}

.zv-rte-content li {
  margin-bottom: 8px;
}

/* ==========================================================================
   RESPONSIVE DESIGN (TABLET & MOBILE)
   ========================================================================== */
@media (max-width: 992px) {
  .zv-body-section { padding: 60px 0; }
  .zv-value-prop-card { grid-template-columns: 1fr; gap: 36px; padding: 40px; }
  .zv-story-row { grid-template-columns: 1fr; gap: 36px; }
  .zv-story-row.zv-reverse { direction: ltr; }
  .zv-included-card { grid-template-columns: 1fr; padding: 32px; }
  .zv-features-grid, .zv-steps-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .zv-body-section { padding: 48px 0; }
  .zv-container { padding: 0 16px; }
  .zv-section-title { font-size: 26px; }
  .zv-section-subtitle { font-size: 14px; }
  .zv-value-prop-card { padding: 24px; border-radius: var(--zv-radius-md); }
  .zv-value-prop-content h2 { font-size: 24px; }
  .zv-features-grid, .zv-steps-grid { grid-template-columns: 1fr; gap: 16px; }
  .zv-feature-card, .zv-step-card { padding: 24px 20px; }
  .zv-story-content h3 { font-size: 22px; }
  .zv-story-row { margin-bottom: 48px; }
  .zv-specs-row { flex-direction: column; }
  .zv-specs-label { width: 100%; border-right: none; border-bottom: 1px solid var(--zv-border-light); padding: 12px 16px; }
  .zv-specs-value { width: 100%; padding: 12px 16px; }
  .zv-included-card { padding: 24px 16px; }
  .zv-comp-table th, .zv-comp-table td { padding: 12px 14px; font-size: 13px; }
  .zv-comp-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .zv-comp-table { min-width: 520px; }
}
`;

// ============================================================================
// 2. SNIPPET: snippets/zavelyn-pdp-data.liquid
// Controlled Content Normalization & Fallback Lookup for Draft Preview
// Prioritizes product.metafields.custom_pdp, then normalized dataset.
// ============================================================================
const normalizedJson = JSON.parse(fs.readFileSync('scripts/normalized_catalog_dryrun.json', 'utf8'));

let liquidCases = '';
for (const p of normalizedJson) {
  liquidCases += `\n    {% when '${p.handle}' %}\n`;
  liquidCases += `      {%- assign zv_data_found = true -%}\n`;

  // Value Prop
  if (p.extracted_structured_content.value_proposition) {
    const vp = p.extracted_structured_content.value_proposition;
    liquidCases += `      {%- assign zv_vp_badge = ${JSON.stringify(vp.badge)} -%}\n`;
    liquidCases += `      {%- assign zv_vp_title = ${JSON.stringify(vp.title)} -%}\n`;
    liquidCases += `      {%- assign zv_vp_sub = ${JSON.stringify(vp.subtitle)} -%}\n`;
    liquidCases += `      {%- assign zv_vp_img = ${JSON.stringify(vp.image)} -%}\n`;
    liquidCases += `      {%- assign zv_vp_b0 = ${JSON.stringify(vp.benefit_1 || "Engineered for Daily Reliability")} -%}\n`;
    liquidCases += `      {%- assign zv_vp_b1 = ${JSON.stringify(vp.benefit_2 || "Tested & Certified Standards")} -%}\n`;
    liquidCases += `      {%- assign zv_vp_b2 = ${JSON.stringify(vp.benefit_3 || "Direct US Express Fulfillment")} -%}\n`;
  }

  // Key Features
  if (p.extracted_structured_content.key_features) {
    const kf = p.extracted_structured_content.key_features;
    liquidCases += `      {%- assign zv_kf_count = ${kf.length} -%}\n`;
    kf.forEach((f, idx) => {
      liquidCases += `      {%- assign zv_kf_${idx}_icon = ${JSON.stringify(f.icon)} -%}\n`;
      liquidCases += `      {%- assign zv_kf_${idx}_title = ${JSON.stringify(f.title)} -%}\n`;
      liquidCases += `      {%- assign zv_kf_${idx}_desc = ${JSON.stringify(f.description)} -%}\n`;
    });
  }

  // Storytelling
  if (p.extracted_structured_content.storytelling) {
    const st = p.extracted_structured_content.storytelling;
    liquidCases += `      {%- assign zv_st_count = ${st.length} -%}\n`;
    st.forEach((s, idx) => {
      liquidCases += `      {%- assign zv_st_${idx}_badge = ${JSON.stringify(s.badge)} -%}\n`;
      liquidCases += `      {%- assign zv_st_${idx}_title = ${JSON.stringify(s.title)} -%}\n`;
      liquidCases += `      {%- assign zv_st_${idx}_desc = ${JSON.stringify(s.description)} -%}\n`;
      liquidCases += `      {%- assign zv_st_${idx}_img = ${JSON.stringify(s.image)} -%}\n`;
    });
  }

  // How It Works / Modes
  if (p.extracted_structured_content.how_it_works) {
    const hw = p.extracted_structured_content.how_it_works;
    liquidCases += `      {%- assign zv_hw_title = ${JSON.stringify(hw.title)} -%}\n`;
    liquidCases += `      {%- assign zv_hw_sub = ${JSON.stringify(hw.subtitle)} -%}\n`;
    liquidCases += `      {%- assign zv_hw_count = ${hw.steps.length} -%}\n`;
    hw.steps.forEach((s, idx) => {
      liquidCases += `      {%- assign zv_hw_${idx}_tag = ${JSON.stringify(s.tag)} -%}\n`;
      liquidCases += `      {%- assign zv_hw_${idx}_title = ${JSON.stringify(s.title)} -%}\n`;
      liquidCases += `      {%- assign zv_hw_${idx}_desc = ${JSON.stringify(s.description)} -%}\n`;
    });
  }

  // Specifications
  if (p.extracted_structured_content.specifications && p.extracted_structured_content.specifications.length > 0) {
    const sp = p.extracted_structured_content.specifications;
    liquidCases += `      {%- assign zv_sp_count = ${sp.length} -%}\n`;
    sp.forEach((s, idx) => {
      liquidCases += `      {%- assign zv_sp_${idx}_label = ${JSON.stringify(s.label)} -%}\n`;
      liquidCases += `      {%- assign zv_sp_${idx}_val = ${JSON.stringify(s.value)} -%}\n`;
    });
  }

  // Comparison
  if (p.extracted_structured_content.comparison) {
    const cp = p.extracted_structured_content.comparison;
    liquidCases += `      {%- assign zv_cp_title = ${JSON.stringify(cp.title)} -%}\n`;
    liquidCases += `      {%- assign zv_cp_sub = ${JSON.stringify(cp.subtitle)} -%}\n`;
    liquidCases += `      {%- assign zv_cp_target = ${JSON.stringify(cp.target_label)} -%}\n`;
    liquidCases += `      {%- assign zv_cp_comp = ${JSON.stringify(cp.competitor_label)} -%}\n`;
    liquidCases += `      {%- assign zv_cp_count = ${cp.rows.length} -%}\n`;
    cp.rows.forEach((r, idx) => {
      liquidCases += `      {%- assign zv_cp_${idx}_feat = ${JSON.stringify(r.feature)} -%}\n`;
      liquidCases += `      {%- assign zv_cp_${idx}_tval = ${JSON.stringify(r.target_value)} -%}\n`;
      liquidCases += `      {%- assign zv_cp_${idx}_cval = ${JSON.stringify(r.competitor_value)} -%}\n`;
      liquidCases += `      {%- assign zv_cp_${idx}_pos = ${r.is_positive} -%}\n`;
    });
  }

  // What's Included
  if (p.extracted_structured_content.whats_included) {
    const wi = p.extracted_structured_content.whats_included;
    liquidCases += `      {%- assign zv_wi_title = ${JSON.stringify(wi.title)} -%}\n`;
    liquidCases += `      {%- assign zv_wi_img = ${JSON.stringify(wi.image)} -%}\n`;
    liquidCases += `      {%- assign zv_wi_count = ${wi.items.length} -%}\n`;
    wi.items.forEach((item, idx) => {
      liquidCases += `      {%- assign zv_wi_${idx}_item = ${JSON.stringify(item)} -%}\n`;
    });
  }

  // Extended FAQ
  if (p.extracted_structured_content.extended_faq) {
    const fq = p.extracted_structured_content.extended_faq;
    liquidCases += `      {%- assign zv_faq_title = ${JSON.stringify(fq.title)} -%}\n`;
    liquidCases += `      {%- assign zv_faq_count = ${fq.items.length} -%}\n`;
    fq.items.forEach((item, idx) => {
      liquidCases += `      {%- assign zv_faq_${idx}_q = ${JSON.stringify(item.q)} -%}\n`;
      liquidCases += `      {%- assign zv_faq_${idx}_a = ${JSON.stringify(item.a)} -%}\n`;
    });
  }
}

const pdpDataSnippet = `{%- comment -%}
  Zavelyn Universal PDP Data Provider Snippet
  Controlled Content Normalization & Fallback Lookup for Draft Preview
  Checks custom_pdp metafields first, falls back to normalized catalog lookup.
{%- endcomment -%}
{%- assign zv_data_found = false -%}

{%- case product.handle -%}${liquidCases}
{%- endcase -%}
`;

// ============================================================================
// 3. SECTION 1: zavelyn-pdp-value-prop.liquid
// ============================================================================
const pdpValuePropLiquid = `{% schema %}
{
  "name": "Zavelyn Value Prop",
  "settings": [],
  "presets": [{ "name": "Zavelyn Value Prop" }]
}
{% endschema %}

{%- include 'zavelyn-pdp-data' -%}

{%- if zv_vp_title != blank -%}
<section class="zv-body-section zv-bg-warm" id="zv-value-prop">
  <div class="zv-container">
    <div class="zv-value-prop-card">
      <div class="zv-value-prop-content">
        <span class="zv-badge zv-badge-lime">{{ zv_vp_badge | default: 'OFFICIAL INNOVATION' }}</span>
        <h2>{{ zv_vp_title }}</h2>
        <p>{{ zv_vp_sub }}</p>
        <div class="zv-value-prop-highlights">
          {%- if zv_vp_b0 != blank -%}
            <div class="zv-vp-highlight-item"><span class="zv-vp-check">✓</span> {{ zv_vp_b0 }}</div>
          {%- endif -%}
          {%- if zv_vp_b1 != blank -%}
            <div class="zv-vp-highlight-item"><span class="zv-vp-check">✓</span> {{ zv_vp_b1 }}</div>
          {%- endif -%}
          {%- if zv_vp_b2 != blank -%}
            <div class="zv-vp-highlight-item"><span class="zv-vp-check">✓</span> {{ zv_vp_b2 }}</div>
          {%- endif -%}
        </div>
      </div>
      {%- if zv_vp_img != blank -%}
      <div class="zv-value-prop-media">
        <img src="{{ zv_vp_img }}" alt="{{ zv_vp_title }}" loading="lazy">
      </div>
      {%- endif -%}
    </div>
  </div>
</section>
{%- endif -%}
`;

// ============================================================================
// 4. SECTION 2: zavelyn-pdp-features.liquid
// ============================================================================
const pdpFeaturesLiquid = `{% schema %}
{
  "name": "Zavelyn Features",
  "settings": [],
  "presets": [{ "name": "Zavelyn Features" }]
}
{% endschema %}

{%- include 'zavelyn-pdp-data' -%}

{%- if zv_kf_count > 0 -%}
<section class="zv-body-section zv-bg-white" id="zv-features">
  <div class="zv-container">
    <div class="zv-section-header">
      <span class="zv-badge">CORE CAPABILITIES</span>
      <h2 class="zv-section-title">Engineered Without Compromise</h2>
      <p class="zv-section-subtitle">Every detail is designed to solve real problems with industrial durability and effortless usability.</p>
    </div>

    <div class="zv-features-grid">
      {%- if zv_kf_0_title != blank -%}
      <div class="zv-feature-card">
        <div class="zv-feature-icon-box">{{ zv_kf_0_icon | default: '⚡' }}</div>
        <h3>{{ zv_kf_0_title }}</h3>
        <p>{{ zv_kf_0_desc }}</p>
      </div>
      {%- endif -%}

      {%- if zv_kf_1_title != blank -%}
      <div class="zv-feature-card">
        <div class="zv-feature-icon-box">{{ zv_kf_1_icon | default: '🛡️' }}</div>
        <h3>{{ zv_kf_1_title }}</h3>
        <p>{{ zv_kf_1_desc }}</p>
      </div>
      {%- endif -%}

      {%- if zv_kf_2_title != blank -%}
      <div class="zv-feature-card">
        <div class="zv-feature-icon-box">{{ zv_kf_2_icon | default: '🔧' }}</div>
        <h3>{{ zv_kf_2_title }}</h3>
        <p>{{ zv_kf_2_desc }}</p>
      </div>
      {%- endif -%}
    </div>
  </div>
</section>
{%- endif -%}
`;

// ============================================================================
// 5. SECTION 3: zavelyn-pdp-storytelling.liquid
// Alternating Z-pattern, mobile image first
// ============================================================================
const pdpStorytellingLiquid = `{% schema %}
{
  "name": "Zavelyn Storytelling",
  "settings": [],
  "presets": [{ "name": "Zavelyn Storytelling" }]
}
{% endschema %}

{%- include 'zavelyn-pdp-data' -%}

{%- if zv_st_count > 0 -%}
<section class="zv-body-section zv-bg-subtle" id="zv-storytelling">
  <div class="zv-container">
    <div class="zv-section-header">
      <span class="zv-badge">DEEP DIVE</span>
      <h2 class="zv-section-title">Designed for Real-World Performance</h2>
      <p class="zv-section-subtitle">Explore the technical engineering that puts {{ product.title }} in a league of its own.</p>
    </div>

    {%- for i in (0..4) -%}
      {%- case i -%}
        {%- when 0 -%}
          {%- assign st_b = zv_st_0_badge -%}{%- assign st_t = zv_st_0_title -%}{%- assign st_d = zv_st_0_desc -%}{%- assign st_img = zv_st_0_img -%}
        {%- when 1 -%}
          {%- assign st_b = zv_st_1_badge -%}{%- assign st_t = zv_st_1_title -%}{%- assign st_d = zv_st_1_desc -%}{%- assign st_img = zv_st_1_img -%}
        {%- when 2 -%}
          {%- assign st_b = zv_st_2_badge -%}{%- assign st_t = zv_st_2_title -%}{%- assign st_d = zv_st_2_desc -%}{%- assign st_img = zv_st_2_img -%}
        {%- when 3 -%}
          {%- assign st_b = zv_st_3_badge -%}{%- assign st_t = zv_st_3_title -%}{%- assign st_d = zv_st_3_desc -%}{%- assign st_img = zv_st_3_img -%}
        {%- when 4 -%}
          {%- assign st_b = zv_st_4_badge -%}{%- assign st_t = zv_st_4_title -%}{%- assign st_d = zv_st_4_desc -%}{%- assign st_img = zv_st_4_img -%}
      {%- endcase -%}

      {%- if st_t != blank -%}
        {%- assign is_even = forloop.index | modulo: 2 -%}
        <div class="zv-story-row {% if is_even == 0 %}zv-reverse{% endif %}">
          <div class="zv-story-media">
            {%- if st_img != blank -%}
              <img src="{{ st_img }}" alt="{{ st_t }}" loading="lazy">
            {%- else -%}
              <img src="{{ product.featured_image | img_url: '800x' }}" alt="{{ st_t }}" loading="lazy">
            {%- endif -%}
          </div>
          <div class="zv-story-content">
            <span class="zv-badge">{{ st_b | default: 'INNOVATION' }}</span>
            <h3>{{ st_t }}</h3>
            <p>{{ st_d }}</p>
          </div>
        </div>
      {%- endif -%}
    {%- endfor -%}
  </div>
</section>
{%- endif -%}
`;

// ============================================================================
// 6. SECTION 4: zavelyn-pdp-steps.liquid (How It Works / Modes)
// ============================================================================
const pdpStepsLiquid = `{% schema %}
{
  "name": "Zavelyn How It Works",
  "settings": [],
  "presets": [{ "name": "Zavelyn How It Works" }]
}
{% endschema %}

{%- include 'zavelyn-pdp-data' -%}

{%- if zv_hw_count > 0 -%}
<section class="zv-body-section zv-bg-white" id="zv-how-it-works">
  <div class="zv-container">
    <div class="zv-section-header">
      <span class="zv-badge">SIMPLE OPERATION</span>
      <h2 class="zv-section-title">{{ zv_hw_title | default: 'How It Works' }}</h2>
      <p class="zv-section-subtitle">{{ zv_hw_sub | default: 'Intuitively designed for instant setup and effortless daily use.' }}</p>
    </div>

    <div class="zv-steps-grid">
      {%- for i in (0..5) -%}
        {%- case i -%}
          {%- when 0 -%}
            {%- assign hw_tag = zv_hw_0_tag -%}{%- assign hw_title = zv_hw_0_title -%}{%- assign hw_desc = zv_hw_0_desc -%}
          {%- when 1 -%}
            {%- assign hw_tag = zv_hw_1_tag -%}{%- assign hw_title = zv_hw_1_title -%}{%- assign hw_desc = zv_hw_1_desc -%}
          {%- when 2 -%}
            {%- assign hw_tag = zv_hw_2_tag -%}{%- assign hw_title = zv_hw_2_title -%}{%- assign hw_desc = zv_hw_2_desc -%}
          {%- when 3 -%}
            {%- assign hw_tag = zv_hw_3_tag -%}{%- assign hw_title = zv_hw_3_title -%}{%- assign hw_desc = zv_hw_3_desc -%}
          {%- when 4 -%}
            {%- assign hw_tag = zv_hw_4_tag -%}{%- assign hw_title = zv_hw_4_title -%}{%- assign hw_desc = zv_hw_4_desc -%}
          {%- when 5 -%}
            {%- assign hw_tag = zv_hw_5_tag -%}{%- assign hw_title = zv_hw_5_title -%}{%- assign hw_desc = zv_hw_5_desc -%}
        {%- endcase -%}

        {%- if hw_title != blank -%}
        <div class="zv-step-card">
          <span class="zv-step-tag">{{ hw_tag | default: 'STEP 0' | append: forloop.index }}</span>
          <h4>{{ hw_title }}</h4>
          <p>{{ hw_desc }}</p>
        </div>
        {%- endif -%}
      {%- endfor -%}
    </div>
  </div>
</section>
{%- endif -%}
`;

// ============================================================================
// 7. SECTION 5: zavelyn-pdp-specs.liquid (Product Specifications)
// ============================================================================
const pdpSpecsLiquid = `{% schema %}
{
  "name": "Zavelyn Specs",
  "settings": [],
  "presets": [{ "name": "Zavelyn Specs" }]
}
{% endschema %}

{%- include 'zavelyn-pdp-data' -%}

{%- if zv_sp_count > 0 -%}
<section class="zv-body-section zv-bg-white" id="zv-specs">
  <div class="zv-container">
    <div class="zv-section-header">
      <span class="zv-badge">TECHNICAL DATA</span>
      <h2 class="zv-section-title">Product Specifications</h2>
      <p class="zv-section-subtitle">Verified dimensions, materials, and engineering tolerances.</p>
    </div>

    <div class="zv-specs-card">
      <div class="zv-specs-table">
        {%- for i in (0..11) -%}
          {%- case i -%}
            {%- when 0 -%}{%- assign sp_l = zv_sp_0_label -%}{%- assign sp_v = zv_sp_0_val -%}
            {%- when 1 -%}{%- assign sp_l = zv_sp_1_label -%}{%- assign sp_v = zv_sp_1_val -%}
            {%- when 2 -%}{%- assign sp_l = zv_sp_2_label -%}{%- assign sp_v = zv_sp_2_val -%}
            {%- when 3 -%}{%- assign sp_l = zv_sp_3_label -%}{%- assign sp_v = zv_sp_3_val -%}
            {%- when 4 -%}{%- assign sp_l = zv_sp_4_label -%}{%- assign sp_v = zv_sp_4_val -%}
            {%- when 5 -%}{%- assign sp_l = zv_sp_5_label -%}{%- assign sp_v = zv_sp_5_val -%}
            {%- when 6 -%}{%- assign sp_l = zv_sp_6_label -%}{%- assign sp_v = zv_sp_6_val -%}
            {%- when 7 -%}{%- assign sp_l = zv_sp_7_label -%}{%- assign sp_v = zv_sp_7_val -%}
            {%- when 8 -%}{%- assign sp_l = zv_sp_8_label -%}{%- assign sp_v = zv_sp_8_val -%}
            {%- when 9 -%}{%- assign sp_l = zv_sp_9_label -%}{%- assign sp_v = zv_sp_9_val -%}
            {%- when 10 -%}{%- assign sp_l = zv_sp_10_label -%}{%- assign sp_v = zv_sp_10_val -%}
            {%- when 11 -%}{%- assign sp_l = zv_sp_11_label -%}{%- assign sp_v = zv_sp_11_val -%}
          {%- endcase -%}

          {%- if sp_l != blank and sp_v != blank -%}
          <div class="zv-specs-row">
            <div class="zv-specs-label">{{ sp_l }}</div>
            <div class="zv-specs-value">{{ sp_v }}</div>
          </div>
          {%- endif -%}
        {%- endfor -%}
      </div>
    </div>
  </div>
</section>
{%- endif -%}
`;

// ============================================================================
// 8. SECTION 6: zavelyn-pdp-comparison.liquid (Comparison Table)
// Auto-hides if empty!
// ============================================================================
const pdpComparisonLiquid = `{% schema %}
{
  "name": "Zavelyn Comparison",
  "settings": [],
  "presets": [{ "name": "Zavelyn Comparison" }]
}
{% endschema %}

{%- include 'zavelyn-pdp-data' -%}

{%- if zv_cp_count > 0 -%}
<section class="zv-body-section zv-bg-warm" id="zv-comparison">
  <div class="zv-container">
    <div class="zv-section-header">
      <span class="zv-badge">THE ZAVELYN ADVANTAGE</span>
      <h2 class="zv-section-title">{{ zv_cp_title | default: 'How We Compare' }}</h2>
      <p class="zv-section-subtitle">{{ zv_cp_sub | default: 'See why thousands of customers choose Zavelyn over traditional alternatives.' }}</p>
    </div>

    <div class="zv-comp-table-wrap">
      <table class="zv-comp-table">
        <thead>
          <tr>
            <th style="width: 40%; background: #FFFFFF; color: #17433C;">Feature / Capability</th>
            <th class="zv-target-col" style="width: 32%;">{{ zv_cp_target | default: 'Zavelyn' }}</th>
            <th class="zv-comp-col" style="width: 28%;">{{ zv_cp_comp | default: 'Traditional Alternative' }}</th>
          </tr>
        </thead>
        <tbody>
          {%- for i in (0..7) -%}
            {%- case i -%}
              {%- when 0 -%}{%- assign feat = zv_cp_0_feat -%}{%- assign tval = zv_cp_0_tval -%}{%- assign cval = zv_cp_0_cval -%}
              {%- when 1 -%}{%- assign feat = zv_cp_1_feat -%}{%- assign tval = zv_cp_1_tval -%}{%- assign cval = zv_cp_1_cval -%}
              {%- when 2 -%}{%- assign feat = zv_cp_2_feat -%}{%- assign tval = zv_cp_2_tval -%}{%- assign cval = zv_cp_2_cval -%}
              {%- when 3 -%}{%- assign feat = zv_cp_3_feat -%}{%- assign tval = zv_cp_3_tval -%}{%- assign cval = zv_cp_3_cval -%}
              {%- when 4 -%}{%- assign feat = zv_cp_4_feat -%}{%- assign tval = zv_cp_4_tval -%}{%- assign cval = zv_cp_4_cval -%}
              {%- when 5 -%}{%- assign feat = zv_cp_5_feat -%}{%- assign tval = zv_cp_5_tval -%}{%- assign cval = zv_cp_5_cval -%}
              {%- when 6 -%}{%- assign feat = zv_cp_6_feat -%}{%- assign tval = zv_cp_6_tval -%}{%- assign cval = zv_cp_6_cval -%}
              {%- when 7 -%}{%- assign feat = zv_cp_7_feat -%}{%- assign tval = zv_cp_7_tval -%}{%- assign cval = zv_cp_7_cval -%}
            {%- endcase -%}

            {%- if feat != blank -%}
            <tr>
              <td style="font-weight: 600; color: #17433C;">{{ feat }}</td>
              <td class="zv-target-cell"><span style="color: #17433C; margin-right: 6px;">✓</span> {{ tval }}</td>
              <td class="zv-comp-cell"><span style="color: #94A3B8; margin-right: 6px;">✕</span> {{ cval }}</td>
            </tr>
            {%- endif -%}
          {%- endfor -%}
        </tbody>
      </table>
    </div>
  </div>
</section>
{%- endif -%}
`;

// ============================================================================
// 9. SECTION 7: zavelyn-pdp-included.liquid (What's Included)
// ============================================================================
const pdpIncludedLiquid = `{% schema %}
{
  "name": "Zavelyn Whats Included",
  "settings": [],
  "presets": [{ "name": "Zavelyn Whats Included" }]
}
{% endschema %}

{%- include 'zavelyn-pdp-data' -%}

{%- if zv_wi_count > 0 -%}
<section class="zv-body-section zv-bg-subtle" id="zv-included">
  <div class="zv-container">
    <div class="zv-included-card">
      <div class="zv-included-content">
        <span class="zv-badge">COMPLETE PACKAGE</span>
        <h2 style="font-size: 32px; font-weight: 800; color: #17433C; margin: 0 0 16px;">{{ zv_wi_title | default: "What's in the Box" }}</h2>
        <p style="font-size: 15px; color: #556860; margin: 0 0 28px;">Everything you need to begin immediately, backed by our comprehensive warranty and dedicated customer support.</p>
        
        <ul class="zv-included-list">
          {%- for i in (0..7) -%}
            {%- case i -%}
              {%- when 0 -%}{%- assign inc_item = zv_wi_0_item -%}
              {%- when 1 -%}{%- assign inc_item = zv_wi_1_item -%}
              {%- when 2 -%}{%- assign inc_item = zv_wi_2_item -%}
              {%- when 3 -%}{%- assign inc_item = zv_wi_3_item -%}
              {%- when 4 -%}{%- assign inc_item = zv_wi_4_item -%}
              {%- when 5 -%}{%- assign inc_item = zv_wi_5_item -%}
              {%- when 6 -%}{%- assign inc_item = zv_wi_6_item -%}
              {%- when 7 -%}{%- assign inc_item = zv_wi_7_item -%}
            {%- endcase -%}

            {%- if inc_item != blank -%}
            <li class="zv-included-item">
              <span class="zv-inc-check">✓</span>
              <span>{{ inc_item }}</span>
            </li>
            {%- endif -%}
          {%- endfor -%}
        </ul>
      </div>

      {%- if zv_wi_img != blank -%}
      <div class="zv-included-media">
        <img src="{{ zv_wi_img }}" alt="{{ zv_wi_title }}" loading="lazy">
      </div>
      {%- endif -%}
    </div>
  </div>
</section>
{%- endif -%}
`;

// ============================================================================
// 10. SECTION 8: zavelyn-pdp-faq.liquid (Extended FAQ)
// ============================================================================
const pdpFaqLiquid = `{% schema %}
{
  "name": "Zavelyn Extended FAQ",
  "settings": [],
  "presets": [{ "name": "Zavelyn Extended FAQ" }]
}
{% endschema %}

{%- include 'zavelyn-pdp-data' -%}

{%- if zv_faq_count > 0 -%}
<section class="zv-body-section zv-bg-white" id="zv-extended-faq">
  <div class="zv-container">
    <div class="zv-section-header">
      <span class="zv-badge">GOT QUESTIONS?</span>
      <h2 class="zv-section-title">{{ zv_faq_title | default: 'Frequently Asked Questions' }}</h2>
      <p class="zv-section-subtitle">Everything you need to know about {{ product.title }}.</p>
    </div>

    <div class="zv-faq-accordion">
      {%- for i in (0..5) -%}
        {%- case i -%}
          {%- when 0 -%}{%- assign fq_q = zv_faq_0_q -%}{%- assign fq_a = zv_faq_0_a -%}
          {%- when 1 -%}{%- assign fq_q = zv_faq_1_q -%}{%- assign fq_a = zv_faq_1_a -%}
          {%- when 2 -%}{%- assign fq_q = zv_faq_2_q -%}{%- assign fq_a = zv_faq_2_a -%}
          {%- when 3 -%}{%- assign fq_q = zv_faq_3_q -%}{%- assign fq_a = zv_faq_3_a -%}
          {%- when 4 -%}{%- assign fq_q = zv_faq_4_q -%}{%- assign fq_a = zv_faq_4_a -%}
          {%- when 5 -%}{%- assign fq_q = zv_faq_5_q -%}{%- assign fq_a = zv_faq_5_a -%}
        {%- endcase -%}

        {%- if fq_q != blank -%}
        <div class="zv-faq-item">
          <button type="button" class="zv-faq-question" onclick="this.parentElement.classList.toggle('active')">
            <span>{{ fq_q }}</span>
            <span class="zv-faq-icon">+</span>
          </button>
          <div class="zv-faq-answer">
            <p>{{ fq_a }}</p>
          </div>
        </div>
        {%- endif -%}
      {%- endfor -%}
    </div>
  </div>
</section>
{%- endif -%}
`;

// ============================================================================
// 11. SECTION 9: zavelyn-pdp-description-fallback.liquid
// Only renders when zv_data_found == false (No duplicate description)
// ============================================================================
const pdpFallbackLiquid = `{% schema %}
{
  "name": "Zavelyn PDP Fallback",
  "settings": [],
  "presets": [{ "name": "Zavelyn PDP Fallback" }]
}
{% endschema %}

{%- include 'zavelyn-pdp-data' -%}

{%- unless zv_data_found -%}
  {%- if product.description != blank -%}
    <section class="zv-body-section zv-bg-white" id="zv-product-description">
      <div class="zv-container zv-fallback-description-container">
        <div class="zv-section-header">
          <span class="zv-badge">PRODUCT OVERVIEW</span>
          <h2 class="zv-section-title">Product Details</h2>
        </div>
        <div class="zv-rte-content">
          {{ product.description }}
        </div>
      </div>
    </section>
  {%- endif -%}
{%- endunless -%}
`;

// ============================================================================
// 12. TEMPLATES/PRODUCT.JSON (Universal Template Order)
// ============================================================================
const productJsonV2 = {
  sections: {
    main: {
      type: "zavelyn-pdp-main",
      settings: {
        eyebrow_text: "ZAVELYN INNOVATIONS · INDUSTRIAL GRADE",
        urgency_text: "High US Demand · Limited Units Remaining at Clearance Pricing",
        cta_text: "CLAIM OFFER",
        enable_sticky_atc: true
      }
    },
    ticker: {
      type: "zavelyn-pdp-ticker",
      settings: {}
    },
    value_prop: {
      type: "zavelyn-pdp-value-prop",
      settings: {}
    },
    features: {
      type: "zavelyn-pdp-features",
      settings: {}
    },
    storytelling: {
      type: "zavelyn-pdp-storytelling",
      settings: {}
    },
    steps: {
      type: "zavelyn-pdp-steps",
      settings: {}
    },
    comparison: {
      type: "zavelyn-pdp-comparison",
      settings: {}
    },
    specs: {
      type: "zavelyn-pdp-specs",
      settings: {}
    },
    included: {
      type: "zavelyn-pdp-included",
      settings: {}
    },
    faq: {
      type: "zavelyn-pdp-faq",
      settings: {}
    },
    description_fallback: {
      type: "zavelyn-pdp-description-fallback",
      settings: {}
    },
    shipping: {
      type: "zavelyn-pdp-shipping",
      settings: {}
    }
  },
  order: [
    "main",
    "ticker",
    "value_prop",
    "features",
    "storytelling",
    "steps",
    "comparison",
    "specs",
    "included",
    "faq",
    "description_fallback",
    "shipping"
  ]
};

async function main() {
  console.log("======================================================");
  console.log("🚀 DEPLOYING POLISHED UNIVERSAL PDP V2 TO DRAFT THEME");
  console.log(`Target Draft Theme ID: ${DRAFT_THEME_ID}`);
  console.log(`Live Theme ID Protected: ${LIVE_THEME_ID}`);
  console.log("======================================================");

  const token = await getAccessToken();

  // 1. Upload CSS
  await uploadAsset(token, 'assets/zavelyn-pdp-body.css', bodyCss);

  // 2. Upload Data Snippet
  await uploadAsset(token, 'snippets/zavelyn-pdp-data.liquid', pdpDataSnippet);

  // 3. Upload Sections
  await uploadAsset(token, 'sections/zavelyn-pdp-value-prop.liquid', pdpValuePropLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-features.liquid', pdpFeaturesLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-storytelling.liquid', pdpStorytellingLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-steps.liquid', pdpStepsLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-specs.liquid', pdpSpecsLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-comparison.liquid', pdpComparisonLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-included.liquid', pdpIncludedLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-faq.liquid', pdpFaqLiquid);
  await uploadAsset(token, 'sections/zavelyn-pdp-description-fallback.liquid', pdpFallbackLiquid);

  // 4. Upload templates/product.json
  await uploadAsset(token, 'templates/product.json', JSON.stringify(productJsonV2, null, 2));

  console.log("======================================================");
  console.log("✔ ALL UNIVERSAL PDP V2 SECTIONS & ASSETS DEPLOYED TO DRAFT THEME!");
  console.log("======================================================");
}

main().catch(err => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
