/**
 * Zavelyn — Shared utilities
 */

export function formatMoney(cents, format) {
  if (typeof cents === 'string') cents = cents.replace('.', '');
  const value = Number(cents) || 0;
  const fmt = format || window.Zavelyn?.settings?.moneyFormat || '${{amount}}';

  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = (str, amount) => {
    return str.replace(placeholderRegex, () => amount);
  };

  const thousandsRE = /(\d)(?=(\d\d\d)+(?!\d))/g;

  const withDelimiter = (number, precision = 2, thousands = ',', decimal = '.') => {
    if (isNaN(number) || number == null) return '0';
    const num = (number / 100.0).toFixed(precision);
    const parts = num.split('.');
    const dollars = parts[0].replace(thousandsRE, `$1${thousands}`);
    const centsPart = parts[1] ? decimal + parts[1] : '';
    return dollars + centsPart;
  };

  switch (fmt.match(placeholderRegex)?.[1]) {
    case 'amount':
      return formatString(fmt, withDelimiter(value, 2));
    case 'amount_no_decimals':
      return formatString(fmt, withDelimiter(value, 0));
    case 'amount_with_comma_separator':
      return formatString(fmt, withDelimiter(value, 2, '.', ','));
    case 'amount_no_decimals_with_comma_separator':
      return formatString(fmt, withDelimiter(value, 0, '.', ','));
    case 'amount_with_apostrophe_separator':
      return formatString(fmt, withDelimiter(value, 2, "'", '.'));
    default:
      try {
        return new Intl.NumberFormat(document.documentElement.lang || 'en', {
          style: 'currency',
          currency: (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) || 'USD',
        }).format(value / 100);
      } catch {
        return `$${(value / 100).toFixed(2)}`;
      }
  }
}

export function announce(message) {
  const region = document.getElementById('zavelyn-live-region');
  if (!region || !message) return;
  region.textContent = '';
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}

export function debounce(fn, wait = 300) {
  let timer;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function fetchJSON(url, options = {}) {
  const controller = options.signal ? null : new AbortController();
  const signal = options.signal || controller.signal;
  const timeout = options.timeout ?? 10000;

  let timeoutId;
  if (!options.signal) {
    timeoutId = setTimeout(() => controller.abort(), timeout);
  }

  return fetch(url, {
    ...options,
    signal,
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(options.headers || {}),
    },
  })
    .then(async (response) => {
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const error = new Error(data?.description || data?.message || response.statusText);
        error.status = response.status;
        error.data = data;
        throw error;
      }
      return data;
    })
    .finally(() => {
      if (timeoutId) clearTimeout(timeoutId);
    });
}

export function sectionRender(sectionIds, params = {}) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === '') url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  });
  url.searchParams.set('sections', Array.isArray(sectionIds) ? sectionIds.join(',') : sectionIds);
  return fetchJSON(url.toString());
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function trapFocus(container, event) {
  const focusables = [...container.querySelectorAll(focusableSelector)].filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.key !== 'Tab') return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function releaseFocus(previouslyFocused) {
  if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
    previouslyFocused.focus();
  }
}

export function getFocusable(container) {
  return [...container.querySelectorAll(focusableSelector)].filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  );
}
