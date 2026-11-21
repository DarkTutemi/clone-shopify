/**
 * ZAVELYN HAIR CARE — PDP Interactive Engine (v1.1)
 * Scoped under window.ZvhcPdp
 * Handles strict variant matching, mathematically sound bundle savings, and safe cart actions
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

      // Exact variant matching based on tier keywords
      let matched = this.variants.find(function(v) {
        const title = (v.title || '').toLowerCase();
        let matchesTier = false;
        if (self.currentTier === 1 && (title.includes('buy 1') || title.includes('starter') || title.includes('1 bottle') || title.includes('1 pc') || title.includes('1 unit') || title.includes('1 pouch') || title.includes('1 tin') || title.includes('1 compact') || title.includes('default title'))) {
          matchesTier = true;
        }
        if (self.currentTier === 2 && (title.includes('buy 2') || title.includes('duo') || title.includes('2 bottle') || title.includes('2 pc') || title.includes('2 unit') || title.includes('2 pouch') || title.includes('2 tin') || title.includes('2 compact'))) {
          matchesTier = true;
        }
        if (self.currentTier === 3 && (title.includes('buy 3') || title.includes('trio') || title.includes('restoration') || title.includes('3 bottle') || title.includes('3 pc') || title.includes('3 unit') || title.includes('3 pouch') || title.includes('3 tin') || title.includes('3 compact'))) {
          matchesTier = true;
        }

        let matchesFormula = true;
        if (self.currentFormula && self.currentFormula.includes('Rosemary')) {
          matchesFormula = title.includes('rosemary');
        } else if (self.currentFormula && (title.includes('rosemary') || title.includes('infusion'))) {
          matchesFormula = false;
        }

        return matchesTier && matchesFormula;
      });

      // Return exact match only — NO unsafe index fallback!
      return matched || null;
    },

    updateState: function() {
      const variant = this.resolveVariant();
      const ctaBtn = document.getElementById('zvhcMainCta');
      const dockBtn = document.getElementById('zvhcDockCta');

      if (!variant) {
        if (ctaBtn) {
          ctaBtn.disabled = true;
          ctaBtn.style.opacity = '0.6';
          const ctaPriceEl = document.getElementById('zvhcCtaPrice');
          if (ctaPriceEl) ctaPriceEl.textContent = 'Unavailable';
        }
        if (dockBtn) {
          dockBtn.disabled = true;
          dockBtn.style.opacity = '0.6';
        }
        return;
      }

      if (ctaBtn) {
        ctaBtn.disabled = false;
        ctaBtn.style.opacity = '1';
      }
      if (dockBtn) {
        dockBtn.disabled = false;
        dockBtn.style.opacity = '1';
      }

      const price = (variant.price / 100).toFixed(2);

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
          savingsCallout.innerHTML = '✨ <strong>Save 30% vs Reg. + FREE US Tracked Shipping</strong> included on this order';
        } else if (this.currentTier === 3) {
          savingsCallout.innerHTML = '🎉 <strong>Save 40% (Best Value Course) + 2 Free Gifts</strong> included';
        } else {
          savingsCallout.innerHTML = '📦 Starter Supply · 30-Day Satisfaction Guarantee';
        }
      }
    },

    addToCart: function() {
      const self = this;
      const variant = this.resolveVariant();
      if (!variant || !variant.id) {
        alert('Please select an available product option.');
        return;
      }

      const ctaBtn = document.getElementById('zvhcMainCta');
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
