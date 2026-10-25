import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tokenRes = await fetch('https://' + SHOP_DOMAIN + '/admin/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function uploadFile(token, relPath, content) {
  const uploadRes = await fetch('https://' + SHOP_DOMAIN + '/admin/api/2024-01/themes/' + THEME_ID + '/assets.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: relPath,
        value: content
      }
    })
  });
  const uploadData = await uploadRes.json();
  console.log('Uploaded ' + relPath + ':', uploadData.asset ? 'SUCCESS' : uploadData);
}

// -------------------------------------------------------------
// 1. earthly-pdp-reviews-slider.liquid
// -------------------------------------------------------------
function buildReviewsSlider() {
  const original = fs.readFileSync('Clone-earthlyderm/sections/earthly-pdp-reviews-slider.liquid', 'utf8');
  
  // Replace card grid with conditional
  const blackSoapCards = `
    <!-- Black Soap 5 Reviews -->
    <!-- Card 1: Nicole D. -->
    <div class="rs__card">
      <div class="rs__card-image">
        <picture>
          <img src="//earthlyderm.com/cdn/shop/files/Untitled_1500_x_1500_px.png?v=1779594810&width=380" width="380" height="250" alt="Nicole D." loading="lazy">
        </picture>
      </div>
      <div class="rs__card-body">
        <div class="rs__card-top">
          <span class="rs__card-name">Nicole D.</span>
          <div class="rs__card-stars">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 80 14" height="14" width="80"><path fill="#F1B948" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(16,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(32,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(48,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(64,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/></svg>
          </div>
        </div>
        <p class="rs__card-quote">"The struggle is over."</p>
        <p class="rs__card-text">"After more than 30 years of struggling with dark spots and a lack of knowledge regarding the best care for my beautiful skin, I am finally free. EarthlyDerm’s bar has truly been a game changer..."</p>
      </div>
    </div>

    <!-- Card 2: Florence I. -->
    <div class="rs__card">
      <div class="rs__card-image">
        <picture>
          <img src="//earthlyderm.com/cdn/shop/files/Untitled_1500_x_1500_px_1.png?v=1779595049&width=380" width="380" height="250" alt="Florence I." loading="lazy">
        </picture>
      </div>
      <div class="rs__card-body">
        <div class="rs__card-top">
          <span class="rs__card-name">Florence I.</span>
          <div class="rs__card-stars">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 80 14" height="14" width="80"><path fill="#F1B948" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(16,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(32,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(48,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(64,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/></svg>
          </div>
        </div>
        <p class="rs__card-quote">"BEST DECISION EVER!"</p>
        <p class="rs__card-text">"I double cleansed my face every night and used a natural moisturiser after. It took some time but eventually my acne cleared up and my face was as smooth as ever. Best decision ever."</p>
      </div>
    </div>

    <!-- Card 3: Nazma B -->
    <div class="rs__card">
      <div class="rs__card-image">
        <picture>
          <img src="//earthlyderm.com/cdn/shop/files/Untitled_1500_x_1500_px_2.png?v=1779595751&width=380" width="380" height="250" alt="Nazma B" loading="lazy">
        </picture>
      </div>
      <div class="rs__card-body">
        <div class="rs__card-top">
          <span class="rs__card-name">Nazma B</span>
          <div class="rs__card-stars">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 80 14" height="14" width="80"><path fill="#F1B948" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(16,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(32,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(48,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(64,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/></svg>
          </div>
        </div>
        <p class="rs__card-quote">"This soap is a God send"</p>
        <p class="rs__card-text">"I suffer from a skin condition called acne vulgaris. I've had this condition since I was a child, and have tried everything out there. Nothing gave me the results this soap did within just a few weeks."</p>
      </div>
    </div>

    <!-- Card 4: Lisa W. -->
    <div class="rs__card">
      <div class="rs__card-image">
        <picture>
          <img src="//earthlyderm.com/cdn/shop/files/Untitled_1500_x_1500_px_3.png?v=1779604348&width=380" width="380" height="250" alt="Lisa W." loading="lazy">
        </picture>
      </div>
      <div class="rs__card-body">
        <div class="rs__card-top">
          <span class="rs__card-name">Lisa W.</span>
          <div class="rs__card-stars">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 80 14" height="14" width="80"><path fill="#F1B948" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(16,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(32,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(48,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(64,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/></svg>
          </div>
        </div>
        <p class="rs__card-quote">"Nothing else seemed to be effective for me"</p>
        <p class="rs__card-text">"It truly works. I noticed significant improvement within two weeks of using this product. All thanks to my father, who insisted I try it despite my initial reluctance. This soap genuinely cleared my skin."</p>
      </div>
    </div>

    <!-- Card 5: Joke J. -->
    <div class="rs__card">
      <div class="rs__card-image">
        <picture>
          <img src="//earthlyderm.com/cdn/shop/files/Untitled_1500_x_1500_px_4.png?v=1779604837&width=380" width="380" height="250" alt="Joke J." loading="lazy">
        </picture>
      </div>
      <div class="rs__card-body">
        <div class="rs__card-top">
          <span class="rs__card-name">Joke J.</span>
          <div class="rs__card-stars">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 80 14" height="14" width="80"><path fill="#F1B948" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(16,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(32,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(48,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/><path fill="#F1B948" transform="translate(64,0)" d="M3.16 13.34L4.2 8.52L1.04 6.26L5.43 4.71L6.61 1L7.79 4.71L11.67 4.68L8.51 6.26L9.75 12.2L7.43 10.88L4.3 13.18V13.34Z"/></svg>
          </div>
        </div>
        <p class="rs__card-quote">"Customer for life now"</p>
        <p class="rs__card-text">"The first picture is before commencing the Tumeric glow bar. I used it for three months and got amazing results. I then switched to the African Black soap when it launched and it was the best thing for my stubborn acne scars."</p>
      </div>
    </div>
  `;

  const targetTag = `<div class="rs__cards-grid">`;
  const splitIdx = original.indexOf(targetTag);
  const endIdx = original.indexOf(`</div>\n</div>\n\n<script>`, splitIdx);

  if (splitIdx !== -1 && endIdx !== -1) {
    const turmericCards = original.slice(splitIdx + targetTag.length, endIdx);
    const newCardsGrid = `${targetTag}\n{% if product.handle contains 'african' or product.handle contains 'black' %}\n${blackSoapCards}\n{% else %}\n${turmericCards}\n{% endif %}`;
    const result = original.slice(0, splitIdx) + newCardsGrid + original.slice(endIdx);
    fs.writeFileSync('Clone-earthlyderm/sections/earthly-pdp-reviews-slider.liquid', result);
    console.log('Updated earthly-pdp-reviews-slider.liquid');
  }
}

// -------------------------------------------------------------
// 2. earthly-what-to-expect.liquid
// -------------------------------------------------------------
function buildWhatToExpect() {
  const original = fs.readFileSync('Clone-earthlyderm/sections/earthly-what-to-expect.liquid', 'utf8');
  
  const blackSoapTimeline = `
        <!-- Card 1: FIRST USE -->
        <article class="wte__block wte__block--left">
          <div class="wte__badge" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7 5.3c.4.4.4 1 0 1.4l-8 8c-.4.4-1 .4-1.4 0l-4-4c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L8 12.6l7.3-7.3c.4-.4 1-.4 1.4 0z" fill="#ffffff"></path></svg>
          </div>
          <div class="wte__block-inner">
            <div class="wte__spine-gap" aria-hidden="true"></div>
            <div class="wte__content-column">
              <div class="wte__content">
                <div class="wte__date">🗓️ FIRST USE</div>
                <div class="wte__highlighted-text">
                  <strong>The bar gets to work immediately</strong>
                  The plant ash sinks into your pores from day one, lifting out the trapped oil and dirt your breakouts feed on.
                </div>
                <h3 class="wte__label">Your skin already feels different</h3>
                <dl class="wte__info-items">
                  <div class="wte__info-item"><dd class="wte__info-text">Skin feels instantly softer and cleaner</dd></div>
                  <div class="wte__info-item"><dd class="wte__info-text">No tightness, no stripping, no irritation</dd></div>
                  <div class="wte__info-item"><dd class="wte__info-text">Skin that looks alive, not just clean</dd></div>
                </dl>
              </div>
            </div>
            <div class="wte__image-column"></div>
          </div>
        </article>

        <!-- Card 2: WEEKS 2-3 -->
        <article class="wte__block wte__block--right">
          <div class="wte__badge" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7 5.3c.4.4.4 1 0 1.4l-8 8c-.4.4-1 .4-1.4 0l-4-4c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L8 12.6l7.3-7.3c.4-.4 1-.4 1.4 0z" fill="#ffffff"></path></svg>
          </div>
          <div class="wte__block-inner">
            <div class="wte__spine-gap" aria-hidden="true"></div>
            <div class="wte__content-column">
              <div class="wte__content">
                <div class="wte__date">🗓️ WEEKS 2-3</div>
                <div class="wte__highlighted-text">
                  <strong>Acne visibly improves</strong>
                  With your pores staying clean, the breakouts you already have start clearing while fewer new ones come through. Your skin looks clearer than it has in months.
                </div>
                <h3 class="wte__label">People are starting to notice</h3>
                <dl class="wte__info-items">
                  <div class="wte__info-item"><dd class="wte__info-text">Existing breakouts shrink and fade</dd></div>
                  <div class="wte__info-item"><dd class="wte__info-text">Fewer new ones appear</dd></div>
                  <div class="wte__info-item"><dd class="wte__info-text">People start asking what's changed</dd></div>
                </dl>
              </div>
            </div>
            <div class="wte__image-column"></div>
          </div>
        </article>

        <!-- Card 3: DAY 60 -->
        <article class="wte__block wte__block--left">
          <div class="wte__badge" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7 5.3c.4.4.4 1 0 1.4l-8 8c-.4.4-1 .4-1.4 0l-4-4c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L8 12.6l7.3-7.3c.4-.4 1-.4 1.4 0z" fill="#ffffff"></path></svg>
          </div>
          <div class="wte__block-inner">
            <div class="wte__spine-gap" aria-hidden="true"></div>
            <div class="wte__content-column">
              <div class="wte__content">
                <div class="wte__date">🗓️ DAY 60</div>
                <div class="wte__highlighted-text">
                  <strong>Full Results Building</strong>
                  New pimples barely surface now, and the rare one clears fast. After every product that broke its promise, this is the first time your skin feels genuinely clear of acne, and like it's staying that way.
                </div>
                <h3 class="wte__label">You can feel it holding</h3>
                <dl class="wte__info-items">
                  <div class="wte__info-item"><dd class="wte__info-text">Acne is rare now instead of a constant fight</dd></div>
                  <div class="wte__info-item"><dd class="wte__info-text">Skin stays clear and smooth</dd></div>
                  <div class="wte__info-item"><dd class="wte__info-text">You stop bracing for the next breakout</dd></div>
                </dl>
              </div>
            </div>
            <div class="wte__image-column"></div>
          </div>
        </article>

        <!-- Card 4: DAY 90 -->
        <article class="wte__block wte__block--right">
          <div class="wte__badge" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.7 5.3c.4.4.4 1 0 1.4l-8 8c-.4.4-1 .4-1.4 0l-4-4c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0L8 12.6l7.3-7.3c.4-.4 1-.4 1.4 0z" fill="#ffffff"></path></svg>
          </div>
          <div class="wte__block-inner">
            <div class="wte__spine-gap" aria-hidden="true"></div>
            <div class="wte__content-column">
              <div class="wte__content">
                <div class="wte__date">🗓️ DAY 90</div>
                <div class="wte__highlighted-text">
                  <strong>A New You</strong>
                  Three months of sticking with it has done what years of other products couldn't. Your skin is calmer and clearer than you can remember, breakouts are far less of a battle, and for the first time it feels like your skin is on your side.
                </div>
                <h3 class="wte__label">What you've been working towards</h3>
                <dl class="wte__info-items">
                  <div class="wte__info-item"><dd class="wte__info-text">Skin that's clear and stays clear</dd></div>
                  <div class="wte__info-item"><dd class="wte__info-text">Smooth, soft skin</dd></div>
                  <div class="wte__info-item"><dd class="wte__info-text">Healthy &amp; restored skin barrier</dd></div>
                </dl>
              </div>
            </div>
            <div class="wte__image-column"></div>
          </div>
        </article>
  `;

  const timelineStart = `<div class="wte__timeline">`;
  const spineTag = `<div class="wte__spine" aria-hidden="true"></div>`;
  const timelineEnd = `</div>\n      <div class="wte__button-container">`;

  const startIdx = original.indexOf(spineTag);
  const endIdx = original.indexOf(timelineEnd);

  if (startIdx !== -1 && endIdx !== -1) {
    const turmericBlocks = original.slice(startIdx + spineTag.length, endIdx);
    const newTimeline = `${spineTag}\n{% if product.handle contains 'african' or product.handle contains 'black' %}\n${blackSoapTimeline}\n{% else %}\n${turmericBlocks}\n{% endif %}`;
    const result = original.slice(0, startIdx) + newTimeline + original.slice(endIdx);
    fs.writeFileSync('Clone-earthlyderm/sections/earthly-what-to-expect.liquid', result);
    console.log('Updated earthly-what-to-expect.liquid');
  }
}

// -------------------------------------------------------------
// 3. earthly-before-after-results.liquid
// -------------------------------------------------------------
function buildBeforeAfter() {
  const original = fs.readFileSync('Clone-earthlyderm/sections/earthly-before-after-results.liquid', 'utf8');

  // Replace Before & After images
  let content = original.replace(
    `<img
            src="//earthlyderm.com/cdn/shop/files/Screenshot_2024-12-21_at_14.13.46.png?v=1769475000&width=600"
            alt="Before"
            loading="lazy"
          >`,
    `{% if product.handle contains 'african' or product.handle contains 'black' %}
          <img src="//earthlyderm.com/cdn/shop/files/R4k8_H596_orig.jpg?v=1779607263&width=600" alt="Before" loading="lazy">
        {% else %}
          <img src="//earthlyderm.com/cdn/shop/files/Screenshot_2024-12-21_at_14.13.46.png?v=1769475000&width=600" alt="Before" loading="lazy">
        {% endif %}`
  );

  content = content.replace(
    `<img
            src="//earthlyderm.com/cdn/shop/files/after_1.jpg?v=1769475010&width=600"
            alt="After"
            loading="lazy"
            width="auto"
            height="auto"
          >`,
    `{% if product.handle contains 'african' or product.handle contains 'black' %}
          <img src="//earthlyderm.com/cdn/shop/files/zL6rN9lyLD_orig.jpg?v=1779607044&width=600" alt="After" loading="lazy" width="auto" height="auto">
        {% else %}
          <img src="//earthlyderm.com/cdn/shop/files/after_1.jpg?v=1769475010&width=600" alt="After" loading="lazy" width="auto" height="auto">
        {% endif %}`
  );

  // Subtext
  content = content.replace(
    `<p class="bar-subtext">Every batch of our turmeric undergoes third-party testing to confirm unmatched purity and potency. While others rely on claims, we rely on data—and the results speak for themselves.</p>`,
    `{% if product.handle contains 'african' or product.handle contains 'black' %}
        <p class="bar-subtext">Every batch of our Black Soap goes through third-party testing to confirm unmatched purity and potency. While others rely on claims, we rely on data—and the results speak for themselves.</p>
      {% else %}
        <p class="bar-subtext">Every batch of our turmeric undergoes third-party testing to confirm unmatched purity and potency. While others rely on claims, we rely on data—and the results speak for themselves.</p>
      {% endif %}`
  );

  // Wrap stats
  const statsStart = `<div class="bar-stats">`;
  const statsEnd = `</div>\n  \n\n  \n    <div class="bar-footnote">`;
  if (content.includes(statsStart) && content.includes(statsEnd)) {
    const sIdx = content.indexOf(statsStart);
    const eIdx = content.indexOf(statsEnd);
    const turmericStats = content.slice(sIdx, eIdx + 6);
    content = content.slice(0, sIdx) + `{% unless product.handle contains 'african' or product.handle contains 'black' %}\n${turmericStats}\n{% endunless %}` + content.slice(eIdx + 6);
  }

  // Button text
  content = content.replace(
    `<a href="#productFormWrapper" class="bar-cta">GET THE TURMERIC GLOW BAR</a>`,
    `{% if product.handle contains 'african' or product.handle contains 'black' %}
        <a href="#productFormWrapper" class="bar-cta">GET THE ANTI-ACNE &amp; BLEMISH BAR</a>
      {% else %}
        <a href="#productFormWrapper" class="bar-cta">GET THE TURMERIC GLOW BAR</a>
      {% endif %}`
  );

  fs.writeFileSync('Clone-earthlyderm/sections/earthly-before-after-results.liquid', content);
  console.log('Updated earthly-before-after-results.liquid');
}

// -------------------------------------------------------------
// 4. earthly-ingredients-info.liquid
// -------------------------------------------------------------
function buildIngredients() {
  const original = fs.readFileSync('Clone-earthlyderm/sections/earthly-ingredients-info.liquid', 'utf8');

  const blackSoapIngredients = `
      <!-- Block 1: Cocoa Pod Ash -->
      <div class="ib-info">
        <div class="ib-left">
          <div class="ib-image-wrapper">
            <img src="//earthlyderm.com/cdn/shop/files/Untitled_design_99.png?v=1779621080&width=200" alt="Cocoa Pod Ash" loading="lazy">
          </div>
          <div class="ib-titles-wrapper">
            <p class="ib-subtitle">CLEARS BREAKOUTS AT THE SOURCE</p>
            <p class="ib-name">Cocoa Pod Ash</p>
          </div>
        </div>
        <div class="ib-text">
          <p>The active heart of the bar. Its natural cleansing and antibacterial properties lift the oil and dead skin that clog pores, then clear the bacteria that turns them into breakouts.</p>
        </div>
      </div>

      <!-- Block 2: Shea Butter & Coconut Oil -->
      <div class="ib-info">
        <div class="ib-left">
          <div class="ib-image-wrapper">
            <img src="//earthlyderm.com/cdn/shop/files/Untitled_design_100.png?v=1779621235&width=200" alt="Shea Butter &amp; Coconut Oil" loading="lazy">
          </div>
          <div class="ib-titles-wrapper">
            <p class="ib-subtitle">DEEPLY CLEANS WITHOUT STRIPPING</p>
            <p class="ib-name">Shea Butter &amp; Coconut Oil</p>
          </div>
        </div>
        <div class="ib-text">
          <p>Most cleansers that fight acne leave skin dry and tight. Shea butter and coconut oil keep your skin balanced and hydrated while the bar does its work.</p>
        </div>
      </div>

      <!-- Block 3: Moringa Oil -->
      <div class="ib-info">
        <div class="ib-left">
          <div class="ib-image-wrapper">
            <img src="//earthlyderm.com/cdn/shop/files/Untitled_design_76.png?v=1776507247&width=200" alt="Moringa Oil" loading="lazy">
          </div>
          <div class="ib-titles-wrapper">
            <p class="ib-subtitle">CALMS IRRITATED, BREAKOUT-PRONE SKIN</p>
            <p class="ib-name">Moringa Oil</p>
          </div>
        </div>
        <div class="ib-text">
          <p>Rich in antioxidants, it soothes inflammation and helps keep angry, breakout-prone skin calm and comfortable.</p>
        </div>
      </div>

      <!-- Block 4: Palm Kernel Oil -->
      <div class="ib-info">
        <div class="ib-left">
          <div class="ib-image-wrapper">
            <img src="//earthlyderm.com/cdn/shop/files/Untitled_design_-_2026-05-24T211545.399.png?v=1779621487&width=200" alt="Palm Kernel Oil" loading="lazy">
          </div>
          <div class="ib-titles-wrapper">
            <p class="ib-subtitle">CLEANSES DEEP INTO PORES</p>
            <p class="ib-name">Palm Kernel Oil</p>
          </div>
        </div>
        <div class="ib-text">
          <p>Creates the bar's rich, active lather that lifts the excess oil, dirt and dead skin out of your pores, clearing the buildup that leads to breakouts.</p>
        </div>
      </div>
  `;

  const blocksWrapStart = `<div class="ib-blocks-wrapper">`;
  const blocksWrapEnd = `</div>\n\n    <div class="ib-footer">`;

  const sIdx = original.indexOf(blocksWrapStart);
  const eIdx = original.indexOf(blocksWrapEnd);

  if (sIdx !== -1 && eIdx !== -1) {
    const turmericBlocks = original.slice(sIdx + blocksWrapStart.length, eIdx);
    const newBlocks = `${blocksWrapStart}\n{% if product.handle contains 'african' or product.handle contains 'black' %}\n${blackSoapIngredients}\n{% else %}\n${turmericBlocks}\n{% endif %}`;
    const result = original.slice(0, sIdx) + newBlocks + original.slice(eIdx);
    fs.writeFileSync('Clone-earthlyderm/sections/earthly-ingredients-info.liquid', result);
    console.log('Updated earthly-ingredients-info.liquid');
  }
}

// -------------------------------------------------------------
// 5. earthly-faqs.liquid
// -------------------------------------------------------------
function buildFaqs() {
  const original = fs.readFileSync('Clone-earthlyderm/sections/earthly-faqs.liquid', 'utf8');

  const blackSoapFaqs = `
        <div class="vs-earthly-pdp-faq-item">
          <div class="vs-earthly-pdp-faq-item-thumb">
            <span>Turmeric or Black - Which is right for me?</span>
            <div class="vs-earthly-pdp-faq-item-button">+</div>
          </div>
          <div class="vs-earthly-pdp-faq-item-panel">
            <p><strong>Turmeric Glow Bar → Brightening &amp; Even Skin Tone</strong><br>Best for dark spots, hyperpigmentation, and dull skin. It evens out complexion, boosts radiance, and gently cleanses without drying.</p>
            <p><strong>African Black → Acne, Blemishes &amp; Dark Spots</strong><br>Best for acne, breakouts, and post-acne marks. It deeply cleanses, controls oil, and helps fade blemishes while calming irritation.</p>
            <p><strong>Can I Use Both?</strong><br>Yes! Many customers use Turmeric in the morning for glow &amp; brightness, and Black Soap at night for deep cleansing &amp; acne control.</p>
          </div>
        </div>

        <div class="vs-earthly-pdp-faq-item">
          <div class="vs-earthly-pdp-faq-item-thumb">
            <span>Can this clear my acne and breakouts?</span>
            <div class="vs-earthly-pdp-faq-item-button">+</div>
          </div>
          <div class="vs-earthly-pdp-faq-item-panel">
            <p>Yes. The natural plant ash lifts the oil and dead skin that clog your pores, then clears the bacteria that turns them into breakouts. So acne is dealt with at the source, not just covered up.</p>
          </div>
        </div>

        <div class="vs-earthly-pdp-faq-item">
          <div class="vs-earthly-pdp-faq-item-thumb">
            <span>Will it work if nothing else has?</span>
            <div class="vs-earthly-pdp-faq-item-button">+</div>
          </div>
          <div class="vs-earthly-pdp-faq-item-panel">
            <p>Most people who try this have already been through the harsh actives and washes that didn't work.<br><br>This works differently, by cleaning deep into the pores instead of stripping the surface, which is why so many who'd given up tell us it's the one that finally worked.</p>
          </div>
        </div>

        <div class="vs-earthly-pdp-faq-item">
          <div class="vs-earthly-pdp-faq-item-thumb">
            <span>Can I use it every day?</span>
            <div class="vs-earthly-pdp-faq-item-button">+</div>
          </div>
          <div class="vs-earthly-pdp-faq-item-panel">
            <p>Yes, once your skin is used to it. Start a few times a week, then build up to daily as your skin adjusts. Always follow with a moisturiser to keep your skin balanced.</p>
          </div>
        </div>

        <div class="vs-earthly-pdp-faq-item">
          <div class="vs-earthly-pdp-faq-item-thumb">
            <span>Can I use it on my body, not just my face?</span>
            <div class="vs-earthly-pdp-faq-item-button">+</div>
          </div>
          <div class="vs-earthly-pdp-faq-item-panel">
            <p>Absolutely. It works just as well on body breakouts, including the back, chest and shoulders. Lather it in your hands and massage the foam over the area, then rinse.</p>
          </div>
        </div>

        <div class="vs-earthly-pdp-faq-item">
          <div class="vs-earthly-pdp-faq-item-thumb">
            <span>Will it dry my skin out?</span>
            <div class="vs-earthly-pdp-faq-item-button">+</div>
          </div>
          <div class="vs-earthly-pdp-faq-item-panel">
            <p>It's a deep cleanser, so it can feel drying if you overuse it or skip moisturiser. Use a few times a week to start, and always follow with a moisturiser.<br><br>Most people find it leaves skin clean and balanced rather than tight.</p>
          </div>
        </div>

        <div class="vs-earthly-pdp-faq-item">
          <div class="vs-earthly-pdp-faq-item-thumb">
            <span>What if it doesn’t work for me?</span>
            <div class="vs-earthly-pdp-faq-item-button">+</div>
          </div>
          <div class="vs-earthly-pdp-faq-item-panel">
            <p>We offer a <strong>100% money-back guarantee</strong>. If you’re not happy with your results after <strong>60 days</strong>, contact us for a <strong>full refund</strong>.</p>
          </div>
        </div>
  `;

  const faqsInnerStart = `<div class="vs-earthly-pdp-faqs-inner">`;
  const faqsInnerEnd = `</div>\n    </div>\n  </div>\n</div>\n\n<style>`;

  const sIdx = original.indexOf(faqsInnerStart);
  const eIdx = original.indexOf(faqsInnerEnd);

  if (sIdx !== -1 && eIdx !== -1) {
    const turmericFaqs = original.slice(sIdx + faqsInnerStart.length, eIdx);
    const newFaqs = `${faqsInnerStart}\n{% if product.handle contains 'african' or product.handle contains 'black' %}\n${blackSoapFaqs}\n{% else %}\n${turmericFaqs}\n{% endif %}`;
    const result = original.slice(0, sIdx) + newFaqs + original.slice(eIdx);
    fs.writeFileSync('Clone-earthlyderm/sections/earthly-faqs.liquid', result);
    console.log('Updated earthly-faqs.liquid');
  }
}

// -------------------------------------------------------------
// 6. earthly-reviews.liquid
// -------------------------------------------------------------
function buildReviews() {
  const original = fs.readFileSync('Clone-earthlyderm/sections/earthly-reviews.liquid', 'utf8');

  const blackSoapRow1 = fs.readFileSync('black_soap_row1.html', 'utf8');
  const blackSoapRow2 = fs.readFileSync('black_soap_row2.html', 'utf8');

  // Row 1
  const row1TrackStart = `<div class="rev-marquee-row rev-marquee-ltr">\n      <div class="rev-marquee-track">`;
  const row1TrackEnd = `</div>\n    </div>\n\n    <!-- Row 2:`;

  const s1 = original.indexOf(row1TrackStart);
  const e1 = original.indexOf(row1TrackEnd);

  let updated = original;
  if (s1 !== -1 && e1 !== -1) {
    const turmericRow1 = original.slice(s1 + row1TrackStart.length, e1);
    const newRow1 = `${row1TrackStart}\n{% if product.handle contains 'african' or product.handle contains 'black' %}\n${blackSoapRow1}${blackSoapRow1}\n{% else %}\n${turmericRow1}\n{% endif %}`;
    updated = original.slice(0, s1) + newRow1 + original.slice(e1);
  }

  // Row 2
  const row2TrackStart = `<div class="rev-marquee-row rev-marquee-rtl">\n      <div class="rev-marquee-track">`;
  const row2TrackEnd = `</div>\n    </div>\n  </div>\n</section>`;

  const s2 = updated.indexOf(row2TrackStart);
  const e2 = updated.indexOf(row2TrackEnd);

  if (s2 !== -1 && e2 !== -1) {
    const turmericRow2 = updated.slice(s2 + row2TrackStart.length, e2);
    const newRow2 = `${row2TrackStart}\n{% if product.handle contains 'african' or product.handle contains 'black' %}\n${blackSoapRow2}${blackSoapRow2}\n{% else %}\n${turmericRow2}\n{% endif %}`;
    updated = updated.slice(0, s2) + newRow2 + updated.slice(e2);
  }

  fs.writeFileSync('Clone-earthlyderm/sections/earthly-reviews.liquid', updated);
  console.log('Updated earthly-reviews.liquid');
}

// -------------------------------------------------------------
// 7. earthly-moneyback.liquid
// -------------------------------------------------------------
function buildMoneyback() {
  let content = fs.readFileSync('Clone-earthlyderm/sections/earthly-moneyback.liquid', 'utf8');

  content = content.replace(
    `<p class="vs-earthly-pdp-moneyback-subtitle">Enjoy 60 nights of Clearer, Brighter Skin, with less than 0.3% of customers asking for their money back.</p>`,
    `{% if product.handle contains 'african' or product.handle contains 'black' %}
          <p class="vs-earthly-pdp-moneyback-subtitle">Enjoy 60 nights of clearer, calmer skin, with less than 0.3% of customers asking for their money back.</p>
        {% else %}
          <p class="vs-earthly-pdp-moneyback-subtitle">Enjoy 60 nights of Clearer, Brighter Skin, with less than 0.3% of customers asking for their money back.</p>
        {% endif %}`
  );

  fs.writeFileSync('Clone-earthlyderm/sections/earthly-moneyback.liquid', content);
  console.log('Updated earthly-moneyback.liquid');
}

// Run all builders
buildReviewsSlider();
buildWhatToExpect();
buildBeforeAfter();
buildIngredients();
buildFaqs();
buildReviews();
buildMoneyback();

// Upload to Shopify Theme
async function deployAll() {
  const token = await getAccessToken();
  const filesToUpload = [
    'sections/earthly-pdp-main.liquid',
    'sections/earthly-pdp-reviews-slider.liquid',
    'sections/earthly-what-to-expect.liquid',
    'sections/earthly-before-after-results.liquid',
    'sections/earthly-ingredients-info.liquid',
    'sections/earthly-faqs.liquid',
    'sections/earthly-reviews.liquid',
    'sections/earthly-moneyback.liquid'
  ];

  for (const f of filesToUpload) {
    const code = fs.readFileSync('Clone-earthlyderm/' + f, 'utf8');
    await uploadFile(token, f, code);
  }
}

deployAll();
