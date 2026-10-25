import fs from 'fs';

const content = fs.readFileSync('live_willa-main-product.liquid', 'utf8');
const targetPatternStart = '<!-- Variants / Bundle Selector -->';
const targetPatternEnd = '<!-- Quantity & ATC -->';

const startIndex = content.indexOf(targetPatternStart);
const endIndex = content.indexOf(targetPatternEnd);

// Let's see what update_theme_tiered_bundle.mjs did
const scriptContent = fs.readFileSync('update_theme_tiered_bundle.mjs', 'utf8');
const replMatch = scriptContent.match(/const replacementBlock = `([\s\S]*?)`;\s*content = content\.slice/);
const replacementBlock = replMatch ? replMatch[1] : '';

let newContent = content.slice(0, startIndex) + replacementBlock + content.slice(endIndex);

const jsMatch = scriptContent.match(/const jsToAdd = `([\s\S]*?)`;\s*if \(!content\.includes\('function selectTierBundle/);
const jsToAdd = jsMatch ? jsMatch[1] : '';

if (!newContent.includes('function selectTierBundle(')) {
  newContent = newContent.replace('function selectPdpBundleCard(', jsToAdd + '\n  function selectPdpBundleCard(');
}

fs.writeFileSync('test_output.liquid', newContent);

const schemaMatches = [...newContent.matchAll(/\{%\s*schema\s*%\}/g)];
console.log('Schema matches in newContent:', schemaMatches.length);
schemaMatches.forEach(m => {
  const lineNum = newContent.slice(0, m.index).split('\n').length;
  console.log('Schema at line:', lineNum);
});
