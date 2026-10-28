import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function fixHomepageSections() {
  const token = await getAccessToken();
  const headers = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' };

  const targets = [
    {
      key: 'sections/zavelyn-pain-solution.liquid',
      replacements: [
        {
          from: 'Put us to the test completely risk-free. Try any Zavelyn product on your homestead, jobsite, or home for a full 60 days.',
          to: 'Put us to the test with our 30-day money-back guarantee. Try any Zavelyn product on your homestead, jobsite, or home.'
        },
        {
          from: 'Put us to the test completely risk-free.',
          to: 'Put us to the test with complete peace of mind.'
        },
        {
          from: 'for a full 60 days.',
          to: 'with our 30-day satisfaction guarantee.'
        }
      ]
    },
    {
      key: 'sections/zavelyn-comparison.liquid',
      replacements: [
        {
          from: '<td><strong>Risk-Free Guarantee</strong></td>',
          to: '<td><strong>Satisfaction Guarantee</strong></td>'
        },
        {
          from: '60-Day 100% Money-Back Trial',
          to: '30-Day Money-Back Guarantee'
        }
      ]
    }
  ];

  for (const item of targets) {
    console.log(`Checking ${item.key}...`);
    const getUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(item.key)}`;
    const res = await fetch(getUrl, { headers });
    const data = await res.json();
    let val = data.asset?.value;
    if (!val) {
      console.log(`Asset ${item.key} not found or empty.`);
      continue;
    }

    let modified = val;
    for (const r of item.replacements) {
      if (modified.includes(r.from)) {
        modified = modified.replaceAll(r.from, r.to);
        console.log(`Replaced "${r.from}" in ${item.key}`);
      }
    }

    if (modified !== val) {
      const putUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ asset: { key: item.key, value: modified } })
      });
      const putData = await putRes.json();
      if (putData.asset) {
        console.log(`[SUCCESS] Updated ${item.key}`);
      } else {
        console.error(`[ERROR] Failed to update ${item.key}:`, putData.errors);
      }
    } else {
      console.log(`No changes needed for ${item.key}`);
    }
  }
}

fixHomepageSections();
