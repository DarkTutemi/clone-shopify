/* ==========================================================================
   ZAVELYN ELIXIR V2 — HANDPANS COLLECTION JAVASCRIPT
   Features: Audio preview player, FAQ Accordion, Smooth anchor scrolls
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // 1. FAQ Accordion
  const faqItems = document.querySelectorAll('.zhp-faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.zhp-faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // 2. Audio Player Preview
  let currentAudio = null;
  let currentBtn = null;
  let currentProgress = null;

  const audioBoxes = document.querySelectorAll('.zhp-audio-box');
  audioBoxes.forEach(box => {
    const btn = box.querySelector('.zhp-audio-btn');
    const audioSrc = box.getAttribute('data-audio-src');
    const progressBar = box.querySelector('.zhp-audio-progress');
    if (!btn || !audioSrc) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // If already playing this one, toggle pause
      if (currentAudio && currentBtn === btn) {
        if (currentAudio.paused) {
          currentAudio.play();
          togglePlayIcons(btn, true);
        } else {
          currentAudio.pause();
          togglePlayIcons(btn, false);
        }
        return;
      }

      // Stop previous
      if (currentAudio) {
        currentAudio.pause();
        if (currentBtn) togglePlayIcons(currentBtn, false);
        if (currentProgress) currentProgress.style.width = '0%';
      }

      // Start new
      const audio = new Audio(audioSrc);
      currentAudio = audio;
      currentBtn = btn;
      currentProgress = progressBar;

      togglePlayIcons(btn, true);
      audio.play().catch(err => {
        console.warn('Audio play prevented:', err);
        togglePlayIcons(btn, false);
      });

      audio.addEventListener('timeupdate', () => {
        if (progressBar && audio.duration) {
          const pct = (audio.currentTime / audio.duration) * 100;
          progressBar.style.width = pct + '%';
        }
      });

      audio.addEventListener('ended', () => {
        togglePlayIcons(btn, false);
        if (progressBar) progressBar.style.width = '0%';
        currentAudio = null;
      });
    });
  });

  function togglePlayIcons(btn, isPlaying) {
    const playIcon = btn.querySelector('.zhp-icon-play');
    const pauseIcon = btn.querySelector('.zhp-icon-pause');
    if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
    if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
  }
});
