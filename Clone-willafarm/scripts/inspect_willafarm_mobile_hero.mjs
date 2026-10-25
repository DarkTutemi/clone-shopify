import fs from 'fs';

const html = fs.readFileSync('Clone-willafarm/data/willafarm_home_mobile.html', 'utf8');

// Find template--...willa_hero section
const heroIdx = html.indexOf('template--19209842982973__willa_hero');
if (heroIdx !== -1) {
  const sectionEnd = html.indexOf('</section>', heroIdx);
  const heroHtml = html.substring(heroIdx, sectionEnd + 10);
  console.log('Hero section length:', heroHtml.length);
  fs.writeFileSync('Clone-willafarm/data/willafarm_hero_extracted.html', heroHtml);

  // Inspect hero text and order of elements
  const lines = heroHtml.split('\n').filter(l => l.trim().length > 0);
  console.log('First 40 lines of Willa hero:');
  console.log(lines.slice(0, 40).join('\n'));
} else {
  console.log('Hero section ID not found by exact string, searching for hero...');
  const heroMatches = [...html.matchAll(/class=["'][^"']*hero[^"']*["']/gi)];
  console.log('Hero class matches:', heroMatches.length);
}
