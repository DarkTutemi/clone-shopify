// DYNAMIC BUYBOX SCRIPT
let currentVariantId = "67959036838073";
let currentQty = 1;
let currentUnitPrice = 259.95;
let currentUnitCompare = 499.95;

function selectWfImage(src, thumbEl) {
  const main = document.getElementById('wfMainImg');
  if (main) main.src = src;
  document.querySelectorAll('.wf-thumb-item').forEach(el => el.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
}

function selectWfColor(btn) {
  document.querySelectorAll('.wf-color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const color = btn.getAttribute('data-color');
  const vId = btn.getAttribute('data-variant-id');
  const img = btn.getAttribute('data-img');

  currentVariantId = vId;
  const nameEl = document.getElementById('wfSelectedColorName');
  if (nameEl) nameEl.textContent = color;

  if (img) {
    const main = document.getElementById('wfMainImg');
    const stickyImg = document.getElementById('wfStickyThumb');
    if (main) main.src = img;
    if (stickyImg) stickyImg.src = img;
  }
}

function selectWfBundle(cardEl) {
  document.querySelectorAll('.wf-bundle-card').forEach(c => c.classList.remove('active'));
  cardEl.classList.add('active');

  const qty = parseInt(cardEl.getAttribute('data-qty'), 10) || 1;
  const price = parseFloat(cardEl.getAttribute('data-price')) || currentUnitPrice;
  const compare = parseFloat(cardEl.getAttribute('data-compare')) || currentUnitCompare;

  currentQty = qty;

  const qtyInput = document.getElementById('wfQtyInput');
  if (qtyInput) qtyInput.value = qty;

  updateWfPricing(price, compare);

  const stickySel = document.getElementById('wfStickyBundleSelect');
  if (stickySel) stickySel.value = qty.toString();
}

function updateWfPricing(price, compare) {
  const curEl = document.getElementById('wfCurrentPrice');
  const compEl = document.getElementById('wfComparePrice');
  const stCurEl = document.getElementById('wfStickyPrice');

  if (curEl) curEl.textContent = '$' + price.toFixed(2);
  if (compEl) compEl.textContent = '$' + compare.toFixed(2);
  if (stCurEl) stCurEl.innerHTML = '$' + price.toFixed(2) + ' <s class="wf-sticky-comp">$' + compare.toFixed(2) + '</s>';
}

function adjustWfQty(delta) {
  const input = document.getElementById('wfQtyInput');
  if (!input) return;
  let val = parseInt(input.value, 10) || 1;
  val = Math.max(1, Math.min(10, val + delta));
  input.value = val;
  currentQty = val;

  const totalPrice = currentUnitPrice * val;
  const totalCompare = currentUnitCompare * val;
  updateWfPricing(totalPrice, totalCompare);
}

function syncStickySelect(val) {
  const targetCard = document.querySelector('.wf-bundle-card[data-qty="' + val + '"]');
  if (targetCard) selectWfBundle(targetCard);
}

function toggleWfFaq(btn) {
  const item = btn.closest('.wf-faq-item');
  if (item) item.classList.toggle('open');
}

// AJAX ADD TO CART
async function submitWfAddToCart() {
  const btn = document.getElementById('wfAddToCartBtn');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>ADDING TO CART...</span>';
  }

  try {
    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          id: currentVariantId,
          quantity: currentQty
        }]
      })
    });

    if (!res.ok) throw new Error('Add to cart failed');

    if (typeof window.willaRefreshCart === 'function') {
      await window.willaRefreshCart();
    }
    if (typeof window.willaOpenCartDrawer === 'function') {
      window.willaOpenCartDrawer();
    } else {
      window.location.href = '/cart';
    }
  } catch (err) {
    console.error('Cart add error:', err);
    window.location.href = '/cart/' + currentVariantId + ':' + currentQty;
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

// 1-CLICK DIRECT CHECKOUT
function submitWfDirectCheckout() {
  window.location.href = '/cart/' + currentVariantId + ':' + currentQty;
}

// STICKY SCROLL TRIGGER
window.addEventListener('scroll', function() {
  const buybox = document.querySelector('.wf-hero-buybox');
  const sticky = document.getElementById('wfStickyBar');
  if (!buybox || !sticky) return;

  const rect = buybox.getBoundingClientRect();
  if (rect.bottom < 0) sticky.classList.add('visible');
  else sticky.classList.remove('visible');
});

function toggleWfBbAcc(btn) {
  const item = btn.closest('.wf-bb-acc-item');
  if (!item) return;
  const isOpen = item.classList.contains('open');
  item.classList.toggle('open');
  btn.setAttribute('aria-expanded', !isOpen);
}
