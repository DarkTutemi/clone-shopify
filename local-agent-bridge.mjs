// local-agent-bridge.mjs
// Lightweight HTTP server listening on http://127.0.0.1:9876
// Receives inspected DOM elements and notes from browser extension or injected script,
// and appends them to agent_feedback.json and agent_feedback.md.

import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 9876;
const FEEDBACK_JSON = path.resolve('h:/Shopify-Clone/agent_feedback.json');
const FEEDBACK_MD = path.resolve('h:/Shopify-Clone/agent_feedback.md');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', port: PORT, timestamp: new Date().toISOString() }));
    return;
  }

  if (req.method === 'POST' && req.url === '/feedback') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const record = {
          id: 'fb_' + Date.now(),
          receivedAt: new Date().toISOString(),
          ...payload
        };

        // 1. Update agent_feedback.json
        let history = [];
        if (fs.existsSync(FEEDBACK_JSON)) {
          try {
            history = JSON.parse(fs.readFileSync(FEEDBACK_JSON, 'utf8'));
            if (!Array.isArray(history)) history = [];
          } catch (e) {
            history = [];
          }
        }
        history.unshift(record);
        fs.writeFileSync(FEEDBACK_JSON, JSON.stringify(history, null, 2), 'utf8');

        // 2. Append to agent_feedback.md
        const mdEntry = [
          `\n---\n`,
          `## 🚩 Phản hồi lúc: ${record.receivedAt}`,
          `**URL:** ${record.url || 'N/A'}`,
          `**Phần tử:** \`<${record.tagName}>\` (\`${record.selector}\`)`,
          `**XPath:** \`${record.xpath}\``,
          `**Kích thước:** \`${record.size}\``,
          record.userNote ? `\n> **YÊU CẦU CỦA PANEER:**\n> ${record.userNote.split('\n').join('\n> ')}\n` : '',
          `### Outer HTML:`,
          '```html',
          record.outerHtml || '',
          '```',
          `### Computed Styles:`,
          '```json',
          JSON.stringify(record.styles || {}, null, 2),
          '```\n'
        ].join('\n');

        fs.appendFileSync(FEEDBACK_MD, mdEntry, 'utf8');

        console.log(`[Agent Bridge] Received feedback for: <${record.tagName}> at ${record.url}`);
        if (record.userNote) {
          console.log(`[Agent Bridge] Paneer note: "${record.userNote}"`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Đã nhận phản hồi!', id: record.id }));
      } catch (err) {
        console.error('[Agent Bridge] Error parsing feedback:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Antigravity Agent Bridge Server is running at http://127.0.0.1:${PORT}`);
  console.log(`📂 Listening for browser clicks -> Writing to:`);
  console.log(`   - ${FEEDBACK_JSON}`);
  console.log(`   - ${FEEDBACK_MD}`);
});
