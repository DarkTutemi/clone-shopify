# 📚 KHO LƯU TRỮ LỊCH SỬ CHAT (AUTOMATIC SESSION BACKUPS)

Thư mục này tự động ghi lại toàn bộ lịch sử các đoạn chat, chỉ đạo kỹ thuật, và mã nguồn sinh ra giữa User và Assistant.

## 📋 Danh sách các phiên làm việc:

| Phiên (Conversation ID) | Tệp Markdown | Tệp Raw JSONL | Trạng thái |
| :--- | :--- | :--- | :--- |
| `ba009709-9c7b-4366-a57b-5a4a187c37c3` | [Xem Transcript](./session_ba009709-9c7b-4366-a57b-5a4a187c37c3_transcript.md) | [`session_ba009709-9c7b-4366-a57b-5a4a187c37c3_full.jsonl`](./session_ba009709-9c7b-4366-a57b-5a4a187c37c3_full.jsonl) | Đã lưu trữ an toàn |
| `d0f634e2-c9dd-4bad-bdb2-3c956abea303` *(Current)* | [Xem Transcript](./session_d0f634e2-c9dd-4bad-bdb2-3c956abea303_transcript.md) | [`session_d0f634e2-c9dd-4bad-bdb2-3c956abea303_full.jsonl`](./session_d0f634e2-c9dd-4bad-bdb2-3c956abea303_full.jsonl) | Đã lưu trữ an toàn |

## ⚙️ Cơ chế tự động sao lưu:
- Được điều khiển bởi hook `Stop` trong file [`.agents/hooks.json`](../.agents/hooks.json) hoặc gọi trực tiếp qua script [`scripts/backup_chat_session.mjs`](../scripts/backup_chat_session.mjs).
- Toàn bộ API secrets, keys, và sensitive tokens được tự động làm sạch (redacted) trước khi lưu trữ và commit lên GitHub repository `DarkTutemi/clone-shopify`.
