import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scripts/raw_catalog_products.json', 'utf8'));
const rawMap = new Map(raw.map(p => [p.id.replace('gid://shopify/Product/', ''), p]));

const auditCsv = fs.readFileSync('ZAVELYN_INDEPENDENT_AUDIT_76_ACTIVE.csv', 'utf8');

const ids = ['15460954276025', '15461407588537', '15461446713529', '15461507956921', '15461535416505'];
for (const id of ids) {
  const p = rawMap.get(id);
  const line = auditCsv.split('\n').find(l => l.includes(id));
  const parts = line.split('","');
  const liveCount = parts[9];
  console.log(id, 'Baseline totalVariants:', p.totalVariants, '| Live Variants in Audit:', liveCount, '| Matches:', p.totalVariants === parseInt(liveCount));
}
