/**
 * ZAVELYN SEO — FINAL INDEPENDENT POST-MIGRATION AUDIT RUNNER (CORRECTED BASELINE COMPARISON)
 * STRICTLY READ-ONLY. NO MUTATIONS. NO WRITE OPERATIONS.
 * Audits 100% of the 76 ACTIVE products + 7 Exceptions + Storewide Redirects + Policy Consistency.
 */
import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const STORE_DOMAIN = 'https://tryzavelyn.com';
const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const SNAPSHOT_DIR = 'scripts/snapshots';
const BASELINE_FILE = 'scripts/raw_catalog_products.json';

async function fetchWithBackoff(url, options = {}, maxRetries = 4, baseDelay = 3000) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        const retryAfter = res.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt);
        console.warn(`[HTTP 429 Rate Limited] Waiting ${waitTime}ms before retry...`);
        await new Promise(r => setTimeout(r, waitTime));
        attempt++;
        continue;
      }
      return res;
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      const waitTime = baseDelay * Math.pow(2, attempt);
      console.warn(`[Network Retry] ${err.message}. Waiting ${waitTime}ms...`);
      await new Promise(r => setTimeout(r, waitTime));
      attempt++;
    }
  }
  throw new Error(`Max retries reached for ${url}`);
}

async function shopifyGraphQL(query, variables = {}, token) {
  const res = await fetchWithBackoff(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return await res.json();
}

function csvEscape(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// Jaccard similarity for tokenized n-grams
function getSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  const words1 = new Set(s1.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(s2.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

async function runIndependentAudit() {
  console.log('========================================================================');
  console.log('ZAVELYN SEO — FINAL INDEPENDENT POST-MIGRATION AUDIT (READ-ONLY)');
  console.log(`Auditor: Independent QA Agent | Store: ${SHOP} | API: ${API_VERSION}`);
  console.log('========================================================================\n');

  const token = await getAccessToken();

  // Load baseline catalog snapshot (from 6:23 PM before migration started)
  const baselineCatalog = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'));
  const baselineMap = new Map(baselineCatalog.map(p => [p.id, p]));
  console.log(`Loaded ${baselineCatalog.length} baseline products from ${BASELINE_FILE}.`);

  // 1. Fetch All Catalog Products via GraphQL Admin API
  console.log('Step 1: Reading complete live catalog from Shopify Admin GraphQL API...');
  let allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const q = `
      query getAllProdsDetailed($cursor: String) {
        products(first: 50, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            handle
            status
            description
            descriptionHtml
            templateSuffix
            productType
            vendor
            seo {
              title
              description
            }
            variants(first: 25) {
              nodes {
                id
                title
                price
                compareAtPrice
                sku
                inventoryQuantity
                inventoryItem {
                  id
                }
              }
            }
            images(first: 10) {
              nodes {
                id
                url
              }
            }
            collections(first: 10) {
              nodes {
                id
                title
                handle
              }
            }
          }
        }
      }
    `;
    const res = await shopifyGraphQL(q, { cursor }, token);
    const pData = res.data?.products;
    if (pData?.nodes) {
      allProducts.push(...pData.nodes);
    }
    hasNextPage = pData?.pageInfo?.hasNextPage;
    cursor = pData?.pageInfo?.endCursor;
  }
  console.log(`Fetched ${allProducts.length} total products from Shopify Admin.\n`);

  // 2. Fetch Storefront Refund Policy
  console.log('Step 2: Fetching live Storefront Refund Policy...');
  let liveRefundPolicyText = '';
  try {
    const polRes = await fetch(`${STORE_DOMAIN}/policies/refund-policy`);
    const polHtml = await polRes.text();
    const pm = polHtml.match(/<div class="shopify-policy__body">([\s\S]*?)<\/div>/i);
    if (pm) {
      liveRefundPolicyText = pm[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
  } catch (e) {
    console.warn('Could not fetch refund policy page:', e.message);
  }
  console.log(`Live Refund Policy snippet: "${liveRefundPolicyText.slice(0, 150)}..."\n`);

  // 3. Fetch All Storefront URL Redirects
  console.log('Step 3: Reading storewide URL redirects...');
  const redirQ = `
    query getRedirectsList {
      urlRedirects(first: 50) {
        nodes {
          id
          path
          target
        }
      }
    }
  `;
  const redirRes = await shopifyGraphQL(redirQ, {}, token);
  const totalRedirects = redirRes.data?.urlRedirects?.nodes || [];
  console.log(`Total URL Redirects on Store: ${totalRedirects.length}\n`);

  // 4. Index Pre-Write Snapshots
  console.log('Step 4: Indexing pre-write snapshots...');
  const snapshotMap = new Map();
  // Check scripts/snapshots
  if (fs.existsSync(SNAPSHOT_DIR)) {
    const sFiles = fs.readdirSync(SNAPSHOT_DIR).filter(f => f.startsWith('snapshot_prod_') && f.endsWith('.json'));
    for (const f of sFiles) {
      const parts = f.split('_');
      const prodId = parts[2];
      const fullPath = path.join(SNAPSHOT_DIR, f);
      if (!snapshotMap.has(prodId) || f > snapshotMap.get(prodId).filename) {
        snapshotMap.set(prodId, { filename: f, path: fullPath });
      }
    }
  }
  // Check scripts/ root
  const rootSFiles = fs.readdirSync('scripts').filter(f => f.startsWith('snapshot_prod_') && f.endsWith('.json'));
  for (const f of rootSFiles) {
    const parts = f.split('_');
    const prodId = parts[2];
    const fullPath = path.join('scripts', f);
    if (!snapshotMap.has(prodId) || f > snapshotMap.get(prodId).filename) {
      snapshotMap.set(prodId, { filename: f, path: fullPath });
    }
  }
  console.log(`Indexed pre-write snapshots for ${snapshotMap.size} distinct product IDs.\n`);

  // 5. Audit Each Active Product
  console.log('Step 5: Performing Deep Independent Audit for 76 ACTIVE products...');

  const batch1Ids = ['15454947901625', '15454948163769', '15454948556985'];
  const batch2Ids = [
    '15454949540025', '15454950490297', '15454952882361', '15454953177273',
    '15454955765945', '15454959403193', '15454960517305', '15454961565881',
    '15454963073209', '15454963433657'
  ];

  const activeProducts = allProducts.filter(p => p.status === 'ACTIVE');
  console.log(`Found ${activeProducts.length} ACTIVE products (Expected: 76).\n`);

  const fullAuditRows = [];
  const integrityRows = [];
  const suspiciousRows = [];
  const seenSeoTitles = new Map();
  const seenMetaDescs = new Map();

  for (let idx = 0; idx < activeProducts.length; idx++) {
    const p = activeProducts[idx];
    const rawId = p.id.replace('gid://shopify/Product/', '');
    let batchLabel = 'Batches 3-9';
    if (batch1Ids.includes(rawId)) batchLabel = 'Batch 1';
    else if (batch2Ids.includes(rawId)) batchLabel = 'Batch 2';

    const pNum = idx + 1;

    // A. DATA INTEGRITY CHECK (Snapshot + Baseline Catalog)
    const snapInfo = snapshotMap.get(rawId);
    const baseProd = baselineMap.get(p.id);
    let integrityStatus = 'INTEGRITY_PASS';
    let integrityIssues = [];

    // Check baseline comparisons
    if (baseProd) {
      if (baseProd.description !== p.description) {
        integrityIssues.push('Product description modified');
      }
      if (baseProd.vendor !== p.vendor) {
        integrityIssues.push(`Vendor modified ("${baseProd.vendor}" -> "${p.vendor}")`);
      }
      if (baseProd.productType !== p.productType) {
        integrityIssues.push(`ProductType modified ("${baseProd.productType}" -> "${p.productType}")`);
      }
    } else {
      integrityIssues.push('Product missing from baseline catalog');
    }

    // Check pre-write snapshot comparisons
    if (snapInfo) {
      const snap = JSON.parse(fs.readFileSync(snapInfo.path, 'utf8'));

      // Check status
      if (snap.status !== p.status) integrityIssues.push(`Status changed (${snap.status} -> ${p.status})`);

      // Check variants against baseline totalVariants and pre-write snapshot
      if (baseProd && baseProd.totalVariants !== p.variants?.nodes?.length) {
        integrityIssues.push(`variant count changed (${baseProd.totalVariants} -> ${p.variants?.nodes?.length})`);
      }

      const snapVariants = snap.variants?.nodes || [];
      const liveVariants = p.variants?.nodes || [];
      // Compare available snapshot variants field-by-field
      for (let vIdx = 0; vIdx < snapVariants.length; vIdx++) {
        const sv = snapVariants[vIdx];
        const lv = liveVariants[vIdx];
        if (!lv) {
          integrityIssues.push(`variant[${vIdx}] missing in live product`);
        } else {
          if (sv.id !== lv.id) integrityIssues.push(`variant[${vIdx}] ID mismatch`);
          if (sv.price !== lv.price) integrityIssues.push(`variant[${vIdx}] price modified (${sv.price} -> ${lv.price})`);
          if (sv.sku !== lv.sku) integrityIssues.push(`variant[${vIdx}] sku modified (${sv.sku} -> ${lv.sku})`);
        }
      }

      // Check handle
      if (batchLabel === 'Batch 1') {
        if (p.handle === snap.handle) integrityIssues.push('Batch 1 handle was not updated');
      } else {
        if (p.handle !== snap.handle) integrityIssues.push(`Handle changed unexpectedly from "${snap.handle}" to "${p.handle}"`);
      }
    } else {
      integrityIssues.push('Pre-write snapshot file missing');
    }

    if (integrityIssues.length > 0) {
      integrityStatus = 'INTEGRITY_FAIL';
    }

    integrityRows.push({
      productId: rawId,
      batch: batchLabel,
      title: p.title,
      snapshotAvailable: !!snapInfo,
      snapshotFile: snapInfo?.filename || 'NONE',
      baselineMatched: !!baseProd,
      integrityStatus,
      integrityIssues: integrityIssues.join('; ') || 'NONE'
    });

    // B. SEO METADATA QUALITY AUDIT
    const seoTitle = p.seo?.title || '';
    const metaDesc = p.seo?.description || '';
    const qualityIssues = [];

    // Trademark check
    if (/[\u2122\u00AE]/.test(p.title) || /[\u2122\u00AE]/.test(seoTitle) || /[\u2122\u00AE]/.test(metaDesc)) {
      qualityIssues.push('Contains trademark symbol');
    }

    // Brand Zavelyn in SEO Title
    const zavelynCount = (seoTitle.match(/Zavelyn/gi) || []).length;
    if (zavelynCount === 0) qualityIssues.push('Missing Zavelyn brand in SEO Title');
    if (zavelynCount > 1) qualityIssues.push(`Multiple Zavelyn mentions in SEO Title (${zavelynCount})`);

    // Length check
    if (seoTitle.length < 35 || seoTitle.length > 75) {
      qualityIssues.push(`SEO Title length (${seoTitle.length} chars) outside optimal range 35-75`);
    }
    if (metaDesc.length < 115 || metaDesc.length > 170) {
      qualityIssues.push(`Meta Description length (${metaDesc.length} chars) outside optimal range 115-170`);
    }

    // Prohibited guarantee terms
    if (/60[- ]day\s*(money[- ]back\s*)?guarantee/i.test(metaDesc) || /90[- ]day/i.test(metaDesc) || /100%\s*risk[- ]free/i.test(metaDesc)) {
      qualityIssues.push('Prohibited guarantee term (60/90-day/risk-free) in Meta Desc');
    }

    // Medical claims
    if (/\b(cure|heals?|disease|medical treatment)\b/i.test(p.title) || /\b(cure|heals?|disease|medical treatment)\b/i.test(metaDesc)) {
      qualityIssues.push('Unverified medical claim in Title/Meta');
    }

    // Duplicate check
    if (seenSeoTitles.has(seoTitle)) {
      qualityIssues.push(`Duplicate SEO Title (same as product ${seenSeoTitles.get(seoTitle)})`);
    } else {
      seenSeoTitles.set(seoTitle, rawId);
    }

    if (seenMetaDescs.has(metaDesc)) {
      qualityIssues.push(`Duplicate Meta Description (same as product ${seenMetaDescs.get(metaDesc)})`);
    } else {
      seenMetaDescs.set(metaDesc, rawId);
    }

    // Similarity check against previously seen meta descriptions
    for (const [prevDesc, prevId] of seenMetaDescs.entries()) {
      if (prevId !== rawId) {
        const sim = getSimilarity(metaDesc, prevDesc);
        if (sim > 0.85) {
          qualityIssues.push(`High content similarity (${Math.round(sim*100)}%) with product ${prevId}`);
          break;
        }
      }
    }

    // C. LIVE STOREFRONT HTTP & RENDERED META AUDIT
    const storefrontUrl = `${STORE_DOMAIN}/products/${encodeURIComponent(p.handle)}`;
    let sfStatus = 0;
    let sfRenderedTitle = '';
    let sfRenderedMeta = '';
    let sfCanonical = '';
    let sfIssues = [];

    try {
      await new Promise(r => setTimeout(r, 1000)); // Pacing
      const sfRes = await fetchWithBackoff(storefrontUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) QA-Auditor/1.0' }
      });
      sfStatus = sfRes.status;
      if (sfStatus !== 200) {
        sfIssues.push(`Storefront returned HTTP ${sfStatus}`);
      } else {
        const html = await sfRes.text();
        const tm = html.match(/<title>([^<]+)<\/title>/i);
        sfRenderedTitle = tm ? tm[1].trim() : '';
        const mm = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
        sfRenderedMeta = mm ? mm[1].trim() : '';
        const cm = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
        sfCanonical = cm ? cm[1].trim() : '';

        if (!sfRenderedTitle.includes('Zavelyn')) {
          sfIssues.push('Rendered <title> does not include Zavelyn');
        }
        if (!sfRenderedMeta || sfRenderedMeta.length < 80) {
          sfIssues.push('Rendered meta description missing or too short');
        }
      }
    } catch (e) {
      sfIssues.push(`Storefront network error: ${e.message}`);
    }

    // D. OVERALL PRODUCT VERDICT
    let finalStatus = 'VERIFIED';
    const allProductIssues = [...integrityIssues, ...qualityIssues, ...sfIssues];

    if (integrityStatus === 'INTEGRITY_FAIL' || sfStatus !== 200) {
      finalStatus = 'FAILED';
    } else if (allProductIssues.length > 0) {
      finalStatus = 'NEEDS_REVIEW';
    }

    if (finalStatus !== 'VERIFIED') {
      suspiciousRows.push({
        productId: rawId,
        title: p.title,
        handle: p.handle,
        batch: batchLabel,
        status: finalStatus,
        issues: allProductIssues.join(' | ')
      });
    }

    fullAuditRows.push({
      productId: rawId,
      title: p.title,
      batch: batchLabel,
      status: p.status,
      handle: p.handle,
      seoTitle,
      seoTitleLength: seoTitle.length,
      metaDesc,
      metaDescLength: metaDesc.length,
      variantsCount: p.variants?.nodes?.length || 0,
      imagesCount: p.images?.nodes?.length || 0,
      collectionsCount: p.collections?.nodes?.length || 0,
      templateSuffix: p.templateSuffix || 'DEFAULT',
      integrityStatus,
      storefrontHttp: sfStatus,
      renderedTitle: sfRenderedTitle,
      canonicalUrl: sfCanonical,
      qaVerdict: finalStatus,
      auditNotes: allProductIssues.join('; ') || '100% VERIFIED PASS'
    });

    console.log(`[${pNum}/${activeProducts.length}] Product ${rawId} | Verdict: ${finalStatus} | Integrity: ${integrityStatus} | SF HTTP: ${sfStatus}`);
  }

  // 6. Test 3 Batch 1 301 Redirects & Tracking Parameters
  console.log('\nStep 6: Testing Batch 1 URL Redirects & Tracking Parameter Preservation...');
  const batch1RedirectTests = [
    {
      oldHandle: 'sakerplus®-tpu-sensory-textured-floor-mats',
      newHandle: 'zavelyn-sensory-floor-mats'
    },
    {
      oldHandle: 'sakerplus®-tearable-non-slip-drawer-liner',
      newHandle: 'zavelyn-tearable-drawer-liner'
    },
    {
      oldHandle: 'sakerplus®-tearable-shelf-liner-and-drawer-liner',
      newHandle: 'zavelyn-shelf-drawer-liner'
    }
  ];

  const redirectResults = [];
  for (const b1r of batch1RedirectTests) {
    const testQuery = '?utm_source=qa_independent&utm_medium=cpc&fbclid=QA_TOKEN_999';
    const oldUrl = `${STORE_DOMAIN}/products/${encodeURIComponent(b1r.oldHandle)}${testQuery}`;
    const expectedTarget = `${STORE_DOMAIN}/products/${b1r.newHandle}`;

    console.log(`Checking Redirect: /products/${b1r.oldHandle} ...`);
    const rRes = await fetch(oldUrl, { redirect: 'manual' });
    const location = rRes.headers.get('location');
    const is301 = rRes.status === 301 || rRes.status === 302;
    const preservesQuery = location && location.includes('fbclid=QA_TOKEN_999') && location.includes('utm_source=qa_independent');

    // Follow to target
    const targetRes = await fetch(expectedTarget);
    const targetHttp = targetRes.status;

    redirectResults.push({
      oldHandle: b1r.oldHandle,
      newHandle: b1r.newHandle,
      httpStatus: rRes.status,
      isRedirect: is301,
      targetLocation: location,
      preservesQuery,
      targetHttp
    });
    console.log(`  -> HTTP ${rRes.status} | Redirect to: ${location} | Query Preserved: ${preservesQuery} | Target HTTP: ${targetHttp}`);
  }

  // 7. Storewide Guarantee / Policy Scan in Theme Files
  console.log('\nStep 7: Scanning theme files for guarantee consistency...');
  const searchDirs = ['sections', 'snippets', 'templates'];
  const guaranteeIssues = [];
  const guaranteeRegex = /\b(60[- ]day|90[- ]day|risk[- ]free trial)\b/gi;

  for (const d of searchDirs) {
    if (fs.existsSync(d)) {
      const files = fs.readdirSync(d);
      for (const f of files) {
        const full = path.join(d, f);
        if (fs.statSync(full).isFile() && (f.endsWith('.liquid') || f.endsWith('.json'))) {
          const content = fs.readFileSync(full, 'utf8');
          const matches = content.match(guaranteeRegex);
          if (matches) {
            guaranteeIssues.push({
              file: full,
              matchCount: matches.length,
              sampleTerms: [...new Set(matches.map(m => m.toLowerCase()))].join(', ')
            });
          }
        }
      }
    }
  }
  console.log(`Found ${guaranteeIssues.length} theme files containing non-standard guarantee terms (60/90-Day, Risk-Free).`);

  // 8. Generate Deliverable CSVs
  console.log('\nStep 8: Writing output CSV files...');

  // CSV 1: Full Product Audit CSV (76 Active)
  const auditHeader = 'Product_ID,Product_Title,Batch,Status,URL_Handle,SEO_Page_Title,SEO_Title_Length,Meta_Description,Meta_Desc_Length,Variants_Count,Images_Count,Collections_Count,Template_Suffix,Integrity_Status,Storefront_HTTP,QA_Verdict,Audit_Notes\n';
  const auditContent = auditHeader + fullAuditRows.map(r => [
    csvEscape(r.productId),
    csvEscape(r.title),
    csvEscape(r.batch),
    csvEscape(r.status),
    csvEscape(r.handle),
    csvEscape(r.seoTitle),
    csvEscape(r.seoTitleLength),
    csvEscape(r.metaDesc),
    csvEscape(r.metaDescLength),
    csvEscape(r.variantsCount),
    csvEscape(r.imagesCount),
    csvEscape(r.collectionsCount),
    csvEscape(r.templateSuffix),
    csvEscape(r.integrityStatus),
    csvEscape(r.storefrontHttp),
    csvEscape(r.qaVerdict),
    csvEscape(r.auditNotes)
  ].join(',')).join('\n');

  fs.writeFileSync('ZAVELYN_INDEPENDENT_AUDIT_76_ACTIVE.csv', auditContent, 'utf8');
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'ZAVELYN_INDEPENDENT_AUDIT_76_ACTIVE.csv'), auditContent, 'utf8');

  // CSV 2: Suspicious / Failed Products
  const suspHeader = 'Product_ID,Product_Title,Batch,URL_Handle,Status,Issues\n';
  const suspContent = suspHeader + suspiciousRows.map(s => [
    csvEscape(s.productId),
    csvEscape(s.title),
    csvEscape(s.batch),
    csvEscape(s.handle),
    csvEscape(s.status),
    csvEscape(s.issues)
  ].join(',')).join('\n');

  fs.writeFileSync('ZAVELYN_QA_SUSPICIOUS_PRODUCTS.csv', suspContent, 'utf8');
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'ZAVELYN_QA_SUSPICIOUS_PRODUCTS.csv'), suspContent, 'utf8');

  // CSV 3: Data Integrity Report
  const integHeader = 'Product_ID,Batch,Product_Title,Snapshot_Available,Snapshot_File,Baseline_Matched,Integrity_Status,Integrity_Issues\n';
  const integContent = integHeader + integrityRows.map(i => [
    csvEscape(i.productId),
    csvEscape(i.batch),
    csvEscape(i.title),
    csvEscape(i.snapshotAvailable),
    csvEscape(i.snapshotFile),
    csvEscape(i.baselineMatched),
    csvEscape(i.integrityStatus),
    csvEscape(i.integrityIssues)
  ].join(',')).join('\n');

  fs.writeFileSync('ZAVELYN_DATA_INTEGRITY_AUDIT.csv', integContent, 'utf8');
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'ZAVELYN_DATA_INTEGRITY_AUDIT.csv'), integContent, 'utf8');

  // CSV 4: Guarantee Issues in Theme
  const guarHeader = 'File_Path,Match_Count,Sample_Terms,Standard_Policy\n';
  const guarContent = guarHeader + guaranteeIssues.map(g => [
    csvEscape(g.file),
    csvEscape(g.matchCount),
    csvEscape(g.sampleTerms),
    csvEscape('30-Day Return Policy (Unused/Unworn in original packaging)')
  ].join(',')).join('\n');

  fs.writeFileSync('ZAVELYN_STOREWIDE_GUARANTEE_AUDIT.csv', guarContent, 'utf8');
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'ZAVELYN_STOREWIDE_GUARANTEE_AUDIT.csv'), guarContent, 'utf8');

  // Save JSON summary for final report generation
  const summaryReport = {
    auditTimestamp: new Date().toISOString(),
    totalCatalogProducts: allProducts.length,
    activeProductsCount: activeProducts.length,
    draftProductsCount: allProducts.filter(p => p.status === 'DRAFT').length,
    unlistedProductsCount: allProducts.filter(p => p.id.includes('15455032115385')).length,
    verifiedCount: fullAuditRows.filter(r => r.qaVerdict === 'VERIFIED').length,
    needsReviewCount: fullAuditRows.filter(r => r.qaVerdict === 'NEEDS_REVIEW').length,
    failedCount: fullAuditRows.filter(r => r.qaVerdict === 'FAILED').length,
    redirectsAudit: {
      totalStoreRedirects: totalRedirects.length,
      batch1Tests: redirectResults
    },
    themeGuaranteeAudit: {
      filesWithNonStandardTerms: guaranteeIssues.length,
      storeRefundPolicySnippet: liveRefundPolicyText.slice(0, 200)
    }
  };

  fs.writeFileSync('scripts/independent_qa_summary.json', JSON.stringify(summaryReport, null, 2), 'utf8');
  console.log('\nINDEPENDENT AUDIT COMPLETED SUCCESSFULLY!');
  console.log(`Results: ${summaryReport.verifiedCount} VERIFIED | ${summaryReport.needsReviewCount} NEEDS REVIEW | ${summaryReport.failedCount} FAILED`);
}

runIndependentAudit().catch(err => {
  console.error('FATAL AUDIT ERROR:', err);
  process.exit(1);
});
