import fs from 'fs';

const SHOP_DOMAIN = 'https://tryzavelyn.com';

const testItems = [
  {
    name: 'Sensory Floor Mats',
    oldHandleUnicode: 'sakerplus®-tpu-sensory-textured-floor-mats',
    oldHandleEncoded: 'sakerplus%C2%AE-tpu-sensory-textured-floor-mats',
    newHandle: 'zavelyn-sensory-floor-mats'
  },
  {
    name: 'Non-Slip Drawer Liner',
    oldHandleUnicode: 'sakerplus®-tearable-non-slip-drawer-liner',
    oldHandleEncoded: 'sakerplus%C2%AE-tearable-non-slip-drawer-liner',
    newHandle: 'zavelyn-tearable-drawer-liner'
  },
  {
    name: 'Shelf & Drawer Liner',
    oldHandleUnicode: 'sakerplus®-tearable-shelf-liner-and-drawer-liner',
    oldHandleEncoded: 'sakerplus%C2%AE-tearable-shelf-liner-and-drawer-liner',
    newHandle: 'zavelyn-shelf-drawer-liner'
  }
];

async function checkRedirectPreflight() {
  console.log('--- PRE-FLIGHT URL & REDIRECT SAFETY CHECK ---');
  const results = [];

  for (const item of testItems) {
    // 1. Check if new URL already exists
    const newUrl = `${SHOP_DOMAIN}/products/${item.newHandle}`;
    let newStatus = 0;
    try {
      const res = await fetch(newUrl, { redirect: 'manual' });
      newStatus = res.status;
    } catch (e) {
      newStatus = 'ERR: ' + e.message;
    }

    // 2. Check current old URL (Unicode)
    const oldUrlUnicode = `${SHOP_DOMAIN}/products/${encodeURI(item.oldHandleUnicode)}`;
    let oldUnicodeStatus = 0;
    try {
      const res = await fetch(oldUrlUnicode, { redirect: 'manual' });
      oldUnicodeStatus = res.status;
    } catch (e) {
      oldUnicodeStatus = 'ERR: ' + e.message;
    }

    // 3. Check current old URL (Encoded)
    const oldUrlEncoded = `${SHOP_DOMAIN}/products/${item.oldHandleEncoded}`;
    let oldEncodedStatus = 0;
    try {
      const res = await fetch(oldUrlEncoded, { redirect: 'manual' });
      oldEncodedStatus = res.status;
    } catch (e) {
      oldEncodedStatus = 'ERR: ' + e.message;
    }

    // 4. Check tracking params on current old URL
    const trackingUrl = `${oldUrlEncoded}?utm_source=fb_ads&utm_campaign=preflight_test&fbclid=AQ123`;
    let trackingStatus = 0;
    try {
      const res = await fetch(trackingUrl, { redirect: 'manual' });
      trackingStatus = res.status;
    } catch (e) {
      trackingStatus = 'ERR: ' + e.message;
    }

    results.push({
      item: item.name,
      newHandle: item.newHandle,
      newUrlStatus: newStatus,
      isNewHandleFree: newStatus === 404,
      oldUrlUnicodeStatus: oldUnicodeStatus,
      oldUrlEncodedStatus: oldEncodedStatus,
      oldWithTrackingStatus: trackingStatus
    });
  }

  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('scripts/batch1_redirect_safety_preflight.json', JSON.stringify(results, null, 2), 'utf8');

  // Verify all new handles are 404 (free to take)
  const allFree = results.every(r => r.isNewHandleFree);
  console.log('All 3 new handles are currently free (HTTP 404):', allFree);
  
  // Verify all old URLs currently resolve (HTTP 200)
  const allOldLive = results.every(r => r.oldUrlEncodedStatus === 200 || r.oldUrlUnicodeStatus === 200);
  console.log('All 3 current URLs resolve live:', allOldLive);
}

checkRedirectPreflight().catch(console.error);
