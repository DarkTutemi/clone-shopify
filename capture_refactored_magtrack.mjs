import fs from 'fs';

async function main() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && t.url.includes('thoson-magtrack')) || tabs[0];
  console.log('Connecting to tab:', tab.title, tab.url);

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 1;

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      const handler = (evt) => {
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

  ws.addEventListener('open', async () => {
    try {
      console.log('Reloading page...');
      await send('Page.reload', { ignoreCache: true });
      await new Promise(r => setTimeout(r, 3500));

      const outDir = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';

      // 1. Hero
      await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
      await new Promise(r => setTimeout(r, 600));
      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${outDir}/magtrack_refactored_1_hero.png`, Buffer.from(shot.data, 'base64'));
      console.log('✔ Captured magtrack_refactored_1_hero.png');

      // 2. Buybox Bundles
      await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 450);' });
      await new Promise(r => setTimeout(r, 600));
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${outDir}/magtrack_refactored_2_bundles.png`, Buffer.from(shot.data, 'base64'));
      console.log('✔ Captured magtrack_refactored_2_bundles.png');

      // 3. Features
      await send('Runtime.evaluate', { expression: 'document.querySelector(".wf-features-section")?.scrollIntoView();' });
      await new Promise(r => setTimeout(r, 600));
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${outDir}/magtrack_refactored_3_features.png`, Buffer.from(shot.data, 'base64'));
      console.log('✔ Captured magtrack_refactored_3_features.png');

      // 4. Story
      await send('Runtime.evaluate', { expression: 'document.querySelector(".wf-story-section")?.scrollIntoView();' });
      await new Promise(r => setTimeout(r, 600));
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${outDir}/magtrack_refactored_4_story.png`, Buffer.from(shot.data, 'base64'));
      console.log('✔ Captured magtrack_refactored_4_story.png');

      // 5. Video & Specs
      await send('Runtime.evaluate', { expression: 'document.querySelector(".wf-video-section")?.scrollIntoView();' });
      await new Promise(r => setTimeout(r, 600));
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${outDir}/magtrack_refactored_5_video.png`, Buffer.from(shot.data, 'base64'));
      console.log('✔ Captured magtrack_refactored_5_video.png');

      // 6. Comparison & FAQ
      await send('Runtime.evaluate', { expression: 'document.querySelector(".wf-comparison-section")?.scrollIntoView();' });
      await new Promise(r => setTimeout(r, 600));
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${outDir}/magtrack_refactored_6_comparison.png`, Buffer.from(shot.data, 'base64'));
      console.log('✔ Captured magtrack_refactored_6_comparison.png');

      // 7. Delivery & Reviews
      await send('Runtime.evaluate', { expression: 'document.querySelector(".wf-delivery-section")?.scrollIntoView();' });
      await new Promise(r => setTimeout(r, 600));
      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`${outDir}/magtrack_refactored_7_delivery_reviews.png`, Buffer.from(shot.data, 'base64'));
      console.log('✔ Captured magtrack_refactored_7_delivery_reviews.png');

      ws.close();
      console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
    } catch (e) {
      console.error(e);
      ws.close();
    }
  });
}

main().catch(console.error);
