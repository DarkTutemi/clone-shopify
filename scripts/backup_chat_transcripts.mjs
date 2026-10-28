import fs from 'fs';
import path from 'path';

const SRC_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\.system_generated\\logs';
const DEST_DIR = 'backups/chat_sessions/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

for (const file of ['transcript.jsonl', 'transcript_full.jsonl']) {
  const src = path.join(SRC_DIR, file);
  const dest = path.join(DEST_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file} to ${dest}`);
  }
}
