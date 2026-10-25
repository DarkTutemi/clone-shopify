import fs from 'fs';

async function inspectSections() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = evt => {
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

  await new Promise(r => ws.addEventListener('open', r));

  const sectionsData = await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Find all main sections
        const sections = Array.from(document.querySelectorAll('main section, [class*="shopify-section"]')).map((sec, idx) => {
          return {
            index: idx,
            id: sec.id,
            className: sec.className,
            heading: sec.querySelector('h1, h2, h3, h4')?.innerText?.trim(),
            textPreview: sec.innerText?.slice(0, 300)?.replace(/\\n+/g, ' '),
            images: Array.from(sec.querySelectorAll('img')).map(i => ({ src: i.src, alt: i.alt })).filter(i => i.src && i.src.includes('http'))
          };
        });

        // Check for Judge.me or reviews
        const reviewWidget = document.querySelector('.jdgm-widget, [class*="review"], [id*="review"]');
        const reviewCount = document.querySelectorAll('.jdgm-rev, [class*="review-item"]').length;

        // Check for FAQ
        const faqs = Array.from(document.querySelectorAll('details, .faq-item, [class*="accordion"]')).map(f => ({
          question: f.querySelector('summary, [class*="question"], [class*="title"]')?.innerText?.trim(),
          answer: f.querySelector('[class*="content"], [class*="answer"], p')?.innerText?.trim()
        })).filter(f => f.question);

        // Check bundle widget
        const bundleCards = Array.from(document.querySelectorAll('[class*="bundle"], [class*="tier"], [class*="pack"], input[name="id"]')).map(b => b.innerText?.trim() || b.value);

        return {
          sections,
          reviewCount,
          faqs,
          bundleCards
        };
      })()
    `,
    returnByValue: true
  });

  fs.writeFileSync('nroome_sections_inspected.json', JSON.stringify(sectionsData.result.value, null, 2));
  console.log(`Inspected ${sectionsData.result.value.sections.length} sections, ${sectionsData.result.value.faqs.length} FAQs.`);
  ws.close();
}

inspectSections().catch(console.error);
