import fs from 'fs';

// 1. Update sections_zavelyn-pdp-description-fallback.liquid
const descriptionFallbackLiquid = `{% schema %}
{
  "name": "Product Details & Body",
  "settings": [],
  "blocks": [
    {
      "type": "body_image_essence",
      "name": "Image: Essence Strength",
      "limit": 1,
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Select Replacement Image"
        },
        {
          "type": "text",
          "id": "alt",
          "label": "Alt Text",
          "default": "Zavelyn BotanaRoots - Essence of Strength"
        }
      ]
    },
    {
      "type": "body_image_loved",
      "name": "Image: Loved Thousands",
      "limit": 1,
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Select Replacement Image"
        },
        {
          "type": "text",
          "id": "alt",
          "label": "Alt Text",
          "default": "Loved By Thousands"
        }
      ]
    },
    {
      "type": "body_image_steps",
      "name": "Image: Simple Steps",
      "limit": 1,
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Select Replacement Image"
        },
        {
          "type": "text",
          "id": "alt",
          "label": "Alt Text",
          "default": "Simple Steps Stronger Hair"
        }
      ]
    },
    {
      "type": "body_image_revitalize",
      "name": "Image: Revitalize Banner",
      "limit": 1,
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Select Replacement Image"
        },
        {
          "type": "text",
          "id": "alt",
          "label": "Alt Text",
          "default": "Revitalize Your Hair, Naturally"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Product Details & Body",
      "blocks": [
        { "type": "body_image_essence" },
        { "type": "body_image_loved" },
        { "type": "body_image_steps" },
        { "type": "body_image_revitalize" }
      ]
    }
  ]
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
          {%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
            {%- if product.description contains '<!-- FAQ Section -->' -%}
              {%- assign desc_parts = product.description | split: '<!-- FAQ Section -->' -%}
              {%- assign top_content = desc_parts[0] -%}
              {%- assign bottom_parts = desc_parts[1] | split: '<!-- Verified Customer Reviews Section -->' -%}
              {%- assign reviews_content = bottom_parts[1] -%}

              {%- assign rendered_top = top_content -%}

              {%- for block in section.blocks -%}
                {%- case block.type -%}
                  {%- when 'body_image_essence' -%}
                    {%- if block.settings.image != blank -%}
                      {%- assign new_src = block.settings.image | image_url: width: 1200 -%}
                      {%- assign rendered_top = rendered_top | replace: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-3.png?v=1792936261', new_src -%}
                    {%- endif -%}
                  {%- when 'body_image_loved' -%}
                    {%- if block.settings.image != blank -%}
                      {%- assign new_src = block.settings.image | image_url: width: 1200 -%}
                      {%- assign rendered_top = rendered_top | replace: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-4.png?v=1792936264', new_src -%}
                    {%- endif -%}
                  {%- when 'body_image_steps' -%}
                    {%- if block.settings.image != blank -%}
                      {%- assign new_src = block.settings.image | image_url: width: 1200 -%}
                      {%- assign rendered_top = rendered_top | replace: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-5.png?v=1792936267', new_src -%}
                    {%- endif -%}
                  {%- when 'body_image_revitalize' -%}
                    {%- if block.settings.image != blank -%}
                      {%- assign new_src = block.settings.image | image_url: width: 1200 -%}
                      {%- assign rendered_top = rendered_top | replace: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-6.png?v=1792936270', new_src -%}
                    {%- endif -%}
                {%- endcase -%}
              {%- endfor -%}

              {{ rendered_top }}

              {%- render 'botanaroots-faq-accordion' -%}

              {%- if reviews_content != blank -%}
                <!-- Verified Customer Reviews Section -->
                {{ reviews_content }}
              {%- endif -%}
            {%- else -%}
              {{ product.description }}
            {%- endif -%}
          {%- else -%}
            {{ product.description }}
          {%- endif -%}
        </div>
      </div>
    </section>
  {%- endif -%}
{%- endunless -%}
`;

fs.writeFileSync('draft_working/sections_zavelyn-pdp-description-fallback.liquid', descriptionFallbackLiquid);
console.log('✓ Updated draft_working/sections_zavelyn-pdp-description-fallback.liquid with 4 body image blocks');

// 2. Update sections_zavelyn-pdp-main-refactored.liquid
let mainLiquid = fs.readFileSync('draft_working/sections_zavelyn-pdp-main-refactored.liquid', 'utf8');

// Add gallery_image block to schema
const galleryBlockSchema = `    {
      "type": "gallery_image",
      "name": "Product Gallery Image",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Gallery Image"
        },
        {
          "type": "text",
          "id": "alt",
          "label": "Alt Text"
        }
      ]
    },
`;

const schemaBlocksIdx = mainLiquid.indexOf('"blocks": [');
if (schemaBlocksIdx !== -1 && !mainLiquid.includes('"type": "gallery_image"')) {
  mainLiquid = mainLiquid.substring(0, schemaBlocksIdx + 11) + '\n' + galleryBlockSchema + mainLiquid.substring(schemaBlocksIdx + 11);
}

// Update gallery rendering to support gallery_image blocks
const oldGalleryMarkup = `      <!-- LEFT COLUMN: PRODUCT GALLERY -->
      <div class="zv-pdp-gallery-col">
        <div class="zv-pdp-gallery-inner">
          <div class="zv-pdp-main-media" id="zvMainMediaWrap">
            {% if has_compare %}
              <div class="zv-media-badge" id="zvMediaBadge">SAVE {{ savings_percent }}%</div>
            {% endif %}
            
            {% assign featured_img = current_variant.featured_image | default: product.featured_image %}
            <img 
              id="zvMainImg" 
              src="{{ featured_img | image_url: width: 1200 }}" 
              alt="{{ featured_img.alt | default: product.title | escape }}"
              width="600"
              height="600"
              loading="eager"
            >
          </div>

          {% if product.images.size > 1 %}
            <div class="zv-pdp-thumbs-row" id="zvThumbnails">
              {% for image in product.images limit: 8 %}
                <button 
                  type="button" 
                  class="zv-thumb-btn {% if forloop.first %}active{% endif %}" 
                  data-img-src="{{ image | image_url: width: 1200 }}" 
                  data-thumb-index="{{ forloop.index0 }}"
                  aria-label="View image {{ forloop.index }}"
                >
                  <img src="{{ image | image_url: width: 160 }}" alt="{{ image.alt | default: product.title | escape }}" width="80" height="80" loading="lazy">
                </button>
              {% endfor %}
            </div>
          {% endif %}
        </div>
      </div>`;

const newGalleryMarkup = `      <!-- LEFT COLUMN: PRODUCT GALLERY -->
      <div class="zv-pdp-gallery-col">
        <div class="zv-pdp-gallery-inner">
          {%- assign gallery_blocks = section.blocks | where: "type", "gallery_image" -%}
          {%- if gallery_blocks.size > 0 -%}
            {%- assign first_gallery_block = gallery_blocks.first -%}
            {%- assign main_img_src = first_gallery_block.settings.image | image_url: width: 1200 -%}
            {%- if main_img_src == blank -%}
              {%- assign featured_img = current_variant.featured_image | default: product.featured_image -%}
              {%- assign main_img_src = featured_img | image_url: width: 1200 -%}
            {%- endif -%}
            <div class="zv-pdp-main-media" id="zvMainMediaWrap">
              {% if has_compare %}
                <div class="zv-media-badge" id="zvMediaBadge">SAVE {{ savings_percent }}%</div>
              {% endif %}
              <img 
                id="zvMainImg" 
                src="{{ main_img_src }}" 
                alt="{{ first_gallery_block.settings.alt | default: product.title | escape }}"
                width="600"
                height="600"
                loading="eager"
              >
            </div>
            {% if gallery_blocks.size > 1 %}
              <div class="zv-pdp-thumbs-row" id="zvThumbnails">
                {% for block in gallery_blocks %}
                  {% assign thumb_src = block.settings.image | image_url: width: 1200 %}
                  {% assign thumb_thumb = block.settings.image | image_url: width: 160 %}
                  {% if thumb_src == blank and forloop.index0 < product.images.size %}
                    {% assign thumb_src = product.images[forloop.index0] | image_url: width: 1200 %}
                    {% assign thumb_thumb = product.images[forloop.index0] | image_url: width: 160 %}
                  {% endif %}
                  <button 
                    type="button" 
                    class="zv-thumb-btn {% if forloop.first %}active{% endif %}" 
                    data-img-src="{{ thumb_src }}" 
                    data-thumb-index="{{ forloop.index0 }}"
                    aria-label="View image {{ forloop.index }}"
                    {{ block.shopify_attributes }}
                  >
                    <img src="{{ thumb_thumb }}" alt="{{ block.settings.alt | default: product.title | escape }}" width="80" height="80" loading="lazy">
                  </button>
                {% endfor %}
              </div>
            {% endif %}
          {%- else -%}
            <div class="zv-pdp-main-media" id="zvMainMediaWrap">
              {% if has_compare %}
                <div class="zv-media-badge" id="zvMediaBadge">SAVE {{ savings_percent }}%</div>
              {% endif %}
              
              {% assign featured_img = current_variant.featured_image | default: product.featured_image %}
              <img 
                id="zvMainImg" 
                src="{{ featured_img | image_url: width: 1200 }}" 
                alt="{{ featured_img.alt | default: product.title | escape }}"
                width="600"
                height="600"
                loading="eager"
              >
            </div>

            {% if product.images.size > 1 %}
              <div class="zv-pdp-thumbs-row" id="zvThumbnails">
                {% for image in product.images limit: 8 %}
                  <button 
                    type="button" 
                    class="zv-thumb-btn {% if forloop.first %}active{% endif %}" 
                    data-img-src="{{ image | image_url: width: 1200 }}" 
                    data-thumb-index="{{ forloop.index0 }}"
                    aria-label="View image {{ forloop.index }}"
                  >
                    <img src="{{ image | image_url: width: 160 }}" alt="{{ image.alt | default: product.title | escape }}" width="80" height="80" loading="lazy">
                  </button>
                {% endfor %}
              </div>
            {% endif %}
          {%- endif -%}
        </div>
      </div>`;

if (mainLiquid.includes(oldGalleryMarkup)) {
  mainLiquid = mainLiquid.replace(oldGalleryMarkup, newGalleryMarkup);
  console.log('✓ Replaced gallery markup in zavelyn-pdp-main-refactored.liquid');
} else {
  console.log('Note: oldGalleryMarkup exact match not found, checking normalized...');
}

fs.writeFileSync('draft_working/sections_zavelyn-pdp-main-refactored.liquid', mainLiquid);
console.log('✓ Updated draft_working/sections_zavelyn-pdp-main-refactored.liquid');
