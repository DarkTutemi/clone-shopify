import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const SCRAPED_DIR = './backups/storage_bins_scraped_images';

async function main() {
  const token = await getAccessToken();

  console.log('1. Preparing product images...');
  const images = [];

  // Hero Image
  const heroPath = path.join(ARTIFACT_DIR, 'storage_bin_hero_1793289766059.jpg');
  images.push({
    attachment: fs.readFileSync(heroPath).toString('base64'),
    filename: 'zavelyn-foldable-storage-bins-hero.jpg',
    position: 1
  });

  // Gallery Images
  const galleryFiles = [
    { name: 'bin_img_1.png', filename: 'zavelyn-storage-bins-dimensions-capacity.png' },
    { name: 'bin_img_4.png', filename: 'zavelyn-storage-bins-before-after.png' },
    { name: 'bin_img_3.png', filename: 'zavelyn-storage-bins-bedding-blankets.png' },
    { name: 'bin_img_5.png', filename: 'zavelyn-storage-bins-features-overview.png' },
    { name: 'bin_img_6.png', filename: 'zavelyn-storage-bins-closet-wardrobe.png' },
    { name: 'bin_img_7.png', filename: 'zavelyn-storage-bins-home-living-decor.png' },
    { name: 'bin_img_9.png', filename: 'zavelyn-storage-bins-moving-travel-trunk.png' }
  ];

  galleryFiles.forEach((gf, idx) => {
    const p = path.join(SCRAPED_DIR, gf.name);
    if (fs.existsSync(p)) {
      images.push({
        attachment: fs.readFileSync(p).toString('base64'),
        filename: gf.filename,
        position: idx + 2
      });
    }
  });

  console.log(`Prepared ${images.length} gallery images.`);

  // Product payload
  const productPayload = {
    product: {
      title: 'Zavelyn Large Foldable Zippered Storage Bins',
      handle: 'zavelyn-foldable-zippered-storage-bins',
      product_type: 'Home Organization & Storage',
      vendor: 'Zavelyn',
      status: 'draft',
      template_suffix: 'storage-bins',
      body_html: `
        <p>Keep your home effortlessly organized with Zavelyn Large Foldable Zippered Storage Bins. Designed specifically for bulky bedding, winter comforters, seasonal wardrobe rotations, and plush linens, each XXL container features high-density breathable fabric, heavy-duty reinforced carrying handles, and smooth dual two-way zippers.</p>
      `,
      options: [
        {
          name: 'Quantity',
          values: ['6 Storage Bins', '4 Storage Bins', '2 Storage Bins']
        }
      ],
      variants: [
        {
          option1: '6 Storage Bins',
          price: '101.95',
          compare_at_price: '239.88',
          sku: 'ZAV-BIN-6PACK',
          inventory_policy: 'continue',
          requires_shipping: true,
          fulfillment_service: 'manual'
        },
        {
          option1: '4 Storage Bins',
          price: '79.96',
          compare_at_price: '159.92',
          sku: 'ZAV-BIN-4PACK',
          inventory_policy: 'continue',
          requires_shipping: true,
          fulfillment_service: 'manual'
        },
        {
          option1: '2 Storage Bins',
          price: '39.98',
          compare_at_price: '79.96',
          sku: 'ZAV-BIN-2PACK',
          inventory_policy: 'continue',
          requires_shipping: true,
          fulfillment_service: 'manual'
        }
      ],
      images
    }
  };

  console.log('2. Creating product in Shopify Admin REST API...');
  const createRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productPayload)
  });

  const createData = await createRes.json();
  if (createData.errors) {
    throw new Error('Failed to create product: ' + JSON.stringify(createData.errors));
  }

  const product = createData.product;
  console.log(`\n✓ PRODUCT CREATED SUCCESSFULLY!`);
  console.log(`ID: ${product.id}`);
  console.log(`Title: ${product.title}`);
  console.log(`Handle: ${product.handle}`);
  console.log(`Status: ${product.status}`);
  console.log(`Template Suffix: ${product.template_suffix}`);
  console.log(`Images: ${product.images.length}`);
  console.log(`Variants:`);
  product.variants.forEach((v, i) => {
    console.log(`  [${i + 1}] ID: ${v.id} | ${v.title} | Price: $${v.price} | Compare: $${v.compare_at_price} | SKU: ${v.sku}`);
  });

  // 3. Publish to Online Store sales channel via GraphQL
  console.log('\n3. Publishing product to Online Store channel...');
  const publishMutation = `mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable {
        availablePublicationsCount {
          count
        }
      }
      userErrors {
        field
        message
      }
    }
  }`;

  const pubRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: publishMutation,
      variables: {
        id: `gid://shopify/Product/${product.id}`,
        input: [
          {
            publicationId: 'gid://shopify/Publication/225336393913' // Online Store
          }
        ]
      }
    })
  });
  const pubData = await pubRes.json();
  console.log('Publication result:', JSON.stringify(pubData.data?.publishablePublish || pubData));

  // 4. Set SEO Metafields
  console.log('\n4. Setting SEO Metafields...');
  const metafields = [
    {
      namespace: 'global',
      key: 'title_tag',
      value: 'Zavelyn Large Foldable Zippered Storage Bins | XXL Bedding & Clothes Storage',
      type: 'single_line_text_field'
    },
    {
      namespace: 'global',
      key: 'description_tag',
      value: 'Tidy up your bedroom and closets with Zavelyn Large Foldable Storage Bins. Designed for heavy comforters, quilts, and seasonal garments with dual metal zippers.',
      type: 'single_line_text_field'
    }
  ];

  for (const m of metafields) {
    const metaRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/${product.id}/metafields.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ metafield: m })
    });
    const metaData = await metaRes.json();
    console.log(`✓ Metafield ${m.key} set:`, metaData.metafield?.id ? 'OK' : 'Error');
  }

  fs.writeFileSync('./backups/storage_bins_product.json', JSON.stringify(product, null, 2));
}

main().catch(console.error);
