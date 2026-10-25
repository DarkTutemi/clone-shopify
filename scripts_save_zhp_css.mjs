import fs from 'fs';

const cssContent = `
/* Scoped Zavelyn Handpans Styles */
.zhp-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1F2923;
  background-color: #FAF8F5;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.zhp-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Marquee Bar */
.zhp-marquee-bar {
  background-color: #2C4236;
  color: #FAF8F5;
  overflow: hidden;
  white-space: nowrap;
  padding: 10px 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.zhp-marquee-track {
  display: inline-flex;
  align-items: center;
  animation: zhp-marquee 35s linear infinite;
}
.zhp-marquee-item {
  padding: 0 16px;
  display: inline-block;
}
@keyframes zhp-marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Hero Section */
.zhp-hero {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  color: #FFFFFF;
  padding: 60px 0;
  background-color: #2C4236;
  overflow: hidden;
}
.zhp-hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.zhp-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.zhp-hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(31, 41, 35, 0.88) 0%, rgba(44, 66, 54, 0.75) 100%);
}
.zhp-hero-content {
  position: relative;
  z-index: 2;
  max-width: 680px;
}
.zhp-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 13px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
}
.zhp-stars {
  color: #FBBF24;
  letter-spacing: 2px;
}
.zhp-hero-title {
  font-size: 46px;
  line-height: 1.15;
  font-weight: 800;
  margin: 0 0 16px;
  color: #FFFFFF;
  letter-spacing: -0.5px;
}
.zhp-hero-subtitle {
  font-size: 17px;
  line-height: 1.6;
  color: #E2E8F0;
  margin: 0 0 24px;
}
.zhp-hero-trust-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
}
.zhp-trust-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.12);
  padding: 5px 12px;
  border-radius: 6px;
}
.zhp-trust-pill svg {
  width: 14px;
  height: 14px;
  color: #73C09C;
}
.zhp-hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* Buttons */
.zhp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 26px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}
.zhp-btn-primary {
  background-color: #73C09C;
  color: #1F2923;
}
.zhp-btn-primary:hover {
  background-color: #5FA886;
  color: #FFFFFF;
  transform: translateY(-1px);
}
.zhp-btn-outline {
  background-color: transparent;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.4);
}
.zhp-btn-outline:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #FFFFFF;
}
.zhp-btn-cart {
  background-color: #2C4236;
  color: #FFFFFF;
}
.zhp-btn-cart:hover {
  background-color: #1B2B22;
  color: #FFFFFF;
}
.zhp-btn-gold {
  background-color: #D97706;
  color: #FFFFFF;
}
.zhp-btn-gold:hover {
  background-color: #B45309;
}
.zhp-btn-block {
  width: 100%;
}
.zhp-btn-sm {
  padding: 8px 16px;
  font-size: 12px;
}

/* Press Bar */
.zhp-press-bar {
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  padding: 20px 0;
}
.zhp-press-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.zhp-press-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #6B7280;
  text-transform: uppercase;
}
.zhp-press-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 36px;
  flex-wrap: wrap;
}
.zhp-press-logos img {
  height: 24px;
  width: auto;
  opacity: 0.65;
  filter: grayscale(100%);
  transition: opacity 0.2s;
}
.zhp-press-logos img:hover {
  opacity: 1;
}
.zhp-press-text-logo {
  font-size: 15px;
  font-weight: 800;
  color: #6B7280;
  letter-spacing: 1px;
}

/* Section Common Header */
.zhp-section-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 40px;
}
.zhp-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #2C4236;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.zhp-section-title {
  font-size: 34px;
  font-weight: 800;
  color: #1F2923;
  margin: 0 0 12px;
  line-height: 1.2;
}
.zhp-section-subtitle {
  font-size: 16px;
  color: #4B5563;
  margin: 0;
  line-height: 1.6;
}

/* Product Cards Grid */
.zhp-bestsellers {
  padding: 70px 0;
}
.zhp-product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: stretch;
}
.zhp-product-card {
  background-color: #FFFFFF;
  border-radius: 14px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.zhp-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}
.zhp-card-featured {
  border: 2px solid #D97706;
}
.zhp-card-popular {
  border: 2px solid #73C09C;
}
.zhp-card-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.zhp-badge-gold {
  background-color: #D97706;
  color: #FFFFFF;
}
.zhp-badge-green {
  background-color: #2C4236;
  color: #FFFFFF;
}
.zhp-badge-blue {
  background-color: #2563EB;
  color: #FFFFFF;
}
.zhp-card-media {
  background-color: #F8FAF9;
  text-align: center;
  padding: 24px 20px 10px;
}
.zhp-card-img {
  max-width: 100%;
  height: 240px;
  object-fit: contain;
  transition: transform 0.3s;
}
.zhp-product-card:hover .zhp-card-img {
  transform: scale(1.04);
}
.zhp-card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.zhp-card-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.zhp-review-count {
  font-size: 12px;
  color: #6B7280;
  font-weight: 600;
}
.zhp-card-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 4px;
}
.zhp-card-title a {
  color: #1F2923;
  text-decoration: none;
}
.zhp-card-title a:hover {
  color: #2C4236;
}
.zhp-card-meta {
  font-size: 13px;
  font-weight: 600;
  color: #2C4236;
  margin-bottom: 14px;
}
.zhp-card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  font-size: 13px;
  color: #4B5563;
  line-height: 1.6;
}
.zhp-card-features li {
  margin-bottom: 4px;
}

/* Audio Player Component */
.zhp-audio-player {
  background: #F1F5F3;
  border-radius: 30px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  border: 1px solid #E2E8F0;
}
.zhp-audio-btn {
  background: #2C4236;
  color: #FFFFFF;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: transform 0.15s;
}
.zhp-audio-btn:hover {
  transform: scale(1.1);
}
.zhp-audio-btn svg {
  width: 14px;
  height: 14px;
}
.zhp-audio-info {
  flex-grow: 1;
}
.zhp-audio-label {
  display: block;
  font-size: 11px;
  color: #4B5563;
  margin-bottom: 3px;
}
.zhp-audio-bar {
  height: 4px;
  background: #CBD5E1;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}
.zhp-audio-progress {
  height: 100%;
  width: 0%;
  background: #2C4236;
  border-radius: 2px;
  transition: width 0.1s linear;
}

/* Package contents tags */
.zhp-card-package {
  background: #FAF8F5;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 16px;
  border: 1px dashed #D1D5DB;
}
.zhp-package-title {
  font-size: 11px;
  font-weight: 700;
  color: #2C4236;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.zhp-package-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.zhp-package-tags span {
  font-size: 11px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  padding: 2px 6px;
  color: #374151;
}

/* Pricing */
.zhp-card-pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: auto;
  margin-bottom: 14px;
}
.zhp-price-current {
  font-size: 24px;
  font-weight: 800;
  color: #1F2923;
}
.zhp-price-compare {
  font-size: 16px;
  color: #9CA3AF;
  text-decoration: line-through;
}
.zhp-price-save {
  font-size: 12px;
  font-weight: 700;
  color: #D97706;
  background: #FEF3C7;
  padding: 2px 6px;
  border-radius: 4px;
}
.zhp-card-guarantee {
  text-align: center;
  font-size: 11px;
  color: #6B7280;
  margin-top: 10px;
}

/* Interactive Model Switcher & Pillars */
.zhp-model-tabs-section {
  padding: 70px 0;
  background-color: #FFFFFF;
}
.zhp-tabs-nav {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}
.zhp-tab-btn {
  background: #FAF8F5;
  border: 1px solid #E5E7EB;
  border-radius: 30px;
  padding: 10px 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.zhp-tab-btn.active {
  background-color: #2C4236;
  border-color: #2C4236;
}
.zhp-tab-btn .zhp-tab-name {
  font-size: 15px;
  font-weight: 700;
  color: #1F2923;
}
.zhp-tab-btn.active .zhp-tab-name {
  color: #FFFFFF;
}
.zhp-tab-btn .zhp-tab-badge {
  font-size: 12px;
  color: #6B7280;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 12px;
}
.zhp-tab-btn.active .zhp-tab-badge {
  color: #73C09C;
  background: rgba(255, 255, 255, 0.15);
}
.zhp-tab-panel {
  display: none;
}
.zhp-tab-panel.active {
  display: block;
}
.zhp-tab-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  background: #FAF8F5;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 50px;
}
.zhp-tab-image-col img {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.zhp-tab-info-col h3 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 12px;
  color: #1F2923;
}
.zhp-tab-desc {
  font-size: 15px;
  color: #4B5563;
  margin: 0 0 20px;
  line-height: 1.6;
}
.zhp-specs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
.zhp-spec-item {
  font-size: 14px;
  line-height: 1.5;
}
.zhp-spec-item strong {
  color: #2C4236;
}
.zhp-spec-item span {
  color: #4B5563;
}

/* Feature Pillars Grid */
.zhp-pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.zhp-pillar-card {
  background: #FAF8F5;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  text-align: center;
}
.zhp-pillar-icon {
  margin-bottom: 14px;
}
.zhp-pillar-icon img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.zhp-pillar-card h4 {
  font-size: 16px;
  font-weight: 700;
  color: #1F2923;
  margin: 0 0 8px;
}
.zhp-pillar-card p {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
  margin: 0;
}

/* What You'll Get */
.zhp-what-you-get {
  padding: 70px 0;
  background-color: #FAF8F5;
}
.zhp-kit-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.zhp-kit-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #E5E7EB;
  text-align: center;
  position: relative;
}
.zhp-kit-media {
  margin-bottom: 16px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zhp-kit-media img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.zhp-kit-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2C4236;
  background: #DCFCE7;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 10px;
}
.zhp-kit-card h4 {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px;
  color: #1F2923;
}
.zhp-kit-card p {
  font-size: 13px;
  color: #6B7280;
  margin: 0;
  line-height: 1.5;
}

/* Endorsements */
.zhp-endorsements {
  padding: 70px 0;
  background-color: #FFFFFF;
}
.zhp-endorsements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.zhp-endorsement-card {
  background: #FAF8F5;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.zhp-endorser-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}
.zhp-endorser-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #73C09C;
}
.zhp-endorser-details h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1F2923;
}
.zhp-endorser-role {
  font-size: 12px;
  color: #4B5563;
}
.zhp-endorser-handle {
  font-size: 11px;
  color: #9CA3AF;
}
.zhp-endorsement-tag {
  display: inline-block;
  align-self: flex-start;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2C4236;
  background: rgba(44, 66, 54, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
}
.zhp-endorsement-quote {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  font-style: italic;
  margin: 0;
  flex-grow: 1;
}

/* Comparison Table */
.zhp-comparison-section {
  padding: 70px 0;
  background-color: #FAF8F5;
}
.zhp-table-responsive {
  overflow-x: auto;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  background: #FFFFFF;
}
.zhp-comparison-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  min-width: 680px;
}
.zhp-comparison-table th,
.zhp-comparison-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
  font-size: 14px;
}
.zhp-comparison-table th {
  background-color: #F8FAF9;
  vertical-align: top;
}
.zhp-col-feature,
.zhp-cell-feature {
  text-align: left;
  font-weight: 700;
  color: #1F2923;
  width: 25%;
}
.zhp-tbl-header-card {
  padding: 10px;
}
.zhp-tbl-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}
.zhp-tbl-header-card h4 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 4px;
  color: #1F2923;
}
.zhp-tbl-tones {
  font-size: 12px;
  color: #6B7280;
  margin-bottom: 6px;
}
.zhp-tbl-price {
  font-size: 18px;
  font-weight: 800;
  color: #2C4236;
}
.zhp-tbl-col-popular {
  background-color: #F0FDF4;
}
.zhp-tbl-col-best {
  background-color: #FFFBEB;
}
.zhp-tbl-actions-row td {
  padding: 20px;
}

/* Buyer's Guide */
.zhp-buyers-guide {
  padding: 70px 0;
  background-color: #FFFFFF;
}
.zhp-guide-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.zhp-guide-item {
  display: grid;
  grid-template-columns: 70px 1fr 340px;
  gap: 30px;
  background: #FAF8F5;
  border-radius: 14px;
  padding: 32px;
  border: 1px solid #E5E7EB;
  align-items: center;
}
.zhp-guide-number {
  font-size: 42px;
  font-weight: 900;
  color: #73C09C;
  line-height: 1;
}
.zhp-guide-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.zhp-badge-pill {
  font-size: 11px;
  font-weight: 700;
  background: #E2E8F0;
  color: #334155;
  padding: 2px 8px;
  border-radius: 4px;
}
.zhp-guide-content h3 {
  font-size: 22px;
  font-weight: 800;
  color: #1F2923;
  margin: 0 0 10px;
}
.zhp-guide-content p {
  font-size: 14px;
  line-height: 1.6;
  color: #4B5563;
  margin: 0 0 14px;
}
.zhp-guide-who {
  font-size: 13px;
  color: #2C4236;
  background: rgba(44, 66, 54, 0.06);
  padding: 8px 12px;
  border-radius: 6px;
  display: inline-block;
}
.zhp-guide-media img {
  width: 100%;
  height: 220px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

/* Customer Reviews */
.zhp-reviews-section {
  padding: 70px 0;
  background-color: #FAF8F5;
}
.zhp-reviews-summary {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  color: #4B5563;
}
.zhp-reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.zhp-review-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
}
.zhp-review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.zhp-verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #059669;
}
.zhp-verified-badge svg {
  width: 14px;
  height: 14px;
}
.zhp-review-title {
  font-size: 16px;
  font-weight: 700;
  color: #1F2923;
  margin: 0 0 10px;
}
.zhp-review-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4B5563;
  margin: 0 0 16px;
  flex-grow: 1;
}
.zhp-reviewer-info {
  font-size: 12px;
  color: #6B7280;
  border-top: 1px solid #F3F4F6;
  padding-top: 12px;
}

/* FAQ Accordion */
.zhp-faq-section {
  padding: 70px 0;
  background-color: #FFFFFF;
}
.zhp-faq-accordion {
  max-width: 800px;
  margin: 0 auto 50px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.zhp-faq-item {
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  overflow: hidden;
  background: #FAF8F5;
  transition: border-color 0.2s;
}
.zhp-faq-item.active {
  border-color: #73C09C;
  background: #FFFFFF;
}
.zhp-faq-question {
  width: 100%;
  padding: 18px 20px;
  background: none;
  border: none;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  color: #1F2923;
  cursor: pointer;
}
.zhp-faq-icon {
  font-size: 22px;
  color: #2C4236;
  font-weight: 400;
  transition: transform 0.2s;
}
.zhp-faq-item.active .zhp-faq-icon {
  transform: rotate(45deg);
}
.zhp-faq-answer {
  display: none;
  padding: 0 20px 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #4B5563;
}
.zhp-faq-item.active .zhp-faq-answer {
  display: block;
}
.zhp-faq-answer ul {
  padding-left: 20px;
  margin: 8px 0;
}
.zhp-faq-answer li {
  margin-bottom: 4px;
}

/* Guarantee Card */
.zhp-guarantee-card {
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #2C4236 0%, #1F2923 100%);
  color: #FFFFFF;
  border-radius: 14px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.zhp-guarantee-icon {
  font-size: 48px;
  flex-shrink: 0;
}
.zhp-guarantee-text h3 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 8px;
  color: #FFFFFF;
}
.zhp-guarantee-text p {
  font-size: 14px;
  color: #D1D5DB;
  line-height: 1.6;
  margin: 0;
}

/* Responsive Media Queries */
@media (max-width: 991px) {
  .zhp-product-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
  .zhp-tab-grid {
    grid-template-columns: 1fr;
  }
  .zhp-pillars-grid,
  .zhp-kit-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .zhp-endorsements-grid,
  .zhp-reviews-grid {
    grid-template-columns: 1fr;
  }
  .zhp-guide-item {
    grid-template-columns: 1fr;
    text-align: left;
  }
  .zhp-guide-media img {
    height: auto;
    max-height: 280px;
  }
}

@media (max-width: 640px) {
  .zhp-hero-title {
    font-size: 32px;
  }
  .zhp-section-title {
    font-size: 26px;
  }
  .zhp-pillars-grid,
  .zhp-kit-grid {
    grid-template-columns: 1fr;
  }
  .zhp-guarantee-card {
    flex-direction: column;
    text-align: center;
  }
}
`;

fs.writeFileSync('Clone-pandadrum/zhp-collection.css', cssContent, 'utf8');
console.log('Saved zhp-collection.css');
