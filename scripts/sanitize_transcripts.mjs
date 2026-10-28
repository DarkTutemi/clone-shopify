import fs from 'fs';
import path from 'path';

const dir = 'backups/chat_sessions/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
for (const file of ['transcript.jsonl', 'transcript_full.jsonl']) {
  const p = path.join(dir, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    // Redact Shopify tokens
    content = content.replace(/shpat_[a-zA-Z0-9]{32,}/g, 'shpat_REDACTED_SECRET_TOKEN');
    content = content.replace(/shpss_[a-zA-Z0-9]{32,}/g, 'shpss_REDACTED_SECRET_TOKEN');
    fs.writeFileSync(p, content, 'utf8');
    console.log(`✓ Sanitized ${file}`);
  }
}
