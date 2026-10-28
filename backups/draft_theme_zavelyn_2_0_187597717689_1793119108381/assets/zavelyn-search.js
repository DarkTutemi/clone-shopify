/**
 * Zavelyn — Predictive Search + search modal
 */

import { debounce, announce, trapFocus, releaseFocus, getFocusable } from 'zavelyn-utils';

const routes = () => window.Zavelyn.routes;
const settings = () => window.Zavelyn.settings;

class ZavelynPredictiveSearch extends HTMLElement {
  connectedCallback() {
    if (!settings().predictiveSearchEnabled) return;

    this.form = this.querySelector('form');
    this.input = this.querySelector('input[type="search"], input[name="q"]');
    this.results = this.querySelector('[data-predictive-results]');
    this.status = this.querySelector('[data-predictive-status]');
    this.clearBtn = this.querySelector('[data-predictive-clear]');
    this.selectedIndex = -1;
    this.abortController = null;
    this.cachedQuery = '';

    if (!this.input || !this.results) return;

    this.onInput = debounce(this.onInput.bind(this), 280);
    this.input.addEventListener('input', this.onInput);
    this.input.addEventListener('keydown', this.onKeyDown.bind(this));
    this.input.addEventListener('focus', () => {
      if (this.input.value.trim().length >= 2) this.open();
    });

    this.clearBtn?.addEventListener('click', () => {
      this.input.value = '';
      this.clearBtn.classList.remove('is-visible');
      this.close();
      this.input.focus();
    });

    document.addEventListener('click', (event) => {
      if (!this.contains(event.target)) this.close();
    });
  }

  onInput() {
    const query = this.input.value.trim();
    this.clearBtn?.classList.toggle('is-visible', query.length > 0);

    if (query.length < 2) {
      this.close();
      return;
    }

    this.search(query);
  }

  async search(query) {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();
    this.cachedQuery = query;
    this.setStatus(this.dataset.loadingMessage || 'Loading suggestions');
    this.open();

    const limit = settings().predictiveSearchLimit || 6;
    const params = new URLSearchParams({
      q: query,
      'resources[type]': 'product,collection,page,article',
      'resources[limit]': String(limit),
      section_id: this.dataset.sectionId || 'predictive-search',
    });

    try {
      const url = `${routes().predictive_search_url}?${params}`;
      const response = await fetch(url, {
        signal: this.abortController.signal,
        headers: { Accept: 'text/html' },
      });

      if (!response.ok) throw new Error('Predictive search failed');

      const html = await response.text();
      if (query !== this.cachedQuery) return;

      const doc = new DOMParser().parseFromString(html, 'text/html');
      const markup =
        doc.querySelector('[data-predictive-results-markup]') ||
        doc.querySelector('#shopify-section-predictive-search') ||
        doc.body;

      this.results.replaceChildren();
      const fragment = document.createDocumentFragment();

      const items = markup.querySelectorAll('[data-predictive-item], .predictive-search__item');
      if (!items.length) {
        const empty = document.createElement('div');
        empty.className = 'predictive-search__status';
        empty.textContent = this.dataset.emptyMessage || 'No suggestions found';
        this.results.append(empty);
        this.setStatus(empty.textContent);
        return;
      }

      // Prefer server-rendered HTML groups when available
      const groups = markup.querySelectorAll('[data-predictive-group], .predictive-search__group');
      if (groups.length) {
        groups.forEach((group) => fragment.append(group.cloneNode(true)));
        const viewAll = markup.querySelector('[data-predictive-view-all], .predictive-search__view-all');
        if (viewAll) fragment.append(viewAll.cloneNode(true));
        this.results.append(fragment);
      } else {
        items.forEach((item) => fragment.append(item.cloneNode(true)));
        this.results.append(fragment);
      }

      this.selectedIndex = -1;
      this.setStatus(`${items.length} suggestions`);
      announce(`${items.length} suggestions`);
    } catch (error) {
      if (error.name === 'AbortError') return;
      this.results.replaceChildren();
      const err = document.createElement('div');
      err.className = 'predictive-search__status';
      err.textContent = this.dataset.errorMessage || 'Unable to load suggestions';
      this.results.append(err);
      this.setStatus(err.textContent);
    }
  }

  setStatus(message) {
    if (this.status) this.status.textContent = message || '';
  }

  getItems() {
    return [...this.results.querySelectorAll('[href], [data-predictive-item]')];
  }

  onKeyDown(event) {
    const items = this.getItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.open();
        this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
        this.highlight(items);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.highlight(items);
        break;
      case 'Enter':
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
          event.preventDefault();
          items[this.selectedIndex].click();
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        this.input.blur();
        break;
      default:
        break;
    }
  }

  highlight(items) {
    items.forEach((item, index) => {
      const selected = index === this.selectedIndex;
      item.setAttribute('aria-selected', selected ? 'true' : 'false');
      if (selected) item.scrollIntoView({ block: 'nearest' });
    });
  }

  open() {
    this.results.setAttribute('aria-hidden', 'false');
    this.input.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.results.setAttribute('aria-hidden', 'true');
    this.input.setAttribute('aria-expanded', 'false');
    this.selectedIndex = -1;
    this.setStatus('');
  }
}

customElements.define('zavelyn-predictive-search', ZavelynPredictiveSearch);

class SearchModal {
  constructor(root) {
    this.root = root;
    this.overlay = root.querySelector('[data-search-overlay]');
    this.panel = root.querySelector('[data-search-panel]');
    this.closeBtn = root.querySelector('[data-search-close]');
    this.input = root.querySelector('input[type="search"], input[name="q"]');
    this.previouslyFocused = null;
    this.onKeyDown = this.onKeyDown.bind(this);

    document.querySelectorAll('[data-search-open]').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        this.open();
      });
    });

    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());
  }

  open() {
    this.previouslyFocused = document.activeElement;
    this.root.setAttribute('open', '');
    this.root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('search-open');
    document.addEventListener('keydown', this.onKeyDown);
    requestAnimationFrame(() => this.input?.focus());
  }

  close() {
    this.root.removeAttribute('open');
    this.root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('search-open');
    document.removeEventListener('keydown', this.onKeyDown);
    releaseFocus(this.previouslyFocused);
  }

  onKeyDown(event) {
    if (event.key === 'Escape') this.close();
    else if (this.panel) trapFocus(this.panel, event);
  }
}

document.querySelectorAll('[data-search-modal]').forEach((el) => new SearchModal(el));
