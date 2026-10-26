# 📚 KHO LƯU TRỮ LỊCH SỬ CHAT (AUTOMATIC SESSION BACKUPS)

Thư mục này tự động ghi lại toàn bộ lịch sử các đoạn chat, chỉ đạo kỹ thuật, và mã nguồn sinh ra giữa User và Assistant.

## 📋 Danh sách các phiên làm việc:

| Phiên (Conversation ID) | Tệp Markdown | Tệp Raw JSONL | Số lượt tương tác | Cập nhật lần cuối |
| :--- | :--- | :--- | :--- | :--- |
| `ba009709-9c7b-4366-a57b-5a4a187c37c3` | [Xem Transcript](file:///c:/Users/Admin/Desktop/CLONE%20SPF/chat_history/session_ba009709-9c7b-4366-a57b-5a4a187c37c3_transcript.md) | [`session_ba009709-9c7b-4366-a57b-5a4a187c37c3_full.jsonl`](file:///c:/Users/Admin/Desktop/CLONE%20SPF/chat_history/session_ba009709-9c7b-4366-a57b-5a4a187c37c3_full.jsonl) | 100 turns | 2026-10-26T19:06:25.650Z |

## ⚙️ Cơ chế tự động sao lưu:
- Được điều khiển bởi hook `Stop` trong file [`.agents/hooks.json`](file:///c:/Users/Admin/Desktop/CLONE%20SPF/.agents/hooks.json).
- Mỗi khi kết thúc một lượt trả lời của Assistant, script [`scripts/backup_chat_session.mjs`](file:///c:/Users/Admin/Desktop/CLONE%20SPF/scripts/backup_chat_session.mjs) sẽ tự động đồng bộ transcript mới nhất, commit và push lên GitHub repository `DarkTutemi/clone-shopify`.
