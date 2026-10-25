const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function getAccessToken() {
  const res = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function extractContentFromPage(url) {
  const res = await fetch(url);
  const html = await res.text();
  
  // Extract all sections between main and footer that contain headings and images
  const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  console.log(url, 'H2s:', h2Matches);

  // Extract custom_info_block
  const blockStart = html.indexOf('custom_info_block_cJKcnQ');
  if (blockStart !== -1) {
    const chunk = html.slice(blockStart - 50, blockStart + 12000);
    
    // Extract sections with images and text
    const pairs = [];
    const itemRegex = /<h2[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    while ((match = itemRegex.exec(chunk)) !== null) {
      const heading = match[1].replace(/<[^>]+>/g, '').trim();
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      if (heading && text && !heading.includes('Customer Reviews')) {
        pairs.push({ heading, text });
      }
    }

    const imgs = [...chunk.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]).filter(s => s.includes('/cdn/shop/files/'));
    console.log(url, 'Pairs found:', pairs.length, 'Images:', imgs.length);

    // Build rich HTML
    let outputHtml = '';
    pairs.forEach((p, idx) => {
      outputHtml += `<h2>${p.heading}</h2>\n<p>${p.text}</p>\n`;
      if (imgs[idx]) {
        const fullImg = imgs[idx].startsWith('//') ? 'https:' + imgs[idx] : imgs[idx];
        outputHtml += `<p><img src="${fullImg}" alt="${p.heading}" /></p>\n`;
      }
    });

    outputHtml += `
      <h2>Which size should I choose?</h2>
      <p>The shoe is suitable for both women and men and is available in all sizes and colors. See size chart.</p>
      <h2>Bronoir - SATISFACTION GUARANTEE:</h2>
      <p>From now on, you are equipped with the best shoes. If the barefoot shoes don't convince you, you can return them to us within 14 days, and the full amount will be refunded.</p>
      <p>Convince yourself and make your life easier, just like thousands of customers before you.</p>
    `;
    return outputHtml;
  }
  return '';
}

async function updateProduct(token, handle, html) {
  const findRes = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `{ productByHandle(handle: "${handle}") { id title } }`
    })
  });
  const findData = await findRes.json();
  const prod = findData.data?.productByHandle;
  if (!prod) {
    console.error(`Product not found for handle: ${handle}`);
    return;
  }

  const upRes = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product { id }
            userErrors { field message }
          }
        }
      `,
      variables: {
        input: {
          id: prod.id,
          descriptionHtml: html
        }
      }
    })
  });
  const upData = await upRes.json();
  if (upData.data?.productUpdate?.userErrors?.length > 0) {
    console.error('Update error:', upData.data.productUpdate.userErrors);
  } else {
    console.log(`✓ Successfully updated description for ${prod.title}!`);
  }
}

async function main() {
  const token = await getAccessToken();

  console.log('Extracting Streets...');
  const streetsHtml = await extractContentFromPage('https://trybronoir.com/products/bronoir-streets-casual-everyday-barefoot-shoes-1-1-free');
  if (streetsHtml) {
    await updateProduct(token, 'bronoir-streets-casual-everyday-barefoot-shoes-1-1-free', streetsHtml);
    await updateProduct(token, 'bronoir-streets-minimalist-everyday-barefoot-sneakers', streetsHtml);
  }

  console.log('Extracting Workers...');
  const workersHtml = await extractContentFromPage('https://trybronoir.com/products/bronoir-workers-casual-everyday-barefoot-shoes-1-1-free');
  if (workersHtml) {
    await updateProduct(token, 'bronoir-workers-casual-everyday-barefoot-shoes-1-1-free', workersHtml);
  }
}

main().catch(console.error);
