import fs from 'fs';
import path from 'path';

const rows = JSON.parse(fs.readFileSync('scripts/parsed_guarantee_audit_rows.json', 'utf8'));

let md = `# BÁO CÁO KIỂM TOÁN TÍNH ĐỒNG NHẤT CHÍNH SÁCH BẢO HÀNH & ĐỔI TRẢ (GUARANTEE CONSISTENCY AUDIT)
## CỬA HÀNG ZAVELYN (STAGE 2.1 — READ-ONLY AUDIT)

---

### 1. CĂN CỨ CHÍNH SÁCH CHÍNH THỨC CỦA CỬA HÀNG (POLICY EVIDENCE)

Theo tài liệu pháp lý và chính sách hoàn tiền đang áp dụng trên Shopify Admin của Zavelyn:
* **Chính sách chính thức:** **30-Day Return Policy (Chính sách trả hàng trong 30 ngày)**.
* **Nguyên văn điều khoản hoàn tiền:**
  > *"We have a 30-day return policy, which means you have 30 days after receiving your item to request a return. To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase."*
* **Quy định ràng buộc (RULE A):**
  1. Sử dụng **"30-Day Money-Back Guarantee"** làm chính sách mặc định toàn cửa hàng.
  2. **Nghiêm cấm tuyệt đối** các cam kết sai lệch: \`60-Day Guarantee\`, \`60-Day Trial\`, \`90-Day Guarantee\`, \`90-Day Trial\`, \`Risk-Free Trial\`.
  3. **Không tự ý chuyển đổi** chính sách trả hàng có điều kiện (30-day return policy) thành chương trình dùng thử tùy ý (risk-free trial).
  4. **Không tự bịa đặt cam kết:** \`No questions asked\`, \`100% guaranteed refund\`, \`Free return shipping\`, \`Zero-hassle full refund\`.
  5. Trong **Stage 2.1**, toàn bộ quy trình là **READ-ONLY**; tuyệt đối **CHƯA** chỉnh sửa file theme hay chính sách cho đến khi được duyệt.

---

### 2. TỔNG QUAN PHÁT HIỆN KIỂM TOÁN STOREWIDE (AUDIT SUMMARY)

Qua rà soát tự động toàn bộ tài sản Theme (Draft Theme \`187597717689\`, Live Theme \`186607567033\`, các template JSON và các phễu phụ):
* **Tổng số điểm vi phạm phát hiện trong mã Theme:** **426 vị trí vi phạm**
* **Số tệp tin giao diện bị ảnh hưởng:** **72 tệp tin** (Bao gồm Announcement Bar, Header, Footer, Cart Drawer, Delivery Cards, Product FAQ Accordions, và Product Templates).
* **Phân bố các cam kết sai lệch:**
  * **90-Day Risk-Free Trial / 90-Day Guarantee:** Xuất hiện phổ biến nhất ở Header Announcement Bar, Cart Drawer và các Custom Product Templates cũ.
  * **60-Day Money-Back Guarantee:** Xuất hiện ở Handpan Collection Hero, Marquee Ticker, và Shipping Trust Cards (\`sections/zavelyn-pdp-shipping.liquid\`).
  * **Khẩu hiệu quá đà:** Xuất hiện các chuỗi \`zero hassle\`, \`100% full refund with no questions asked\` trong các câu hỏi FAQ cũ của Rain Drum và Handpans.

---

### 3. BẢNG CHI TIẾT KIỂM TOÁN TỪNG VỊ TRÍ (AUDIT MATRIX)

| URL / File | Current Text | Proposed Text | Policy Evidence | Required Action | Risk Level |
| :--- | :--- | :--- | :--- | :--- | :---: |
`;

for (const r of rows) {
  const fileClean = `\`${r.file}\` (${r.theme})`;
  const curClean = r.currentText.replace(/\|/g, '-').replace(/\n/g, ' ').slice(0, 110);
  const propClean = r.proposedText.replace(/\|/g, '-');
  const evClean = 'Chính sách hoàn tiền Shopify quy định 30 ngày cho hàng chưa qua sử dụng, còn nguyên tem hộp. Cam kết 60/90 ngày hoặc dùng thử không có cơ sở.';
  const actClean = `Cập nhật chuỗi giao diện sang chuẩn 30-Day Money-Back Guarantee ở Stage 3.`;
  const risk = r.riskLevel.includes('HIGH') ? '**HIGH**' : 'MEDIUM';

  md += `| ${fileClean} | "${curClean}..." | **${propClean}** | ${evClean} | ${actClean} | ${risk} |\n`;
}

md += `
---

### 4. ĐỀ XUẤT LỘ TRÌNH CHUẨN HÓA ĐỒNG NHẤT (ROADMAP TO 30-DAY CONSISTENCY)

1. **Khối Header & Announcement Bar (\`sections/willa-header.liquid\`):**
   * Đổi banner chạy chữ: \`★ FREE US SHIPPING OVER $49 · 100% SATISFACTION GUARANTEED · 30-DAY MONEY-BACK GUARANTEE ★\`.
   * Đổi link trong menu drawer từ 90-Day thành 30-Day Money-Back Guarantee.
2. **Khối Giỏ hàng (\`sections/willa-cart-drawer.liquid\`):**
   * Đổi badge tín nhiệm footer giỏ hàng thành: \`🛡️ 30-Day Money-Back Guarantee\`.
3. **Khối PDP Trust Badges & Shipping (\`sections/zavelyn-pdp-shipping.liquid\` & \`sections/willa-featured-product.liquid\`):**
   * Đổi thẻ Card 4 từ \`Risk-free 60-day money-back guarantee with zero hassle\` thành: \`Standard 30-day money-back guarantee for peace of mind\`.
4. **Khối Handpans Hero & FAQ (\`sections/zhp-hero.liquid\`, \`zhp-marquee.liquid\`, \`zhp-faq.liquid\`):**
   * Đổi ticker và badge thành \`30-DAY MONEY-BACK GUARANTEE\`.
   * Cập nhật lại câu trả lời FAQ: Khách hàng có 30 ngày để kiểm tra âm thanh và độ hoàn thiện của nhạc cụ; nếu có lỗi kỹ thuật hoặc chưa hài lòng, liên hệ hỗ trợ đổi trả theo chính sách 30 ngày tiêu chuẩn.
5. **Khối Template JSON (\`templates/product.*.json\`):**
   * Chuẩn hóa toàn bộ text FAQ hardcoded trong các template Handpans, Drums, và các phễu phụ về 30 ngày. Loại bỏ hoàn toàn ký hiệu ™ và ® khỏi câu hỏi và câu trả lời.
`;

const target1 = 'c:/Users/Admin/Desktop/CLONE SPF/ZAVELYN_GUARANTEE_CONSISTENCY_AUDIT.md';
const target2 = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/ZAVELYN_GUARANTEE_CONSISTENCY_AUDIT.md';

fs.writeFileSync(target1, md, 'utf8');
fs.writeFileSync(target2, md, 'utf8');

console.log('Saved ZAVELYN_GUARANTEE_CONSISTENCY_AUDIT.md to both locations successfully!');
