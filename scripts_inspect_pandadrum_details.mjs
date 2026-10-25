import fs from 'fs';

for (const name of ['pro', 'plus', 'mini']) {
  const p = JSON.parse(fs.readFileSync(`Clone-pandadrum/${name}.json`, 'utf8'));
  console.log(`\n================= ${name.toUpperCase()} =================`);
  console.log('Title:', p.title);
  console.log('Handle:', p.handle);
  console.log('Description length:', p.description ? p.description.length : 0);
  console.log('Description text sample:', p.description ? p.description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400) : '');
  console.log('Images (first 5):');
  p.images.slice(0, 5).forEach((img, i) => {
    console.log(`  [${i+1}] ${img}`);
  });
}
