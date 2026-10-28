import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CURRENT_CONVERSATION_ID = 'd0f634e2-c9dd-4bad-bdb2-3c956abea303';
const BRAIN_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain';
const REPO_ROOT = 'c:/Users/Admin/Desktop/CLONE SPF';
const CHAT_HISTORY_DIR = path.join(REPO_ROOT, 'chat_history');

function maskSecrets(str) {
  if (!str) return str;
  return str
    .replace(/AQ\.[a-zA-Z0-9_\-]+/g, 'AQ.REDACTED_GEMINI_KEY')
    .replace(/AIza[0-9A-Za-z-_]{35}/g, 'AIza_REDACTED_SECRET')
    .replace(/shpat_[a-zA-Z0-9]+/g, 'shpat_REDACTED_SECRET')
    .replace(/shpss_[a-zA-Z0-9]+/g, 'shpss_REDACTED_SECRET')
    .replace(/sk_live_[0-9a-zA-Z]+/g, 'sk_live_REDACTED_SECRET')
    .replace(/sk_test_[0-9a-zA-Z]+/g, 'sk_test_REDACTED_SECRET')
    .replace(/pk_live_[0-9a-zA-Z]+/g, 'pk_live_REDACTED_SECRET')
    .replace(/pk_test_[0-9a-zA-Z]+/g, 'pk_test_REDACTED_SECRET')
    .replace(/ghp_[0-9a-zA-Z]{36}/g, 'ghp_REDACTED_SECRET')
    .replace(/github_pat_[0-9a-zA-Z_]{82}/g, 'github_pat_REDACTED_SECRET')
    .replace(/68ca2de27a9e6adb66211c47ebe6ac11/g, 'REDACTED_CLIENT_SECRET');
}

async function readStdin() {
  return new Promise((resolve) => {
    if (process.stdin.isTTY || !process.argv.includes('--hook')) {
      return resolve('');
    }
    let data = '';
    const timeout = setTimeout(() => resolve(data), 1000);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => {
      clearTimeout(timeout);
      resolve(data);
    });
    process.stdin.on('error', () => {
      clearTimeout(timeout);
      resolve('');
    });
  });
}

async function main() {
  const isHook = process.argv.includes('--hook');
  const stdinData = await readStdin();

  let conversationId = CURRENT_CONVERSATION_ID;
  let transcriptPath = '';

  const idArgIdx = process.argv.indexOf('--conversation-id');
  if (idArgIdx !== -1 && process.argv[idArgIdx + 1]) {
    conversationId = process.argv[idArgIdx + 1];
  }

  if (stdinData) {
    try {
      const parsed = JSON.parse(stdinData);
      if (parsed.conversationId) conversationId = parsed.conversationId;
      if (parsed.transcriptPath) transcriptPath = parsed.transcriptPath;
    } catch (e) {
      // ignore
    }
  }

  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    const candidateFull = path.join(BRAIN_DIR, conversationId, '.system_generated', 'logs', 'transcript_full.jsonl');
    const candidateCompact = path.join(BRAIN_DIR, conversationId, '.system_generated', 'logs', 'transcript.jsonl');
    if (fs.existsSync(candidateFull)) {
      transcriptPath = candidateFull;
    } else if (fs.existsSync(candidateCompact)) {
      transcriptPath = candidateCompact;
    }
  }

  if (!fs.existsSync(CHAT_HISTORY_DIR)) {
    fs.mkdirSync(CHAT_HISTORY_DIR, { recursive: true });
  }

  console.log(`[Backup] Processing conversation: ${conversationId}`);
  console.log(`[Backup] Transcript path: ${transcriptPath}`);

  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    console.error(`[Backup] Transcript not found: ${transcriptPath}`);
    if (isHook) {
      process.stdout.write(JSON.stringify({ decision: 'allow' }));
    }
    return;
  }

  // 1. Read and sanitize raw transcript
  const rawContent = fs.readFileSync(transcriptPath, 'utf8');
  const sanitizedRaw = maskSecrets(rawContent);
  const rawDest = path.join(CHAT_HISTORY_DIR, `session_${conversationId}_full.jsonl`);
  fs.writeFileSync(rawDest, sanitizedRaw, 'utf8');

  // 2. Parse into Markdown
  const lines = sanitizedRaw.split('\n');
  const turns = [];
  let currentTurn = null;

  for (const line of lines) {
    if (!line.trim()) continue;
    let step;
    try {
      step = JSON.parse(line);
    } catch (e) {
      continue;
    }

    if (step.type === 'USER_INPUT') {
      if (currentTurn) {
        turns.push(currentTurn);
      }
      let rawText = step.content || '';
      const reqMatch = rawText.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
      const cleanPrompt = reqMatch ? reqMatch[1].trim() : rawText.trim();

      currentTurn = {
        turnIndex: turns.length + 1,
        stepIndex: step.step_index,
        timestamp: step.created_at || new Date().toISOString(),
        userPrompt: cleanPrompt,
        toolCalls: [],
        assistantResponses: []
      };
      continue;
    }

    if (!currentTurn) continue;

    if (step.tool_calls && Array.isArray(step.tool_calls)) {
      for (const tc of step.tool_calls) {
        currentTurn.toolCalls.push({
          tool: tc.name,
          argsSummary: tc.args ? Object.keys(tc.args).join(', ') : ''
        });
      }
    }

    if (step.source === 'MODEL' && (step.type === 'GENERIC' || step.type === 'PLANNER_RESPONSE') && step.content) {
      currentTurn.assistantResponses.push(step.content);
    }
  }

  if (currentTurn) {
    turns.push(currentTurn);
  }

  // Generate clean Markdown
  let md = `# 💬 CHAT SESSION TRANSCRIPT: ${conversationId}\n\n`;
  md += `> **Dự án:** DarkTutemi/clone-shopify  \n`;
  md += `> **Store:** dsdujr-vn.myshopify.com (Zavelyn)  \n`;
  md += `> **Live Theme ID:** 187597717689 (Zavelyn 2.0)  \n`;
  md += `> **Draft Theme ID:** 187720335545 ([Draft] Zavelyn - Fix Non-Botana Products Isolation)  \n`;
  md += `> **Ngày cập nhật:** ${new Date().toISOString()}  \n`;
  md += `> **Tổng số lượt tương tác (User Turns):** ${turns.length}  \n\n`;
  md += `---\n\n## 📑 MỤC LỤC CÁC ĐOẠN CHAT\n\n`;

  for (const t of turns) {
    const preview = t.userPrompt.replace(/\n/g, ' ').substring(0, 80) || '(No prompt)';
    md += `- [Turn ${t.turnIndex} (${t.timestamp})](#turn-${t.turnIndex}) - *"${preview}..."*\n`;
  }

  md += `\n---\n\n## 📝 CHI TIẾT TỪNG PHIÊN TRAO ĐỔI\n\n`;

  for (const t of turns) {
    md += `### Turn ${t.turnIndex}\n`;
    md += `* **Thời gian:** \`${t.timestamp}\` | **Step Index:** \`${t.stepIndex}\`\n\n`;
    md += `#### 👤 User Request:\n`;
    md += `\`\`\`text\n${t.userPrompt || '(Trống)'}\n\`\`\`\n\n`;

    if (t.toolCalls.length > 0) {
      md += `#### 🛠️ Các công cụ đã thực thi (${t.toolCalls.length}):\n`;
      const toolsCount = {};
      for (const tc of t.toolCalls) {
        toolsCount[tc.tool] = (toolsCount[tc.tool] || 0) + 1;
      }
      const toolsSummary = Object.entries(toolsCount).map(([k, v]) => `\`${k}\` (${v})`).join(', ');
      md += `- ${toolsSummary}\n\n`;
    }

    if (t.assistantResponses.length > 0) {
      md += `#### 🤖 Assistant Response:\n`;
      const lastResp = t.assistantResponses[t.assistantResponses.length - 1];
      md += `${lastResp}\n\n`;
    }

    md += `---\n\n`;
  }

  const sanitizedMd = maskSecrets(md);
  const mdDest = path.join(CHAT_HISTORY_DIR, `session_${conversationId}_transcript.md`);
  fs.writeFileSync(mdDest, sanitizedMd, 'utf8');

  // Discover all sessions in chat_history
  const allFiles = fs.readdirSync(CHAT_HISTORY_DIR);
  const transcriptFiles = allFiles.filter(f => f.startsWith('session_') && f.endsWith('_transcript.md'));

  // Update README in chat_history
  let readme = `# 📚 KHO LƯU TRỮ LỊCH SỬ CHAT (AUTOMATIC SESSION BACKUPS)\n\n`;
  readme += `Thư mục này tự động ghi lại toàn bộ lịch sử các đoạn chat, chỉ đạo kỹ thuật, và mã nguồn sinh ra giữa User và Assistant.\n\n`;
  readme += `## 📋 Danh sách các phiên làm việc:\n\n`;
  readme += `| Phiên (Conversation ID) | Tệp Markdown | Tệp Raw JSONL | Trạng thái |\n`;
  readme += `| :--- | :--- | :--- | :--- |\n`;

  for (const tf of transcriptFiles) {
    const sId = tf.replace('session_', '').replace('_transcript.md', '');
    const jsonlFile = `session_${sId}_full.jsonl`;
    const isCurrent = (sId === conversationId);
    readme += `| \`${sId}\`${isCurrent ? ' *(Current)*' : ''} | [Xem Transcript](./${tf}) | [\`${jsonlFile}\`](./${jsonlFile}) | Đã lưu trữ an toàn |\n`;
  }

  readme += `\n## ⚙️ Cơ chế tự động sao lưu:\n`;
  readme += `- Được điều khiển bởi hook \`Stop\` trong file [\`.agents/hooks.json\`](../.agents/hooks.json) hoặc gọi trực tiếp qua script [\`scripts/backup_chat_session.mjs\`](../scripts/backup_chat_session.mjs).\n`;
  readme += `- Toàn bộ API secrets, keys, và sensitive tokens được tự động làm sạch (redacted) trước khi lưu trữ và commit lên GitHub repository \`DarkTutemi/clone-shopify\`.\n`;

  fs.writeFileSync(path.join(CHAT_HISTORY_DIR, 'README.md'), readme, 'utf8');

  console.log(`[Backup] Sanitized Markdown generated: ${mdDest}`);
  console.log(`[Backup] Sanitized Raw JSONL copied: ${rawDest}`);
  console.log(`[Backup] Total turns processed: ${turns.length}`);

  if (isHook) {
    process.stdout.write(JSON.stringify({ decision: 'allow' }));
  }
}

main().catch(err => {
  console.error('[Backup] Fatal error:', err);
  if (process.argv.includes('--hook')) {
    process.stdout.write(JSON.stringify({ decision: 'allow' }));
  }
});
