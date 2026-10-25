import fs from 'fs';

const slidesData = JSON.parse(fs.readFileSync('Clone-thoson/data/extracted_slides.json', 'utf-8'));

// Format thumbnails HTML
const thumbsHtml = slidesData.map((s, i) => `
  <div class="thoson-thumb-card ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="thosonSelectSlide(${i})" title="View slide ${i + 1}">
    <img src="${s.thumb}" alt="Slide thumbnail ${i + 1}" loading="lazy">
    ${s.type === 'video' ? `
      <div class="thoson-thumb-video-icon">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      </div>
    ` : ''}
  </div>
`).join('');

const galleryHtml = `
<div class="product product--medium product--left grid grid--1-col grid--2-col-tablet">
  <div class="grid__item product__media-wrapper product__column-sticky">
    <div class="thoson-gallery-container" id="thosonGallery">
      <!-- Main Stage -->
      <div class="thoson-main-stage" id="thosonMainStage">
        <div class="thoson-main-media-wrap" id="thosonMediaWrap">
          <img id="thosonActiveImg" src="${slidesData[0].src}" alt="Zavelyn® MagTrack™" class="thoson-active-media" loading="eager">
          <video id="thosonActiveVideo" class="thoson-active-media" controls playsinline style="display: none;"></video>
        </div>

        <!-- Skip Buttons (Previous < and Next >) -->
        <button type="button" class="thoson-nav-btn thoson-prev-btn" id="thosonPrevBtn" aria-label="Previous image" onclick="thosonPrevSlide(event)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button type="button" class="thoson-nav-btn thoson-next-btn" id="thosonNextBtn" aria-label="Next image" onclick="thosonNextSlide(event)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- Slide Index Pill Badge -->
        <div class="thoson-slide-badge" id="thosonSlideBadge">1 / ${slidesData.length}</div>
      </div>

      <!-- Horizontal Thumbnails Strip -->
      <div class="thoson-thumbs-carousel" id="thosonThumbsCarousel">
        ${thumbsHtml}
      </div>
    </div>

    <style>
      .thoson-gallery-container {
        width: 100%;
        position: relative;
        user-select: none;
      }
      .thoson-main-stage {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        background-color: #faf7f4;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        border: 1px solid #e7e4df;
      }
      .thoson-main-media-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .thoson-active-media {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: opacity 0.22s ease;
      }
      .thoson-nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
        color: #231f20;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        padding: 0;
        transition: transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
      }
      .thoson-nav-btn:hover {
        background: #ffffff;
        transform: translateY(-50%) scale(1.08);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.24);
      }
      .thoson-nav-btn:active {
        transform: translateY(-50%) scale(0.95);
      }
      .thoson-prev-btn {
        left: 14px;
      }
      .thoson-next-btn {
        right: 14px;
      }
      @media (max-width: 640px) {
        .thoson-nav-btn {
          width: 38px;
          height: 38px;
        }
        .thoson-prev-btn { left: 10px; }
        .thoson-next-btn { right: 10px; }
      }
      .thoson-slide-badge {
        position: absolute;
        bottom: 12px;
        right: 14px;
        background: rgba(35, 31, 32, 0.72);
        backdrop-filter: blur(4px);
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 20px;
        letter-spacing: 0.5px;
        z-index: 5;
        pointer-events: none;
      }
      .thoson-thumbs-carousel {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        margin-top: 14px;
        padding: 4px 2px 8px 2px;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .thoson-thumbs-carousel::-webkit-scrollbar {
        display: none;
      }
      .thoson-thumb-card {
        width: 76px;
        height: 76px;
        flex-shrink: 0;
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        border: 2.5px solid transparent;
        background: #f7f4ee;
        opacity: 0.65;
        transition: opacity 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        box-sizing: border-box;
      }
      .thoson-thumb-card:hover {
        opacity: 0.95;
      }
      .thoson-thumb-card.active {
        opacity: 1;
        border-color: #231f20;
        transform: scale(1.02);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
      }
      .thoson-thumb-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .thoson-thumb-video-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.65);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
      }
      @media (max-width: 640px) {
        .thoson-thumb-card {
          width: 64px;
          height: 64px;
          border-radius: 10px;
        }
      }
    </style>

    <script>
      (function() {
        window.THOSON_SLIDES = ${JSON.stringify(slidesData)};
        let thosonCurrentIndex = 0;

        window.thosonSelectSlide = function(index) {
          if (index < 0 || index >= window.THOSON_SLIDES.length) return;
          thosonCurrentIndex = index;
          const slide = window.THOSON_SLIDES[index];

          const imgEl = document.getElementById('thosonActiveImg');
          const videoEl = document.getElementById('thosonActiveVideo');
          const badgeEl = document.getElementById('thosonSlideBadge');

          if (slide.type === 'video') {
            if (imgEl) imgEl.style.display = 'none';
            if (videoEl) {
              videoEl.style.display = 'block';
              videoEl.poster = slide.poster;
              videoEl.src = slide.src;
              videoEl.load();
            }
          } else {
            if (videoEl) {
              videoEl.pause();
              videoEl.style.display = 'none';
            }
            if (imgEl) {
              imgEl.style.display = 'block';
              imgEl.src = slide.src;
            }
          }

          if (badgeEl) {
            badgeEl.textContent = (index + 1) + ' / ' + window.THOSON_SLIDES.length;
          }

          const thumbs = document.querySelectorAll('.thoson-thumb-card');
          thumbs.forEach(function(t, i) {
            if (i === index) {
              t.classList.add('active');
              t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } else {
              t.classList.remove('active');
            }
          });
        };

        window.thosonPrevSlide = function(e) {
          if (e) e.stopPropagation();
          var next = thosonCurrentIndex - 1;
          if (next < 0) next = window.THOSON_SLIDES.length - 1;
          window.thosonSelectSlide(next);
        };

        window.thosonNextSlide = function(e) {
          if (e) e.stopPropagation();
          var next = thosonCurrentIndex + 1;
          if (next >= window.THOSON_SLIDES.length) next = 0;
          window.thosonSelectSlide(next);
        };

        document.addEventListener('DOMContentLoaded', function() {
          var stage = document.getElementById('thosonMainStage');
          if (stage) {
            var startX = 0, startY = 0;
            stage.addEventListener('touchstart', function(e) {
              startX = e.changedTouches[0].clientX;
              startY = e.changedTouches[0].clientY;
            }, { passive: true });

            stage.addEventListener('touchend', function(e) {
              var diffX = e.changedTouches[0].clientX - startX;
              var diffY = e.changedTouches[0].clientY - startY;
              if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < 0) {
                  window.thosonNextSlide();
                } else {
                  window.thosonPrevSlide();
                }
              }
            }, { passive: true });
          }
        });
      })();
    </script>
  </div>
`;

// Read original hero
const heroContent = fs.readFileSync('Clone-thoson/theme/snippets/thoson-hero.liquid', 'utf-8');

// Find boundary
const startTarget = '<div class="product product--medium product--left product--stacked grid grid--1-col grid--2-col-tablet">';
const endTarget = '<div class="product__info-wrapper grid__item product__column-sticky product__info-wrapper--top-padding">';

const startIndex = heroContent.indexOf(startTarget);
const endIndex = heroContent.indexOf(endTarget);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find gallery boundaries in thoson-hero.liquid!');
  process.exit(1);
}

let newHeroContent = heroContent.slice(0, startIndex) + galleryHtml + '\n    ' + heroContent.slice(endIndex);

// Also sync Thoson MagTrack™ title in hero to Zavelyn® MagTrack™
newHeroContent = newHeroContent.replace(/<h1 class="h1">\s*Thoson MagTrack™\s*<\/h1>/g, '<h1 class="h1">Zavelyn® MagTrack™</h1>');
newHeroContent = newHeroContent.replace(/<h2 class="h1">\s*Thoson MagTrack™\s*<\/h2>/g, '<h2 class="h1">Zavelyn® MagTrack™</h2>');

fs.writeFileSync('Clone-thoson/theme/snippets/thoson-hero.liquid', newHeroContent, 'utf-8');
console.log('✔ Successfully rebuilt thoson-hero.liquid with modern skip gallery and thumbnail carousel!');
