async function getProductContentStyles() {
  const res = await fetch('https://trybronoir.com/products/bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort');
  const html = await res.text();
  
  // Find styles related to product-content or product-tabs
  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
  const relevantStyles = styles.filter(s => s.includes('product-content') || s.includes('product-tabs') || s.includes('tabs-nav'));
  console.log('Found styles count:', relevantStyles.length);
  for (const s of relevantStyles) {
    console.log(s.slice(0, 1000));
  }
}
getProductContentStyles();
