import fs from 'fs';

async function checkVistaAndOthers() {
  const urls = [
    'https://trybronoir.com/products/bronoir%E2%84%A2-vista-barefoot-shoes',
    'https://trybronoir.com/products/bronoir%E2%84%A2-lift-elegant-supportive-ballerinas-for-daily-comfort',
    'https://trybronoir.com/products/bronoir-ayelith-lightweight-arch-supportive-walking-sandals',
    'https://trybronoir.com/products/bronoir%E2%84%A2-myava-lightweight-arch-supportive-walking-sandals',
    'https://trybronoir.com/products/bronoir%E2%84%A2-stridea-lightweight-arch-supportive-walking-sandals'
  ];

  for (const url of urls) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    console.log(url, 'Status:', res.status);
    const html = await res.text();
    const hasJdgm = html.includes('judgeme');
    const hasLoox = html.includes('loox');
    const hasReviewWord = html.includes('Customer Reviews') || html.includes('Based on');
    console.log('hasJdgm:', hasJdgm, 'hasLoox:', hasLoox, 'hasReviewWord:', hasReviewWord);
  }
}

checkVistaAndOthers();
