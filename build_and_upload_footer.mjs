import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const THEME_ID = '189572219034';

const rawStepOutput = fs.readFileSync('C:/Users/vutru/.gemini/antigravity-ide/brain/52dfdbad-95ab-4a1a-a447-55fbc8ecb7fd/.system_generated/steps/4474/output.txt', 'utf8');
const jsonMatch = rawStepOutput.match(/```json\n([\s\S]*?)\n```/);
let paymentIconsHtml = '';
if (jsonMatch) {
  paymentIconsHtml = JSON.parse(jsonMatch[1]);
}

const footerLiquid = `{% schema %}
{
  "name": "Earthly Footer",
  "settings": []
}
{% endschema %}

<footer id="SiteFooter" class="earthly-site-footer" role="contentinfo">
  <div class="earthly-footer-inner">

    <!-- Top Centered White Circular Badge Logo -->
    <div class="earthly-footer-logo-row">
      <a href="/" class="earthly-footer-logo-link" aria-label="Earthly Derm Home">
        <img
          src="//earthlyderm.com/cdn/shop/files/IG_HD_DP_2.jpg?crop=center&height=1498&v=1769465141&width=1498"
          alt="Earthly Derm"
          class="earthly-footer-logo-img"
          loading="lazy"
        />
      </a>
    </div>

    <!-- Main Footer Columns Grid -->
    <div class="earthly-footer-main-grid">

      <!-- Left Column: Newsletter + Socials (approx 68%) -->
      <div class="earthly-footer-newsletter-col">
        <div class="earthly-footer-checkmarks">
          <div class="earthly-check-item">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#E5A93B"/>
              <path d="M6 10L9 13L14 7" stroke="#2C5801" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>No spam ever</span>
          </div>
          <div class="earthly-check-item">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#E5A93B"/>
              <path d="M6 10L9 13L14 7" stroke="#2C5801" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Best deals only</span>
          </div>
        </div>

        <form method="post" action="/contact#NewsletterForm--footer" id="NewsletterForm--footer" class="earthly-footer-form">
          <input type="hidden" name="form_type" value="customer" />
          <input type="hidden" name="utf8" value="✓" />
          <input type="hidden" name="contact[accepts_marketing]" value="true" />
          <div class="earthly-pill-input-wrap">
            <input
              type="email"
              name="contact[email]"
              placeholder="Your email"
              class="earthly-pill-input"
              required
              autocomplete="email"
            />
            <button type="submit" class="earthly-pill-submit-btn">SIGN UP</button>
          </div>
        </form>

        <div class="earthly-footer-socials">
          <a href="https://instagram.com/earthlyderm" target="_blank" rel="noopener" class="earthly-social-btn" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61555704639815" target="_blank" rel="noopener" class="earthly-social-btn" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
            </svg>
          </a>
          <a href="https://www.pinterest.com/earthlyderm/" target="_blank" rel="noopener" class="earthly-social-btn" aria-label="Pinterest">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Right Column: Info Links (approx 26%) -->
      <div class="earthly-footer-menu-col">
        <h4 class="earthly-footer-title">Info</h4>
        <ul class="earthly-footer-links">
          <li><a href="/pages/our-story">Our Story</a></li>
          <li><a href="/policies/privacy-policy">Privacy Policy</a></li>
          <li><a href="/policies/terms-of-service">Terms of Service</a></li>
        </ul>
      </div>

    </div>

    <!-- Second Row: 3 Links Columns + Our Mission -->
    <div class="earthly-footer-links-row">
      <div class="earthly-footer-col">
        <h4 class="earthly-footer-title">Shop</h4>
        <ul class="earthly-footer-links">
          <li><a href="/products/turmeric-glow-soap">Turmeric Glow Soap</a></li>
          <li><a href="/products/african-black-soap">Anti Acne Soap</a></li>
        </ul>
      </div>

      <div class="earthly-footer-col">
        <h4 class="earthly-footer-title">Helpful Links</h4>
        <ul class="earthly-footer-links">
          <li><a href="/pages/contact">Contact Us</a></li>
          <li><a href="/apps/parcelpanel">Track Your Order</a></li>
          <li><a href="https://earthlyderm.com/a/loop_subscriptions/customer" target="_blank" rel="noopener">Manage Subscription</a></li>
          <li><a href="/policies/refund-policy">Returns Policy</a></li>
          <li><a href="/policies/shipping-policy">Shipping Policy</a></li>
        </ul>
      </div>

      <div class="earthly-footer-col earthly-footer-mission-col">
        <h4 class="earthly-footer-title">Our Mission</h4>
        <p class="earthly-footer-mission-text">
          Our mission at Earthly Derm is to empower individuals by providing natural, effective skincare solutions that enhance beauty and boost confidence
        </p>
      </div>
    </div>

    <!-- Footer Bottom: Copyright, Country Pill, Payment Icons -->
    <div class="earthly-footer-bottom">
      <p class="earthly-copyright">
        &copy; 2026, Earthly Derm. Powered by Shopify.
      </p>

      <div class="earthly-currency-pill">
        <img src="//cdn.shopify.com/static/images/flags/us.svg?width=40" alt="United States" width="20" height="15" />
        <span>United States (USD $)</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <div class="earthly-payment-badges-wrap">
        ${paymentIconsHtml}
      </div>
    </div>

  </div>
</footer>

<style>
  .earthly-site-footer {
    background-color: #2C5801;
    color: #ffffff;
    padding: 40px 20px 40px;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
    border-top: none;
    position: relative;
    z-index: 10;
  }

  .earthly-footer-inner {
    max-width: 1080px;
    margin: 0 auto;
  }

  /* Logo */
  .earthly-footer-logo-row {
    text-align: center;
    margin-bottom: 24px;
  }
  .earthly-footer-logo-link {
    display: inline-block;
  }
  .earthly-footer-logo-img {
    width: 130px;
    height: 130px;
    display: block;
    margin: 0 auto;
    border-radius: 50%;
    object-fit: cover;
  }

  /* Main Grid Row 1 */
  .earthly-footer-main-grid {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 40px;
    margin-bottom: 30px;
  }

  .earthly-footer-newsletter-col {
    flex: 0 0 68%;
    max-width: 68%;
  }

  /* Checkmarks */
  .earthly-footer-checkmarks {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
    margin-bottom: 16px;
  }
  .earthly-check-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: #ffffff;
  }

  /* Capsule Input */
  .earthly-footer-form {
    margin: 0 auto;
    max-width: 660px;
  }
  .earthly-pill-input-wrap {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 999px;
    padding: 5px 6px 5px 24px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  }
  .earthly-pill-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: 15px;
    color: #333333;
    padding: 8px 0;
  }
  .earthly-pill-input::placeholder {
    color: #7b7b7b;
  }
  .earthly-pill-submit-btn {
    background: #E5A93B;
    color: #1a1a1a;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: 0.8px;
    padding: 12px 32px;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease;
  }
  .earthly-pill-submit-btn:hover {
    background: #d49527;
    transform: scale(1.02);
  }

  /* Social Icons */
  .earthly-footer-socials {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 20px;
  }
  .earthly-social-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .earthly-social-btn:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }

  /* Column Typography */
  .earthly-footer-menu-col {
    flex: 0 0 26%;
    max-width: 26%;
  }

  .earthly-footer-title {
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 16px 0;
    letter-spacing: 0.3px;
  }

  .earthly-footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .earthly-footer-links li {
    margin-bottom: 12px;
  }
  .earthly-footer-links a {
    color: rgba(255, 255, 255, 0.88);
    text-decoration: none;
    font-size: 14.5px;
    transition: color 0.2s ease;
  }
  .earthly-footer-links a:hover {
    color: #E5A93B;
  }

  /* Row 2 */
  .earthly-footer-links-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1.6fr;
    gap: 40px;
    margin-top: 10px;
    padding-top: 20px;
  }

  .earthly-footer-mission-text {
    font-size: 14px;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
    max-width: 440px;
  }

  /* Bottom Row */
  .earthly-footer-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    margin-top: 40px;
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }

  .earthly-copyright {
    font-size: 13.5px;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
    text-align: center;
  }

  .earthly-currency-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.22);
    padding: 7px 16px;
    border-radius: 999px;
    font-size: 13px;
    color: #ffffff;
    cursor: pointer;
  }
  .earthly-currency-pill img {
    border-radius: 2px;
  }

  .earthly-payment-badges-wrap .payment-icon-list {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .earthly-payment-badges-wrap .payment-icon {
    width: 38px;
    height: 24px;
    display: block;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    .earthly-site-footer {
      padding: 40px 16px 30px;
    }
    .earthly-footer-main-grid {
      flex-direction: column;
      gap: 32px;
    }
    .earthly-footer-newsletter-col,
    .earthly-footer-menu-col {
      flex: 0 0 100%;
      max-width: 100%;
    }
    .earthly-footer-links-row {
      grid-template-columns: 1fr;
      gap: 26px;
    }
    .earthly-footer-checkmarks {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }
  }
</style>
`;

fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-footer.liquid', footerLiquid);
console.log('Saved perfect earthly-footer.liquid with original SVGs and circular logo');

async function getAccessToken() {
  const tokenRes = await fetch('https://' + SHOP_DOMAIN + '/admin/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function uploadFile(token, relPath, content) {
  const uploadRes = await fetch('https://' + SHOP_DOMAIN + '/admin/api/2024-01/themes/' + THEME_ID + '/assets.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: relPath,
        value: content
      }
    })
  });
  const uploadData = await uploadRes.json();
  console.log('Uploaded ' + relPath + ':', uploadData.asset ? 'SUCCESS' : uploadData);
}

async function run() {
  const token = await getAccessToken();
  await uploadFile(token, 'sections/earthly-footer.liquid', fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-footer.liquid', 'utf8'));
}

run();
