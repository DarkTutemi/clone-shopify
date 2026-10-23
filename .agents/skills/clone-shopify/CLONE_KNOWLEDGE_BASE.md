# 🧠 SHOPIFY CLONER AGENT KNOWLEDGE BASE & RETROSPECTIVES (ECC HARNESS)

> Hệ tri thức đúc kết từ các dự án thực tế đã hoàn thành, vận hành theo cơ chế Eval-Driven Development (EDD) của ECC để nâng cao năng lực tự trị và tỷ lệ `pass@1` cho agent trong các dự án tiếp theo.

---

## 🏛️ RETROSPECTIVE 1: DỰ ÁN CLONE-TRYBRONOIR (THỜI TRANG & GIÀY BAREFOOT)
* **Website gốc:** `https://trybronoir.com`
* **Loại hình:** E-commerce đa danh mục (Ballerinas, Sandals, Winter Boots, Sneakers, Orthopedic Insoles, Socks).
* **Đặc thù kỹ thuật & Các bài học sống còn:**
  1. **Chống lây nhiễm nội dung chéo (Zero Cross-Pollination):**
     - *Vấn đề phát sinh:* Các section marketing đặc thù (như 6 story blocks chống tuyết/giữ nhiệt của bốt mùa đông) ban đầu bị render trên cả giày búp bê và sandal khiến nội dung vô lý.
     - *Giải pháp tối ưu:* Mọi khối section đặc thù phải bọc trong điều kiện Liquid thông minh `{% if product.tags contains 'winter' or is_winter %}` hoặc phân tách thành template độc lập, triệt để không hardcode.
  2. **Bố cục đa tầng cho Collection đặc thù (Multi-tier Layouts):**
     - *Vấn đề phát sinh:* Collection `socks-and-insoles` không phải lưới phẳng 4 cột đơn giản mà gồm 3 tầng: Bubbles điều hướng trên cùng ➔ Khối `ORTHOPEDIC INSOLES` 2 thẻ căn giữa ➔ Khối `COMBINE WITH:` 4 cột cross-sell.
     - *Giải pháp tối ưu:* Luôn recon DOM cấu trúc collection gốc, không áp dụng template lưới đồng loạt.
  3. **Thanh đếm ngược & Countdown Bar phân nhánh:**
     - *Vấn đề phát sinh:* Thanh `🚨Get up to 50% off🚨` hoặc `🚨Buy 1, Get 1 Free🚨` chỉ thuộc các bộ sưu tập khuyến mãi. Bộ sưu tập Bestsellers của họ không có thanh này.
     - *Giải pháp tối ưu:* Lưu cờ `has_countdown: boolean` theo từng collection trong JSON metadata.
  4. **Dynamic `SAVE` Badge & Bundle Pricing:**
     - *Vấn đề phát sinh:* Badge `SAVE $X` ban đầu bị hardcode số tiền USD hoặc dùng filter lồng `append: (a | money)` gây crash Liquid.
     - *Giải pháp tối ưu:* Tách biến trung gian `{% assign diff = variant.compare_at_price | minus: variant.price | money %}` rồi mới hiển thị.

---

## 🏛️ RETROSPECTIVE 2: DỰ ÁN CLONE-EARTHLYDERM (CHĂM SÓC DA & MỸ PHẨM)
* **Website gốc:** `https://earthlyderm.com`
* **Loại hình:** Mỹ phẩm organic, serum ngừa mụn, bundle PDP, review transformation slider, floating corner teaser.
* **Đặc thù kỹ thuật & Các bài học sống còn:**
  1. **Toàn vẹn Cú pháp HTML (HTML Well-formedness & Syntax Cleanliness):**
     - *Vấn đề phát sinh:* File `earthly-about-us.liquid` xuất hiện chuỗi lỗi `class="earthly-about-wrapper"...</div><div` làm hỏng cây DOM (`<DIV<`), khiến trình duyệt parse sai và làm vỡ toàn bộ section video marketing bên dưới.
     - *Giải pháp tối ưu:* Áp dụng Code Grader tự động kiểm tra tag balance và cấm hoàn toàn chuỗi `</div><div` thiếu mở/đóng thẻ.
  2. **Cách ly Triệt để CSS (Scoped CSS Isolation & Layout Margins):**
     - *Vấn đề phát sinh:* Section `image-with-text` bị lỗi ảnh đè lên chữ do thừa hưởng class `.background-size-cover { position: absolute; }` từ theme mẹ và margin âm `-125px`.
     - *Giải pháp tối ưu:* Toàn bộ section custom phải được wrap bằng scoped id `#SectionId-{{ section.id }}` và reset rõ ràng `position: relative !important; margin: 0 !important; flex: 1 1 50% !important;`.
  3. **Floating & Corner Teaser Overlays (Klaviyo 120px × 120px Ribbon):**
     - *Vấn đề phát sinh:* Nút teaser `Get 5% Off` góc trái dưới bị thanh Shopify Preview Bar (`#preview-bar-iframe`) che khuất hoặc bị tính toán sai toạ độ viewport.
     - *Giải pháp tối ưu:* Sử dụng `position: fixed !important; bottom: 0 !important; left: 0 !important; z-index: 99999 !important; pointer-events: auto;` kết hợp `clip-path: polygon(0 0, 100% 100%, 0 100%)` và xoay 45 độ để tạo dải ruy băng chuẩn 1:1.
  4. **Interactive Slider Components (BlazeSlider Before/After Transformations):**
     - *Vấn đề phát sinh:* Site gốc dùng slider BlazeSlider gồm 5 thẻ ảnh biến đổi da trước và sau điều trị. Không thể thay thế tùy tiện bằng grid sản phẩm thông thường.
     - *Giải pháp tối ưu:* Bóc tách chính xác thư viện JS (`blaze-slider.min.js`), file CSS slider và cấu trúc DOM 5 cards để tái hiện chuyển động trượt 1:1.

---

## ⚙️ BỘ QUY TẮC CỐT LÕI CHO ECC HARNESS (APPLIED RULESET)
Mỗi khi khởi động hoặc hoàn tất một dự án clone:
1. **Trước khi build (Pre-flight):** Nạp toàn bộ các pattern đã học từ file này vào ngữ cảnh làm việc.
2. **Trong quá trình build:** Thực thi kiểm tra từng trang trên Antigravity Browser theo chu trình khép kín.
3. **Sau khi hoàn tất:** Kích hoạt `node scripts/post-clone-eval.mjs [path-to-theme] [url]` để kích hoạt bộ 3 Grader của ECC, tính toán `pass@1` / `pass^3`, và tự động ghi log vào file này.

### 📦 Project Evaluation: Clone-earthlyderm (10/23/2026)
* **Status:** SHIP IT (100% READY)
* **Score:** Passed: 6 | Failed: 0 | Warn: 2
* **Execution:** Flawless zero-defect delivery.

### 📦 Project Evaluation: Clone-trybronoir (10/23/2026)
* **Status:** SHIP IT (100% READY)
* **Score:** Passed: 7 | Failed: 0 | Warn: 1
* **Execution:** Flawless zero-defect delivery.
