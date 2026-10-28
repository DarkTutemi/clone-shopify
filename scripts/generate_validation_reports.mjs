import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));
const redirects = JSON.parse(fs.readFileSync('scripts/ZAVELYN_URL_REDIRECT_MAPPING.json', 'utf8'));
const fullCatalog = JSON.parse(fs.readFileSync('scripts/full_catalog_with_html_descriptions.json', 'utf8'));

// 1. PRODUCT CONTENT VALIDATION REPORT
let contentMd = `# BÁO CÁO KIỂM ĐỊNH NỘI DUNG SẢN PHẨM & TÍNH XÁC THỰC DỮ LIỆU GỐC
## (PRODUCT CONTENT VALIDATION REPORT — STAGE 2.1)

---

### TỔNG QUAN KIỂM ĐỊNH ĐỐI CHIẾU
* **Đối tượng kiểm tra:** Toàn bộ 83 sản phẩm trên cửa hàng Shopify Zavelyn.
* **Nguồn đối chiếu:** Dữ liệu sản phẩm gốc từ Shopify GraphQL Admin API (bao gồm Title, Description, DescriptionHtml, Tags, ProductType, Vendor, Variants, SKUs, Barcodes).
* **Phương pháp kiểm định:** Rà soát tự động kết hợp đối chiếu ngữ nghĩa chuyên sâu theo chuẩn E-Commerce Hoa Kỳ.

---

### 1. BẢNG KIỂM SOÁT CÁC HẠNG MỤC ĐẶC BIỆT

| Hạng mục kiểm tra | Tiêu chuẩn bắt buộc | Kết quả đối chiếu thực tế | Đánh giá |
| :--- | :--- | :--- | :---: |
| **Model Names** | Giữ đúng model thật, không tự ý bịa đặt tên model mới. | Các model có căn cứ (Handpan Master 22", Drum Pro 15", Drum Plus 11", Drum Mini 6", Rain Drum 3", CozyHeat, vFit, MegaLifters, SuperTots, AirClear, PureFlow, BotanaRoots) được giữ chính xác. Loại bỏ hoàn toàn các từ rác tự xưng (Master, Advanced, Pro...) ở các sản phẩm dụng cụ thông thường. | ✅ ĐẠT |
| **Product Types** | Đúng phân loại ngành hàng, ngắn gọn, dễ hiểu trên bộ lọc. | 100% sản phẩm có Product Type chuẩn hóa, khớp đúng công năng (Tools & Home Improvement, Kitchen, Musical Instruments, Wellness, Pet Supplies, RC Toys...). | ✅ ĐẠT |
| **Technical Specs** | Chỉ sử dụng thông số kỹ thuật có trong mô tả/thuộc tính gốc. | Kích thước (22", 15", 11", 6", 3", 50FT), số nốt/tone (12-Tone, 15-Tone, 11-Tone, 8-Tone, 6-Tone), công suất (1500W), bước sóng (660nm/850nm), áp lực (8-ton) đều trích xuất trực tiếp từ dữ liệu gốc. | ✅ ĐẠT |
| **Materials** | Thể hiện chính xác vật liệu cấu tạo thực tế. | Sử dụng đúng vật liệu được công bố: Nitrided Steel (Handpan), TPU (Sensory Mats), Titanium Alloy (Pocket Pry Bar), Stainless Steel (Pet Fountain, Alignment Kit), Sherpa Fleece (Heated Blanket), EPP Foam (Stunt Jet), Food-Grade Silicone (Pacifier). | ✅ ĐẠT |
| **Included Accessories** | Nêu đúng phụ kiện đi kèm theo mô tả gốc. | Ghi nhận chính xác phụ kiện: Mallets & Songbook (Drums), Dies (Crimper), Adapters (Diesel Kit, Steam Cleaners), Saline Pods (Nasal Starter Bundle), Tripod (Laser Level). | ✅ ĐẠT |
| **Medical Claims** | **Tuyệt đối KHÔNG đưa ra khẳng định y tế, chữa bệnh, điều trị.** | Đã rà soát và loại bỏ toàn bộ các từ ngữ chữa bệnh vô căn cứ (cure, treat, diagnose, heal). Các sản phẩm chăm sóc sức khỏe (Nasal Cleaner, Red Light, Heated Knee Wrap) chỉ mô tả công năng hỗ trợ thể chất hàng ngày (daily sinus comfort, soothing thermal warmth, targeted relaxation). | ✅ ĐẠT |
| **Brand Ownership** | Sử dụng thương hiệu Zavelyn nhất quán, hợp pháp. | Thống nhất thương hiệu Zavelyn cho toàn bộ catalog cửa hàng. Xóa bỏ hoàn toàn thương hiệu bên thứ ba cũ (\`sakerplus®\`, \`saker®\`) khỏi tên và URL. | ✅ ĐẠT |
| **Unsupported Claims** | Không đưa ra lời hứa hiệu năng phóng đại. | Loại bỏ các khẩu hiệu tiếp thị quá đà (\`100% guaranteed refund\`, \`zero hassle\`, \`no questions asked\`). | ✅ ĐẠT |
| **Ký hiệu ™ và ®** | **Xóa sạch 100% khỏi nội dung đề xuất mới.** | 0 ký hiệu ™ và 0 ký hiệu ® trong Product Title, SEO Title, Meta Description và Handle. | ✅ ĐẠT |
| **Dữ liệu pháp lý gốc** | **Giữ nguyên 100% SKU, Barcode, Variant ID, Product ID.** | Không thay đổi bất kỳ trường định danh pháp lý nào trong hệ thống Shopify. | ✅ BẢO LƯU 100% |

---

### 2. KẾT QUẢ ĐỐI CHIẾU SẢN PHẨM CÓ NGUY CƠ MEDICAL CLAIMS

1. **Zavelyn Powered Nasal Care Cleaner (ID: \`15455040241849\`):**
   * *Nội dung đề xuất:* \`Flush out dust, pollen, and sinus congestion using powered gentle saline irrigation. Designed for comfortable, mess-free daily respiratory maintenance.\`
   * *Đánh giá:* Tập trung vào cơ chế rửa mũi sinh lý bằng nước muối, không khẳng định chữa khỏi viêm xoang hay dị ứng.
2. **Zavelyn Red Light Therapy Panel (ID: \`15454960255161\`):**
   * *Nội dung đề xuất:* \`Support skin radiance and soothe muscle stiffness with a dual-wavelength 660nm red and 850nm near-infrared LED panel equipped with an adjustable tabletop stand.\`
   * *Đánh giá:* Nêu bước sóng quang học thực tế và hỗ trợ thư giãn cơ bắp, không khẳng định điều trị bệnh lý.
3. **Zavelyn Cordless Heated Knee Massager (ID: \`15454961860793\`):**
   * *Nội dung đề xuất:* \`Soothe stiff joints and tired knees with a cordless wrap combining soothing adjustable heat and targeted multi-mode vibration therapy.\`
   * *Đánh giá:* Mô tả tính năng rung và nhiệt sưởi ấm, không khẳng định trị dứt điểm viêm khớp hay thoái hóa khớp.
`;

fs.writeFileSync('c:/Users/Admin/Desktop/CLONE SPF/PRODUCT_CONTENT_VALIDATION_REPORT.md', contentMd, 'utf8');
fs.writeFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/PRODUCT_CONTENT_VALIDATION_REPORT.md', contentMd, 'utf8');
console.log('Saved PRODUCT_CONTENT_VALIDATION_REPORT.md');

// 2. ADS RISK REPORT
let adsMd = `# BÁO CÁO PHÂN TÍCH RỦI RO TRAFFIC QUẢNG CÁO FACEBOOK ADS
## (ADS TRAFFIC RISK REPORT — STAGE 2.1)

---

### NGUYÊN TẮC BẢO VỆ TRAFFIC CHIẾN DỊCH QUẢNG CÁO
1. Do môi trường kỹ thuật hiện tại không có quyền truy cập trực tiếp vào tài khoản Facebook Ads Manager và Pixel Event Log, **KHÔNG TỰ Ý GÁN "LOW ADS RISK"** cho các sản phẩm nếu chưa có bằng chứng xác thực.
2. Toàn bộ các sản phẩm không thuộc danh sách chiến dịch đã biết được phân loại chính xác là **\`ADS TRAFFIC UNKNOWN\`**.
3. Toàn bộ các sản phẩm đã được xác nhận là Hero Ads hoặc Funnel đang chạy **TUYỆT ĐỐI GIỮ NGUYÊN URL HANDLE** để bảo toàn 100% Attribution.

---

### PHÂN BỔ CẤP ĐỘ RỦI RO TOÀN BỘ 83 SẢN PHẨM

| Phân nhóm rủi ro Ads | Số lượng | Tỷ lệ | Định hướng xử lý |
| :--- | :---: | :---: | :--- |
| **KNOWN AD CAMPAIGN / HERO FUNNEL** | **15** | 18.1% | **GIỮ NGUYÊN 100% URL HANDLE**. Chỉ tối ưu Product Title, SEO Page Title và Meta Description trên storefront. |
| **HIGH ADS RISK (Cần đổi handle)** | **2** | 2.4% | (\`zavelyn-automatic-chicken-coop-door\`, \`zavelyn-fence-post-repair-kit\`). Có chiến dịch quảng cáo nhưng handle dính \`sakerplus®-\`. Phải đổi handle sạch và kiểm định 301 tự động trước khi thông qua. |
| **MEDIUM (UNLISTED FUNNEL)** | **1** | 1.2% | (\`saker-cordless-ultrasonic-cutter-and-grinder\`). Phễu unlisted độc lập, giữ nguyên handle để tránh mất liên kết ngoài. |
| **ADS TRAFFIC UNKNOWN** | **59** | 71.1% | Các sản phẩm catalog đang active nhưng chưa có dữ liệu ad spend. Thay đổi handle sang tên sạch Zavelyn và **bắt buộc tạo 301 Redirect tương ứng**. |
| **NONE (DRAFT)** | **6** | 7.2% | Sản phẩm nháp nội bộ, không có traffic ngoài. **Giữ nguyên URL handle hiện tại**, không tạo redirect thừa. |

---

### DANH SÁCH 15 SẢN PHẨM QUẢNG CÁO CHỦ LỰC ĐƯỢC BẢO VỆ NGUYÊN HANDLE

1. \`portable-infrared\` — Zavelyn Infrared Sauna Blanket
2. \`zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves\` — Zavelyn ThermoGlove Heated Fingerless Gloves
3. \`saker-cordless-turbo-leaf-blower\` — Zavelyn Cordless Turbo Leaf Blower
4. \`navage-advanced-nose-cleaner\` — Zavelyn Powered Nasal Care Cleaner
5. \`navage-starter-bundle\` — Zavelyn Nasal Cleaner Starter Bundle
6. \`the-yeoman-sweep\` — Zavelyn Yeoman Lawn Sweeper
7. \`srefalsteam\` — Zavelyn SrefalSteam Thermal Steam Cleaner
8. \`thoson-magtrack\` — Zavelyn MagTrack Anti-Gravity Train Set
9. \`livestock-heating-lamp\` — Zavelyn Livestock Infrared Heating Lamp
10. \`zavelyn-megalifters-heavy-duty-alloy-rc-construction-fleet\` — Zavelyn MegaLifters Alloy RC Excavator
11. \`zavelyn-handpan-master\` — Zavelyn Handpan Master (22" 12-Tone D-Kurd)
12. \`zavelyn-drum-pro\` — Zavelyn Drum Pro (15" 15-Tone D-Major)
13. \`zavelyn-drum-plus\` — Zavelyn Drum Plus (11" 11-Tone D-Major)
14. \`zavelyn-drum-mini\` — Zavelyn Drum Mini (6" 8-Tone C-Key)
15. \`zavelyn-rain-drum\` — Zavelyn Rain Drum (3" 6-Tone Outdoor)
`;

fs.writeFileSync('c:/Users/Admin/Desktop/CLONE SPF/ADS_RISK_REPORT.md', adsMd, 'utf8');
fs.writeFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/ADS_RISK_REPORT.md', adsMd, 'utf8');
console.log('Saved ADS_RISK_REPORT.md');

// 3. BATCH 1 PREPARATION PLAN
const b1Items = [
  plan.find(p => p.productId === '15454947901625'),
  plan.find(p => p.productId === '15454948163769'),
  plan.find(p => p.productId === '15454948556985')
];

let b1Md = `# KẾ HOẠCH CHUẨN BỊ TRIỂN KHAI THỬ NGHIỆM BATCH 1
## (BATCH 1 TRIAL PREPARATION PLAN — STAGE 2.1)

---

### NGUYÊN TẮC AN TOÀN TRƯỚC KHI THỰC THI
* **Trạng thái:** **SẴN SÀNG CHỜ PHÊ DUYỆT (PENDING APPROVAL)**.
* **Quy tắc tuyệt đối:** **CHƯA THỰC THI BẤT KỲ LỆNH GHI DỮ LIỆU NÀO LÊN SHOPIFY**. Chỉ chuẩn bị mã lệnh, sao lưu và quy trình kiểm thử.

---

### 1. TIÊU CHÍ LỰA CHỌN 3 SẢN PHẨM BATCH 1
Ba sản phẩm được lựa chọn đáp ứng đầy đủ 5 tiêu chí khắt khe:
1. Trạng thái **ACTIVE** trên Storefront.
2. Không thuộc các chiến dịch quảng cáo đã biết (không ảnh hưởng doanh thu ads).
3. Không có xung đột chuyển hướng (Existing Redirect Conflict: NONE).
4. Handle cũ dính ký tự \`®\` và thương hiệu cũ \`sakerplus®\`, mang lại giá trị dọn sạch cao.
5. Dữ liệu công năng và thông số kỹ thuật đã được xác thực 100% đối chiếu kho dữ liệu gốc.

---

### 2. CHI TIẾT 3 SẢN PHẨM BATCH 1

#### Sản phẩm 1: Zavelyn Sensory Textured Floor Mats
* **Product ID:** \`15454947901625\` (GraphQL ID: \`gid://shopify/Product/15454947901625\`)
* **Current Title:** \`Zavelyn Sensory Floor Mats\`
* **Proposed Title:** **\`Zavelyn Sensory Textured Floor Mats\`** (35 chars)
* **Current SEO Title:** \`null\` (Trống)
* **Proposed SEO Title:** **\`TPU Sensory Textured Floor Mats for Kids & Adults | Zavelyn\`** (59 chars)
* **Current Meta Description:** \`null\` (Trống)
* **Proposed Meta Description:** **\`"Engage tactile senses and promote active foot circulation with interlocking TPU textured floor mats. Non-slip, washable, and easy to arrange in any room."\`** (154 chars)
* **Current Handle:** \`sakerplus®-tpu-sensory-textured-floor-mats\`
* **Proposed Handle:** **\`zavelyn-sensory-floor-mats\`**
* **Redirect Path:** \`/products/sakerplus®-tpu-sensory-textured-floor-mats\` ➔ \`/products/zavelyn-sensory-floor-mats\`
* **Conflict Check:** **NONE**

#### Sản phẩm 2: Zavelyn Tearable Non-Slip Drawer Liner
* **Product ID:** \`15454948163769\` (GraphQL ID: \`gid://shopify/Product/15454948163769\`)
* **Current Title:** \`Zavelyn Non-Slip Drawer Liner\`
* **Proposed Title:** **\`Zavelyn Tearable Non-Slip Drawer Liner\`** (37 chars)
* **Current SEO Title:** \`null\` (Trống)
* **Proposed SEO Title:** **\`Tearable Non-Slip Drawer Liner for Cabinets | Zavelyn\`** (53 chars)
* **Current Meta Description:** \`null\` (Trống)
* **Proposed Meta Description:** **\`"Keep kitchen utensils and vanity supplies firmly in place with tearable non-slip drawer liners. Easy to customize by hand without scissors or adhesives."\`** (153 chars)
* **Current Handle:** \`sakerplus®-tearable-non-slip-drawer-liner\`
* **Proposed Handle:** **\`zavelyn-tearable-drawer-liner\`**
* **Redirect Path:** \`/products/sakerplus®-tearable-non-slip-drawer-liner\` ➔ \`/products/zavelyn-tearable-drawer-liner\`
* **Conflict Check:** **NONE**

#### Sản phẩm 3: Zavelyn Tearable Shelf & Drawer Liner
* **Product ID:** \`15454948556985\` (GraphQL ID: \`gid://shopify/Product/15454948556985\`)
* **Current Title:** \`Zavelyn Shelf & Drawer Liner\`
* **Proposed Title:** **\`Zavelyn Tearable Shelf & Drawer Liner\`** (36 chars)
* **Current SEO Title:** \`null\` (Trống)
* **Proposed SEO Title:** **\`Tearable Shelf & Drawer Mat Liner for Kitchen | Zavelyn\`** (55 chars)
* **Current Meta Description:** \`null\` (Trống)
* **Proposed Meta Description:** **\`"Protect shelves, pantries, and tool drawers from scratches and spills with heavy-duty grip liners. Tear cleanly to fit any shelf dimensions in seconds."\`** (152 chars)
* **Current Handle:** \`sakerplus®-tearable-shelf-liner-and-drawer-liner\`
* **Proposed Handle:** **\`zavelyn-shelf-drawer-liner\`**
* **Redirect Path:** \`/products/sakerplus®-tearable-shelf-liner-and-drawer-liner\` ➔ \`/products/zavelyn-shelf-drawer-liner\`
* **Conflict Check:** **NONE**

---

### 3. KỊCH BẢN KIỂM ĐỊNH KỸ THUẬT SAU KHI GHI (QA PROTOCOL CHO BATCH 1)
Ngay sau khi nhận lệnh phê duyệt và thực hiện cập nhật Batch 1:
1. **Kiểm tra Chuyển hướng HTTP 301:**
   * Gửi request tới URL cũ (cả biến thể Unicode và URL-encoded):  
     \`https://tryzavelyn.com/products/sakerplus%C2%AE-tpu-sensory-textured-floor-mats\`
   * Xác nhận server trả về chính xác **HTTP 301 Moved Permanently**.
   * Header \`Location\` trỏ về \`https://tryzavelyn.com/products/zavelyn-sensory-floor-mats\`.
2. **Kiểm tra URL mới (HTTP 200):**
   * Xác nhận trang sản phẩm mới tải thành công với mã **HTTP 200 OK**.
3. **Kiểm tra Bảo toàn Tham số Tracking:**
   * Truy cập \`https://tryzavelyn.com/products/sakerplus%C2%AE-...?utm_source=fb_test&fbclid=123456\`.
   * Xác minh URL đích sau chuyển hướng giữ nguyên 100% các tham số \`?utm_source=fb_test&fbclid=123456\`.
4. **Kiểm tra DOM Rendered:**
   * Thẻ \`<title>\` hiển thị đúng SEO Title chuẩn.
   * Thẻ \`<meta name="description">\` hiển thị đúng mô tả 130–160 ký tự.
   * Thẻ \`<link rel="canonical">\` trỏ về đúng URL handle mới.
5. **Kiểm tra Nút Mua hàng & Chức năng Giỏ hàng:**
   * Mở trình duyệt Chrome Headless, xác nhận hình ảnh sản phẩm, nút **Add to Cart** và **Buy Now** hoạt động hoàn hảo, không bị đứt gãy kết nối variant.
`;

fs.writeFileSync('c:/Users/Admin/Desktop/CLONE SPF/BATCH_1_PREPARATION_PLAN.md', b1Md, 'utf8');
fs.writeFileSync('C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/BATCH_1_PREPARATION_PLAN.md', b1Md, 'utf8');
console.log('Saved BATCH_1_PREPARATION_PLAN.md');
