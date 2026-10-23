import fs from 'fs';

async function checkNolaLoox() {
  const url = 'https://trybronoir.com/products/bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const text = await res.text();
  
  const sectionStart = text.indexOf('loox-product-reviews-app-section');
  if (sectionStart !== -1) {
    console.log('Found loox-product-reviews-app-section:');
    console.log(text.slice(sectionStart - 100, sectionStart + 2000));
  } else {
    console.log('Not found');
  }
}

checkNolaLoox();
