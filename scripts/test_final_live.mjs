async function testLiveStorefront() {
  const res = await fetch('https://tryzavelyn.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  });
  const html = await res.text();
  console.log('HTTP Status:', res.status);
  console.log('HTML Length:', html.length);
  
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  console.log('Page Title:', titleMatch ? titleMatch[1] : 'N/A');

  const announcementMatch = html.match(/class="[^"]*announcement[^"]*"[^>]*>(.*?)<\/div>/is) || html.match(/FREE US SHIPPING OVER \$49/i);
  console.log('Announcement Bar Found:', !!announcementMatch);

  const cartDrawerMatch = html.includes('willa-cart-drawer') || html.includes('cart-drawer');
  console.log('Cart Drawer Present:', cartDrawerMatch);

  const has30DayMatch = html.includes('30-Day Money-Back Guarantee') || html.includes('30-Day');
  console.log('30-Day Guarantee Found:', has30DayMatch);

  const prohibited = html.match(/\b(60[- ]day\s*(money[- ]back\s*)?guarantee|90[- ]day\s*(sound\s*)?guarantee|60[- ]night\s*risk[- ]free\s*trial)\b/gi);
  console.log('Prohibited Claims Count:', prohibited ? prohibited.length : 0);
}

testLiveStorefront();
