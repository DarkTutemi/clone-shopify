import fs from 'fs';

for (const f of ['ali_item.html', 'ali_item2.html']) {
  if (fs.existsSync(f)) {
    const text = fs.readFileSync(f, 'utf8');
    const imgs = text.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|png|webp|avif)/gi) || [];
    console.log(`${f}: length=${text.length}, found ${imgs.length} images`);
    console.log('Sample:', imgs.slice(0, 5));
  }
}
