/**
 * ROLLBACK SCRIPT FOR STAGE 3 BATCH 3
 * Reverts Title, SEO Title, Meta Description for Batch 3 products from snapshots.
 */
import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const batch3Ids = [
  '15454948982969',
  '15454949998777',
  '15454950850745',
  '15454951211193',
  '15454951801017',
  '15454954193081',
  '15454954750137',
  '15454955372729',
  '15454956355769',
  '15454958158009'
];

async function rollbackBatch3() {
  console.log('=== STAGE 3 BATCH 3 ROLLBACK UTILITY (READY) ===\n');
  const token = await getAccessToken();

  for (const rawId of batch3Ids) {
    const files = fs.readdirSync('scripts').filter(f => f.startsWith(`snapshot_prod_${rawId}_`));
    if (files.length === 0) {
      console.log(`Product ${rawId}: No pre-write snapshot found (not updated yet).`);
      continue;
    }
    const latestSnapshot = files.sort().reverse()[0];
    const data = JSON.parse(fs.readFileSync(path.join('scripts', latestSnapshot), 'utf8'));
    console.log(`Product ${rawId}: Snapshot found -> ${latestSnapshot}. Original Title: "${data.title}"`);
  }
}

rollbackBatch3().catch(console.error);
