import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const DRAFT_THEME_ID = '187597717689';

async function testFaq() {
  const port = 9252;
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Admin\\AppData\\Local\\Temp\\chrome_faq_test_' + Date.now();
  const proc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1000'
  ], { detached: true, stdio: 'ignore' });

  await new Promise(r => setTimeout(r, 2000));
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((res, rej) => {
    const curId = id++;
    const handler = evt => {
      const msg = JSON.parse(evt.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        if (msg.error) rej(msg.error);
        else res(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  console.log('Navigating to zavelyn-handpan-master on Draft Theme...');
  await send('Page.navigate', { url: `https://tryzavelyn.com/products/zavelyn-handpan-master?preview_theme_id=${DRAFT_THEME_ID}` });
  await new Promise(r => setTimeout(r, 4500));

  // Dismiss cookie banner
  await send('Runtime.evaluate', {
    expression: `(() => {
      const b = document.querySelector('#shopify-pc__banner, .shopify-cookie-banner, [aria-label="Consent banner"]');
      if (b) b.remove();
    })()`
  });

  // Scroll to FAQ section
  console.log('Scrolling to FAQ section...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const faq = document.querySelector('.wf-faq-section, #pdp-faq, .zhp-faq-section');
      if (faq) {
        faq.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  // Capture Desktop FAQ Screenshot
  const shotDesktop = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'qa_pdp_faq_fixed_desktop_1440.png'), Buffer.from(shotDesktop.data, 'base64'));
  console.log('✔ Captured Desktop FAQ screenshot');

  // Verify FAQ DOM & styling metrics
  const faqMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const items = Array.from(document.querySelectorAll('.wf-faq-item'));
      const questions = Array.from(document.querySelectorAll('.wf-faq-question')).map(q => q.innerText.trim());
      const firstItem = items[0];
      const firstAnswer = firstItem ? firstItem.querySelector('.wf-faq-answer') : null;
      const firstStyle = firstAnswer ? window.getComputedStyle(firstAnswer) : null;
      const isFirstAnswerVisible = firstStyle ? (firstStyle.display !== 'none' && firstStyle.visibility !== 'hidden') : false;

      // Second item
      const secondItem = items[1];
      const secondAnswer = secondItem ? secondItem.querySelector('.wf-faq-answer') : null;
      const secondStyle = secondAnswer ? window.getComputedStyle(secondAnswer) : null;
      const isSecondAnswerHidden = secondStyle ? secondStyle.display === 'none' : false;

      return {
        totalItems: items.length,
        questions,
        firstItemActive: firstItem ? firstItem.classList.contains('active') : false,
        firstAnswerVisible: isFirstAnswerVisible,
        secondItemActive: secondItem ? secondItem.classList.contains('active') : false,
        secondAnswerHidden: isSecondAnswerHidden,
        firstQuestionBg: firstItem ? window.getComputedStyle(firstItem).backgroundColor : null,
        firstQuestionBorder: firstItem ? window.getComputedStyle(firstItem).borderColor : null
      };
    })()`,
    returnByValue: true
  });
  console.log('FAQ Metrics:', JSON.stringify(faqMetrics.result.value, null, 2));

  // Test toggle: click second FAQ item
  console.log('Clicking second FAQ item...');
  const toggleResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const q2 = document.querySelectorAll('.wf-faq-question')[1];
      if (q2) {
        q2.click();
        return { clicked: true };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  await new Promise(r => setTimeout(r, 600));

  const afterToggleMetrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const items = Array.from(document.querySelectorAll('.wf-faq-item'));
      return {
        item1Active: items[0] ? items[0].classList.contains('active') : false,
        item2Active: items[1] ? items[1].classList.contains('active') : false,
        item2AnswerDisplay: items[1] ? window.getComputedStyle(items[1].querySelector('.wf-faq-answer')).display : null
      };
    })()`,
    returnByValue: true
  });
  console.log('After toggle metrics:', JSON.stringify(afterToggleMetrics.result.value, null, 2));

  const shotToggled = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'qa_pdp_faq_toggled_desktop_1440.png'), Buffer.from(shotToggled.data, 'base64'));

  // Switch to Mobile 390px
  console.log('Testing Mobile 390px view...');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 800));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const faq = document.querySelector('.wf-faq-section, #pdp-faq, .zhp-faq-section');
      if (faq) {
        faq.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const shotMobile = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'qa_pdp_faq_fixed_mobile_390.png'), Buffer.from(shotMobile.data, 'base64'));
  console.log('✔ Captured Mobile FAQ screenshot');

  // Also check drum pro PDP FAQ
  console.log('Testing /products/zavelyn-drum-pro FAQ...');
  await send('Page.navigate', { url: `https://tryzavelyn.com/products/zavelyn-drum-pro?preview_theme_id=${DRAFT_THEME_ID}` });
  await new Promise(r => setTimeout(r, 4000));
  await send('Runtime.evaluate', {
    expression: `(() => {
      const faq = document.querySelector('.wf-faq-section, #pdp-faq');
      if (faq) faq.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 600));
  const shotPro = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'qa_drum_pro_faq_fixed_mobile_390.png'), Buffer.from(shotPro.data, 'base64'));

  ws.close();
  try { proc.kill(); } catch (e) {}
  console.log('=== FAQ VERIFICATION COMPLETE ===');
}

testFaq().catch(console.error);
