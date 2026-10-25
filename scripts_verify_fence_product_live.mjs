import fs from 'fs';

async function main() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const pages = await res.json();
  const targetPage = pages.find(p => p.type === 'page' && !p.url.startsWith('chrome'));

  if (!targetPage) {
    console.error('No suitable page found');
    return;
  }

  console.log('Using page:', targetPage.id, targetPage.url);
  const ws = new WebSocket(targetPage.webSocketDebuggerUrl);

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  function sendCdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  console.log('Navigating to live PDP...');
  await sendCdp('Page.navigate', { url: 'https://tryzavelyn.com/products/sakerplus-fence-post-repair-kit' });

  // Wait 4 seconds for render
  await new Promise(r => setTimeout(r, 4000));

  const checkScript = `
    (() => {
      const title = document.querySelector('h1')?.innerText || document.title;
      const price = document.querySelector('.price, [class*="price"]')?.innerText;
      const gifs = Array.from(document.querySelectorAll('img[src*=".gif"]')).map(img => ({
        src: img.src,
        width: img.clientWidth,
        height: img.clientHeight,
        complete: img.complete
      }));
      const allImgs = document.querySelectorAll('img').length;
      return { title, price, gifCount: gifs.length, gifs, allImgs };
    })()
  `;

  const info = await sendCdp('Runtime.evaluate', {
    expression: checkScript,
    returnByValue: true
  });

  console.log('Page Evaluation Info:', JSON.stringify(info.result?.value, null, 2));

  // Take screenshot of description area
  const screenshot = await sendCdp('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false
  });

  if (screenshot.data) {
    fs.writeFileSync('fence_pdp_screenshot.png', Buffer.from(screenshot.data, 'base64'));
    console.log('✔ Saved screenshot to fence_pdp_screenshot.png');
  }

  ws.close();
}

main().catch(console.error);
