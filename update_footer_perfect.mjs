import fs from 'fs';

const originalHtml = JSON.parse(fs.readFileSync('original_footer.json', 'utf8'));

const schema = `{% schema %}
{
  "name": "Earthly Footer",
  "settings": []
}
{% endschema %}
`;

const cssAndJs = `
<style>
  /* Root scoped styles */
  .vs-earthly-footer-root {
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #2C5801;
    overflow: hidden;
  }

  #SiteFooter.vs-earthly-footer {
    background-color: #2C5801 !important;
    color: #ffffff !important;
    padding: 32px 20px 48px !important;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif !important;
    margin: 0 !important;
    border: none !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  #SiteFooter * {
    box-sizing: border-box;
  }

  #SiteFooter .wrapper {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 16px;
    width: 100%;
  }

  #SiteFooter .footer-blocks {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin: 0 auto;
    gap: 0;
  }

  /* Block 1: Centered circular logo (100% width) */
  #SiteFooter .footer-block--logo-full {
    flex: 0 0 100%;
    width: 100%;
    text-align: center;
    padding-bottom: 40px;
    display: flex;
    justify-content: center;
  }
  #SiteFooter .footer-block__logo-full-image {
    display: inline-block;
    width: 142px;
    height: 142px;
    border-radius: 50%;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  #SiteFooter .footer-block__logo-full-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    display: block;
  }

  /* Block 2: Newsletter (75% width on desktop) */
  #SiteFooter .footer-block--newsletter {
    flex: 0 0 75%;
    max-width: 75%;
    padding: 0 30px 40px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  #SiteFooter .vsfooter-newsletter-list {
    width: 100%;
    max-width: 690px;
    margin-bottom: 8px;
  }
  #SiteFooter .vsfooter-newsletter-list ul {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 32px;
    list-style: none;
  }
  #SiteFooter .vsfooter-newsletter-list ul li {
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    color: #ffffff;
    margin: 0;
    padding: 0 0 0 26px;
    background: url('https://cdn.shopify.com/s/files/1/0519/2925/2033/files/footer-check.svg?v=1733401705') left center / 18px auto no-repeat;
  }

  /* Capsule form */
  #SiteFooter .newsletter-form {
    width: 100%;
    max-width: 690px;
    margin: 16px auto 14px;
  }
  #SiteFooter .newsletter-form .input-group {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 200px;
    padding: 6px;
    height: 60px;
    border: 1px solid rgb(206, 225, 235);
    box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  }
  #SiteFooter .newsletter-form .input-group__fields {
    flex: 1 1 auto;
    height: 100%;
    display: flex;
    align-items: center;
  }
  #SiteFooter .newsletter-form .input-group__item--email {
    width: 100%;
    height: 100%;
  }
  #SiteFooter .newsletter-form .input-group__field--email {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0 20px;
    font-size: 16px;
    color: #4b4b4b;
    font-family: inherit;
  }
  #SiteFooter .newsletter-form .input-group__field--email::placeholder {
    color: #767676;
    font-size: 15px;
  }
  #SiteFooter .newsletter-form .input-group__item--btn {
    width: 125px;
    flex: 0 0 125px;
    height: 100%;
    background: #F1B948;
    border-radius: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  #SiteFooter .newsletter-form .input-group__btn {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    text-transform: uppercase;
    color: #2C5801;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #SiteFooter .visually-hidden {
    display: none !important;
    position: absolute !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
  }

  /* Social sharing icons */
  #SiteFooter .social-sharing-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 10px;
    width: 100%;
  }
  #SiteFooter .social-sharing-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    transition: opacity 0.2s;
  }
  #SiteFooter .social-sharing-icon:hover {
    opacity: 0.8;
  }
  #SiteFooter .social-sharing-icon svg {
    width: 30px;
    height: 30px;
    fill: #ffffff;
    stroke: none;
  }

  /* Block 3: Info Menu (25% width in row 1) */
  #SiteFooter .footer-blocks > .footer-block--menu:nth-of-type(2) {
    flex: 0 0 25%;
    max-width: 25%;
    padding: 0 0 40px 10px;
  }

  /* Row 2: Shop, Helpful Links, Our Mission (each 25% width) */
  #SiteFooter .footer-blocks > .footer-block--menu:nth-of-type(3) {
    flex: 0 0 25%;
    max-width: 25%;
    padding: 0 20px 40px 0;
  }
  #SiteFooter .footer-blocks > .footer-block--menu:nth-of-type(4) {
    flex: 0 0 25%;
    max-width: 25%;
    padding: 0 20px 40px 0;
  }
  #SiteFooter .footer-blocks > .footer-block--text {
    flex: 0 0 25%;
    max-width: 25%;
    padding: 0 20px 40px 0;
  }

  /* Typography for menus and texts */
  #SiteFooter .footer-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    color: #ffffff;
    padding-bottom: 22px;
    margin: 0;
  }
  #SiteFooter .footer-title__button {
    background: none;
    border: none;
    padding: 0;
    color: inherit;
    font: inherit;
    text-align: left;
    width: 100%;
    cursor: default;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #SiteFooter .footer-title__button svg {
    display: none;
  }

  #SiteFooter .footer-links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  #SiteFooter .footer-link {
    font-size: 14px;
    line-height: 18px;
    color: #ffffff;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  #SiteFooter .footer-link:hover {
    opacity: 0.8;
  }

  #SiteFooter .footer-block--text .rte p {
    font-size: 15px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }

  /* Footer bottom */
  #SiteFooter .footer-bottom.wrapper {
    border-top: none;
    padding: 48px 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    text-align: center;
  }
  #SiteFooter .footer-bottom__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  #SiteFooter .footer-copyright__content {
    font-size: 14px;
    line-height: 18px;
    color: #ffffff;
  }
  #SiteFooter .footer-copyright__content a {
    color: #ffffff;
    text-decoration: none;
  }

  /* Country currency popout pill */
  #SiteFooter .localization-form {
    margin: 0;
    display: flex;
    justify-content: center;
  }
  #SiteFooter .select-popout {
    position: relative;
    display: inline-block;
  }
  #SiteFooter .select-popout__toggle {
    background: #F2FBEA;
    border-radius: 1000px;
    padding: 12px 36px 12px 14px;
    font-size: 13px;
    line-height: 16px;
    color: #0B0B0B;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-family: inherit;
    position: relative;
  }
  #SiteFooter .select-popout__flag {
    width: 20px;
    height: 15px;
    object-fit: cover;
    border-radius: 2px;
  }
  #SiteFooter .select-popout__toggle .icon-select {
    width: 10px;
    height: 10px;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
  }
  #SiteFooter .select-popout__list {
    display: none;
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    min-width: 230px;
    z-index: 100;
    padding: 8px 0;
    max-height: 250px;
    overflow-y: auto;
  }
  #SiteFooter .select-popout.is-open .select-popout__list {
    display: block;
  }
  #SiteFooter .select-popout__list__scroll {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  #SiteFooter .select-popout__item {
    margin: 0;
  }
  #SiteFooter .select-popout__option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    font-size: 13px;
    color: #1a1a1a;
    text-decoration: none;
    transition: background 0.15s;
  }
  #SiteFooter .select-popout__option:hover {
    background: #f2f5f0;
  }
  #SiteFooter .select-popout__item--current .select-popout__option {
    font-weight: 600;
    background: #f2f5f0;
  }

  /* Payment icon list */
  #SiteFooter .payment-icon-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  #SiteFooter .payment-icon-list > li {
    margin: 0;
  }
  #SiteFooter .payment-icon {
    width: 38px;
    height: 24px;
    display: block;
    border-radius: 3px;
  }

  /* Responsive layout adjustments */
  @media (max-width: 1023px) {
    #SiteFooter .footer-block--newsletter {
      flex: 0 0 100%;
      max-width: 100%;
      padding-right: 0;
      margin-bottom: 20px;
    }
    #SiteFooter .footer-blocks > .footer-block--menu {
      flex: 0 0 50%;
      max-width: 50%;
      padding: 0 16px 30px;
    }
    #SiteFooter .footer-blocks > .footer-block--text {
      flex: 0 0 50%;
      max-width: 50%;
      padding: 0 16px 30px;
    }
  }

  @media (max-width: 767px) {
    #SiteFooter.vs-earthly-footer {
      padding: 28px 16px 40px !important;
    }
    #SiteFooter .footer-blocks > .footer-block--menu,
    #SiteFooter .footer-blocks > .footer-block--text {
      flex: 0 0 100%;
      max-width: 100%;
      padding: 0 0 12px;
    }
    #SiteFooter .footer-title {
      padding-bottom: 0;
    }
    #SiteFooter .footer-title__button {
      padding: 14px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }
    #SiteFooter .footer-title__button svg {
      display: inline-block;
      width: 16px;
      height: 16px;
      position: relative;
    }
    #SiteFooter .footer-title__button .icon-toggle-minus {
      display: none;
    }
    #SiteFooter .footer-block--menu.is-expanded .footer-title__button .icon-toggle-plus {
      display: none;
    }
    #SiteFooter .footer-block--menu.is-expanded .footer-title__button .icon-toggle-minus {
      display: inline-block;
    }
    #SiteFooter .footer-links__wrapper {
      display: none;
      padding: 16px 0 8px;
    }
    #SiteFooter .footer-block--menu.is-expanded .footer-links__wrapper {
      display: block;
    }
    #SiteFooter .vsfooter-newsletter-list ul {
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }
    #SiteFooter .newsletter-form .input-group {
      height: 54px;
    }
  }
</style>

<script>
  (function() {
    // Accordion toggle on mobile
    const buttons = document.querySelectorAll('#SiteFooter .footer-title__button');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        if (window.innerWidth <= 767) {
          e.preventDefault();
          const block = btn.closest('.footer-block--menu');
          if (block) {
            block.classList.toggle('is-expanded');
          }
        }
      });
    });

    // Country currency popout toggle
    const popout = document.querySelector('#SiteFooter .select-popout');
    const toggle = document.querySelector('#SiteFooter .select-popout__toggle');
    if (toggle && popout) {
      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        popout.classList.toggle('is-open');
      });
      document.addEventListener('click', function() {
        popout.classList.remove('is-open');
      });
    }
  })();
</script>
`;

const completeFile = schema + '\n<div class="vs-earthly-footer-root">\n' + originalHtml + '\n</div>\n' + cssAndJs;

fs.writeFileSync('Clone-earthlyderm/sections/earthly-footer.liquid', completeFile);
console.log('Successfully wrote complete Clone-earthlyderm/sections/earthly-footer.liquid');

// Upload to Shopify Theme
const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const THEME_ID = '189572219034';

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

async function run() {
  const token = await getAccessToken();
  await uploadFile(token, 'sections/earthly-footer.liquid', completeFile);
}

run();
