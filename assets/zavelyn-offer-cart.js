/**
 * Offer landings — cart icon + minicart drawer
 * Optimistic qty UI + debounced change queue (latest qty wins per line)
 */
(function () {
  const root = document.querySelector('[data-offer-minicart]');
  const openBtn = document.querySelector('[data-offer-cart-open]');
  if (!root || !openBtn || root.dataset.bound === 'true') return;
  root.dataset.bound = 'true';

  const panel = root.querySelector('[data-offer-cart-panel]');
  const bodyEl = root.querySelector('[data-offer-cart-body]');
  const footerEl = root.querySelector('[data-offer-cart-footer]');
  const urgencyEl = root.querySelector('[data-offer-cart-urgency]');
  const shipEl = root.querySelector('[data-offer-cart-ship]');
  const shipMsgEl = root.querySelector('[data-offer-cart-ship-msg]');
  const shipBarEl = root.querySelector('[data-offer-cart-ship-bar]');
  const savingsEl = root.querySelector('[data-offer-cart-savings]');
  const shipThreshold = Number(root.dataset.shipThreshold) || 10000;

  const moneyFormat =
    (window.Shopify && window.Shopify.money_format) ||
    document.body?.getAttribute('data-money-format') ||
    '${{amount}}';

  let latestCart = null;
  let changeChain = Promise.resolve();
  let pendingChanges = Object.create(null);
  let flushTimer = null;
  let flushing = false;

  function formatMoney(cents) {
    if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
      return window.Shopify.formatMoney(cents, moneyFormat);
    }
    const amount = (Number(cents) / 100).toFixed(2);
    return moneyFormat
      .replace(/\{\{\s*amount\s*\}\}/, amount)
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/, String(Math.round(Number(cents) / 100)))
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, amount.replace('.', ','));
  }

  function setCount(count) {
    document.querySelectorAll('[data-offer-cart-count]').forEach((el) => {
      el.textContent = String(count);
      el.hidden = count === 0;
    });
    const titleCount = root.querySelector('[data-offer-cart-title-count]');
    if (titleCount) titleCount.textContent = count > 0 ? `(${count})` : '';
  }

  function updateShipping(totalPrice) {
    if (!shipEl || !shipMsgEl || !shipBarEl) return;
    const remaining = Math.max(shipThreshold - totalPrice, 0);
    const pct = shipThreshold > 0 ? Math.min(100, Math.round((totalPrice / shipThreshold) * 100)) : 100;
    shipBarEl.style.width = `${pct}%`;
    shipMsgEl.innerHTML =
      remaining === 0
        ? 'You’ve unlocked <strong>FREE shipping</strong>'
        : `You’re <strong>${formatMoney(remaining)}</strong> away from <strong>FREE shipping</strong>`;
  }

  function updateFooter(cart) {
    const subtotal = root.querySelector('[data-offer-cart-subtotal]');
    if (subtotal) subtotal.textContent = formatMoney(cart.total_price || 0);
    if (!savingsEl) return;
    if (cart.total_discount > 0) {
      savingsEl.hidden = false;
      savingsEl.innerHTML = `You’re saving <strong>${formatMoney(cart.total_discount)}</strong> today`;
    } else {
      savingsEl.hidden = true;
      savingsEl.innerHTML = '';
    }
  }

  function open(cart) {
    root.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('offer-minicart-open');
    panel?.focus({ preventScroll: true });
    if (cart) render(cart);
    else if (latestCart) render(latestCart);
    else refresh();
  }

  function close() {
    root.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('offer-minicart-open');
    openBtn.focus({ preventScroll: true });
  }

  function itemImage(item) {
    const img = item.featured_image || item.image;
    if (!img) return '';
    const src = typeof img === 'string' ? img : img.url;
    if (!src) return '';
    return `<img src="${src}" alt="" width="80" height="80" loading="lazy" decoding="async">`;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function visibleProperties(item) {
    const props = item && item.properties;
    if (!props) return [];
    const rows = [];
    const push = (key, value) => {
      if (!key || String(key).charAt(0) === '_') return;
      if (value == null || value === '' || value === 'false') return;
      rows.push({ key: String(key), value: String(value) });
    };
    if (Array.isArray(props)) {
      props.forEach((entry) => {
        if (Array.isArray(entry)) push(entry[0], entry[1]);
        else if (entry && entry.name) push(entry.name, entry.value);
      });
    } else if (typeof props === 'object') {
      Object.keys(props).forEach((key) => push(key, props[key]));
    }
    // Stable order: Package first, then Contents, then the rest
    const rank = { Offer: 0, Package: 1, Size: 2, 'You get': 3, Contents: 4, 'Line type': 5, Shipping: 6 };
    rows.sort((a, b) => {
      const ra = rank[a.key] != null ? rank[a.key] : 50;
      const rb = rank[b.key] != null ? rank[b.key] : 50;
      if (ra !== rb) return ra - rb;
      return a.key.localeCompare(b.key);
    });
    return rows;
  }

  function renderPropertiesHtml(item) {
    const rows = visibleProperties(item);
    if (!rows.length) return '';
    return `<ul class="offer-minicart__props">${rows
      .map(
        (row) =>
          `<li><span class="offer-minicart__prop-key">${escapeHtml(row.key)}</span> <span class="offer-minicart__prop-val">${escapeHtml(row.value)}</span></li>`
      )
      .join('')}</ul>`;
  }

  function propValue(item, name) {
    const props = item && item.properties;
    if (!props) return '';
    if (!Array.isArray(props) && typeof props === 'object') {
      return props[name] != null ? String(props[name]) : '';
    }
    if (Array.isArray(props)) {
      for (let i = 0; i < props.length; i++) {
        const entry = props[i];
        const key = Array.isArray(entry) ? entry[0] : entry && entry.name;
        const val = Array.isArray(entry) ? entry[1] : entry && entry.value;
        if (key === name) return val != null ? String(val) : '';
      }
    }
    return '';
  }

  function isPackageLine(item) {
    return !!(propValue(item, '_bundle') || propValue(item, '_units_per_pack') || propValue(item, '_cart_qty'));
  }

  function unitsPerPack(item) {
    const n = Number(propValue(item, '_units_per_pack') || 0);
    return n > 0 ? n : 1;
  }

  function findRow(key) {
    const rows = bodyEl.querySelectorAll('.offer-minicart__item[data-key]');
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].getAttribute('data-key') === key) return rows[i];
    }
    return null;
  }

  function cartItemByKey(key) {
    if (!latestCart || !latestCart.items) return null;
    return latestCart.items.find((it) => it.key === key) || null;
  }

  function lineIndexForKey(key) {
    if (!latestCart || !latestCart.items) return 0;
    const idx = latestCart.items.findIndex((it) => it.key === key);
    return idx >= 0 ? idx + 1 : 0;
  }

  function render(cart) {
    latestCart = cart;
    const count = cart.item_count || 0;
    setCount(count);
    updateShipping(cart.total_price || 0);

    if (urgencyEl) urgencyEl.hidden = count === 0;
    if (shipEl) shipEl.hidden = count === 0;
    if (footerEl) footerEl.hidden = count === 0;

    if (!count) {
      bodyEl.innerHTML = `
        <div class="offer-minicart__empty">
          <p class="offer-minicart__empty-title">Your cart is empty</p>
          <p class="offer-minicart__empty-copy">Add a recovery essential and enjoy free shipping over ${formatMoney(shipThreshold)}.</p>
          <a class="offer-minicart__empty-cta" href="/" data-offer-cart-close>Continue shopping</a>
        </div>`;
      updateFooter({ total_price: 0, total_discount: 0 });
      return;
    }

    /* Group paid+free lines that share _bundle_id into one package row */
    const bundleMap = Object.create(null);
    const singles = [];
    (cart.items || []).forEach((item, index) => {
      const bid = propValue(item, '_bundle_id');
      if (bid) {
        if (!bundleMap[bid]) bundleMap[bid] = { bundleId: bid, items: [], firstIndex: index };
        bundleMap[bid].items.push(item);
      } else {
        singles.push({ item, index });
      }
    });

    const rows = [];
    Object.keys(bundleMap).forEach((bid) => {
      rows.push({ kind: 'bundle', ...bundleMap[bid] });
    });
    singles.forEach((s) => rows.push({ kind: 'single', items: [s.item], firstIndex: s.index }));
    rows.sort((a, b) => a.firstIndex - b.firstIndex);

    const list = rows
      .map((row) => {
        if (row.kind === 'bundle') {
          const paid =
            row.items.find((it) => propValue(it, '_role') === 'paid' || propValue(it, '_role') === 'combined') ||
            row.items.find((it) => propValue(it, '_role') !== 'free') ||
            row.items[0];
          const keys = row.items.map((it) => it.key);
          const paidQty = Number(propValue(paid, '_paid') || paid.quantity || 0);
          const freeQty = Number(propValue(paid, '_free') || 0);
          const totalQty =
            Number(propValue(paid, '_cart_qty') || 0) ||
            row.items.reduce((sum, it) => sum + Number(it.quantity || 0), 0);
          const totalPrice = row.items.reduce((sum, it) => sum + Number(it.final_line_price || 0), 0);
          const originalPrice = row.items.reduce((sum, it) => sum + Number(it.original_line_price || 0), 0);
          const packageName =
            propValue(paid, 'Offer') ||
            (propValue(paid, 'Package') || '').replace(/\s*—\s*FREE$/i, '') ||
            paid.product_title;
          const size = propValue(paid, 'Size');
          const youGet = propValue(paid, 'You get') || propValue(paid, 'Contents') || '';
          const compare = originalPrice > totalPrice + 1 ? `<s>${formatMoney(originalPrice)}</s>` : '';
          const keysAttr = escapeHtml(keys.join('|'));
          const detailBits = [];
          if (size) detailBits.push('Size ' + size);
          if (youGet) detailBits.push(youGet);
          else if (totalQty) {
            detailBits.push(
              totalQty +
                (totalQty === 1 ? ' sleeve' : ' sleeves') +
                (freeQty > 0 ? ' · ' + freeQty + ' free' : '')
            );
          }
          return `
            <li class="offer-minicart__item is-package is-bundle" data-bundle-id="${escapeHtml(row.bundleId)}" data-bundle-keys="${keysAttr}">
              <a class="offer-minicart__thumb" href="${escapeHtml(paid.url)}">${itemImage(paid)}</a>
              <div class="offer-minicart__meta">
                <p class="offer-minicart__offer">${escapeHtml(packageName)}</p>
                <p class="offer-minicart__summary">${escapeHtml(detailBits.join(' · '))}</p>
                <div class="offer-minicart__row">
                  <span class="offer-minicart__pay-label">You pay</span>
                  <span class="offer-minicart__price">${compare}${formatMoney(totalPrice)}</span>
                </div>
                <button type="button" class="offer-minicart__remove" data-offer-cart-remove-bundle="${escapeHtml(row.bundleId)}" data-bundle-keys="${keysAttr}">Remove package</button>
              </div>
            </li>`;
        }

        const item = row.items[0];
        const variant =
          item.variant_title && item.variant_title !== 'Default Title'
            ? `<p class="offer-minicart__variant">${escapeHtml(item.variant_title)}</p>`
            : '';
        const propsHtml = renderPropertiesHtml(item);
        const compare =
          item.original_line_price > item.final_line_price
            ? `<s>${formatMoney(item.original_line_price)}</s>`
            : '';
        const key = escapeHtml(item.key);
        const line = row.firstIndex + 1;
        const qty =
          Object.prototype.hasOwnProperty.call(pendingChanges, item.key)
            ? pendingChanges[item.key]
            : item.quantity;
        return `
          <li class="offer-minicart__item" data-key="${key}" data-line="${line}">
            <a class="offer-minicart__thumb" href="${escapeHtml(item.url)}">${itemImage(item)}</a>
            <div class="offer-minicart__meta">
              <a class="offer-minicart__name" href="${escapeHtml(item.url)}">${escapeHtml(item.product_title)}</a>
              ${variant}
              ${propsHtml}
              <div class="offer-minicart__row">
                <div class="offer-minicart__qty">
                  <button type="button" data-offer-cart-delta="-1" data-key="${key}" data-line="${line}" aria-label="Decrease quantity">−</button>
                  <span data-offer-cart-qty-label>${qty}</span>
                  <button type="button" data-offer-cart-delta="1" data-key="${key}" data-line="${line}" aria-label="Increase quantity">+</button>
                </div>
                <span class="offer-minicart__price">${compare}${formatMoney(item.final_line_price)}</span>
              </div>
              <button type="button" class="offer-minicart__remove" data-offer-cart-delta="remove" data-key="${key}" data-line="${line}">Remove</button>
            </div>
          </li>`;
      })
      .join('');

    bodyEl.innerHTML = `<ul class="offer-minicart__list" role="list">${list}</ul>`;
    updateFooter(cart);

    const checkoutLink = root.querySelector('.offer-minicart__checkout');
    if (checkoutLink) checkoutLink.href = '/checkout';
  }

  function optimisticCount() {
    if (!latestCart || !latestCart.items) return;
    let count = 0;
    latestCart.items.forEach((item) => {
      const q = Object.prototype.hasOwnProperty.call(pendingChanges, item.key)
        ? pendingChanges[item.key]
        : item.quantity;
      count += Math.max(0, Number(q) || 0);
    });
    setCount(count);
    if (urgencyEl) urgencyEl.hidden = count === 0;
    if (shipEl) shipEl.hidden = count === 0;
    if (footerEl) footerEl.hidden = count === 0;
  }

  function paintOptimistic(key, nextQty) {
    const row = findRow(key);
    if (!row) return;
    if (nextQty <= 0) {
      row.style.opacity = '0.4';
      row.style.pointerEvents = 'none';
      return;
    }
    row.style.opacity = '';
    row.style.pointerEvents = '';
    const label = row.querySelector('[data-offer-cart-qty-label]');
    if (!label) return;
    const step = Number(row.getAttribute('data-units-per-pack') || 1);
    if (step > 1 || row.classList.contains('is-package')) {
      const packs = Math.max(1, Math.round(Number(nextQty) / step));
      label.innerHTML = `${packs}<small class="offer-minicart__pack-unit"> pkg</small>`;
    } else {
      label.textContent = String(nextQty);
    }
  }

  async function refresh() {
    try {
      const res = await fetch('/cart.js', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('cart fetch failed');
      render(await res.json());
    } catch (error) {
      console.error('[Zavelyn offer cart]', error);
    }
  }

  function queueChange(key, absoluteQty) {
    pendingChanges[key] = absoluteQty;
    paintOptimistic(key, absoluteQty);
    optimisticCount();
    clearTimeout(flushTimer);
    flushTimer = setTimeout(flushChanges, 120);
  }

  function flushChanges() {
    if (flushing) {
      flushTimer = setTimeout(flushChanges, 80);
      return;
    }
    const keys = Object.keys(pendingChanges);
    if (!keys.length) return;

    const snapshot = pendingChanges;
    pendingChanges = Object.create(null);
    flushing = true;

    changeChain = changeChain
      .then(async () => {
        let cart = latestCart;
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const quantity = Object.prototype.hasOwnProperty.call(pendingChanges, key)
            ? pendingChanges[key]
            : snapshot[key];
          delete pendingChanges[key];

          // Prefer line-item key; fall back to 1-based line index
          const line = lineIndexForKey(key);
          const payload = { quantity: Number(quantity) };
          if (key) payload.id = key;
          else if (line > 0) payload.line = line;

          const res = await fetch('/cart/change.js', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('cart change failed');
          cart = await res.json();
          latestCart = cart;
        }
        // Keep any clicks that landed during the request
        if (Object.keys(pendingChanges).length && cart && cart.items) {
          cart.items.forEach((item) => {
            if (Object.prototype.hasOwnProperty.call(pendingChanges, item.key)) {
              // leave pending; render will show optimistic via pendingChanges
            }
          });
        }
        render(cart);
      })
      .catch((error) => {
        console.error('[Zavelyn offer cart]', error);
        pendingChanges = Object.create(null);
        return refresh();
      })
      .then(() => {
        flushing = false;
        if (Object.keys(pendingChanges).length) {
          clearTimeout(flushTimer);
          flushTimer = setTimeout(flushChanges, 40);
        }
      });
  }

  openBtn.addEventListener('click', (event) => {
    event.preventDefault();
    open(latestCart);
  });

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-offer-cart-close]')) {
      event.preventDefault();
      close();
      return;
    }

    const bundleRemove = event.target.closest('[data-offer-cart-remove-bundle]');
    if (bundleRemove) {
      event.preventDefault();
      const keys = (bundleRemove.getAttribute('data-bundle-keys') || '')
        .split('|')
        .map((k) => k.trim())
        .filter(Boolean);
      keys.forEach((key) => queueChange(key, 0));
      const row = bundleRemove.closest('.offer-minicart__item');
      if (row) {
        row.style.opacity = '0.4';
        row.style.pointerEvents = 'none';
      }
      return;
    }

    const qtyBtn = event.target.closest('[data-offer-cart-delta]');
    if (!qtyBtn) return;
    event.preventDefault();

    const key = qtyBtn.getAttribute('data-key');
    if (!key) return;

    const pending = Object.prototype.hasOwnProperty.call(pendingChanges, key)
      ? pendingChanges[key]
      : null;
    const item = cartItemByKey(key);
    const current = pending != null ? pending : item ? item.quantity : 0;

    const delta = qtyBtn.getAttribute('data-offer-cart-delta');
    let next;
    if (delta === 'remove') next = 0;
    else next = Number(current) + Number(delta || 0);
    next = Math.max(0, next);
    queueChange(key, next);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.getAttribute('aria-hidden') === 'false') close();
  });

  document.addEventListener('zavelyn:offer-cart:refresh', (event) => {
    var cart = event && event.detail && event.detail.cart;
    if (cart) {
      render(cart);
      return;
    }
    refresh();
  });

  document.addEventListener('zavelyn:offer-cart:open', (event) => {
    var cart = event && event.detail && event.detail.cart;
    open(cart || latestCart);
  });

  // Hydrate from SSR cart markup so +/- works before first fetch
  (function hydrateFromDom() {
    const rows = bodyEl.querySelectorAll('.offer-minicart__item[data-key]');
    if (!rows.length) {
      const initialCountEl = document.querySelector('[data-offer-cart-count]');
      const initialCount = initialCountEl ? Number(initialCountEl.textContent || 0) : 0;
      setCount(Number.isFinite(initialCount) ? initialCount : 0);
      return;
    }
    const items = [];
    rows.forEach((row) => {
      const key = row.getAttribute('data-key');
      const label = row.querySelector('[data-offer-cart-qty-label]');
      const qty = label ? Number(label.textContent || 0) : 0;
      if (key) items.push({ key: key, quantity: qty, product_title: '', final_line_price: 0, original_line_price: 0, url: '#' });
    });
    const count = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    latestCart = { item_count: count, items: items, total_price: 0, total_discount: 0 };
    setCount(count);
    // Sync authoritative cart in background
    refresh();
  })();
})();
