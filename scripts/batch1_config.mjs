import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const API_VERSION = '2026-10'; // Verified stable Shopify GraphQL API

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

const batch1Payload = [
  {
    id: 'gid://shopify/Product/15454947901625',
    title: 'Zavelyn Sensory Textured Floor Mats',
    handle: 'zavelyn-sensory-floor-mats',
    seo: {
      title: 'TPU Sensory Textured Floor Mats for Kids & Adults | Zavelyn',
      description: 'Engage tactile exploration with interlocking TPU textured floor mats featuring six raised patterns. Easy to assemble, clean, and arrange for kids or adults.'
    },
    oldHandle: 'sakerplus®-tpu-sensory-textured-floor-mats'
  },
  {
    id: 'gid://shopify/Product/15454948163769',
    title: 'Zavelyn Tearable Non-Slip Drawer Liner',
    handle: 'zavelyn-tearable-drawer-liner',
    seo: {
      title: 'Tearable Non-Slip Drawer Liner for Cabinets | Zavelyn',
      description: 'Keep kitchen utensils and vanity supplies in place with tearable non-slip drawer liners. Sized with a clear grid for easy hand-tearing without scissors.'
    },
    oldHandle: 'sakerplus®-tearable-non-slip-drawer-liner'
  },
  {
    id: 'gid://shopify/Product/15454948556985',
    title: 'Zavelyn Tearable Shelf & Drawer Liner',
    handle: 'zavelyn-shelf-drawer-liner',
    seo: {
      title: 'Tearable Shelf & Drawer Mat Liner for Kitchen | Zavelyn',
      description: 'Protect shelves, cabinets, and drawers from spills, moisture, and scratches with textured EVA liners. Perforated design pulls apart by hand for a custom fit.'
    },
    oldHandle: 'sakerplus®-tearable-shelf-liner-and-drawer-liner'
  }
];

export { batch1Payload, getAccessToken, SHOP, API_VERSION };
