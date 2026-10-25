import fs from 'fs';

async function getLiveImages() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('sakerplus'));
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
    // 1. Get images from current page (checkout)
    const checkoutImgs = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.currentSrc || img.src,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        })).filter(i => i.src && i.src.includes('myshopage') && !i.src.includes('cardicon') && !i.src.includes('visa') && !i.src.includes('master'))
      `,
      returnByValue: true
    });
    console.log('Checkout page real images:', checkoutImgs.result.value);

    // 2. Navigate back to landing page to get landing page real images
    const landingUrl = 'https://m.sakerplus.com/funnel/landing-sakerplus-5-in-1-rotary-cheese-grater-shredder-2-cp-1778220759128';
    console.log('Navigating to landing page...');
    await send('Page.navigate', { url: landingUrl });
    await new Promise(r => setTimeout(r, 6000));

    const landingImgs = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.currentSrc || img.src || img.getAttribute('data-src'),
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        })).filter(i => i.src && i.src.includes('myshopage'))
      `,
      returnByValue: true
    });
    console.log('Landing page real images count:', landingImgs.result.value.length);
    fs.writeFileSync('cheese_grater_landing_imgs.json', JSON.stringify(landingImgs.result.value, null, 2), 'utf8');

    ws.close();
  });
}

getLiveImages().catch(console.error);
