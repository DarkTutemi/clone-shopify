import fs from 'fs';
import path from 'path';

const THEME_DIR = 'h:/Shopify-Clone/Clone-earthlyderm';
const SECTIONS_DIR = path.join(THEME_DIR, 'sections');
const TEMPLATES_DIR = path.join(THEME_DIR, 'templates');
const SNIPPETS_DIR = path.join(THEME_DIR, 'snippets');

[SECTIONS_DIR, TEMPLATES_DIR, SNIPPETS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. earthly-announcement-bar.liquid
const announcementBarLiquid = `
{% schema %}
{
  "name": "Earthly Announcement Bar",
  "settings": [
    {
      "type": "text",
      "id": "text",
      "label": "Announcement Text",
      "default": "BLACK MONTH SALE IS LIVE"
    }
  ]
}
{% endschema %}

<div class="vs-announcement-bar" style="background-color: #000000; color: #ffffff;">
  <div class="vs-announcements">
    <div class="vs-announcement">
      {{ section.settings.text }}
    </div>
    <div class="vs-countdown-timer" id="earthlyHeaderTimer">
      <div class="vs-time-block vs-days">
        <span class="vs-time-value" id="earthly-days">00</span>
        <span class="vs-time-label">DAYS</span>
      </div>
      <div class="vs-time-block vs-hours">
        <span class="vs-time-value" id="earthly-hours">09</span>
        <span class="vs-time-label">HRS</span>
      </div>
      <div class="vs-time-block vs-minutes">
        <span class="vs-time-value" id="earthly-minutes">39</span>
        <span class="vs-time-label">MIN</span>
      </div>
      <div class="vs-time-block vs-seconds">
        <span class="vs-time-value" id="earthly-seconds">12</span>
        <span class="vs-time-label">SEC</span>
      </div>
    </div>
  </div>
</div>

<style>
.vs-announcement-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 6px 15px;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background-color: #000000;
  color: #ffffff;
}
.vs-announcements {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}
.vs-countdown-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  gap: 4px;
}
.vs-time-block {
  text-align: center;
  width: 32px;
  height: 32px;
  background: #2C5801;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.vs-time-value {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
}
.vs-time-label {
  font-size: 8px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 1px;
}
</style>

<script>
(function() {
  function startHeaderTimer() {
    let totalSec = 9 * 3600 + 39 * 60 + 12;
    setInterval(function() {
      if (totalSec > 0) totalSec--;
      var h = Math.floor(totalSec / 3600);
      var m = Math.floor((totalSec % 3600) / 60);
      var s = totalSec % 60;
      var hEl = document.getElementById('earthly-hours');
      var mEl = document.getElementById('earthly-minutes');
      var sEl = document.getElementById('earthly-seconds');
      if (hEl) hEl.textContent = h < 10 ? '0' + h : h;
      if (mEl) mEl.textContent = m < 10 ? '0' + m : m;
      if (sEl) sEl.textContent = s < 10 ? '0' + s : s;
    }, 1000);
  }
  startHeaderTimer();
})();
</script>
`;

fs.writeFileSync(path.join(SECTIONS_DIR, 'earthly-announcement-bar.liquid'), announcementBarLiquid.trim(), 'utf8');
console.log('✔ Wrote sections/earthly-announcement-bar.liquid');
