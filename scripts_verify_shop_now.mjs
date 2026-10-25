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

  console.log('Navigating to live PDP...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/sakerplus-fence-post-repair-kit' });
  await new Promise(r => setTimeout(r, 4000));

  const checkScript = `
    (() => {
      const btn = document.getElementById('willaPdpShopNowBtn');
      if (!btn) return { error: 'Button not found' };

      const rect = btn.getBoundingClientRect();
      const style = window.getComputedStyle(btn);

      return {
        found: true,
        text: btn.innerText.trim(),
        width: rect.width,
        height: rect.height,
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderRadius: style.borderRadius,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        onclickAttr: btn.getAttribute('onclick'),
        hasFunction: typeof window.submitPdpDirectCheckout === 'function'
      };
    })()
  `;

  const info = await send('Runtime.evaluate', {
    expression: checkScript,
    returnByValue: true
  });

  console.log('Shop Now Button Evaluation:', JSON.stringify(info.result?.value, null, 2));

  // Take screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('fence_shopnow_fixed_screenshot.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved screenshot to fence_shopnow_fixed_screenshot.png');

  ws.close();
}

main().catch(console.error);
