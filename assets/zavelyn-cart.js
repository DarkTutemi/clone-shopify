/**
 * Zavelyn — Cart drawer & AJAX Cart API
 */

import { fetchJSON, formatMoney, announce, trapFocus, releaseFocus, getFocusable } from 'zavelyn-utils';

const routes = () => window.Zavelyn.routes;
const strings = () => window.Zavelyn.strings;
const settings = () => window.Zavelyn.settings;

let pendingChange = Promise.resolve();
let activeAbort = null;

export async function getCart() {
  return fetchJSON(`${routes().cart_url}.js`);
}

export async function addToCart(items, options = {}) {
  return fetchJSON(routes().cart_add_url + '.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: Array.isArray(items) ? items : [items], sections: options.sections, sections_url: options.sections_url }),
    signal: options.signal,
  });
}

export async function changeCart(line, quantity, options = {}) {
  return fetchJSON(routes().cart_change_url + '.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      line,
      quantity,
      sections: options.sections,
      sections_url: options.sections_url,
    }),
    signal: options.signal,
  });
}

export async function updateCart(updates, options = {}) {
  return fetchJSON(routes().cart_update_url + '.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...updates,
      sections: options.sections,
      sections_url: options.sections_url,
    }),
    signal: options.signal,
  });
}

function queueCartRequest(fn) {
  pendingChange = pendingChange
    .catch(() => {})
    .then(() => {
      if (activeAbort) activeAbort.abort();
      activeAbort = new AbortController();
      return fn(activeAbort.signal);
    });
  return pendingChange;
}

function updateCartCount(count) {
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
    el.setAttribute('data-cart-count', String(count));
  });

  document.querySelectorAll('[data-cart-count-bubble]').forEach((el) => {
    el.hidden = count === 0;
  });
}

function updateFreeShipping(totalPrice) {
  if (!settings().showFreeShipping) return;
  const threshold = Number(settings().freeShippingThreshold) || 0;
  if (!threshold) return;

  document.querySelectorAll('[data-free-shipping]').forEach((root) => {
    const message = root.querySelector('[data-free-shipping-message]');
    const progress = root.querySelector('[data-free-shipping-progress]');
    const remaining = Math.max(threshold - totalPrice, 0);
    const pct = Math.min(100, Math.round((totalPrice / threshold) * 100));

    if (progress) progress.style.width = `${pct}%`;

    if (message) {
      if (remaining <= 0) {
        message.textContent = root.dataset.qualifiedMessage || "You've unlocked free shipping";
      } else {
        const amount = formatMoney(remaining);
        const template = root.dataset.remainingMessage || 'Spend __AMOUNT__ more for free shipping';
        message.textContent = template.replace('__AMOUNT__', amount);
      }
    }
  });
}

function publishCartUpdate(cart) {
  updateCartCount(cart.item_count);
  updateFreeShipping(cart.total_price);
  document.dispatchEvent(new CustomEvent('zavelyn:cart:update', { detail: { cart } }));
}

class ZavelynCartDrawer extends HTMLElement {
  connectedCallback() {
    this.setAttribute('aria-hidden', 'true');
    this.overlay = this.querySelector('[data-cart-drawer-overlay]');
    this.panel = this.querySelector('[data-cart-drawer-panel]');
    this.closeButtons = this.querySelectorAll('[data-cart-drawer-close]');
    this.bodyEl = this.querySelector('[data-cart-drawer-body]');
    this.previouslyFocused = null;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.closeButtons.forEach((btn) => btn.addEventListener('click', () => this.close()));
    this.overlay?.addEventListener('click', () => this.close());

    document.addEventListener('zavelyn:cart:open', () => this.open());
    document.addEventListener('zavelyn:cart:update', (event) => {
      if (event.detail?.sections?.['cart-drawer']) {
        this.renderSection(event.detail.sections['cart-drawer']);
      } else {
        this.refresh();
      }
    });

    this.addEventListener('click', (event) => {
      const removeBtn = event.target.closest('[data-cart-remove]');
      if (removeBtn) {
        event.preventDefault();
        this.changeLine(Number(removeBtn.dataset.cartRemove), 0);
        return;
      }

      const qtyBtn = event.target.closest('[data-cart-qty]');
      if (qtyBtn) {
        event.preventDefault();
        const line = Number(qtyBtn.dataset.line);
        const qty = Number(qtyBtn.dataset.cartQty);
        this.changeLine(line, qty);
      }
    });

    this.addEventListener('change', (event) => {
      const input = event.target.closest('[data-cart-qty-input]');
      if (!input) return;
      const line = Number(input.dataset.line);
      const qty = Math.max(0, Number(input.value) || 0);
      this.changeLine(line, qty);
    });
  }

  open() {
    if (this.hasAttribute('open')) return;
    this.previouslyFocused = document.activeElement;
    this.setAttribute('open', '');
    this.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    document.addEventListener('keydown', this.onKeyDown);

    const focusables = getFocusable(this.panel || this);
    (focusables[0] || this.panel)?.focus?.();

    this.refresh();
  }

  close() {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    document.removeEventListener('keydown', this.onKeyDown);
    releaseFocus(this.previouslyFocused);
  }

  onKeyDown(event) {
    if (event.key === 'Escape') {
      this.close();
      return;
    }
    if (this.panel) trapFocus(this.panel, event);
  }

  async refresh() {
    try {
      const url = `${window.location.pathname}?sections=cart-drawer`;
      const sections = await fetchJSON(url);
      if (sections['cart-drawer']) this.renderSection(sections['cart-drawer']);
      const cart = await getCart();
      publishCartUpdate(cart);
    } catch (error) {
      console.error('[Zavelyn] cart refresh failed', error);
    }
  }

  renderSection(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const next = doc.querySelector('zavelyn-cart-drawer') || doc.body.firstElementChild;
    if (!next) return;

    const panel = this.panel || this.querySelector('[data-cart-drawer-panel]');
    if (!panel) return;

    const swap = (selector) => {
      const current = this.querySelector(selector);
      const incoming = next.querySelector(selector);
      if (current && incoming) {
        current.replaceWith(incoming);
      } else if (!current && incoming && panel) {
        panel.append(incoming);
      } else if (current && !incoming) {
        current.remove();
      }
    };

    swap('[data-cart-drawer-header]');
    swap('[data-cart-drawer-body]');
    swap('[data-cart-drawer-footer]');

    this.overlay = this.querySelector('[data-cart-drawer-overlay]');
    this.panel = this.querySelector('[data-cart-drawer-panel]');
    this.bodyEl = this.querySelector('[data-cart-drawer-body]');
    this.closeButtons = this.querySelectorAll('[data-cart-drawer-close]');
    this.closeButtons.forEach((btn) => btn.addEventListener('click', () => this.close()));
  }

  async changeLine(line, quantity) {
    try {
      const result = await queueCartRequest((signal) =>
        changeCart(line, quantity, {
          sections: ['cart-drawer'],
          sections_url: window.location.pathname,
          signal,
        })
      );

      if (result.sections?.['cart-drawer']) {
        this.renderSection(result.sections['cart-drawer']);
      }
      publishCartUpdate(result);
      announce(strings().cartItemAdded || 'Cart updated');
    } catch (error) {
      if (error.name === 'AbortError') return;
      announce(strings().cartError || 'Unable to update cart');
      console.error(error);
    }
  }
}

customElements.define('zavelyn-cart-drawer', ZavelynCartDrawer);

function bindCartTriggers() {
  document.querySelectorAll('[data-cart-drawer-open]').forEach((el) => {
    el.addEventListener('click', (event) => {
      if (settings().cartType !== 'drawer') return;
      event.preventDefault();
      document.dispatchEvent(new CustomEvent('zavelyn:cart:open'));
    });
  });
}

export async function handleAddToCart(form, { openDrawer = true } = {}) {
  const formData = new FormData(form);
  const id = formData.get('id');
  const quantity = Number(formData.get('quantity') || 1);

  const submit = form.querySelector('[type="submit"]');
  const original = submit?.innerHTML;
  if (submit) {
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    submit.innerHTML = `<span class="button__spinner" aria-hidden="true"></span><span class="visually-hidden">${strings().loading}</span>`;
  }

  try {
    const result = await queueCartRequest((signal) =>
      addToCart(
        { id: Number(id), quantity },
        {
          sections: settings().cartType === 'drawer' ? ['cart-drawer'] : undefined,
          sections_url: window.location.pathname,
          signal,
        }
      )
    );

    const cart = await getCart();
    if (result.sections) {
      document.dispatchEvent(
        new CustomEvent('zavelyn:cart:update', { detail: { cart, sections: result.sections } })
      );
    } else {
      publishCartUpdate(cart);
    }

    announce(strings().cartItemAdded || 'Item added to cart');

    if (openDrawer && settings().cartType === 'drawer') {
      document.dispatchEvent(new CustomEvent('zavelyn:cart:open'));
    }

    return result;
  } catch (error) {
    if (error.name !== 'AbortError') {
      announce(error.data?.description || strings().cartError || 'Unable to update cart');
      throw error;
    }
  } finally {
    if (submit) {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      if (original) submit.innerHTML = original;
    }
  }
}

bindCartTriggers();

document.addEventListener('submit', (event) => {
  const form = event.target.closest('form[action*="/cart/add"]');
  if (!form || form.hasAttribute('data-no-ajax')) return;
  if (!window.fetch) return;

  event.preventDefault();
  handleAddToCart(form).catch(() => {
    form.setAttribute('data-no-ajax', '');
    form.submit();
  });
});

getCart()
  .then(publishCartUpdate)
  .catch(() => {});
