import fs from 'fs';

const html = fs.readFileSync('kitty_pdp_full.html', 'utf-8');

const start = html.indexOf('payment-icons-wrapper');
if (start !== -1) {
  const snippet = html.substring(start + 2000, start + 12000);
  fs.writeFileSync('scripts/kitty_after_payment.html', snippet, 'utf-8');
  console.log('Saved kitty_after_payment.html');
}
