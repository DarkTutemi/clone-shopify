import fs from 'fs';

async function inspectCozyHeatDetails() {
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

  const details = await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Bundles
        const bundleTiers = Array.from(document.querySelectorAll('[class*="bundle"], [class*="tier"], [class*="card"]')).map(el => {
          const title = el.querySelector('[class*="title"], h3, h4, strong')?.innerText?.trim();
          const price = el.querySelector('[class*="price"]')?.innerText?.trim();
          return { title, price, text: el.innerText?.slice(0, 200)?.replace(/\\n+/g, ' ') };
        }).filter(b => b.title && b.price);

        // Swatches / Colors
        const swatches = Array.from(document.querySelectorAll('[data-value], [class*="swatch"], [class*="color"] input, label')).map(l => l.innerText?.trim() || l.getAttribute('data-value')).filter(Boolean);

        // Sections
        const sections = Array.from(document.querySelectorAll('main section, [class*="shopify-section"]')).map(s => ({
          id: s.id,
          heading: s.querySelector('h2, h3, h4')?.innerText?.trim(),
          text: s.innerText?.slice(0, 300)?.replace(/\\n+/g, ' '),
          images: Array.from(s.querySelectorAll('img')).map(i => ({ src: i.src, alt: i.alt })).filter(i => i.src && i.src.includes('http'))
        }));

        // FAQs
        const faqs = Array.from(document.querySelectorAll('details, [class*="faq"], [class*="accordion"]')).map(f => ({
          question: f.querySelector('summary, [class*="title"], [class*="question"]')?.innerText?.trim(),
          answer: f.querySelector('[class*="content"], [class*="answer"], p')?.innerText?.trim()
        })).filter(f => f.question);

        // All product gallery images
        const galleryImages = Array.from(document.querySelectorAll('.product__media img, [class*="gallery"] img, [class*="slider"] img')).map(i => ({
          src: i.src,
          alt: i.alt
        })).filter(i => i.src && i.src.includes('http'));

        return {
          bundleTiers,
          swatches: Array.from(new Set(swatches)),
          sections,
          faqs,
          galleryImages
        };
      })()
    `,
    returnByValue: true
  });

  fs.writeFileSync('cozyheat_details.json', JSON.stringify(details.result.value, null, 2));
  console.log('Inspected CozyHeat details saved to cozyheat_details.json');
  ws.close();
}

inspectCozyHeatDetails().catch(console.error);
