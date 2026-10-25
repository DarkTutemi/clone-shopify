import fs from 'fs';

const gifs = [
  'https://file.myshopage.com/c64650b534655c160fa283be5f45b1c8.gif',
  'https://file.myshopage.com/c9616150c6deb3aa9c37f613f94f00d6.gif',
  'https://file.myshopage.com/cd715597e59002cad4b146c7bb453697.gif',
  'https://file.myshopage.com/b570b9c77d8ef348729b073fc784d07f.gif'
];

fs.mkdirSync('fence_gifs', { recursive: true });

async function run() {
  for (let i = 0; i < gifs.length; i++) {
    const url = gifs[i];
    const filePath = `fence_gifs/gif_${i+1}.gif`;
    try {
      const res = await fetch(url);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buf);
      console.log(`Saved ${filePath} (${buf.length} bytes)`);
    } catch (e) {
      console.error(`Failed ${url}:`, e);
    }
  }
}

run();
