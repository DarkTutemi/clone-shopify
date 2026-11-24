# 01 — Approved Scope & Trustpilot 100% Freeze

## 1. Trustpilot Freeze Verification
- **Status:** **100% FROZEN & UNTOUCHED (PASS)**
- **Selector:** `.zvhc-trustpilot-row`, `snippets/trustpilot-stars.liquid`, `.zvhc-tp-*`
- **Rendered Attributes:**
  - Rating: `4.9`
  - Review Count: `28,490 reviews`
  - Official Star SVG Snippet: Untouched, original dimensions `92x17`
  - Position: Preserved exactly between Gallery and Cultural Eyebrow
- **Diff:** Exactly 0 lines modified in `snippets/trustpilot-stars.liquid` and `.zvhc-trustpilot-row`.

## 2. In-Scope Modifications (BotanaRoots Only)
All modifications applied strictly under:
```liquid
{% when 'zavelyn-botanaroots-organic-batana-hair-growth-oil' %}
```
and:
```liquid
{% if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' %}
```
1. **Hero Cleanups (Red Marked Elements):**
   - Mini Trust Badges Row under Trustpilot: Removed on BotanaRoots (`.zvhc-authentic-trust-row`).
   - Spec Pill under H1 (`120g (4 oz)...`): Removed on BotanaRoots (`.zvhc-pdp-spec-pill`).
   - 6 Quick Benefit Pills (`Regrows Edges`...): Removed on BotanaRoots (`.zvhc-quick-pills-wrap`).
   - 3 Checkmark Bullet Benefits: Kept and styled cleanly.
   - Dispatch Badge: Omitted `• Free shipping on 2+ bottles`, retained `Fast US Tracked Delivery: Orders ship by tomorrow`.
   - Subtitle: Replaced long paragraph with concise 3-line approved copy.
2. **Nomenclature & Packaging:**
   - 120ml Jar (Hũ nắp vặn).
   - Removed all references to `120g`, `Bottle`, `Dropper`, `4–6 drops`, `60ml`, and `Rosemary Scalp Infusion`.
3. **How-To Ritual:**
   - Replaced generic fallback with bespoke 4-card luxury skincare education module (2x2 grid desktop, responsive column on mobile).
4. **Guarantee:**
   - Replaced generic 30-day guarantee with `THE 60-DAY EDGE RECOVERY PROMISE` on BotanaRoots.

## 3. Out-Of-Scope Guardrails (Protected)
- P01 `zvhc-batana-hair-growth-oil`: 100% untouched.
- Other 7 Hair Care PDPs: 100% untouched.
- 10 Legacy Funnels (Rehab Glove, BabiGuard, Yeoman, Holster, Dentures, etc.): 100% untouched.
- Live Main Theme `189240967353`: 0 modifications deployed.
- Main Git Branch: Not merged.
