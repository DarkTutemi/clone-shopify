import fs from 'fs';

async function fetchFenceReviews() {
  const url = 'https://loox.io/widget/7GiGt8f0rB/reviews?product_id=10060646252846';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Length:', html.length);
  
  // Check review count
  const countMatch = html.match(/class=["'][^"']*reviews-count[^"']*["'][^>]*>([^<]+)<\/span>/i) || html.match(/(\d+[\d,]*)\s*reviews/i);
  console.log('Fence Post Review count:', countMatch ? countMatch[0] : 'N/A');

  fs.writeFileSync('Clone-sakerplus/data/loox_fence_post.html', html);
  console.log('Saved to Clone-sakerplus/data/loox_fence_post.html');
}

fetchFenceReviews();
