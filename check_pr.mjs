async function checkPowerReviews() {
  const res = await fetch('https://navage.com/products/navage-advanced-nose-cleaner');
  const html = await res.text();
  const prConfig = [...html.matchAll(/POWERREVIEWS\.display\.render\(([\s\S]*?)\);/g)].map(m => m[1]);
  console.log('PowerReviews calls:', prConfig.length);
  if (prConfig.length > 0) {
    console.log('Sample config:', prConfig[0].slice(0, 300));
  }
  const prDivs = [...html.matchAll(/(<div[^>]*pr-[^>]*>)/g)].map(m => m[1]);
  console.log('PR divs:', prDivs);
}

checkPowerReviews().catch(console.error);
