import * as cheerio from 'cheerio';
import fs from 'fs';

async function analyzeReference() {
  console.log('Fetching https://kittycollective.co/ ...');
  const res = await fetch('https://kittycollective.co/');
  const html = await res.text();
  const $ = cheerio.load(html);

  console.log('\n=== 1. SITE METADATA & THEME INFO ===');
  console.log('Title:', $('title').text().trim());
  console.log('Meta Description:', $('meta[name="description"]').attr('content'));

  const themeMatch = html.match(/Shopify\.theme\s*=\s*({[^}]+})/);
  if (themeMatch) {
    console.log('Shopify Theme Config:', themeMatch[1]);
  }

  console.log('\n=== 2. HEADER & ANNOUNCEMENT BAR ===');
  const announcements = [];
  $('[class*="announcement"], [class*="marquee"], [class*="ticker"]').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text && text.length < 200) announcements.push(text);
  });
  console.log('Announcements:', announcements.slice(0, 3));

  const navLinks = [];
  $('header a, nav a').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    const href = $(el).attr('href');
    if (text && href && !navLinks.some(n => n.text === text)) {
      navLinks.push({ text, href });
    }
  });
  console.log('Nav Links:', navLinks);

  console.log('\n=== 3. SECTIONS FLOW (HOMEPAGE STORYTELLING) ===');
  const sections = [];
  $('[id^="shopify-section-"]').each((i, el) => {
    const id = $(el).attr('id');
    const classes = $(el).attr('class') || '';
    const headings = $(el).find('h1, h2, h3, h4').map((j, h) => $(h).text().replace(/\s+/g, ' ').trim()).get();
    const ctas = $(el).find('a.button, button, a[class*="btn"], a[class*="button"]').map((j, b) => $(b).text().replace(/\s+/g, ' ').trim()).get();
    const imagesCount = $(el).find('img').length;
    const textPreview = $(el).find('p').map((j, p) => $(p).text().replace(/\s+/g, ' ').trim()).get().join(' | ').slice(0, 150);

    sections.push({
      index: i + 1,
      id,
      typeHint: classes.split(' ').find(c => c.startsWith('shopify-section-')) || classes,
      headings: headings.filter(h => h.length > 0).slice(0, 5),
      ctas: ctas.filter(c => c.length > 0).slice(0, 3),
      imagesCount,
      textPreview
    });
  });

  console.log(`Found ${sections.length} shopify sections on homepage:`);
  sections.forEach(s => {
    console.log(`\n[Section ${s.index}] ID: ${s.id}`);
    console.log(`  Type: ${s.typeHint}`);
    console.log(`  Headings: ${s.headings.join(' -> ')}`);
    console.log(`  CTAs: ${s.ctas.join(' | ')}`);
    if (s.textPreview) console.log(`  Preview: ${s.textPreview}`);
  });

  // Save report
  fs.writeFileSync('scripts/kittycollective_analysis.json', JSON.stringify({
    title: $('title').text().trim(),
    metaDesc: $('meta[name="description"]').attr('content'),
    sections
  }, null, 2));

  console.log('\nSaved full analysis to scripts/kittycollective_analysis.json');
}

analyzeReference();
