import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const API_VERSION = '2026-10';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

const batch1Ids = [
  '15454947901625',
  '15454948163769',
  '15454948556985'
];

async function checkBatch1Live() {
  const token = await getAccessToken();
  console.log('Querying current live state for Batch 1 products...');

  const backupData = JSON.parse(fs.readFileSync('scripts/backup_stage3_pre_migration_catalog.json', 'utf8'));

  const query = `
    query getBatch1($id1: ID!, $id2: ID!, $id3: ID!) {
      p1: product(id: $id1) {
        id
        title
        handle
        status
        seo {
          title
          description
        }
        updatedAt
      }
      p2: product(id: $id2) {
        id
        title
        handle
        status
        seo {
          title
          description
        }
        updatedAt
      }
      p3: product(id: $id3) {
        id
        title
        handle
        status
        seo {
          title
          description
        }
        updatedAt
      }
    }
  `;

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      query,
      variables: {
        id1: `gid://shopify/Product/${batch1Ids[0]}`,
        id2: `gid://shopify/Product/${batch1Ids[1]}`,
        id3: `gid://shopify/Product/${batch1Ids[2]}`
      }
    })
  });

  const json = await res.json();
  const liveProducts = [json.data?.p1, json.data?.p2, json.data?.p3];

  const comparisonReport = [];

  for (const live of liveProducts) {
    const rawId = live.id.replace('gid://shopify/Product/', '');
    const backupItem = backupData.find(b => b.id.includes(rawId));

    if (!backupItem) {
      console.error(`ERROR: Product ${rawId} not found in pre-migration backup!`);
      continue;
    }

    const titleMatch = live.title === backupItem.title;
    const handleMatch = live.handle === backupItem.handle;
    const seoTitleMatch = (live.seo?.title || null) === (backupItem.seo?.title || null);
    const seoDescMatch = (live.seo?.description || null) === (backupItem.seo?.description || null);
    const statusMatch = live.status === backupItem.status;

    const isIdentical = titleMatch && handleMatch && seoTitleMatch && seoDescMatch && statusMatch;

    comparisonReport.push({
      productId: rawId,
      titleMatch,
      handleMatch,
      seoTitleMatch,
      seoDescMatch,
      statusMatch,
      isIdenticalToBackup: isIdentical,
      liveData: {
        title: live.title,
        handle: live.handle,
        seoTitle: live.seo?.title,
        seoDescription: live.seo?.description,
        status: live.status,
        updatedAt: live.updatedAt
      },
      backupData: {
        title: backupItem.title,
        handle: backupItem.handle,
        seoTitle: backupItem.seo?.title,
        seoDescription: backupItem.seo?.description,
        status: backupItem.status
      }
    });
  }

  fs.writeFileSync('scripts/batch1_live_audit_comparison.json', JSON.stringify(comparisonReport, null, 2), 'utf8');
  console.log('Saved comparison report to scripts/batch1_live_audit_comparison.json');

  let allClean = true;
  for (const c of comparisonReport) {
    if (!c.isIdenticalToBackup) {
      console.warn(`CONFLICT DETECTED for product ${c.productId}!`);
      allClean = false;
    } else {
      console.log(`Product ${c.productId} matches backup 100%: Title="${c.liveData.title}", Handle="${c.liveData.handle}"`);
    }
  }

  if (allClean) {
    console.log('SUCCESS: All 3 Batch 1 products match initial pre-migration backup 100%. No data conflicts detected.');
  }
}

checkBatch1Live().catch(console.error);
