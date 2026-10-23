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

  const res = await fetch('https://vwpb1k-8z.myshopify.com/admin/api/2026-01/products.json', {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const { products } = await res.json();

  for (const p of products) {
    let body = p.body_html || '';
    if (body.startsWith('id="shopify-section-')) {
      // It has id="..." class="..."&gt; or >
      // Replace leading with <div id=...
      body = '<div ' + body.replace('&gt;', '>');
      const updateRes = await fetch(`https://vwpb1k-8z.myshopify.com/admin/api/2026-01/products/${p.id}.json`, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': access_token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product: {
            id: p.id,
            body_html: body + '</div>'
          }
        })
      });
      console.log(`Updated ${p.handle} via REST: status ${updateRes.status}`);
    }
  }
}

main().catch(console.error);
