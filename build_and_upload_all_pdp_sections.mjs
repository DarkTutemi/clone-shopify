import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

// 1. Clean what-to-expect
const wteRaw = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/shopify-section-template--19526978371718__section_what_to_expect_nXxXNh.html', 'utf8');
const wteLiquid = '{% schema %}\n{\n  "name": "What To Expect",\n  "settings": []\n}\n{% endschema %}\n\n' + wteRaw;
fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-what-to-expect.liquid', wteLiquid);
console.log('Written earthly-what-to-expect.liquid');

// 2. Before after results section
const barRaw = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/shopify-section-template--19526978371718__section_before_after_results_qhVhtt.html', 'utf8');
const barLiquid = '{% schema %}\n{\n  "name": "Before After Results",\n  "settings": []\n}\n{% endschema %}\n\n' + barRaw;
fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-before-after-results.liquid', barLiquid);
console.log('Written earthly-before-after-results.liquid');

// 3. Ingredients info section
const ibRaw = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/shopify-section-template--19526978371718__section_ingredients_info_V8yJF8.html', 'utf8');
const ibLiquid = '{% schema %}\n{\n  "name": "Ingredients Info",\n  "settings": []\n}\n{% endschema %}\n\n' + ibRaw;
fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-ingredients-info.liquid', ibLiquid);
console.log('Written earthly-ingredients-info.liquid');

// 4. Loox reviews section with iframe + authentic reviews widget
const reviewsLiquid = `{% schema %}
{
  "name": "Customer Reviews",
  "settings": []
}
{% endschema %}

<div class="section-padding" id="App--template--19526978371718__171744196558395e4b" data-section-type="template--19526978371718__171744196558395e4b">
  <div class="wrapper">
    <div id="shopify-block-ATU9Fd3NQalhSalR4S__loox_reviews_loox_dynamic_section_GGpA33" class="shopify-block shopify-app-block">
      <div id="looxReviews" class="loox-widget" data-limit="20" data-product-id="7535024013446" data-reviews-to-display="" data-default-tab="automatic" style="margin: 0px auto; max-width: 1080px; min-height: 4800px;" data-upgraded="true">
        <iframe id="looxReviewsFrame" title="Reviews widget" src="https://loox.io/widget/R35NLtRlkY/reviews/7535024013446?limit=20&default_tab=automatic" height="5075px" width="100%" frameborder="0" scrolling="no" margin="0" style="overflow: hidden; height: 5075px; width: 100%; border:none; box-shadow: unset; outline: unset; color-scheme: none;"></iframe>
      </div>
    </div>
  </div>
</div>
`;
fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-reviews.liquid', reviewsLiquid);
console.log('Written earthly-reviews.liquid');

// 5. Update templates/product.json
const productJson = {
  "sections": {
    "announcement": {
      "type": "earthly-announcement-bar",
      "settings": {}
    },
    "header": {
      "type": "earthly-header",
      "settings": {}
    },
    "main": {
      "type": "earthly-pdp-main",
      "settings": {}
    },
    "reviews_slider": {
      "type": "earthly-pdp-reviews-slider",
      "settings": {}
    },
    "what_to_expect": {
      "type": "earthly-what-to-expect",
      "settings": {}
    },
    "before_after_results": {
      "type": "earthly-before-after-results",
      "settings": {}
    },
    "ingredients_info": {
      "type": "earthly-ingredients-info",
      "settings": {}
    },
    "faqs": {
      "type": "earthly-faqs",
      "settings": {}
    },
    "reviews": {
      "type": "earthly-reviews",
      "settings": {}
    },
    "moneyback": {
      "type": "earthly-moneyback",
      "settings": {}
    },
    "footer": {
      "type": "earthly-footer",
      "settings": {}
    }
  },
  "order": [
    "announcement",
    "header",
    "main",
    "reviews_slider",
    "what_to_expect",
    "before_after_results",
    "ingredients_info",
    "faqs",
    "reviews",
    "moneyback",
    "footer"
  ]
};
fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/templates/product.json', JSON.stringify(productJson, null, 2));
console.log('Written templates/product.json');

// 6. Upload all to Shopify
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
  console.log('Got token:', !!token);

  await uploadFile(token, 'sections/earthly-what-to-expect.liquid', fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-what-to-expect.liquid', 'utf8'));
  await uploadFile(token, 'sections/earthly-before-after-results.liquid', fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-before-after-results.liquid', 'utf8'));
  await uploadFile(token, 'sections/earthly-ingredients-info.liquid', fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-ingredients-info.liquid', 'utf8'));
  await uploadFile(token, 'sections/earthly-reviews.liquid', fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-reviews.liquid', 'utf8'));
  await uploadFile(token, 'templates/product.json', fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/templates/product.json', 'utf8'));
}

run();
