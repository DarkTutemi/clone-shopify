import fs from 'fs';

async function sendCdp(ws, method, params = {}, id = 1) {
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function auditViewport(width, height, label) {
  console.log(`\n======================================================`);
  console.log(`📱 AUDITING VIEWPORT: ${width}x${height} (${label})`);
  console.log(`======================================================`);

  const report = {
    viewport: `${width}x${height} (${label})`,
    consoleErrors: [],
    pages: {}
  };

  const newTargetRes = await fetch('http://127.0.0.1:9222/json/new?https://tryzavelyn.com/', { method: 'PUT' });
  const target = await newTargetRes.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.onopen = resolve);

  let msgId = 1;
  const call = (method, params) => sendCdp(ws, method, params, ++msgId);

  // Collect console errors
  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') {
      const text = data.params.args.map(a => a.value || a.description || '').join(' ');
      report.consoleErrors.push(text);
    }
  });

  await call('Page.enable');
  await call('Runtime.enable');
  await call('DOM.enable');

  await call('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: true
  });
  await call('Emulation.setUserAgentOverride', {
    userAgent: `Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1`
  });

  // --- 1. HOMEPAGE ---
  console.log('\n[1/4] Auditing Homepage First Viewport...');
  await call('Page.navigate', { url: 'https://tryzavelyn.com/' });
  await new Promise(r => setTimeout(r, 3500));

  const homeMetrics = await call('Runtime.evaluate', {
    expression: `(() => {
      const header = document.querySelector('.willa-header-wrap');
      const ann = document.querySelector('.willa-announcement-bar');
      const title = document.querySelector('.willa-hero-title');
      const cta = document.querySelector('.willa-hero-cta-wrap a.willa-btn-primary');
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
      
      const getB = el => el ? el.getBoundingClientRect() : null;
      return {
        hasHorizontalScroll,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        headerHeight: header ? header.offsetHeight : null,
        annHeight: ann ? ann.offsetHeight : null,
        titleTop: title ? getB(title).top : null,
        ctaTop: cta ? getB(cta).top : null,
        ctaBottom: cta ? getB(cta).bottom : null,
        isCtaAboveFold: cta ? getB(cta).bottom <= ${height} : false
      };
    })()`,
    returnByValue: true
  });
  report.pages.homepage = homeMetrics.result.value;
  console.log('Homepage Metrics:', homeMetrics.result.value);

  const shotHome = await call('Page.captureScreenshot', { format: 'png' });
  const homePath = `C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\zavelyn_home_v2_${width}x${height}.png`;
  fs.writeFileSync(homePath, Buffer.from(shotHome.data, 'base64'));
  console.log(`Saved: ${homePath}`);

  // --- 2. COLLECTION PAGE (2-COLUMN GRID) ---
  console.log('\n[2/4] Auditing Collection Page (Best Sellers)...');
  await call('Page.navigate', { url: 'https://tryzavelyn.com/collections/best-sellers' });
  await new Promise(r => setTimeout(r, 3500));

  const colMetrics = await call('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('.willa-prod-card');
      const card1 = cards[0];
      const card2 = cards[1];
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

      const is2Col = card1 && card2 ? Math.abs(card1.getBoundingClientRect().top - card2.getBoundingClientRect().top) < 15 : false;

      return {
        hasHorizontalScroll,
        productCount: cards.length,
        card1Width: card1 ? card1.offsetWidth : null,
        is2ColumnGrid: is2Col,
        firstCardTitle: card1 ? card1.querySelector('.willa-prod-title')?.innerText?.trim() : null,
        firstCardPrice: card1 ? card1.querySelector('.price-active')?.innerText?.trim() : null,
        firstCardCta: card1 ? card1.querySelector('.willa-quick-atc-btn')?.innerText?.trim() : null
      };
    })()`,
    returnByValue: true
  });
  report.pages.collection = colMetrics.result.value;
  console.log('Collection 2-Column Metrics:', colMetrics.result.value);

  const shotCol = await call('Page.captureScreenshot', { format: 'png' });
  const colPath = `C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\zavelyn_col_v2_${width}x${height}.png`;
  fs.writeFileSync(colPath, Buffer.from(shotCol.data, 'base64'));
  console.log(`Saved: ${colPath}`);

  // --- 3. REPRESENTATIVE PDP (sakerplus-fence-post-repair-kit) ---
  console.log('\n[3/4] Auditing Representative PDP (sakerplus-fence-post-repair-kit)...');
  await call('Page.navigate', { url: 'https://tryzavelyn.com/products/sakerplus-fence-post-repair-kit' });
  await new Promise(r => setTimeout(r, 3500));

  const pdpMetrics = await call('Runtime.evaluate', {
    expression: `(() => {
      const title = document.querySelector('.willa-pdp-title');
      const price = document.getElementById('willaPdpPrice');
      const mainAtc = document.getElementById('willaPdpAtcBtn');
      const stickyBar = document.getElementById('willaStickyAtc');
      const variants = document.querySelectorAll('.willa-variant-chip');
      const thumbs = document.querySelectorAll('.willa-pdp-thumb');
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;

      return {
        hasHorizontalScroll,
        title: title ? title.innerText : null,
        price: price ? price.innerText : null,
        variantCount: variants.length,
        thumbsCount: thumbs.length,
        isStickyBarHiddenInitially: stickyBar ? !stickyBar.classList.contains('visible') : null
      };
    })()`,
    returnByValue: true
  });
  report.pages.pdp = pdpMetrics.result.value;
  console.log('PDP Initial Metrics:', pdpMetrics.result.value);

  const shotPdp = await call('Page.captureScreenshot', { format: 'png' });
  const pdpPath = `C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\zavelyn_pdp_v2_${width}x${height}.png`;
  fs.writeFileSync(pdpPath, Buffer.from(shotPdp.data, 'base64'));
  console.log(`Saved: ${pdpPath}`);

  // Test Scroll & Sticky Purchase Bar
  console.log('Scrolling down past main purchase button to test sticky purchase bar...');
  await call('Runtime.evaluate', { expression: `window.scrollBy(0, 1150)` });
  await new Promise(r => setTimeout(r, 1200));

  const stickyMetrics = await call('Runtime.evaluate', {
    expression: `(() => {
      const stickyBar = document.getElementById('willaStickyAtc');
      return {
        isStickyBarVisible: stickyBar ? stickyBar.classList.contains('visible') : false,
        stickyTitle: stickyBar?.querySelector('.sticky-title')?.innerText,
        stickyPrice: stickyBar?.querySelector('.sticky-price')?.innerText
      };
    })()`,
    returnByValue: true
  });
  report.pages.stickyBar = stickyMetrics.result.value;
  console.log('Sticky Bar Metrics after scroll:', stickyMetrics.result.value);

  const shotSticky = await call('Page.captureScreenshot', { format: 'png' });
  const stickyPath = `C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\zavelyn_sticky_v2_${width}x${height}.png`;
  fs.writeFileSync(stickyPath, Buffer.from(shotSticky.data, 'base64'));
  console.log(`Saved: ${stickyPath}`);

  // --- 4. CART DRAWER & ADD TO CART INTERACTION ---
  console.log('\n[4/4] Testing Add to Cart & Cart Drawer...');
  // Click Add to Cart
  await call('Runtime.evaluate', {
    expression: `submitPdpOrder()`
  });
  await new Promise(r => setTimeout(r, 2200));

  const cartDrawerMetrics = await call('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.getElementById('willaCartDrawer');
      const items = document.querySelectorAll('.willa-cart-item');
      const subtotal = document.getElementById('willaDrawerSubtotal');
      const freeShipText = document.getElementById('willaShippingText');
      const checkoutBtn = document.querySelector('.willa-checkout-btn');

      return {
        isDrawerOpen: drawer ? drawer.classList.contains('active') : false,
        itemCount: items.length,
        subtotal: subtotal ? subtotal.innerText : null,
        freeShippingMessage: freeShipText ? freeShipText.innerText : null,
        checkoutHref: checkoutBtn ? checkoutBtn.getAttribute('href') : null
      };
    })()`,
    returnByValue: true
  });
  report.pages.cartDrawer = cartDrawerMetrics.result.value;
  console.log('Cart Drawer Metrics:', cartDrawerMetrics.result.value);

  const shotCart = await call('Page.captureScreenshot', { format: 'png' });
  const cartPath = `C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\zavelyn_cart_drawer_v2_${width}x${height}.png`;
  fs.writeFileSync(cartPath, Buffer.from(shotCart.data, 'base64'));
  console.log(`Saved: ${cartPath}`);

  await fetch(`http://127.0.0.1:9222/json/close/${target.id}`);
  ws.close();

  return report;
}

async function main() {
  const report390 = await auditViewport(390, 844, 'iPhone 13/14 Standard');
  const report360 = await auditViewport(360, 800, 'Standard Android');

  fs.writeFileSync('C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\ba009709-9c7b-4366-a57b-5a4a187c37c3\\mobile_audit_v2_results.json', JSON.stringify({ report390, report360 }, null, 2));
  console.log('\n🎉 ALL VIEWPORTS AUDITED SUCCESSFULLY!');
}

main().catch(console.error);
