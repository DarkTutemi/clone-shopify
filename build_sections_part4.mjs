import fs from 'fs';
import path from 'path';

const SECTIONS_DIR = 'h:/Shopify-Clone/Clone-earthlyderm/sections';

// 8. earthly-about-us.liquid
const rawAbout = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/sec_template--19526977814662__section_image_with_text_NRBaL6.html', 'utf8');
const aboutClean = `
{% schema %}
{
  "name": "Earthly About Us",
  "settings": []
}
{% endschema %}

${rawAbout.replace(/id=['"]shopify-section-[^'"]*['"]/g, 'class="earthly-about-wrapper"')}
`;
fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-about-us.liquid'), aboutClean.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-about-us.liquid');

// 9. earthly-faqs.liquid
const rawFaqs = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/sec_template--19526977814662__pdp_faqs_section_3tWAzC.html', 'utf8');
const faqsClean = `
{% schema %}
{
  "name": "Earthly FAQs",
  "settings": []
}
{% endschema %}

${rawFaqs.replace(/id=['"]shopify-section-[^'"]*['"]/g, 'class="earthly-faqs-wrapper"')}

<script>
document.addEventListener('DOMContentLoaded', function() {
  var thumbs = document.querySelectorAll('.vs-earthly-pdp-faq-item-thumb');
  thumbs.forEach(function(th) {
    th.addEventListener('click', function() {
      var item = this.closest('.vs-earthly-pdp-faq-item');
      item.classList.toggle('active');
    });
  });
});
</script>
`;
fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-faqs.liquid'), faqsClean.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-faqs.liquid');

// 10. earthly-moneyback.liquid
const rawMb = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/sec_template--19526977814662__pdp_moneyback_section_8zFwEK.html', 'utf8');
const mbClean = `
{% schema %}
{
  "name": "Earthly Moneyback Guarantee",
  "settings": []
}
{% endschema %}

${rawMb.replace(/id=['"]shopify-section-[^'"]*['"]/g, 'class="earthly-moneyback-wrapper"')}
`;
fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-moneyback.liquid'), mbClean.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-moneyback.liquid');

// 11. earthly-reviews.liquid
const reviews = JSON.parse(fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/reviews_harvested.json', 'utf8'));

let reviewCardsHtml = '';
reviews.forEach((r, idx) => {
  reviewCardsHtml += `
    <div class="earthly-rev-card">
      ${r.image ? `<div class="rev-img-box"><img src="${r.image}" alt="Customer photo review by ${r.author}" class="rev-img" loading="lazy"></div>` : ''}
      <div class="rev-content">
        <div class="rev-stars">★★★★★</div>
        <p class="rev-body">"${r.body.replace(/"/g, '&quot;')}"</p>
        <div class="rev-meta">
          <span class="rev-author">${r.author}</span>
          <span class="rev-verified">✓ Verified</span>
        </div>
        <div class="rev-date">${r.date}</div>
      </div>
    </div>
  `;
});

const reviewsLiquid = `
{% schema %}
{
  "name": "Earthly Customer Reviews",
  "settings": []
}
{% endschema %}

<section class="earthly-reviews-section">
  <div class="earthly-container">
    <div class="earthly-section-header text-center">
      <span class="earthly-subtitle">REAL CUSTOMER FEEDBACK</span>
      <h2 class="earthly-heading">Loved By Over 30,000+ Customers</h2>
      <div class="reviews-summary-badge">
        <span class="stars">★★★★★</span>
        <span class="score">4.9 / 5.0</span>
        <span class="sep">•</span>
        <span class="verified">100% Authentic Photo Reviews</span>
      </div>
    </div>

    <div class="earthly-reviews-grid">
      ${reviewCardsHtml}
    </div>
  </div>
</section>

<style>
.earthly-reviews-section {
  padding: 60px 20px;
  background-color: #ffffff;
}
.reviews-summary-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f6fcf1;
  color: #2c5801;
  padding: 8px 18px;
  border-radius: 30px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  font-weight: 600;
  margin-top: 12px;
}
.reviews-summary-badge .stars {
  color: #F1B948;
  font-size: 16px;
}
.earthly-reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
  margin-top: 36px;
}
.earthly-rev-card {
  background: #ffffff;
  border: 1px solid #eef3e8;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 18px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.earthly-rev-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(44, 88, 1, 0.08);
}
.rev-img-box {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f5f5f5;
}
.rev-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.rev-content {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.rev-stars {
  color: #F1B948;
  font-size: 14px;
  margin-bottom: 8px;
}
.rev-body {
  font-family: 'Poppins', sans-serif;
  font-size: 13.5px;
  line-height: 1.5;
  color: #333333;
  margin: 0 0 14px 0;
  flex-grow: 1;
}
.rev-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f0f4ec;
  padding-top: 10px;
}
.rev-author {
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #111111;
}
.rev-verified {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #2c5801;
  background: #eaf5e3;
  padding: 2px 7px;
  border-radius: 12px;
}
.rev-date {
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
  color: #888888;
  margin-top: 4px;
}
</style>
`;
fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-reviews.liquid'), reviewsLiquid.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-reviews.liquid');

// 12. earthly-footer.liquid
const rawFooter = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/sec_sections--19526978470022__footer.html', 'utf8');
const footerClean = `
{% schema %}
{
  "name": "Earthly Footer",
  "settings": []
}
{% endschema %}

${rawFooter.replace(/id=['"]shopify-section-[^'"]*['"]/g, 'class="earthly-footer-wrapper"')}
`;
fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-footer.liquid'), footerClean.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-footer.liquid');
