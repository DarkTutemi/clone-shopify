import fs from 'fs';

async function testRedirect() {
  const url = 'https://tryzavelyn.com/products/sakerplus%C2%AE-universal-diesel-injector-removal-kit-clearance-sale?preview_theme_id=187597717689';
  const res = await fetch(url, { redirect: 'manual' });
  console.log('Status:', res.status);
  console.log('Location:', res.headers.get('location'));
  console.log('Set-Cookie:', res.headers.get('set-cookie'));
}

testRedirect().catch(console.error);
