const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();
  if (!access_token) throw new Error('Token error');

  const graphql = async (query, variables = {}) => {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': access_token
      },
      body: JSON.stringify({ query, variables })
    });
    return (await res.json()).data;
  };

  // 1. Create Pages (Contact & Shipping Policy)
  const PAGES = [
    {
      title: "Contact Us",
      handle: "contact",
      body: `<h2>We're Here to Help</h2><p>Have questions about your order or our barefoot shoes? Reach out to our dedicated support team at <strong>support@trybronoir.com</strong>.</p><p>Hours: Monday – Friday, 9:00 AM – 6:00 PM EST.</p>`
    },
    {
      title: "Shipping & Delivery Policy",
      handle: "shipping-policy",
      body: `<h2>Fast & Insured Worldwide Shipping</h2><p>All orders are processed within 24-48 business hours. Delivery typically takes 5-9 business days with full real-time tracking.</p>`
    }
  ];

  for (const p of PAGES) {
    console.log('Creating Page:', p.title);
    await graphql(`
      mutation pageCreate($page: PageCreateInput!) {
        pageCreate(page: $page) {
          page { id title handle }
          userErrors { field message }
        }
      }
    `, {
      page: {
        title: p.title,
        handle: p.handle,
        body: p.body,
        isPublished: true
      }
    });
  }

  // 2. Query Navigation Menus
  const menuRes = await graphql(`
    query {
      menus(first: 5) {
        nodes {
          id
          title
          handle
        }
      }
    }
  `);
  console.log('Available Menus:', menuRes?.menus?.nodes);

  // Update Main Menu if found
  const mainMenu = menuRes?.menus?.nodes?.find(m => m.handle === 'main-menu');
  if (mainMenu) {
    console.log('Updating Main Menu items to match Trybronoir...');
    await graphql(`
      mutation menuUpdate($id: ID!, $items: [MenuItemCreateInput!]!) {
        menuUpdate(id: $id, items: $items) {
          menu { id title }
          userErrors { field message }
        }
      }
    `, {
      id: mainMenu.id,
      items: [
        { title: "Home", type: "FRONTPAGE", url: "/" },
        { title: "Bestsellers", type: "COLLECTION", url: "/collections/bestsellers" },
        { title: "Buy 1 Get 2 Free", type: "COLLECTION", url: "/collections/barefoot-shoes-bogo-volume" },
        { title: "Summer Barefoot", type: "COLLECTION", url: "/collections/barefoot-shoes-for-summer" },
        { title: "Winter Collection", type: "COLLECTION", url: "/collections/winter-collection" },
        { title: "Socks & Insoles", type: "COLLECTION", url: "/collections/socks-and-insoles" },
        { title: "Contact", type: "PAGE", url: "/pages/contact" }
      ]
    });
    console.log('✅ Main Menu successfully synced to Trybronoir navigation!');
  }

  console.log('🎉 PAGES AND NAVIGATION SETUP COMPLETE!');
}

main().catch(console.error);
