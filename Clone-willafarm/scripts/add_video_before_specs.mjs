import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) console.log(`  ✔ Uploaded: ${key}`);
  else console.error(`  ✗ Failed: ${key}`, JSON.stringify(data.errors || data));
}

const VIDEO_SECTION_HTML = `
  <!-- SECTION: Live Video Demonstration (Placed directly before Specs section) -->
  <section class="wf-section wf-video-demo-section" id="wf-video-demo">
    <div class="wf-container">
      <div class="wf-video-card">
        <div class="wf-video-grid">
          <div class="wf-video-col">
            <div class="wf-video-wrapper">
              <video 
                id="wf-demo-video"
                src="{{ section.settings.demo_video_url | default: 'https://cdn.shopify.com/videos/c/o/v/36e6827c74c8462a97206412365d61b5.mp4' }}" 
                autoplay 
                muted 
                loop 
                playsinline 
                controls
                preload="metadata"
                poster="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-livestock-warmth.jpg?v=1792853604"
                class="wf-video-element">
              </video>
              <div class="wf-video-tag">
                <span class="wf-video-pulse"></span>
                <span>REAL HOMESTEAD DEMO</span>
              </div>
            </div>
          </div>
          
          <div class="wf-video-content-col">
            <span class="wf-eyebrow-pill">SEE IT IN ACTION &bull; WINTER COOP DEMO</span>
            <h2 class="wf-video-title">Instant Winter Warmth for Your Little Ones</h2>
            <div class="wf-video-desc">
              <p>
                When freezing winter chills sweep into your barn or shed, newborn chicks, ducklings, and small livestock are at their most vulnerable. As demonstrated in this real homestead walkthrough, dangerous old-school 250W clamp heat lamps pose severe fire hazards on dry hay and create aggressive nocturnal glare.
              </p>
              <p>
                With the <strong>Zavelyn® Intelligent Livestock Heating Lamp</strong>, setting up safe, lifesaving warmth takes under 60 seconds. Simply screw into any standard socket or hang with the included heavy-duty switch cord, dial in your target temperature on the digital LED thermostat, and watch your baby flock gather comfortably under gentle, even warmth.
              </p>
            </div>
            
            <div class="wf-video-highlights">
              <div class="wf-video-highlight-item">
                <span class="wf-vh-icon">❄️</span>
                <div>
                  <strong>Freeze-Proof Protection</strong>
                  <span>Maintains exact brooder warmth even in harsh sub-zero temperatures</span>
                </div>
              </div>
              <div class="wf-video-highlight-item">
                <span class="wf-vh-icon">⏱️</span>
                <div>
                  <strong>Zero-Tool 60s Setup</strong>
                  <span>Standard E26/E27 screw base with plug-and-play toggle switch cord</span>
                </div>
              </div>
              <div class="wf-video-highlight-item">
                <span class="wf-vh-icon">🐣</span>
                <div>
                  <strong>Gentle Ambient Glow</strong>
                  <span>Zero blinding red glare, preventing nocturnal stress &amp; feather pecking</span>
                </div>
              </div>
            </div>

            <div class="wf-video-cta-wrap">
              <a href="#fn-offer" class="wf-video-jump-btn" onclick="document.querySelector('.wf-buybox-col').scrollIntoView({behavior: 'smooth'}); return false;">
                CLAIM 50% OFF TODAY &bull; SHOP PACKAGES &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const VIDEO_SECTION_CSS = `
  /* --- VIDEO DEMONSTRATION SECTION --- */
  .wf-video-demo-section {
    background: #faf7f4;
    padding: 60px 0;
    border-top: 1px solid var(--wf-border, #e6ded6);
  }
  .wf-video-card {
    background: #ffffff;
    border: 1px solid var(--wf-border, #e6ded6);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 8px 32px rgba(59, 43, 47, 0.05);
  }
  .wf-video-grid {
    display: grid;
    grid-template-columns: 1fr 1.15fr;
    gap: 40px;
    align-items: center;
  }
  .wf-video-col {
    position: relative;
  }
  .wf-video-wrapper {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: #111;
    border: 1px solid rgba(0, 0, 0, 0.08);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    aspect-ratio: 1 / 1;
  }
  .wf-video-element {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .wf-video-tag {
    position: absolute;
    top: 14px;
    left: 14px;
    background: rgba(31, 27, 28, 0.88);
    color: #ffffff;
    backdrop-filter: blur(4px);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.8px;
    padding: 6px 14px;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    z-index: 2;
  }
  .wf-video-pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e53935;
    animation: wfPulse 1.8s infinite;
  }
  @keyframes wfPulse {
    0% { transform: scale(0.95); opacity: 1; box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.7); }
    70% { transform: scale(1.1); opacity: 0.8; box-shadow: 0 0 0 8px rgba(229, 57, 53, 0); }
    100% { transform: scale(0.95); opacity: 1; box-shadow: 0 0 0 0 rgba(229, 57, 53, 0); }
  }
  .wf-video-title {
    font-family: var(--wf-font-heading, inherit);
    font-size: 28px;
    font-weight: 800;
    color: #231f20;
    line-height: 1.25;
    margin: 12px 0 16px 0;
  }
  .wf-video-desc p {
    font-size: 14.5px;
    line-height: 1.65;
    color: #554a48;
    margin: 0 0 14px 0;
  }
  .wf-video-highlights {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 20px 0 24px 0;
    padding-top: 18px;
    border-top: 1px solid #f0eae4;
  }
  .wf-video-highlight-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .wf-vh-icon {
    font-size: 18px;
    line-height: 1.3;
  }
  .wf-video-highlight-item strong {
    display: block;
    font-size: 14px;
    color: #231f20;
    font-weight: 700;
    margin-bottom: 2px;
  }
  .wf-video-highlight-item span {
    font-size: 12.5px;
    color: #6d6260;
    line-height: 1.4;
  }
  .wf-video-cta-wrap {
    margin-top: 8px;
  }
  .wf-video-jump-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 28px;
    background: #8a2c13;
    color: #ffffff;
    font-size: 13.5px;
    font-weight: 800;
    letter-spacing: 0.6px;
    border-radius: 9999px;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(138, 44, 19, 0.25);
    transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  }
  .wf-video-jump-btn:hover {
    background: #71230e;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(138, 44, 19, 0.35);
  }

  @media (max-width: 991px) {
    .wf-video-grid {
      grid-template-columns: 1fr;
      gap: 28px;
    }
    .wf-video-card {
      padding: 24px 20px;
    }
  }
`;

async function run() {
  console.log('--- Adding Product Video Section Before Specs Section ---');
  let code = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  // 1. Insert Video section HTML before Specs section
  const specsTarget = '<!-- SECTION 3C: Specifications at a Glance -->';
  if (code.includes(specsTarget) && !code.includes('wf-video-demo-section')) {
    code = code.replace(specsTarget, VIDEO_SECTION_HTML + '\n\n  ' + specsTarget);
    console.log('  ✔ Inserted Video Section HTML before Specs Section');
  } else if (!code.includes('wf-video-demo-section')) {
    const fallbackSpecsTarget = '<section class="wf-section wf-specs-section">';
    code = code.replace(fallbackSpecsTarget, VIDEO_SECTION_HTML + '\n\n  ' + fallbackSpecsTarget);
    console.log('  ✔ Inserted Video Section HTML before <section class="wf-section wf-specs-section">');
  }

  // 2. Append CSS before </style>
  if (!code.includes('.wf-video-demo-section')) {
    code = code.replace('</style>', VIDEO_SECTION_CSS + '\n</style>');
    console.log('  ✔ Injected Video Section CSS');
  }

  // 3. Add demo_video_url to settings schema if not present
  if (!code.includes('"demo_video_url"')) {
    code = code.replace(
      /"settings":\s*\[/,
      `"settings": [
    {
      "type": "text",
      "id": "demo_video_url",
      "label": "Demo Video URL",
      "default": "https://cdn.shopify.com/videos/c/o/v/36e6827c74c8462a97206412365d61b5.mp4"
    },`
    );
    console.log('  ✔ Added demo_video_url setting to schema');
  }

  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', code);
  console.log('  ✔ Saved local heating-lamp-funnel.liquid');

  const token = await getAccessToken();
  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', code);
}

run().catch(console.error);
