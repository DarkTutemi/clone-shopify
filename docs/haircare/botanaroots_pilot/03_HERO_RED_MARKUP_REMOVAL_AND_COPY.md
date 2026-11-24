# 03 — Hero Red Markup Removal & Copy Verification

## 1. Summary of Red-Marked Removals (BotanaRoots Only)

| Component | Selector / Marker | Before State | After State | Visual & DOM Verification |
|---|---|---|---|---|
| **Mini Trust Badges** | `.zvhc-authentic-trust-row` | Row of 3 badges (`3–8 WEEK EDGE REVIVAL`, `100% RAW BOTANICALS`, `TRACKED US DELIVERY`) rendered under Trustpilot | Completely suppressed via `{% unless product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' %}` | **PASS** — DOM removed, 0px vertical waste |
| **Trustpilot Rating** | `.zvhc-trustpilot-row` | 4.9 rating / 28,490 reviews / official SVG stars | 100% Frozen and untouched | **PASS** — Exactly matches baseline |
| **Spec Pill under H1** | `.zvhc-pdp-spec-pill` | `120g (4 oz) · 100% Raw Honduran Batana · Cold-Pressed` | Suppressed via conditional | **PASS** — DOM removed, spacing collapsed cleanly |
| **6 Quick Value Pills** | `.zvhc-quick-pills-wrap` | 6 pills (`Regrows Edges`, `Nourishes Scalp`, `Restores Elasticity`, `Restores Shine`, `Strengthens Follicles`, `Stops Breakage`) | Container suppressed (`pill1` set to blank for BotanaRoots) | **PASS** — Entire container and whitespace eliminated |
| **3 Primary Checkmark Bullets** | `.zvhc-benefits-list` | 3 bullets below pills | Preserved with refined styling and margins | **PASS** — All 3 bullets display with green checkmarks |
| **Shipping Dispatch Badge** | `.zvhc-dispatch-badge` | `Orders ship by tomorrow • Free shipping on 2+ bottles` | `• Free shipping on 2+ bottles` cleanly removed; retained `Fast US Tracked Delivery: Orders ship by tomorrow` | **PASS** — Correct text verified in DOM and visual render |

## 2. Approved Headline & Subtitle Copy

### Product Title (H1)
`BotanaRoots™ Batana Hair Growth & Edge Oil`

### Approved 3-Line Subtitle
```text
Unrefined Honduran Batana for thinning edges, fragile hairlines & slow-growing crowns.
A 90-second nightly ritual built for 3A–4C coils, locs & protective styles.
100% raw. Wildcrafted. Nothing added.
```
- **Line Count Desktop:** Exactly 3 clean lines.
- **Tone:** Premium, cultural, authentic, zero unproven medical claims.
- **Angle Alignment:** Addresses thinning edges, high-tension styles (braids, locs, wigs), and 3A–4C coil textures.

## 3. Benefits List Copy
1. **Edge Revival:** *Wake up thinning edges: Rich in natural tocotrienols and oleic acid to revive hairlines damaged by wig glue, braid tension & traction stress*
2. **Zero Buildup:** *Zero mineral oil or petroleum: 100% raw, unrefined Honduran Batana sinks directly into dry roots without coating strands in heavy grease*
3. **Protective Style Safe:** *Protective style safe: Easily melts between braids, under sew-in tracks, along locs, and leave-outs for 3A–4C textures with zero flaking*
