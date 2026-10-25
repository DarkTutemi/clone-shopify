import fs from 'fs';

const domain = 'dsdujr-vn.myshopify.com';
const id = '172e9e29abd0fe12f671d8441479c7c2';
const sec = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const tRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: id, client_secret: sec, grant_type: 'client_credentials' })
  });
  const { access_token } = await tRes.json();
  return access_token;
}

function transformTitle(rawTitle) {
  let t = (rawTitle || '').normalize('NFC').trim();

  // If already starts with Zavelyn®
  if (t.startsWith('Zavelyn®')) {
    return t;
  }

  // Replace Sakerplus® or Sakerplus or Saker® or Saker
  t = t.replace(/^Sakerplus®\s*/i, 'Zavelyn® ');
  t = t.replace(/^Sakerplus\s*/i, 'Zavelyn® ');
  t = t.replace(/^Saker®\s*/i, 'Zavelyn® ');
  t = t.replace(/^Saker\s*/i, 'Zavelyn® ');

  // Replace Naväge or Navage
  t = t.replace(/^Naväge\s*/i, 'Zavelyn® ');
  t = t.replace(/^Navage\s*/i, 'Zavelyn® ');

  // Replace Thoson MagTrack™ or Thoson
  t = t.replace(/^Thoson MagTrack™/i, 'Zavelyn® MagTrack™');
  t = t.replace(/^Thoson\s*/i, 'Zavelyn® ');

  // Replace The Yeoman Sweep
  t = t.replace(/^The Yeoman Sweep/i, 'Zavelyn® Yeoman Sweep');

  // Replace SrefalSteam™
  t = t.replace(/^SrefalSteam™/i, 'Zavelyn® Steam Pro');
  t = t.replace(/^SrefalSteam/i, 'Zavelyn® Steam Pro');

  // Replace Zavelyn without ®
  if (t.startsWith('Zavelyn |')) {
    t = t.replace(/^Zavelyn\s*\|\s*/i, 'Zavelyn® ');
  } else if (t.startsWith('Zavelyn ')) {
    t = t.replace(/^Zavelyn\s+/i, 'Zavelyn® ');
  } else if (!t.startsWith('Zavelyn®')) {
    t = `Zavelyn® ${t}`;
  }

  // Clean double spaces or marks
  t = t.replace(/Zavelyn®®+/g, 'Zavelyn®');
  t = t.replace(/Zavelyn®\s*Zavelyn®/g, 'Zavelyn®');
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function cleanHtmlText(rawHtml) {
  if (!rawHtml) return rawHtml;

  const html = rawHtml.normalize('NFC');

  // Replace only in text segments between tags, avoiding URLs and tag attributes
  return html.replace(/(>|^)([^<]+)(<|$)/g, (match, prefix, text, suffix) => {
    let replacedText = text
      .replace(/Sakerplus®/gi, 'Zavelyn®')
      .replace(/Sakerplus/gi, 'Zavelyn®')
      .replace(/Saker®/gi, 'Zavelyn®')
      .replace(/\bSaker\b/gi, 'Zavelyn®')
      .replace(/Naväge®?/gi, 'Zavelyn®')
      .replace(/\bNavage\b/gi, 'Zavelyn®')
      .replace(/Thoson MagTrack™/gi, 'Zavelyn® MagTrack™')
      .replace(/\bThoson\b/gi, 'Zavelyn®')
      .replace(/The Yeoman Sweep/gi, 'Zavelyn® Yeoman Sweep')
      .replace(/Yeoman Sweep/gi, 'Zavelyn® Yeoman Sweep')
      .replace(/SrefalSteam™?/gi, 'Zavelyn® Steam Pro')
      .replace(/\bSrefal\b/gi, 'Zavelyn®')
      .replace(/Zavelyn®®+/g, 'Zavelyn®')
      .replace(/\bZavelyn\b(?!®)/g, 'Zavelyn®')
      .replace(/Zavelyn®®+/g, 'Zavelyn®');

    return prefix + replacedText + suffix;
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateProductWithRetry(token, productId, payload, retries = 3) {
  const url = `https://${domain}/admin/api/2024-10/products/${productId}.json`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ product: payload })
    });

    if (res.status === 429) {
      console.warn(`    ⚠️ Rate limit (429) on product ${productId}, waiting 2.5s before retry ${attempt}/${retries}...`);
      await delay(2500);
      continue;
    }

    if (res.ok) {
      return await res.json();
    } else {
      const err = await res.text();
      throw new Error(`Failed to update ${productId} (HTTP ${res.status}): ${err.slice(0, 300)}`);
    }
  }
  throw new Error(`Max retries exceeded for product ${productId}`);
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Fetching all products from Shopify...');

  let products = [];
  let url = `https://${domain}/admin/api/2024-10/products.json?limit=250`;
  while (url) {
    const res = await fetch(url, { headers: { 'X-Shopify-Access-Token': token } });
    const data = await res.json();
    products = products.concat(data.products || []);
    const link = res.headers.get('link');
    if (link && link.includes('rel="next"')) {
      const match = link.match(/<([^>]+)>;\s*rel="next"/);
      url = match ? match[1] : null;
    } else {
      url = null;
    }
  }

  console.log(`\nFetched ${products.length} products. Beginning synchronization to Zavelyn®...\n`);

  const results = [];
  let countUpdated = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const newTitle = transformTitle(p.title);
    const newVendor = 'Zavelyn®';
    const newBodyHtml = cleanHtmlText(p.body_html);

    const titleChanged = p.title !== newTitle;
    const vendorChanged = p.vendor !== newVendor;
    const bodyChanged = p.body_html !== newBodyHtml;

    if (titleChanged || vendorChanged || bodyChanged) {
      process.stdout.write(`[${i + 1}/${products.length}] Updating product ${p.id} ("${p.title.slice(0, 35)}")... `);
      try {
        await updateProductWithRetry(token, p.id, {
          id: p.id,
          title: newTitle,
          vendor: newVendor,
          body_html: newBodyHtml
        });
        countUpdated++;
        console.log(`✔ [${newTitle.slice(0, 40)}]`);
        results.push({
          id: p.id,
          status: 'SUCCESS',
          oldTitle: p.title,
          newTitle,
          oldVendor: p.vendor,
          newVendor,
          bodyChanged
        });
      } catch (err) {
        console.error(`✗ Error: ${err.message}`);
        results.push({
          id: p.id,
          status: 'ERROR',
          error: err.message
        });
      }
      await delay(350);
    } else {
      console.log(`[${i + 1}/${products.length}] Product ${p.id} already synchronized: "${p.title.slice(0, 35)}"`);
      results.push({
        id: p.id,
        status: 'ALREADY_SYNCED',
        title: p.title,
        vendor: p.vendor
      });
    }
  }

  console.log(`\n========================================`);
  console.log(`Synchronization Complete!`);
  console.log(`Total Products: ${products.length}`);
  console.log(`Products Updated: ${countUpdated}`);
  console.log(`========================================\n`);

  fs.writeFileSync('Clone-willafarm/scripts/sync_catalog_results.json', JSON.stringify(results, null, 2));
  console.log('Saved detailed results to Clone-willafarm/scripts/sync_catalog_results.json');
}

main().catch(console.error);
