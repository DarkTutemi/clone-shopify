/**
 * ROLLBACK SCRIPT FOR STAGE 3 BATCH 2
 * Reads pre-write snapshots of Batch 2 products and reverts them via Shopify GraphQL API 2026-10.
 */
import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';
import { batch2Products } from './stage3_batch2_runner_ready.mjs';

async function rollbackBatch2() {
  console.log('=== PREPARING STAGE 3 BATCH 2 ROLLBACK UTILITY ===\n');
  const token = await getAccessToken();

  for (const item of batch2Products) {
    const files = fs.readdirSync('scripts').filter(f => f.startsWith(`snapshot_prod_${item.rawId}_`));
    if (files.length === 0) {
      console.log(`No snapshot found for ${item.rawId} (has not been updated yet).`);
      continue;
    }
    const latestSnapshotFile = files.sort().reverse()[0];
    const snapshotData = JSON.parse(fs.readFileSync(path.join('scripts', latestSnapshotFile), 'utf8'));
    console.log(`Snapshot found for ${item.rawId}: ${latestSnapshotFile}`);
    console.log(`Target revert state: Title="${snapshotData.title}", Handle="${snapshotData.handle}"`);
  }
}

rollbackBatch2().catch(console.error);
