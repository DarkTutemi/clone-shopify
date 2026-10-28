import fs from 'fs';

// Load current product.json
const currentJson = JSON.parse(fs.readFileSync('draft_working/theme_187708571833_product.json', 'utf8'));

// 1. Add blocks to description_fallback
currentJson.sections.description_fallback.blocks = {
  "img_essence": {
    "type": "body_image_essence",
    "settings": {
      "alt": "Zavelyn BotanaRoots - Essence of Strength"
    }
  },
  "img_loved": {
    "type": "body_image_loved",
    "settings": {
      "alt": "Loved By Thousands"
    }
  },
  "img_steps": {
    "type": "body_image_steps",
    "settings": {
      "alt": "Simple Steps Stronger Hair"
    }
  },
  "img_revitalize": {
    "type": "body_image_revitalize",
    "settings": {
      "alt": "Revitalize Your Hair, Naturally"
    }
  }
};

currentJson.sections.description_fallback.block_order = [
  "img_essence",
  "img_loved",
  "img_steps",
  "img_revitalize"
];

// 2. Add gallery_image blocks to main
// Current block_order in main: [trust_1, trust_2, trust_3, faq_1, faq_2, faq_3]
const galleryBlocks = {};
const galleryBlockOrder = [];

for (let i = 1; i <= 8; i++) {
  const blockId = `gallery_img_${i}`;
  galleryBlocks[blockId] = {
    "type": "gallery_image",
    "settings": {
      "alt": `Zavelyn BotanaRoots Gallery Image ${i}`
    }
  };
  galleryBlockOrder.push(blockId);
}

// Merge blocks in main
currentJson.sections.main.blocks = {
  ...galleryBlocks,
  ...currentJson.sections.main.blocks
};

currentJson.sections.main.block_order = [
  ...galleryBlockOrder,
  ...currentJson.sections.main.block_order
];

fs.writeFileSync('draft_working/templates_product_with_image_blocks.json', JSON.stringify(currentJson, null, 2));
console.log('✓ Generated draft_working/templates_product_with_image_blocks.json');
console.log('Main block order count:', currentJson.sections.main.block_order.length);
console.log('Description fallback block order count:', currentJson.sections.description_fallback.block_order.length);
