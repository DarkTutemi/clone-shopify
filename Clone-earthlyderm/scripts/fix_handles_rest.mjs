import fs from 'fs';

async function main() {
  const tokenRes = await fetch('https://vwpb1k-8z.myshopify.com/admin/oauth/access_token', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      client_id: '82d6aaab9e73809cb37b6643302b1255',
      client_secret: process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN",
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();

  const handles = ['turmeric-glow-soap', 'african-black-soap', 'turmeric-fade-glow-bar', 'turmeric-fade-glow-bar-razor-bumps'];

  for (const h of handles) {
    const res = await fetch(`https://vwpb1k-8z.myshopify.com/admin/api/2026-01/products.json?handle=${h}`, {
      headers: { 'X-Shopify-Access-Token': access_token }
    });
    const data = await res.json();
    const p = data.products && data.products[0];
    if (!p) {
      console.log(`Product ${h} not found`);
      continue;
    }
    let body = p.body_html || '';
    if (body.startsWith('id="shopify-section-')) {
      body = '<div ' + body.replace('&gt;', '>') + '</div>';
      const upRes = await fetch(`https://vwpb1k-8z.myshopify.com/admin/api/2026-01/products/${p.id}.json`, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product: { id: p.id, body_html: body } })
      });
      console.log(`Fixed ${h}: status ${upRes.status}`);
    } else {
      console.log(`${h} already clean or does not start with id=`);
    }
  }
}

main().catch(console.error);
