/**
 * Zavelyn — Product form, variants, quantity
 */

import { formatMoney, announce } from 'zavelyn-utils';

const strings = () => window.Zavelyn.strings;

class ZavelynQuantitySelector extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input[type="number"], [data-quantity-input]');
    this.minus = this.querySelector('[data-quantity-minus]');
    this.plus = this.querySelector('[data-quantity-plus]');

    this.minus?.addEventListener('click', () => this.step(-1));
    this.plus?.addEventListener('click', () => this.step(1));
    this.input?.addEventListener('change', () => this.normalize());
  }

  step(delta) {
    if (!this.input) return;
    const min = Number(this.input.min || 1);
    const max = this.input.max ? Number(this.input.max) : Infinity;
    const next = Math.min(max, Math.max(min, (Number(this.input.value) || min) + delta));
    this.input.value = String(next);
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  normalize() {
    if (!this.input) return;
    const min = Number(this.input.min || 1);
    const max = this.input.max ? Number(this.input.max) : Infinity;
    let value = Number(this.input.value);
    if (Number.isNaN(value) || value < min) value = min;
    if (value > max) value = max;
    this.input.value = String(value);
  }
}

customElements.define('zavelyn-quantity-selector', ZavelynQuantitySelector);

class ZavelynVariantPicker extends HTMLElement {
  connectedCallback() {
    this.productForm = this.closest('zavelyn-product-form') || document.querySelector('zavelyn-product-form');
    this.script = this.querySelector('[type="application/json"][data-variant-json]');
    this.variants = this.script ? JSON.parse(this.script.textContent) : [];

    this.addEventListener('change', (event) => {
      const input = event.target.closest('input[type="radio"], select');
      if (input?.type === 'radio') {
        const group = input.closest('[data-option-group]');
        group?.querySelectorAll('[data-option-value]').forEach((el) => {
          el.setAttribute('aria-checked', el.htmlFor === input.id || el.getAttribute('for') === input.id ? 'true' : 'false');
        });
        const selected = group?.querySelector('[data-option-selected-value]');
        if (selected) selected.textContent = input.value;
      }
      this.onOptionChange();
    });
  }

  getSelectedOptions() {
    const options = [];
    this.querySelectorAll('[data-option-group]').forEach((group) => {
      const checked =
        group.querySelector('input[type="radio"]:checked') ||
        group.querySelector('[aria-checked="true"]');
      if (checked) {
        options.push(checked.value || checked.dataset.optionValue);
      } else {
        const select = group.querySelector('select');
        if (select) options.push(select.value);
      }
    });
    return options;
  }

  findVariant(options) {
    return this.variants.find((variant) =>
      variant.options.every((opt, index) => opt === options[index])
    );
  }

  onOptionChange() {
    const options = this.getSelectedOptions();
    const variant = this.findVariant(options);
    this.dispatchEvent(
      new CustomEvent('zavelyn:variant:change', {
        bubbles: true,
        detail: { variant, options },
      })
    );
  }
}

customElements.define('zavelyn-variant-picker', ZavelynVariantPicker);

class ZavelynProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.idInput = this.form?.querySelector('[name="id"]');
    this.submitButton = this.form?.querySelector('[type="submit"]');
    this.priceEl = document.querySelector('[data-product-price]');
    this.compareEl = document.querySelector('[data-product-compare]');
    this.availabilityEl = document.querySelector('[data-product-availability]');
    this.skuEl = document.querySelector('[data-product-sku]');
    this.mediaMain = document.querySelector('[data-product-media-main]');
    this.updateUrl = this.dataset.updateUrl !== 'false';

    this.addEventListener('zavelyn:variant:change', (event) => {
      this.onVariantChange(event.detail.variant);
    });

    this.bindMediaThumbs();
  }

  bindMediaThumbs() {
    document.querySelectorAll('[data-product-thumb]').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.mediaSrc;
        const srcset = thumb.dataset.mediaSrcset;
        const alt = thumb.dataset.mediaAlt || '';
        const img = this.mediaMain?.querySelector('img');
        if (!img || !src) return;

        img.src = src;
        if (srcset) img.srcset = srcset;
        img.alt = alt;

        document.querySelectorAll('[data-product-thumb]').forEach((t) => {
          t.setAttribute('aria-pressed', 'false');
          t.classList.remove('is-active');
        });
        thumb.setAttribute('aria-pressed', 'true');
        thumb.classList.add('is-active');
      });
    });
  }

  onVariantChange(variant) {
    if (!variant) {
      this.setUnavailable();
      return;
    }

    if (this.idInput) this.idInput.value = variant.id;

    this.updatePrice(variant);
    this.updateAvailability(variant);
    this.updateMedia(variant);
    this.updateUrlHistory(variant);
    this.updateSku(variant);
  }

  updatePrice(variant) {
    if (this.priceEl) {
      this.priceEl.textContent = formatMoney(variant.price);
      this.priceEl.classList.toggle('price__sale', Boolean(variant.compare_at_price && variant.compare_at_price > variant.price));
    }

    if (this.compareEl) {
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        this.compareEl.hidden = false;
        this.compareEl.textContent = formatMoney(variant.compare_at_price);
      } else {
        this.compareEl.hidden = true;
        this.compareEl.textContent = '';
      }
    }
  }

  updateAvailability(variant) {
    if (!this.submitButton) return;

    if (variant.available) {
      this.submitButton.disabled = false;
      this.submitButton.removeAttribute('aria-disabled');
      const label = this.submitButton.querySelector('[data-add-label]');
      if (label) label.textContent = strings().addToCart || 'Add to cart';
      else this.submitButton.textContent = strings().addToCart || 'Add to cart';
    } else {
      this.submitButton.disabled = true;
      this.submitButton.setAttribute('aria-disabled', 'true');
      const label = this.submitButton.querySelector('[data-add-label]');
      if (label) label.textContent = strings().soldOut || 'Sold out';
      else this.submitButton.textContent = strings().soldOut || 'Sold out';
    }

    if (this.availabilityEl) {
      this.availabilityEl.textContent = variant.available
        ? ''
        : strings().soldOut || 'Sold out';
    }
  }

  setUnavailable() {
    if (this.submitButton) {
      this.submitButton.disabled = true;
      this.submitButton.setAttribute('aria-disabled', 'true');
      const label = this.submitButton.querySelector('[data-add-label]');
      if (label) label.textContent = strings().unavailable || 'Unavailable';
      else this.submitButton.textContent = strings().unavailable || 'Unavailable';
    }
    announce(strings().unavailable || 'Unavailable');
  }

  updateSku(variant) {
    if (this.skuEl) {
      this.skuEl.textContent = variant.sku || '';
      this.skuEl.hidden = !variant.sku;
    }
  }

  updateMedia(variant) {
    if (!variant.featured_media && !variant.featured_image) return;

    const mediaId = variant.featured_media?.id || variant.featured_image?.id;
    if (mediaId) {
      const thumb = document.querySelector(`[data-product-thumb][data-media-id="${mediaId}"]`);
      thumb?.click();
      return;
    }

    const featured = variant.featured_image;
    if (!featured || !this.mediaMain) return;
    const img = this.mediaMain.querySelector('img');
    if (!img) return;

    const url = featured.src || featured;
    if (typeof url === 'string') {
      img.src = url.replace(/(\.[^.]*$)/, '_{width}x$1').includes('{width}')
        ? url
        : url;
    }
  }

  updateUrlHistory(variant) {
    if (!this.updateUrl || !variant?.id) return;
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url.toString());
  }
}

customElements.define('zavelyn-product-form', ZavelynProductForm);
