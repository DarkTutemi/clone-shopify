import { spawn } from 'child_process';

const PORT = 9285;
const DRAFT_THEME_ID = '187708571833';
const URL = `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}`;

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-find-faq-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));
  const res = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await res.json();
  const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = msgId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 6000));

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      const occurrences = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.includes('chemically straightened')) {
          let p = node.parentElement;
          let section = p.closest('[id^="shopify-section-"]') || p.closest('section') || p;
          occurrences.push({
            text: node.textContent.trim(),
            parentTag: p.tagName,
            parentClass: p.className,
            sectionId: section.id,
            sectionClass: section.className,
            outerHTML: p.outerHTML.slice(0, 300)
          });
        }
      }

      // Also find all elements that have heading 'Frequently Asked Questions'
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, .zv-section-title')).filter(h => h.innerText.toLowerCase().includes('frequently asked questions')).map(h => ({
        tag: h.tagName,
        text: h.innerText.trim(),
        sectionId: h.closest('[id^="shopify-section-"]')?.id,
        parentHtml: h.parentElement.outerHTML.slice(0, 300)
      }));

      return { occurrences, headings };
    })()`,
    returnByValue: true
  });

  console.log('Result:', JSON.stringify(result.result?.value, null, 2));
  chromeProc.kill();
}

main().catch(console.error);
