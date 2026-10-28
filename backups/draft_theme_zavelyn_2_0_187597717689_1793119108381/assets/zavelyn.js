/**
 * Zavelyn — Theme entry
 * Progressive enhancement loader. Loads only what the page needs.
 */

import { formatMoney, announce, debounce, trapFocus, releaseFocus } from 'zavelyn-utils';

window.Zavelyn = window.Zavelyn || {};
Object.assign(window.Zavelyn, { formatMoney, announce, debounce, trapFocus, releaseFocus });

const loaders = [
  {
    selector: 'zavelyn-cart-drawer, [data-cart-drawer-open], form[action*="/cart/add"]',
    load: () => import('zavelyn-cart'),
  },
  {
    selector: 'zavelyn-product-form, zavelyn-variant-picker, .product',
    load: () => import('zavelyn-product'),
  },
  {
    selector: 'zavelyn-predictive-search, [data-search-modal]',
    load: () => import('zavelyn-search'),
  },
  {
    selector: 'zavelyn-mobile-menu, .header__menu-toggle',
    load: () => import('zavelyn-navigation'),
  },
];

async function boot() {
  const tasks = loaders
    .filter(({ selector }) => document.querySelector(selector))
    .map(({ load }) => load().catch((error) => console.error('[Zavelyn] module load failed', error)));

  await Promise.all(tasks);
  document.dispatchEvent(new CustomEvent('zavelyn:ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
