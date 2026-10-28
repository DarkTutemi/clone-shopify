import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function auditPolicies() {
  const token = await getAccessToken();

  console.log("Fetching store policies from Shopify API...");
  const polRes = await fetch(`https://${SHOP}/admin/api/2024-10/policies.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const polData = await polRes.json();
  
  const officialPolicies = {};
  for (const p of (polData.policies || [])) {
    officialPolicies[p.title] = {
      handle: p.handle,
      body: p.body
    };
  }

  const themeFilesToCheck = [
    'sections/announcement-bar.liquid',
    'sections/header.liquid',
    'sections/zavelyn-pdp-main.liquid',
    'sections/zavelyn-pdp-shipping.liquid',
    'sections/zhp-pdp-shipping.liquid',
    'sections/cart-drawer.liquid',
    'sections/main-cart-items.liquid',
    'sections/footer.liquid',
    'sections/zavelyn-footer.liquid',
    'layout/theme.liquid',
    'snippets/cart-drawer.liquid',
    'snippets/zavelyn-pdp-data.liquid'
  ];

  const fileFindings = {};

  for (const f of themeFilesToCheck) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${f}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    if (!res.ok) {
      console.log(`File not found: ${f}`);
      continue;
    }
    const data = await res.json();
    if (!data.asset?.value) continue;
    const content = data.asset.value;

    const matchesGuarantee = content.match(/(\d{2,3})[\s-]day(?:\smoney[\s-]back)?(?:\sguarantee)?/gi) || [];
    const matchesShippingDays = content.match(/(?:ships|dispatched|delivery|transit).*?(\d+[\s–-]\d+[\s-]*(?:days|hours|business days))/gi) || [];
    const matchesFreeShipping = content.match(/free\s+shipping.*?(?:\$\d+|\borders\b)/gi) || [];

    fileFindings[f] = {
      guarantees: [...new Set(matchesGuarantee)],
      shippingTime: [...new Set(matchesShippingDays)].slice(0, 5),
      freeShipping: [...new Set(matchesFreeShipping)].slice(0, 5)
    };
  }

  fs.writeFileSync('scripts/audit_policies_findings.json', JSON.stringify({
    officialPolicies,
    fileFindings
  }, null, 2));

  console.log("\nPolicy Consistency Findings:");
  for (const [k, v] of Object.entries(fileFindings)) {
    console.log(`\nFile: ${k}`);
    console.log(`  Guarantees:`, v.guarantees);
    console.log(`  Shipping time:`, v.shippingTime);
    console.log(`  Free shipping:`, v.freeShipping);
  }
}

auditPolicies().catch(console.error);
