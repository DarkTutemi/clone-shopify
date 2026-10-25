import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
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

const cssContent = fs.readFileSync('Clone-pandadrum/zhp-collection.css', 'utf8');

const jsContent = `
document.addEventListener('DOMContentLoaded', function() {
  // Audio Player Functionality
  const audioPlayers = document.querySelectorAll('.zhp-audio-player');
  let currentAudio = null;
  let currentButton = null;
  let currentProgress = null;

  audioPlayers.forEach(player => {
    const src = player.getAttribute('data-audio-src');
    if (!src) return;
    const btn = player.querySelector('.zhp-audio-btn');
    const playIcon = player.querySelector('.zhp-icon-play');
    const pauseIcon = player.querySelector('.zhp-icon-pause');
    const progressBar = player.querySelector('.zhp-audio-progress');

    const audio = new Audio(src);

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentButton) {
          currentButton.querySelector('.zhp-icon-play').style.display = 'block';
          currentButton.querySelector('.zhp-icon-pause').style.display = 'none';
        }
        if (currentProgress) {
          currentProgress.style.width = '0%';
        }
      }

      if (audio.paused) {
        audio.play().then(() => {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
          currentAudio = audio;
          currentButton = btn;
          currentProgress = progressBar;
        }).catch(err => console.log('Audio autoplay blocked', err));
      } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    });

    audio.addEventListener('timeupdate', function() {
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = pct + '%';
      }
    });

    audio.addEventListener('ended', function() {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      progressBar.style.width = '0%';
    });
  });

  // Model Tabs Switcher
  const tabButtons = document.querySelectorAll('.zhp-tab-btn');
  const tabPanels = document.querySelectorAll('.zhp-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.zhp-faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', function() {
      const item = this.closest('.zhp-faq-item');
      item.classList.toggle('active');
    });
  });
});
`;

// Section 1: Marquee
const marqueeLiquid = `
{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
<div class="zhp-wrapper">
  <div class="zhp-marquee-bar" style="background-color: {{ section.settings.bg_color }}; color: {{ section.settings.text_color }};">
    <div class="zhp-marquee-track">
      <div class="zhp-marquee-item">{{ section.settings.text_1 | default: '🚚 FREE EXPRESS WORLDWIDE SHIPPING' }}</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">{{ section.settings.text_2 | default: '✨ 432 HZ NATURAL HEALING FREQUENCY' }}</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">{{ section.settings.text_3 | default: '🛡️ 30-DAY 100% HAPPINESS GUARANTEE' }}</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">{{ section.settings.text_4 | default: '🎁 COMPLETE STARTER KIT INCLUDED WITH EVERY DRUM' }}</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">{{ section.settings.text_5 | default: '⭐ OVER 72,000+ HAPPY DRUMMERS WORLDWIDE' }}</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">{{ section.settings.text_1 | default: '🚚 FREE EXPRESS WORLDWIDE SHIPPING' }}</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">{{ section.settings.text_2 | default: '✨ 432 HZ NATURAL HEALING FREQUENCY' }}</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">{{ section.settings.text_3 | default: '🛡️ 30-DAY 100% HAPPINESS GUARANTEE' }}</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">{{ section.settings.text_4 | default: '🎁 COMPLETE STARTER KIT INCLUDED WITH EVERY DRUM' }}</div>
      <div class="zhp-marquee-item">•</div>
      <div class="zhp-marquee-item">{{ section.settings.text_5 | default: '⭐ OVER 72,000+ HAPPY DRUMMERS WORLDWIDE' }}</div>
      <div class="zhp-marquee-item">•</div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "01. Thanh thông báo",
  "settings": [
    {
      "type": "color",
      "id": "bg_color",
      "label": "Màu nền",
      "default": "#2C4236"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Màu chữ",
      "default": "#FAF8F5"
    },
    {
      "type": "text",
      "id": "text_1",
      "label": "Nội dung 1",
      "default": "🚚 FREE EXPRESS WORLDWIDE SHIPPING"
    },
    {
      "type": "text",
      "id": "text_2",
      "label": "Nội dung 2",
      "default": "✨ 432 HZ NATURAL HEALING FREQUENCY"
    },
    {
      "type": "text",
      "id": "text_3",
      "label": "Nội dung 3",
      "default": "🛡️ 30-DAY 100% HAPPINESS GUARANTEE"
    },
    {
      "type": "text",
      "id": "text_4",
      "label": "Nội dung 4",
      "default": "🎁 COMPLETE STARTER KIT INCLUDED WITH EVERY DRUM"
    },
    {
      "type": "text",
      "id": "text_5",
      "label": "Nội dung 5",
      "default": "⭐ OVER 72,000+ HAPPY DRUMMERS WORLDWIDE"
    }
  ],
  "presets": [
    {
      "name": "01. Thanh thông báo"
    }
  ]
}
{% endschema %}
`;

// Section 2: Hero
const heroLiquid = `
{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
<div class="zhp-wrapper">
  <section class="zhp-hero">
    <div class="zhp-hero-bg">
      <picture>
        {% if section.settings.image_mobile != blank %}
          <source media="(max-width: 767px)" srcset="{{ section.settings.image_mobile | image_url: width: 800 }}">
        {% else %}
          <source media="(max-width: 767px)" srcset="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/heromobile1.avif?v=1716727985">
        {% endif %}

        {% if section.settings.image_desktop != blank %}
          {{ section.settings.image_desktop | image_url: width: 2000 | image_tag: class: 'zhp-hero-img', loading: 'eager', alt: 'Zavelyn Handpans' }}
        {% else %}
          <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/herdesktop3.avif?v=1716727145" alt="Zavelyn Handpans - Escape to Calmness" class="zhp-hero-img">
        {% endif %}
      </picture>
      <div class="zhp-hero-overlay"></div>
    </div>
    <div class="zhp-container zhp-hero-content">
      <div class="zhp-hero-badge">
        <span class="zhp-stars">★★★★★</span>
        <span>{{ section.settings.badge_text | default: 'Rated 4.92/5 by 72,000+ Happy Drummers' }}</span>
      </div>
      <h1 class="zhp-hero-title">{{ section.settings.title | default: 'Escape to Calmness' }}</h1>
      <p class="zhp-hero-subtitle">
        {{ section.settings.subtitle | default: 'Feel the stress melt away with every note. Handcrafted steel tongue drums tuned to pure 432 Hz healing frequencies, bringing tranquility, mindfulness, and joy into your everyday life.' }}
      </p>
      <div class="zhp-hero-trust-pills">
        <span class="zhp-trust-pill"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Free Worldwide Shipping</span>
        <span class="zhp-trust-pill"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> 30-Day Money Back Guarantee</span>
        <span class="zhp-trust-pill"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> No Musical Experience Needed</span>
      </div>
      <div class="zhp-hero-actions">
        <a href="{{ section.settings.btn1_link | default: '#zhp-bestsellers' }}" class="zhp-btn zhp-btn-primary">{{ section.settings.btn1_text | default: 'EXPLORE ZAVELYN DRUMS' }}</a>
        <a href="{{ section.settings.btn2_link | default: '#zhp-buyers-guide' }}" class="zhp-btn zhp-btn-outline">{{ section.settings.btn2_text | default: 'WHY 432 HZ MATTERS' }}</a>
      </div>
    </div>
  </section>

  <!-- Press Mentions Bar -->
  <section class="zhp-press-bar">
    <div class="zhp-container zhp-press-inner">
      <span class="zhp-press-label">FEATURED IN LEADING WELLNESS & MUSIC PUBLICATIONS</span>
      <div class="zhp-press-logos">
        <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/wsj.webp?v=1691487451" alt="WSJ" loading="lazy">
        <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/cnbc.webp?v=1691487451" alt="CNBC" loading="lazy">
        <div class="zhp-press-text-logo">FORBES</div>
        <div class="zhp-press-text-logo">YOGA JOURNAL</div>
        <div class="zhp-press-text-logo">MINDBODYGREEN</div>
      </div>
    </div>
  </section>
</div>

{% schema %}
{
  "name": "02. Hero Banner",
  "settings": [
    {
      "type": "image_picker",
      "id": "image_desktop",
      "label": "Ảnh nền Hero Desktop (Thay thế ảnh cũ)"
    },
    {
      "type": "image_picker",
      "id": "image_mobile",
      "label": "Ảnh nền Hero Mobile (Thay thế ảnh cũ)"
    },
    {
      "type": "text",
      "id": "badge_text",
      "label": "Huy hiệu đánh giá",
      "default": "Rated 4.92/5 by 72,000+ Happy Drummers"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Tiêu đề chính",
      "default": "Escape to Calmness"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Mô tả phụ",
      "default": "Feel the stress melt away with every note. Handcrafted steel tongue drums tuned to pure 432 Hz healing frequencies, bringing tranquility, mindfulness, and joy into your everyday life."
    },
    {
      "type": "text",
      "id": "btn1_text",
      "label": "Nút chính Text",
      "default": "EXPLORE ZAVELYN DRUMS"
    },
    {
      "type": "url",
      "id": "btn1_link",
      "label": "Nút chính Link"
    },
    {
      "type": "text",
      "id": "btn2_text",
      "label": "Nút phụ Text",
      "default": "WHY 432 HZ MATTERS"
    },
    {
      "type": "url",
      "id": "btn2_link",
      "label": "Nút phụ Link"
    }
  ],
  "presets": [
    {
      "name": "02. Hero Banner"
    }
  ]
}
{% endschema %}
`;

// Section 3: Bestsellers
const bestsellersLiquid = `
{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
{{ 'zhp-collection.js' | asset_url | script_tag }}
<div class="zhp-wrapper">
  <section class="zhp-bestsellers" id="zhp-bestsellers">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">{{ section.settings.tag | default: 'OUR COLLECTION' }}</span>
        <h2 class="zhp-section-title">{{ section.settings.title | default: "Zavelyn Drums™ You'll Love" }}</h2>
        <p class="zhp-section-subtitle">{{ section.settings.subtitle | default: 'Save up to 48% today. Every instrument includes a complete starter kit, padded bag, bamboo mallets, and tutorial songbook.' }}</p>
      </div>

      <div class="zhp-product-grid">
        <!-- Product 1: Pro 15 Tones -->
        <div class="zhp-product-card zhp-card-featured">
          <div class="zhp-card-badge zhp-badge-gold">BEST VALUE • SAVE 48%</div>
          <div class="zhp-card-media">
            <a href="/products/zavelyn-drum-pro">
              {% if section.settings.image_pro != blank %}
                {{ section.settings.image_pro | image_url: width: 600 | image_tag: class: 'zhp-card-img', loading: 'lazy', alt: 'Zavelyn Drum Pro' }}
              {% else %}
                <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/PandaDrumPro_White.webp?v=1792868508" alt="Zavelyn Drum Pro 15 Tones" class="zhp-card-img" loading="lazy">
              {% endif %}
            </a>
          </div>
          <div class="zhp-card-content">
            <div class="zhp-card-rating">
              <span class="zhp-stars">★★★★★</span>
              <span class="zhp-review-count">(571 reviews)</span>
            </div>
            <h3 class="zhp-card-title"><a href="/products/zavelyn-drum-pro">Zavelyn Drum™ Pro</a></h3>
            <div class="zhp-card-meta">Rich sound • 15" • 15 Tones (D-Major)</div>
            <ul class="zhp-card-features">
              <li>✓ Broadest 15-note chromatic range for infinite melodies</li>
              <li>✓ Deep resonant chamber with acoustic warmth</li>
              <li>✓ Handcrafted alloy steel with woolen edge wrap</li>
            </ul>

            <!-- Audio Player -->
            <div class="zhp-audio-player" data-audio-src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Pro_Sound_Bar_v2.mp3">
              <button type="button" class="zhp-audio-btn" aria-label="Play sound preview">
                <svg class="zhp-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="zhp-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <div class="zhp-audio-info">
                <span class="zhp-audio-label">Hear it in action: <strong>Pro (15 Tones)</strong></span>
                <div class="zhp-audio-bar"><div class="zhp-audio-progress"></div></div>
              </div>
            </div>

            <div class="zhp-card-package">
              <div class="zhp-package-title">What's Included:</div>
              <div class="zhp-package-tags">
                <span>Zavelyn Pro 15"</span>
                <span>FREE Travel Backpack</span>
                <span>FREE Bamboo Mallets</span>
                <span>FREE Songbook (20+ songs)</span>
                <span>Braided Wool Wrap</span>
              </div>
            </div>

            <div class="zhp-card-pricing">
              <span class="zhp-price-current">$259.95</span>
              <span class="zhp-price-compare">$499.95</span>
              <span class="zhp-price-save">Save $240.00</span>
            </div>

            <a href="/products/zavelyn-drum-pro" class="zhp-btn zhp-btn-block zhp-btn-cart">SELECT COLOR & ORDER</a>
            <div class="zhp-card-guarantee">🛡️ 30-Day Money Back • Lifetime Serenity Warranty</div>
          </div>
        </div>

        <!-- Product 2: Plus 11 Tones -->
        <div class="zhp-product-card zhp-card-popular">
          <div class="zhp-card-badge zhp-badge-green">MOST POPULAR • SAVE 47%</div>
          <div class="zhp-card-media">
            <a href="/products/zavelyn-drum-plus">
              {% if section.settings.image_plus != blank %}
                {{ section.settings.image_plus | image_url: width: 600 | image_tag: class: 'zhp-card-img', loading: 'lazy', alt: 'Zavelyn Drum Plus' }}
              {% else %}
                <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/PandaDrum_Plus_White.webp?v=1792868520" alt="Zavelyn Drum Plus 11 Tones" class="zhp-card-img" loading="lazy">
              {% endif %}
            </a>
          </div>
          <div class="zhp-card-content">
            <div class="zhp-card-rating">
              <span class="zhp-stars">★★★★★</span>
              <span class="zhp-review-count">(690 reviews)</span>
            </div>
            <h3 class="zhp-card-title"><a href="/products/zavelyn-drum-plus">Zavelyn Drum™ Plus</a></h3>
            <div class="zhp-card-meta">Most versatile • 11" • 11 Tones (D-Major)</div>
            <ul class="zhp-card-features">
              <li>✓ Ideal balance between portability and musical depth</li>
              <li>✓ Tuned to pure 432 Hz healing relaxation frequency</li>
              <li>✓ Perfect for family bonding, yoga, and meditation</li>
            </ul>

            <!-- Audio Player -->
            <div class="zhp-audio-player" data-audio-src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Plus_Sound_Bar_v2.mp3">
              <button type="button" class="zhp-audio-btn" aria-label="Play sound preview">
                <svg class="zhp-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="zhp-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <div class="zhp-audio-info">
                <span class="zhp-audio-label">Hear it in action: <strong>Plus (11 Tones)</strong></span>
                <div class="zhp-audio-bar"><div class="zhp-audio-progress"></div></div>
              </div>
            </div>

            <div class="zhp-card-package">
              <div class="zhp-package-title">What's Included:</div>
              <div class="zhp-package-tags">
                <span>Zavelyn Plus 11"</span>
                <span>FREE Travel Shoulder Bag</span>
                <span>FREE Bamboo Mallets</span>
                <span>FREE Songbook (20+ songs)</span>
                <span>Fingertip Picks</span>
              </div>
            </div>

            <div class="zhp-card-pricing">
              <span class="zhp-price-current">$159.95</span>
              <span class="zhp-price-compare">$299.95</span>
              <span class="zhp-price-save">Save $140.00</span>
            </div>

            <a href="/products/zavelyn-drum-plus" class="zhp-btn zhp-btn-block zhp-btn-cart">SELECT COLOR & ORDER</a>
            <div class="zhp-card-guarantee">🛡️ 30-Day Money Back • 3-Year Quality Warranty</div>
          </div>
        </div>

        <!-- Product 3: Mini 8 Tones -->
        <div class="zhp-product-card">
          <div class="zhp-card-badge zhp-badge-blue">BEST FOR KIDS & GIFTS • SAVE 39%</div>
          <div class="zhp-card-media">
            <a href="/products/zavelyn-drum-mini">
              {% if section.settings.image_mini != blank %}
                {{ section.settings.image_mini | image_url: width: 600 | image_tag: class: 'zhp-card-img', loading: 'lazy', alt: 'Zavelyn Drum Mini' }}
              {% else %}
                <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/Mini_white.webp?v=1792868532" alt="Zavelyn Drum Mini 8 Tones" class="zhp-card-img" loading="lazy">
              {% endif %}
            </a>
          </div>
          <div class="zhp-card-content">
            <div class="zhp-card-rating">
              <span class="zhp-stars">★★★★★</span>
              <span class="zhp-review-count">(503 reviews)</span>
            </div>
            <h3 class="zhp-card-title"><a href="/products/zavelyn-drum-mini">Zavelyn Drum™ Mini</a></h3>
            <div class="zhp-card-meta">Best for kids • 6" • 8 Tones (C-Major)</div>
            <ul class="zhp-card-features">
              <li>✓ Ultra-lightweight (1.5 lbs) and portable for tiny hands</li>
              <li>✓ Intuitive pentatonic scale - impossible to hit a wrong note</li>
              <li>✓ Spark musical curiosity and peaceful playtime</li>
            </ul>

            <!-- Audio Player -->
            <div class="zhp-audio-player" data-audio-src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_Sound_Bar_v2.mp3">
              <button type="button" class="zhp-audio-btn" aria-label="Play sound preview">
                <svg class="zhp-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                <svg class="zhp-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <div class="zhp-audio-info">
                <span class="zhp-audio-label">Hear it in action: <strong>Mini (8 Tones)</strong></span>
                <div class="zhp-audio-bar"><div class="zhp-audio-progress"></div></div>
              </div>
            </div>

            <div class="zhp-card-package">
              <div class="zhp-package-title">What's Included:</div>
              <div class="zhp-package-tags">
                <span>Zavelyn Mini 6"</span>
                <span>FREE Travel Pouch</span>
                <span>FREE Mallets</span>
                <span>FREE Songbook (20+ songs)</span>
                <span>Tone Stickers</span>
              </div>
            </div>

            <div class="zhp-card-pricing">
              <span class="zhp-price-current">$109.95</span>
              <span class="zhp-price-compare">$179.95</span>
              <span class="zhp-price-save">Save $70.00</span>
            </div>

            <a href="/products/zavelyn-drum-mini" class="zhp-btn zhp-btn-block zhp-btn-cart">SELECT COLOR & ORDER</a>
            <div class="zhp-card-guarantee">🛡️ 30-Day Money Back • 2-Year Warranty</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

{% schema %}
{
  "name": "03. Bộ 3 Sản phẩm",
  "settings": [
    {
      "type": "text",
      "id": "tag",
      "label": "Nhãn danh mục",
      "default": "OUR COLLECTION"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Tiêu đề",
      "default": "Zavelyn Drums™ You'll Love"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Mô tả phụ",
      "default": "Save up to 48% today. Every instrument includes a complete starter kit, padded bag, bamboo mallets, and tutorial songbook."
    },
    {
      "type": "header",
      "content": "Thay thế ảnh sản phẩm (Nếu dính logo)"
    },
    {
      "type": "image_picker",
      "id": "image_pro",
      "label": "Ảnh sản phẩm Pro 15-Tone"
    },
    {
      "type": "image_picker",
      "id": "image_plus",
      "label": "Ảnh sản phẩm Plus 11-Tone"
    },
    {
      "type": "image_picker",
      "id": "image_mini",
      "label": "Ảnh sản phẩm Mini 8-Tone"
    }
  ],
  "presets": [
    {
      "name": "03. Bộ 3 Sản phẩm"
    }
  ]
}
{% endschema %}
`;

// Section 4: Model Tabs
const modelTabsLiquid = `
{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
{{ 'zhp-collection.js' | asset_url | script_tag }}
<div class="zhp-wrapper">
  <section class="zhp-model-tabs-section">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">{{ section.settings.tag | default: 'EXPLORE BY MODEL' }}</span>
        <h2 class="zhp-section-title">{{ section.settings.title | default: 'Easy to Learn and Soothing to Play' }}</h2>
        <p class="zhp-section-subtitle">{{ section.settings.subtitle | default: 'Click each model to explore unique tones, technical dimensions, and ideal musical journeys.' }}</p>
      </div>

      <!-- Tab Buttons -->
      <div class="zhp-tabs-nav" role="tablist">
        <button type="button" class="zhp-tab-btn active" data-tab="tab-pro" role="tab">
          <span class="zhp-tab-name">Zavelyn Drum™ Pro</span>
          <span class="zhp-tab-badge">15 Tones • 15"</span>
        </button>
        <button type="button" class="zhp-tab-btn" data-tab="tab-plus" role="tab">
          <span class="zhp-tab-name">Zavelyn Drum™ Plus</span>
          <span class="zhp-tab-badge">11 Tones • 11"</span>
        </button>
        <button type="button" class="zhp-tab-btn" data-tab="tab-mini" role="tab">
          <span class="zhp-tab-name">Zavelyn Drum™ Mini</span>
          <span class="zhp-tab-badge">8 Tones • 6"</span>
        </button>
      </div>

      <!-- Tab Content Panels -->
      <div class="zhp-tabs-content">
        <!-- Panel Pro -->
        <div class="zhp-tab-panel active" id="tab-pro" role="tabpanel">
          <div class="zhp-tab-grid">
            <div class="zhp-tab-image-col">
              {% if section.settings.image_pro != blank %}
                {{ section.settings.image_pro | image_url: width: 800 | image_tag: loading: 'lazy', alt: 'Zavelyn Drum Pro Specs' }}
              {% else %}
                <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/details.webp?v=1792868508" alt="Zavelyn Drum Pro Specs" loading="lazy">
              {% endif %}
            </div>
            <div class="zhp-tab-info-col">
              <h3>The Masterpiece: Zavelyn Drum™ Pro (15 Tones)</h3>
              <p class="zhp-tab-desc">Designed for deep relaxation and rich acoustic depth. Its expansive 15 notes offer a serene sanctuary for both beginner meditators and seasoned music creators.</p>
              <div class="zhp-specs-list">
                <div class="zhp-spec-item">
                  <strong>Full Musical Range:</strong>
                  <span>D-Major, 15 notes, 15" diameter, 6 lbs - capable of playing complex songs and deep, multi-layered melodies.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>432 Hz Healing Resonance:</strong>
                  <span>Tuned to the earth's natural resonance frequency, proven to reduce stress and heart rate.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Conversation Starter:</strong>
                  <span>Doubles as an exquisite artisanal art piece with handcrafted woolen braid around the perimeter.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Lifetime Serenity Guarantee:</strong>
                  <span>Crafted from certified titanium-alloy steel engineered to never go out of tune.</span>
                </div>
              </div>
              <a href="/products/zavelyn-drum-pro" class="zhp-btn zhp-btn-primary">EXPLORE PRO 15-TONE</a>
            </div>
          </div>
        </div>

        <!-- Panel Plus -->
        <div class="zhp-tab-panel" id="tab-plus" role="tabpanel">
          <div class="zhp-tab-grid">
            <div class="zhp-tab-image-col">
              {% if section.settings.image_plus != blank %}
                {{ section.settings.image_plus | image_url: width: 800 | image_tag: loading: 'lazy', alt: 'Zavelyn Drum Plus Specs' }}
              {% else %}
                <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/78.jpg?v=1792868520" alt="Zavelyn Drum Plus Specs" loading="lazy">
              {% endif %}
            </div>
            <div class="zhp-tab-info-col">
              <h3>The All-Rounder: Zavelyn Drum™ Plus (11 Tones)</h3>
              <p class="zhp-tab-desc">A versatile, heartwarming instrument that brings people together. With its easy playability and rich harmonic tones, it is the most popular choice for households worldwide.</p>
              <div class="zhp-specs-list">
                <div class="zhp-spec-item">
                  <strong>Tunes for Everyone:</strong>
                  <span>D-Major, 11 tones, 11" diameter, 3 lbs - great for family evenings, solo unwinding, and acoustic jams.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Your Daily Peace Sanctuary:</strong>
                  <span>Soothing sound vibrations settle the mind, relieve tension, and promote restorative rest.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Travel-Ready Music:</strong>
                  <span>Includes a padded shoulder bag so you can bring tranquil music into nature, camping, and yoga classes.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Robust and Weatherproof:</strong>
                  <span>Electroplated protective coating prevents rust and wear for years of reliable joy.</span>
                </div>
              </div>
              <a href="/products/zavelyn-drum-plus" class="zhp-btn zhp-btn-primary">EXPLORE PLUS 11-TONE</a>
            </div>
          </div>
        </div>

        <!-- Panel Mini -->
        <div class="zhp-tab-panel" id="tab-mini" role="tabpanel">
          <div class="zhp-tab-grid">
            <div class="zhp-tab-image-col">
              {% if section.settings.image_mini != blank %}
                {{ section.settings.image_mini | image_url: width: 800 | image_tag: loading: 'lazy', alt: 'Zavelyn Drum Mini Specs' }}
              {% else %}
                <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/1Box_Drum_8_new.jpg?v=1792868532" alt="Zavelyn Drum Mini Specs" loading="lazy">
              {% endif %}
            </div>
            <div class="zhp-tab-info-col">
              <h3>The Joyful Start: Zavelyn Drum™ Mini (8 Tones)</h3>
              <p class="zhp-tab-desc">A delightful first step into musical creativity. Sized and pitched for smaller hands and casual desk play, producing sweet bell-like notes with effortless ease.</p>
              <div class="zhp-specs-list">
                <div class="zhp-spec-item">
                  <strong>Child-Friendly Tuning:</strong>
                  <span>C-Major pentatonic scale, 6" diameter, 1.5 lbs - zero wrong notes so anyone plays beautifully right away.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Easy Learn, Instant Joy:</strong>
                  <span>Includes color-coded songbook with popular tunes like Twinkle Twinkle, Happy Birthday, and Ode to Joy.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Durable & Drop-Proof:</strong>
                  <span>Solid alloy steel designed to handle active play without warping or detuning.</span>
                </div>
                <div class="zhp-spec-item">
                  <strong>Screen-Free Calming Break:</strong>
                  <span>A mindful, tactile alternative to digital screens that cultivates focus, rhythm, and peace.</span>
                </div>
              </div>
              <a href="/products/zavelyn-drum-mini" class="zhp-btn zhp-btn-primary">EXPLORE MINI 8-TONE</a>
            </div>
          </div>
        </div>
      </div>

      <!-- 4 Pillars Feature Cards -->
      <div class="zhp-pillars-grid">
        <div class="zhp-pillar-card">
          <div class="zhp-pillar-icon">
            <img src="https://cdn.shopify.com/s/files/1/0772/9528/8652/files/m_editation.svg?v=1693327629" alt="Stress Relief" loading="lazy">
          </div>
          <h4>Built for Deep Relaxation</h4>
          <p>432 Hz frequencies synchronize brainwaves into the alpha state, melting away daily tension within minutes.</p>
        </div>
        <div class="zhp-pillar-card">
          <div class="zhp-pillar-icon">
            <img src="https://cdn.shopify.com/s/files/1/0772/9528/8652/files/creativity_color.svg?v=1693327715" alt="Creativity" loading="lazy">
          </div>
          <h4>For All Ages & Skill Levels</h4>
          <p>No prior musical education required. Numbered tongues and guided songbooks make playing completely foolproof.</p>
        </div>
        <div class="zhp-pillar-card">
          <div class="zhp-pillar-icon">
            <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/gift.svg?v=1698733901" alt="Gift" loading="lazy">
          </div>
          <h4>A Meaningful, Lasting Gift</h4>
          <p>In a world of fast tech, give a timeless gift that inspires calm, connection, and mindful creative expression.</p>
        </div>
        <div class="zhp-pillar-card">
          <div class="zhp-pillar-icon">
            <img src="https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Happy_customers.avif?v=1715926939" alt="Happy Customers" loading="lazy">
          </div>
          <h4>Over 72,000+ Happy Drummers</h4>
          <p>Cherished by yoga teachers, sound therapists, families, and wellness lovers across 70+ countries.</p>
        </div>
      </div>
    </div>
  </section>
</div>

{% schema %}
{
  "name": "04. Chi tiết từng Model",
  "settings": [
    {
      "type": "text",
      "id": "tag",
      "label": "Nhãn danh mục",
      "default": "EXPLORE BY MODEL"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Tiêu đề",
      "default": "Easy to Learn and Soothing to Play"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Mô tả phụ",
      "default": "Click each model to explore unique tones, technical dimensions, and ideal musical journeys."
    },
    {
      "type": "header",
      "content": "Thay thế ảnh thông số Model (Nếu dính logo)"
    },
    {
      "type": "image_picker",
      "id": "image_pro",
      "label": "Ảnh thông số Model Pro 15-Tone"
    },
    {
      "type": "image_picker",
      "id": "image_plus",
      "label": "Ảnh thông số Model Plus 11-Tone"
    },
    {
      "type": "image_picker",
      "id": "image_mini",
      "label": "Ảnh thông số Model Mini 8-Tone"
    }
  ],
  "presets": [
    {
      "name": "04. Chi tiết từng Model"
    }
  ]
}
{% endschema %}
`;

// Section 5: What you'll get
const whatYouGetLiquid = `
{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
<div class="zhp-wrapper">
  <section class="zhp-what-you-get">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">{{ section.settings.tag | default: 'EVERYTHING INCLUDED' }}</span>
        <h2 class="zhp-section-title">{{ section.settings.title | default: "What You'll Get" }}</h2>
        <p class="zhp-section-subtitle">{{ section.settings.subtitle | default: 'No hidden extras or surprise add-ons needed. Every Zavelyn Drum ships as a complete all-in-one musical kit.' }}</p>
      </div>

      <div class="zhp-kit-grid">
        {% for block in section.blocks %}
          <div class="zhp-kit-card" {{ block.shopify_attributes }}>
            <div class="zhp-kit-media">
              {% if block.settings.image != blank %}
                {{ block.settings.image | image_url: width: 400 | image_tag: loading: 'lazy', alt: block.settings.title }}
              {% elsif block.settings.fallback_image != blank %}
                <img src="{{ block.settings.fallback_image }}" alt="{{ block.settings.title }}" loading="lazy">
              {% endif %}
            </div>
            <div class="zhp-kit-badge">{{ block.settings.badge | default: 'INCLUDED' }}</div>
            <h4>{{ block.settings.title }}</h4>
            <p>{{ block.settings.desc }}</p>
          </div>
        {% endfor %}
      </div>
    </div>
  </section>
</div>

{% schema %}
{
  "name": "05. Phụ kiện đi kèm",
  "settings": [
    {
      "type": "text",
      "id": "tag",
      "label": "Nhãn danh mục",
      "default": "EVERYTHING INCLUDED"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Tiêu đề",
      "default": "What You'll Get"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Mô tả phụ",
      "default": "No hidden extras or surprise add-ons needed. Every Zavelyn Drum ships as a complete all-in-one musical kit."
    }
  ],
  "blocks": [
    {
      "type": "item",
      "name": "Phụ kiện đi kèm",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Ảnh phụ kiện (Thay thế nếu dính logo Panda)"
        },
        {
          "type": "text",
          "id": "fallback_image",
          "label": "URL ảnh dự phòng"
        },
        {
          "type": "text",
          "id": "badge",
          "label": "Huy hiệu",
          "default": "INCLUDED"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Tên phụ kiện",
          "default": "Anti-Shock Travel Bag"
        },
        {
          "type": "textarea",
          "id": "desc",
          "label": "Mô tả",
          "default": "Thickly padded custom carrying bag with shoulder straps to keep your drum safe at home or on the road."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "05. Phụ kiện đi kèm",
      "blocks": [
        {
          "type": "item",
          "settings": {
            "title": "Anti-Shock Travel Bag",
            "desc": "Thickly padded custom carrying bag with shoulder straps to keep your drum safe at home or on the road.",
            "fallback_image": "https://cdn.shopify.com/s/files/1/0772/9528/8652/files/Panda_Drum_bag_15t.avif?v=1693393541"
          }
        },
        {
          "type": "item",
          "settings": {
            "title": "2x Bamboo Mallets",
            "desc": "Acoustically balanced bamboo mallets with soft rubber tips engineered for optimal resonance and pure bell tones.",
            "fallback_image": "https://cdn.shopify.com/s/files/1/0772/9528/8652/files/mallets15t.avif?v=1693393704"
          }
        },
        {
          "type": "item",
          "settings": {
            "title": "Handcrafted Zavelyn Drum",
            "desc": "Master-tuned alloy steel tongue drum with permanent tone markings and laser-cut acoustic tongues.",
            "fallback_image": "https://cdn.shopify.com/s/files/1/0772/9528/8652/files/drum_15t.avif?v=1693393704"
          }
        },
        {
          "type": "item",
          "settings": {
            "title": "Tutorial Songbook & Videos",
            "desc": "Comprehensive step-by-step guidebook containing 20+ songs plus QR codes for free online video lessons.",
            "fallback_image": "https://cdn.shopify.com/s/files/1/0772/9528/8652/files/book15t.avif?v=1693393704"
          }
        }
      ]
    }
  ]
}
{% endschema %}
`;

// Section 6: Endorsements
const endorsementsLiquid = `
{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
<div class="zhp-wrapper">
  <section class="zhp-endorsements">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">{{ section.settings.tag | default: 'EXPERT VOICES' }}</span>
        <h2 class="zhp-section-title">{{ section.settings.title | default: 'The Voices of Calm and Balance' }}</h2>
        <p class="zhp-section-subtitle">{{ section.settings.subtitle | default: 'Hear how renowned yoga instructors, authors, and percussionists use Zavelyn Drums to find serenity.' }}</p>
      </div>

      <div class="zhp-endorsements-grid">
        {% for block in section.blocks %}
          <div class="zhp-endorsement-card" {{ block.shopify_attributes }}>
            <div class="zhp-endorser-header">
              {% if block.settings.avatar != blank %}
                {{ block.settings.avatar | image_url: width: 120 | image_tag: class: 'zhp-endorser-avatar', loading: 'lazy', alt: block.settings.name }}
              {% elsif block.settings.fallback_avatar != blank %}
                <img src="{{ block.settings.fallback_avatar }}" alt="{{ block.settings.name }}" class="zhp-endorser-avatar" loading="lazy">
              {% endif %}
              <div class="zhp-endorser-details">
                <h4>{{ block.settings.name }}</h4>
                <div class="zhp-endorser-role">{{ block.settings.role }}</div>
                <div class="zhp-endorser-handle">{{ block.settings.handle }}</div>
              </div>
            </div>
            <div class="zhp-endorsement-tag">{{ block.settings.tag }}</div>
            <blockquote class="zhp-endorsement-quote">
              "{{ block.settings.quote }}"
            </blockquote>
          </div>
        {% endfor %}
      </div>
    </div>
  </section>
</div>

{% schema %}
{
  "name": "06. Chuyên gia & Reviews",
  "settings": [
    {
      "type": "text",
      "id": "tag",
      "label": "Nhãn danh mục",
      "default": "EXPERT VOICES"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Tiêu đề",
      "default": "The Voices of Calm and Balance"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Mô tả phụ",
      "default": "Hear how renowned yoga instructors, authors, and percussionists use Zavelyn Drums to find serenity."
    }
  ],
  "blocks": [
    {
      "type": "endorser",
      "name": "Chuyên gia / Influencer",
      "settings": [
        {
          "type": "image_picker",
          "id": "avatar",
          "label": "Ảnh đại diện (Avatar)"
        },
        {
          "type": "text",
          "id": "fallback_avatar",
          "label": "URL ảnh dự phòng"
        },
        {
          "type": "text",
          "id": "name",
          "label": "Họ và tên",
          "default": "Radhi Devlukia"
        },
        {
          "type": "text",
          "id": "role",
          "label": "Chức danh",
          "default": "Co-Founder Sama Tea & Joyo Tea"
        },
        {
          "type": "text",
          "id": "handle",
          "label": "Handle / Followers",
          "default": "@radhidevlukia • 2.2M"
        },
        {
          "type": "text",
          "id": "tag",
          "label": "Chủ đề",
          "default": "INNER PEACE"
        },
        {
          "type": "textarea",
          "id": "quote",
          "label": "Lời nhận xét",
          "default": "When everything is noisy around me, this drum helps me find a corner of calm. It's my beautiful daily escape."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "06. Chuyên gia & Reviews",
      "blocks": [
        {
          "type": "endorser",
          "settings": {
            "name": "Radhi Devlukia",
            "role": "Co-Founder Sama Tea & Joyo Tea",
            "handle": "@radhidevlukia • 2.2M",
            "tag": "INNER PEACE",
            "quote": "When everything is noisy around me, this drum helps me find a corner of calm. It's my beautiful daily escape.",
            "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/radhi_v.avif?v=1697095497"
          }
        },
        {
          "type": "endorser",
          "settings": {
            "name": "Adam Green",
            "role": "Sound Practitioner & Creator",
            "handle": "@ethereal.in.e",
            "tag": "SOUND THERAPY",
            "quote": "The sounds of my drum make me feel good instantly. Everything seems brighter, calmer, and more joyful.",
            "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/adam_green.avif?v=1697097548"
          }
        },
        {
          "type": "endorser",
          "settings": {
            "name": "Bianca Oliveira",
            "role": "Certified Yoga Coach • Biancayoga",
            "handle": "@biancayoga",
            "tag": "YOGA & MINDFULNESS",
            "quote": "The drum adds extraordinary depth to our yoga sessions. My students can feel every movement and breath more deeply.",
            "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/bianca_green.avif?v=1697097548"
          }
        },
        {
          "type": "endorser",
          "settings": {
            "name": "Joana Duarte",
            "role": "Mindfulness Instructor & Author",
            "handle": "@joana____duarte • 0.5M",
            "tag": "HERE & NOW",
            "quote": "This drum brings me back here and now, away from anxious thoughts and worries. It feels like a long, deep exhale.",
            "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/joana_green.avif?v=1697097548"
          }
        },
        {
          "type": "endorser",
          "settings": {
            "name": "Steve Nguyen",
            "role": "Painter, Actor & Director",
            "handle": "@stevenguyen • 0.5M",
            "tag": "AUDITORY INSPIRATION",
            "quote": "When I'm stuck in my art, the acoustic vibration helps dissolve creative blocks. Fresh ideas start flowing naturally.",
            "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/steve_green.avif?v=1697097548"
          }
        },
        {
          "type": "endorser",
          "settings": {
            "name": "Taylor Dorothea",
            "role": "Percussion Influencer & Educator",
            "handle": "@taylor.dorothea • 0.5M",
            "tag": "LIVING RHYTHM",
            "quote": "Each drum has a story. Zavelyn speaks immediately to the heart and inspires me to share acoustic music everywhere.",
            "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/taylor_green.avif?v=1697097548"
          }
        }
      ]
    }
  ]
}
{% endschema %}
`;

// Section 7: Comparison Table
const comparisonLiquid = `
{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
<div class="zhp-wrapper">
  <section class="zhp-comparison-section" id="zhp-comparison">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">{{ section.settings.tag | default: 'SIDE BY SIDE' }}</span>
        <h2 class="zhp-section-title">{{ section.settings.title | default: 'Which Zavelyn Drum™ Should You Choose?' }}</h2>
        <p class="zhp-section-subtitle">{{ section.settings.subtitle | default: 'Compare all technical specifications, tone character, and included items across our 3 models.' }}</p>
      </div>

      <div class="zhp-table-responsive">
        <table class="zhp-comparison-table">
          <thead>
            <tr>
              <th class="zhp-col-feature">Feature / Spec</th>
              <th class="zhp-col-model">
                <div class="zhp-tbl-header-card">
                  <span class="zhp-tbl-badge zhp-badge-blue">KIDS & GIFTS</span>
                  <h4>Mini</h4>
                  <div class="zhp-tbl-tones">8 Tones • 6"</div>
                  <div class="zhp-tbl-price">$109.95</div>
                </div>
              </th>
              <th class="zhp-col-model zhp-tbl-col-popular">
                <div class="zhp-tbl-header-card">
                  <span class="zhp-tbl-badge zhp-badge-green">MOST POPULAR</span>
                  <h4>Plus</h4>
                  <div class="zhp-tbl-tones">11 Tones • 11"</div>
                  <div class="zhp-tbl-price">$159.95</div>
                </div>
              </th>
              <th class="zhp-col-model zhp-tbl-col-best">
                <div class="zhp-tbl-header-card">
                  <span class="zhp-tbl-badge zhp-badge-gold">BEST VALUE</span>
                  <h4>Pro</h4>
                  <div class="zhp-tbl-tones">15 Tones • 15"</div>
                  <div class="zhp-tbl-price">$259.95</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="zhp-cell-feature">Recommended Age</td>
              <td>All Ages / 3+</td>
              <td class="zhp-tbl-col-popular">4+ to Adult</td>
              <td class="zhp-tbl-col-best">12+ to Adult & Pros</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Musical Scale</td>
              <td>Pentatonic C-Major</td>
              <td class="zhp-tbl-col-popular">D-Major (11 Notes)</td>
              <td class="zhp-tbl-col-best">D-Major Chromatic (15 Notes)</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Tuning & Frequency</td>
              <td>Precision 432 Hz</td>
              <td class="zhp-tbl-col-popular">Natural 432 Hz Healing</td>
              <td class="zhp-tbl-col-best">432 Hz Deep Acoustic Chamber</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Learning Curve</td>
              <td>Extremely Easy (No fail)</td>
              <td class="zhp-tbl-col-popular">Very Easy (Play in 5 mins)</td>
              <td class="zhp-tbl-col-best">Easy to Advanced</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Sound Profile</td>
              <td>Sweet, joyful bell-like tones</td>
              <td class="zhp-tbl-col-popular">Warm, rich relaxing tones</td>
              <td class="zhp-tbl-col-best">Very deep, therapeutic resonance</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Included Gear</td>
              <td>Bag, 2 Mallets, Songbook</td>
              <td class="zhp-tbl-col-popular">Padded Shoulder Bag, Mallets, Picks, Book</td>
              <td class="zhp-tbl-col-best">Heavy-duty Backpack, Mallets, Picks, Book, Wool Wrap</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Best For</td>
              <td>Children, gifts, desk relaxation</td>
              <td class="zhp-tbl-col-popular">Family fun, versatile everyday use</td>
              <td class="zhp-tbl-col-best">Sound baths, yoga, meditation, recording</td>
            </tr>
            <tr>
              <td class="zhp-cell-feature">Warranty</td>
              <td>2-Year Warranty</td>
              <td class="zhp-tbl-col-popular">3-Year Warranty</td>
              <td class="zhp-tbl-col-best">Lifetime Serenity Guarantee</td>
            </tr>
            <tr class="zhp-tbl-actions-row">
              <td class="zhp-cell-feature">Select Model</td>
              <td><a href="/products/zavelyn-drum-mini" class="zhp-btn zhp-btn-sm zhp-btn-outline">Order Mini</a></td>
              <td class="zhp-tbl-col-popular"><a href="/products/zavelyn-drum-plus" class="zhp-btn zhp-btn-sm zhp-btn-primary">Order Plus</a></td>
              <td class="zhp-tbl-col-best"><a href="/products/zavelyn-drum-pro" class="zhp-btn zhp-btn-sm zhp-btn-gold">Order Pro</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</div>

{% schema %}
{
  "name": "07. Bảng so sánh",
  "settings": [
    {
      "type": "text",
      "id": "tag",
      "label": "Nhãn danh mục",
      "default": "SIDE BY SIDE"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Tiêu đề",
      "default": "Which Zavelyn Drum™ Should You Choose?"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Mô tả phụ",
      "default": "Compare all technical specifications, tone character, and included items across our 3 models."
    }
  ],
  "presets": [
    {
      "name": "07. Bảng so sánh"
    }
  ]
}
{% endschema %}
`;

// Section 8: Buyer's Guide
const buyersGuideLiquid = `
{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
<div class="zhp-wrapper">
  <section class="zhp-buyers-guide" id="zhp-buyers-guide">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">{{ section.settings.tag | default: 'ESSENTIAL KNOWLEDGE • 3 MIN READ' }}</span>
        <h2 class="zhp-section-title">{{ section.settings.title | default: "The Ultimate Zavelyn Drum™ Buyer's Guide" }}</h2>
        <p class="zhp-section-subtitle">{{ section.settings.subtitle | default: '5 Essential Facts That Make Zavelyn Drums a Top Pick for Wellness, Family, and Musicians.' }}</p>
      </div>

      <div class="zhp-guide-list">
        {% for block in section.blocks %}
          <div class="zhp-guide-item" {{ block.shopify_attributes }}>
            <div class="zhp-guide-number">{{ block.settings.number }}</div>
            <div class="zhp-guide-content">
              <div class="zhp-guide-tags">
                <span class="zhp-badge-pill">{{ block.settings.tags }}</span>
              </div>
              <h3>{{ block.settings.title }}</h3>
              <p>{{ block.settings.desc }}</p>
              <div class="zhp-guide-who"><strong>Who it's for:</strong> {{ block.settings.who }}</div>
            </div>
            <div class="zhp-guide-media">
              {% if block.settings.image != blank %}
                {{ block.settings.image | image_url: width: 600 | image_tag: loading: 'lazy', alt: block.settings.title }}
              {% elsif block.settings.fallback_image != blank %}
                <img src="{{ block.settings.fallback_image }}" alt="{{ block.settings.title }}" loading="lazy">
              {% endif %}
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </section>
</div>

{% schema %}
{
  "name": "08. Cẩm nang người mua",
  "settings": [
    {
      "type": "text",
      "id": "tag",
      "label": "Nhãn danh mục",
      "default": "ESSENTIAL KNOWLEDGE • 3 MIN READ"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Tiêu đề",
      "default": "The Ultimate Zavelyn Drum™ Buyer's Guide"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Mô tả phụ",
      "default": "5 Essential Facts That Make Zavelyn Drums a Top Pick for Wellness, Family, and Musicians."
    }
  ],
  "blocks": [
    {
      "type": "fact",
      "name": "Sự thật thiết yếu",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Ảnh minh họa (Thay thế nếu dính logo)"
        },
        {
          "type": "text",
          "id": "fallback_image",
          "label": "URL ảnh dự phòng"
        },
        {
          "type": "text",
          "id": "number",
          "label": "Số thứ tự",
          "default": "01"
        },
        {
          "type": "text",
          "id": "tags",
          "label": "Model áp dụng",
          "default": "Mini • 8 Tones, Plus • 11 Tones"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Tiêu đề",
          "default": "Awakening Inner Creativity"
        },
        {
          "type": "textarea",
          "id": "desc",
          "label": "Nội dung",
          "default": "You don't need a single hour of music lessons. Because our drums are harmonically tuned to pentatonic and diatonic scales, every single note sounds melodic with every other note."
        },
        {
          "type": "text",
          "id": "who",
          "label": "Đối tượng phù hợp",
          "default": "Beginners, revitalized musicians, curious creators, and anyone seeking a joyful hobby."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "08. Cẩm nang người mua",
      "blocks": [
        {
          "type": "fact",
          "settings": {
            "number": "01",
            "tags": "Mini • 8 Tones, Plus • 11 Tones",
            "title": "Awakening Inner Creativity",
            "desc": "You don't need a single hour of music lessons. Because our drums are harmonically tuned to pentatonic and diatonic scales, every single note sounds melodic with every other note. Whether you are a first-time musical adventurer or a lifelong learner reigniting an old passion, you can play captivating melodies from your very first tap.",
            "who": "Beginners, revitalized musicians, curious creators, and anyone seeking a joyful hobby.",
            "fallback_image": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-8.avif?v=1720589813"
          }
        },
        {
          "type": "fact",
          "settings": {
            "number": "02",
            "tags": "Plus • 11 Tones, Pro • 15 Tones",
            "title": "Fun for the Whole Family (Zero Screens Needed)",
            "desc": "Creating shared household memories has never been this harmonious. Zavelyn Drum Plus and Pro ensure every family member finds their rhythm, fostering meaningful bonding moments that last a lifetime while gently drawing children away from tablet and smartphone screens.",
            "who": "Families of every size, kids, parents, and grandparents playing together.",
            "fallback_image": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-9.avif?v=1720589813"
          }
        },
        {
          "type": "fact",
          "settings": {
            "number": "03",
            "tags": "Plus • 11 Tones, Pro • 15 Tones",
            "title": "Healing Resonance & Somatic Calming",
            "desc": "Embark on a sound journey where every note mends, resonates, and harmonizes. Scientific studies show that 432 Hz acoustic vibrations lower cortisol levels, quiet racing thoughts, and trigger natural somatic nervous system restoration. The handcrafted resonance chamber in the Pro 15 Tones delivers unparalleled immersion.",
            "who": "Sound healing therapists, yoga studios, meditation practitioners, and high-stress professionals.",
            "fallback_image": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-10.avif?v=1720589813"
          }
        },
        {
          "type": "fact",
          "settings": {
            "number": "04",
            "tags": "Plus • 11 Tones, Pro • 15 Tones",
            "title": "Making Music More Magical",
            "desc": "Elevate every tune, be it a bedtime lullaby, a campfire singalong, or an intricate studio recording. With 11 to 15 harmonic notes, songwriters and melophiles gain an expressive sonic flavor that blends acoustic bell-like purity with meditative sustained reverb.",
            "who": "Musicians, multi-instrumentalists, songwriters, and melody lovers.",
            "fallback_image": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-11.avif?v=1720589813"
          }
        },
        {
          "type": "fact",
          "settings": {
            "number": "05",
            "tags": "Mini • 8 Tones",
            "title": "Boost Your Child's Cognitive Development",
            "desc": "Unveil a world of musical wonder with the Zavelyn Drum™ Mini (8 Tones). Engineered for smaller hands, it cultivates hand-eye coordination, bilateral motor skills, and focused concentration while providing an instantly rewarding sensory experience.",
            "who": "Curious toddlers, young dreamers, and teachers seeking positive sensory tools.",
            "fallback_image": "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/panda-drum-6-inch-steel-tongue-drum.jpg?v=1792868532"
          }
        }
      ]
    }
  ]
}
{% endschema %}
`;

// Section 9: Reviews
const reviewsLiquid = `
{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
<div class="zhp-wrapper">
  <section class="zhp-reviews-section">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">{{ section.settings.tag | default: 'COMMUNITY VOICES' }}</span>
        <h2 class="zhp-section-title">{{ section.settings.title | default: 'What Our Customers Say' }}</h2>
        <p class="zhp-section-subtitle">{{ section.settings.subtitle | default: 'Real verified drummers sharing their journey of calm, focus, and musical joy.' }}</p>
        <div class="zhp-reviews-summary">
          <span class="zhp-stars">★★★★★</span>
          <strong>{{ section.settings.rating_text | default: '4.92 / 5.0 Average Rating' }}</strong>
          <span>Based on 72,000+ Verified Purchases Worldwide</span>
        </div>
      </div>

      <div class="zhp-reviews-grid">
        {% for block in section.blocks %}
          <div class="zhp-review-card" {{ block.shopify_attributes }}>
            <div class="zhp-review-header">
              <span class="zhp-stars">★★★★★</span>
              <span class="zhp-verified-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> Verified Buyer</span>
            </div>
            <h4 class="zhp-review-title">"{{ block.settings.title }}"</h4>
            <p class="zhp-review-text">{{ block.settings.text }}</p>
            <div class="zhp-reviewer-info">
              <strong>{{ block.settings.author }}</strong> — <span>{{ block.settings.badge }}</span>
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </section>
</div>

{% schema %}
{
  "name": "09. Đánh giá khách hàng",
  "settings": [
    {
      "type": "text",
      "id": "tag",
      "label": "Nhãn danh mục",
      "default": "COMMUNITY VOICES"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Tiêu đề",
      "default": "What Our Customers Say"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Mô tả phụ",
      "default": "Real verified drummers sharing their journey of calm, focus, and musical joy."
    },
    {
      "type": "text",
      "id": "rating_text",
      "label": "Điểm đánh giá",
      "default": "4.92 / 5.0 Average Rating"
    }
  ],
  "blocks": [
    {
      "type": "review",
      "name": "Đánh giá",
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Tiêu đề review",
          "default": "Touches deep into your soul..."
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Nội dung review",
          "default": "A truly magnificent instrument! The resonant sound touches so deeply. Playing for just ten minutes before bed has completely transformed my sleep quality."
        },
        {
          "type": "text",
          "id": "author",
          "label": "Tên khách hàng",
          "default": "Sarah M."
        },
        {
          "type": "text",
          "id": "badge",
          "label": "Huy hiệu xác nhận",
          "default": "Verified Owner of Zavelyn Drum™ Pro"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "09. Đánh giá khách hàng",
      "blocks": [
        {
          "type": "review",
          "settings": {
            "title": "Touches deep into your soul...",
            "text": "A truly magnificent instrument! The resonant sound touches so deeply. Playing for just ten minutes before bed has completely transformed my sleep quality. No musical talent needed, it just sings!",
            "author": "Sarah M.",
            "badge": "Verified Owner of Zavelyn Drum™ Pro"
          }
        },
        {
          "type": "review",
          "settings": {
            "title": "Brought our family together",
            "text": "Bought the Plus 11-tone for our living room. My kids (6 and 9) put down their iPads without even being asked. We pass it around every evening and make peaceful melodies together.",
            "author": "David & Elena T.",
            "badge": "Verified Owner of Zavelyn Drum™ Plus"
          }
        },
        {
          "type": "review",
          "settings": {
            "title": "Perfection for my yoga studio",
            "text": "The 432 Hz frequency is genuine. During savasana, playing soft tones on the Pro 15 creates goosebumps throughout the room. The finish and bag are top tier.",
            "author": "Chloe R.",
            "badge": "Yoga & Meditation Instructor"
          }
        }
      ]
    }
  ]
}
{% endschema %}
`;

// Section 10: FAQ
const faqLiquid = `
{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
{{ 'zhp-collection.js' | asset_url | script_tag }}
<div class="zhp-wrapper">
  <section class="zhp-faq-section" id="zhp-faq">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">{{ section.settings.tag | default: 'COMMON QUESTIONS' }}</span>
        <h2 class="zhp-section-title">{{ section.settings.title | default: 'Frequently Asked Questions' }}</h2>
        <p class="zhp-section-subtitle">{{ section.settings.subtitle | default: 'Everything you need to know about shipping, playing ease, and our 100% Happiness Guarantee.' }}</p>
      </div>

      <div class="zhp-faq-accordion">
        {% for block in section.blocks %}
          <div class="zhp-faq-item" {{ block.shopify_attributes }}>
            <button type="button" class="zhp-faq-question">
              <span>{{ block.settings.question }}</span>
              <span class="zhp-faq-icon">+</span>
            </button>
            <div class="zhp-faq-answer">
              {{ block.settings.answer }}
            </div>
          </div>
        {% endfor %}
      </div>

      <!-- Trust Bottom Guarantee Card -->
      <div class="zhp-guarantee-card">
        <div class="zhp-guarantee-icon">🛡️</div>
        <div class="zhp-guarantee-text">
          <h3>{{ section.settings.guarantee_title | default: '100% Risk-Free Happiness Guarantee' }}</h3>
          <p>{{ section.settings.guarantee_desc | default: 'Over 72,000+ drummers love Zavelyn. If it does not bring you peace and joy, our friendly support team is here to make it right with easy 30-day returns and dedicated lifetime customer care.' }}</p>
        </div>
      </div>
    </div>
  </section>
</div>

{% schema %}
{
  "name": "10. FAQ & Bảo hành",
  "settings": [
    {
      "type": "text",
      "id": "tag",
      "label": "Nhãn danh mục",
      "default": "COMMON QUESTIONS"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Tiêu đề",
      "default": "Frequently Asked Questions"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Mô tả phụ",
      "default": "Everything you need to know about shipping, playing ease, and our 100% Happiness Guarantee."
    },
    {
      "type": "text",
      "id": "guarantee_title",
      "label": "Tiêu đề cam kết",
      "default": "100% Risk-Free Happiness Guarantee"
    },
    {
      "type": "textarea",
      "id": "guarantee_desc",
      "label": "Mô tả cam kết",
      "default": "Over 72,000+ drummers love Zavelyn. If it does not bring you peace and joy, our friendly support team is here to make it right with easy 30-day returns and dedicated lifetime customer care."
    }
  ],
  "blocks": [
    {
      "type": "faq",
      "name": "Câu hỏi",
      "settings": [
        {
          "type": "text",
          "id": "question",
          "label": "Câu hỏi",
          "default": "How long does shipping take?"
        },
        {
          "type": "richtext",
          "id": "answer",
          "label": "Câu trả lời",
          "default": "<p>We provide FREE tracked shipping on all orders. US delivery: 4-9 days, UK/EU: 7-12 days.</p>"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "10. FAQ & Bảo hành",
      "blocks": [
        {
          "type": "faq",
          "settings": {
            "question": "How long does shipping take?",
            "answer": "<p>We provide <strong>FREE tracked shipping</strong> on all orders. Orders are processed within 1-3 business days. Estimated delivery times once dispatched: USA: 4-9 business days | UK: 7-12 business days | Australia & Europe: 7-12 business days | Canada: 7-18 business days.</p>"
          }
        },
        {
          "type": "faq",
          "settings": {
            "question": "Can literally anyone play a Zavelyn Drum?",
            "answer": "<p><strong>Yes, 100%!</strong> Zavelyn Drums are purposefully engineered with harmonic scales and clear numbered tone indicators. You do not need to read sheet music or have any musical background. Included in your box is a songbook with 20+ familiar songs using simple numbers, allowing anyone from young children to seniors to play captivating melodies within 5 minutes.</p>"
          }
        },
        {
          "type": "faq",
          "settings": {
            "question": "What is your 30-Day Happiness Guarantee?",
            "answer": "<p>We want you to experience genuine peace of mind. If for any reason you are not completely delighted with your Zavelyn Drum within 30 days of delivery, simply email our 24/7 support team. You can return your complete package for a hassle-free, full refund.</p>"
          }
        },
        {
          "type": "faq",
          "settings": {
            "question": "What comes included with my order?",
            "answer": "<p>Every Zavelyn Drum ships as a complete all-in-one set: your selected drum (Mini, Plus, or Pro), a custom-fitted anti-shock padded travel bag/backpack, 2 precision bamboo mallets with soft acoustic tips, fingertip picks for fingerstyle playing, tone stickers, and our full tutorial songbook.</p>"
          }
        },
        {
          "type": "faq",
          "settings": {
            "question": "Why is the 432 Hz frequency so special?",
            "answer": "<p>Unlike standard concert tuning (440 Hz), 432 Hz is known as the natural harmonic frequency of nature. Its acoustic wavelength produces warmer, softer tones that resonate with biological rhythms, promoting deep nervous system relaxation, stress reduction, and mental clarity.</p>"
          }
        }
      ]
    }
  ]
}
{% endschema %}
`;

const sectionsToUpload = [
  { key: 'assets/zhp-collection.css', value: cssContent },
  { key: 'assets/zhp-collection.js', value: jsContent },
  { key: 'sections/zhp-marquee.liquid', value: marqueeLiquid },
  { key: 'sections/zhp-hero.liquid', value: heroLiquid },
  { key: 'sections/zhp-bestsellers.liquid', value: bestsellersLiquid },
  { key: 'sections/zhp-model-tabs.liquid', value: modelTabsLiquid },
  { key: 'sections/zhp-what-you-get.liquid', value: whatYouGetLiquid },
  { key: 'sections/zhp-endorsements.liquid', value: endorsementsLiquid },
  { key: 'sections/zhp-comparison.liquid', value: comparisonLiquid },
  { key: 'sections/zhp-buyers-guide.liquid', value: buyersGuideLiquid },
  { key: 'sections/zhp-reviews.liquid', value: reviewsLiquid },
  { key: 'sections/zhp-faq.liquid', value: faqLiquid }
];

async function run() {
  const token = await getAccessToken();
  console.log('Got access token');

  for (const s of sectionsToUpload) {
    console.log(`Uploading ${s.key}...`);
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        asset: {
          key: s.key,
          value: s.value
        }
      })
    });
    const d = await res.json();
    if (d.asset) {
      console.log(`  ✔ Uploaded ${s.key}`);
    } else {
      console.error(`  ✖ Failed ${s.key}:`, d);
    }
  }

  // Now create the multi-section OS 2.0 template:
  const templateConfig = {
    name: "Zavelyn Handpans Collection",
    sections: {
      "zhp_marquee": {
        "type": "zhp-marquee",
        "settings": {}
      },
      "zhp_hero": {
        "type": "zhp-hero",
        "settings": {}
      },
      "zhp_bestsellers": {
        "type": "zhp-bestsellers",
        "settings": {}
      },
      "zhp_model_tabs": {
        "type": "zhp-model-tabs",
        "settings": {}
      },
      "zhp_what_you_get": {
        "type": "zhp-what-you-get",
        "blocks": {
          "item_1": {
            "type": "item",
            "settings": {
              "title": "Anti-Shock Travel Bag",
              "desc": "Thickly padded custom carrying bag with shoulder straps to keep your drum safe at home or on the road.",
              "fallback_image": "https://cdn.shopify.com/s/files/1/0772/9528/8652/files/Panda_Drum_bag_15t.avif?v=1693393541"
            }
          },
          "item_2": {
            "type": "item",
            "settings": {
              "title": "2x Bamboo Mallets",
              "desc": "Acoustically balanced bamboo mallets with soft rubber tips engineered for optimal resonance and pure bell tones.",
              "fallback_image": "https://cdn.shopify.com/s/files/1/0772/9528/8652/files/mallets15t.avif?v=1693393704"
            }
          },
          "item_3": {
            "type": "item",
            "settings": {
              "title": "Handcrafted Zavelyn Drum",
              "desc": "Master-tuned alloy steel tongue drum with permanent tone markings and laser-cut acoustic tongues.",
              "fallback_image": "https://cdn.shopify.com/s/files/1/0772/9528/8652/files/drum_15t.avif?v=1693393704"
            }
          },
          "item_4": {
            "type": "item",
            "settings": {
              "title": "Tutorial Songbook & Videos",
              "desc": "Comprehensive step-by-step guidebook containing 20+ songs plus QR codes for free online video lessons.",
              "fallback_image": "https://cdn.shopify.com/s/files/1/0772/9528/8652/files/book15t.avif?v=1693393704"
            }
          }
        },
        "block_order": ["item_1", "item_2", "item_3", "item_4"],
        "settings": {}
      },
      "zhp_endorsements": {
        "type": "zhp-endorsements",
        "blocks": {
          "endorser_1": {
            "type": "endorser",
            "settings": {
              "name": "Radhi Devlukia",
              "role": "Co-Founder Sama Tea & Joyo Tea",
              "handle": "@radhidevlukia • 2.2M",
              "tag": "INNER PEACE",
              "quote": "When everything is noisy around me, this drum helps me find a corner of calm. It's my beautiful daily escape.",
              "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/radhi_v.avif?v=1697095497"
            }
          },
          "endorser_2": {
            "type": "endorser",
            "settings": {
              "name": "Adam Green",
              "role": "Sound Practitioner & Creator",
              "handle": "@ethereal.in.e",
              "tag": "SOUND THERAPY",
              "quote": "The sounds of my drum make me feel good instantly. Everything seems brighter, calmer, and more joyful.",
              "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/adam_green.avif?v=1697097548"
            }
          },
          "endorser_3": {
            "type": "endorser",
            "settings": {
              "name": "Bianca Oliveira",
              "role": "Certified Yoga Coach • Biancayoga",
              "handle": "@biancayoga",
              "tag": "YOGA & MINDFULNESS",
              "quote": "The drum adds extraordinary depth to our yoga sessions. My students can feel every movement and breath more deeply.",
              "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/bianca_green.avif?v=1697097548"
            }
          },
          "endorser_4": {
            "type": "endorser",
            "settings": {
              "name": "Joana Duarte",
              "role": "Mindfulness Instructor & Author",
              "handle": "@joana____duarte • 0.5M",
              "tag": "HERE & NOW",
              "quote": "This drum brings me back here and now, away from worries. It feels like a long, deep exhale.",
              "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/joana_green.avif?v=1697097548"
            }
          },
          "endorser_5": {
            "type": "endorser",
            "settings": {
              "name": "Steve Nguyen",
              "role": "Painter, Actor & Director",
              "handle": "@stevenguyen • 0.5M",
              "tag": "AUDITORY INSPIRATION",
              "quote": "When I'm stuck in my art, the acoustic vibration helps dissolve creative blocks. Fresh ideas start flowing naturally.",
              "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/steve_green.avif?v=1697097548"
            }
          },
          "endorser_6": {
            "type": "endorser",
            "settings": {
              "name": "Taylor Dorothea",
              "role": "Percussion Influencer & Educator",
              "handle": "@taylor.dorothea • 0.5M",
              "tag": "LIVING RHYTHM",
              "quote": "Each drum has a story. Zavelyn speaks immediately to the heart and inspires me to share acoustic music everywhere.",
              "fallback_avatar": "https://cdn.shopify.com/s/files/1/0780/8362/1190/files/taylor_green.avif?v=1697097548"
            }
          }
        },
        "block_order": ["endorser_1", "endorser_2", "endorser_3", "endorser_4", "endorser_5", "endorser_6"],
        "settings": {}
      },
      "zhp_comparison": {
        "type": "zhp-comparison",
        "settings": {}
      },
      "zhp_buyers_guide": {
        "type": "zhp-buyers-guide",
        "blocks": {
          "fact_1": {
            "type": "fact",
            "settings": {
              "number": "01",
              "tags": "Mini • 8 Tones, Plus • 11 Tones",
              "title": "Awakening Inner Creativity",
              "desc": "You don't need a single hour of music lessons. Because our drums are harmonically tuned to pentatonic and diatonic scales, every single note sounds melodic with every other note. Whether you are a first-time musical adventurer or a lifelong learner reigniting an old passion, you can play captivating melodies from your very first tap.",
              "who": "Beginners, revitalized musicians, curious creators, and anyone seeking a joyful hobby.",
              "fallback_image": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-8.avif?v=1720589813"
            }
          },
          "fact_2": {
            "type": "fact",
            "settings": {
              "number": "02",
              "tags": "Plus • 11 Tones, Pro • 15 Tones",
              "title": "Fun for the Whole Family (Zero Screens Needed)",
              "desc": "Creating shared household memories has never been this harmonious. Zavelyn Drum Plus and Pro ensure every family member finds their rhythm, fostering meaningful bonding moments that last a lifetime while gently drawing children away from tablet and smartphone screens.",
              "who": "Families of every size, kids, parents, and grandparents playing together.",
              "fallback_image": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-9.avif?v=1720589813"
            }
          },
          "fact_3": {
            "type": "fact",
            "settings": {
              "number": "03",
              "tags": "Plus • 11 Tones, Pro • 15 Tones",
              "title": "Healing Resonance & Somatic Calming",
              "desc": "Embark on a sound journey where every note mends, resonates, and harmonizes. Scientific studies show that 432 Hz acoustic vibrations lower cortisol levels, quiet racing thoughts, and trigger natural somatic nervous system restoration. The handcrafted resonance chamber in the Pro 15 Tones delivers unparalleled immersion.",
              "who": "Sound healing therapists, yoga studios, meditation practitioners, and high-stress professionals.",
              "fallback_image": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-10.avif?v=1720589813"
            }
          },
          "fact_4": {
            "type": "fact",
            "settings": {
              "number": "04",
              "tags": "Plus • 11 Tones, Pro • 15 Tones",
              "title": "Making Music More Magical",
              "desc": "Elevate every tune, be it a bedtime lullaby, a campfire singalong, or an intricate studio recording. With 11 to 15 harmonic notes, songwriters and melophiles gain an expressive sonic flavor that blends acoustic bell-like purity with meditative sustained reverb.",
              "who": "Musicians, multi-instrumentalists, songwriters, and melody lovers.",
              "fallback_image": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Fena_-_IG_size-11.avif?v=1720589813"
            }
          },
          "fact_5": {
            "type": "fact",
            "settings": {
              "number": "05",
              "tags": "Mini • 8 Tones",
              "title": "Boost Your Child's Cognitive Development",
              "desc": "Unveil a world of musical wonder with the Zavelyn Drum™ Mini (8 Tones). Engineered for smaller hands, it cultivates hand-eye coordination, bilateral motor skills, and focused concentration while providing an instantly rewarding sensory experience.",
              "who": "Curious toddlers, young dreamers, and teachers seeking positive sensory tools.",
              "fallback_image": "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/panda-drum-6-inch-steel-tongue-drum.jpg?v=1792868532"
            }
          }
        },
        "block_order": ["fact_1", "fact_2", "fact_3", "fact_4", "fact_5"],
        "settings": {}
      },
      "zhp_reviews": {
        "type": "zhp-reviews",
        "blocks": {
          "review_1": {
            "type": "review",
            "settings": {
              "title": "Touches deep into your soul...",
              "text": "A truly magnificent instrument! The resonant sound touches so deeply. Playing for just ten minutes before bed has completely transformed my sleep quality. No musical talent needed, it just sings!",
              "author": "Sarah M.",
              "badge": "Verified Owner of Zavelyn Drum™ Pro"
            }
          },
          "review_2": {
            "type": "review",
            "settings": {
              "title": "Brought our family together",
              "text": "Bought the Plus 11-tone for our living room. My kids (6 and 9) put down their iPads without even being asked. We pass it around every evening and make peaceful melodies together.",
              "author": "David & Elena T.",
              "badge": "Verified Owner of Zavelyn Drum™ Plus"
            }
          },
          "review_3": {
            "type": "review",
            "settings": {
              "title": "Perfection for my yoga studio",
              "text": "The 432 Hz frequency is genuine. During savasana, playing soft tones on the Pro 15 creates goosebumps throughout the room. The finish and bag are top tier.",
              "author": "Chloe R.",
              "badge": "Yoga & Meditation Instructor"
            }
          }
        },
        "block_order": ["review_1", "review_2", "review_3"],
        "settings": {}
      },
      "zhp_faq": {
        "type": "zhp-faq",
        "blocks": {
          "faq_1": {
            "type": "faq",
            "settings": {
              "question": "How long does shipping take?",
              "answer": "<p>We provide <strong>FREE tracked shipping</strong> on all orders. Orders are processed within 1-3 business days. Estimated delivery times once dispatched: USA: 4-9 business days | UK: 7-12 business days | Australia & Europe: 7-12 business days | Canada: 7-18 business days.</p>"
            }
          },
          "faq_2": {
            "type": "faq",
            "settings": {
              "question": "Can literally anyone play a Zavelyn Drum?",
              "answer": "<p><strong>Yes, 100%!</strong> Zavelyn Drums are purposefully engineered with harmonic scales and clear numbered tone indicators. You do not need to read sheet music or have any musical background. Included in your box is a songbook with 20+ familiar songs using simple numbers, allowing anyone from young children to seniors to play captivating melodies within 5 minutes.</p>"
            }
          },
          "faq_3": {
            "type": "faq",
            "settings": {
              "question": "What is your 30-Day Happiness Guarantee?",
              "answer": "<p>We want you to experience genuine peace of mind. If for any reason you are not completely delighted with your Zavelyn Drum within 30 days of delivery, simply email our 24/7 support team. You can return your complete package for a hassle-free, full refund.</p>"
            }
          },
          "faq_4": {
            "type": "faq",
            "settings": {
              "question": "What comes included with my order?",
              "answer": "<p>Every Zavelyn Drum ships as a complete all-in-one set: your selected drum (Mini, Plus, or Pro), a custom-fitted anti-shock padded travel bag/backpack, 2 precision bamboo mallets with soft acoustic tips, fingertip picks for fingerstyle playing, tone stickers, and our full tutorial songbook.</p>"
            }
          },
          "faq_5": {
            "type": "faq",
            "settings": {
              "question": "Why is the 432 Hz frequency so special?",
              "answer": "<p>Unlike standard concert tuning (440 Hz), 432 Hz is known as the natural harmonic frequency of nature. Its acoustic wavelength produces warmer, softer tones that resonate with biological rhythms, promoting deep nervous system relaxation, stress reduction, and mental clarity.</p>"
            }
          }
        },
        "block_order": ["faq_1", "faq_2", "faq_3", "faq_4", "faq_5"],
        "settings": {}
      }
    },
    order: [
      "zhp_marquee",
      "zhp_hero",
      "zhp_bestsellers",
      "zhp_model_tabs",
      "zhp_what_you_get",
      "zhp_endorsements",
      "zhp_comparison",
      "zhp_buyers_guide",
      "zhp_reviews",
      "zhp_faq"
    ]
  };

  const tplJson = JSON.stringify(templateConfig, null, 2);

  // Upload templates/collection.zavelyn-handpans.json
  console.log('Uploading templates/collection.zavelyn-handpans.json...');
  const tplRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'templates/collection.zavelyn-handpans.json',
        value: tplJson
      }
    })
  });
  console.log('Collection template result:', (await tplRes.json()).asset ? 'SUCCESS' : 'FAILED');

  // Upload templates/page.zavelyn-handpans.json
  console.log('Uploading templates/page.zavelyn-handpans.json...');
  const pageTplRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'templates/page.zavelyn-handpans.json',
        value: tplJson
      }
    })
  });
  console.log('Page template result:', (await pageTplRes.json()).asset ? 'SUCCESS' : 'FAILED');
}

run().catch(console.error);
