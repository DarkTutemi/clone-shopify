import fs from 'fs';

const gifs = [
  { id: 1, url: 'https://file.myshopage.com/c64650b534655c160fa283be5f45b1c8.gif', name: 'gif_1_no_dig_hammer.gif' },
  { id: 2, url: 'https://file.myshopage.com/c9616150c6deb3aa9c37f613f94f00d6.gif', name: 'gif_2_stop_wobble.gif' },
  { id: 3, url: 'https://file.myshopage.com/cd715597e59002cad4b146c7bb453697.gif', name: 'gif_3_tighten_bolts.gif' },
  { id: 4, url: 'https://file.myshopage.com/b570b9c77d8ef348729b073fc784d07f.gif', name: 'gif_4_stability_storm.gif' }
];

async function main() {
  fs.mkdirSync('fence_gifs', { recursive: true });

  const res = await fetch('http://127.0.0.1:9222/json');
  const pages = await res.json();
  const targetPage = pages.find(p => p.url.includes('news-sakerplus-fence-post-repair-kit') || p.title.includes('Fence Post'));

  if (!targetPage) {
    console.error('Target page not found in open browser pages!');
    process.exit(1);
  }

  console.log('Connecting to page:', targetPage.title, targetPage.webSocketDebuggerUrl);
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

  for (const item of gifs) {
    console.log(`\nFetching GIF ${item.id}: ${item.url}...`);
    const evalScript = `
      (async () => {
        try {
          const r = await fetch("${item.url}");
          const b = await r.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(b);
          });
        } catch (err) {
          return "ERROR: " + err.message;
        }
      })()
    `;

    const result = await sendCdp('Runtime.evaluate', {
      expression: evalScript,
      awaitPromise: true,
      returnByValue: true
    });

    const dataUrl = result.result?.value;
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
      const base64Data = dataUrl.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const outPath = `fence_gifs/${item.name}`;
      fs.writeFileSync(outPath, buffer);
      console.log(`✔ Successfully saved ${outPath} (${buffer.length} bytes)`);
    } else {
      console.error(`✗ Failed to get data for GIF ${item.id}:`, dataUrl);
    }
  }

  ws.close();
  console.log('\nAll done!');
}

main().catch(console.error);
