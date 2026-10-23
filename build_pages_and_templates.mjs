import fs from 'fs';
import path from 'path';

const THEME_DIR = 'h:/Shopify-Clone/Clone-earthlyderm';
const TEMPLATES_DIR = path.join(THEME_DIR, 'templates');
const SECTIONS_DIR = path.join(THEME_DIR, 'sections');

// 1. sections/earthly-page-our-story.liquid
const storyHtml = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/page_our_story_content.html', 'utf8');
const ourStoryLiquid = `
{% schema %}
{
  "name": "Earthly Our Story",
  "settings": []
}
{% endschema %}

<div class="earthly-story-page-wrapper">
  ${storyHtml.replace(/id=['"]shopify-section-[^'"]*['"]/g, 'class="earthly-story-sec"')}
</div>

<style>
.earthly-story-page-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
  font-family: 'Poppins', sans-serif;
  line-height: 1.8;
  color: #333333;
}
.earthly-story-page-wrapper h1, .earthly-story-page-wrapper h2 {
  font-family: 'Playfair Display', serif;
  color: #111111;
}
</style>
`;
fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-page-our-story.liquid'), ourStoryLiquid.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-page-our-story.liquid');

// 2. templates/page.our-story.json
const ourStoryJson = {
  "sections": {
    "announcement": { "type": "earthly-announcement-bar", "settings": {} },
    "header": { "type": "earthly-header", "settings": {} },
    "main": { "type": "earthly-page-our-story", "settings": {} },
    "moneyback": { "type": "earthly-moneyback", "settings": {} },
    "footer": { "type": "earthly-footer", "settings": {} }
  },
  "order": ["announcement", "header", "main", "moneyback", "footer"]
};
fs.writeFileSync(path.join(TEMPLATES_DIR, 'page.our-story.json'), JSON.stringify(ourStoryJson, null, 2), 'utf8');
console.log('✔ Wrote templates/page.our-story.json');

// 3. templates/page.customer-reviews.json
const customerReviewsJson = {
  "sections": {
    "announcement": { "type": "earthly-announcement-bar", "settings": {} },
    "header": { "type": "earthly-header", "settings": {} },
    "reviews": { "type": "earthly-reviews", "settings": {} },
    "moneyback": { "type": "earthly-moneyback", "settings": {} },
    "footer": { "type": "earthly-footer", "settings": {} }
  },
  "order": ["announcement", "header", "reviews", "moneyback", "footer"]
};
fs.writeFileSync(path.join(TEMPLATES_DIR, 'page.customer-reviews.json'), JSON.stringify(customerReviewsJson, null, 2), 'utf8');
console.log('✔ Wrote templates/page.customer-reviews.json');

// 4. sections/earthly-page-contact.liquid
const contactHtml = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/page_contact_content.html', 'utf8');
const contactLiquid = `
{% schema %}
{
  "name": "Earthly Contact Us",
  "settings": []
}
{% endschema %}

<div class="earthly-contact-page-wrapper">
  <div class="contact-header text-center">
    <h1 class="contact-title">Contact Us</h1>
    <p class="contact-subtitle">Have a question or need assistance with your order? Send us a message and our team will get back to you within 24 hours.</p>
  </div>

  <div class="contact-card">
    {% form 'contact' %}
      {% if form.posted_successfully? %}
        <p class="contact-success">Thank you for reaching out! We will be in touch shortly.</p>
      {% endif %}

      <div class="contact-field">
        <label for="ContactName">Name</label>
        <input type="text" id="ContactName" name="contact[name]" placeholder="Your full name" required>
      </div>

      <div class="contact-field">
        <label for="ContactEmail">Email</label>
        <input type="email" id="ContactEmail" name="contact[email]" placeholder="your.email@example.com" required>
      </div>

      <div class="contact-field">
        <label for="ContactOrder">Order Number (optional)</label>
        <input type="text" id="ContactOrder" name="contact[order_number]" placeholder="#ED1234">
      </div>

      <div class="contact-field">
        <label for="ContactMessage">Message</label>
        <textarea id="ContactMessage" name="contact[body]" rows="5" placeholder="How can we help you?" required></textarea>
      </div>

      <button type="submit" class="contact-submit-btn">SEND MESSAGE</button>
    {% endform %}
  </div>
</div>

<style>
.earthly-contact-page-wrapper {
  max-width: 680px;
  margin: 0 auto;
  padding: 50px 20px 90px 20px;
  font-family: 'Poppins', sans-serif;
}
.contact-title {
  font-family: 'Playfair Display', serif;
  font-size: 42px;
  color: #111111;
  margin: 0 0 10px 0;
}
.contact-subtitle {
  color: #666666;
  font-size: 15px;
  margin: 0 0 36px 0;
  line-height: 1.6;
}
.contact-card {
  background: #ffffff;
  border: 1px solid #e7efe2;
  border-radius: 12px;
  padding: 36px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.04);
}
.contact-field {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.contact-field label {
  font-weight: 600;
  font-size: 13px;
  color: #333333;
}
.contact-field input, .contact-field textarea {
  border: 1px solid #d8e5d0;
  border-radius: 6px;
  padding: 12px 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
}
.contact-field input:focus, .contact-field textarea:focus {
  outline: none;
  border-color: #2C5801;
}
.contact-submit-btn {
  width: 100%;
  background: #2C5801;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 16px;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.contact-submit-btn:hover {
  background: #1e3d01;
}
.contact-success {
  background: #f2fbea;
  color: #2c5801;
  padding: 12px 16px;
  border-radius: 6px;
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
`;
fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-page-contact.liquid'), contactLiquid.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-page-contact.liquid');

// 5. templates/page.contact.json
const contactJson = {
  "sections": {
    "announcement": { "type": "earthly-announcement-bar", "settings": {} },
    "header": { "type": "earthly-header", "settings": {} },
    "main": { "type": "earthly-page-contact", "settings": {} },
    "moneyback": { "type": "earthly-moneyback", "settings": {} },
    "footer": { "type": "earthly-footer", "settings": {} }
  },
  "order": ["announcement", "header", "main", "moneyback", "footer"]
};
fs.writeFileSync(path.join(TEMPLATES_DIR, 'page.contact.json'), JSON.stringify(contactJson, null, 2), 'utf8');
console.log('✔ Wrote templates/page.contact.json');
