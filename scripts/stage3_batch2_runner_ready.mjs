/**
 * STAGE 3 BATCH 2 RUNNER (READY ON APPROVAL)
 * Uses Shopify GraphQL Admin API 2026-10 with Exponential Backoff and Independent QA
 * NOTE: DO NOT EXECUTE UNTIL EXPLICITLY APPROVED BY USER.
 */
import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const STORE_DOMAIN = 'https://tryzavelyn.com';
const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

export const batch2Products = [
  {
    rawId: '15454949540025',
    gid: 'gid://shopify/Product/15454949540025',
    name: 'Titanium Pocket Pry Bar',
    oldHandle: 'sakerplus®-titanium-alloy-multifunction-pocket-pry-bar',
    proposedTitle: 'Zavelyn Titanium Pocket Pry Bar',
    proposedSeoTitle: 'Titanium Multifunction Pocket Pry Bar EDC Tool | Zavelyn',
    proposedMetaDesc: 'Carry a dependable EDC pocket tool crafted from lightweight titanium alloy. Features bottle opener, pry wedge, measurement scale, and pocket clip.',
    proposedHandle: 'zavelyn-titanium-pocket-pry-bar',
    adsRisk: 'ADS TRAFFIC UNKNOWN'
  },
  {
    rawId: '15454950490297',
    gid: 'gid://shopify/Product/15454950490297',
    name: 'Squishy Egg Silicone Night Light',
    oldHandle: 'sakerplus®-squishy-egg-multicolor-tap-night-light',
    proposedTitle: 'Zavelyn Squishy Egg Silicone Night Light',
    proposedSeoTitle: 'Squishy Egg Silicone Tap Night Light for Kids | Zavelyn',
    proposedMetaDesc: 'Soothe bedrooms and nurseries with a soft silicone egg lamp. Features touch sensor color changes, warm night glow, and rechargeable USB convenience.',
    proposedHandle: 'zavelyn-squishy-egg-night-light',
    adsRisk: 'ADS TRAFFIC UNKNOWN'
  },
  {
    rawId: '15454952882361',
    gid: 'gid://shopify/Product/15454952882361',
    name: 'Kids Basketball Hoop Set',
    oldHandle: 'sakerplus®-kids-indoor-outdoor-basketball-hoop-set',
    proposedTitle: 'Zavelyn Kids Basketball Hoop Set',
    proposedSeoTitle: 'Indoor & Outdoor Basketball Hoop Set for Kids | Zavelyn',
    proposedMetaDesc: 'Encourage active indoor and driveway play with an adjustable height basketball hoop set. Features sturdy spring-action rim and shatterproof backboard.',
    proposedHandle: 'zavelyn-kids-basketball-hoop',
    adsRisk: 'ADS TRAFFIC UNKNOWN'
  },
  {
    rawId: '15454953177273',
    gid: 'gid://shopify/Product/15454953177273',
    name: 'Clamp-On Desk Shelf Organizer',
    oldHandle: 'sakerplus®-three-tier-clamp-on-desk-shelf-organizer',
    proposedTitle: 'Zavelyn Clamp-On Desk Shelf Organizer',
    proposedSeoTitle: 'Clamp-On Multi-Tier Desk Shelf Organizer | Zavelyn',
    proposedMetaDesc: 'Expand usable desktop surface without drilling using heavy-duty C-clamp shelves. Ideal for organizing monitors, stationery, speakers, and office essentials.',
    proposedHandle: 'zavelyn-clamp-on-desk-shelf',
    adsRisk: 'ADS TRAFFIC UNKNOWN'
  },
  {
    rawId: '15454955765945',
    gid: 'gid://shopify/Product/15454955765945',
    name: 'Rotating Galaxy Star Projector',
    oldHandle: 'sakerplus®-rotating-galaxy-projector-with-adjustable-focus',
    proposedTitle: 'Zavelyn Rotating Galaxy Star Projector',
    proposedSeoTitle: 'Rotating Galaxy Star Projector for Bedrooms | Zavelyn',
    proposedMetaDesc: 'Transform ceilings into a celestial planetarium with an adjustable-focus optical galaxy projector featuring realistic nebula discs and silent rotation.',
    proposedHandle: 'zavelyn-galaxy-star-projector',
    adsRisk: 'ADS TRAFFIC UNKNOWN'
  },
  {
    rawId: '15454959403193',
    gid: 'gid://shopify/Product/15454959403193',
    name: 'Low-Profile Downspout Catch Basin',
    oldHandle: 'sakerplus®-low-profile-downspout-catch-basin',
    proposedTitle: 'Zavelyn Low-Profile Downspout Catch Basin',
    proposedSeoTitle: 'Low-Profile Downspout Drainage Catch Basin | Zavelyn',
    proposedMetaDesc: 'Divert rainwater away from your home foundation with a low-profile gutter downspout basin equipped with a debris grate and extendable discharge pipe.',
    proposedHandle: 'zavelyn-downspout-catch-basin',
    adsRisk: 'ADS TRAFFIC UNKNOWN'
  },
  {
    rawId: '15454960517305',
    gid: 'gid://shopify/Product/15454960517305',
    name: 'Rotating Goose Target Game',
    oldHandle: 'sakerplus®-electronic-rotating-goose-target-game',
    proposedTitle: 'Zavelyn Rotating Goose Target Game',
    proposedSeoTitle: 'Electronic Rotating Goose Target Shooting Game | Zavelyn',
    proposedMetaDesc: 'Bring exciting arcade target practice home with an electronic rotating goose shooting game featuring soft foam ball poppers and digital score display.',
    proposedHandle: 'zavelyn-goose-target-game',
    adsRisk: 'ADS TRAFFIC UNKNOWN'
  },
  {
    rawId: '15454961565881',
    gid: 'gid://shopify/Product/15454961565881',
    name: 'Workbench Tail Vise Clamp',
    oldHandle: 'sakerplus®-adjustable-workbench-tail-vise-clamp',
    proposedTitle: 'Zavelyn Workbench Tail Vise Clamp',
    proposedSeoTitle: 'Heavy-Duty Workbench Tail Vise Woodworking Clamp | Zavelyn',
    proposedMetaDesc: 'Secure wooden workpieces firmly on dog-hole workbenches using an all-metal tail vise screw clamp engineered for smooth tightening and stable clamping.',
    proposedHandle: 'zavelyn-workbench-tail-vise',
    adsRisk: 'ADS TRAFFIC UNKNOWN'
  },
  {
    rawId: '15454963073209',
    gid: 'gid://shopify/Product/15454963073209',
    name: 'Rolling Nut & Fruit Harvester',
    oldHandle: 'sakerplus®-rolling-nut-and-ball-picker',
    proposedTitle: 'Zavelyn Rolling Nut & Fruit Harvester',
    proposedSeoTitle: 'Rolling Nut & Fruit Harvester Gathering Tool | Zavelyn',
    proposedMetaDesc: 'Gather pecans, walnuts, acorns, and tennis balls without bending your back using a rolling wire collection drum with an ergonomic telescoping handle.',
    proposedHandle: 'zavelyn-rolling-nut-picker',
    adsRisk: 'ADS TRAFFIC UNKNOWN'
  },
  {
    rawId: '15454963433657',
    gid: 'gid://shopify/Product/15454963433657',
    name: 'Ultra-Fine Cooking Oil Sprayer',
    oldHandle: 'sakerplus®-ultra-fine-cooking-oil-spray-bottle',
    proposedTitle: 'Zavelyn Ultra-Fine Cooking Oil Sprayer',
    proposedSeoTitle: 'Ultra-Fine Cooking Oil Sprayer Bottle for Cooking | Zavelyn',
    proposedMetaDesc: 'Misty-spray olive oil evenly onto salads, air fryer baskets, and grilling pans. Features a continuous pressurized trigger and leakproof glass bottle body.',
    proposedHandle: 'zavelyn-oil-spray-bottle',
    adsRisk: 'ADS TRAFFIC UNKNOWN'
  }
];

/**
 * Fetch with bounded retry and exponential backoff.
 * Respects Retry-After header on HTTP 429.
 */
export async function fetchWithBackoff(url, options = {}, maxRetries = 4, baseDelay = 3000) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        const retryAfter = res.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt);
        console.warn(`[HTTP 429 Rate Limited] Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}...`);
        await new Promise(r => setTimeout(r, waitTime));
        attempt++;
        continue;
      }
      return res;
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      const waitTime = baseDelay * Math.pow(2, attempt);
      console.warn(`[Network Retry] ${err.message}. Waiting ${waitTime}ms...`);
      await new Promise(r => setTimeout(r, waitTime));
      attempt++;
    }
  }
  throw new Error(`Max retries reached for ${url}`);
}
