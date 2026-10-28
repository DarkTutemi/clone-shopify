import { spawn } from 'child_process';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CDP_PORT = 9325;
const userDataDir = `${process.env.TEMP}\\chrome-live-faq-${Date.now()}`;
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1200'
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

  console.log('Navigating to Live vFit PDP...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-vfit-red-light-intimate-wellness-device?nocache=' + Date.now() });
  await new Promise(r => setTimeout(r, 4000));

  const faqData = await send('Runtime.evaluate', {
    expression: `(() => {
      const reviewHeader = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('Real Reviews from Over 100,000+ Women'));
      const faqSection = document.querySelector('.zv-vfit-faq-section');
      const faqItems = Array.from(document.querySelectorAll('.zv-vfit-faq-item'));
      
      const rRect = reviewHeader ? reviewHeader.getBoundingClientRect() : null;
      const fRect = faqSection ? faqSection.getBoundingClientRect() : null;
      
      const isUnderReviews = rRect && fRect && (fRect.top > rRect.top);

      const itemsSummary = faqItems.map(item => {
        const q = item.querySelector('summary')?.innerText?.trim();
        const a = item.querySelector('.zv-vfit-faq-answer')?.innerText?.trim()?.substring(0, 80);
        const isOpen = item.hasAttribute('open');
        return { q, a, isOpen };
      });

      return {
        hasReviewHeader: !!reviewHeader,
        hasFaqSection: !!faqSection,
        isFaqUnderReviews: isUnderReviews,
        faqItemsCount: faqItems.length,
        itemsSummary: itemsSummary.slice(0, 5)
      };
    })()`,
    returnByValue: true
  });

  console.log('vFit FAQ Verification Data:', JSON.stringify(faqData.result.value, null, 2));

  // Scroll to Reviews & FAQ section and capture screenshot
  console.log('\nScrolling to Reviews & FAQ section...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const reviewHeader = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('Real Reviews from Over 100,000+ Women'));
      if (reviewHeader) {
        reviewHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -60);
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const shotClip = await send('Runtime.evaluate', {
    expression: `(() => {
      const reviewHeader = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('Real Reviews from Over 100,000+ Women'));
      const faqSection = document.querySelector('.zv-vfit-faq-section');
      if (!reviewHeader || !faqSection) return null;
      const r1 = reviewHeader.getBoundingClientRect();
      const r2 = faqSection.getBoundingClientRect();
      const x = Math.max(0, Math.min(r1.left, r2.left) - 40);
      const y = Math.max(0, r1.top - 20);
      const width = Math.max(r1.width, r2.width, 900) + 80;
      const height = Math.min(1800, (r2.bottom - r1.top) + 60);
      return { x, y, width, height, scale: 1 };
    })()`,
    returnByValue: true
  });

  if (shotClip.result.value) {
    const clip = shotClip.result.value;
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 1 }
    });
    const shotPath = `${ARTIFACTS_DIR}/vfit_reviews_and_faq_verified.png`;
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`✓ Saved Reviews + FAQ screenshot to ${shotPath}`);
  }

  // Also verify BotanaRoots zero bleed
  console.log('\nVerifying BotanaRoots zero bleed...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?nocache=' + Date.now() });
  await new Promise(r => setTimeout(r, 3000));

  const botanaCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const hasVfitFaq = !!document.querySelector('.zv-vfit-faq-section');
      return { hasVfitFaq };
    })()`,
    returnByValue: true
  });
  console.log('BotanaRoots Zero Bleed Check:', JSON.stringify(botanaCheck.result.value, null, 2));

  await ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
}

main().catch(console.error);
