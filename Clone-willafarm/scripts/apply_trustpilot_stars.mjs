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

function getTrustpilotSnippet() {
  return `{%- assign tp_w = width | default: 96 -%}
{%- assign tp_h = height | default: 18 -%}
<span class="trustpilot-stars-wrap {{ class }}" style="display:inline-flex;align-items:center;vertical-align:middle;line-height:0;">
  <svg class="trustpilot-stars-svg" width="{{ tp_w }}" height="{{ tp_h }}" viewBox="0 0 104 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="5 stars on Trustpilot">
    <rect width="19.2" height="19.2" rx="2" fill="#00B67A"/>
    <path d="M9.6 3L11.5 7.4L16.2 8.1L12.8 11.4L13.6 16.1L9.6 13.8L5.6 16.1L6.4 11.4L3 8.1L7.7 7.4L9.6 3Z" fill="white"/>
    <rect x="21.2" width="19.2" height="19.2" rx="2" fill="#00B67A"/>
    <path d="M30.8 3L32.7 7.4L37.4 8.1L34 11.4L34.8 16.1L30.8 13.8L26.8 16.1L27.6 11.4L24.2 8.1L28.9 7.4L30.8 3Z" fill="white"/>
    <rect x="42.4" width="19.2" height="19.2" rx="2" fill="#00B67A"/>
    <path d="M52 3L53.9 7.4L58.6 8.1L55.2 11.4L56 16.1L52 13.8L48 16.1L48.8 11.4L45.4 8.1L50.1 7.4L52 3Z" fill="white"/>
    <rect x="63.6" width="19.2" height="19.2" rx="2" fill="#00B67A"/>
    <path d="M73.2 3L75.1 7.4L79.8 8.1L76.4 11.4L77.2 16.1L73.2 13.8L69.2 16.1L70 11.4L66.6 8.1L71.3 7.4L73.2 3Z" fill="white"/>
    <rect x="84.8" width="19.2" height="19.2" rx="2" fill="#00B67A"/>
    <path d="M94.4 3L96.3 7.4L101 8.1L97.6 11.4L98.4 16.1L94.4 13.8L90.4 16.1L91.2 11.4L87.8 8.1L92.5 7.4L94.4 3Z" fill="white"/>
  </svg>
</span>`;
}

async function main() {
  console.log('--- Converting All Star Ratings Across Web to Trustpilot Green Stars ---');
  const token = await getAccessToken();

  // 1. Create snippets/trustpilot-stars.liquid
  const tpSnippet = getTrustpilotSnippet();
  fs.writeFileSync('Clone-willafarm/theme/snippets/trustpilot-stars.liquid', tpSnippet);
  console.log('Saved local Clone-willafarm/theme/snippets/trustpilot-stars.liquid');
  await uploadThemeAsset(token, 'snippets/trustpilot-stars.liquid', tpSnippet);

  // 2. Update sections/heating-lamp-funnel.liquid
  let funnel = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  // Replace Hero stars
  funnel = funnel.replace(
    /<span class="wf-stars">★★★★★<\/span>/g,
    `<span class="wf-stars">{% render 'trustpilot-stars', width: 96, height: 18 %}</span>`
  );

  // Replace Review section subtitle stars
  funnel = funnel.replace(
    /<span class="wf-stars">★★★★★<\/span>\s*4\.9\s*\/\s*5\.0 Rating/g,
    `{% render 'trustpilot-stars', width: 96, height: 18 %} <strong>4.9 / 5.0 Rating</strong>`
  );

  // Replace Review cards stars
  funnel = funnel.replace(
    /<div class="wf-rev-stars">\{\{ block\.settings\.stars \| default: '★★★★★' \}\}<\/div>/g,
    `<div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>`
  );
  funnel = funnel.replace(
    /<div class="wf-rev-stars">★★★★★<\/div>/g,
    `<div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>`
  );

  // Update CSS for .wf-review-stars and .wf-stars to align Trustpilot SVG
  funnel = funnel.replace(
    /\.wf-review-stars\s*\{[\s\S]*?gap:\s*8px;[\s\S]*?\}/,
    `.wf-review-stars {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }`
  );
  funnel = funnel.replace(
    /\.wf-stars\s*\{[\s\S]*?color:\s*#f59e0b;[\s\S]*?\}/,
    `.wf-stars {
    display: inline-flex;
    align-items: center;
    line-height: 0;
  }`
  );
  funnel = funnel.replace(
    /\.wf-rev-stars\s*\{[\s\S]*?color:\s*#f59e0b;[\s\S]*?\}/,
    `.wf-rev-stars {
    display: inline-flex;
    align-items: center;
    line-height: 0;
    margin-bottom: 8px;
  }`
  );

  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', funnel);
  console.log('Saved Clone-willafarm/theme/sections/heating-lamp-funnel.liquid');
  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', funnel);

  // Also update build script so future deployments keep Trustpilot stars
  let buildScript = fs.readFileSync('Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs', 'utf8');
  buildScript = buildScript.replace(
    /<span class="wf-stars">★★★★★<\/span>/g,
    `<span class="wf-stars">{% render 'trustpilot-stars', width: 96, height: 18 %}</span>`
  );
  buildScript = buildScript.replace(
    /<span class="wf-stars">★★★★★<\/span>\s*4\.9\s*\/\s*5\.0 Rating/g,
    `{% render 'trustpilot-stars', width: 96, height: 18 %} <strong>4.9 / 5.0 Rating</strong>`
  );
  buildScript = buildScript.replace(
    /<div class="wf-rev-stars">\{\{ block\.settings\.stars \| default: '★★★★★' \}\}<\/div>/g,
    `<div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>`
  );
  buildScript = buildScript.replace(
    /<div class="wf-rev-stars">★★★★★<\/div>/g,
    `<div class="wf-rev-stars">{% render 'trustpilot-stars', width: 80, height: 15 %}</div>`
  );
  fs.writeFileSync('Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs', buildScript);
  console.log('Saved Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs');

  // 3. Update all other theme sections that have star ratings
  const otherSections = [
    'willa-hero.liquid',
    'willa-featured-product.liquid',
    'willa-main-product.liquid',
    'willa-reviews.liquid',
    'willa-featured-collection.liquid',
    'willa-main-collection.liquid'
  ];

  for (const sName of otherSections) {
    const sPath = `Clone-willafarm/theme/sections/${sName}`;
    if (fs.existsSync(sPath)) {
      let content = fs.readFileSync(sPath, 'utf8');
      let changed = false;

      if (content.includes('class="willa-stars"')) {
        content = content.replace(/<div class="willa-stars">[\s\S]*?<\/div>/g, '<div class="willa-stars">{% render \'trustpilot-stars\', width: 92, height: 17 %}</div>');
        changed = true;
      }
      if (content.includes('class="review-stars"')) {
        content = content.replace(/<div class="review-stars">[\s\S]*?<\/div>/g, '<div class="review-stars">{% render \'trustpilot-stars\', width: 80, height: 15 %}</div>');
        changed = true;
      }

      // Add CSS rule if needed
      if (changed) {
        if (!content.includes('.trustpilot-stars-svg')) {
          content += `\n<style>\n  .willa-stars, .review-stars { display: inline-flex; align-items: center; line-height: 0; }\n</style>\n`;
        }
        fs.writeFileSync(sPath, content);
        console.log(`Saved ${sPath}`);
        await uploadThemeAsset(token, `sections/${sName}`, content);
      }
    }
  }

  console.log('✔ All star ratings successfully converted to Trustpilot green stars!');
}

main().catch(console.error);
