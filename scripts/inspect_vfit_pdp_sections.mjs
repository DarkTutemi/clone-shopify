import { spawn } from 'child_process';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CDP_PORT = 9320;
const userDataDir = `${process.env.TEMP}\\chrome-inspect-pdp-${Date.now()}`;

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1100'
  ]);
  await new Promise(r => setTimeout(r, 1500));

  const resTabs = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
  const tabs = await resTabs.json();
  const tab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let idCounter = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      const handler = evt => {
        const msg = JSON.parse(evt.data.toString());
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

  await send('Page.enable');
  await send('DOM.enable');

  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-vfit-red-light-intimate-wellness-device' });
  await new Promise(r => setTimeout(r, 4000));

  const sectionsInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const sections = Array.from(document.querySelectorAll('main > *')).map(el => ({
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        textPreview: el.innerText.substring(0, 150).replace(/\\n/g, ' ')
      }));

      // Find where "Real Reviews from Over 100,000+ Women" is
      const allElements = Array.from(document.querySelectorAll('*'));
      const reviewHeading = allElements.find(el => el.innerText && el.innerText.includes('Real Reviews from Over 100,000+ Women'));
      let parentSection = null;
      if (reviewHeading) {
        let cur = reviewHeading;
        while (cur && cur.tagName !== 'MAIN' && cur.tagName !== 'BODY') {
          if (cur.tagName === 'SECTION' || cur.classList.contains('shopify-section') || cur.id) {
            parentSection = { tagName: cur.tagName, id: cur.id, className: cur.className };
            break;
          }
          cur = cur.parentElement;
        }
      }

      // Check if FAQ section exists on page
      const faqElem = document.querySelector('#zv-extended-faq, .zv-faq-accordion, [id*="faq"], .faq');

      return {
        sections,
        reviewHeadingFound: !!reviewHeading,
        reviewParentSection: parentSection,
        faqFound: !!faqElem,
        faqDetails: faqElem ? { id: faqElem.id, className: faqElem.className } : null
      };
    })()`,
    returnByValue: true
  });

  console.log('Result:', JSON.stringify(sectionsInfo.result.value, null, 2));

  await ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
}

main().catch(console.error);
