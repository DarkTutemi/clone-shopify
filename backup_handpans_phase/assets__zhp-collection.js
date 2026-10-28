
document.addEventListener('DOMContentLoaded', function() {
  // Audio Player Functionality
  const audioPlayers = document.querySelectorAll('.zhp-audio-player');
  let currentAudio = null;
  let currentButton = null;
  let currentProgress = null;

  audioPlayers.forEach(player => {
    const src = player.getAttribute('data-audio-src');
    if (!src) return;
    const btn = player.querySelector('.zhp-audio-btn');
    const playIcon = player.querySelector('.zhp-icon-play');
    const pauseIcon = player.querySelector('.zhp-icon-pause');
    const progressBar = player.querySelector('.zhp-audio-progress');

    const audio = new Audio(src);

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentButton) {
          currentButton.querySelector('.zhp-icon-play').style.display = 'block';
          currentButton.querySelector('.zhp-icon-pause').style.display = 'none';
        }
        if (currentProgress) {
          currentProgress.style.width = '0%';
        }
      }

      if (audio.paused) {
        audio.play().then(() => {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
          currentAudio = audio;
          currentButton = btn;
          currentProgress = progressBar;
        }).catch(err => console.log('Audio autoplay blocked', err));
      } else {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    });

    audio.addEventListener('timeupdate', function() {
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = pct + '%';
      }
    });

    audio.addEventListener('ended', function() {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      progressBar.style.width = '0%';
    });
  });

  // Model Tabs Switcher
  const tabButtons = document.querySelectorAll('.zhp-tab-btn');
  const tabPanels = document.querySelectorAll('.zhp-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.zhp-faq-question');
  faqQuestions.forEach(q => {
    q.addEventListener('click', function() {
      const item = this.closest('.zhp-faq-item');
      item.classList.toggle('active');
    });
  });
});
