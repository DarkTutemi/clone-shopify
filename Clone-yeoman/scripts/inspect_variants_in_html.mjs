import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/product_main_section.html', 'utf8');

// Find all occurrences of 21 in, 26 in, 30 in
['21 in', '26 in', '30 in', '21"', '26"', '30"'].forEach(size => {
  let pos = 0;
  let count = 0;
  while ((pos = html.indexOf(size, pos)) !== -1) {
    count++;
    if (count <= 3) {
      console.log(`\nOccurrence of "${size}" at pos ${pos}:`);
      console.log(html.substring(Math.max(0, pos - 100), Math.min(html.length, pos + 200)));
    }
    pos += size.length;
  }
  console.log(`Total occurrences of "${size}":`, count);
});
