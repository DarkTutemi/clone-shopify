(function () {
  var root = document.querySelector('.offer-page--balm');
  if (!root || root.dataset.mbReady === 'true') return;
  root.dataset.mbReady = 'true';

  var main = root.querySelector('[data-offer-main]');
  var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-offer-thumb]'));
  var sources = thumbs.map(function (t) { return t.getAttribute('data-src'); });
  var index = 0;
  function setSlide(i) {
    if (!main || !sources.length) return;
    index = (i + sources.length) % sources.length;
    main.src = sources[index];
    thumbs.forEach(function (t, n) { t.classList.toggle('is-active', n === index); });
  }
  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () { setSlide(Number(thumb.getAttribute('data-index'))); });
  });
  var prev = root.querySelector('[data-offer-prev]');
  var next = root.querySelector('[data-offer-next]');
  if (prev) prev.addEventListener('click', function (e) { e.stopPropagation(); setSlide(index - 1); });
  if (next) next.addEventListener('click', function (e) { e.stopPropagation(); setSlide(index + 1); });

  var qtyInput = document.getElementById('OfferQuantity');
  var packs = root.querySelector('[data-mb-packs]');
  var activePack = packs && packs.querySelector('.mb-pack.is-active');
  var activeQty = activePack ? Number(activePack.getAttribute('data-qty') || 2) : 2;
  function selectPack(btn) {
    activeQty = Number(btn.getAttribute('data-qty') || 1);
    if (qtyInput) qtyInput.value = String(activeQty);
    packs.querySelectorAll('[data-qty]').forEach(function (el) {
      el.classList.toggle('is-active', el === btn);
      el.setAttribute('aria-pressed', el === btn ? 'true' : 'false');
    });
  }
  if (packs) {
    packs.querySelectorAll('[data-qty]').forEach(function (btn) {
      btn.addEventListener('click', function () { selectPack(btn); });
    });
  }

  root.querySelectorAll('[data-mb-acc]').forEach(function (acc) {
    acc.querySelectorAll('.mb-faq__item').forEach(function (item) {
      var trigger = item.querySelector('.mb-faq__trigger');
      var panel = item.querySelector('.mb-faq__panel');
      if (!trigger || !panel) return;
      trigger.addEventListener('click', function () {
        var open = !item.classList.contains('is-open');
        acc.querySelectorAll('.mb-faq__item').forEach(function (other) {
          var on = other === item && open;
          other.classList.toggle('is-open', on);
          var b = other.querySelector('.mb-faq__trigger');
          var p = other.querySelector('.mb-faq__panel');
          if (b) b.setAttribute('aria-expanded', on ? 'true' : 'false');
          if (p) { if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', ''); }
        });
      });
    });
  });

  var ing = root.querySelector('[data-mb-ing]');
  if (ing) {
    var photo = ing.querySelector('[data-mb-ing-photo]');
    var count = ing.querySelector('[data-mb-ing-count]');
    var nameEl = ing.querySelector('[data-mb-ing-name]');
    var jobEl = ing.querySelector('[data-mb-ing-job]');
    var descEl = ing.querySelector('[data-mb-ing-desc]');
    var tagsEl = ing.querySelector('[data-mb-ing-tags]');
    function applyIng(btn) {
      ing.querySelectorAll('[data-mb-ing-btn]').forEach(function (el) {
        el.classList.toggle('is-active', el === btn);
      });
      if (photo) photo.src = btn.getAttribute('data-img');
      if (count) count.textContent = btn.getAttribute('data-count');
      if (nameEl) nameEl.textContent = btn.getAttribute('data-name');
      if (jobEl) jobEl.textContent = btn.getAttribute('data-job');
      if (descEl) descEl.textContent = btn.getAttribute('data-desc');
      if (tagsEl) {
        tagsEl.replaceChildren();
        (btn.getAttribute('data-tags') || '').split('|').forEach(function (tag) {
          if (!tag) return;
          var span = document.createElement('span');
          span.textContent = tag;
          tagsEl.appendChild(span);
        });
      }
    }
    ing.querySelectorAll('[data-mb-ing-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () { applyIng(btn); });
    });
  }

  var rev = root.querySelector('[data-mb-reviews]');
  if (rev) {
    var rtrack = rev.querySelector('[data-mb-rev-track]');
    function step() {
      var card = rtrack && rtrack.querySelector('.mb-card');
      return card ? card.getBoundingClientRect().width + 12 : 300;
    }
    rev.querySelector('[data-mb-rev-prev]').addEventListener('click', function () {
      rtrack.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    rev.querySelector('[data-mb-rev-next]').addEventListener('click', function () {
      rtrack.scrollBy({ left: step(), behavior: 'smooth' });
    });
  }

  var variantInput = document.getElementById('OfferVariantId');
  var buyForm = document.getElementById('OfferAddForm');
  var checkoutBtns = Array.prototype.slice.call(root.querySelectorAll('[data-mb-atc]'));
  var busy = false;
  function addToCart(trigger) {
    var vid = variantInput ? Number(variantInput.value) : 0;
    if (busy || !vid) return;
    var qty = qtyInput ? Number(qtyInput.value || activeQty || 1) : activeQty;
    busy = true;
    checkoutBtns.forEach(function (btn) { btn.classList.add('is-loading'); });
    var activePack = packs ? packs.querySelector('.mb-pack.is-active') : null;
    var discountCode = activePack ? (activePack.getAttribute('data-discount') || '') : '';
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        items: [{
          id: vid,
          quantity: qty,
          properties: { _bundle: 'miracle-balm', _pack: String(qty) }
        }]
      })
    })
      .then(function (res) { if (!res.ok) throw new Error('add_failed'); return res.json(); })
      .then(function () {
        if (!discountCode) return null;
        return fetch('/discount/' + encodeURIComponent(discountCode), {
          credentials: 'same-origin',
          redirect: 'follow'
        }).catch(function () { return null; });
      })
      .then(function () { return fetch('/cart.js', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }); })
      .then(function (cart) {
        busy = false;
        checkoutBtns.forEach(function (btn) { btn.classList.remove('is-loading'); });
        if (cart) {
          document.dispatchEvent(new CustomEvent('zavelyn:offer-cart:open', { detail: { cart: cart } }));
          return;
        }
        window.location.href = '/checkout';
      })
      .catch(function () {
        busy = false;
        checkoutBtns.forEach(function (btn) { btn.classList.remove('is-loading'); });
        if (buyForm) buyForm.submit();
      });
  }
  if (buyForm) buyForm.addEventListener('submit', function (e) { e.preventDefault(); addToCart(); });
  checkoutBtns.forEach(function (btn) {
    if (btn.closest('#OfferAddForm')) return;
    btn.addEventListener('click', function (e) { e.preventDefault(); addToCart(btn); });
  });

  var sticky = root.querySelector('[data-offer-sticky]');
  var hero = root.querySelector('.offer-hero');
  if (sticky && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var on = !entries[0].isIntersecting;
      sticky.classList.toggle('is-on', on);
      sticky.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) sticky.removeAttribute('inert');
      else sticky.setAttribute('inert', '');
      document.documentElement.classList.toggle('offer-sticky-on', on);
    }, { threshold: 0.05 }).observe(hero);
  }

  root.querySelectorAll('[data-senzio-comparison]').forEach(function (section) {
    if (section.dataset.scInitialized === 'true') return;
    section.dataset.scInitialized = 'true';
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      section.classList.add('is-visible');
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -3% 0px' });
    observer.observe(section);
  });
})();
