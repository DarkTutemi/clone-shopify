// Built-in global fetch

async function test() {
  const url = 'https://tryzavelyn.com/collections/deals-of-the-day?view=showroom&preview_theme_id=187926020281';
  const res1 = await fetch(url, { redirect: 'manual' });
  console.log('Status 1:', res1.status, 'Location:', res1.headers.get('location'));
  const setCookie = res1.headers.get('set-cookie');
  console.log('Set-Cookie:', setCookie ? setCookie.slice(0, 100) : 'none');

  const res = await fetch(url, {
    headers: {
      'Cookie': '_shopify_essential=true; preview_theme_id=187926020281; ' + (setCookie || '')
    }
  });
  console.log('Final URL:', res.url, 'Status:', res.status);
  const text = await res.text();
  console.log('Body length:', text.length);
  const hasStage = text.includes('zvShowroomStage');
  console.log('Contains zvShowroomStage:', hasStage);
  const match = text.match(/data-product-json="([^"]+)"/);
  if (match) {
    const raw = match[1]
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    console.log('Sample raw JSON length:', raw.length);
    try {
      const obj = JSON.parse(raw);
      console.log('✅ JSON parse SUCCESS! Title:', obj.title, '| Variants:', obj.variants.length);
    } catch (e) {
      console.error('❌ JSON parse ERROR:', e.message);
      console.log('Raw snippet around error:', raw.slice(0, 300));
    }
  } else {
    console.log('No data-product-json found');
  }
}

test();
