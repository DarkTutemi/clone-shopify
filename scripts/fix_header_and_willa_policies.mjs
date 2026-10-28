import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function fetchAsset(key, token) {
  const getUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(getUrl, { headers: { 'X-Shopify-Access-Token': token } });
  const data = await res.json();
  return data.asset?.value || '';
}

async function saveAsset(key, value, token) {
  const putUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`;
  const res = await fetch(putUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  return await res.json();
}

async function fixHeaderAndWilla() {
  const token = await getAccessToken();

  // 1. Update sections/header-group.json
  console.log('1. Updating sections/header-group.json...');
  const hgStr = await fetchAsset('sections/header-group.json', token);
  if (hgStr) {
    const hg = JSON.parse(hgStr);
    if (hg.sections?.['willa-header']?.settings) {
      hg.sections['willa-header'].settings.announcement_desktop = '★ FREE US SHIPPING OVER $49 · 100% SATISFACTION GUARANTEED · 30-DAY MONEY-BACK GUARANTEE ★';
      hg.sections['willa-header'].settings.announcement_mobile = '★ FREE US SHIPPING OVER $49 · 30-DAY MONEY-BACK GUARANTEE ★';
      const saveRes = await saveAsset('sections/header-group.json', JSON.stringify(hg, null, 2), token);
      console.log('   header-group.json updated:', !!saveRes.asset);
    }
  }

  // 2. Scan and clean all willa sections
  const willaKeys = [
    'sections/willa-header.liquid',
    'sections/willa-hero.liquid',
    'sections/willa-main-product.liquid',
    'sections/willa-comparison.liquid',
    'sections/willa-faq.liquid',
    'sections/willa-reviews.liquid',
    'sections/willa-steps.liquid',
    'sections/willa-cart-drawer.liquid',
    'sections/willa-featured-product.liquid',
    'sections/willa-main-collection.liquid'
  ];

  for (const k of willaKeys) {
    console.log(`Checking ${k}...`);
    let content = await fetchAsset(k, token);
    if (!content) continue;

    const original = content;
    content = content.replace(/60-DAY RISK-FREE TRIAL/g, '30-DAY MONEY-BACK GUARANTEE')
                     .replace(/90-DAY RISK-FREE TRIAL/g, '30-DAY MONEY-BACK GUARANTEE')
                     .replace(/90-DAY TRIAL/g, '30-DAY MONEY-BACK GUARANTEE')
                     .replace(/60-DAY TRIAL/g, '30-DAY MONEY-BACK GUARANTEE')
                     .replace(/90-Day Risk-Free Trial/gi, '30-Day Money-Back Guarantee')
                     .replace(/60-Day Risk-Free Trial/gi, '30-Day Money-Back Guarantee')
                     .replace(/90-Day Money-Back Trial/gi, '30-Day Money-Back Guarantee')
                     .replace(/60-Day Money-Back Trial/gi, '30-Day Money-Back Guarantee')
                     .replace(/90-Day Risk-Free Money-Back Guarantee/gi, '30-Day Money-Back Guarantee')
                     .replace(/60-Day Risk-Free Money-Back Guarantee/gi, '30-Day Money-Back Guarantee')
                     .replace(/90-Day Money-Back Guarantee/gi, '30-Day Money-Back Guarantee')
                     .replace(/60-Day Money-Back Guarantee/gi, '30-Day Money-Back Guarantee')
                     .replace(/90-Day Money-Back/gi, '30-Day Money-Back')
                     .replace(/60-Day Money-Back/gi, '30-Day Money-Back')
                     .replace(/90-Day Guarantee/gi, '30-Day Guarantee')
                     .replace(/60-Day Guarantee/gi, '30-Day Guarantee')
                     .replace(/unconditional 90-Day 100% Satisfaction Guarantee/gi, '30-Day Satisfaction Guarantee')
                     .replace(/90-day peace of mind/gi, '30-day peace of mind')
                     .replace(/The 90-day guarantee gave me/gi, 'The 30-day guarantee gave me');

    if (content !== original) {
      const res = await saveAsset(k, content, token);
      console.log(`   ${k} normalized and saved:`, !!res.asset);
    } else {
      console.log(`   ${k} no changes needed.`);
    }
  }

  console.log('Finished updating header and willa sections.');
}

fixHeaderAndWilla().catch(console.error);
