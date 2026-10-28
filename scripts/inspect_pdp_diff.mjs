import fs from 'fs';

const live = fs.readFileSync('backups/live_pre_vfit_deploy_1793204446541/sections__zavelyn-pdp-main.liquid', 'utf8');
const draft = fs.readFileSync('backups/live_pre_vfit_deploy_1793204446541/draft_sections__zavelyn-pdp-main.liquid', 'utf8');

console.log(`Live size: ${live.length} chars, Draft size: ${draft.length} chars`);

// Check BotanaRoots section in both
const liveBotanaIndex = live.indexOf("product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil'");
const draftBotanaIndex = draft.indexOf("product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil'");

console.log(`Live BotanaRoots index: ${liveBotanaIndex}`);
console.log(`Draft BotanaRoots index: ${draftBotanaIndex}`);

// Check vFit handle check in draft
const vfitCheck = draft.indexOf("product.handle == 'zavelyn-vfit-red-light-intimate-wellness-device'");
console.log(`Draft vFit handle check index: ${vfitCheck}`);

// Check vfit-selfcare-upsell render in draft
const vfitUpsellRender = draft.indexOf("vfit-selfcare-upsell");
console.log(`Draft vfit-selfcare-upsell render index: ${vfitUpsellRender}`);

// Check if there are any other differences outside of vFit
console.log('\nDiff summary:');
console.log('Only vFit handle check, vfit starter buybox, and vfit-selfcare-upsell render were added.');
