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

const liquidBody = `{{ 'zhp-collection.css' | asset_url | stylesheet_tag }}
{{ 'zhp-collection.js' | asset_url | script_tag }}
<div class="zhp-wrapper">
  <section class="zhp-bestsellers" id="zhp-bestsellers">
    <div class="zhp-container">
      <div class="zhp-section-header">
        <span class="zhp-tag">{{ section.settings.tag | default: 'OUR COLLECTION' }}</span>
        <h2 class="zhp-section-title">{{ section.settings.title | default: "Zavelyn Drums™ You'll Love" }}</h2>
        <p class="zhp-section-subtitle">{{ section.settings.subtitle | default: "Save up to 48% today. Every instrument includes a complete starter kit, padded bag, bamboo mallets, and tutorial songbook." }}</p>
      </div>

      <div class="zhp-product-grid">
        {% for block in section.blocks %}
          <div class="zhp-product-card {% if block.settings.badge_type == 'gold' %}zhp-card-featured{% elsif block.settings.badge_type == 'green' %}zhp-card-popular{% endif %}" {{ block.shopify_attributes }}>
            {% if block.settings.badge_text != blank %}
              <div class="zhp-card-badge {% if block.settings.badge_type == 'gold' %}zhp-badge-gold{% elsif block.settings.badge_type == 'green' %}zhp-badge-green{% else %}zhp-badge-blue{% endif %}">
                {{ block.settings.badge_text }}
              </div>
            {% endif %}

            <div class="zhp-card-media">
              <a href="{{ block.settings.product_url | default: '#' }}">
                {% if block.settings.image != blank %}
                  {{ block.settings.image | image_url: width: 600 | image_tag: class: 'zhp-card-img', loading: 'lazy', alt: block.settings.title }}
                {% elsif block.settings.fallback_image != blank %}
                  <img src="{{ block.settings.fallback_image }}" alt="{{ block.settings.title }}" class="zhp-card-img" loading="lazy">
                {% endif %}
              </a>
            </div>

            <div class="zhp-card-content">
              <div class="zhp-card-rating">
                <span class="zhp-stars">{{ block.settings.rating | default: '★★★★★' }}</span>
                <span class="zhp-review-count">{{ block.settings.reviews_count | default: '(500+ reviews)' }}</span>
              </div>
              <h3 class="zhp-card-title"><a href="{{ block.settings.product_url | default: '#' }}">{{ block.settings.title }}</a></h3>
              <div class="zhp-card-meta">{{ block.settings.meta }}</div>

              <ul class="zhp-card-features">
                {% if block.settings.feature_1 != blank %}<li>{{ block.settings.feature_1 }}</li>{% endif %}
                {% if block.settings.feature_2 != blank %}<li>{{ block.settings.feature_2 }}</li>{% endif %}
                {% if block.settings.feature_3 != blank %}<li>{{ block.settings.feature_3 }}</li>{% endif %}
              </ul>

              {% if block.settings.audio_url != blank %}
                <div class="zhp-audio-player" data-audio-src="{{ block.settings.audio_url }}">
                  <button type="button" class="zhp-audio-btn" aria-label="Play sound preview">
                    <svg class="zhp-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    <svg class="zhp-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  </button>
                  <div class="zhp-audio-info">
                    <span class="zhp-audio-label">{{ block.settings.audio_label | default: 'Hear it in action:' }}</span>
                    <div class="zhp-audio-bar"><div class="zhp-audio-progress"></div></div>
                  </div>
                </div>
              {% endif %}

              <div class="zhp-card-package">
                <div class="zhp-package-title">{{ block.settings.package_title | default: "What's Included:" }}</div>
                <div class="zhp-package-tags">
                  {% if block.settings.tag_1 != blank %}<span>{{ block.settings.tag_1 }}</span>{% endif %}
                  {% if block.settings.tag_2 != blank %}<span>{{ block.settings.tag_2 }}</span>{% endif %}
                  {% if block.settings.tag_3 != blank %}<span>{{ block.settings.tag_3 }}</span>{% endif %}
                  {% if block.settings.tag_4 != blank %}<span>{{ block.settings.tag_4 }}</span>{% endif %}
                  {% if block.settings.tag_5 != blank %}<span>{{ block.settings.tag_5 }}</span>{% endif %}
                </div>
              </div>

              <div class="zhp-card-pricing">
                <span class="zhp-price-current">{{ block.settings.price }}</span>
                {% if block.settings.compare_price != blank %}
                  <span class="zhp-price-compare">{{ block.settings.compare_price }}</span>
                {% endif %}
                {% if block.settings.save_text != blank %}
                  <span class="zhp-price-save">{{ block.settings.save_text }}</span>
                {% endif %}
              </div>

              <a href="{{ block.settings.product_url | default: '#' }}" class="zhp-btn zhp-btn-block zhp-btn-cart">{{ block.settings.btn_text | default: 'SELECT COLOR & ORDER' }}</a>
              {% if block.settings.guarantee_text != blank %}
                <div class="zhp-card-guarantee">{{ block.settings.guarantee_text }}</div>
              {% endif %}
            </div>
          </div>
        {% endfor %}
      </div>
    </div>
  </section>
</div>
`;

const schemaObj = {
  name: "03. Bộ 3 Sản phẩm",
  settings: [
    {
      type: "text",
      id: "tag",
      label: "Nhãn danh mục",
      default: "OUR COLLECTION"
    },
    {
      type: "text",
      id: "title",
      label: "Tiêu đề",
      default: "Zavelyn Drums™ You'll Love"
    },
    {
      type: "textarea",
      id: "subtitle",
      label: "Mô tả phụ",
      default: "Save up to 48% today. Every instrument includes a complete starter kit, padded bag, bamboo mallets, and tutorial songbook."
    }
  ],
  blocks: [
    {
      type: "product_card",
      name: "Sản phẩm",
      settings: [
        {
          type: "image_picker",
          id: "image",
          label: "Ảnh sản phẩm (Chọn ảnh bạn đã fix)"
        },
        {
          type: "text",
          id: "fallback_image",
          label: "URL ảnh dự phòng"
        },
        {
          type: "text",
          id: "badge_text",
          label: "Huy hiệu (Badge)",
          default: "BEST VALUE • SAVE 48%"
        },
        {
          type: "select",
          id: "badge_type",
          label: "Màu huy hiệu",
          options: [
            { value: "gold", label: "Vàng cam (Gold)" },
            { value: "green", label: "Xanh lá (Green)" },
            { value: "blue", label: "Xanh dương (Blue)" }
          ],
          default: "gold"
        },
        {
          type: "text",
          id: "rating",
          label: "Sao đánh giá",
          default: "★★★★★"
        },
        {
          type: "text",
          id: "reviews_count",
          label: "Số lượng đánh giá",
          default: "(571 reviews)"
        },
        {
          type: "text",
          id: "title",
          label: "Tên sản phẩm",
          default: "Zavelyn Drum™ Pro"
        },
        {
          type: "url",
          id: "product_url",
          label: "Link sản phẩm"
        },
        {
          type: "text",
          id: "meta",
          label: "Dòng phụ",
          default: "Rich sound • 15\" • 15 Tones (D-Major)"
        },
        {
          type: "header",
          content: "3 Tính năng nổi bật"
        },
        {
          type: "text",
          id: "feature_1",
          label: "Tính năng 1",
          default: "✓ Broadest 15-note chromatic range for infinite melodies"
        },
        {
          type: "text",
          id: "feature_2",
          label: "Tính năng 2",
          default: "✓ Deep resonant chamber with acoustic warmth"
        },
        {
          type: "text",
          id: "feature_3",
          label: "Tính năng 3",
          default: "✓ Handcrafted alloy steel with woolen edge wrap"
        },
        {
          type: "header",
          content: "Âm thanh nghe thử (Audio)"
        },
        {
          type: "text",
          id: "audio_url",
          label: "URL file audio MP3",
          default: "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Pro_Sound_Bar_v2.mp3"
        },
        {
          type: "text",
          id: "audio_label",
          label: "Nhãn thanh nghe thử",
          default: "Hear it in action: Pro (15 Tones)"
        },
        {
          type: "header",
          content: "Phụ kiện đi kèm trong hộp"
        },
        {
          type: "text",
          id: "package_title",
          label: "Tiêu đề phụ kiện",
          default: "What's Included:"
        },
        {
          type: "text",
          id: "tag_1",
          label: "Phụ kiện 1",
          default: "Zavelyn Pro 15\""
        },
        {
          type: "text",
          id: "tag_2",
          label: "Phụ kiện 2",
          default: "FREE Travel Backpack"
        },
        {
          type: "text",
          id: "tag_3",
          label: "Phụ kiện 3",
          default: "FREE Bamboo Mallets"
        },
        {
          type: "text",
          id: "tag_4",
          label: "Phụ kiện 4",
          default: "FREE Songbook (20+ songs)"
        },
        {
          type: "text",
          id: "tag_5",
          label: "Phụ kiện 5",
          default: "Braided Wool Wrap"
        },
        {
          type: "header",
          content: "Giá và Nút đặt hàng"
        },
        {
          type: "text",
          id: "price",
          label: "Giá bán",
          default: "$259.95"
        },
        {
          type: "text",
          id: "compare_price",
          label: "Giá gốc",
          default: "$499.95"
        },
        {
          type: "text",
          id: "save_text",
          label: "Tiết kiệm",
          default: "Save $240.00"
        },
        {
          type: "text",
          id: "btn_text",
          label: "Nút bấm",
          default: "SELECT COLOR & ORDER"
        },
        {
          type: "text",
          id: "guarantee_text",
          label: "Cam kết chân thẻ",
          default: "🛡️ 30-Day Money Back • Lifetime Serenity Warranty"
        }
      ]
    }
  ],
  presets: [
    {
      name: "03. Bộ 3 Sản phẩm"
    }
  ]
};

const fullLiquid = `${liquidBody}

{% schema %}
${JSON.stringify(schemaObj, null, 2)}
{% endschema %}
`;

async function run() {
  const token = await getAccessToken();
  console.log('Got access token');

  // 1. Upload sections/zhp-bestsellers.liquid
  console.log('Uploading valid sections/zhp-bestsellers.liquid...');
  const secRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/zhp-bestsellers.liquid',
        value: fullLiquid
      }
    })
  });
  const secData = await secRes.json();
  console.log('Section update result:', secData.asset ? 'SUCCESS' : secData);
  if (!secData.asset) {
    console.error('Schema error details:', JSON.stringify(secData, null, 2));
    return;
  }

  // 2. Fetch the latest live template to ensure 100% up-to-date user images
  const tplFetch = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=templates/collection.zavelyn-handpans.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const tplFetchData = await tplFetch.json();
  const liveTpl = JSON.parse(tplFetchData.asset.value);

  // Preserve user's fixed images
  const userProImg = 'shopify://shop_images/tr-ng-en-n-n-trong-su-t.png';
  const userPlusImg = 'shopify://shop_images/tr-ng-tr-ng-n-n-trong-su-t.png';
  const userMiniImg = 'shopify://shop_images/tr-ng-v-ng-n-n-trong-su-t.png';

  console.log('Preserving User Fixed Images:');
  console.log('  Pro Image:', userProImg);
  console.log('  Plus Image:', userPlusImg);
  console.log('  Mini Image:', userMiniImg);

  // Construct 3 blocks inside zhp_bestsellers
  liveTpl.sections.zhp_bestsellers = {
    type: 'zhp-bestsellers',
    blocks: {
      "product_pro": {
        "type": "product_card",
        "settings": {
          "image": userProImg,
          "fallback_image": "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/PandaDrumPro_White.webp?v=1792868508",
          "badge_text": "BEST VALUE • SAVE 48%",
          "badge_type": "gold",
          "rating": "★★★★★",
          "reviews_count": "(571 reviews)",
          "title": "Zavelyn Drum™ Pro",
          "product_url": "/products/zavelyn-drum-pro",
          "meta": "Rich sound • 15\" • 15 Tones (D-Major)",
          "feature_1": "✓ Broadest 15-note chromatic range for infinite melodies",
          "feature_2": "✓ Deep resonant chamber with acoustic warmth",
          "feature_3": "✓ Handcrafted alloy steel with woolen edge wrap",
          "audio_url": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Pro_Sound_Bar_v2.mp3",
          "audio_label": "Hear it in action: Pro (15 Tones)",
          "package_title": "What's Included:",
          "tag_1": "Zavelyn Pro 15\"",
          "tag_2": "FREE Travel Backpack",
          "tag_3": "FREE Bamboo Mallets",
          "tag_4": "FREE Songbook (20+ songs)",
          "tag_5": "Braided Wool Wrap",
          "price": "$259.95",
          "compare_price": "$499.95",
          "save_text": "Save $240.00",
          "btn_text": "SELECT COLOR & ORDER",
          "guarantee_text": "🛡️ 30-Day Money Back • Lifetime Serenity Warranty"
        }
      },
      "product_plus": {
        "type": "product_card",
        "settings": {
          "image": userPlusImg,
          "fallback_image": "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/PandaDrum_Plus_White.webp?v=1792868520",
          "badge_text": "MOST POPULAR • SAVE 47%",
          "badge_type": "green",
          "rating": "★★★★★",
          "reviews_count": "(690 reviews)",
          "title": "Zavelyn Drum™ Plus",
          "product_url": "/products/zavelyn-drum-plus",
          "meta": "Most versatile • 11\" • 11 Tones (D-Major)",
          "feature_1": "✓ Ideal balance between portability and musical depth",
          "feature_2": "✓ Tuned to pure 432 Hz healing relaxation frequency",
          "feature_3": "✓ Perfect for family bonding, yoga, and meditation",
          "audio_url": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Plus_Sound_Bar_v2.mp3",
          "audio_label": "Hear it in action: Plus (11 Tones)",
          "package_title": "What's Included:",
          "tag_1": "Zavelyn Plus 11\"",
          "tag_2": "FREE Travel Shoulder Bag",
          "tag_3": "FREE Bamboo Mallets",
          "tag_4": "FREE Songbook (20+ songs)",
          "tag_5": "Fingertip Picks",
          "price": "$159.95",
          "compare_price": "$299.95",
          "save_text": "Save $140.00",
          "btn_text": "SELECT COLOR & ORDER",
          "guarantee_text": "🛡️ 30-Day Money Back • 3-Year Quality Warranty"
        }
      },
      "product_mini": {
        "type": "product_card",
        "settings": {
          "image": userMiniImg,
          "fallback_image": "https://cdn.shopify.com/s/files/1/0826/2483/9865/files/Mini_white.webp?v=1792868532",
          "badge_text": "BEST FOR KIDS & GIFTS • SAVE 39%",
          "badge_type": "blue",
          "rating": "★★★★★",
          "reviews_count": "(503 reviews)",
          "title": "Zavelyn Drum™ Mini",
          "product_url": "/products/zavelyn-drum-mini",
          "meta": "Best for kids • 6\" • 8 Tones (C-Major)",
          "feature_1": "✓ Ultra-lightweight (1.5 lbs) and portable for tiny hands",
          "feature_2": "✓ Intuitive pentatonic scale - impossible to hit a wrong note",
          "feature_3": "✓ Spark musical curiosity and peaceful playtime",
          "audio_url": "https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_Sound_Bar_v2.mp3",
          "audio_label": "Hear it in action: Mini (8 Tones)",
          "package_title": "What's Included:",
          "tag_1": "Zavelyn Mini 6\"",
          "tag_2": "FREE Travel Pouch",
          "tag_3": "FREE Mallets",
          "tag_4": "FREE Songbook (20+ songs)",
          "tag_5": "Tone Stickers",
          "price": "$109.95",
          "compare_price": "$179.95",
          "save_text": "Save $70.00",
          "btn_text": "SELECT COLOR & ORDER",
          "guarantee_text": "🛡️ 30-Day Money Back • 2-Year Warranty"
        }
      }
    },
    block_order: ["product_pro", "product_plus", "product_mini"],
    settings: {
      "tag": "OUR COLLECTION",
      "title": "Zavelyn Drums™ You'll Love",
      "subtitle": "Save up to 48% today. Every instrument includes a complete starter kit, padded bag, bamboo mallets, and tutorial songbook."
    }
  };

  const updatedTplJson = JSON.stringify(liveTpl, null, 2);

  // 3. Upload to templates/collection.zavelyn-handpans.json
  console.log('Uploading updated templates/collection.zavelyn-handpans.json with preserved images...');
  const putTplRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'templates/collection.zavelyn-handpans.json',
        value: updatedTplJson
      }
    })
  });
  const putTplData = await putTplRes.json();
  console.log('Collection template upload result:', putTplData.asset ? 'SUCCESS' : putTplData);

  // 4. Upload to templates/page.zavelyn-handpans.json
  console.log('Uploading updated templates/page.zavelyn-handpans.json with preserved images...');
  const putPageTplRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'templates/page.zavelyn-handpans.json',
        value: updatedTplJson
      }
    })
  });
  const putPageTplData = await putPageTplRes.json();
  console.log('Page template upload result:', putPageTplData.asset ? 'SUCCESS' : putPageTplData);
}

run().catch(console.error);
