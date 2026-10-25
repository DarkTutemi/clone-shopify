import fs from 'fs';

async function sendCdp(ws, method, params = {}, id = 1) {
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  const ws = new WebSocket('ws://127.0.0.1:9222/devtools/page/AF9C7C01907A48572E5169E34B27826D');
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++id);

  await call('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 2500));

  const urlRes = await call('Runtime.evaluate', { expression: 'window.location.href' });
  console.log('Live Tab URL:', urlRes.result.value);

  const titleRes = await call('Runtime.evaluate', { expression: 'document.title' });
  console.log('Live Page Title:', titleRes.result.value);

  const bodySnippet = await call('Runtime.evaluate', { expression: 'document.body.innerHTML.slice(0, 300)' });
  console.log('Body snippet:', bodySnippet.result.value);

  const logoRes = await call('Runtime.evaluate', { expression: 'document.querySelector(".willa-logo-link")?.innerText' });
  console.log('Live Header Logo:', logoRes.result.value);

  const heroTitleRes = await call('Runtime.evaluate', { expression: 'document.querySelector(".willa-hero-content h1")?.innerText' });
  console.log('Live Hero Title:', heroTitleRes.result.value);

  const heroBadgeRes = await call('Runtime.evaluate', { expression: 'document.querySelector(".willa-hero-badge")?.innerText' });
  console.log('Live Hero Badge:', heroBadgeRes.result.value);

  const shot = await call('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('Clone-willafarm/reports/tryzavelyn_updated_home.png', Buffer.from(shot.data, 'base64'));
  console.log('Saved screenshot to Clone-willafarm/reports/tryzavelyn_updated_home.png');

  ws.close();
}

main().catch(console.error);
