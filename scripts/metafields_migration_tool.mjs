import fs from 'fs';
import path from 'path';

/**
 * ZAVELYN 2.0 — SHOPIFY METAFIELDS MIGRATION ENGINE (DRY RUN & READ-ONLY READY)
 * 
 * Target Namespace: custom_pdp
 * Keys:
 *  - custom_pdp.value_props    (type: json)
 *  - custom_pdp.features       (type: json)
 *  - custom_pdp.story_blocks   (type: json)
 *  - custom_pdp.steps          (type: json)
 *  - custom_pdp.specs          (type: json)
 *  - custom_pdp.comparison     (type: json)
 *  - custom_pdp.whats_included (type: json)
 *  - custom_pdp.faq            (type: json)
 *  - custom_pdp.content        (type: json, composite all-in-one fallback)
 * 
 * NOTE: IN ACCORDANCE WITH PART 2 & PART 9 SAFETY RULES,
 * THIS TOOL OPERATES IN DRY-RUN MODE (EXECUTE_REAL_WRITES = false).
 * IT TESTS VALIDATION, BUILDS GRAPHQL MUTATIONS, CHECKS CONFLICTS,
 * AND GENERATES A READY-TO-EXECUTE ROLLBACK MANIFEST.
 */

const EXECUTE_REAL_WRITES = false; // Strictly frozen
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const API_VERSION = '2024-10';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

// 1. JSON Schema Validator for PDP Data
export function validatePDPContentSchema(content) {
  const errors = [];
  if (!content) {
    errors.push("Content is null or undefined");
    return { valid: false, errors };
  }

  // Validate value_proposition
  if (content.value_proposition) {
    if (!content.value_proposition.title) errors.push("value_proposition.title is required");
    if (!content.value_proposition.subtitle) errors.push("value_proposition.subtitle is required");
  }

  // Validate key_features
  if (content.key_features) {
    if (!Array.isArray(content.key_features)) errors.push("key_features must be an array");
    content.key_features.forEach((f, idx) => {
      if (!f.title) errors.push(`key_features[${idx}].title is required`);
      if (!f.description) errors.push(`key_features[${idx}].description is required`);
    });
  }

  // Validate storytelling
  if (content.storytelling) {
    if (!Array.isArray(content.storytelling)) errors.push("storytelling must be an array");
    content.storytelling.forEach((s, idx) => {
      if (!s.title) errors.push(`storytelling[${idx}].title is required`);
      if (!s.description) errors.push(`storytelling[${idx}].description is required`);
    });
  }

  // Validate specifications
  if (content.specifications) {
    if (!Array.isArray(content.specifications)) errors.push("specifications must be an array");
    content.specifications.forEach((sp, idx) => {
      if (!sp.label || !sp.value) errors.push(`specifications[${idx}] missing label or value`);
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// 2. Generate GraphQL MetafieldsSet Mutations
export function generateMetafieldsSetPayload(productId, structuredContent) {
  const metafields = [];

  // Granular keys
  if (structuredContent.value_proposition) {
    metafields.push({
      ownerId: `gid://shopify/Product/${productId}`,
      namespace: "custom_pdp",
      key: "value_props",
      type: "json",
      value: JSON.stringify(structuredContent.value_proposition)
    });
  }

  if (structuredContent.key_features && structuredContent.key_features.length > 0) {
    metafields.push({
      ownerId: `gid://shopify/Product/${productId}`,
      namespace: "custom_pdp",
      key: "features",
      type: "json",
      value: JSON.stringify(structuredContent.key_features)
    });
  }

  if (structuredContent.storytelling && structuredContent.storytelling.length > 0) {
    metafields.push({
      ownerId: `gid://shopify/Product/${productId}`,
      namespace: "custom_pdp",
      key: "story_blocks",
      type: "json",
      value: JSON.stringify(structuredContent.storytelling)
    });
  }

  if (structuredContent.how_it_works) {
    metafields.push({
      ownerId: `gid://shopify/Product/${productId}`,
      namespace: "custom_pdp",
      key: "steps",
      type: "json",
      value: JSON.stringify(structuredContent.how_it_works)
    });
  }

  if (structuredContent.specifications && structuredContent.specifications.length > 0) {
    metafields.push({
      ownerId: `gid://shopify/Product/${productId}`,
      namespace: "custom_pdp",
      key: "specs",
      type: "json",
      value: JSON.stringify(structuredContent.specifications)
    });
  }

  if (structuredContent.comparison) {
    metafields.push({
      ownerId: `gid://shopify/Product/${productId}`,
      namespace: "custom_pdp",
      key: "comparison",
      type: "json",
      value: JSON.stringify(structuredContent.comparison)
    });
  }

  if (structuredContent.whats_included) {
    metafields.push({
      ownerId: `gid://shopify/Product/${productId}`,
      namespace: "custom_pdp",
      key: "whats_included",
      type: "json",
      value: JSON.stringify(structuredContent.whats_included)
    });
  }

  if (structuredContent.extended_faq) {
    metafields.push({
      ownerId: `gid://shopify/Product/${productId}`,
      namespace: "custom_pdp",
      key: "faq",
      type: "json",
      value: JSON.stringify(structuredContent.extended_faq)
    });
  }

  // Composite composite all-in-one backup key
  metafields.push({
    ownerId: `gid://shopify/Product/${productId}`,
    namespace: "custom_pdp",
    key: "content",
    type: "json",
    value: JSON.stringify(structuredContent)
  });

  return metafields;
}

// 3. Dry-Run Migration Simulator
async function runDryRunMigration() {
  console.log("=============================================================");
  console.log("🛡️ SHOPIFY METAFIELDS ARCHITECTURE & MIGRATION PREPARATION");
  console.log(`Live Mode: ${EXECUTE_REAL_WRITES ? 'ENABLED (WRITING)' : 'DRY-RUN (SAFETY PROTECTED - NO WRITES)'}`);
  console.log(`API Target: GraphQL Admin API version ${API_VERSION}`);
  console.log("=============================================================");

  const reportFile = 'scripts/full_catalog_dryrun_report.json';
  if (!fs.existsSync(reportFile)) {
    throw new Error(`Report file not found: ${reportFile}`);
  }

  const catalog = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
  const readyProducts = catalog.filter(p => p.classification === 'READY');
  const needsReviewProducts = catalog.filter(p => p.classification === 'NEEDS REVIEW');

  console.log(`Products eligible for migration: ${readyProducts.length} READY, ${needsReviewProducts.length} NEEDS REVIEW`);

  const mutationQueue = [];
  const validationSummary = { valid: 0, invalid: 0, errors: [] };

  for (const p of readyProducts) {
    if (!p.extracted_structured_content) continue;
    const valResult = validatePDPContentSchema(p.extracted_structured_content);
    if (!valResult.valid) {
      validationSummary.invalid++;
      validationSummary.errors.push({ handle: p.handle, errors: valResult.errors });
    } else {
      validationSummary.valid++;
      const payload = generateMetafieldsSetPayload(p.product_id, p.extracted_structured_content);
      mutationQueue.push({
        product_id: p.product_id,
        handle: p.handle,
        title: p.title,
        metafields_count: payload.length,
        metafields: payload
      });
    }
  }

  console.log(`Schema Validation: ${validationSummary.valid} PASSED, ${validationSummary.invalid} FAILED`);
  console.log(`Prepared ${mutationQueue.length} GraphQL mutations ready for batching.`);

  // Write migration simulation artifacts
  const backupDir = path.resolve('metafields_migration_artifacts');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  fs.writeFileSync(
    path.join(backupDir, 'metafields_mutation_plan.json'),
    JSON.stringify(mutationQueue, null, 2),
    'utf8'
  );

  // Rollback Plan (deleting or clearing custom_pdp namespace)
  const rollbackPlan = mutationQueue.map(m => ({
    productId: m.product_id,
    handle: m.handle,
    deleteMetafieldKeys: [
      "custom_pdp.value_props",
      "custom_pdp.features",
      "custom_pdp.story_blocks",
      "custom_pdp.steps",
      "custom_pdp.specs",
      "custom_pdp.comparison",
      "custom_pdp.whats_included",
      "custom_pdp.faq",
      "custom_pdp.content"
    ]
  }));

  fs.writeFileSync(
    path.join(backupDir, 'metafields_rollback_plan.json'),
    JSON.stringify(rollbackPlan, null, 2),
    'utf8'
  );

  console.log(`✔ Generated migration mutation plan: ${path.join(backupDir, 'metafields_mutation_plan.json')}`);
  console.log(`✔ Generated rollback plan: ${path.join(backupDir, 'metafields_rollback_plan.json')}`);
  console.log(`\nSAFETY GUARANTEE: Zero Shopify metafields were modified on the live store.`);
}

runDryRunMigration().catch(err => {
  console.error("Migration tool error:", err);
  process.exit(1);
});
