import fs from 'fs';

async function verifyBlowerPdp() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && (t.url.includes('saker') || t.url.includes('tryzavelyn')));
  console.log('Connecting to tab:', tab.id, tab.url);

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
    const targetUrl = 'https://tryzavelyn.com/products/saker-cordless-turbo-leaf-blower';
    console.log('Navigating to:', targetUrl);
    await send('Page.navigate', { url: targetUrl });
    await new Promise(r => setTimeout(r, 4500));

    const outDir = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';

    // 1. Hero & Buybox
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 600));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${outDir}/blower_live_1_hero.png`, Buffer.from(shot.data, 'base64'));
    console.log('✔ Captured blower_live_1_hero.png');

    // 2. Click 2nd Variant (2 Batteries + Toolbox) and test price
    await send('Runtime.evaluate', {
      expression: `
        const chips = document.querySelectorAll('.willa-variant-chip');
        if (chips.length > 1) chips[1].click();
      `
    });
    await new Promise(r => setTimeout(r, 500));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${outDir}/blower_live_2_variant2.png`, Buffer.from(shot.data, 'base64'));
    console.log('✔ Captured blower_live_2_variant2.png');

    // 3. Scroll to Product Description & GIFs
    await send('Runtime.evaluate', {
      expression: `
        const desc = document.querySelector('.zavelyn-blower-desc') || document.querySelector('.willa-faq-item');
        if (desc) desc.scrollIntoView();
      `
    });
    await new Promise(r => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${outDir}/blower_live_3_desc_gifs.png`, Buffer.from(shot.data, 'base64'));
    console.log('✔ Captured blower_live_3_desc_gifs.png');

    // 4. Scroll further down in description
    await send('Runtime.evaluate', { expression: 'window.scrollBy(0, 700);' });
    await new Promise(r => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${outDir}/blower_live_4_desc_reasons.png`, Buffer.from(shot.data, 'base64'));
    console.log('✔ Captured blower_live_4_desc_reasons.png');

    ws.close();
    console.log('ALL BLOWER SCREENSHOTS CAPTURED!');
  });
}

verifyBlowerPdp().catch(console.error);
