import fs from 'fs';

const FUNNEL_URL = 'https://m.sakerplus.com/funnel/news-sakerplus-fence-post-repair-kit';

async function inspectFunnel() {
  console.log(`Inspecting Funnel URL: ${FUNNEL_URL}`);
  
  try {
    const res = await fetch(FUNNEL_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
      }
    });
    
    console.log('Status:', res.status);
    console.log('Final URL after redirects:', res.url);
    const html = await res.text();
    console.log('HTML length:', html.length);
    
    fs.writeFileSync('Clone-sakerplus/data/funnel_fence_post.html', html);
    console.log('Saved to Clone-sakerplus/data/funnel_fence_post.html');

    // Title & Headings
    const title = html.match(/<title>([^<]+)<\/title>/i);
    console.log('Title:', title ? title[1] : 'N/A');

    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    console.log('H1:', h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : 'N/A');

    // Check for buy buttons, checkout links, product handles
    const productLinks = [...html.matchAll(/href=["']([^"']*(?:products|checkouts|cart)[^"']*)["']/gi)];
    console.log('Product/Checkout links in funnel:', [...new Set(productLinks.map(m => m[1]))].slice(0, 10));

    // Check for shopify / platform identifier
    const isShopify = html.includes('Shopify') || html.includes('cdn.shopify.com');
    console.log('Is Shopify or hosted on Shopify CDN:', isShopify);

    // Look for product IDs
    const prodIds = [...html.matchAll(/(?:product_id|productId|variant_id|variantId)["']?\s*[:=]\s*["']?(\d+)/gi)];
    console.log('Found product/variant IDs in funnel:', [...new Set(prodIds.map(m => m[1]))]);
  } catch (e) {
    console.error('Error fetching funnel:', e.message);
  }
}

inspectFunnel();
