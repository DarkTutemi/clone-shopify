import fs from 'fs';

const themeMatches = JSON.parse(fs.readFileSync('scripts/theme_guarantee_matches.json', 'utf8'));

// Filter specifically for invalid guarantees:
// 60-day, 90-day, risk-free trial, no questions asked, 100% guaranteed refund, zero-hassle
const invalidKeywords = [
  { pattern: /90[\s-]?day/i, type: '90-Day Guarantee / Trial' },
  { pattern: /60[\s-]?day/i, type: '60-Day Guarantee / Trial' },
  { pattern: /risk[\s-]?free\s+trial/i, type: 'Risk-Free Trial' },
  { pattern: /zero[\s-]?hassle/i, type: 'Zero-Hassle Claim' },
  { pattern: /no[\s-]?questions[\s-]?asked/i, type: 'No Questions Asked Claim' },
  { pattern: /100%\s+guaranteed\s+refund/i, type: '100% Guaranteed Refund' }
];

const groupedViolations = [];

for (const m of themeMatches) {
  for (const inv of invalidKeywords) {
    if (inv.pattern.test(m.snippet)) {
      groupedViolations.push({
        theme: m.theme,
        themeId: m.themeId,
        file: m.file,
        line: m.line,
        violationType: inv.type,
        currentText: m.snippet,
        match: inv.pattern.toString()
      });
      break;
    }
  }
}

console.log('Total invalid guarantee violations in theme assets:', groupedViolations.length);

// Deduplicate by file and key pattern
const byFileMap = new Map();
for (const v of groupedViolations) {
  const key = `${v.theme} | ${v.file}`;
  if (!byFileMap.has(key)) {
    byFileMap.set(key, []);
  }
  byFileMap.get(key).push(v);
}

console.log('Unique files with violations:', byFileMap.size);

const auditReportRows = [];

for (const [fileKey, items] of byFileMap.entries()) {
  const [themeName, filePath] = fileKey.split(' | ');
  
  // Categorize location
  let locationCategory = 'Theme Section / Template';
  if (filePath.includes('header')) locationCategory = 'Announcement Bar / Header Navigation';
  else if (filePath.includes('footer')) locationCategory = 'Storefront Footer';
  else if (filePath.includes('cart')) locationCategory = 'Cart Drawer & Cart Page';
  else if (filePath.includes('shipping')) locationCategory = 'Delivery & Trust Badges';
  else if (filePath.includes('faq')) locationCategory = 'Product FAQ Accordion';
  else if (filePath.includes('hero') || filePath.includes('marquee')) locationCategory = 'Homepage / Collection Hero & Ticker';
  else if (filePath.includes('product.')) locationCategory = 'Custom Product JSON Template';

  // Sample current text
  const currentSnippet = items[0].currentText.replace(/\|/g, '-');
  
  // Determine proposed replacement text conforming to Rule A
  let proposedText = '30-Day Money-Back Guarantee';
  if (currentSnippet.toLowerCase().includes('trial')) {
    proposedText = '30-Day Return Policy (unworn/unused in original packaging)';
  } else if (currentSnippet.toLowerCase().includes('zero hassle') || currentSnippet.toLowerCase().includes('no questions')) {
    proposedText = 'Standard 30-day return window per store refund policy';
  } else if (currentSnippet.includes('★ FREE US SHIPPING')) {
    proposedText = '★ FREE US SHIPPING OVER $49 · 100% SATISFACTION GUARANTEED · 30-DAY MONEY-BACK GUARANTEE ★';
  }

  // Risk level
  let riskLevel = 'MEDIUM';
  if (filePath.includes('cart') || filePath.includes('header') || filePath.includes('shipping')) {
    riskLevel = 'HIGH (Storewide Visibility)';
  }

  auditReportRows.push({
    theme: themeName,
    file: filePath,
    location: locationCategory,
    violationsCount: items.length,
    currentText: currentSnippet,
    proposedText: proposedText,
    policyEvidence: 'Official Shopify Refund Policy specifies a strict 30-day return policy for unused/unworn items in original packaging. 60/90-day promises and risk-free trial claims lack policy basis.',
    requiredAction: `Update hardcoded template strings in ${filePath} to standard 30-Day Money-Back Guarantee during Theme Stage (Stage 3).`,
    riskLevel: riskLevel
  });
}

fs.writeFileSync('scripts/parsed_guarantee_audit_rows.json', JSON.stringify(auditReportRows, null, 2));
console.log('Generated audit report rows:', auditReportRows.length);
