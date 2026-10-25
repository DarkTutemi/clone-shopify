# Rule: Automatic Chat Session Backup

- **Mục tiêu:** Đảm bảo toàn bộ trao đổi kỹ thuật, chỉ đạo prompt và quyết định thiết kế giữa User và Agent luôn được lưu trữ và sao lưu an toàn trên GitHub repository `DarkTutemi/clone-shopify`.
- **Cơ chế sao lưu:**
  - File cấu hình hook: `.agents/hooks.json` kích hoạt sự kiện `Stop` sau mỗi lượt phản hồi của Agent.
  - Script thực thi: `node ./scripts/backup_chat_session.mjs --hook`.
  - Thư mục lưu trữ: `chat_history/`.
    - `session_<id>_transcript.md`: Định dạng Markdown dễ đọc, mục lục theo từng lượt chat, tóm tắt công cụ và kết quả.
    - `session_<id>_full.jsonl`: Bản sao lưu chi tiết toàn bộ chuỗi sự kiện raw JSONL.
    - `README.md`: Bảng thống kê các phiên làm việc.
  - Tự động khử/che giấu (sanitize) toàn bộ token/API key nhạy cảm trước khi push để vượt qua GitHub Push Protection một cách an toàn.
