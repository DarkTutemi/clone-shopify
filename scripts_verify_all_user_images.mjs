import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=templates/collection.zavelyn-handpans.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const tpl = JSON.parse(data.asset.value);

  console.log('=== VERIFYING PRESERVED USER IMAGES ===');
  console.log('1. Hero Image Desktop:', tpl.sections.zhp_hero.settings.image_desktop);
  console.log('2. Hero Image Mobile:', tpl.sections.zhp_hero.settings.image_mobile);
  console.log('3. Bestsellers Product Pro Block Image:', tpl.sections.zhp_bestsellers.blocks.product_pro.settings.image);
  console.log('4. Bestsellers Product Plus Block Image:', tpl.sections.zhp_bestsellers.blocks.product_plus.settings.image);
  console.log('5. Bestsellers Product Mini Block Image:', tpl.sections.zhp_bestsellers.blocks.product_mini.settings.image);
  console.log('6. Model Tabs Pro Image:', tpl.sections.zhp_model_tabs.settings.image_pro);
  console.log('7. Model Tabs Mini Image:', tpl.sections.zhp_model_tabs.settings.image_mini);
  console.log('8. What You Get Item 3 Image:', tpl.sections.zhp_what_you_get.blocks.item_3.settings.image);
  console.log('9. What You Get Item 4 Image:', tpl.sections.zhp_what_you_get.blocks.item_4.settings.image);
  console.log('10. Endorser 6 Avatar:', tpl.sections.zhp_endorsements.blocks.endorser_6.settings.avatar);
  console.log('11. Buyers Guide Fact 2 Image:', tpl.sections.zhp_buyers_guide.blocks.fact_2.settings.image);
  console.log('12. Buyers Guide Fact 3 Image:', tpl.sections.zhp_buyers_guide.blocks.fact_3.settings.image);
  console.log('13. Buyers Guide Fact 4 Image:', tpl.sections.zhp_buyers_guide.blocks.fact_4.settings.image);
}

run().catch(console.error);
