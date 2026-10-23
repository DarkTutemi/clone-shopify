# 🎯 Antigravity DOM Inspector & Agent Bridge Extension

Plugin / Chrome Extension dành riêng cho paneer để kiểm tra trực quan giao diện trên Trình duyệt Antigravity IDE (Chrome DevTools).

---

## ✨ Tính năng nổi bật

1. **Laser Highlighter:** Rê chuột đến bất kỳ thành phần nào trên trang (Button, Text, Section, Review, Image...) sẽ hiện khung xanh viền nét đứt kèm kích thước và tên thẻ chính xác.
2. **Click-to-Inspect:** Click vào bất kỳ vị trí nào để khóa phần tử và mở bảng điều khiển DOM Inspector.
3. **Trích xuất tự động:**
   - URL & Tiêu đề trang
   - CSS Selector duy nhất & Full XPath
   - Kích thước (`width × height`)
   - Text nội dung
   - Computed CSS quan trọng (`color`, `background`, `font-size`, `padding`, `margin`, `flex`, `display`...)
   - Outer HTML
4. **2 Chế độ gửi phản hồi cho Agent:**
   - **📋 Copy Prompt Cho Chat:** Copy toàn bộ báo cáo Markdown có cấu trúc chuẩn vào Clipboard, chỉ cần `Ctrl + V` vào khung chat là Agent hiểu ngay.
   - **🚀 Gửi Trực Tiếp Cho Agent:** Bấm 1 nút gửi HTTP trực tiếp qua cổng `http://127.0.0.1:9876/feedback`. Dữ liệu lập tức được ghi vào `agent_feedback.json` và `agent_feedback.md` trên workspace!

---

## 🚀 Cách sử dụng

### Cách 1: Sử dụng ngay trên Browser hiện tại (Đã kích hoạt sẵn)
- Mở cửa sổ trình duyệt Antigravity IDE.
- Ở góc dưới bên phải màn hình, paneer sẽ thấy nút nổi:
  **🎯 Inspect for Agent**
- Click vào nút đó (hoặc bấm phím tắt bật inspect), sau đó click vào bất kỳ thành phần nào trên trang chưa ưng ý.
- Nhập ghi chú muốn sửa vào ô `✍️ YÊU CẦU SỬA CHO AGENT`.
- Chọn **Gửi Trực Tiếp Cho Agent** hoặc **Copy Prompt Cho Chat**.

---

### Cách 2: Cài đặt vĩnh viễn vào Chrome làm Extension (Load Unpacked)
1. Mở Chrome trên máy hoặc trình duyệt Antigravity IDE, vào địa chỉ:
   `chrome://extensions/`
2. Bật công tắc **Developer mode** ở góc trên bên phải.
3. Bấm **Load unpacked** (Tải tiện ích đã giải nén).
4. Chọn thư mục:
   `h:\Shopify-Clone\antigravity-dom-inspector-extension`
5. Tiện ích sẽ luôn chạy trên mọi trang web mà paneer mở!

---

## 🔌 Agent Bridge Server

Server cầu nối chạy ngầm tại:
`http://127.0.0.1:9876`

File lưu lịch sử phản hồi:
- JSON: `h:\Shopify-Clone\agent_feedback.json`
- Markdown: `h:\Shopify-Clone\agent_feedback.md`

Nếu cần khởi động lại server bất kỳ lúc nào:
```bash
node h:/Shopify-Clone/local-agent-bridge.mjs
```
