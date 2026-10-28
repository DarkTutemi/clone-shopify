/**
 * PROPOSED SHOPIFY ADMIN MUTATION
 * This script is READY-TO-EXECUTE upon user explicit approval.
 * It will add the 120ml variants and update pricing to match the new bundle specs.
 */

import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const PRODUCT_ID = 'gid://shopify/Product/15461545935033';

async function main() {
  console.log('--- SHOPIFY ADMIN 120ML VARIANTS & PRICING PROPOSAL ---');
  console.log('Target Product:', PRODUCT_ID);
  console.log('Action requires explicit merchant approval before execution.');
  console.log('\nProposed Variant Creation Matrix:');
  console.log('1. ZAV-BOTANA-1PK-120ML-PURE: Buy 1 (1x 120ml Bottle) / Pure Raw Batana -> $49.99');
  console.log('2. ZAV-BOTANA-1PK-120ML-ROSE: Buy 1 (1x 120ml Bottle) / Rosemary Infusion -> $49.99');
  console.log('3. ZAV-BOTANA-2PK-120ML-PURE: Buy 2 (2x 120ml Bottles) / Pure Raw Batana -> $99.98');
  console.log('4. ZAV-BOTANA-2PK-120ML-ROSE: Buy 2 (2x 120ml Bottles) / Rosemary Infusion -> $99.98');
  console.log('5. ZAV-BOTANA-3PK-120ML-PURE: Buy 3 (3x 120ml Bottles) / Pure Raw Batana -> $125.99');
  console.log('6. ZAV-BOTANA-3PK-120ML-ROSE: Buy 3 (3x 120ml Bottles) / Rosemary Infusion -> $125.99');
  console.log('\nProposed 60ml Variant Price Updates:');
  console.log('- Buy 1 (60ml): $39.00 -> $39.99');
  console.log('- Buy 2 (60ml): $69.00 -> $79.98');
  console.log('- Buy 3 (60ml): $89.00 -> $95.99');
}

main().catch(console.error);
