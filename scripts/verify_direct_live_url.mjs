import fs from 'fs';

const LIVE_DIRECT_URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer';

async function main() {
  console.log(`Fetching direct live URL: ${LIVE_DIRECT_URL}...`);
  const res = await fetch(LIVE_DIRECT_URL);
  console.log('HTTP Status:', res.status);
  const html = await res.text();
  console.log('HTML Length:', html.length);

  const checks = {
    'Page Title': html.includes('Zavelyn BotanaRoots') || html.includes('Batana Hair Growth Oil'),
    'New Benefits Copy': html.includes('Nourish your scalp and bring dry, fragile hair back to life'),
    'Pure Batana Bullet': html.includes('Pure Batana Oil'),
    'BOGO Bundle Component': html.includes('zvBotanaBogoComponent'),
    'Buy 4 Get 4 Card': html.includes('zvCardBuy4'),
    'Buy 2 Get 2 Card': html.includes('zvCardBuy2'),
    'Buy 1 Card': html.includes('zvCardBuy1'),
    'Size Upgrade Card': html.includes('zvUpsellCard'),
    'Claim Offer CTA': html.includes('zvBotanaCtaBtn'),
    'Buy Now CTA': html.includes('zvBotanaBuyNowBtn'),
    'Storytelling Banner 1': html.includes('zavelyn-botana-asset-3.png'),
    'Doorstep Shipping': html.includes('Doorstep Delivery Guarantee & Real-Time Tracking')
  };

  console.log('\n=== DIRECT LIVE URL AUDIT ===');
  for (const [k, v] of Object.entries(checks)) {
    console.log(`- ${k}: ${v}`);
  }
}

main().catch(console.error);
