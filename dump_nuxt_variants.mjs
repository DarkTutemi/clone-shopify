async function dumpNuxtState() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('checkout-sakerplus-5-in-1-rotary-cheese-grater'));
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }
  ws.addEventListener('open', async () => {
    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const nuxt = window.__NUXT__;
          const pageData = nuxt?.data?.[0]?.pageData;
          const checkoutSection = pageData?.content?.find(c => c.type === 'funnel_checkout' || c.name === 'Funnel结算' || c.blocks?.settings?.length > 0);
          const blocks = checkoutSection?.blocks?.settings || [];
          return {
            variants: blocks.map(b => ({
              handle: b.funnel_checkout_product_handle,
              tag: b.funnel_checkout_product_tag,
              title: b.productData?.title,
              combine: b.productData?.combine,
              price: b.productData?.price,
              marketPrice: b.productData?.marketPrice,
              image: b.productData?.images?.[0]?.url,
              sku: b.productData?.sku
            }))
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Parsed Nuxt Variants:', JSON.stringify(res.result.value, null, 2));
    ws.close();
  });
}
dumpNuxtState().catch(console.error);
