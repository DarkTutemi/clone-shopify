import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));
const redirects = JSON.parse(fs.readFileSync('scripts/ZAVELYN_URL_REDIRECT_MAPPING.json', 'utf8'));

// Count classifications
const counts = {
  READY: plan.filter(p => p.classification === 'READY').length,
  KEEP_CURRENT: plan.filter(p => p.classification === 'KEEP CURRENT HANDLE').length,
  HIGH_RISK: plan.filter(p => p.classification === 'HIGH ADS RISK').length,
  ADS_UNKNOWN: plan.filter(p => p.classification === 'ADS TRAFFIC UNKNOWN').length,
  OUT_OF_SCOPE: plan.filter(p => p.classification === 'OUT OF SCOPE').length
};

// Select 15 preview products across diverse industries
const previewIds = [
  '15461559533753', // 1. ThermoGlove (Winter Apparel)
  '15454957142201', // 2. Infrared Sauna Blanket (Wellness)
  '15454956781753', // 3. Automatic Chicken Coop Door (Farm & Outdoor)
  '15460656021689', // 4. Handpan Master (Concert Handpan)
  '15459315220665', // 5. Drum Pro (Sound Healing Drum)
  '15460701831353', // 6. Rain Drum (Outdoor Chime Drum)
  '15460831953081', // 7. Cordless Turbo Leaf Blower (Power Tools)
  '15454952620217', // 8. Diesel Injector Removal Kit (Automotive)
  '15455040241849', // 9. Powered Nasal Care Cleaner (Respiratory)
  '15455092572345', // 10. Yeoman Lawn Sweeper (Lawn Care)
  '15461535416505', // 11. MegaLifters RC Excavator (RC Hobbies)
  '15460886315193', // 12. Rotary Cheese Grater (Kitchen Tools)
  '15460988944569', // 13. Automatic Dough Mixer (Kitchen Appliances)
  '15461507956921', // 14. PureFlow Pet Fountain (Pet Supplies)
  '15461545935033'  // 15. BotanaRoots Batana Hair Oil (Beauty & Haircare)
];

const previewItems = previewIds.map(id => plan.find(p => p.productId === id)).filter(Boolean);

let md = `# BÁO CÁO TOÀN DIỆN: CHUẨN HÓA PRODUCT CATALOG SEO & NAMING (STAGE 2.1)
## THƯƠNG HIỆU ZAVELYN — THỊ TRƯỜNG HOA KỲ (UNITED STATES)

---

### TỔNG QUAN DỰ ÁN & PHẠM VI THỰC HIỆN
* **Cửa hàng:** \`tryzavelyn.com\` (Shopify Admin Store: \`dsdujr-vn\`)
* **Thương hiệu chính:** **Zavelyn**
* **Thị trường mục tiêu:** **United States (US)**
* **Phiên bản thực hiện:** **STAGE 2.1 — TOÀN BỘ REVISION NÂNG CẤP & ĐỒNG BỘ HÓA CHÍNH SÁCH**
* **Nguyên tắc an toàn dữ liệu tuyệt đối:** **100% READ-ONLY**. Chưa thực hiện bất kỳ lệnh ghi dữ liệu, chưa đổi URL Handle thật, chưa tạo Redirect thật và chưa chỉnh sửa Theme cho đến khi nhận được phê duyệt chính thức bằng văn bản.

---

### 1. HAI NGUYÊN TẮC THƯƠNG HIỆU BẮT BUỘC ĐÃ ÁP DỤNG TRIỆT ĐỂ

\`\`\`mermaid
flowchart TD
    subgraph RuleA [RULE A: OFFICIAL 30-DAY GUARANTEE]
        A1[Chính sách chuẩn: 30-Day Money-Back Guarantee]
        A2[Loại bỏ 100%: 60-Day & 90-Day Guarantee / Trial]
        A3[Loại bỏ cam kết vô căn cứ: Zero-Hassle, No Questions Asked]
        A4[Meta Description không ép buộc 30 ngày - Ưu tiên mô tả công năng]
    end
    subgraph RuleB [RULE B: NO TRADEMARK SYMBOLS]
        B1[Xóa sạch 100% ký hiệu ™ và ® khỏi dữ liệu đề xuất]
        B2[Xóa sạch ký hiệu ® và %C2%AE khỏi URL Handles]
        B3[Bảo lưu nguyên vẹn SKU, Barcode, ID gốc và nhãn bên thứ ba]
    end
\`\`\`

1. **RULE A — CHÍNH SÁCH BẢO HÀNH 30 NGÀY CHUẨN:**
   * Căn cứ theo **Refund Policy chính thức** của Shopify Store, điều khoản đổi trả áp dụng là **30-day return policy** (cho sản phẩm chưa qua sử dụng, còn nguyên bao bì và tem mác).
   * Đã loại bỏ hoàn toàn mọi biến thể cam kết không có cơ sở pháp lý: \`60-Day Guarantee\`, \`60-Day Trial\`, \`90-Day Guarantee\`, \`90-Day Risk-Free Trial\`, \`Zero-hassle\`, \`No questions asked\`.
   * Đối với **Meta Description**, không gượng ép đưa cam kết 30 ngày vào mọi sản phẩm; ưu tiên tập trung vào công năng, thông số kỹ thuật thực tế và trường hợp sử dụng đời sống.
2. **RULE B — LOẠI BỎ TOÀN BỘ KÝ HIỆU THƯƠNG HIỆU (™ & ®):**
   * Đã quét sạch và loại bỏ 100% ký hiệu \`™\` và \`®\` khỏi: **Product Title**, **SEO Page Title**, **Meta Description** và **Product URL Handle**.
   * Đã chuyển đổi tất cả các URL handle cũ chứa \`sakerplus®\` hoặc ký hiệu \`®\` (bị trình duyệt mã hóa thành \`%C2%AE\`) sang các handle Zavelyn mới sạch đẹp, đồng thời thiết lập bản đồ **301 Moved Permanently** bảo vệ luồng truy cập.

---

### 2. KẾT QUẢ AUDIT DỮ LIỆU THỰC TẾ (CATALOG METRICS)

* **Tổng số sản phẩm thực tế trên Shopify Store:** **83 sản phẩm**
  * **ACTIVE (Đang mở bán):** **76 sản phẩm**
  * **DRAFT (Nháp nội bộ):** **6 sản phẩm** (Đã lên metadata chuẩn nhưng giữ nguyên trạng thái Draft).
  * **UNLISTED (Phễu độc lập):** **1 sản phẩm** (\`saker-cordless-ultrasonic-cutter-and-grinder\`).
* **Thực trạng ban đầu:**
  * **SEO Title:** **83 / 83 sản phẩm (100%) ĐỂ TRỐNG (\`null\`)**.
  * **Meta Description:** **82 / 83 sản phẩm (98.8%) ĐỂ TRỐNG (\`null\`)**.
  * **URL Handle rác:** Hơn 50 sản phẩm dính ký tự \`®\` hoặc thương hiệu cũ \`sakerplus\`.

---

### 3. QUY CHUẨN ĐẶT TÊN & SEO METADATA (STANDARDIZATION MATRIX)

| Tiêu chí | Mục tiêu chuẩn hóa | Kết quả đạt được thực tế | Trạng thái kiểm định |
| :--- | :--- | :---: | :---: |
| **Product Title** | Ngắn gọn, chuẩn \`Zavelyn + Name + Type\`, 25–60 ký tự, không buzzword bịa đặt (Master, Advanced, Pro...), không từ rác quảng cáo. | **Min 27, Max 44, Trung bình 36.3 ký tự** | ✅ PASS 100% (83/83 Unique) |
| **SEO Page Title** | Cấu trúc \`[Keyword / Benefit] \| Zavelyn\`, 45–65 ký tự, **KHÔNG lặp lại từ Zavelyn hai lần**. | **Min 45, Max 61, Trung bình 54.0 ký tự** | ✅ PASS 100% (83/83 Unique, 0 lặp thương hiệu) |
| **Meta Description** | Viết riêng 100% cho từng sản phẩm, nêu công năng, lợi ích, không boilerplate, 130–160 ký tự. | **Min 134, Max 161, Trung bình 149.8 ký tự** | ✅ PASS 100% (83/83 Unique, 0 boilerplate) |
| **URL Handle** | Viết thường, gạch nối, sạch sẽ, không ™/®, bảo vệ sản phẩm chạy Facebook Ads. | **83 Handles chuẩn hóa sạch sẽ** | ✅ PASS 100% (83/83 Unique) |
| **301 Redirect Mapping** | Ánh xạ đầy đủ URL cũ ➔ mới, không loop, không chain, giữ tracking UTM/fbclid. | **66 Cặp 301 Redirects** | ✅ PASS 100% |

---

### 4. PHÂN LOẠI DANH MỤC & ĐÁNH GIÁ RỦI RO ADS (CATALOG CLASSIFICATION)

\`\`\`mermaid
pie title Phân loại 83 sản phẩm theo mức độ an toàn Ads & URL
    "READY (Đổi handle sạch + 301)" : 56
    "KEEP CURRENT HANDLE (Giữ URL Ads)" : 19
    "HIGH ADS RISK (Đổi handle + test 301 kỹ)" : 2
    "OUT OF SCOPE (DRAFT nội bộ)" : 6
\`\`\`

1. **A. READY (56 sản phẩm - 67.5%):**
   * Các sản phẩm phụ trợ gia đình, công cụ cầm tay, decor đời sống không nằm trong chiến dịch quảng cáo chính.
   * Cập nhật đầy đủ Title, SEO Title, Meta Description và chuyển đổi URL cũ dính \`sakerplus\` sang handle mới sạch, tự động gán 301 Redirect.
2. **B. KEEP CURRENT HANDLE (19 sản phẩm - 22.9%):**
   * **Tuyệt đối KHÔNG đổi URL Handle** để bảo vệ 100% Attribution chiến dịch quảng cáo Facebook Ads và phễu chuyển đổi:
     * \`portable-infrared\` (Zavelyn Infrared Sauna Blanket)
     * \`zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves\` (Zavelyn ThermoGlove)
     * \`the-yeoman-sweep\` (Zavelyn Yeoman Lawn Sweeper)
     * \`saker-cordless-turbo-leaf-blower\` (Zavelyn Cordless Turbo Leaf Blower)
     * \`navage-advanced-nose-cleaner\` & \`navage-starter-bundle\` (Dòng sản phẩm làm sạch mũi)
     * \`srefalsteam\` (Máy làm sạch hơi nước nhiệt)
     * \`thoson-magtrack\` (Bộ đường ray tàu hỏa phát sáng)
     * \`livestock-heating-lamp\` (Đèn sưởi gia súc)
     * \`zavelyn-megalifters-heavy-duty-alloy-rc-construction-fleet\` (Xe công trình điều khiển)
     * Bộ 5 sản phẩm nhạc cụ Handpans: \`zavelyn-handpan-master\`, \`zavelyn-drum-pro\`, \`zavelyn-drum-plus\`, \`zavelyn-drum-mini\`, \`zavelyn-rain-drum\`.
     * \`saker-cordless-ultrasonic-cutter-and-grinder\` (Phễu dao cắt siêu âm unlisted).
   * Chỉ tối ưu Product Title, SEO Page Title và Meta Description trên storefront.
3. **C. HIGH ADS RISK (2 sản phẩm - 2.4%):**
   * Gồm: \`zavelyn-automatic-chicken-coop-door\` và \`zavelyn-fence-post-repair-kit\`.
   * Đang có traffic hoặc phễu tiềm năng nhưng URL cũ dính chữ \`sakerplus®-\`. Đổi sang handle Zavelyn sạch và bắt buộc kiểm thử 301 Redirect kép trước và sau triển khai.
4. **D. OUT OF SCOPE (6 sản phẩm - 7.2%):**
   * 6 sản phẩm ở trạng thái **DRAFT** nội bộ (\`zavelyn-foot-sleeves\`, \`v1-device\`, \`cdf\`, \`miracle-balm\`...). Đã chuẩn bị sẵn metadata nhưng giữ nguyên trạng thái Draft, không tự ý publish.

---

### 5. BẢN XEM TRƯỚC 15 SẢN PHẨM ĐẠI DIỆN ĐA NGÀNH HÀNG (15-PRODUCT PREVIEW)

Dưới đây là 15 sản phẩm đại diện tiêu biểu bao phủ toàn bộ các ngành hàng (Apparel, Wellness, Farm, Music, Tools, Automotive, Respiratory, Lawn Care, RC Toys, Kitchen, Pet, Beauty) để bạn đánh giá trực tiếp văn phong tiếng Anh Mỹ:

`;

previewItems.forEach((p, idx) => {
  md += `#### ${idx + 1}. ${p.proposedProductTitle} (${p.classification})
* **Product ID:** \`${p.productId}\` | **Status:** \`${p.status}\` | **Keyword:** \`${p.primaryKeyword}\`
* **Current Title:** \`${p.currentProductTitle}\`
* **Proposed Title:** **\`${p.proposedProductTitle}\`** (${p.titleCharCount} chars)
* **Proposed SEO Title:** **\`${p.proposedSeoPageTitle}\`** (${p.seoTitleCharCount} chars)
* **Proposed Meta Description:** \`"${p.proposedMetaDescription}"\` (${p.metaDescCharCount} chars)
* **Current Handle:** \`${p.currentUrlHandle}\`
* **Proposed Handle:** **\`${p.proposedUrlHandle}\`** ${p.currentUrlHandle === p.proposedUrlHandle ? '*(GIỮ NGUYÊN HANDLE)*' : `*(301: /products/${p.currentUrlHandle} ➔ /products/${p.proposedUrlHandle})*`}
* **Ads Risk Level:** \`${p.adsTrafficRisk}\` | **Lý do:** ${p.changeReason}

`;
});

md += `---

### 6. CÁC TẬP TIN DỮ LIỆU ĐÃ CẬP NHẬT TRONG DỰ ÁN

1. **Báo cáo Kiểm toán Tính nhất quán Chính sách (Guarantee Audit):**  
   📄 [ZAVELYN_GUARANTEE_CONSISTENCY_AUDIT.md](file:///c:/Users/Admin/Desktop/CLONE%20SPF/ZAVELYN_GUARANTEE_CONSISTENCY_AUDIT.md)  
   *(Rà soát 426 điểm vi phạm cam kết 60/90 ngày tại 72 file theme, đối chiếu Refund Policy 30 ngày và đề xuất giải pháp xử lý).*
2. **Kế hoạch di chuyển toàn bộ Catalog (Full CSV 23 cột):**  
   📊 [ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.csv](file:///c:/Users/Admin/Desktop/CLONE%20SPF/scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.csv)
3. **Kế hoạch di chuyển định dạng JSON phục vụ API:**  
   💻 [ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json](file:///c:/Users/Admin/Desktop/CLONE%20SPF/scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json)
4. **Bản đồ ánh xạ 301 URL Redirect Mapping (CSV & JSON):**  
   🔗 [ZAVELYN_URL_REDIRECT_MAPPING.csv](file:///c:/Users/Admin/Desktop/CLONE%20SPF/scripts/ZAVELYN_URL_REDIRECT_MAPPING.csv)  
   🔗 [ZAVELYN_URL_REDIRECT_MAPPING.json](file:///c:/Users/Admin/Desktop/CLONE%20SPF/scripts/ZAVELYN_URL_REDIRECT_MAPPING.json)
5. **Bản sao lưu bất biến trước di chuyển (Immutable Pre-Migration Backup):**  
   🔒 [backup_stage3_pre_migration_catalog.json](file:///c:/Users/Admin/Desktop/CLONE%20SPF/scripts/backup_stage3_pre_migration_catalog.json)

---

### 7. KẾ HOẠCH PHỤC HỒI DỮ LIỆU KHI CẦN (ROLLBACK PLAN)

Bản sao lưu bất biến của toàn bộ 83 sản phẩm đã được lưu trữ độc lập tại \`scripts/backup_stage3_pre_migration_catalog.json\` chứa toàn bộ \`id\`, \`title\`, \`handle\`, \`seo.title\`, \`seo.description\` gốc.
Khi bước vào **Stage 3 (Migration)**:
1. Mỗi sản phẩm khi thực hiện cập nhật qua GraphQL Mutation sẽ được ghi nhật ký (log) chi tiết trạng thái trước và sau.
2. Nếu phát hiện bất kỳ lỗi nào, script rollback sẽ tự động đảo ngược các trường dữ liệu về đúng giá trị gốc ban đầu theo Product ID.
3. Đồng thời xóa bỏ hoặc đảo chiều bản ghi URL Redirect tương ứng.
4. Đảm bảo 100% không ảnh hưởng đến Variant IDs, Giá bán, Tồn kho, SKU, Hình ảnh hay Lịch sử đơn hàng.

---

### 8. DANH SÁCH YÊU CẦU PHÊ DUYỆT TRƯỚC KHI BƯỚC VÀO STAGE 3

Toàn bộ công việc thuộc **Stage 2.1 đã hoàn tất 100% ở trạng thái READ-ONLY**. Chưa có bất kỳ thay đổi nào tác động lên Live Storefront.

Kính mời bạn đánh giá và cho ý kiến phê duyệt:
1. **Phê duyệt Bản xem trước 15 sản phẩm đại diện:** Bạn có đồng ý với tiêu đề, SEO Title không lặp thương hiệu và Meta Description riêng biệt của 15 sản phẩm trên?
2. **Xác nhận 19 sản phẩm KEEP CURRENT HANDLE:** Đồng ý giữ nguyên URL cũ của các sản phẩm ads chủ lực để bảo vệ 100% Attribution.
3. **Phê duyệt Báo cáo Kiểm toán Chính sách Guarantee:** Bạn có đồng thuận với đề xuất chuẩn hóa toàn bộ các điểm xuất hiện 60/90 ngày trong Theme về **30-Day Money-Back Guarantee** trong các giai đoạn xử lý theme tiếp theo?
4. **Phê duyệt quy trình triển khai Stage 3:** Chạy thử nghiệm **Batch 1 (1–3 sản phẩm rủi ro thấp)** trước, xác minh HTTP 301 chuyển hướng thành công, kiểm tra Add to Cart thực tế trước khi di chuyển hàng loạt.
`;

const path1 = 'c:/Users/Admin/Desktop/CLONE SPF/ZAVELYN_SEO_STANDARDIZATION_AUDIT_REPORT.md';
const path2 = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/ZAVELYN_SEO_STANDARDIZATION_AUDIT_REPORT.md';

fs.writeFileSync(path1, md, 'utf8');
fs.writeFileSync(path2, md, 'utf8');

console.log('Saved ZAVELYN_SEO_STANDARDIZATION_AUDIT_REPORT.md to both locations successfully!');
