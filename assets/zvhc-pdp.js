/**
 * ZAVELYN HAIR CARE — PDP Interactive Engine (v1.0)
 * Scoped under window.ZvhcPdp
 */

(function() {
  'use strict';

  window.ZvhcPdp = {
    currentTier: 2, // Default to Tier 2 (Most Popular Duo)
    currentFormula: '100% Pure Raw Honduran Batana (60ml)',
    variants: [],

    init: function(variantsData) {
      this.variants = variantsData || [];
      this.bindEvents();
      this.updateState();
      this.initStickyDock();
      this.initFaq();
      this.initGallery();
    },

    bindEvents: function() {
      const self = this;

      // Bundle card clicks
      document.querySelectorAll('.zvhc-bundle-card').forEach(function(card) {
        card.addEventListener('click', function() {
          const tier = parseInt(this.getAttribute('data-tier'), 10);
          if (tier) {
            self.setTier(tier);
          }
        });
      });

      // Formula selector clicks
      document.querySelectorAll('.zvhc-formula-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const formula = this.getAttribute('data-formula');
          if (formula) {
            self.setFormula(formula);
          }
        });
      });

      // Main CTA click
      const ctaBtn = document.getElementById('zvhcMainCta');
      if (ctaBtn) {
        ctaBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.addToCart();
        });
      }

      // Mobile Dock CTA click
      const dockBtn = document.getElementById('zvhcDockCta');
      if (dockBtn) {
        dockBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.addToCart();
        });
      }
    },

    setTier: function(tier) {
      this.currentTier = tier;
      document.querySelectorAll('.zvhc-bundle-card').forEach(function(card) {
        const cTier = parseInt(card.getAttribute('data-tier'), 10);
        if (cTier === tier) {
          card.classList.add('is-selected');
        } else {
          card.classList.remove('is-selected');
        }
      });
      this.updateState();
    },

    setFormula: function(formula) {
      this.currentFormula = formula;
      document.querySelectorAll('.zvhc-formula-btn').forEach(function(btn) {
        if (btn.getAttribute('data-formula') === formula) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      });
      this.updateState();
    },

    resolveVariant: function() {
      const self = this;
      if (!this.variants || this.variants.length === 0) return null;

      // Look for variant matching currentTier bundle name and formula
      let matched = this.variants.find(function(v) {
        const title = (v.title || '').toLowerCase();
        let matchesTier = false;
        if (self.currentTier === 1 && (title.includes('buy 1') || title.includes('starter') || title.includes('1 bottle') || title.includes('1 set'))) matchesTier = true;
        if (self.currentTier === 2 && (title.includes('buy 2') || title.includes('duo') || title.includes('2 bottle') || title.includes('2 set'))) matchesTier = true;
        if (self.currentTier === 3 && (title.includes('buy 3') || title.includes('restoration') || title.includes('buy 2 get 1') || title.includes('3 bottle') || title.includes('3 set'))) matchesTier = true;

        let matchesFormula = true;
        if (self.currentFormula.includes('Rosemary')) {
          matchesFormula = title.includes('rosemary');
        } else {
          matchesFormula = !title.includes('rosemary');
        }

        return matchesTier && matchesFormula;
      });

      // Fallback if strict match fails
      if (!matched) {
        matched = this.variants[Math.min(self.currentTier - 1, self.variants.length - 1)];
      }

      return matched;
    },

    updateState: function() {
      const variant = this.resolveVariant();
      if (!variant) return;

      const price = (variant.price / 100).toFixed(2);
      const compare = variant.compare_at_price ? (variant.compare_at_price / 100).toFixed(2) : null;
      let savings = compare ? (compare - price).toFixed(2) : null;

      // Dynamic price update in CTA
      const ctaPriceEl = document.getElementById('zvhcCtaPrice');
      if (ctaPriceEl) {
        ctaPriceEl.textContent = '$' + price;
      }

      // Dynamic dock update
      const dockPriceEl = document.getElementById('zvhcDockPrice');
      if (dockPriceEl) {
        dockPriceEl.textContent = '$' + price;
      }

      // Savings callout text
      const savingsCallout = document.getElementById('zvhcSavingsCallout');
      if (savingsCallout) {
        if (this.currentTier === 2) {
          savingsCallout.innerHTML = '✨ <strong>Save 45% + FREE US Express Shipping</strong> included on this order';
        } else if (this.currentTier === 3) {
          savingsCallout.innerHTML = '🎉 <strong>Buy 2 Get 1 FREE (Save 55%) + 2 Free Gifts</strong> included';
        } else {
          savingsCallout.innerHTML = '📦 Starter 30-Day Course · 60-Day Money-Back Guarantee';
        }
      }
    },

    addToCart: function() {
      const self = this;
      const variant = this.resolveVariant();
      if (!variant) return;

      const ctaBtn = document.getElementById('zvhcMainCta');
      const originalText = ctaBtn ? ctaBtn.innerHTML : '';
      if (ctaBtn) {
        ctaBtn.disabled = true;
        ctaBtn.style.opacity = '0.7';
      }

      const payload = {
        id: variant.id,
        quantity: 1
      };

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function(res) { return res.json(); })
      .then(function(item) {
        if (ctaBtn) {
          ctaBtn.disabled = false;
          ctaBtn.style.opacity = '1';
        }
        // Trigger drawer
        if (typeof window.openZvhcCart === 'function') {
          window.openZvhcCart();
        } else if (typeof window.openWillaCart === 'function') {
          window.openWillaCart();
        } else {
          window.location.href = '/cart';
        }
      })
      .catch(function(err) {
        console.error('Error adding to cart:', err);
        if (ctaBtn) {
          ctaBtn.disabled = false;
          ctaBtn.style.opacity = '1';
        }
        window.location.href = '/cart';
      });
    },

    initStickyDock: function() {
      const mainCta = document.getElementById('zvhcMainCta');
      const dock = document.getElementById('zvhcMobileDock');
      if (!mainCta || !dock) return;

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              dock.classList.remove('is-visible');
            } else if (entry.boundingClientRect.top < 0) {
              dock.classList.add('is-visible');
            }
          });
        }, { threshold: 0 });
        observer.observe(mainCta);
      }
    },

    initGallery: function() {
      const thumbs = document.querySelectorAll('.zvhc-gallery-thumb');
      const mainImg = document.getElementById('zvhcMainImg');
      if (!thumbs.length || !mainImg) return;

      thumbs.forEach(function(thumb) {
        thumb.addEventListener('click', function() {
          thumbs.forEach(function(t) { t.classList.remove('is-active'); });
          this.classList.add('is-active');
          const fullSrc = this.getAttribute('data-full-src');
          if (fullSrc) {
            mainImg.style.opacity = '0.4';
            mainImg.src = fullSrc;
            setTimeout(function() { mainImg.style.opacity = '1'; }, 100);
          }
        });
      });
    },

    initFaq: function() {
      document.querySelectorAll('.zvhc-faq-trigger').forEach(function(trigger) {
        trigger.addEventListener('click', function() {
          const item = this.closest('.zvhc-faq-item');
          if (item) {
            item.classList.toggle('is-open');
          }
        });
      });
    }
  };
})();

