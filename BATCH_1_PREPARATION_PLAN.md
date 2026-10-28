# KẾ HOẠCH CHUẨN BỊ TRIỂN KHAI THỬ NGHIỆM BATCH 1
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
4. Handle cũ dính ký tự `®` và thương hiệu cũ `sakerplus®`, mang lại giá trị dọn sạch cao.
5. Dữ liệu công năng và thông số kỹ thuật đã được xác thực 100% đối chiếu kho dữ liệu gốc.

---

### 2. CHI TIẾT 3 SẢN PHẨM BATCH 1

#### Sản phẩm 1: Zavelyn Sensory Textured Floor Mats
* **Product ID:** `15454947901625` (GraphQL ID: `gid://shopify/Product/15454947901625`)
* **Current Title:** `Zavelyn Sensory Floor Mats`
* **Proposed Title:** **`Zavelyn Sensory Textured Floor Mats`** (35 chars)
* **Current SEO Title:** `null` (Trống)
* **Proposed SEO Title:** **`TPU Sensory Textured Floor Mats for Kids & Adults | Zavelyn`** (59 chars)
* **Current Meta Description:** `null` (Trống)
* **Proposed Meta Description:** **`"Engage tactile senses and promote active foot circulation with interlocking TPU textured floor mats. Non-slip, washable, and easy to arrange in any room."`** (154 chars)
* **Current Handle:** `sakerplus®-tpu-sensory-textured-floor-mats`
* **Proposed Handle:** **`zavelyn-sensory-floor-mats`**
* **Redirect Path:** `/products/sakerplus®-tpu-sensory-textured-floor-mats` ➔ `/products/zavelyn-sensory-floor-mats`
* **Conflict Check:** **NONE**

#### Sản phẩm 2: Zavelyn Tearable Non-Slip Drawer Liner
* **Product ID:** `15454948163769` (GraphQL ID: `gid://shopify/Product/15454948163769`)
* **Current Title:** `Zavelyn Non-Slip Drawer Liner`
* **Proposed Title:** **`Zavelyn Tearable Non-Slip Drawer Liner`** (37 chars)
* **Current SEO Title:** `null` (Trống)
* **Proposed SEO Title:** **`Tearable Non-Slip Drawer Liner for Cabinets | Zavelyn`** (53 chars)
* **Current Meta Description:** `null` (Trống)
* **Proposed Meta Description:** **`"Keep kitchen utensils and vanity supplies firmly in place with tearable non-slip drawer liners. Easy to customize by hand without scissors or adhesives."`** (153 chars)
* **Current Handle:** `sakerplus®-tearable-non-slip-drawer-liner`
* **Proposed Handle:** **`zavelyn-tearable-drawer-liner`**
* **Redirect Path:** `/products/sakerplus®-tearable-non-slip-drawer-liner` ➔ `/products/zavelyn-tearable-drawer-liner`
* **Conflict Check:** **NONE**

#### Sản phẩm 3: Zavelyn Tearable Shelf & Drawer Liner
* **Product ID:** `15454948556985` (GraphQL ID: `gid://shopify/Product/15454948556985`)
* **Current Title:** `Zavelyn Shelf & Drawer Liner`
* **Proposed Title:** **`Zavelyn Tearable Shelf & Drawer Liner`** (36 chars)
* **Current SEO Title:** `null` (Trống)
* **Proposed SEO Title:** **`Tearable Shelf & Drawer Mat Liner for Kitchen | Zavelyn`** (55 chars)
* **Current Meta Description:** `null` (Trống)
* **Proposed Meta Description:** **`"Protect shelves, pantries, and tool drawers from scratches and spills with heavy-duty grip liners. Tear cleanly to fit any shelf dimensions in seconds."`** (152 chars)
* **Current Handle:** `sakerplus®-tearable-shelf-liner-and-drawer-liner`
* **Proposed Handle:** **`zavelyn-shelf-drawer-liner`**
* **Redirect Path:** `/products/sakerplus®-tearable-shelf-liner-and-drawer-liner` ➔ `/products/zavelyn-shelf-drawer-liner`
* **Conflict Check:** **NONE**

---

### 3. KỊCH BẢN KIỂM ĐỊNH KỸ THUẬT SAU KHI GHI (QA PROTOCOL CHO BATCH 1)
Ngay sau khi nhận lệnh phê duyệt và thực hiện cập nhật Batch 1:
1. **Kiểm tra Chuyển hướng HTTP 301:**
   * Gửi request tới URL cũ (cả biến thể Unicode và URL-encoded):  
     `https://tryzavelyn.com/products/sakerplus%C2%AE-tpu-sensory-textured-floor-mats`
   * Xác nhận server trả về chính xác **HTTP 301 Moved Permanently**.
   * Header `Location` trỏ về `https://tryzavelyn.com/products/zavelyn-sensory-floor-mats`.
2. **Kiểm tra URL mới (HTTP 200):**
   * Xác nhận trang sản phẩm mới tải thành công với mã **HTTP 200 OK**.
3. **Kiểm tra Bảo toàn Tham số Tracking:**
   * Truy cập `https://tryzavelyn.com/products/sakerplus%C2%AE-...?utm_source=fb_test&fbclid=123456`.
   * Xác minh URL đích sau chuyển hướng giữ nguyên 100% các tham số `?utm_source=fb_test&fbclid=123456`.
4. **Kiểm tra DOM Rendered:**
   * Thẻ `<title>` hiển thị đúng SEO Title chuẩn.
   * Thẻ `<meta name="description">` hiển thị đúng mô tả 130–160 ký tự.
   * Thẻ `<link rel="canonical">` trỏ về đúng URL handle mới.
5. **Kiểm tra Nút Mua hàng & Chức năng Giỏ hàng:**
   * Mở trình duyệt Chrome Headless, xác nhận hình ảnh sản phẩm, nút **Add to Cart** và **Buy Now** hoạt động hoàn hảo, không bị đứt gãy kết nối variant.
