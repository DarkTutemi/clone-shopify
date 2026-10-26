import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function deepAudit5() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tRes.json();

  const handles = [
    'sakerplus®-universal-diesel-injector-removal-kit-clearance-sale',
    'zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves',
    'zavelyn-5-in-1-rotary-cheese-grater-shredder',
    'zavelyn-airclear-plugin-negative-ion-air-purifier',
    'sakerplus®-battery-powered-automatic-chicken-coop-door'
  ];

  const results = [];

  for (const h of handles) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?handle=${encodeURIComponent(h)}`, {
      headers: { 'X-Shopify-Access-Token': access_token }
    });
    const data = await res.json();
    if (!data.products || data.products.length === 0) continue;
    const p = data.products[0];
    const html = p.body_html || '';

    // Check metafields
    const mfRes = await fetch(`https://${SHOP}/admin/api/2024-10/products/${p.id}/metafields.json`, {
      headers: { 'X-Shopify-Access-Token': access_token }
    });
    const mfData = await mfRes.json();

    const hasTable = html.includes('<table');
    const hasUl = html.includes('<ul');
    const hasOl = html.includes('<ol');
    const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map(m => m[1]);
    const headings = [...html.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    const strongs = [...html.matchAll(/<strong>(.*?)<\/strong>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(s => s.length > 3 && s.length < 60);

    // Save sample html to disk for precise review
    fs.writeFileSync(`scripts/sample_body_${p.handle.slice(0, 20)}.html`, html);

    results.push({
      id: p.id,
      title: p.title,
      handle: p.handle,
      product_type: p.product_type,
      gallery_images_count: p.images.length,
      html_length: html.length,
      metafields: mfData.metafields ? mfData.metafields.map(m => `${m.namespace}.${m.key}`) : [],
      elements: {
        hasTable,
        hasUl,
        hasOl,
        inlineImagesCount: imgMatches.length
      },
      headings,
      strongSamples: strongs.slice(0, 8),
      inlineImages: imgMatches.slice(0, 4)
    });
  }

  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('scripts/audit_5_products_report.json', JSON.stringify(results, null, 2));
}

deepAudit5().catch(console.error);
