import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9287;
const DRAFT_THEME_ID = '187708571833';
const URL = `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}`;

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-verify-swap-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,2400',
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
  await new Promise(r => setTimeout(r, 6500));

  const pageAnalysis = await send('Runtime.evaluate', {
    expression: `(() => {
      // Find all headings with 'Frequently Asked Questions'
      const allFaqHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, .zv-section-title')).filter(h => h.innerText.toLowerCase().includes('frequently asked questions')).map(h => ({
        tag: h.tagName,
        text: h.innerText.trim(),
        sectionId: h.closest('[id^="shopify-section-"]')?.id,
        parentClass: h.parentElement.className,
        isInAccordion: !!h.closest('.zv-botana-faq-section'),
        prevSiblingHeading: (() => {
          let prev = h.closest('.zv-botana-faq-section')?.previousElementSibling;
          while (prev) {
            let found = prev.querySelector('h1, h2, h3, h4');
            if (found) return found.innerText.trim();
            prev = prev.previousElementSibling;
          }
          return null;
        })(),
        nextSiblingHeading: (() => {
          let next = h.closest('.zv-botana-faq-section')?.nextElementSibling;
          while (next) {
            let found = next.querySelector('h1, h2, h3, h4');
            if (found) return found.innerText.trim();
            next = next.nextElementSibling;
          }
          return null;
        })()
      }));

      // Check the new accordion
      const accordion = document.querySelector('.zv-botana-faq-section');
      let accordionData = null;
      if (accordion) {
        const items = Array.from(accordion.querySelectorAll('.zv-botana-faq-item')).map(item => ({
          question: item.querySelector('.zv-botana-faq-qtext')?.innerText.trim(),
          answer: item.querySelector('.zv-botana-faq-content')?.innerText.trim().slice(0, 100),
          isOpen: item.hasAttribute('open')
        }));
        accordionData = {
          itemCount: items.length,
          items: items
        };
      }

      // Check whether static FAQ exists anywhere
      const staticFaqMatches = [];
      document.querySelectorAll('strong').forEach(s => {
        if (s.innerText.includes('Can I use this on color-treated') && !s.closest('.zv-botana-faq-section')) {
          staticFaqMatches.push(s.outerHTML);
        }
      });

      // Check whether shopify-section-template--...__faq is visible
      const faqSectionEl = document.querySelector('[id*="__faq"]');
      const faqSectionHeight = faqSectionEl ? faqSectionEl.offsetHeight : null;

      return {
        allFaqHeadings,
        accordionData,
        staticFaqMatchesCount: staticFaqMatches.length,
        faqSectionHeight
      };
    })()`,
    returnByValue: true
  });

  console.log('Analysis Result:\n', JSON.stringify(pageAnalysis.result?.value, null, 2));

  // Test interactive click on item 1 and item 2
  const clickTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const accordion = document.querySelector('.zv-botana-faq-section');
      if (!accordion) return { error: 'Accordion not found' };
      const items = accordion.querySelectorAll('.zv-botana-faq-item');
      if (items.length < 2) return { error: 'Not enough items' };

      // Click item 1
      const summary1 = items[0].querySelector('summary');
      summary1.click();
      const stateAfterClick1 = {
        item0Open: items[0].open,
        item1Open: items[1].open
      };

      // Click item 2
      const summary2 = items[1].querySelector('summary');
      summary2.click();
      const stateAfterClick2 = {
        item0Open: items[0].open,
        item1Open: items[1].open
      };

      return { stateAfterClick1, stateAfterClick2 };
    })()`,
    returnByValue: true
  });

  console.log('Click Test Result:\n', JSON.stringify(clickTest.result?.value, null, 2));

  // Scroll to accordion and take screenshot
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.zv-botana-faq-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const shotPath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\faq_accordion_position2_verified.png';
  fs.writeFileSync(shotPath, Buffer.from(screenshot.data, 'base64'));
  console.log(`✓ Screenshot saved to: ${shotPath}`);

  chromeProc.kill();
}

main().catch(console.error);
