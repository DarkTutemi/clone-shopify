import fs from 'fs';

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const pages = await res.json();
  const page = pages.find(p => p.url.includes('sakerplus-fence-post-repair-kit') || (p.type === 'page' && !p.url.startsWith('chrome')));

  if (!page) {
    console.error('No page found');
    return;
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const i = id++;
    const h = (e) => {
      const m = JSON.parse(e.data);
      if (m.id === i) {
        ws.removeEventListener('message', h);
        m.error ? reject(m.error) : resolve(m.result);
      }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: i, method, params }));
  });

  console.log('Clicking Shop Now button in live browser...');
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("willaPdpShopNowBtn").click();'
  });

  // Wait 3 seconds for checkout redirect
  await new Promise(r => setTimeout(r, 3500));

  const urlEval = await send('Runtime.evaluate', {
    expression: 'window.location.href',
    returnByValue: true
  });

  console.log('Current URL after clicking Shop Now:', urlEval.result.value);

  // Take screenshot of checkout / cart page
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('fence_checkout_redirect_screenshot.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved fence_checkout_redirect_screenshot.png');

  ws.close();
}

main().catch(console.error);
