import fs from 'fs';

async function run() {
  const res = await fetch('https://tryzavelyn.com/');
  const html = await res.text();
  const idx = html.indexOf('/collections/zavelyn-handpans');
  console.log('Index of handpans link:', idx);
  if (idx !== -1) {
    console.log('Snippet:\n', html.slice(idx - 100, idx + 200));
  }
}

run().catch(console.error);
