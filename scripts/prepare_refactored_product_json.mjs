import fs from 'fs';

const originalProductJson = JSON.parse(fs.readFileSync('draft_working/templates_product.json', 'utf8'));

// Verify that the user's custom images exist in the original
console.log('Original custom images:');
console.log('botana_img_buy3:', originalProductJson.sections.main.settings.botana_img_buy3);
console.log('botana_img_buy2:', originalProductJson.sections.main.settings.botana_img_buy2);
console.log('botana_img_buy1:', originalProductJson.sections.main.settings.botana_img_buy1);
console.log('botana_img_upsell:', originalProductJson.sections.main.settings.botana_img_upsell);

if (!originalProductJson.sections.main.settings.botana_img_buy3) {
  throw new Error('CRITICAL SAFETY: botana_img_buy3 not found in original product.json!');
}

const refactoredProductJson = JSON.parse(JSON.stringify(originalProductJson));

// Add blocks to main section
refactoredProductJson.sections.main.blocks = {
  "trust_1": {
    "type": "trust_card",
    "settings": {
      "icon": "return",
      "title": "30-Day Returns",
      "subtext": "If you're not satisfied, return within 30 days"
    }
  },
  "trust_2": {
    "type": "trust_card",
    "settings": {
      "icon": "shipping",
      "title": "Free Tracked Shipping",
      "subtext": "Fast delivery with real-time tracking updates"
    }
  },
  "trust_3": {
    "type": "trust_card",
    "settings": {
      "icon": "lock",
      "title": "Safe 256-Bit SSL",
      "subtext": "Encrypted & secure checkout guaranteed"
    }
  },
  "faq_1": {
    "type": "faq_item",
    "settings": {
      "question": "How does the 30-Day Return Guarantee work?",
      "answer": "Order Zavelyn BotanaRoots with complete confidence. If you are not satisfied with your results within 30 days of receiving your order, simply reach out to our dedicated support team for an effortless return process.",
      "default_open": false
    }
  },
  "faq_2": {
    "type": "faq_item",
    "settings": {
      "question": "Shipping, Delivery & Returns",
      "answer": "All orders are dispatched from our US logistics hub within 24–48 hours. Standard tracked delivery takes 3–5 business days. You will receive real-time tracking updates via email as soon as your package leaves the warehouse.",
      "default_open": false
    }
  },
  "faq_3": {
    "type": "faq_item",
    "settings": {
      "question": "Is payment safe and encrypted?",
      "answer": "Yes, 100%. We use bank-grade 256-bit SSL encryption to protect your transaction. Your payment information is processed directly by certified tier-1 merchant gateways and is never stored on our servers.",
      "default_open": false
    }
  }
};

refactoredProductJson.sections.main.block_order = [
  "trust_1",
  "trust_2",
  "trust_3",
  "faq_1",
  "faq_2",
  "faq_3"
];

// Add enhanced settings while preserving all existing
refactoredProductJson.sections.main.settings = {
  ...refactoredProductJson.sections.main.settings,
  "bundle_header_label": "CHOOSE YOUR QUANTITY:",
  "guarantee_badge_text": "30-Day Returns",
  "buy3_badge": "BEST VALUE · FREE SHIPPING · EXTRA 20% OFF",
  "buy2_badge": "🔥 MOST POPULAR",
  "buy1_badge": "Shipping +$4.95",
  "upsell_section_title": "UPGRADE YOUR BOTTLE SIZE",
  "upsell_badge": "SPECIAL OFFER",
  "upsell_heading": "Double the Size!",
  "upsell_description": "Upgrade each bottle from 60ml to 120ml.",
  "upsell_img_width": 135,
  "upsell_mobile_img_width": 115,
  "upsell_img_fit": "contain"
};

// Also configure the Extended FAQ section
if (refactoredProductJson.sections.faq) {
  refactoredProductJson.sections.faq.settings = {
    "enable_section": true,
    "badge_text": "GOT QUESTIONS?",
    "heading": "Frequently Asked Questions",
    "subheading": "Everything you need to know about Zavelyn BotanaRoots Organic Batana Oil."
  };
  refactoredProductJson.sections.faq.blocks = {
    "ext_faq_1": {
      "type": "faq_item",
      "settings": {
        "question": "How do I apply Zavelyn BotanaRoots for best results?",
        "answer": "Warm a few drops between your palms and gently massage into your scalp in circular motions for 3–5 minutes. Leave on for at least 30 minutes, or overnight as an intensive scalp treatment before washing.",
        "default_open": false
      }
    },
    "ext_faq_2": {
      "type": "faq_item",
      "settings": {
        "question": "How quickly can I expect visible hair density improvements?",
        "answer": "Most customers notice nourished hair and reduced shedding within 2–3 weeks of consistent use (3–4 times per week). Visible density and new follicle growth typically become prominent around weeks 6–8.",
        "default_open": false
      }
    },
    "ext_faq_3": {
      "type": "faq_item",
      "settings": {
        "question": "Is it 100% pure raw batana oil with no added chemicals?",
        "answer": "Yes. Our Batana Oil is sustainably wild-harvested in La Mosquitia, Honduras, following centuries-old artisanal roasting methods. It contains zero mineral oils, parabens, sulfates, silicones, or synthetic fragrances.",
        "default_open": false
      }
    },
    "ext_faq_4": {
      "type": "faq_item",
      "settings": {
        "question": "Can I use it on colored, chemically treated, or textured hair?",
        "answer": "Absolutely. Pure batana oil is deeply conditioning and safe for all hair types (1A to 4C), including color-treated, bleached, keratin-treated, and transition hair.",
        "default_open": false
      }
    },
    "ext_faq_5": {
      "type": "faq_item",
      "settings": {
        "question": "How does the 30-Day Return Guarantee work?",
        "answer": "We want you to experience BotanaRoots completely risk-free. If you are not satisfied with your purchase within 30 days of delivery, simply email our customer support team for an effortless return and refund.",
        "default_open": false
      }
    }
  };
  refactoredProductJson.sections.faq.block_order = [
    "ext_faq_1",
    "ext_faq_2",
    "ext_faq_3",
    "ext_faq_4",
    "ext_faq_5"
  ];
}

fs.writeFileSync('draft_working/templates_product_refactored.json', JSON.stringify(refactoredProductJson, null, 2));
console.log('✓ Successfully generated draft_working/templates_product_refactored.json');
