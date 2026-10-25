import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  if (res.ok) {
    console.log(`  ✔ Uploaded theme asset: ${key}`);
    return true;
  } else {
    const err = await res.text();
    console.error(`  ✗ Failed to upload ${key}:`, err.slice(0, 200));
    return false;
  }
}

async function main() {
  const token = await getAccessToken();

  const heroSection = `
{% comment %}
  Sakerplus Hero & Category Quick-Navigation Section
{% endcomment %}

<div id="SectionId-{{ section.id }}" class="saker-hero-wrapper">
  <!-- Top Announcement Bar -->
  <div class="saker-announcement-bar">
    <div class="ann-content">
      <span>🚚 <strong>FREE SHIPPING</strong> ON ALL ORDERS OVER $79.99</span>
      <span class="ann-dot">•</span>
      <span>⚡ <strong>FLASH SALE</strong>: UP TO 50% OFF BESTSELLERS</span>
      <span class="ann-dot">•</span>
      <span>⭐ 4.9/5 RATED BY 3,200+ HOMEOWNERS</span>
    </div>
  </div>

  <!-- Hero Main Banner -->
  <div class="hero-banner-container">
    <div class="hero-overlay"></div>
    <div class="hero-inner-content">
      <span class="hero-tag">FEATURED INNOVATION</span>
      <h1 class="hero-heading">Sakerplus® Fence Post Repair Kit</h1>
      <p class="hero-subtext">No digging. No concrete. Heavy-duty rust-resistant steel reinforcement that restores leaning and broken fence posts in minutes.</p>
      
      <div class="hero-cta-group">
        <a href="/products/sakerplus-fence-post-repair-kit" class="cta-primary">Claim 50% Off &rarr;</a>
        <a href="/pages/news-sakerplus-fence-post-repair-kit" class="cta-secondary">Read Special Report</a>
      </div>

      <!-- Quick Category Chips -->
      <div class="quick-category-pills">
        <a href="/collections/power-tools" class="pill-chip">⚡ Power Tools</a>
        <a href="/collections/garden-tools" class="pill-chip">🌿 Garden Tools</a>
        <a href="/collections/hand-tools" class="pill-chip">🔧 Hand Tools</a>
        <a href="/collections/woodworking-tools" class="pill-chip">🪚 Woodworking</a>
        <a href="/collections/best-sellers" class="pill-chip">🔥 Best Sellers</a>
      </div>
    </div>
  </div>

  <style>
    #SectionId-{{ section.id }} {
      position: relative !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      overflow: hidden !important;
    }

    #SectionId-{{ section.id }} .saker-announcement-bar {
      background: #111827 !important;
      color: #ffffff !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      padding: 10px 16px !important;
      text-align: center !important;
      letter-spacing: 0.5px !important;
    }

    #SectionId-{{ section.id }} .ann-dot {
      margin: 0 12px !important;
      color: #ea580c !important;
    }

    #SectionId-{{ section.id }} .hero-banner-container {
      position: relative !important;
      min-height: 540px !important;
      background: url('https://cdn.shopify.com/s/files/1/0873/0440/5294/files/9162c2f4-1834-45b2-544a-27e21bc83b00.jpg?v=1785232739') center center / cover no-repeat !important;
      display: flex !important;
      align-items: center !important;
      justify-content: flex-start !important;
      padding: 60px 40px !important;
    }

    #SectionId-{{ section.id }} .hero-overlay {
      position: absolute !important;
      inset: 0 !important;
      background: linear-gradient(90deg, rgba(17,24,39,0.92) 0%, rgba(17,24,39,0.7) 50%, rgba(17,24,39,0.2) 100%) !important;
    }

    #SectionId-{{ section.id }} .hero-inner-content {
      position: relative !important;
      z-index: 2 !important;
      max-width: 680px !important;
      color: #ffffff !important;
    }

    #SectionId-{{ section.id }} .hero-tag {
      display: inline-block !important;
      background: #ea580c !important;
      color: #ffffff !important;
      font-size: 12px !important;
      font-weight: 800 !important;
      padding: 6px 14px !important;
      border-radius: 9999px !important;
      letter-spacing: 1.5px !important;
      margin-bottom: 16px !important;
      text-transform: uppercase !important;
    }

    #SectionId-{{ section.id }} .hero-heading {
      font-size: 44px !important;
      font-weight: 900 !important;
      line-height: 1.15 !important;
      margin: 0 0 16px !important;
      color: #ffffff !important;
    }

    #SectionId-{{ section.id }} .hero-subtext {
      font-size: 17px !important;
      line-height: 1.6 !important;
      color: #e5e7eb !important;
      margin: 0 0 28px !important;
    }

    #SectionId-{{ section.id }} .hero-cta-group {
      display: flex !important;
      gap: 16px !important;
      flex-wrap: wrap !important;
      margin-bottom: 32px !important;
    }

    #SectionId-{{ section.id }} .cta-primary {
      background: #ea580c !important;
      color: #ffffff !important;
      font-weight: 700 !important;
      font-size: 16px !important;
      padding: 14px 30px !important;
      border-radius: 8px !important;
      text-decoration: none !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 4px 15px rgba(234, 88, 12, 0.4) !important;
    }

    #SectionId-{{ section.id }} .cta-primary:hover {
      background: #c2410c !important;
      transform: translateY(-2px) !important;
    }

    #SectionId-{{ section.id }} .cta-secondary {
      background: rgba(255, 255, 255, 0.15) !important;
      color: #ffffff !important;
      backdrop-filter: blur(8px) !important;
      font-weight: 700 !important;
      font-size: 16px !important;
      padding: 14px 28px !important;
      border-radius: 8px !important;
      text-decoration: none !important;
      border: 1px solid rgba(255,255,255,0.3) !important;
      transition: all 0.2s ease !important;
    }

    #SectionId-{{ section.id }} .cta-secondary:hover {
      background: rgba(255, 255, 255, 0.25) !important;
    }

    #SectionId-{{ section.id }} .quick-category-pills {
      display: flex !important;
      gap: 10px !important;
      flex-wrap: wrap !important;
    }

    #SectionId-{{ section.id }} .pill-chip {
      background: rgba(255, 255, 255, 0.1) !important;
      color: #f3f4f6 !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      padding: 8px 16px !important;
      border-radius: 9999px !important;
      text-decoration: none !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      transition: all 0.2s ease !important;
    }

    #SectionId-{{ section.id }} .pill-chip:hover {
      background: #ea580c !important;
      border-color: #ea580c !important;
      color: #ffffff !important;
    }

    @media (max-width: 768px) {
      #SectionId-{{ section.id }} .hero-banner-container {
        padding: 40px 20px !important;
        min-height: 480px !important;
      }
      #SectionId-{{ section.id }} .hero-heading {
        font-size: 30px !important;
      }
      #SectionId-{{ section.id }} .hero-subtext {
        font-size: 15px !important;
      }
    }
  </style>
</div>

{% schema %}
{
  "name": "Saker Hero Banner",
  "settings": [],
  "presets": [
    {
      "name": "Saker Hero Banner"
    }
  ]
}
{% endschema %}
`;

  await uploadThemeAsset(token, 'sections/saker-homepage-hero.liquid', heroSection);
  console.log('✔ Uploaded sections/saker-homepage-hero.liquid');
}

main();
