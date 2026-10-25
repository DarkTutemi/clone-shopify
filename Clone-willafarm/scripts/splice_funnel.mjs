import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) console.log(`  ✔ Uploaded: ${key}`);
  else console.error(`  ✗ Failed: ${key}`, JSON.stringify(data.errors || data));
}

async function run() {
  const raw = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');
  const lines = raw.split('\n');

  // Find line with 'if (disp) disp.textContent'
  const targetLineIdx = lines.findIndex(l => l.includes('if (disp) disp.textContent'));
  console.log('Target line index:', targetLineIdx);

  const topPart = lines.slice(0, targetLineIdx).join('\n');
  const bottomPart = lines.slice(targetLineIdx + 1).join('\n'); // this starts with '{'

  const middlePart = `    if (disp) disp.textContent = '$' + total;
    if (compDisp) compDisp.textContent = '$' + compTotal;
  }

  async function submitWfDirectCheckout() {
    const btn = document.getElementById('wf-main-shopnow-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Proceeding to Checkout...</span>';
    }
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: wfSelectedVariantId,
            quantity: wfCurrentQty
          }]
        })
      });
      window.location.href = '/checkout';
    } catch (e) {
      window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
    }
  }

  async function submitWfOrder() {
    const btn = document.getElementById('wf-main-atc-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Processing Secure Order...</span>';
    }

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: wfSelectedVariantId,
            quantity: wfCurrentQty
          }]
        })
      });

      if (res.ok) {
        window.location.href = '/checkout';
      } else {
        window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
      }
    } catch (e) {
      console.error(e);
      window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
    }
  }

  // Touch swipe & keyboard arrow navigation
  document.addEventListener('DOMContentLoaded', function() {
    const mainWrap = document.querySelector('.wf-gallery-main');
    if (mainWrap) {
      let touchStartX = 0;
      let touchStartY = 0;
      mainWrap.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      mainWrap.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
          if (diffX < 0) {
            skipWfGallery(1); // Swipe left -> Next image
          } else {
            skipWfGallery(-1); // Swipe right -> Previous image
          }
        }
      }, { passive: true });
    }

    // Keyboard navigation (Left / Right keys when viewing page)
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') skipWfGallery(1);
      if (e.key === 'ArrowLeft') skipWfGallery(-1);
    });
  });

  // Sticky bottom bar trigger on scroll past ATC
  window.addEventListener('scroll', function() {
    const atc = document.getElementById('wf-main-atc-btn');
    const sticky = document.getElementById('wf-sticky-bar');
    if (!atc || !sticky) return;

    const rect = atc.getBoundingClientRect();
    if (rect.bottom < 0) {
      sticky.classList.add('visible');
    } else {
      sticky.classList.remove('visible');
    }
  }, { passive: true });
</script>

{% schema %}`;

  const finalCode = topPart + '\n' + middlePart + '\n' + bottomPart;
  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', finalCode);

  const token = await getAccessToken();
  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', finalCode);
}

run().catch(console.error);
