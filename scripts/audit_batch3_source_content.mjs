import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));

const batch3Ids = [
  '15454948982969', // Flame Effect Space Heater
  '15454949998777', // Handheld Steam Cleaner
  '15454950850745', // Bathroom Exhaust Fan with Light
  '15454951211193', // Outdoor Solar Street Lights
  '15454951801017', // Portable Camping Fan with Light
  '15454954193081', // Tactical MOLLE Utility Vest
  '15454954750137', // Smart Hygrometer Thermometer Clock
  '15454955372729', // 3-in-1 Drywall Board Cutter
  '15454956355769', // Digital Mini Heat Press Machine
  '15454958158009'  // 50FT LED Jobsite String Lights
];

async function shopifyGQL(query, variables = {}, token) {
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return await res.json();
}

async function run() {
  console.log('=== AUDITING BATCH 3 CANDIDATES & FACT-CHECKING CONTENT ===\n');
  const token = await getAccessToken();

  const auditResults = [];

  for (const rawId of batch3Ids) {
    const planItem = plan.find(p => p.productId === rawId);
    const gid = `gid://shopify/Product/${rawId}`;

    const res = await shopifyGQL(`
      query getProd($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          status
          description
          seo {
            title
            description
          }
          variants(first: 10) {
            nodes {
              id
              title
              price
              sku
            }
          }
        }
      }
    `, { id: gid }, token);

    const liveProd = res.data?.product;
    const descText = liveProd?.description || '';

    // Check proposed metadata
    const proposedTitle = planItem.proposedProductTitle;
    const proposedSeoTitle = planItem.proposedSeoPageTitle;
    let proposedMetaDesc = planItem.proposedMetaDescription;

    // Fact-checking specific text in description
    const hasTrademark = (str) => /[\u2122\u00AE]/.test(str);
    const contains6090 = /60-day|90-day/i.test(proposedMetaDesc) || /60-day|90-day/i.test(proposedSeoTitle);
    const containsMedical = /\b(cure|heal|treatment|disease|medical|therapeutic)\b/i.test(proposedMetaDesc);

    auditResults.push({
      productId: rawId,
      gid,
      currentLive: {
        title: liveProd?.title,
        handle: liveProd?.handle,
        status: liveProd?.status,
        variantsCount: liveProd?.variants?.nodes?.length,
        variants: liveProd?.variants?.nodes,
        sourceDescriptionSnippet: descText.slice(0, 300)
      },
      proposedMetadata: {
        title: proposedTitle,
        seoTitle: proposedSeoTitle,
        metaDescription: proposedMetaDesc,
        handlePolicy: 'KEEP CURRENT HANDLE UNCHANGED'
      },
      metrics: {
        titleLength: proposedTitle.length,
        seoTitleLength: proposedSeoTitle.length,
        metaDescLength: proposedMetaDesc.length
      },
      factChecking: {
        trademarkFree: !hasTrademark(proposedTitle) && !hasTrademark(proposedSeoTitle) && !hasTrademark(proposedMetaDesc),
        noInvalidGuarantee: !contains6090,
        noMedicalClaims: !containsMedical,
        statusIsActive: liveProd?.status === 'ACTIVE'
      },
      adsRisk: planItem.adsTrafficRisk
    });

    console.log(`[AUDITED] ${rawId} | "${proposedTitle}" | Variants: ${liveProd?.variants?.nodes?.length}`);
  }

  fs.writeFileSync('scripts/batch3_pre_audit_report.json', JSON.stringify(auditResults, null, 2), 'utf8');
  console.log('\nAudit report saved to scripts/batch3_pre_audit_report.json');
}

run().catch(console.error);
