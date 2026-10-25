import fs from 'fs';

const urls = [
  { id: 1, name: 'Joylux vFit', url: 'https://joylux.com/pages/vfit' },
  { id: 2, name: 'Bralisse', url: 'https://bralisse.com/' },
  { id: 3, name: 'SuperTots Food Pacifier', url: 'https://www.super-tots.com/products/supertots-food-pacifier' },
  { id: 4, name: 'Clarifion Air Purifier', url: 'https://about.clarifion.com/' },
  { id: 5, name: 'Hestia Color Changing Foundation', url: 'https://hestiacosmetics.com/products/color-changing-foundation' },
  { id: 6, name: 'SelenePets Interactive Toy', url: 'https://selenepets.com/products/fun-8-page-16-1' },
  { id: 7, name: 'Gravity Glider', url: 'https://gravityglidersco.com/products/gravity-glider' },
  { id: 8, name: 'Wiggostoys Mega Lifters', url: 'https://wiggostoyfactory.com/products/mega-lifters%E2%84%A2' },
  { id: 9, name: 'Botana Hair Growth Oil', url: 'https://www.azureboutique.co/products/botana-natural-hair-growth-oil' },
  { id: 10, name: 'Ackerman Heated Gloves', url: 'https://www.ackermanshop.com/products/smart-thermostatic-heated-fingerless-gloves' }
];

async function checkAll() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  const results = [];
  for (const item of urls) {
    try {
      const res = await fetch(item.url, { headers, redirect: 'follow' });
      results.push({
        id: item.id,
        name: item.name,
        url: item.url,
        status: res.status,
        finalUrl: res.url,
        ok: res.ok
      });
      console.log(`[#${item.id}] ${item.name}: Status ${res.status} (-> ${res.url})`);
    } catch (e) {
      results.push({
        id: item.id,
        name: item.name,
        url: item.url,
        status: 'ERROR',
        error: e.message
      });
      console.log(`[#${item.id}] ${item.name}: ERROR ${e.message}`);
    }
  }

  fs.writeFileSync('check_10_urls_result.json', JSON.stringify(results, null, 2));
}

checkAll().catch(console.error);
