import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const PRODUCT_ID = '15454946951353';

const GIFS = {
  hammer: 'https://tryzavelyn.com/cdn/shop/files/fence_gif_1_no_dig_hammer.gif?v=1792910614',
  wobble: 'https://tryzavelyn.com/cdn/shop/files/fence_gif_2_stop_wobble.gif?v=1792910628',
  bolts: 'https://tryzavelyn.com/cdn/shop/files/fence_gif_3_tighten_bolts.gif?v=1792910630',
  storm: 'https://tryzavelyn.com/cdn/shop/files/fence_gif_4_stability_storm.gif?v=1792910632'
};

const bodyHtml = `
<div class="zavelyn-fence-desc" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.6; max-width: 900px; margin: 0 auto;">

  <!-- Hero Intro Banner -->
  <div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); color: #ffffff; padding: 28px 24px; border-radius: 14px; margin-bottom: 28px; text-align: center; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">
    <span style="display: inline-block; background: #eab308; color: #111827; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">★ Permanent DIY Fix</span>
    <h2 style="color: #ffffff; font-size: 26px; font-weight: 800; line-height: 1.3; margin: 0 0 10px 0;">Why Smart Homeowners Are Ditching Traditional Fence Repair Forever</h2>
    <p style="color: #d1d5db; font-size: 15px; margin: 0; max-width: 640px; margin: 0 auto;">No digging. No mixing concrete. No hiring $1,000+ contractors. The <strong>Zavelyn® Heavy-Duty H-Beam Ground-Lock™ System</strong> permanently restores leaning or wobbling fence posts in under 20 minutes.</p>
  </div>

  <!-- Key Benefits Grid Highlights -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 32px;">
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; text-align: center;">
      <div style="font-size: 22px; margin-bottom: 6px;">🔨</div>
      <div style="font-weight: 700; font-size: 15px; color: #111827;">Zero Digging</div>
      <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">Drives directly into soil with a standard hammer</div>
    </div>
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; text-align: center;">
      <div style="font-size: 22px; margin-bottom: 6px;">⏱️</div>
      <div style="font-weight: 700; font-size: 15px; color: #111827;">20-Minute Install</div>
      <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">Complete DIY repair without waiting for concrete to cure</div>
    </div>
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; text-align: center;">
      <div style="font-size: 22px; margin-bottom: 6px;">🛡️</div>
      <div style="font-weight: 700; font-size: 15px; color: #111827;">340% More Stability</div>
      <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">H-beam engineering locks post against storm-force winds</div>
    </div>
  </div>

  <!-- REASON 1 WITH GIF 1 -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div style="text-align: center;">
        <img src="${GIFS.hammer}" alt="Driving H-Anchor into soil with hammer - No digging required" style="width: 100%; max-width: 480px; height: auto; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: inline-block;" loading="lazy">
      </div>
      <div>
        <div style="display: inline-block; background: #fee2e2; color: #991b1b; font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">REASON 01</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 10px 0;">1. Eliminates 87% of Traditional Repair Work (No Digging Required)</h3>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">Forget everything you know about fence repair. The <strong>Zavelyn® H-shaped ground anchor</strong> drives straight into the earth next to your wobbly post—<strong>no backhoes, no digging, no concrete mixing, and no back-breaking labor</strong>.</p>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">The engineered sharp triangular anchor slices deep through dense soil and gravel like butter, while the dual-contact H-beam locks your post into rock-solid vertical alignment.</p>
        <div style="border-left: 3px solid #2563eb; background: #eff6ff; padding: 12px 16px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 14px; font-style: italic; color: #1e40af;">"I thought I'd have to tear down and replace my whole fence section after the last storm. This thing fixed it in under 20 minutes and saved me well over $800 in contractor fees."</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #1e3a8a;">— Marcus L., Verified Homeowner</p>
        </div>
      </div>
    </div>
  </div>

  <!-- REASON 2 WITH GIF 2 -->
  <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div style="text-align: center;">
        <img src="${GIFS.wobble}" alt="Stops post wobble and eliminates foundation fatigue" style="width: 100%; max-width: 480px; height: auto; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: inline-block;" loading="lazy">
      </div>
      <div>
        <div style="display: inline-block; background: #fef3c7; color: #92400e; font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">REASON 02</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 10px 0;">2. Stops "Post Foundation Fatigue" That Causes 90% of Failures</h3>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">The hidden truth about why posts keep leaning is <strong>Post Foundation Fatigue</strong>. Every gust of wind rocks the post slightly, creating an expanding void of loose soil at the base. Standard single spikes simply wobble in the existing compromised hole.</p>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">The <strong>Zavelyn Ground-Lock™ H-Design</strong> bypasses the loose core, anchoring into pristine undisturbed soil outside the fatigue zone to permanently eliminate rotational play at the root.</p>
        <div style="border-left: 3px solid #10b981; background: #ecfdf5; padding: 12px 16px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 14px; font-style: italic; color: #065f46;">"Our heavy wooden gate was dragging on the grass because the post was sagging. We hammered this in, tightened the bolts, and the gate swings effortlessly again. Looks super clean and discreet."</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #047857;">— Brenda P., Verified Buyer</p>
        </div>
      </div>
    </div>
  </div>

  <!-- REASON 3 & 4 (STRENGTH & UNIVERSAL FIT) -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <div style="display: inline-block; background: #e0e7ff; color: #3730a3; font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">ENGINEERING-GRADE</div>
    <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 12px 0;">3. 340% More Stability Than Single Stakes &amp; Universal Compatibility</h3>
    <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">Single hardware stakes create a single point of failure under wind sheer. Zavelyn's H-beam design provides <strong>dual opposing contact planes</strong>, creating a structural truss that neutralizes torsional twist and bending loads.</p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 16px;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
        <strong style="color: #0f172a; font-size: 14px;">🌲 Wood Posts</strong>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Perfect for 4x4, 4x6, and round fence posts, cedar or pine.</p>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
        <strong style="color: #0f172a; font-size: 14px;">🛡️ Metal &amp; Vinyl Posts</strong>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Reinforces metal pipe fences, vinyl privacy fences, and farm rails.</p>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
        <strong style="color: #0f172a; font-size: 14px;">📬 Pergolas &amp; Mailboxes</strong>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Anchors heavy mailbox posts, garden trellises, and gate posts.</p>
      </div>
    </div>
  </div>

  <!-- REASON 5 WITH GIF 3 (TIGHTENING BOLTS) -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div style="text-align: center;">
        <img src="${GIFS.bolts}" alt="Tightening heavy-duty mounting bolts into fence post" style="width: 100%; max-width: 480px; height: auto; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: inline-block;" loading="lazy">
      </div>
      <div>
        <div style="display: inline-block; background: #f3e8ff; color: #6b21a8; font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">REASON 05</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 10px 0;">5. Installs in 20 Minutes With Just a Hammer &amp; Wrench</h3>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">No power generators, no concrete mixers, no waiting 48 hours for cement to dry. Each kit includes pre-drilled structural bolt holes and hardened mounting hardware.</p>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">Simply align the stake, hammer into the ground, and drive the included heavy-duty lag bolts straight into the post. The integrated welded construction ensures no loose fittings or weak joints over time.</p>
      </div>
    </div>
  </div>

  <!-- REASON 7 WITH GIF 4 (STORM RESISTANCE & 3 STEPS) -->
  <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
    <div style="display: flex; flex-direction: column; gap: 18px;">
      <div style="text-align: center;">
        <img src="${GIFS.storm}" alt="Extreme stability and storm wind resistance" style="width: 100%; max-width: 480px; height: auto; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: inline-block;" loading="lazy">
      </div>
      <div>
        <div style="display: inline-block; background: #dbeafe; color: #1e40af; font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">STORM-PROVEN</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 10px 0;">7. Extreme Storm &amp; Wind Resistance in 3 Simple Steps</h3>
        
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: #2563eb; color: #fff; font-weight: 700; border-radius: 50%; font-size: 13px; flex-shrink: 0;">1</span>
            <div>
              <strong style="color: #111827; font-size: 14px;">Position &amp; Align:</strong>
              <span style="font-size: 14px; color: #4b5563;">Place the H-shaped anchor firmly against your leaning or damaged post.</span>
            </div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: #2563eb; color: #fff; font-weight: 700; border-radius: 50%; font-size: 13px; flex-shrink: 0;">2</span>
            <div>
              <strong style="color: #111827; font-size: 14px;">Hammer &amp; Drive:</strong>
              <span style="font-size: 14px; color: #4b5563;">Drive the triangular sharp-edge anchor deep into the soil with a hammer or mallet.</span>
            </div>
          </div>
          <div style="display: flex; gap: 12px; align-items: flex-start;">
            <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: #2563eb; color: #fff; font-weight: 700; border-radius: 50%; font-size: 13px; flex-shrink: 0;">3</span>
            <div>
              <strong style="color: #111827; font-size: 14px;">Lock &amp; Secure:</strong>
              <span style="font-size: 14px; color: #4b5563;">Fasten the included structural lag screws to lock the post permanently in place.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Comparison Table -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 28px; overflow-x: auto;">
    <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 16px 0; text-align: center;">How Zavelyn® Compares to Alternatives</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <thead>
        <tr style="border-bottom: 2px solid #e5e7eb; background: #f9fafb;">
          <th style="padding: 12px 14px; color: #374151;">Feature</th>
          <th style="padding: 12px 14px; color: #2563eb; font-weight: 800;">Zavelyn® H-Kit</th>
          <th style="padding: 12px 14px; color: #6b7280;">Single Spike</th>
          <th style="padding: 12px 14px; color: #6b7280;">Concrete Reset</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 14px; font-weight: 600; color: #111827;">No Digging Needed</td>
          <td style="padding: 12px 14px; color: #059669; font-weight: 700;">✅ Yes (Zero)</td>
          <td style="padding: 12px 14px; color: #059669;">✅ Yes</td>
          <td style="padding: 12px 14px; color: #dc2626;">❌ Hours of digging</td>
        </tr>
        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafafa;">
          <td style="padding: 12px 14px; font-weight: 600; color: #111827;">Stops Post Fatigue</td>
          <td style="padding: 12px 14px; color: #059669; font-weight: 700;">✅ Dual-beam locks soil</td>
          <td style="padding: 12px 14px; color: #dc2626;">❌ Wobbles in loose soil</td>
          <td style="padding: 12px 14px; color: #d97706;">⚠️ Temporary</td>
        </tr>
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 14px; font-weight: 600; color: #111827;">Installation Time</td>
          <td style="padding: 12px 14px; color: #059669; font-weight: 700;">✅ Under 20 min</td>
          <td style="padding: 12px 14px; color: #059669;">✅ 15 min</td>
          <td style="padding: 12px 14px; color: #dc2626;">❌ 2-3 Days + Curing</td>
        </tr>
        <tr style="border-bottom: 1px solid #f3f4f6; background: #fafafa;">
          <td style="padding: 12px 14px; font-weight: 600; color: #111827;">Wind &amp; Storm Hold</td>
          <td style="padding: 12px 14px; color: #059669; font-weight: 700;">✅ 340% Stability</td>
          <td style="padding: 12px 14px; color: #dc2626;">❌ Bends easily</td>
          <td style="padding: 12px 14px; color: #059669;">✅ High</td>
        </tr>
        <tr>
          <td style="padding: 12px 14px; font-weight: 600; color: #111827;">Average Cost</td>
          <td style="padding: 12px 14px; color: #059669; font-weight: 700;">$59.99 (Full DIY)</td>
          <td style="padding: 12px 14px; color: #4b5563;">$45 (Low lifespan)</td>
          <td style="padding: 12px 14px; color: #dc2626;">$450 - $1,200+</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Specifications & In The Box -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 16px 0;">Technical Specifications &amp; Package</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
      <div>
        <h4 style="font-size: 15px; font-weight: 700; color: #374151; margin: 0 0 8px 0;">Specifications:</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4b5563; line-height: 1.8;">
          <li><strong>Material:</strong> Thickened Heavy-Duty Carbon Steel</li>
          <li><strong>Finish:</strong> Weatherproof Anti-Rust Electrostatic Powder Coating</li>
          <li><strong>Design:</strong> Integrated Welded H-Beam Structure</li>
          <li><strong>Anchor Tip:</strong> Ground-Slicing Triangular Spear Point</li>
          <li><strong>Compatibility:</strong> Universal 4x4, 4x6, round wood &amp; metal posts</li>
        </ul>
      </div>
      <div>
        <h4 style="font-size: 15px; font-weight: 700; color: #374151; margin: 0 0 8px 0;">What's In The Box:</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4b5563; line-height: 1.8;">
          <li>Zavelyn® Heavy-Duty Fence Post Repair Anchors (2 pc or 4 pc set)</li>
          <li>Hardened Structural Lag Screws &amp; Hex Bolts</li>
          <li>Installation Instruction Guide</li>
          <li>30-Day Risk-Free Money-Back Guarantee</li>
        </ul>
      </div>
    </div>
  </div>

</div>
`;

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function updateProduct() {
  const token = await getAccessToken();
  console.log('Got access token.');

  console.log(`Updating product ${PRODUCT_ID} with rich GIF advertorial body...`);
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${PRODUCT_ID}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        id: PRODUCT_ID,
        body_html: bodyHtml
      }
    })
  });

  const data = await res.json();
  if (data.product) {
    console.log('✔ Product body_html updated successfully!');
    console.log('Product title:', data.product.title);
    console.log('Product handle:', data.product.handle);
    console.log('New body length:', data.product.body_html.length);
    console.log(`Live URL: https://${SHOP_DOMAIN}/products/${data.product.handle}`);
  } else {
    console.error('✗ Failed to update product:', data);
  }
}

updateProduct().catch(console.error);
