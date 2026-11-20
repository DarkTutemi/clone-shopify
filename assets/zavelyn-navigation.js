/**
 * Zavelyn — Mobile menu / navigation
 */

import { trapFocus, releaseFocus, getFocusable } from 'zavelyn-utils';

class ZavelynMobileMenu extends HTMLElement {
  connectedCallback() {
    this.overlay = this.querySelector('[data-mobile-menu-overlay]');
    this.panel = this.querySelector('[data-mobile-menu-panel]');
    this.closeButtons = this.querySelectorAll('[data-mobile-menu-close]');
    this.previouslyFocused = null;
    this.onKeyDown = this.onKeyDown.bind(this);

    this.setAttribute('aria-hidden', 'true');

    document.querySelectorAll('[data-mobile-menu-open]').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        this.open();
      });
    });

    this.closeButtons.forEach((btn) => btn.addEventListener('click', () => this.close()));
    this.overlay?.addEventListener('click', () => this.close());
    this.openButtons = document.querySelectorAll('[data-mobile-menu-open]');

    this.panel?.addEventListener('click', (event) => {
      if (event.target.closest('a')) this.close();
    });

    this.querySelectorAll('[data-mobile-submenu-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.mobile-menu__item');
        if (!item) return;
        const willOpen = !item.classList.contains('is-open');

        item.parentElement?.querySelectorAll('.mobile-menu__item.is-open').forEach((openItem) => {
          if (openItem === item) return;
          openItem.classList.remove('is-open');
          openItem.querySelector('[data-mobile-submenu-toggle]')?.setAttribute('aria-expanded', 'false');
        });

        item.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });

    this.querySelector('[data-mobile-search]')?.addEventListener('click', () => {
      this.close();
      document.querySelector('[data-search-open]')?.click();
    });
  }

  open() {
    this.previouslyFocused = document.activeElement;
    this.setAttribute('open', '');
    this.setAttribute('aria-hidden', 'false');
    this.openButtons?.forEach((btn) => btn.setAttribute('aria-expanded', 'true'));
    document.body.classList.add('menu-open');
    document.addEventListener('keydown', this.onKeyDown);

    const focusables = getFocusable(this.panel || this);
    (focusables[0] || this.panel)?.focus?.();
  }

  close() {
    this.removeAttribute('open');
    this.setAttribute('aria-hidden', 'true');
    this.openButtons?.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
    document.body.classList.remove('menu-open');
    document.removeEventListener('keydown', this.onKeyDown);
    releaseFocus(this.previouslyFocused);
  }

  onKeyDown(event) {
    if (event.key === 'Escape') this.close();
    else if (this.panel) trapFocus(this.panel, event);
  }
}

customElements.define('zavelyn-mobile-menu', ZavelynMobileMenu);

function closeDesktopMenus(except) {
  document.querySelectorAll('.header__menu-item.is-open').forEach((item) => {
    if (item === except) return;
    item.classList.remove('is-open');
    item.querySelector('.header__submenu-toggle')?.setAttribute('aria-expanded', 'false');
  });
}

function bindDesktopMenus() {
  const items = document.querySelectorAll('.header__menu-item--mega, .header__menu-item--dropdown');
  if (!items.length) return;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  items.forEach((item) => {
    const toggle = item.querySelector('.header__submenu-toggle');
    const link = item.querySelector(':scope > .header__menu-trigger .header__menu-link, :scope > .header__menu-link');
    if (!toggle) return;

    const setOpen = (open) => {
      if (open) closeDesktopMenus(item);
      item.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      setOpen(!item.classList.contains('is-open'));
    });

    link?.addEventListener('click', (event) => {
      if (finePointer.matches || item.classList.contains('is-open')) return;
      event.preventDefault();
      setOpen(true);
    });
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.header__menu-item--mega, .header__menu-item--dropdown')) return;
    closeDesktopMenus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openItem = document.querySelector('.header__menu-item.is-open');
    if (!openItem) return;
    closeDesktopMenus();
    openItem.querySelector('.header__submenu-toggle')?.focus();
  });
}

bindDesktopMenus();

/* Sticky header shadow on scroll */
const header = document.querySelector('.header-wrapper--sticky');
if (header && 'IntersectionObserver' in window) {
  const sentinel = document.createElement('div');
  sentinel.style.position = 'absolute';
  sentinel.style.insetBlockStart = '0';
  sentinel.style.width = '1px';
  sentinel.style.height = '1px';
  sentinel.setAttribute('aria-hidden', 'true');
  header.before(sentinel);

  const observer = new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  });
  observer.observe(sentinel);
}
