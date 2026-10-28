/* ==========================================================================
   ZAVELYN vFIT — SELF-CARE UPSELL JAVASCRIPT LOGIC V2
   Verified Live Shopify Data • Dynamic Quantity • Independent Media Galleries
   ========================================================================== */

(function() {
  'use strict';

  // 1. LIVE SHOPIFY DATA (SOURCE OF TRUTH - READ-ONLY)
  const PRODUCTS = {
    vfit: {
      id: 15461356011705,
      variantId: 67979120574649,
      title: 'Zavelyn vFit Red Light Wellness Device',
      shortTitle: 'vFit Wellness Device',
      price: 149.99, // Verified Shopify live price (P0 fixed)
      comparePrice: 450.00,
      inventoryPolicy: 'continue',
      inventoryQuantity: 0,
      image: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/joylux_vfit_starter_kit.jpg?v=1793196841'
    },
    eyeMask: {
      id: 15469511213241,
      variantId: 68033411776697,
      title: 'Zavelyn Red Light Eye Care Mask',
      shortTitle: 'Eye Care Mask',
      price: 89.99,
      comparePrice: 149.99,
      inventoryPolicy: 'deny',
      inventoryQuantity: 0,
      badge: 'TARGETED EYE CARE',
      benefit: 'Targeted 660nm red light therapy soothing delicate eye contours, puffiness, and dark circles.',
      media: [
        {
          src: 'media/eyemask_source_hd.jpg',
          shopifySrc: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/Sc34c469c6944416db67152e6dd6e2e744_jpg_220x220q75_jpg.avif?v=1793197124',
          alt: 'Zavelyn Red Light Eye Care Mask with 30 Dual-Chipset LEDs',
          title: '30 LED Beads Dual Chipset Ergonomic Eye Contouring'
        },
        {
          src: 'media/eyemask_slide_2.jpg',
          shopifySrc: 'media/eyemask_slide_2.jpg',
          alt: 'Zavelyn Eye Beauty Device worn comfortably over eyes with ambient red glow',
          title: 'Comfortable Bio-Silicone Memory Mask with Deep 660nm Photon Emission'
        },
        {
          src: 'media/eyemask_slide_3.jpg',
          shopifySrc: 'media/eyemask_slide_3.jpg',
          alt: 'Clinical 4-in-1 Dual Chipset Diagram and Photon Coverage',
          title: '4-in-1 Dual Chipset Precision Wavelength Diagram'
        },
        {
          src: 'media/eyemask_slide_4.jpg',
          shopifySrc: 'media/eyemask_slide_4.jpg',
          alt: 'Soft-touch elastic strap with fast USB-C rechargeable magnetic dock',
          title: 'Universal Comfort Elastic Strap & USB-C Quick Recharge'
        }
      ],
      detailsHtml: `
        <h3 style="font-size: 22px; font-weight: 800; color: #183324; margin-top:0;">Zavelyn Red Light Eye Care Mask</h3>
        <p style="color: #667085; font-size: 14px; line-height: 1.6;">Engineered with precision medical-grade 660nm red photon LEDs designed specifically for the delicate periorbital zone around the eyes.</p>
        <div style="margin: 16px 0; display: flex; flex-direction: column; gap: 10px;">
          <div style="display:flex; gap:10px; font-size:13.5px; color:#344054;">
            <span style="color:#234E3E; font-weight:800;">✓</span>
            <span><strong>30 Dual-Chipset LEDs:</strong> Concentrated biological photon delivery soothing micro-vessels.</span>
          </div>
          <div style="display:flex; gap:10px; font-size:13.5px; color:#344054;">
            <span style="color:#234E3E; font-weight:800;">✓</span>
            <span><strong>Periorbital Collagen Activation:</strong> Targets crows feet, undereye puffiness, and fatigue bags.</span>
          </div>
          <div style="display:flex; gap:10px; font-size:13.5px; color:#344054;">
            <span style="color:#234E3E; font-weight:800;">✓</span>
            <span><strong>Zero Light-Leak Comfort Cushion:</strong> Soft memory silicone blackout rim for complete rest.</span>
          </div>
          <div style="display:flex; gap:10px; font-size:13.5px; color:#344054;">
            <span style="color:#234E3E; font-weight:800;">✓</span>
            <span><strong>10-Min Smart Auto-Timer:</strong> Effortless hands-free operation before bedtime.</span>
          </div>
        </div>
        <div style="background: #FAF6F3; border-radius: 12px; padding: 14px 18px; border: 1px solid #ECE3DD; margin-top: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size: 14px; color: #667085;">Shopify Live Verified Price:</span>
            <div>
              <strong style="font-size: 18px; color: #183324;">$89.99</strong>
              <s style="color:#98A2B3; margin-left:6px; font-size:13px;">$149.99</s>
              <span style="background:#FBF0ED; color:#A4493D; font-size:11px; font-weight:800; padding:3px 8px; border-radius:999px; margin-left:6px;">SAVE $60.00</span>
            </div>
          </div>
        </div>
      `
    },
    faceMask: {
      id: 15469512163513,
      variantId: 68033431240889,
      title: 'Zavelyn LED Red Light Face Mask',
      shortTitle: 'LED Face Mask',
      price: 129.99,
      comparePrice: 199.99,
      inventoryPolicy: 'deny',
      inventoryQuantity: 0,
      badge: 'AT-HOME RED LIGHT FACIAL',
      benefit: 'Full-face photon therapy delivering 630nm red wavelengths for radiant skin texture, clarity, and daily facial rejuvenation.',
      media: [
        {
          src: 'media/facemask_source_hd.jpg',
          shopifySrc: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/S83e211de0c344c90a968827469788b850_jpg_220x220q75_jpg.avif?v=1793197212',
          alt: 'Zavelyn LED Red Light Face Mask with Uniform Optical Net',
          title: 'Uniform Optical Net Full-Coverage Photonic Diodes'
        },
        {
          src: 'media/facemask_slide_2.jpg',
          shopifySrc: 'media/facemask_slide_2.jpg',
          alt: 'Close-up of ergonomic silicone face shield with integrated 360-degree eye comfort protection',
          title: '360° Facial Care Ergonomic Eye Protection Contouring'
        },
        {
          src: 'media/facemask_slide_3.jpg',
          shopifySrc: 'media/facemask_slide_3.jpg',
          alt: '7 Selectable Photon Color Spectrums: Red 630nm, Blue 470nm, Green 520nm, Yellow, Purple, Cyan, White',
          title: '7-Wavelength Bio-Light Therapy Spectrums'
        },
        {
          src: 'media/facemask_slide_4.jpg',
          shopifySrc: 'media/facemask_slide_4.jpg',
          alt: 'Compact handheld controller with 1-touch power and adjustable session intensities',
          title: 'Lightweight Integrated Battery & Smart Timer Module'
        }
      ],
      detailsHtml: `
        <h3 style="font-size: 22px; font-weight: 800; color: #183324; margin-top:0;">Zavelyn LED Red Light Face Mask</h3>
        <p style="color: #667085; font-size: 14px; line-height: 1.6;">Full-coverage facial photon therapy delivering optimal 630nm biological red wavelengths for a spa-grade at-home skincare ritual.</p>
        <div style="margin: 16px 0; display: flex; flex-direction: column; gap: 10px;">
          <div style="display:flex; gap:10px; font-size:13.5px; color:#344054;">
            <span style="color:#234E3E; font-weight:800;">✓</span>
            <span><strong>Uniform Optical Net Exposure:</strong> Even photonic distribution across forehead, cheeks, and chin.</span>
          </div>
          <div style="display:flex; gap:10px; font-size:13.5px; color:#344054;">
            <span style="color:#234E3E; font-weight:800;">✓</span>
            <span><strong>Multi-Spectrum Therapy:</strong> 7 therapeutic wavelengths for collagen, redness reduction, and blemish control.</span>
          </div>
          <div style="display:flex; gap:10px; font-size:13.5px; color:#344054;">
            <span style="color:#234E3E; font-weight:800;">✓</span>
            <span><strong>Food-Grade Bio-Silicone:</strong> Adapts comfortably to all facial contours without pinching.</span>
          </div>
          <div style="display:flex; gap:10px; font-size:13.5px; color:#344054;">
            <span style="color:#234E3E; font-weight:800;">✓</span>
            <span><strong>100% UV-Free & Eye Safe:</strong> Engineered with built-in silicone eye shielding.</span>
          </div>
        </div>
        <div style="background: #FAF6F3; border-radius: 12px; padding: 14px 18px; border: 1px solid #ECE3DD; margin-top: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size: 14px; color: #667085;">Shopify Live Verified Price:</span>
            <div>
              <strong style="font-size: 18px; color: #183324;">$129.99</strong>
              <s style="color:#98A2B3; margin-left:6px; font-size:13px;">$199.99</s>
              <span style="background:#FBF0ED; color:#A4493D; font-size:11px; font-weight:800; padding:3px 8px; border-radius:999px; margin-left:6px;">SAVE $70.00</span>
            </div>
          </div>
        </div>
      `
    }
  };

  // 2. REACTIVE STATE
  const state = {
    currentVersion: 'A', // 'A' (Cards) or 'B' (Rows)
    vfitQuantity: 1,      // Default 1, min 1
    addons: {
      eyeMask: false,
      faceMask: false
    },
    addonQuantities: {
      eyeMask: 1,
      faceMask: 1
    },
    galleries: {
      eyeMask: { activeIndex: 0 },
      faceMask: { activeIndex: 0 }
    }
  };

  function formatMoney(amount) {
    return '$' + amount.toFixed(2);
  }

  // 3. CORE CALCULATIONS & UI SYNCHRONIZATION
  function updateCalculations() {
    const qty = state.vfitQuantity;
    const vfitUnit = PRODUCTS.vfit.price;
    const vfitCompareUnit = PRODUCTS.vfit.comparePrice;

    const vfitTotal = vfitUnit * qty;
    const vfitCompareTotal = vfitCompareUnit * qty;

    const eyeQty = state.addonQuantities.eyeMask || 1;
    const faceQty = state.addonQuantities.faceMask || 1;

    let orderTotal = vfitTotal;
    let orderCompare = vfitCompareTotal;
    let selectedAddonCount = 0;
    let totalItems = qty;

    if (state.addons.eyeMask) {
      orderTotal += PRODUCTS.eyeMask.price * eyeQty;
      orderCompare += PRODUCTS.eyeMask.comparePrice * eyeQty;
      selectedAddonCount++;
      totalItems += eyeQty;
    }

    if (state.addons.faceMask) {
      orderTotal += PRODUCTS.faceMask.price * faceQty;
      orderCompare += PRODUCTS.faceMask.comparePrice * faceQty;
      selectedAddonCount++;
      totalItems += faceQty;
    }

    const orderSavings = orderCompare - orderTotal;

    // --- Update Buy Box Hero Pricing ---
    const buyboxPriceEl = document.getElementById('zvPriceCurrent');
    const buyboxCompareEl = document.getElementById('zvPriceCompare');
    const buyboxSaveEl = document.getElementById('zvPriceSave');
    const buy1PriceEl = document.getElementById('zvBuy1Price');
    const buy1CompareEl = document.getElementById('zvBuy1Compare');
    const vfitQtyDisplay = document.getElementById('vfitQtyDisplay');
    const vfitQtyMinus = document.getElementById('vfitQtyMinus');

    if (buyboxPriceEl) buyboxPriceEl.textContent = formatMoney(vfitTotal);
    if (buyboxCompareEl) buyboxCompareEl.textContent = formatMoney(vfitCompareTotal);
    if (buyboxSaveEl) {
      const savePercent = Math.round(((vfitCompareTotal - vfitTotal) / vfitCompareTotal) * 100);
      buyboxSaveEl.textContent = `SAVE ${formatMoney(vfitCompareTotal - vfitTotal)} (${savePercent}% OFF)`;
    }

    if (buy1PriceEl) buy1PriceEl.textContent = formatMoney(vfitTotal);
    if (buy1CompareEl) buy1CompareEl.textContent = formatMoney(vfitCompareTotal);
    if (vfitQtyDisplay) vfitQtyDisplay.textContent = qty;
    if (vfitQtyMinus) vfitQtyMinus.disabled = (qty <= 1);

    // --- Update Order Summary Box ---
    const summaryVfitName = document.getElementById('summaryVfitName');
    const summaryVfitPrice = document.getElementById('summaryVfitPrice');
    const summaryVfitQtyDisplay = document.getElementById('summaryVfitQtyDisplay');
    const summaryItemEye = document.getElementById('summaryItemEye');
    const summaryEyeName = document.getElementById('summaryEyeName');
    const summaryEyePrice = document.getElementById('summaryEyePrice');
    const summaryEyeQtyDisplay = document.getElementById('summaryEyeQtyDisplay');
    const displayCardQtyEye = document.getElementById('displayCardQtyEye');

    const summaryItemFace = document.getElementById('summaryItemFace');
    const summaryFaceName = document.getElementById('summaryFaceName');
    const summaryFacePrice = document.getElementById('summaryFacePrice');
    const summaryFaceQtyDisplay = document.getElementById('summaryFaceQtyDisplay');
    const displayCardQtyFace = document.getElementById('displayCardQtyFace');

    const summaryTierBadge = document.getElementById('summaryTierBadge');
    const summaryTotalPrice = document.getElementById('summaryTotalPrice');
    const summaryComparePrice = document.getElementById('summaryComparePrice');
    const summaryTotalSavings = document.getElementById('summaryTotalSavings');
    const packageCtaText = document.getElementById('packageCtaText');

    if (summaryVfitName) {
      summaryVfitName.textContent = `Zavelyn vFit™ Red Light Device × ${qty}`;
    }
    if (summaryVfitPrice) {
      summaryVfitPrice.textContent = formatMoney(vfitTotal);
    }
    if (summaryVfitQtyDisplay) {
      summaryVfitQtyDisplay.textContent = qty;
    }

    if (summaryItemEye) summaryItemEye.style.display = state.addons.eyeMask ? 'flex' : 'none';
    if (summaryEyeName) {
      summaryEyeName.textContent = `Zavelyn Red Light Eye Care Mask × ${eyeQty}`;
    }
    if (summaryEyePrice) {
      summaryEyePrice.textContent = formatMoney(PRODUCTS.eyeMask.price * eyeQty);
    }
    if (summaryEyeQtyDisplay) summaryEyeQtyDisplay.textContent = eyeQty;
    if (displayCardQtyEye) displayCardQtyEye.textContent = eyeQty;

    if (summaryItemFace) summaryItemFace.style.display = state.addons.faceMask ? 'flex' : 'none';
    if (summaryFaceName) {
      summaryFaceName.textContent = `Zavelyn LED Red Light Face Mask × ${faceQty}`;
    }
    if (summaryFacePrice) {
      summaryFacePrice.textContent = formatMoney(PRODUCTS.faceMask.price * faceQty);
    }
    if (summaryFaceQtyDisplay) summaryFaceQtyDisplay.textContent = faceQty;
    if (displayCardQtyFace) displayCardQtyFace.textContent = faceQty;

    if (summaryTierBadge) {
      if (selectedAddonCount === 0) {
        summaryTierBadge.textContent = qty > 1 ? `CORE WELLNESS (${qty} UNITS)` : 'CORE INTIMATE WELLNESS';
      } else if (selectedAddonCount === 1) {
        summaryTierBadge.textContent = state.addons.eyeMask 
          ? `DUO EYE & WELLNESS RITUAL (${totalItems} ITEMS)` 
          : `DUO FACIAL & WELLNESS RITUAL (${totalItems} ITEMS)`;
      } else {
        summaryTierBadge.textContent = `COMPLETE REJUVENATION SUITE (${totalItems} ITEMS)`;
      }
    }

    if (summaryTotalPrice) summaryTotalPrice.textContent = formatMoney(orderTotal);
    if (summaryComparePrice) summaryComparePrice.textContent = formatMoney(orderCompare);
    if (summaryTotalSavings) {
      summaryTotalSavings.textContent = `TOTAL SAVINGS VS. MSRP: ${formatMoney(orderSavings)} (BASED ON VERIFIED LIST PRICES)`;
    }

    if (packageCtaText) {
      if (selectedAddonCount === 0) {
        packageCtaText.textContent = qty > 1 
          ? `CLAIM ${qty}x vFIT UNITS — ${formatMoney(orderTotal)}`
          : `CLAIM YOUR vFIT DEVICE — ${formatMoney(orderTotal)}`;
      } else {
        packageCtaText.textContent = `CLAIM YOUR WELLNESS PACKAGE (${totalItems} ITEMS) — ${formatMoney(orderTotal)}`;
      }
    }

    // Sync Cards / Rows Active CSS States
    syncElementStates('eyeMask', state.addons.eyeMask);
    syncElementStates('faceMask', state.addons.faceMask);

    // Update Control Bar State
    const protoIndicator = document.getElementById('protoStateIndicator');
    if (protoIndicator) {
      let desc = `vFit × ${qty}`;
      if (state.addons.eyeMask) desc += ` + Eye Mask × ${eyeQty}`;
      if (state.addons.faceMask) desc += ` + Face Mask × ${faceQty}`;
      protoIndicator.innerHTML = `Current Selection: <strong>${desc} (${formatMoney(orderTotal)})</strong>`;
    }
  }

  function syncElementStates(key, isSelected) {
    const qty = state.addonQuantities[key] || 1;
    // Version A Card
    const card = document.querySelector(`.zv-addon-card[data-addon="${key}"]`);
    if (card) {
      if (isSelected) {
        card.classList.add('selected');
        const pill = card.querySelector('.zv-card-status-pill');
        if (pill) pill.innerHTML = qty > 1 ? `✓ ${qty} ADDED` : '✓ ADDED';
      } else {
        card.classList.remove('selected');
        const pill = card.querySelector('.zv-card-status-pill');
        if (pill) pill.innerHTML = '+ ADD TO ORDER';
      }
    }

    // Version B Row
    const row = document.querySelector(`.zv-addon-row[data-addon="${key}"]`);
    if (row) {
      if (isSelected) {
        row.classList.add('selected');
        const btn = row.querySelector('.zv-row-btn');
        if (btn) btn.innerHTML = qty > 1 ? `✓ ${qty} ADDED TO ORDER` : '✓ ADDED TO ORDER';
      } else {
        row.classList.remove('selected');
        const btn = row.querySelector('.zv-row-btn');
        if (btn) btn.innerHTML = '+ ADD TO ORDER';
      }
    }
  }

  // 4. QUANTITY CONTROLS
  function changeQuantity(delta) {
    const newQty = state.vfitQuantity + delta;
    if (newQty >= 1 && newQty <= 10) {
      state.vfitQuantity = newQty;
      updateCalculations();
    }
  }

  // Multi-quantity for Addons
  function changeAddonQty(key, delta) {
    if (!state.addons[key]) {
      state.addons[key] = true;
      state.addonQuantities[key] = 1;
    } else {
      const cur = state.addonQuantities[key] || 1;
      const next = cur + delta;
      if (next <= 0) {
        state.addons[key] = false;
        state.addonQuantities[key] = 1;
      } else if (next <= 10) {
        state.addonQuantities[key] = next;
      }
    }
    updateCalculations();
  }

  // 5. TOGGLE ADDON SELECTION
  function toggleAddon(key) {
    state.addons[key] = !state.addons[key];
    if (state.addons[key] && (!state.addonQuantities[key] || state.addonQuantities[key] < 1)) {
      state.addonQuantities[key] = 1;
    }
    updateCalculations();
  }

  // 6. INDEPENDENT GALLERY LOGIC
  function updateGalleryUI(productKey) {
    const prod = PRODUCTS[productKey];
    if (!prod || !prod.media) return;

    const gState = state.galleries[productKey];
    const activeIdx = gState.activeIndex;

    // Both Version A and Version B galleries for this productKey
    const galleryWraps = document.querySelectorAll(`.zv-gallery-wrap[data-gallery="${productKey}"]`);

    galleryWraps.forEach(wrap => {
      const slider = wrap.querySelector('.zv-gallery-slider');
      if (slider) {
        slider.style.transform = `translateX(-${activeIdx * 100}%)`;
      }

      // Update dots
      const dots = wrap.querySelectorAll('.zv-gallery-dot');
      dots.forEach((dot, idx) => {
        if (idx === activeIdx) dot.classList.add('active');
        else dot.classList.remove('active');
      });

      // Update thumbnails
      const thumbs = wrap.querySelectorAll('.zv-thumb-item');
      thumbs.forEach((th, idx) => {
        if (idx === activeIdx) th.classList.add('active');
        else th.classList.remove('active');
      });
    });
  }

  function nextSlide(productKey) {
    const prod = PRODUCTS[productKey];
    if (!prod || !prod.media) return;
    const gState = state.galleries[productKey];
    gState.activeIndex = (gState.activeIndex + 1) % prod.media.length;
    updateGalleryUI(productKey);
  }

  function prevSlide(productKey) {
    const prod = PRODUCTS[productKey];
    if (!prod || !prod.media) return;
    const gState = state.galleries[productKey];
    gState.activeIndex = (gState.activeIndex - 1 + prod.media.length) % prod.media.length;
    updateGalleryUI(productKey);
  }

  function setSlide(productKey, index) {
    const prod = PRODUCTS[productKey];
    if (!prod || !prod.media || index < 0 || index >= prod.media.length) return;
    state.galleries[productKey].activeIndex = index;
    updateGalleryUI(productKey);
  }

  // 7. LIGHTBOX MODAL
  function openLightbox(productKey) {
    const modal = document.getElementById('zvDetailsModal');
    const content = document.getElementById('zvModalContent');
    const prod = PRODUCTS[productKey];
    if (!modal || !content || !prod) return;

    const activeIdx = state.galleries[productKey].activeIndex;
    const activeMedia = prod.media[activeIdx] || prod.media[0];

    content.innerHTML = `
      <div style="margin-bottom: 20px;">
        <div class="zv-modal-gallery">
          <img src="${activeMedia.src}" alt="${activeMedia.alt}" id="modalLightboxImg">
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-size:12px; font-weight:800; color:#234E3E; background:#EAF4EE; padding:4px 10px; border-radius:999px;">
            ${prod.badge}
          </span>
          <span style="font-size:12px; color:#667085;">Image ${activeIdx + 1} of ${prod.media.length}</span>
        </div>
        <h4 style="font-size:15px; font-weight:800; color:#183324; margin:0 0 16px;">${activeMedia.title}</h4>
        
        <div class="zv-thumbs-strip" style="justify-content:center; margin-bottom:20px;">
          ${prod.media.map((m, i) => `
            <div class="zv-thumb-item ${i === activeIdx ? 'active' : ''}" onclick="window.ZavelynUpsellProto.setModalSlide('${productKey}', ${i})">
              <img src="${m.src}" alt="${m.alt}">
            </div>
          `).join('')}
        </div>
      </div>
      ${prod.detailsHtml}
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function setModalSlide(productKey, idx) {
    setSlide(productKey, idx);
    const prod = PRODUCTS[productKey];
    const imgEl = document.getElementById('modalLightboxImg');
    if (imgEl && prod?.media?.[idx]) {
      imgEl.src = prod.media[idx].src;
    }
    const thumbs = document.querySelectorAll('#zvModalContent .zv-thumb-item');
    thumbs.forEach((th, i) => {
      if (i === idx) th.classList.add('active');
      else th.classList.remove('active');
    });
  }

  function closeLightbox() {
    const modal = document.getElementById('zvDetailsModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // 8. VERSION SWITCHER
  function switchVersion(ver) {
    state.currentVersion = ver;
    const viewA = document.getElementById('viewVersionA');
    const viewB = document.getElementById('viewVersionB');
    const btnA = document.getElementById('btnSwitchA');
    const btnB = document.getElementById('btnSwitchB');

    if (ver === 'A') {
      if (viewA) viewA.style.display = 'grid';
      if (viewB) viewB.style.display = 'none';
      if (btnA) btnA.classList.add('active');
      if (btnB) btnB.classList.remove('active');
    } else {
      if (viewA) viewA.style.display = 'none';
      if (viewB) viewB.style.display = 'flex';
      if (btnA) btnA.classList.remove('active');
      if (btnB) btnB.classList.add('active');
    }
  }

  // 9. SIMULATE CART API DISPATCH
  function showCheckoutSimulation() {
    const toast = document.getElementById('zvCheckoutToast');
    const toastContent = document.getElementById('zvToastContent');
    if (!toast || !toastContent) return;

    const items = [
      {
        id: PRODUCTS.vfit.variantId,
        title: PRODUCTS.vfit.title,
        quantity: state.vfitQuantity,
        price: PRODUCTS.vfit.price,
        itemTotal: PRODUCTS.vfit.price * state.vfitQuantity
      }
    ];

    if (state.addons.eyeMask) {
      const eyeQty = state.addonQuantities.eyeMask || 1;
      items.push({
        id: PRODUCTS.eyeMask.variantId,
        title: PRODUCTS.eyeMask.title,
        quantity: eyeQty,
        price: PRODUCTS.eyeMask.price,
        itemTotal: PRODUCTS.eyeMask.price * eyeQty
      });
    }

    if (state.addons.faceMask) {
      const faceQty = state.addonQuantities.faceMask || 1;
      items.push({
        id: PRODUCTS.faceMask.variantId,
        title: PRODUCTS.faceMask.title,
        quantity: faceQty,
        price: PRODUCTS.faceMask.price,
        itemTotal: PRODUCTS.faceMask.price * faceQty
      });
    }

    const grandTotal = items.reduce((sum, it) => sum + it.itemTotal, 0);

    toastContent.innerHTML = `
      <strong style="color: #10B981; display: block; margin-bottom: 6px; font-size: 14px;">
        ✓ Shopify Cart API Payload Formed
      </strong>
      <div style="font-size: 12.5px; line-height: 1.5; color: #E2E8F0;">
        Dispatching ${items.length} line item(s) to <code>/cart/add.js</code>:<br>
        ${items.map(it => `• <strong>${it.title}</strong> × ${it.quantity} (Variant ID: <code>${it.id}</code>) — $${it.itemTotal.toFixed(2)}`).join('<br>')}
        <div style="margin-top: 8px; font-weight: 800; color: #FFFFFF; font-size: 14px;">Order Subtotal: $${grandTotal.toFixed(2)}</div>
        <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">(Local Prototype Simulation — Verified Live Variant IDs)</div>
      </div>
    `;

    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 7000);
  }

  // 10. SETUP EVENT LISTENERS ON DOM LOAD
  document.addEventListener('DOMContentLoaded', function() {
    // Version Buttons
    const btnA = document.getElementById('btnSwitchA');
    const btnB = document.getElementById('btnSwitchB');
    if (btnA) btnA.addEventListener('click', () => switchVersion('A'));
    if (btnB) btnB.addEventListener('click', () => switchVersion('B'));

    // Quantity Buttons
    const minusBtn = document.getElementById('vfitQtyMinus');
    const plusBtn = document.getElementById('vfitQtyPlus');
    if (minusBtn) minusBtn.addEventListener('click', (e) => { e.stopPropagation(); changeQuantity(-1); });
    if (plusBtn) plusBtn.addEventListener('click', (e) => { e.stopPropagation(); changeQuantity(1); });

    // Card Clicks (Version A)
    document.querySelectorAll('.zv-addon-card').forEach(card => {
      card.addEventListener('click', function(e) {
        if (e.target.closest('.zv-gallery-arrow') || 
            e.target.closest('.zv-thumb-item') || 
            e.target.closest('.zv-gallery-zoom-btn') || 
            e.target.closest('.zv-link-details')) {
          return;
        }
        const key = this.getAttribute('data-addon');
        if (key) toggleAddon(key);
      });
    });

    // Row Clicks (Version B)
    document.querySelectorAll('.zv-addon-row').forEach(row => {
      row.addEventListener('click', function(e) {
        if (e.target.closest('.zv-gallery-arrow') || 
            e.target.closest('.zv-thumb-item') || 
            e.target.closest('.zv-gallery-zoom-btn') || 
            e.target.closest('.zv-link-details')) {
          return;
        }
        const key = this.getAttribute('data-addon');
        if (key) toggleAddon(key);
      });
    });

    // View Details Links
    document.querySelectorAll('.zv-link-details').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const key = this.getAttribute('data-addon');
        if (key) openLightbox(key);
      });
    });

    // Gallery Arrows & Zoom
    document.querySelectorAll('.zv-gallery-arrow.zv-gallery-prev').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const key = this.getAttribute('data-gallery-target');
        if (key) prevSlide(key);
      });
    });

    document.querySelectorAll('.zv-gallery-arrow.zv-gallery-next').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const key = this.getAttribute('data-gallery-target');
        if (key) nextSlide(key);
      });
    });

    document.querySelectorAll('.zv-gallery-zoom-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const key = this.getAttribute('data-gallery-target');
        if (key) openLightbox(key);
      });
    });

    // Thumbnails Click
    document.querySelectorAll('.zv-thumb-item').forEach(th => {
      th.addEventListener('click', function(e) {
        e.stopPropagation();
        const key = this.getAttribute('data-gallery-target');
        const idx = parseInt(this.getAttribute('data-slide-index'), 10);
        if (key && !isNaN(idx)) setSlide(key, idx);
      });
    });

    // Mobile Touch Swipe Handling
    document.querySelectorAll('.zv-gallery-viewport').forEach(viewport => {
      let touchStartX = 0;
      let touchEndX = 0;
      viewport.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      viewport.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const key = viewport.closest('.zv-gallery-wrap')?.getAttribute('data-gallery');
        if (key) {
          if (touchStartX - touchEndX > 40) nextSlide(key);
          else if (touchEndX - touchStartX > 40) prevSlide(key);
        }
      }, { passive: true });
    });

    // Modal Close
    const modalClose = document.getElementById('zvModalClose');
    const modalBackdrop = document.getElementById('zvDetailsModal');
    if (modalClose) modalClose.addEventListener('click', closeLightbox);
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });

    // CTA
    const ctaBtn = document.getElementById('packageCtaBtn');
    if (ctaBtn) ctaBtn.addEventListener('click', showCheckoutSimulation);

    // Initial Sync
    updateCalculations();
    updateGalleryUI('eyeMask');
    updateGalleryUI('faceMask');
  });

  // Global API for Automated QA & Tests
  window.ZavelynUpsellProto = {
    state,
    PRODUCTS,
    changeQuantity,
    changeAddonQty,
    toggleAddon,
    switchVersion,
    nextSlide,
    prevSlide,
    setSlide,
    openLightbox,
    closeLightbox,
    setModalSlide,
    showCheckoutSimulation,
    updateCalculations
  };
})();
