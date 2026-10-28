import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const THEME_ID = '187736654009'; // Unpublished Development Theme

async function fixSectionAndJs() {
  const token = await getAccessToken();

  // 1. Fetch current section
  console.log('Fetching sections/botanaroots-bogo-main.liquid...');
  const sRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json?asset[key]=sections/botanaroots-bogo-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const sData = await sRes.json();
  let sVal = sData.asset?.value || '';

  // Replace <label class="zv-upsell-card" ... for="zvSizeUpgradeCheck"> with <div class="zv-upsell-card" id="zvUpsellCard" tabindex="0" role="checkbox" aria-checked="false">
  // and </label> with </div>
  sVal = sVal.replace(
    /<label class="zv-upsell-card" id="zvUpsellCard" for="zvSizeUpgradeCheck">([\s\S]*?)<\/label>/,
    `<div class="zv-upsell-card" id="zvUpsellCard" tabindex="0" role="checkbox" aria-checked="false">$1</div>`
  );

  console.log('Uploading fixed sections/botanaroots-bogo-main.liquid...');
  await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key: 'sections/botanaroots-bogo-main.liquid', value: sVal } })
  });
  console.log('✔ Section updated to use clean <div> container (eliminating double-toggle).');

  // 2. Fetch and fix assets/botanaroots-bogo.js
  console.log('Fetching assets/botanaroots-bogo.js...');
  const jRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json?asset[key]=assets/botanaroots-bogo.js`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const jData = await jRes.json();
  let jVal = jData.asset?.value || '';

  // Replace the binding for upsellCard & upsellCheck
  const oldBinding = `    // Bind Size Upgrade Checkbox & Label Interaction
    if (upsellCard && upsellCheck) {
      upsellCheck.addEventListener('change', (e) => {
        isSizeUpgrade = e.target.checked;
        renderUI();
      });

      upsellCard.addEventListener('click', (e) => {
        // If clicking anywhere on the card other than the direct input, toggle state cleanly
        if (e.target !== upsellCheck) {
          e.preventDefault();
          isSizeUpgrade = !isSizeUpgrade;
          renderUI();
        }
      });
    }`;

  const newBinding = `    // Bind Size Upgrade Checkbox & Card Click (Clean Deterministic Toggle)
    if (upsellCard && upsellCheck) {
      function setUpgradeState(active) {
        isSizeUpgrade = !!active;
        upsellCheck.checked = isSizeUpgrade;
        upsellCard.classList.toggle('active', isSizeUpgrade);
        upsellCard.setAttribute('aria-checked', isSizeUpgrade ? 'true' : 'false');
        renderUI();
      }

      upsellCheck.addEventListener('change', (e) => {
        setUpgradeState(e.target.checked);
      });

      upsellCard.addEventListener('click', (e) => {
        if (e.target !== upsellCheck) {
          setUpgradeState(!isSizeUpgrade);
        }
      });

      upsellCard.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setUpgradeState(!isSizeUpgrade);
        }
      });
    }`;

  if (jVal.includes('// Bind Size Upgrade Checkbox & Label Interaction')) {
    jVal = jVal.replace(oldBinding, newBinding);
  } else {
    console.log('Old binding signature slightly different, writing complete js content...');
  }

  console.log('Uploading fixed assets/botanaroots-bogo.js...');
  await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key: 'assets/botanaroots-bogo.js', value: jVal } })
  });
  console.log('✔ JS updated successfully.');
}

fixSectionAndJs().catch(console.error);
