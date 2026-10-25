import fs from 'fs';

async function verifyBrowser() {
  console.log('Connecting to Chrome CDP on port 9222...');
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const tab = tabs.find(t => t.url && (t.url.includes('tryzavelyn') || t.url.includes('saker')));
  console.log('Connecting to tab:', tab.id, tab.url);

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
    const targetUrl = 'https://tryzavelyn.com/pages/sinus-relief';
    console.log('Navigating to:', targetUrl);
    await send('Page.navigate', { url: targetUrl });
    await new Promise(r => setTimeout(r, 4500));

    const outDir = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3';

    // ==========================================
    // 1. DESKTOP VIEWPORT TEST (1200 x 900)
    // ==========================================
    console.log('\n--- 1. Testing Desktop Viewport (1200 x 900) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise(r => setTimeout(r, 600));

    // Scroll to Top & Hero Screenshot
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 600));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${outDir}/sinus_relief_desktop_hero.png`, Buffer.from(shot.data, 'base64'));
    console.log('✔ Captured sinus_relief_desktop_hero.png');

    // Scroll to Section 8: Products Comparison
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('product-selection');
        if (el) el.scrollIntoView();
      `
    });
    await new Promise(r => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${outDir}/sinus_relief_desktop_products.png`, Buffer.from(shot.data, 'base64'));
    console.log('✔ Captured sinus_relief_desktop_products.png');

    // Scroll to FAQs & Final CTA
    await send('Runtime.evaluate', {
      expression: `
        const faq = document.querySelector('.z-faq-section');
        if (faq) faq.scrollIntoView();
        // open first 2 details
        const details = document.querySelectorAll('.z-faq-item');
        if (details.length > 0) details[0].open = true;
        if (details.length > 1) details[1].open = true;
      `
    });
    await new Promise(r => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${outDir}/sinus_relief_desktop_faq.png`, Buffer.from(shot.data, 'base64'));
    console.log('✔ Captured sinus_relief_desktop_faq.png');

    // ==========================================
    // 2. MOBILE VIEWPORT TEST (375 x 812)
    // ==========================================
    console.log('\n--- 2. Testing Mobile Viewport (375 x 812) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 800));

    // Check Horizontal Overflow
    const overflowCheck = await send('Runtime.evaluate', {
      expression: `
        ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        })
      `,
      returnByValue: true
    });
    console.log('Mobile overflow check:', overflowCheck.result.value);

    // Mobile Hero Screenshot
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${outDir}/sinus_relief_mobile_hero.png`, Buffer.from(shot.data, 'base64'));
    console.log('✔ Captured sinus_relief_mobile_hero.png');

    // Mobile Products Cards
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('product-selection');
        if (el) el.scrollIntoView();
      `
    });
    await new Promise(r => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${outDir}/sinus_relief_mobile_products.png`, Buffer.from(shot.data, 'base64'));
    console.log('✔ Captured sinus_relief_mobile_products.png');

    // ==========================================
    // 3. CTA DESTINATIONS AUDIT
    // ==========================================
    console.log('\n--- 3. Auditing All Links on Page ---');
    const linksAudit = await send('Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('.zavelyn-sinus-page a')).map(a => ({
          text: a.innerText.trim().replace(/\\n/g, ' '),
          href: a.href
        }))
      `,
      returnByValue: true
    });
    console.log('Audited Links on Page:');
    linksAudit.result.value.forEach(l => console.log(`  - "${l.text}" -> ${l.href}`));

    // Reset Device Metrics
    await send('Emulation.clearDeviceMetricsOverride');
    ws.close();
    console.log('\n✔ Browser testing complete!');
  });
}

verifyBrowser().catch(console.error);
