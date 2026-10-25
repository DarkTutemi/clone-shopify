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

function transformTitle(title) {
  let t = title.trim();

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

  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

function cleanHtmlText(html) {
  if (!html) return html;

  // We only want to replace brand text in visible text, not inside src="..." or href="..."
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
      .replace(/Zavelyn®®/g, 'Zavelyn®')
      .replace(/\bZavelyn\b(?!®)/g, 'Zavelyn®')
      .replace(/Zavelyn®®/g, 'Zavelyn®');

    return prefix + replacedText + suffix;
  });
}

async function main() {
  const token = await getAccessToken();
  console.log('Fetching all products from Shopify...');

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

  console.log(`Total products: ${products.length}`);

  const plannedUpdates = [];
  for (const p of products) {
    const newTitle = transformTitle(p.title);
    const newVendor = 'Zavelyn®';
    const newHtml = cleanHtmlText(p.body_html);

    const titleChanged = p.title !== newTitle;
    const vendorChanged = p.vendor !== newVendor;
    const htmlChanged = p.body_html !== newHtml;

    if (titleChanged || vendorChanged || htmlChanged) {
      plannedUpdates.push({
        id: p.id,
        handle: p.handle,
        oldTitle: p.title,
        newTitle,
        titleChanged,
        oldVendor: p.vendor,
        newVendor,
        vendorChanged,
        htmlChanged,
        newHtmlSnippet: htmlChanged ? newHtml.slice(0, 150) : null
      });
    }
  }

  console.log(`Products needing updates: ${plannedUpdates.length} of ${products.length}`);
  fs.writeFileSync('Clone-willafarm/scripts/planned_brand_updates.json', JSON.stringify(plannedUpdates, null, 2));
  console.log('Saved Clone-willafarm/scripts/planned_brand_updates.json');
}

main().catch(console.error);
