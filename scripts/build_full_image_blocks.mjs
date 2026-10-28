import fs from 'fs';

// 1. Prepare templates/product.json with explicit image assignments
const productJson = JSON.parse(fs.readFileSync('draft_working/templates_product_with_image_blocks.json', 'utf8'));

// Gallery blocks with explicit image paths
const galleryMap = [
  { id: 'gallery_img_1', file: 'zavelyn-botana-asset-1.jpg', label: 'Main Product Jar' },
  { id: 'gallery_img_2', file: 'zavelyn-botana-asset-2.jpg', label: 'Real Results Real Growth' },
  { id: 'gallery_img_3', file: 'zavelyn-botana-asset-3.png', label: 'Essence of Strength' },
  { id: 'gallery_img_4', file: 'zavelyn-botana-asset-4.png', label: 'Loved By Thousands' },
  { id: 'gallery_img_5', file: 'zavelyn-botana-asset-5.png', label: 'Simple Steps Stronger Hair' },
  { id: 'gallery_img_6', file: 'zavelyn-botana-asset-6.png', label: 'Revitalize Your Hair' },
  { id: 'gallery_img_7', file: 'zavelyn-botana-asset-7.webp', label: 'Botanical Routine' },
  { id: 'gallery_img_8', file: 'zavelyn-botana-asset-8.webp', label: 'Pure Organic Guarantee' }
];

galleryMap.forEach(item => {
  productJson.sections.main.blocks[item.id] = {
    type: "gallery_image",
    settings: {
      image: `shopify://shop_images/${item.file}`,
      alt: item.label
    }
  };
});

// Description fallback blocks with explicit image paths
productJson.sections.description_fallback.blocks = {
  "img_essence": {
    "type": "body_image_essence",
    "settings": {
      "image": "shopify://shop_images/zavelyn-botana-asset-3.png",
      "alt": "Zavelyn BotanaRoots - Essence of Strength"
    }
  },
  "img_loved": {
    "type": "body_image_loved",
    "settings": {
      "image": "shopify://shop_images/zavelyn-botana-asset-4.png",
      "alt": "Loved By Thousands"
    }
  },
  "img_steps": {
    "type": "body_image_steps",
    "settings": {
      "image": "shopify://shop_images/zavelyn-botana-asset-5.png",
      "alt": "Simple Steps Stronger Hair"
    }
  },
  "img_revitalize": {
    "type": "body_image_revitalize",
    "settings": {
      "image": "shopify://shop_images/zavelyn-botana-asset-6.png",
      "alt": "Revitalize Your Hair, Naturally"
    }
  }
};

fs.writeFileSync('draft_working/templates_product_final_blocks.json', JSON.stringify(productJson, null, 2));
console.log('✓ Written draft_working/templates_product_final_blocks.json');

// 2. Fix the Liquid offset fallback in sections_zavelyn-pdp-main-refactored.liquid
let mainLiquid = fs.readFileSync('draft_working/sections_zavelyn-pdp-main-refactored.liquid', 'utf8');

const targetLoop = `                {% for block in gallery_blocks %}
                  {% assign thumb_src = block.settings.image | image_url: width: 1200 %}
                  {% assign thumb_thumb = block.settings.image | image_url: width: 160 %}
                  {% if thumb_src == blank and forloop.index0 < product.images.size %}
                    {% assign thumb_src = product.images[forloop.index0] | image_url: width: 1200 %}
                    {% assign thumb_thumb = product.images[forloop.index0] | image_url: width: 160 %}
                  {% endif %}`;

const replacementLoop = `                {% for block in gallery_blocks %}
                  {% assign thumb_src = block.settings.image | image_url: width: 1200 %}
                  {% assign thumb_thumb = block.settings.image | image_url: width: 160 %}
                  {% if thumb_src == blank %}
                    {% for p_img in product.images offset: forloop.index0 limit: 1 %}
                      {% assign thumb_src = p_img | image_url: width: 1200 %}
                      {% assign thumb_thumb = p_img | image_url: width: 160 %}
                    {% endfor %}
                  {% endif %}`;

if (mainLiquid.includes(targetLoop)) {
  mainLiquid = mainLiquid.replace(targetLoop, replacementLoop);
  console.log('✓ Fixed Liquid loop in sections_zavelyn-pdp-main-refactored.liquid');
}

fs.writeFileSync('draft_working/sections_zavelyn-pdp-main-refactored.liquid', mainLiquid);
