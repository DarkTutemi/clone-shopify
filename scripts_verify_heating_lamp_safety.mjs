import fs from 'fs';

async function run() {
  const res = await fetch('https://tryzavelyn.com/products/livestock-heating-lamp');
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Contains Livestock Heating Lamp:', text.includes('Livestock Heating Lamp') || text.includes('Heating Lamp'));
  console.log('Contains Add to Cart or buy buttons:', text.includes('Add to Cart') || text.includes('ORDER NOW') || text.includes('Buy'));
  console.log('HTML size:', text.length);
}

run().catch(console.error);
