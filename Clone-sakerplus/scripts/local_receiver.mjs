import http from 'http';
import fs from 'fs';

fs.mkdirSync('Clone-sakerplus/data/heating_lamp', { recursive: true });

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      if (req.url === '/save-news') {
        fs.writeFileSync('Clone-sakerplus/data/heating_lamp/news.html', body);
        console.log(`✔ Saved news.html (${body.length} bytes)`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', size: body.length }));
      } else if (req.url === '/save-order') {
        fs.writeFileSync('Clone-sakerplus/data/heating_lamp/order.html', body);
        console.log(`✔ Saved order.html (${body.length} bytes)`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', size: body.length }));
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  } else {
    res.writeHead(200);
    res.end('Server ready');
  }
});

const PORT = 3333;
server.listen(PORT, () => {
  console.log(`Local receiver listening on http://localhost:${PORT}`);
});
