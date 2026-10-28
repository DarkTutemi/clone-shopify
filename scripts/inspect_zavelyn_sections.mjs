import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function inspectSections() {
  const token = await getAccessToken();
  const sectionKeys = [
    'sections/zavelyn-pdp-main.liquid',
    'sections/zavelyn-pdp-ticker.liquid',
    'sections/zavelyn-pdp-value-prop.liquid',
    'sections/zavelyn-pdp-features.liquid',
    'sections/zavelyn-pdp-storytelling.liquid',
    'sections/zavelyn-pdp-steps.liquid',
    'sections/zavelyn-pdp-comparison.liquid',
    'sections/zavelyn-pdp-specs.liquid',
    'sections/zavelyn-pdp-included.liquid',
    'sections/zavelyn-pdp-faq.liquid',
    'sections/zavelyn-pdp-description-fallback.liquid',
    'sections/zavelyn-pdp-shipping.liquid'
  ];

  const sectionAnalysis = {};

  for (const k of sectionKeys) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${k}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    const val = data.asset?.value || '';
    
    // Check conditional logic
    const hasMetafieldCondition = val.includes('metafields') || val.includes('product.metafields');
    const hasHandleCondition = val.includes('product.handle') || val.includes('handle ==');
    const hasTagCondition = val.includes('product.tags') || val.includes('tags contains');
    const hasDescriptionFallbackLogic = val.includes('description_fallback') || val.includes('body_html');

    // Extract first 30 lines
    const firstLines = val.split('\n').slice(0, 30).join('\n');

    sectionAnalysis[k] = {
      length: val.length,
      hasMetafieldCondition,
      hasHandleCondition,
      hasTagCondition,
      hasDescriptionFallbackLogic,
      firstLines
    };
    console.log(`\n================== ${k} ==================`);
    console.log(`Length: ${val.length} chars`);
    console.log(`Uses Metafields: ${hasMetafieldCondition}`);
    console.log(`Uses Product Handle: ${hasHandleCondition}`);
    console.log(`Uses Product Tags: ${hasTagCondition}`);
    console.log(`First 20 lines:\n${val.split('\n').slice(0, 20).join('\n')}`);
  }

  fs.writeFileSync('scripts/audit_pdp_sections_analysis.json', JSON.stringify(sectionAnalysis, null, 2));
}

inspectSections().catch(console.error);
