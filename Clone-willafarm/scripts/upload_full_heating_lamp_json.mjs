const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function main() {
  const tRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const tData = await tRes.json();
  const token = tData.access_token;

  const productJson = {
    sections: {
      "heating_lamp_funnel": {
        type: "heating-lamp-funnel",
        blocks: {
          "bundle_2": {
            type: "bundle_package",
            settings: {
              badge: "BEST SELLER • 50% OFF • FREE SHIPPING",
              is_best_seller: true,
              title: "2 Pack (Light + US Switch Cord)",
              description: "<span>✔ 2x Zavelyn® Intelligent Heating Lamps</span><br><span>✔ 2x US-Standard Heavy-Duty Switch Cords</span><br><span>✔ Only $44.99/set • Free Express Shipping</span>",
              variant_id: "67930179436729",
              price: "89.99",
              old_price: "179.99",
              image_url: "https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png"
            }
          },
          "bundle_1": {
            type: "bundle_package",
            settings: {
              badge: "STARTER PACK • 50% OFF",
              is_best_seller: false,
              title: "1 Pack (Light + US Switch Cord)",
              description: "<span>✔ 1x Zavelyn® Intelligent Heating Lamp</span><br><span>✔ 1x US-Standard Heavy-Duty Switch Cord</span><br><span>✔ Ideal for 1 Brooder / Coop Box</span>",
              variant_id: "67930179403961",
              price: "49.99",
              old_price: "99.99",
              image_url: "https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg"
            }
          },
          "point_1": {
            type: "key_point",
            settings: {
              icon: "🌡️",
              title: "Precision Digital Auto-Thermostat",
              text: "Easily adjust temperature between 82°F–95°F (28°C–35°C). Automatically shuts off when target temp is reached and restarts when temps drop."
            }
          },
          "point_2": {
            type: "key_point",
            settings: {
              icon: "🛡️",
              title: "100% Sealed Fireproof Polymer Shell",
              text: "No fragile glass bulbs or exposed 400°F glowing filaments. Cool-to-touch exterior protects dry hay and bedding from fire risk."
            }
          },
          "point_3": {
            type: "key_point",
            settings: {
              icon: "💨",
              title: "Gentle Convection Air Circulation",
              text: "Distributes warmth smoothly across the entire brooder. Eliminates dangerous hot spots, cold corners, and chick crowding."
            }
          },
          "point_4": {
            type: "key_point",
            settings: {
              icon: "💡",
              title: "Soft LED Ambient Glow (Zero Stress)",
              text: "Gentle low-lux LED lets you check your flock without disrupting their circadian sleep cycles or causing aggression/pecking."
            }
          },
          "point_5": {
            type: "key_point",
            settings: {
              icon: "🔌",
              title: "Standard E26/E27 Threaded Base",
              text: "Screws directly into standard sockets. Includes US-standard switch cord for easy plug-and-play installation anywhere."
            }
          },
          "feat_1": {
            type: "feature_card",
            settings: {
              icon: "🔥",
              title: "Zero Fire Hazard",
              text: "Sealed fireproof polymer shell stays cool to the touch. No fragile red glass that shatters when water splashes or loose feathers float by."
            }
          },
          "feat_2": {
            type: "feature_card",
            settings: {
              icon: "📊",
              title: "Precision Temperature",
              text: "Digital LED display lets you calibrate warmth down to the exact degree. Automatically cycles off when target temperature is reached."
            }
          },
          "feat_3": {
            type: "feature_card",
            settings: {
              icon: "🌙",
              title: "Calm Sleep Cycles",
              text: "Provides gentle low-lux light without blinding red glare, dramatically reducing stress, flock aggression, and feather picking."
            }
          },
          "feat_4": {
            type: "feature_card",
            settings: {
              icon: "🔄",
              title: "Universal Compatibility",
              text: "Features a standard E26/E27 threaded screw base. Plugs into any household socket using the included heavy-duty switch cord."
            }
          },
          "comp_1": {
            type: "comparison_row",
            settings: {
              feature: "Fire Hazard Risk",
              saker_val: "ZERO RISK (Sealed polymer)",
              generic_val: "HIGH RISK (400°F surface temp)"
            }
          },
          "comp_2": {
            type: "comparison_row",
            settings: {
              feature: "Temperature Regulation",
              saker_val: "Automatic Smart Thermostat",
              generic_val: "None (Runs hot 24/7)"
            }
          },
          "comp_3": {
            type: "comparison_row",
            settings: {
              feature: "Animal Eye Strain",
              saker_val: "Gentle Ambient Light",
              generic_val: "Blinding Red Glare (Causes stress)"
            }
          },
          "comp_4": {
            type: "comparison_row",
            settings: {
              feature: "Water Splash Resistance",
              saker_val: "Splash-Proof Design",
              generic_val: "Shatters instantly on contact"
            }
          },
          "comp_5": {
            type: "comparison_row",
            settings: {
              feature: "Energy Efficiency",
              saker_val: "Saves up to 60% Electricity",
              generic_val: "Expensive high wattage draw"
            }
          },
          "spec_1": { type: "spec_item", settings: { label: "Base Type", value: "Standard E26 / E27 Screw-In" } },
          "spec_2": { type: "spec_item", settings: { label: "Voltage", value: "AC 110V - 220V (Worldwide Compatible)" } },
          "spec_3": { type: "spec_item", settings: { label: "Temperature Range", value: "28°C - 35°C (82°F - 95°F)" } },
          "spec_4": { type: "spec_item", settings: { label: "Display", value: "High-Definition Digital LED" } },
          "spec_5": { type: "spec_item", settings: { label: "Shell Material", value: "High-Density Fireproof Polymer" } },
          "spec_6": { type: "spec_item", settings: { label: "Switch Cord", value: "Included US Standard Heavy-Duty Cord" } },
          "rev_1": {
            type: "review_card",
            settings: {
              author: "Kim D.",
              verified: true,
              stars: "⭐⭐⭐⭐⭐",
              headline: "First season with 100% chick survival!",
              review: "\"I put this Chicken Coop Heaters Lamp in my chicken shed for the winter. With it, the chicks are very warm and active. The digital temperature display makes it so easy to monitor and I love that it shuts off automatically once the target warmth is reached.\""
            }
          },
          "rev_2": {
            type: "review_card",
            settings: {
              author: "Marcus V.",
              verified: true,
              stars: "⭐⭐⭐⭐⭐",
              headline: "No more sleepless nights worrying about coop fires",
              review: "\"Had a terrifying scare last winter when a clamp heat lamp slipped into dry pine shavings. Thank God I caught it in time. Swapped everything to Zavelyn® lamps immediately. Completely fireproof, cool to touch, and the chicks sleep peacefully without pecking.\""
            }
          },
          "rev_3": {
            type: "review_card",
            settings: {
              author: "Sarah L.",
              verified: true,
              stars: "⭐⭐⭐⭐⭐",
              headline: "Game-changer for our backyard flock",
              review: "\"The built-in digital thermostat is worth its weight in gold. I set it to 90 degrees and go to bed with complete peace of mind. No more getting up at 2 AM in freezing weather to check the brooder. Highly recommend the 2-pack!\""
            }
          },
          "rev_4": {
            type: "review_card",
            settings: {
              author: "Jason B.",
              verified: true,
              stars: "⭐⭐⭐⭐⭐",
              headline: "Great for ducklings and small animals",
              review: "\"Raised two batches of ducklings under this lamp this year. The gentle ambient light lets them sleep normally without the blinding red glare that causes aggression. Super simple screw-in installation and excellent build quality.\""
            }
          },
          "faq_1": {
            type: "faq_item",
            settings: {
              question: "Is this heating lamp safe to use around dry hay and pine shavings?",
              answer: "Yes, 100%! Unlike traditional glass bulbs that burn at over 400°F on the surface, the Zavelyn® Livestock Lamp features a sealed, fireproof polymer housing that stays cool to the touch. Even if shavings or dust touch the shell, there are no open filaments or flashpoint temperatures."
            }
          },
          "faq_2": {
            type: "faq_item",
            settings: {
              question: "How does the automatic temperature control work?",
              answer: "The lamp features an integrated digital sensor and microcontroller. Simply set your target temperature (28°C to 35°C / 82°F to 95°F) using the + and - buttons. The lamp automatically suspends heat once the ambient temperature reaches your setting and kicks back on when temps dip."
            }
          },
          "faq_3": {
            type: "faq_item",
            settings: {
              question: "Does it screw into a regular light socket?",
              answer: "Yes. It uses a standard E26 / E27 threaded screw base. Each package also includes a heavy-duty US standard switch cord with a toggle switch for convenient placement anywhere in your coop, brooder, or barn."
            }
          },
          "faq_4": {
            type: "faq_item",
            settings: {
              question: "What is your return and guarantee policy?",
              answer: "Every order comes with our 90-Day 100% Satisfaction Money-Back Guarantee. If for any reason you or your flock are not thrilled with its performance, simply reach out to our support team for a prompt refund."
            }
          }
        },
        block_order: [
          "bundle_2", "bundle_1",
          "point_1", "point_2", "point_3", "point_4", "point_5",
          "feat_1", "feat_2", "feat_3", "feat_4",
          "comp_1", "comp_2", "comp_3", "comp_4", "comp_5",
          "spec_1", "spec_2", "spec_3", "spec_4", "spec_5", "spec_6",
          "rev_1", "rev_2", "rev_3", "rev_4",
          "faq_1", "faq_2", "faq_3", "faq_4"
        ],
        settings: {
          badge_pill: "🔥 LIMITED STOCK: ONLY 57 LEFT AT THIS PRICE | 50% OFF",
          product_title: "Zavelyn® Intelligent Auto-Regulating Livestock Heating Lamp",
          product_subtitle: "The safe, fireproof brooder heater with built-in digital thermostat. Keeps baby chicks, ducks, piglets, and small livestock comfortably warm without dangerous fire hazards or harsh red glare."
        }
      }
    },
    order: ["heating_lamp_funnel"]
  };

  const uRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key: 'templates/product.sakerplus-livestock-heating-lamp.json', value: JSON.stringify(productJson, null, 2) } })
  });
  const uData = await uRes.json();
  if (uRes.ok) {
    console.log('✔ templates/product.sakerplus-livestock-heating-lamp.json populated with ALL 30 blocks!');
  } else {
    console.error('✗ Upload error:', JSON.stringify(uData));
  }
}

main().catch(console.error);
