import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function run() {
  console.log('--- 1. ANALYZING CURRENT ZAVELYN THEME ---');
  const token = await getAccessToken();

  // Fetch list of assets on live theme
  const assetsRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { assets } = await assetsRes.json();
  console.log(`Live theme has ${assets.length} total assets.`);

  const layouts = assets.filter(a => a.key.startsWith('layout/'));
  const templates = assets.filter(a => a.key.startsWith('templates/'));
  const sections = assets.filter(a => a.key.startsWith('sections/'));
  const snippets = assets.filter(a => a.key.startsWith('snippets/'));
  const assetFiles = assets.filter(a => a.key.startsWith('assets/'));

  console.log(`- Layouts: ${layouts.length} (${layouts.map(l => l.key).join(', ')})`);
  console.log(`- Templates: ${templates.length}`);
  console.log(`- Sections: ${sections.length}`);
  console.log(`- Snippets: ${snippets.length}`);
  console.log(`- Asset Files: ${assetFiles.length}`);

  // Fetch index.json (Homepage structure)
  const indexRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=templates/index.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const indexData = await indexRes.json();
  if (indexData.asset?.value) {
    const indexParsed = JSON.parse(indexData.asset.value);
    console.log('\nCurrent Homepage Sections Order:');
    (indexParsed.order || []).forEach((secKey, idx) => {
      const sec = indexParsed.sections[secKey];
      console.log(`  ${idx + 1}. [${secKey}] Type: ${sec?.type}`);
    });
  }

  // Fetch product.json (PDP structure)
  const prodTplRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=templates/product.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const prodTplData = await prodTplRes.json();
  if (prodTplData.asset?.value) {
    const prodParsed = JSON.parse(prodTplData.asset.value);
    console.log('\nCurrent Default Product Template Sections:');
    (prodParsed.order || []).forEach((secKey, idx) => {
      const sec = prodParsed.sections[secKey];
      console.log(`  ${idx + 1}. [${secKey}] Type: ${sec?.type}`);
    });
  }

  // 2. FETCH AND ANALYZE REFERENCE SITE (kittycollective.co)
  console.log('\n--- 2. ANALYZING REFERENCE SITE (kittycollective.co) ---');
  try {
    const refRes = await fetch('https://kittycollective.co/');
    const refHtml = await refRes.text();

    // Title & meta
    const title = refHtml.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
    console.log('Reference Title:', title);

    // Section headings & structural markers
    const sectionMatches = [...refHtml.matchAll(/<section[^>]*id=["']([^"']+)["'][^>]*>/gi)];
    console.log(`Found ${sectionMatches.length} <section> elements.`);

    const h2s = [...refHtml.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    console.log('\nReference Major Headings:');
    h2s.forEach((h, i) => console.log(`  ${i + 1}. ${h}`));

    // Check color scheme from CSS
    const colors = refHtml.match(/--global-button-bg-color:[^;]+|--color-background:[^;]+|--color-foreground:[^;]+|--font-heading-family:[^;]+/g);
    console.log('\nReference Design Tokens:', colors);
  } catch (e) {
    console.error('Error fetching reference:', e.message);
  }
}

run();
