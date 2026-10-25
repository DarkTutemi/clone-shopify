import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  if (res.ok) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    const err = await res.text();
    console.error(`  ✗ Failed to upload ${key}:`, err.slice(0, 200));
    return false;
  }
}

async function main() {
  const token = await getAccessToken();

  // 1. Update snippets/meta-tags.liquid
  const newMetaTags = `{%- liquid
  assign brand_name = 'Sakerplus'
  assign og_title = page_title | default: brand_name
  if request.page_type == 'index' or og_title == blank or og_title == shop.name or og_title == 'My Store'
    assign og_title = 'Sakerplus® Official Store — Smart Tools & Fence Repair Kit'
  endif
  assign og_url = canonical_url | default: request.origin
  assign og_type = 'website'
  assign og_description = page_description | default: shop.description
  if og_description == blank
    assign og_description = 'Discover innovative tools, smart home improvements, and heavy-duty repair kits engineered by Sakerplus.'
  endif

  if request.page_type == 'product'
    assign og_type = 'product'
  elsif request.page_type == 'article'
    assign og_type = 'article'
  endif

  if page_image
    assign og_image = page_image | image_url: width: 1200
  elsif settings.share_image
    assign og_image = settings.share_image | image_url: width: 1200
  endif
-%}

<meta property="og:site_name" content="{{ brand_name }}">
<meta property="og:url" content="{{ og_url }}">
<meta property="og:title" content="{{ og_title | escape }}">
<meta property="og:type" content="{{ og_type }}">
<meta property="og:description" content="{{ og_description | escape }}">

{%- if og_image -%}
  <meta property="og:image" content="https:{{ og_image }}">
  <meta property="og:image:secure_url" content="https:{{ og_image }}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="628">
{%- endif -%}

{%- if request.page_type == 'product' -%}
  <meta property="og:price:amount" content="{{ product.selected_or_first_available_variant.price | money_without_currency | strip_html }}">
  <meta property="og:price:currency" content="{{ cart.currency.iso_code }}">
{%- endif -%}

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ og_title | escape }}">
<meta name="twitter:description" content="{{ og_description | escape }}">
{%- if og_image -%}
  <meta name="twitter:image" content="https:{{ og_image }}">
{%- endif -%}
`;

  await uploadThemeAsset(token, 'snippets/meta-tags.liquid', newMetaTags);

  // 2. Update layout/theme.liquid
  const themeRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=layout/theme.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const themeData = await themeRes.json();
  let themeContent = themeData.asset?.value || '';

  themeContent = themeContent.replaceAll("assign brand_name = 'Zavelyn'", "assign brand_name = 'Sakerplus'");
  themeContent = themeContent.replaceAll("assign meta_title = 'Zavelyn Foot Sleeve – Buy One Get One FREE'", "assign meta_title = 'Sakerplus® Official Store — Smart Tools & Fence Repair Kit'");
  themeContent = themeContent.replaceAll("Zavelyn", "Sakerplus");

  await uploadThemeAsset(token, 'layout/theme.liquid', themeContent);

  console.log('✔ Cleaned all brand contamination from theme.liquid and meta-tags.liquid!');
}

main();
