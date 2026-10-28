import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP } from './batch1_config.mjs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const LIVE_THEME_ID = 187597717689;
const DRAFT_THEME_ID = 187720335545;

const FAQ_ITEMS = [
  {
    q: "What does it feel like to use?",
    a: "Each 10–12 minute session is gentle and relaxing. The device provides comfortable warmth and subtle sonic vibration — many women use this time to read or relax. As one customer describes: <em>\"It's very relaxing, and not in an intimidating way... in a calm, zen way.\"</em>"
  },
  {
    q: "How often should I use the Zavelyn vFit™?",
    a: "We recommend using the device 3 times per week (every other day) for 10 to 12 minutes per session. Most women start noticing improved tissue moisture and tone within 3 to 4 weeks of regular use, with optimal results after 8 to 12 weeks."
  },
  {
    q: "Is it too large or uncomfortable for me?",
    a: "While at initial glance it may look slightly unfamiliar, with a modest 4-inch (10.2 cm) circumference, the device is actually smaller than typical intimate activity. Its ergonomic, medical-grade bio-compatible silicone exterior ensures comfortable and smooth insertion when paired with our Photonic Hydrating Gel."
  },
  {
    q: "Is red light therapy safe for intimate wellness?",
    a: "Yes, 100%. The device is cleared as a wellness device and utilizes 662nm therapeutic red light, gentle thermal energy, and sonic frequency — completely free of hormones, drugs, or harsh chemicals. Photobiomodulation is supported by extensive clinical studies and recommended by over 1,000+ OB-GYNs."
  },
  {
    q: "I've tried creams and exercises before. Why would this work?",
    a: "Unlike products that simply mask symptoms temporarily, vFit™ works deep at the cellular level using three synergistic technologies: 662nm red light stimulates cellular ATP and collagen synthesis, soothing warmth revives microcirculation, and sonic vibrations tone pelvic floor muscles for lasting vitality."
  },
  {
    q: "What age group is this device designed for?",
    a: "Zavelyn vFit™ is beneficial for adult women (18+) across all life stages: postpartum mothers restoring pelvic tone, women experiencing perimenopause or menopause symptoms (dryness, loss of sensation, bladder leakage), and anyone seeking proactive intimate health."
  },
  {
    q: "How do I clean and care for the device?",
    a: "Cleaning is quick and simple: Wipe the silicone tip with the included antibacterial photonic wipes, or gently wash with warm water and mild antibacterial soap after each use. Dry thoroughly with a soft cloth and store in the included travel pouch. Do not submerge the charging cradle in water."
  },
  {
    q: "Are there any precautions or medical contraindications?",
    a: "Do not use if pregnant, undergoing active cancer treatment, experiencing an active sexually transmitted infection (STI), or taking medications/topicals that increase photosensitivity. If you have specific medical conditions, we always recommend consulting your OB-GYN or healthcare provider."
  },
  {
    q: "What is the warranty and return policy for vFit™ devices?",
    a: "Every Zavelyn vFit™ device includes a 1-Year Comprehensive Manufacturer Warranty and our standard 30-Day Satisfaction Guarantee. If you have any questions or need support, our dedicated customer care team is always here to assist."
  }
];

function buildFaqHtml() {
  const itemsHtml = FAQ_ITEMS.map((item, idx) => `
      <details class="zv-vfit-faq-item" ${idx === 0 ? 'open' : ''} style="background: #ffffff; border: 1px solid #fed7d7; border-radius: 10px; overflow: hidden; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
        <summary class="zv-vfit-faq-summary" style="padding: 16px 20px; font-size: 15px; font-weight: 700; color: #1a202c; cursor: pointer; display: flex; justify-content: space-between; align-items: center; list-style: none; user-select: none; gap: 12px;">
          <span>${item.q}</span>
          <span class="zv-vfit-faq-arrow" style="flex: 0 0 10px; width: 10px; height: 10px; border-right: 2px solid #a50034; border-bottom: 2px solid #a50034; transform: rotate(45deg); transition: transform 0.2s ease; margin-right: 4px;"></span>
        </summary>
        <div class="zv-vfit-faq-answer" style="padding: 0 20px 18px; font-size: 14px; color: #4a5568; line-height: 1.6; border-top: 1px solid #fce8e6; padding-top: 12px;">
          <p style="margin: 0;">${item.a}</p>
        </div>
      </details>
  `).join('\n');

  return `
  <!-- Frequently Asked Questions (FAQ) Section -->
  <div class="zv-vfit-faq-section" style="margin-top: 44px; padding-top: 36px; border-top: 1.5px solid #fed7d7;">
    <div style="text-align: center; margin-bottom: 26px;">
      <span style="display: inline-block; background: #fff1f2; color: #a50034; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.5px; border: 1px solid #fed7d7; margin-bottom: 8px;">Got Questions?</span>
      <h3 style="font-size: 24px; font-weight: 800; color: #1a202c; margin: 0 0 8px;">Frequently Asked Questions</h3>
      <p style="font-size: 14px; color: #718096; margin: 0 auto; max-width: 600px;">Everything you need to know about the Zavelyn vFit™ Red Light Intimate Wellness Device.</p>
    </div>

    <div class="zv-vfit-faq-list" style="display: flex; flex-direction: column; gap: 12px; max-width: 820px; margin: 0 auto;">
${itemsHtml}
    </div>
  </div>
`;
}

async function uploadThemeAsset(token, themeId, key, value) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (!res.ok || !data.asset) throw new Error(`Failed to upload ${key}: ` + JSON.stringify(data));
  console.log(`✓ Uploaded ${key} (${data.asset.size} bytes) to Theme ${themeId}`);
}

async function getThemeAsset(token, themeId, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  return data.asset.value;
}

async function main() {
  console.log('=== ADDING FAQ DIRECTLY UNDER "REAL REVIEWS" ON VFIT PDP ===');
  const token = await getAccessToken();

  // 1. Fetch current vFit product
  const prodRes = await fetch(`https://${SHOP}/admin/api/2024-01/products.json?handle=zavelyn-vfit-red-light-intimate-wellness-device`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const prodData = await prodRes.json();
  const product = prodData.products[0];

  // Backup current body_html
  const backupDir = path.join(process.cwd(), 'backups', `vfit_pre_faq_${Date.now()}`);
  fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(path.join(backupDir, 'vfit_body_html_original.html'), product.body_html, 'utf8');
  console.log(`✓ Backed up original body_html to ${backupDir}`);

  // Check if FAQ is already in body_html
  let currentHtml = product.body_html;
  const existingFaqIdx = currentHtml.indexOf('zv-vfit-faq-section');
  if (existingFaqIdx !== -1) {
    console.log('FAQ section already exists in body_html, removing previous version first...');
    const endFaqMarker = '</div>\n\n</div>';
    const endIdx = currentHtml.lastIndexOf(endFaqMarker);
    if (endIdx > existingFaqIdx) {
      currentHtml = currentHtml.substring(0, existingFaqIdx) + '</div>';
    }
  }

  // Find the closing </div> of .zavelyn-pdp-description-wrap
  const lastDivIdx = currentHtml.lastIndexOf('</div>');
  if (lastDivIdx === -1) {
    throw new Error('Could not find closing </div> in vFit body_html');
  }

  const faqHtml = buildFaqHtml();
  const updatedBodyHtml = currentHtml.substring(0, lastDivIdx) + faqHtml + '\n</div>';

  fs.writeFileSync('draft_working/vfit_body_html_with_faq.html', updatedBodyHtml, 'utf8');
  console.log(`✓ Prepared new body_html with FAQ (${updatedBodyHtml.length} chars)`);

  // 2. Update product on Shopify Admin
  console.log('\nUpdating product body_html on Shopify...');
  const updateRes = await fetch(`https://${SHOP}/admin/api/2024-01/products/${product.id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      product: {
        id: product.id,
        body_html: updatedBodyHtml
      }
    })
  });
  const updateData = await updateRes.json();
  if (!updateRes.ok || !updateData.product) {
    throw new Error('Failed to update product: ' + JSON.stringify(updateData));
  }
  console.log('✓ Successfully updated vFit product body_html on Shopify Admin!');

  // 3. Add supporting CSS to Live Theme & Draft Theme
  const faqCss = `
/* VFIT PDP FAQ ACCORDION STYLES */
.zv-vfit-faq-item[open] {
  border-color: #a50034 !important;
  box-shadow: 0 4px 14px rgba(165, 0, 52, 0.08) !important;
}
.zv-vfit-faq-item[open] .zv-vfit-faq-arrow {
  transform: rotate(-135deg) !important;
}
.zv-vfit-faq-summary::-webkit-details-marker {
  display: none !important;
}
.zv-vfit-faq-summary:hover {
  background: #fff9f9;
}
`;

  console.log('\nEnsuring FAQ styles in Live Theme sections/zavelyn-pdp-main.liquid...');
  for (const themeId of [LIVE_THEME_ID, DRAFT_THEME_ID]) {
    const mainLiquid = await getThemeAsset(token, themeId, 'sections/zavelyn-pdp-main.liquid');
    if (!mainLiquid.includes('VFIT PDP FAQ ACCORDION STYLES')) {
      const closingStyle = '</style>';
      const pos = mainLiquid.lastIndexOf(closingStyle);
      if (pos !== -1) {
        const newMainLiquid = mainLiquid.substring(0, pos) + faqCss + '\n' + mainLiquid.substring(pos);
        await uploadThemeAsset(token, themeId, 'sections/zavelyn-pdp-main.liquid', newMainLiquid);
      }
    } else {
      console.log(`- Theme ${themeId} already has VFIT FAQ styles`);
    }
  }

  console.log('\n=== FAQ DEPLOYMENT COMPLETED SUCCESSFULLY ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
