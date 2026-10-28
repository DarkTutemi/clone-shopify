import fs from 'fs';

const mainCode = fs.readFileSync('scripts/zavelyn-pdp-main.liquid', 'utf8');

// Find ratings in main
const ratingMatches = mainCode.match(/(?:rating|stars|reviews)[\s\S]{0,100}/gi) || [];
console.log("=== RATINGS IN ZAVELYN-PDP-MAIN ===");
ratingMatches.slice(0, 10).forEach(m => console.log('---', m.replace(/\s+/g, ' ')));

// Check reviews section in product.json
const templates = JSON.parse(fs.readFileSync('scripts/audit_templates_content.json', 'utf8'));
const pj = JSON.parse(templates['templates/product.json']);
console.log("\n=== REVIEWS IN PRODUCT.JSON ===");
console.log("Has reviews section:", pj.order.includes('reviews') || Object.values(pj.sections).some(s => s.type.includes('review')));

// Check reviews on Homepage
const ij = JSON.parse(templates['templates/index.json']);
console.log("\n=== REVIEWS IN INDEX.JSON (HOMEPAGE) ===");
console.log("Sections on homepage:", ij.order.map(k => `${k} (${ij.sections[k]?.type})`));
const homeHasReviews = ij.order.some(k => k.includes('review') || ij.sections[k]?.type.includes('review'));
console.log("Has reviews section on homepage:", homeHasReviews);

// Check Collection pages
const cj = JSON.parse(templates['templates/collection.json']);
console.log("\n=== COLLECTION.JSON ===");
console.log("Sections on collection page:", cj.order.map(k => `${k} (${cj.sections[k]?.type})`));
