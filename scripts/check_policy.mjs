async function check() {
  const res = await fetch('https://tryzavelyn.com/policies/refund-policy');
  const html = await res.text();
  const matches = [...html.matchAll(/class="([^"]*policy[^"]*)"/g)].map(m => m[1]);
  console.log('Policy classes:', matches);
  
  const idx = html.indexOf('INSERT RETURN ADDRESS');
  if (idx !== -1) {
    console.log('Snippet:\n', html.slice(Math.max(0, idx - 150), idx + 200));
  } else {
    console.log('INSERT RETURN ADDRESS not found in HTML!');
  }
}
check();
