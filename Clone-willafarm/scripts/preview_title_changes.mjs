import fs from 'fs';

const products = JSON.parse(fs.readFileSync('Clone-willafarm/scripts/products_brand_audit.json', 'utf-8'));

function transformTitle(title) {
  let t = title.trim();

  // If already starts with Zavelyn®
  if (t.startsWith('Zavelyn®')) {
    return t;
  }

  // Replace Sakerplus® or Sakerplus or Saker® or Saker
  t = t.replace(/^Sakerplus®\s*/i, 'Zavelyn® ');
  t = t.replace(/^Sakerplus\s*/i, 'Zavelyn® ');
  t = t.replace(/^Saker®\s*/i, 'Zavelyn® ');
  t = t.replace(/^Saker\s*/i, 'Zavelyn® ');

  // Replace Naväge or Navage
  t = t.replace(/^Naväge\s*/i, 'Zavelyn® ');
  t = t.replace(/^Navage\s*/i, 'Zavelyn® ');

  // Replace Thoson MagTrack™ or Thoson
  t = t.replace(/^Thoson MagTrack™/i, 'Zavelyn® MagTrack™');
  t = t.replace(/^Thoson\s*/i, 'Zavelyn® ');

  // Replace The Yeoman Sweep
  t = t.replace(/^The Yeoman Sweep/i, 'Zavelyn® Yeoman Sweep');

  // Replace SrefalSteam™
  t = t.replace(/^SrefalSteam™/i, 'Zavelyn® Steam Pro');
  t = t.replace(/^SrefalSteam/i, 'Zavelyn® Steam Pro');

  // Replace Zavelyn without ®
  if (t.startsWith('Zavelyn |')) {
    t = t.replace(/^Zavelyn\s*\|\s*/i, 'Zavelyn® ');
  } else if (t.startsWith('Zavelyn ')) {
    t = t.replace(/^Zavelyn\s+/i, 'Zavelyn® ');
  } else if (!t.startsWith('Zavelyn®')) {
    t = `Zavelyn® ${t}`;
  }

  // Clean extra spaces
  t = t.replace(/\s+/g, ' ').trim();
  return t;
}

const preview = products.map(p => ({
  id: p.id,
  handle: p.handle,
  oldTitle: p.title,
  newTitle: transformTitle(p.title)
}));

console.log(`Preview of all ${preview.length} products:`);
preview.forEach(p => {
  const changed = p.oldTitle !== p.newTitle;
  console.log(`[${changed ? 'CHANGE' : 'KEEP'}] ${p.oldTitle}  ===>  ${p.newTitle}`);
});

fs.writeFileSync('Clone-willafarm/scripts/products_title_preview.json', JSON.stringify(preview, null, 2));
