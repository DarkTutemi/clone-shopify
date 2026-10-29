import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';

async function uploadLocalFileToShopify(filePath, filename, mimeType = 'image/jpeg') {
  const token = await getAccessToken();
  const fileStat = fs.statSync(filePath);
  const fileSize = fileStat.size.toString();

  // 1. Staged upload create
  const stageMutation = `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }`;

  const stageRes = await fetch(`https://${SHOP}/admin/api/2026-10/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: stageMutation,
      variables: {
        input: [
          {
            filename,
            mimeType,
            resource: 'FILE',
            fileSize,
            httpMethod: 'POST'
          }
        ]
      }
    })
  });

  const stageData = await stageRes.json();
  const target = stageData.data?.stagedUploadsCreate?.stagedTargets?.[0];
  if (!target) {
    throw new Error('Failed to create staged upload target: ' + JSON.stringify(stageData));
  }

  // 2. Upload file to target URL
  const formData = new FormData();
  for (const param of target.parameters) {
    formData.append(param.name, param.value);
  }
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: mimeType });
  formData.append('file', blob, filename);

  const uploadRes = await fetch(target.url, {
    method: 'POST',
    body: formData
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    throw new Error(`Upload to storage failed (${uploadRes.status}): ${errText}`);
  }

  // 3. Register file in Shopify Files
  const fileCreateMutation = `mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        id
        fileStatus
        ... on MediaImage {
          image {
            url
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }`;

  const createRes = await fetch(`https://${SHOP}/admin/api/2026-10/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: fileCreateMutation,
      variables: {
        files: [
          {
            originalSource: target.resourceUrl,
            contentType: 'IMAGE',
            alt: filename
          }
        ]
      }
    })
  });

  const createData = await createRes.json();
  const createdFile = createData.data?.fileCreate?.files?.[0];
  if (!createdFile) {
    throw new Error('Failed to register file: ' + JSON.stringify(createData));
  }

  console.log(`Registered ${filename} with ID: ${createdFile.id}`);

  // 4. Poll until URL is ready
  const getFileQuery = `query getFile($id: ID!) {
    node(id: $id) {
      ... on MediaImage {
        id
        fileStatus
        image {
          url
        }
      }
    }
  }`;

  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 1500));
    const checkRes = await fetch(`https://${SHOP}/admin/api/2026-10/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: getFileQuery,
        variables: { id: createdFile.id }
      })
    });
    const checkData = await checkRes.json();
    const url = checkData.data?.node?.image?.url;
    if (url) {
      console.log(`✓ ${filename} ready at: ${url}`);
      return url;
    }
  }

  return target.resourceUrl;
}

async function main() {
  const thumbs = [
    {
      path: path.join(ARTIFACT_DIR, 'bin_bundle_buy6_1793289809801.jpg'),
      name: 'zavelyn-storage-bins-buy6-thumb.jpg'
    },
    {
      path: path.join(ARTIFACT_DIR, 'bin_bundle_buy4_1793289838440.jpg'),
      name: 'zavelyn-storage-bins-buy4-thumb.jpg'
    },
    {
      path: path.join(ARTIFACT_DIR, 'bin_bundle_buy2_1793289870156.jpg'),
      name: 'zavelyn-storage-bins-buy2-thumb.jpg'
    }
  ];

  const results = {};
  for (const item of thumbs) {
    console.log(`Uploading ${item.name}...`);
    const url = await uploadLocalFileToShopify(item.path, item.name);
    results[item.name] = url;
  }

  console.log('\n--- UPLOADED THUMBNAILS SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync('./backups/storage_bins_thumbnails.json', JSON.stringify(results, null, 2));
}

main().catch(console.error);
