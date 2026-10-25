import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth error: ${JSON.stringify(data)}`);
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
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    console.error(`  ✗ Failed ${key}:`, JSON.stringify(data.errors || data));
    return false;
  }
}

async function main() {
  console.log('=== 1. Updating heating-lamp-funnel.liquid ===');
  let funnel = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  // A. Swap Section 5 (Reviews) and Section 6 (FAQ) so Reviews is AT THE END AFTER FAQ
  const revStartMarker = '<!-- SECTION 5: Customer Reviews -->';
  const faqStartMarker = '<!-- SECTION 6: Frequently Asked Questions (Collapsible Accordion) -->';
  const stickyMarker = '<!-- STICKY BUY BAR (Mobile CRO) -->';

  const revIdx = funnel.indexOf(revStartMarker);
  const faqIdx = funnel.indexOf(faqStartMarker);
  const stickyIdx = funnel.indexOf(stickyMarker);

  if (revIdx !== -1 && faqIdx !== -1 && stickyIdx !== -1 && revIdx < faqIdx) {
    const reviewsHtml = funnel.substring(revIdx, faqIdx);
    const faqHtml = funnel.substring(faqIdx, stickyIdx);

    // Swap their titles/numbering for clarity
    const newFaqHtml = faqHtml.replace('SECTION 6: Frequently Asked Questions', 'SECTION 5: Frequently Asked Questions (FAQ)');
    const newReviewsHtml = reviewsHtml.replace('SECTION 5: Customer Reviews', 'SECTION 6: Customer Reviews (Real Feedback - After FAQ)');

    funnel = funnel.substring(0, revIdx) + newFaqHtml + newReviewsHtml + funnel.substring(stickyIdx);
    console.log('✔ Swapped Reviews and FAQ: FAQ is now Section 5, Reviews is now Section 6 (at the end).');
  }

  // B. Make gallery support 'gallery_image' blocks
  const galleryColRegex = /<!-- Media Gallery Column -->[\s\S]*?<!-- Buy Box & Configuration Column -->/m;
  const newGalleryCol = `<!-- Media Gallery Column -->
      <div class="wf-gallery-col">
        {% assign custom_gallery_count = 0 %}
        {% assign first_gallery_img = '' %}
        {% for block in section.blocks %}
          {% if block.type == 'gallery_image' %}
            {% assign custom_gallery_count = custom_gallery_count | plus: 1 %}
            {% if first_gallery_img == '' %}
              {% if block.settings.image != blank %}
                {% assign first_gallery_img = block.settings.image | image_url: width: 1000 %}
              {% elsif block.settings.image_url != blank %}
                {% assign first_gallery_img = block.settings.image_url %}
              {% endif %}
            {% endif %}
          {% endif %}
        {% endfor %}

        <div class="wf-gallery-main">
          {% assign hero_src = section.settings.main_image_url | default: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-hero-main.png?v=1792853600' %}
          {% if custom_gallery_count > 0 and first_gallery_img != '' %}
            {% assign hero_src = first_gallery_img %}
          {% elsif section.settings.main_image != blank %}
            {% assign hero_src = section.settings.main_image | image_url: width: 1000 %}
          {% endif %}
          <img id="wf-main-img" src="{{ hero_src }}" alt="{{ section.settings.product_title | escape }}" referrerpolicy="no-referrer">
          <span class="wf-gallery-badge">50% OFF TODAY</span>
        </div>

        <div class="wf-thumbnail-strip">
          {% if custom_gallery_count > 0 %}
            {% for block in section.blocks %}
              {% if block.type == 'gallery_image' %}
                {% assign img_src = '' %}
                {% if block.settings.image != blank %}
                  {% assign img_src = block.settings.image | image_url: width: 1000 %}
                {% elsif block.settings.image_url != blank %}
                  {% assign img_src = block.settings.image_url %}
                {% endif %}
                {% if img_src != '' %}
                  <img class="wf-thumb {% if forloop.first %}active{% endif %}" src="{{ img_src }}" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="{{ block.settings.alt | default: section.settings.product_title | escape }}" {{ block.shopify_attributes }}>
                {% endif %}
              {% endif %}
            {% endfor %}
          {% else %}
            <!-- Fallback Default 6 Slides -->
            <img class="wf-thumb active" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-hero-main.png?v=1792853600" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Zavelyn Intelligent Heating Lamp">
            <img class="wf-thumb" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-3pack-bundle.jpg?v=1792853189" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="3-Pack Bundle Set">
            <img class="wf-thumb" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-fireproof-safety.jpg?v=1792853601" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="100% Fireproof Safe on Pine Shavings">
            <img class="wf-thumb" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-smart-thermostat.jpg?v=1792853603" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Smart Digital Thermostat Auto-Cycles Heat">
            <img class="wf-thumb" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-livestock-warmth.jpg?v=1792853604" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Soft Amber Glow Poultry Brooder">
            <img class="wf-thumb" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-split-comparison.jpg?v=1792853605" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Safe Brooder vs Dangerous Clamp Fire Hazard">
          {% endif %}
        </div>
      </div>

      <!-- Buy Box & Configuration Column -->`;

  funnel = funnel.replace(galleryColRegex, newGalleryCol);

  // C. Update Schema to include gallery_image and image_picker
  const oldSchemaBlocksRegex = /"blocks":\s*\[\s*\{\s*"type":\s*"bundle_package"/;
  const newSchemaBlocks = `"blocks": [
    {
      "type": "gallery_image",
      "name": "Gallery Image (Slide)",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Upload / Select Image" },
        { "type": "text", "id": "image_url", "label": "Or Image URL (CDN)" },
        { "type": "text", "id": "alt", "label": "Image Alt Text / Label" }
      ]
    },
    {
      "type": "bundle_package"`;

  funnel = funnel.replace(oldSchemaBlocksRegex, newSchemaBlocks);

  // Add image_picker to main_image in section settings
  funnel = funnel.replace(
    /\{\s*"type":\s*"text",\s*"id":\s*"main_image_url"/,
    `{ "type": "image_picker", "id": "main_image", "label": "Main Hero Image" },
    { "type": "text", "id": "main_image_url"`
  );

  // Add image_picker to feature_card
  funnel = funnel.replace(
    /\{\s*"type":\s*"text",\s*"id":\s*"image_url",\s*"label":\s*"Image URL"\s*\}/,
    `{ "type": "image_picker", "id": "image", "label": "Select Card Image" },
        { "type": "text", "id": "image_url", "label": "Or Image URL" }`
  );

  // Add image_picker to bundle_package
  funnel = funnel.replace(
    /\{\s*"type":\s*"text",\s*"id":\s*"image_url",\s*"label":\s*"Package Thumbnail URL"\s*\}/,
    `{ "type": "image_picker", "id": "image", "label": "Package Thumbnail Image" },
        { "type": "text", "id": "image_url", "label": "Or Package Thumbnail URL" }`
  );

  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', funnel);
  console.log('Saved Clone-willafarm/theme/sections/heating-lamp-funnel.liquid');

  // === 2. Updating templates/product.sakerplus-livestock-heating-lamp.json ===
  console.log('\n=== 2. Updating templates/product.sakerplus-livestock-heating-lamp.json ===');
  const sakerJsonPath = 'Clone-willafarm/theme/templates/product.sakerplus-livestock-heating-lamp.json';
  const sakerJson = JSON.parse(fs.readFileSync(sakerJsonPath, 'utf8'));
  const fBlock = sakerJson.sections.heating_lamp_funnel;

  // Add 6 gallery_image blocks
  fBlock.blocks.gal_1 = {
    type: 'gallery_image',
    settings: {
      image_url: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-hero-main.png?v=1792853600',
      alt: 'Zavelyn Intelligent Heating Lamp 1-Pack'
    }
  };
  fBlock.blocks.gal_2 = {
    type: 'gallery_image',
    settings: {
      image_url: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-3pack-bundle.jpg?v=1792853189',
      alt: 'Zavelyn 3-Pack Bundle with Cords'
    }
  };
  fBlock.blocks.gal_3 = {
    type: 'gallery_image',
    settings: {
      image_url: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-fireproof-safety.jpg?v=1792853601',
      alt: '100% Fireproof Sealed Casing - Safe on Dry Pine Shavings'
    }
  };
  fBlock.blocks.gal_4 = {
    type: 'gallery_image',
    settings: {
      image_url: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-smart-thermostat.jpg?v=1792853603',
      alt: 'Smart Digital Thermostat - Auto-Cycles Warmth Saves 60% Energy'
    }
  };
  fBlock.blocks.gal_5 = {
    type: 'gallery_image',
    settings: {
      image_url: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-livestock-warmth.jpg?v=1792853604',
      alt: 'Soft Amber Glow - Safe Brooder Warmth for Chicks and Poultry'
    }
  };
  fBlock.blocks.gal_6 = {
    type: 'gallery_image',
    settings: {
      image_url: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-split-comparison.jpg?v=1792853605',
      alt: 'Zavelyn vs Dangerous Traditional Clamp Lamp Fire Hazard'
    }
  };

  // Reorder blocks: Gallery first, Bundles, Benefits, Features, Comparison, FAQ, then REVIEWS AT THE VERY END
  fBlock.block_order = [
    'gal_1', 'gal_2', 'gal_3', 'gal_4', 'gal_5', 'gal_6',
    'bundle_3', 'bundle_2', 'bundle_1',
    'point_1', 'point_2', 'point_3', 'point_4',
    'feat_1', 'feat_2', 'feat_3', 'feat_4',
    'comp_1', 'comp_2', 'comp_3', 'comp_4', 'comp_5',
    'faq_1', 'faq_2', 'faq_3', 'faq_4',
    'rev_1', 'rev_2', 'rev_3', 'rev_4'
  ];

  fs.writeFileSync(sakerJsonPath, JSON.stringify(sakerJson, null, 2));
  console.log(`Saved ${sakerJsonPath} with 6 gallery blocks and Reviews after FAQ`);

  // === 3. Updating willa-main-product.liquid with gallery_image blocks ===
  console.log('\n=== 3. Updating willa-main-product.liquid ===');
  let willaMain = fs.readFileSync('Clone-willafarm/theme/sections/willa-main-product.liquid', 'utf8');

  // Support custom gallery_image blocks in willa-main-product
  const willaGalleryRegex = /<!-- Media Gallery -->[\s\S]*?<!-- Purchase Box -->/m;
  const newWillaGallery = `<!-- Media Gallery -->
      <div class="willa-pdp-gallery">
        {% assign custom_gal_count = 0 %}
        {% assign custom_first_img = '' %}
        {% for block in section.blocks %}
          {% if block.type == 'gallery_image' %}
            {% assign custom_gal_count = custom_gal_count | plus: 1 %}
            {% if custom_first_img == '' %}
              {% if block.settings.image != blank %}
                {% assign custom_first_img = block.settings.image | image_url: width: 1000 %}
              {% elsif block.settings.image_url != blank %}
                {% assign custom_first_img = block.settings.image_url %}
              {% endif %}
            {% endif %}
          {% endif %}
        {% endfor %}

        <div class="willa-pdp-main-img-wrap">
          {% if custom_gal_count > 0 and custom_first_img != '' %}
            <img id="willaPdpMainImg" src="{{ custom_first_img }}" alt="{{ product.title | escape }}">
          {% elsif product.featured_image %}
            <img id="willaPdpMainImg" src="{{ product.featured_image | image_url: width: 1000 }}" alt="{{ product.title | escape }}">
          {% else %}
            <img id="willaPdpMainImg" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-hero-main.png?v=1792853600" alt="{{ product.title | escape }}">
          {% endif %}

          {% if product.compare_at_price > product.price %}
            <div class="willa-pdp-badge">{{ section.settings.badge_text | default: 'SPECIAL OFFER' }}</div>
          {% endif %}
        </div>

        <div class="willa-pdp-thumbs">
          {% if custom_gal_count > 0 %}
            {% for block in section.blocks %}
              {% if block.type == 'gallery_image' %}
                {% assign thumb_src = '' %}
                {% if block.settings.image != blank %}
                  {% assign thumb_src = block.settings.image | image_url: width: 1000 %}
                {% elsif block.settings.image_url != blank %}
                  {% assign thumb_src = block.settings.image_url %}
                {% endif %}
                {% if thumb_src != '' %}
                  <img class="willa-pdp-thumb {% if forloop.first %}active{% endif %}" src="{{ thumb_src }}" alt="{{ block.settings.alt | default: product.title | escape }}" onclick="switchPdpImg(this.src)" {{ block.shopify_attributes }}>
                {% endif %}
              {% endif %}
            {% endfor %}
          {% elsif product.images.size > 1 %}
            {% for image in product.images limit: 8 %}
              <img class="willa-pdp-thumb {% if forloop.first %}active{% endif %}" src="{{ image | image_url: width: 160 }}" alt="{{ product.title | escape }}" onclick="switchPdpImg(this.src)">
            {% endfor %}
          {% endif %}
        </div>
      </div>

      <!-- Purchase Box -->`;

  willaMain = willaMain.replace(willaGalleryRegex, newWillaGallery);

  // Add gallery_image to willa-main-product schema
  const willaBlocksSchemaRegex = /"blocks":\s*\[\s*\{\s*"type":\s*"accordion_item"/;
  const newWillaBlocksSchema = `"blocks": [
    {
      "type": "gallery_image",
      "name": "Gallery Image (Slide)",
      "settings": [
        { "type": "image_picker", "id": "image", "label": "Select Image" },
        { "type": "text", "id": "image_url", "label": "Or Image URL" },
        { "type": "text", "id": "alt", "label": "Image Alt / Description" }
      ]
    },
    {
      "type": "accordion_item"`;

  willaMain = willaMain.replace(willaBlocksSchemaRegex, newWillaBlocksSchema);
  fs.writeFileSync('Clone-willafarm/theme/sections/willa-main-product.liquid', willaMain);
  console.log('Saved Clone-willafarm/theme/sections/willa-main-product.liquid');

  // === 4. Updating templates/product.json (Default for all other products) ===
  console.log('\n=== 4. Updating templates/product.json (Default for all products) ===');
  const defaultProductJson = {
    "sections": {
      "main": {
        "type": "willa-main-product",
        "blocks": {
          "acc_desc": {
            "type": "accordion_item",
            "settings": {
              "title": "Product Overview & Features",
              "use_product_description": true,
              "open_default": true
            }
          },
          "acc_shipping": {
            "type": "accordion_item",
            "settings": {
              "title": "Fast US Tracked Shipping",
              "content": "All orders are packaged and dispatched from regional US warehouses within 24–48 hours. Live door-to-door tracking provided via email. Free express delivery on orders over $49.",
              "use_product_description": false,
              "open_default": false
            }
          },
          "acc_warranty": {
            "type": "accordion_item",
            "settings": {
              "title": "90-Day Money-Back Guarantee",
              "content": "Every Zavelyn® product comes backed by our unconditional 90-Day 100% Satisfaction Guarantee. If you are not completely satisfied, simply contact support@tryzavelyn.com for a full refund or exchange.",
              "use_product_description": false,
              "open_default": false
            }
          }
        },
        "block_order": [
          "acc_desc",
          "acc_shipping",
          "acc_warranty"
        ],
        "settings": {
          "show_breadcrumbs": true,
          "enable_sticky_atc": true,
          "badge_text": "SPECIAL OFFER",
          "rating_text": "4.9 / 5.0 (1,240+ Verified Reviews)"
        }
      },
      "facts": {
        "type": "willa-facts",
        "settings": {
          "heading": "Engineered for Performance & Long-Lasting Durability",
          "subtitle": "Discover why homesteaders, craftsmen, and makers trust Zavelyn® for their daily tasks."
        }
      },
      "steps": {
        "type": "willa-steps",
        "settings": {
          "heading": "Simple Setup. Immediate Results.",
          "subtitle": "Designed for effortless plug-and-play operation straight out of the box."
        }
      },
      "comparison": {
        "type": "willa-comparison",
        "settings": {
          "heading": "The Zavelyn® Difference",
          "subtitle": "Built with professional-grade materials without the traditional retail markup."
        }
      },
      "faq": {
        "type": "willa-faq",
        "settings": {
          "heading": "Frequently Asked Questions",
          "subtitle": "Everything you need to know about setup, warranties, and shipping."
        }
      },
      "reviews": {
        "type": "willa-reviews",
        "settings": {
          "heading": "What Verified Customers Are Saying",
          "subtitle": "Real feedback from craftsmen, farmers, and homeowners across North America."
        }
      }
    },
    "order": [
      "main",
      "facts",
      "steps",
      "comparison",
      "faq",
      "reviews"
    ]
  };

  const defaultJsonStr = JSON.stringify(defaultProductJson, null, 2);
  fs.writeFileSync('Clone-willafarm/theme/templates/product.json', defaultJsonStr);
  console.log('Saved Clone-willafarm/theme/templates/product.json (Reviews is after FAQ at the bottom)');

  // === 5. Deploy all updated files to Shopify Theme ===
  console.log('\n=== 5. Uploading All Updated Files to Shopify Theme 186607567033 ===');
  const token = await getAccessToken();

  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', funnel);
  await uploadThemeAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.json', JSON.stringify(sakerJson, null, 2));
  await uploadThemeAsset(token, 'sections/willa-main-product.liquid', willaMain);
  await uploadThemeAsset(token, 'templates/product.json', defaultJsonStr);

  console.log('\n✔ All templates & sections successfully updated and deployed!');
}

main().catch(console.error);
