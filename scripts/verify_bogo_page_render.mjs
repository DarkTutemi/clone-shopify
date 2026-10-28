import fs from 'fs';

const PREVIEW_URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer?preview_theme_id=187736654009';

async function main() {
  console.log(`Fetching ${PREVIEW_URL}...`);
  const res = await fetch(PREVIEW_URL);
  console.log('HTTP Status:', res.status);
  const html = await res.text();
  console.log('HTML Length:', html.length);
  fs.writeFileSync('scripts/bogo_preview_scraped.html', html, 'utf8');

  // Verify critical elements
  const checks = {
    'Page Title': html.includes('Zavelyn BotanaRoots') || html.includes('Batana Hair Growth Oil'),
    'New Benefits Copy': html.includes('Nourish your scalp and bring dry, fragile hair back to life'),
    'Pure Batana Bullet': html.includes('Pure Batana Oil'),
    'Fuller Hair Bullet': html.includes('Fuller, Healthier-Looking Hair'),
    'Gallery Thumbnails (8)': (html.match(/zv-thumb-btn/g) || []).length,
    'Gallery Main Media': html.includes('zvMainMediaWrap') && html.includes('zvMainImg'),
    'BOGO Bundle Container': html.includes('zvBotanaBogoComponent'),
    'Buy 4 Get 4 Card': html.includes('zvCardBuy4') && html.includes('Buy 4 Get 4 FREE'),
    'Buy 2 Get 2 Card': html.includes('zvCardBuy2') && html.includes('Buy 2 Get 2 FREE'),
    'Buy 1 Card': html.includes('zvCardBuy1') && html.includes('Buy 1'),
    'Size Upgrade Card': html.includes('zvUpsellCard') && html.includes('Double the Size!'),
    'Summary Box': html.includes('zvSummaryPackage') && html.includes('zvSummaryTotal'),
    'Claim Offer CTA': html.includes('zvBotanaCtaBtn') && html.includes('CLAIM OFFER'),
    'Buy Now CTA': html.includes('zvBotanaBuyNowBtn') && html.includes('BUY NOW (1-CLICK CHECKOUT)'),
    'Payment Icons Row': html.includes('zv-payment-icons-wrapper'),
    'Ticker Bar': html.includes('zv-ticker-wrap'),
    'Storytelling Banner 1': html.includes('zavelyn-botana-asset-3.png'),
    'Storytelling Banner 2': html.includes('zavelyn-botana-asset-4.png'),
    'Storytelling Banner 3': html.includes('zavelyn-botana-asset-5.png'),
    'Storytelling Banner 4': html.includes('zavelyn-botana-asset-6.png'),
    'FAQ Accordion': html.includes('kc-faq') || html.includes('botanaroots-faq') || html.includes('How do I apply Zavelyn BotanaRoots'),
    'Verified Reviews': html.includes('Verified Customer Reviews') || html.includes('Customer Reviews'),
    'Doorstep Shipping Section': html.includes('Doorstep Delivery Guarantee & Real-Time Tracking') && html.includes('5555.webp'),
    'Header': html.includes('willa-header') || html.includes('header'),
    'Footer': html.includes('willa-footer') || html.includes('footer'),
    'Cart Drawer': html.includes('cart-drawer') || html.includes('willa-cart-drawer')
  };

  console.log('\n=== RENDER AUDIT VERIFICATION ===');
  for (const [k, v] of Object.entries(checks)) {
    console.log(`- ${k}: ${v}`);
  }
}

main().catch(console.error);
