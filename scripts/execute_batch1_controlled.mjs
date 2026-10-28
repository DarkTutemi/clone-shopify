import fs from 'fs';
import { batch1Payload, getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function executeBatch1() {
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  console.log(`=== EXECUTING CONTROLLED BATCH 1 MIGRATION (API: ${API_VERSION}) ===`);

  // 1. FRESH SNAPSHOT BACKUP BEFORE WRITING
  const preWriteSnapshot = [];
  for (const item of batch1Payload) {
    const q = `
      query getProd($id: ID!) {
        product(id: $id) {
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
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query: q, variables: { id: item.id } })
    });
    const json = await res.json();
    preWriteSnapshot.push(json.data?.product);
  }

  const snapshotFile = `scripts/backup_batch1_pre_write_${timestamp}.json`;
  fs.writeFileSync(snapshotFile, JSON.stringify(preWriteSnapshot, null, 2), 'utf8');
  console.log(`Step 1: Fresh pre-write snapshot saved to ${snapshotFile}`);

  const executionLog = {
    timestamp: new Date().toISOString(),
    apiVersion: API_VERSION,
    snapshotFile,
    updates: [],
    redirects: [],
    liveHttpTests: []
  };

  // 2. EXECUTE PRODUCT UPDATE
  for (const item of batch1Payload) {
    console.log(`Step 2: Updating product ${item.id} -> "${item.title}"...`);
    const mutation = `
      mutation updateProduct($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
            title
            handle
            seo {
              title
              description
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const updateInput = {
      id: item.id,
      title: item.title,
      handle: item.handle,
      seo: item.seo
    };

    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query: mutation, variables: { input: updateInput } })
    });

    const json = await res.json();
    const result = json.data?.productUpdate;
    executionLog.updates.push({
      productId: item.id,
      requested: updateInput,
      response: result
    });

    if (result?.userErrors && result.userErrors.length > 0) {
      console.error(`ERROR updating ${item.id}:`, result.userErrors);
      throw new Error(`Migration stopped due to update error on ${item.id}`);
    }

    console.log(`Product ${item.id} updated successfully: New handle="${result?.product?.handle}"`);

    // 3. CHECK OR CREATE 301 REDIRECT
    const oldPath = `/products/${item.oldHandle}`;
    const newPath = `/products/${item.handle}`;

    // Check if Shopify already created redirect
    const checkRedirectQuery = `
      query findRedirect($path: String!) {
        urlRedirects(first: 5, query: $path) {
          nodes {
            id
            path
            target
          }
        }
      }
    `;

    const rCheckRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query: checkRedirectQuery, variables: { path: `path:${oldPath}` } })
    });
    const rCheckJson = await rCheckRes.json();
    const existingMatches = rCheckJson.data?.urlRedirects?.nodes || [];
    const exactMatch = existingMatches.find(r => r.path === oldPath && r.target === newPath);

    if (exactMatch) {
      console.log(`301 Redirect for ${oldPath} already automatically created by Shopify: ID ${exactMatch.id}`);
      executionLog.redirects.push({
        status: 'ALREADY_EXISTS_AUTOMATIC',
        redirect: exactMatch
      });
    } else {
      console.log(`Creating 301 redirect: ${oldPath} -> ${newPath}...`);
      const createRedirectMutation = `
        mutation makeRedirect($redirect: UrlRedirectInput!) {
          urlRedirectCreate(urlRedirect: $redirect) {
            urlRedirect {
              id
              path
              target
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const crRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          query: createRedirectMutation,
          variables: { redirect: { path: oldPath, target: newPath } }
        })
      });

      const crJson = await crRes.json();
      const crResult = crJson.data?.urlRedirectCreate;
      executionLog.redirects.push({
        status: 'CREATED',
        response: crResult
      });
      console.log(`Redirect created: ID ${crResult?.urlRedirect?.id}`);
    }

    // 4. LIVE HTTP QA CHECK
    console.log(`Step 4: Running live HTTP verification for ${item.handle}...`);
    const oldUrlEncoded = `https://${SHOP}/products/${encodeURIComponent(item.oldHandle)}`;
    const newUrl = `https://${SHOP}/products/${item.handle}`;

    let oldHttpCode = 0;
    let oldLocation = '';
    try {
      const hOld = await fetch(oldUrlEncoded, { redirect: 'manual' });
      oldHttpCode = hOld.status;
      oldLocation = hOld.headers.get('location') || '';
    } catch (e) {
      oldHttpCode = e.message;
    }

    let newHttpCode = 0;
    let renderedTitle = '';
    let renderedMeta = '';
    let canonical = '';
    try {
      const hNew = await fetch(newUrl);
      newHttpCode = hNew.status;
      const html = await hNew.text();
      const tm = html.match(/<title>([^<]+)<\/title>/i);
      renderedTitle = tm ? tm[1].trim() : '';
      const mm = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
      renderedMeta = mm ? mm[1].trim() : '';
      const cm = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
      canonical = cm ? cm[1].trim() : '';
    } catch (e) {
      newHttpCode = e.message;
    }

    const testResult = {
      productId: item.id,
      oldUrl: oldUrlEncoded,
      oldHttpCode,
      oldLocation,
      is301RedirectOk: oldHttpCode === 301 || oldHttpCode === 302,
      newUrl,
      newHttpCode,
      is200Ok: newHttpCode === 200,
      renderedTitle,
      renderedMeta,
      canonical
    };

    executionLog.liveHttpTests.push(testResult);
    console.log(`QA Result: Old URL -> HTTP ${oldHttpCode} (Location: ${oldLocation}), New URL -> HTTP ${newHttpCode}`);
  }

  fs.writeFileSync('scripts/batch1_execution_log.json', JSON.stringify(executionLog, null, 2), 'utf8');
  console.log('=== BATCH 1 EXECUTION COMPLETE. Log saved to scripts/batch1_execution_log.json ===');
}

export { executeBatch1 };

if (process.argv[1]?.endsWith('execute_batch1_controlled.mjs')) {
  console.log('NOTE: To execute Batch 1, call executeBatch1() after explicit user approval.');
}
