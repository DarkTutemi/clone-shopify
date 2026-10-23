import fs from 'fs';

async function checkNola() {
  const url = 'https://trybronoir.com/products/bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Length:', text.length);
  
  // Search for reviews or loox or judgeme
  const jdgmWidget = text.indexOf('judgeme_product_reviews');
  console.log('judgeme_product_reviews index:', jdgmWidget);

  // Search for any app blocks
  const appBlocks = [...text.matchAll(/shopify-block-[^"'\s]*/g)].map(m => m[0]);
  console.log('App blocks:', [...new Set(appBlocks)]);

  // Search for reviews title or header
  const revHeaders = [...text.matchAll(/<h[1-4][^>]*>[^<]*review[^<]*<\/h[1-4]>/gi)].map(m => m[0]);
  console.log('Review headers:', revHeaders);

  // Search for all section IDs
  const secMatches = [...text.matchAll(/id=['"]shopify-section-([^'"]+)['"]/g)].map(m => m[1]);
  console.log('Sections:', secMatches);
}

checkNola();
