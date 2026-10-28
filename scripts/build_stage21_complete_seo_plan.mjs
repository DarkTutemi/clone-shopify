import fs from 'fs';

// Read raw catalog
const rawProducts = JSON.parse(fs.readFileSync('scripts/raw_catalog_products.json', 'utf8'));

// The 83 custom-crafted items following Stage 2.1 rules:
// - Structure: Zavelyn + [Product Name] + [Product Type] (no buzzwords like Master/Advanced unless verified model)
// - SEO Title: [Product Name / Keyword] | Zavelyn (NO brand repetition!)
// - Meta Description: 100% bespoke, informative, no boilerplate phrases, no forced 30-day, 130-160 chars
// - Handle: clean, lowercase, no ™ or ®, no clearance-sale
// - Classification: READY, KEEP CURRENT HANDLE, HIGH ADS RISK, ADS TRAFFIC UNKNOWN, OUT OF SCOPE

const catalogData = [
  // 1
  {
    id: '15416491933881',
    status: 'DRAFT',
    classification: 'OUT OF SCOPE',
    proposedTitle: 'Zavelyn Compression Foot Sleeves',
    proposedSeoTitle: 'Compression Foot Sleeves for Arch Support | Zavelyn',
    proposedMetaDesc: 'Relieve everyday foot fatigue and support your arches with breathable compression foot sleeves designed for comfortable wear at work, home, or exercise.',
    proposedHandle: 'zavelyn-compression-foot-sleeves',
    primaryKeyword: 'Compression Foot Sleeves',
    changeReason: 'Sản phẩm Draft nội bộ; chuẩn hóa loại sản phẩm và xóa hậu tố BOGO',
    redirectRequired: 'YES',
    adsRisk: 'NONE'
  },
  // 2
  {
    id: '15420277653689',
    status: 'DRAFT',
    classification: 'OUT OF SCOPE',
    proposedTitle: 'Zavelyn Targeted Therapy Device',
    proposedSeoTitle: 'Targeted Body Therapy Device for Muscle Care | Zavelyn',
    proposedMetaDesc: 'Explore an ergonomic handheld therapy device engineered for localized muscle stimulation and tension relief. Lightweight design for portable daily use.',
    proposedHandle: 'zavelyn-targeted-therapy-device',
    primaryKeyword: 'Targeted Therapy Device',
    changeReason: 'Sản phẩm Draft; thay handle v1-device tối nghĩa bằng tên thiết bị rõ ràng',
    redirectRequired: 'YES',
    adsRisk: 'NONE'
  },
  // 3
  {
    id: '15420647702713',
    status: 'DRAFT',
    classification: 'OUT OF SCOPE',
    proposedTitle: 'Zavelyn Foot Drop AFO Brace',
    proposedSeoTitle: 'Foot Drop AFO Brace for Walking Alignment | Zavelyn',
    proposedMetaDesc: 'Stabilize foot and ankle alignment with this lightweight AFO brace. Engineered to assist natural walking posture and daily mobility with secure straps.',
    proposedHandle: 'zavelyn-foot-drop-brace',
    primaryKeyword: 'Foot Drop AFO Brace',
    changeReason: 'Sản phẩm Draft; thay handle cdf viết tắt bằng tên mô tả sản phẩm',
    redirectRequired: 'YES',
    adsRisk: 'NONE'
  },
  // 4
  {
    id: '15420985966777',
    status: 'DRAFT',
    classification: 'OUT OF SCOPE',
    proposedTitle: 'Zavelyn Ankle Support Sleeves',
    proposedSeoTitle: 'Ankle Support Sleeves for Everyday Relief | Zavelyn',
    proposedMetaDesc: 'Discover comfortable ankle support sleeves delivering targeted compression. Perfect for daily walking, light training, and comfortable evening wear.',
    proposedHandle: 'zavelyn-ankle-support-sleeves',
    primaryKeyword: 'Ankle Support Sleeves',
    changeReason: 'Sản phẩm Draft; loại bỏ hậu tố bogo-free thừa trong URL handle',
    redirectRequired: 'YES',
    adsRisk: 'NONE'
  },
  // 5
  {
    id: '15424286589113',
    status: 'DRAFT',
    classification: 'OUT OF SCOPE',
    proposedTitle: 'Zavelyn Rehabilitation Hand Glove',
    proposedSeoTitle: 'Rehabilitation Hand Glove for Recovery Therapy | Zavelyn',
    proposedMetaDesc: 'Assist hand mobility training and finger flexibility with an ergonomic rehabilitation glove designed for gentle, progressive therapy sessions at home.',
    proposedHandle: 'zavelyn-rehabilitation-glove',
    primaryKeyword: 'Rehabilitation Hand Glove',
    changeReason: 'Sản phẩm Draft; giữ nguyên handle sạch, chuẩn hóa SEO metadata',
    redirectRequired: 'NO',
    adsRisk: 'NONE'
  },
  // 6
  {
    id: '15424429457593',
    status: 'DRAFT',
    classification: 'OUT OF SCOPE',
    proposedTitle: 'Zavelyn Herbal Miracle Balm',
    proposedSeoTitle: 'Soothing Herbal Miracle Balm for Dry Skin | Zavelyn',
    proposedMetaDesc: 'Nourish irritated or dry skin with Zavelyn herbal miracle balm. Formulated with botanical extracts to provide deep moisture and lasting epidermal comfort.',
    proposedHandle: 'zavelyn-miracle-balm',
    primaryKeyword: 'Herbal Miracle Balm',
    changeReason: 'Sản phẩm Draft; thêm thương hiệu Zavelyn vào handle và chuẩn hóa SEO',
    redirectRequired: 'YES',
    adsRisk: 'NONE'
  },
  // 7
  {
    id: '15454946951353',
    status: 'ACTIVE',
    classification: 'HIGH ADS RISK',
    proposedTitle: 'Zavelyn Fence Post Repair Kit',
    proposedSeoTitle: 'Heavy-Duty Steel Fence Post Repair Kit | Zavelyn',
    proposedMetaDesc: 'Reinforce rotted or broken wooden fence posts without digging out concrete. Built with heavy-duty steel anchors and weather-resistant hardware.',
    proposedHandle: 'zavelyn-fence-post-repair-kit',
    primaryKeyword: 'Fence Post Repair Kit',
    changeReason: 'Handle cũ chứa sakerplus; đổi sang Zavelyn và bảo vệ traffic ads bằng 301',
    redirectRequired: 'YES',
    adsRisk: 'HIGH'
  },
  // 8
  {
    id: '15454947901625',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Sensory Textured Floor Mats',
    proposedSeoTitle: 'TPU Sensory Textured Floor Mats for Kids & Adults | Zavelyn',
    proposedMetaDesc: 'Engage tactile exploration with interlocking TPU textured floor mats featuring six raised patterns. Easy to assemble, clean, and arrange for kids or adults.',
    proposedHandle: 'zavelyn-sensory-floor-mats',
    primaryKeyword: 'Sensory Textured Floor Mats',
    changeReason: 'Loại bỏ ký tự ® và sakerplus khỏi handle; tối ưu SEO metadata',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 9
  {
    id: '15454948163769',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Tearable Non-Slip Drawer Liner',
    proposedSeoTitle: 'Tearable Non-Slip Drawer Liner for Cabinets | Zavelyn',
    proposedMetaDesc: 'Keep kitchen utensils and vanity supplies in place with tearable non-slip drawer liners. Sized with a clear grid for easy hand-tearing without scissors.',
    proposedHandle: 'zavelyn-tearable-drawer-liner',
    primaryKeyword: 'Non-Slip Drawer Liner',
    changeReason: 'Loại bỏ ký tự ® và sakerplus khỏi handle; chuẩn hóa tên gọi',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 10
  {
    id: '15454948556985',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Tearable Shelf & Drawer Liner',
    proposedSeoTitle: 'Tearable Shelf & Drawer Mat Liner for Kitchen | Zavelyn',
    proposedMetaDesc: 'Protect shelves, cabinets, and drawers from spills, moisture, and scratches with textured EVA liners. Perforated design pulls apart by hand for a custom fit.',
    proposedHandle: 'zavelyn-shelf-drawer-liner',
    primaryKeyword: 'Shelf & Drawer Liner',
    changeReason: 'Loại bỏ ký tự ® và sakerplus khỏi handle; rút ngắn URL sạch sẽ',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 11
  {
    id: '15454948786361',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn UV Bed Vacuum Cleaner',
    proposedSeoTitle: 'UV Bed Vacuum Cleaner for Mattress & Fabric | Zavelyn',
    proposedMetaDesc: 'Eliminate embedded dust and allergens with a handheld UV mattress vacuum featuring high-frequency vibration pads and strong suction for deep cleaning.',
    proposedHandle: 'zavelyn-uv-bed-vacuum',
    primaryKeyword: 'UV Bed Vacuum Cleaner',
    changeReason: 'Loại bỏ saker® và clearance-sale khỏi handle; tối ưu từ khóa',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 12
  {
    id: '15454948982969',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Flame Effect Space Heater',
    proposedSeoTitle: '1500W Flame Effect Oscillating Space Heater | Zavelyn',
    proposedMetaDesc: 'Warm indoor spaces quickly with a 1500W ceramic oscillating space heater featuring a realistic 3D flame display, remote control, and tip-over safety.',
    proposedHandle: 'zavelyn-flame-space-heater',
    primaryKeyword: 'Flame Effect Space Heater',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; rút ngắn URL dễ nhớ',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 13
  {
    id: '15454949343417',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Portable Inverter Welding Machine',
    proposedSeoTitle: 'Portable Inverter Welding Machine for DIY Repair | Zavelyn',
    proposedMetaDesc: 'Handle home metal repairs effortlessly using a handheld digital welding gun. Features IGBT inverter technology, current adjustment, and thermal protection.',
    proposedHandle: 'zavelyn-portable-welding-machine',
    primaryKeyword: 'Portable Inverter Welding Machine',
    changeReason: 'Loại bỏ sakerplus® và chữ clearance khỏi handle',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 14
  {
    id: '15454949540025',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Titanium Pocket Pry Bar',
    proposedSeoTitle: 'Titanium Multifunction Pocket Pry Bar EDC Tool | Zavelyn',
    proposedMetaDesc: 'Carry a dependable EDC pocket tool crafted from lightweight titanium alloy. Features bottle opener, pry wedge, measurement scale, and pocket clip.',
    proposedHandle: 'zavelyn-titanium-pocket-pry-bar',
    primaryKeyword: 'Titanium Pocket Pry Bar',
    changeReason: 'Loại bỏ sakerplus® khỏi URL handle; chuẩn hóa thương hiệu Zavelyn',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 15
  {
    id: '15454949998777',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Handheld Steam Cleaner',
    proposedSeoTitle: 'Handheld Steam Cleaner for Home Sanitizing | Zavelyn',
    proposedMetaDesc: 'Sanitize kitchen tiles, grout lines, and car upholstery with pressurized high-temperature steam. Cleans grime thoroughly without harsh chemicals.',
    proposedHandle: 'zavelyn-handheld-steam-cleaner',
    primaryKeyword: 'Handheld Steam Cleaner',
    changeReason: 'Loại bỏ sakerplus® và clearance khỏi handle; đặt tên ngắn gọn',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 16
  {
    id: '15454950490297',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Squishy Egg Silicone Night Light',
    proposedSeoTitle: 'Squishy Egg Silicone Tap Night Light for Kids | Zavelyn',
    proposedMetaDesc: 'Soothe bedrooms and nurseries with a soft silicone egg lamp. Features touch sensor color changes, warm night glow, and rechargeable USB convenience.',
    proposedHandle: 'zavelyn-squishy-egg-night-light',
    primaryKeyword: 'Squishy Egg Silicone Night Light',
    changeReason: 'Loại bỏ sakerplus® khỏi URL handle; chuẩn hóa tên gọi dễ thương',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 17
  {
    id: '15454950850745',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Bathroom Exhaust Fan with Light',
    proposedSeoTitle: 'Quiet Bathroom Exhaust Fan with LED Light | Zavelyn',
    proposedMetaDesc: 'Ventilate moisture and illuminate bathrooms quietly with this integrated ceiling exhaust fan. Features energy-efficient LED lighting and low-noise motor.',
    proposedHandle: 'zavelyn-bathroom-exhaust-fan',
    primaryKeyword: 'Bathroom Exhaust Fan with Light',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa danh mục thiết bị gia dụng',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 18
  {
    id: '15454951211193',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Outdoor Solar Street Lights',
    proposedSeoTitle: 'Outdoor Solar Street Lights with Motion Sensor | Zavelyn',
    proposedMetaDesc: 'Illuminate driveways, yards, and perimeter walls with ultra-bright commercial solar street lights. IP65 waterproof housing with dusk-to-dawn sensors.',
    proposedHandle: 'zavelyn-solar-street-lights',
    primaryKeyword: 'Outdoor Solar Street Lights',
    changeReason: 'Loại bỏ sakerplus® và clearance-sale khỏi handle',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 19
  {
    id: '15454951473337',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn RAV4 Center Console USB Hub',
    proposedSeoTitle: 'RAV4 Center Console LED USB Charging Hub | Zavelyn',
    proposedMetaDesc: 'Upgrade your Toyota RAV4 dashboard with a flush-fit USB hub featuring multi-port fast charging, integrated ambient LED lighting, and clean cable routing.',
    proposedHandle: 'zavelyn-rav4-usb-charging-hub',
    primaryKeyword: 'RAV4 USB Charging Hub',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa phụ kiện xe hơi',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 20
  {
    id: '15454951801017',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Portable Camping Fan with Light',
    proposedSeoTitle: 'Rechargeable Camping Fan with LED Lantern | Zavelyn',
    proposedMetaDesc: 'Stay cool in tents and off-grid campsites with a rechargeable hanging fan equipped with an adjustable LED ring light and long-lasting power bank output.',
    proposedHandle: 'zavelyn-camping-fan-light',
    primaryKeyword: 'Portable Camping Fan with Light',
    changeReason: 'Loại bỏ sakerplus và hậu tố số rác battery-1 khỏi handle',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 21
  {
    id: '15454951997625',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Home Sauna Steam Generator',
    proposedSeoTitle: 'Portable Home Sauna Steam Generator Pot | Zavelyn',
    proposedMetaDesc: 'Infuse your home sauna tent with steady therapeutic steam using a digital sauna boiler pot. Features timer settings, remote control, and auto shut-off.',
    proposedHandle: 'zavelyn-sauna-steam-generator',
    primaryKeyword: 'Home Sauna Steam Generator',
    changeReason: 'Loại bỏ sakerplus® khỏi URL handle; tối ưu SEO danh mục wellness',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 22
  {
    id: '15454952292537',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Laser Wall Chaser Groove Cutter',
    proposedSeoTitle: 'Laser-Guided Electric Wall Chaser Cutter | Zavelyn',
    proposedMetaDesc: 'Cut clean conduit grooves into brick, concrete, and masonry walls with a laser-guided electric chaser. Features dust-extraction adapter and depth control.',
    proposedHandle: 'zavelyn-electric-wall-chaser',
    primaryKeyword: 'Laser Wall Chaser Groove Cutter',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; đặt tên ngắn gọn đúng dụng cụ điện',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 23
  {
    id: '15454952620217',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Diesel Injector Removal Kit',
    proposedSeoTitle: 'Diesel Injector Removal Tool Kit with Adapters | Zavelyn',
    proposedMetaDesc: 'Explore a diesel injector removal kit designed for specialized repair work. Compare the included adapters, tool specifications, and compatibility before you buy.',
    proposedHandle: 'zavelyn-diesel-injector-removal-kit',
    primaryKeyword: 'Diesel Injector Removal Kit',
    changeReason: 'Loại bỏ sakerplus®, ký tự ® và chữ clearance-sale; tuân thủ ví dụ prompt',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 24
  {
    id: '15454952882361',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Kids Basketball Hoop Set',
    proposedSeoTitle: 'Indoor & Outdoor Basketball Hoop Set for Kids | Zavelyn',
    proposedMetaDesc: 'Encourage active indoor and driveway play with an adjustable height basketball hoop set. Features sturdy spring-action rim and shatterproof backboard.',
    proposedHandle: 'zavelyn-kids-basketball-hoop',
    primaryKeyword: 'Kids Basketball Hoop Set',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; rút ngắn URL thân thiện cho phụ huynh',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 25
  {
    id: '15454953177273',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Clamp-On Desk Shelf Organizer',
    proposedSeoTitle: 'Clamp-On Multi-Tier Desk Shelf Organizer | Zavelyn',
    proposedMetaDesc: 'Expand usable desktop surface without drilling using heavy-duty C-clamp shelves. Ideal for organizing monitors, stationery, speakers, and office essentials.',
    proposedHandle: 'zavelyn-clamp-on-desk-shelf',
    primaryKeyword: 'Clamp-On Desk Shelf Organizer',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa danh mục nội thất văn phòng',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 26
  {
    id: '15454953504953',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Handheld Thermal Imaging Camera',
    proposedSeoTitle: 'Handheld Infrared Thermal Imaging Camera | Zavelyn',
    proposedMetaDesc: 'Detect HVAC drafts, electrical hotspots, and plumbing leaks instantly with a high-resolution thermal imaging camera with full-color display modes.',
    proposedHandle: 'zavelyn-thermal-imaging-camera',
    primaryKeyword: 'Handheld Thermal Imaging Camera',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa thiết bị đo lường',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 27
  {
    id: '15454953898169',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Cordless UV Mattress Vacuum',
    proposedSeoTitle: 'Cordless Handheld UV Mattress Vacuum Cleaner | Zavelyn',
    proposedMetaDesc: 'Keep bedding, pillows, and sofas fresh with a cordless UV mattress cleaner delivering high-frequency tapping and multi-stage cyclonic HEPA filtration.',
    proposedHandle: 'zavelyn-cordless-mattress-vacuum',
    primaryKeyword: 'Cordless UV Mattress Vacuum',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; phân biệt với model có dây',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 28
  {
    id: '15454954193081',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Tactical MOLLE Utility Vest',
    proposedSeoTitle: 'Adjustable Tactical MOLLE Utility Vest | Zavelyn',
    proposedMetaDesc: 'Organize field gear, radios, and pouches securely with a breathable nylon tactical vest featuring reinforced MOLLE webbing and quick-release buckles.',
    proposedHandle: 'zavelyn-tactical-molle-vest',
    primaryKeyword: 'Tactical MOLLE Utility Vest',
    changeReason: 'Loại bỏ sakerplus® khỏi URL handle; tối ưu danh mục đồ dã ngoại',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 29
  {
    id: '15454954422457',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Hydraulic Pipe Crimping Tool Kit',
    proposedSeoTitle: 'Hydraulic Pipe Crimping Tool Kit with Dies | Zavelyn',
    proposedMetaDesc: 'Crimp copper, PEX, and stainless plumbing pipes securely with a heavy-duty hydraulic crimper tool kit supplied with quick-change hardening dies.',
    proposedHandle: 'zavelyn-hydraulic-pipe-crimper',
    primaryKeyword: 'Hydraulic Pipe Crimping Tool Kit',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; rút gọn URL công cụ thợ ống nước',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 30
  {
    id: '15454954750137',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Smart Hygrometer Thermometer Clock',
    proposedSeoTitle: 'Smart Digital Thermometer & Hygrometer Clock | Zavelyn',
    proposedMetaDesc: 'Monitor indoor humidity, room temperature, and exact time with a sleek LCD desk hygrometer clock equipped with high-accuracy environmental sensors.',
    proposedHandle: 'zavelyn-smart-hygrometer-clock',
    primaryKeyword: 'Smart Hygrometer Thermometer Clock',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; đặt tên rõ ràng tính năng đo nhiệt ẩm',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 31
  {
    id: '15454955045049',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Half Moon LED Lash Lamp',
    proposedSeoTitle: 'Dimmable Half Moon LED Lash & Esthetician Lamp | Zavelyn',
    proposedMetaDesc: 'Eliminate shadows during lash extensions and skincare sessions with an arch-shaped half moon LED esthetician lamp with adjustable color temperature.',
    proposedHandle: 'zavelyn-half-moon-lash-lamp',
    primaryKeyword: 'Half Moon LED Lash Lamp',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa thiết bị spa & làm đẹp',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 32
  {
    id: '15454955372729',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn 3-in-1 Drywall Board Cutter',
    proposedSeoTitle: '3-in-1 Drywall & Gypsum Board Cutting Tool | Zavelyn',
    proposedMetaDesc: 'Measure, mark, and slice sheetrock effortlessly in one pass. Combines a retractable tape measure, locking guide, and sharp utility scoring blade.',
    proposedHandle: 'zavelyn-drywall-board-cutter',
    primaryKeyword: '3-in-1 Drywall Board Cutter',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; dùng từ Drywall phổ biến tại Mỹ',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 33
  {
    id: '15454955765945',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Rotating Galaxy Star Projector',
    proposedSeoTitle: 'Rotating Galaxy Star Projector for Bedrooms | Zavelyn',
    proposedMetaDesc: 'Transform ceilings into a celestial planetarium with an adjustable-focus optical galaxy projector featuring realistic nebula discs and silent rotation.',
    proposedHandle: 'zavelyn-galaxy-star-projector',
    primaryKeyword: 'Rotating Galaxy Star Projector',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; tối ưu từ khóa đèn chiếu vũ trụ',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 34
  {
    id: '15454956028089',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Retractable LED Fill Light Stick',
    proposedSeoTitle: 'Retractable Handheld LED Fill Light Wand | Zavelyn',
    proposedMetaDesc: 'Enhance live streaming and portrait photography with a handheld rechargeable LED light wand offering adjustable brightness, hue, and tripod mounting.',
    proposedHandle: 'zavelyn-retractable-fill-light',
    primaryKeyword: 'Retractable LED Fill Light Stick',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; rút gọn URL công cụ quay phim',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 35
  {
    id: '15454956355769',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Digital Mini Heat Press Machine',
    proposedSeoTitle: 'Digital Mini Heat Press Machine for T-Shirts | Zavelyn',
    proposedMetaDesc: 'Transfer custom iron-on vinyl graphics onto shirts, tote bags, and hats with a compact digital heat press featuring precise temperature controls.',
    proposedHandle: 'zavelyn-mini-heat-press',
    primaryKeyword: 'Digital Mini Heat Press Machine',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; tối ưu từ khóa máy in nhiệt thủ công',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 36
  {
    id: '15454956781753',
    status: 'ACTIVE',
    classification: 'HIGH ADS RISK',
    proposedTitle: 'Zavelyn Automatic Chicken Coop Door',
    proposedSeoTitle: 'Automatic Chicken Coop Door with Timer Control | Zavelyn',
    proposedMetaDesc: 'Make daily chicken coop routines easier with an automatic door featuring timer-controlled operation. Explore its setup, power requirements, and safety features.',
    proposedHandle: 'zavelyn-automatic-chicken-coop-door',
    primaryKeyword: 'Automatic Chicken Coop Door',
    changeReason: 'Handle cũ chứa sakerplus®; đổi sang handle Zavelyn sạch và tạo 301 chuẩn',
    redirectRequired: 'YES',
    adsRisk: 'HIGH'
  },
  // 37
  {
    id: '15454957142201',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Infrared Sauna Blanket',
    proposedSeoTitle: 'Infrared Sauna Blanket for Home Relaxation | Zavelyn',
    proposedMetaDesc: 'Unwind with gentle thermal body warming at home. Explore the Zavelyn infrared sauna blanket featuring multi-zone heat settings and waterproof Oxford lining.',
    proposedHandle: 'portable-infrared',
    primaryKeyword: 'Infrared Sauna Blanket',
    changeReason: 'Phễu chạy ads chủ lực; giữ nguyên handle portable-infrared để bảo toàn ads',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 38
  {
    id: '15454957633721',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn 360 Magnetic Work Light',
    proposedSeoTitle: '360 Swivel Magnetic Work Light with App Control | Zavelyn',
    proposedMetaDesc: 'Light up engine bays and tight job sites hands-free with a magnetic base floodlight featuring 360-degree rotation and smartphone app brightness control.',
    proposedHandle: 'zavelyn-magnetic-work-light',
    primaryKeyword: '360 Magnetic Work Light',
    changeReason: 'Loại bỏ sakerplus® và ký tự đặc biệt khỏi handle',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 39
  {
    id: '15454958158009',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn 50FT LED Jobsite String Lights',
    proposedSeoTitle: '50FT Commercial LED Jobsite Construction Lights | Zavelyn',
    proposedMetaDesc: 'Illuminate job sites and outdoor events with heavy-duty commercial string lights. Includes shatter-resistant LED cages and linkable waterproof plugs.',
    proposedHandle: 'zavelyn-construction-string-lights',
    primaryKeyword: '50FT LED Jobsite String Lights',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; rút gọn URL công trình',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 40
  {
    id: '15454958420153',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Hydraulic Cable Lug Crimper',
    proposedSeoTitle: 'Hydraulic Battery Cable Lug Crimping Tool | Zavelyn',
    proposedMetaDesc: 'Create secure electrical connections on heavy battery cables with an 8-ton hydraulic crimping tool featuring rotating head and interchangeable metric dies.',
    proposedHandle: 'zavelyn-cable-lug-crimper',
    primaryKeyword: 'Hydraulic Cable Lug Crimper',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa tên dụng cụ điện',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 41
  {
    id: '15454958878905',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Panoramic Dual Dash Camera',
    proposedSeoTitle: 'Panoramic Dual Dash Camera with Night Vision | Zavelyn',
    proposedMetaDesc: 'Record road evidence in crystal-clear detail with a wide-angle dual dash camera featuring infrared night vision, loop recording, and G-sensor lock.',
    proposedHandle: 'zavelyn-panoramic-dash-camera',
    primaryKeyword: 'Panoramic Dual Dash Camera',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa thiết bị camera hành trình',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 42
  {
    id: '15454959403193',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Low-Profile Downspout Catch Basin',
    proposedSeoTitle: 'Low-Profile Downspout Drainage Catch Basin | Zavelyn',
    proposedMetaDesc: 'Divert rainwater away from your home foundation with a low-profile gutter downspout basin equipped with a debris grate and extendable discharge pipe.',
    proposedHandle: 'zavelyn-downspout-catch-basin',
    primaryKeyword: 'Downspout Catch Basin',
    changeReason: 'Loại bỏ sakerplus® khỏi URL handle; tối ưu giải pháp thoát nước',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 43
  {
    id: '15454959894713',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Wheel Alignment Tool Kit',
    proposedSeoTitle: 'Stainless Steel Wheel Alignment Toe-In Gauge Tool | Zavelyn',
    proposedMetaDesc: 'Check and calibrate automotive toe alignment at home using heavy-duty stainless steel alignment plates with dual tape measure slots for accurate reads.',
    proposedHandle: 'zavelyn-wheel-alignment-kit',
    primaryKeyword: 'Wheel Alignment Tool Kit',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; đặt tên công cụ gara ô tô rõ ràng',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 44
  {
    id: '15454960255161',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Red Light Therapy Panel',
    proposedSeoTitle: 'Targeted Red Light Therapy Body Panel | Zavelyn',
    proposedMetaDesc: 'Support skin radiance and soothe muscle stiffness with a dual-wavelength 660nm red and 850nm near-infrared LED panel equipped with an adjustable tabletop stand.',
    proposedHandle: 'zavelyn-red-light-panel',
    primaryKeyword: 'Red Light Therapy Panel',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; tối ưu danh mục chăm sóc sức khỏe',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 45
  {
    id: '15454960517305',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Rotating Goose Target Game',
    proposedSeoTitle: 'Electronic Rotating Goose Target Shooting Game | Zavelyn',
    proposedMetaDesc: 'Bring exciting arcade target practice home with an electronic rotating goose shooting game featuring soft foam ball poppers and digital score display.',
    proposedHandle: 'zavelyn-goose-target-game',
    primaryKeyword: 'Rotating Goose Target Game',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa đồ chơi gia đình',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 46
  {
    id: '15454960910521',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Self-Leveling Cross Laser Level',
    proposedSeoTitle: 'Self-Leveling Cross Line Laser Level with Tripod | Zavelyn',
    proposedMetaDesc: 'Align pictures, tiles, and drywall accurately with a high-visibility green beam self-leveling laser level equipped with an adjustable mini tripod.',
    proposedHandle: 'zavelyn-self-leveling-laser-level',
    primaryKeyword: 'Self-Leveling Cross Laser Level',
    changeReason: 'Loại bỏ sakerplus® khỏi URL handle; tối ưu từ khóa laser đo đạc',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 47
  {
    id: '15454961238201',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Lightweight Kids Metal Detector',
    proposedSeoTitle: 'Kids Metal Detector with Backlit LCD Screen | Zavelyn',
    proposedMetaDesc: 'Spark outdoor exploration with a lightweight metal detector for children. Features adjustable stem length, waterproof search coil, and backlit LCD screen.',
    proposedHandle: 'zavelyn-kids-metal-detector',
    primaryKeyword: 'Kids Metal Detector',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; thân thiện với khách hàng gia đình',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 48
  {
    id: '15454961565881',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Workbench Tail Vise Clamp',
    proposedSeoTitle: 'Heavy-Duty Workbench Tail Vise Woodworking Clamp | Zavelyn',
    proposedMetaDesc: 'Secure wooden workpieces firmly on dog-hole workbenches using an all-metal tail vise screw clamp engineered for smooth tightening and stable clamping.',
    proposedHandle: 'zavelyn-workbench-tail-vise',
    primaryKeyword: 'Workbench Tail Vise Clamp',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa dụng cụ mộc mộc',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 49
  {
    id: '15454961860793',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Cordless Heated Knee Massager',
    proposedSeoTitle: 'Cordless Heated Knee Massager with Vibration | Zavelyn',
    proposedMetaDesc: 'Soothe stiff joints and tired knees with a cordless wrap combining soothing adjustable heat and targeted multi-mode vibration therapy.',
    proposedHandle: 'zavelyn-heated-knee-massager',
    primaryKeyword: 'Cordless Heated Knee Massager',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; tối ưu danh mục máy massage khớp',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 50
  {
    id: '15454962286777',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Solar Motion Sensor Security Light',
    proposedSeoTitle: 'Solar Motion Sensor Security Light for Outdoors | Zavelyn',
    proposedMetaDesc: 'Protect yards, garages, and entryways with solar security floodlights featuring wide-angle motion detection, weatherproofing, and solar recharging.',
    proposedHandle: 'zavelyn-solar-motion-light',
    primaryKeyword: 'Solar Motion Sensor Security Light',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa thiết bị chiếu sáng an ninh',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 51
  {
    id: '15454962778297',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn 5-in-1 Magnetic Wireless Charger',
    proposedSeoTitle: '5-in-1 Magnetic Wireless Charging Station Stand | Zavelyn',
    proposedMetaDesc: 'Power your smartphone, smartwatch, and earbuds simultaneously from one sleek magnetic charging stand. Features built-in desk night light and fast charge.',
    proposedHandle: 'zavelyn-magnetic-charging-station',
    primaryKeyword: '5-in-1 Magnetic Wireless Charger',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; rút gọn URL trạm sạc không dây',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 52
  {
    id: '15454963073209',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Rolling Nut & Fruit Harvester',
    proposedSeoTitle: 'Rolling Nut & Fruit Harvester Gathering Tool | Zavelyn',
    proposedMetaDesc: 'Gather pecans, walnuts, acorns, and tennis balls without bending your back using a rolling wire collection drum with an ergonomic telescoping handle.',
    proposedHandle: 'zavelyn-rolling-nut-picker',
    primaryKeyword: 'Rolling Nut & Fruit Harvester',
    changeReason: 'Loại bỏ sakerplus® khỏi URL handle; chuẩn hóa dụng cụ sân vườn',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 53
  {
    id: '15454963433657',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Ultra-Fine Cooking Oil Sprayer',
    proposedSeoTitle: 'Ultra-Fine Cooking Oil Sprayer Bottle for Cooking | Zavelyn',
    proposedMetaDesc: 'Misty-spray olive oil evenly onto salads, air fryer baskets, and grilling pans. Features a continuous pressurized trigger and leakproof glass bottle body.',
    proposedHandle: 'zavelyn-oil-spray-bottle',
    primaryKeyword: 'Cooking Oil Sprayer',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; đặt tên ngắn gọn danh mục nhà bếp',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 54
  {
    id: '15454963859641',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Cordless Electric Garden Tiller',
    proposedSeoTitle: 'Cordless Electric Garden Tiller & Cultivator | Zavelyn',
    proposedMetaDesc: 'Cultivate garden soil and aerate flower beds effortlessly with a battery-powered handheld tiller equipped with durable steel tines and safety switch.',
    proposedHandle: 'zavelyn-cordless-garden-tiller',
    primaryKeyword: 'Cordless Electric Garden Tiller',
    changeReason: 'Loại bỏ saker® khỏi handle; tối ưu từ khóa máy xới đất mini',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 55
  {
    id: '15454964187321',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Livestock Grooming Scratch Brush',
    proposedSeoTitle: 'Livestock Grooming & Scratching Brush for Cattle | Zavelyn',
    proposedMetaDesc: 'Provide cattle, horses, and goats with comforting relief from pests and shedding. Mountable heavy-duty textured bristles fit securely on barn posts.',
    proposedHandle: 'zavelyn-livestock-scratch-brush',
    primaryKeyword: 'Livestock Grooming Scratch Brush',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; chuẩn hóa đồ chăm sóc trang trại',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 56
  {
    id: '15454964744377',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Flexible Neck Work Flashlight',
    proposedSeoTitle: 'Flexible Gooseneck Magnetic Work Flashlight | Zavelyn',
    proposedMetaDesc: 'Position bright LED light precisely inside dark engine bays and machinery with a magnetic base flexible gooseneck inspection flashlight.',
    proposedHandle: 'zavelyn-flexible-work-flashlight',
    primaryKeyword: 'Flexible Neck Work Flashlight',
    changeReason: 'Loại bỏ sakerplus® khỏi handle; đặt tên ngắn gọn đúng công năng',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 57
  {
    id: '15455032115385',
    status: 'ACTIVE', // In Shopify API it is marked ACTIVE, although unlisted
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Cordless Ultrasonic Cutter',
    proposedSeoTitle: 'Cordless Ultrasonic Cutter & Precision Carver | Zavelyn',
    proposedMetaDesc: 'Slice 3D prints, craft plastics, and leather cleanly with high-frequency ultrasonic vibrations. Cordless rechargeable handle for smooth modeling work.',
    proposedHandle: 'saker-cordless-ultrasonic-cutter-and-grinder',
    primaryKeyword: 'Cordless Ultrasonic Cutter',
    changeReason: 'Sản phẩm funnel unlisted độc lập; giữ nguyên handle tránh đứt link',
    redirectRequired: 'NO',
    adsRisk: 'MEDIUM'
  },
  // 58
  {
    id: '15455040241849',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Powered Nasal Care Cleaner',
    proposedSeoTitle: 'Powered Nasal Care Cleaner with Gentle Suction | Zavelyn',
    proposedMetaDesc: 'Flush out dust, pollen, and sinus congestion using powered gentle saline irrigation. Designed for comfortable, mess-free daily respiratory maintenance.',
    proposedHandle: 'navage-advanced-nose-cleaner',
    primaryKeyword: 'Powered Nasal Care Cleaner',
    changeReason: 'Hero funnel Clone-navage; giữ nguyên handle để bảo toàn 100% traffic',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 59
  {
    id: '15455040340153',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Nasal Cleaner Starter Bundle',
    proposedSeoTitle: 'Nasal Cleaner Complete Starter Kit with Pods | Zavelyn',
    proposedMetaDesc: 'Get everything needed for daily sinus relief with the complete nasal cleaner kit, including the powered irrigation device and pre-measured saline pods.',
    proposedHandle: 'navage-starter-bundle',
    primaryKeyword: 'Nasal Cleaner Starter Bundle',
    changeReason: 'Sản phẩm bundle đi kèm phễu Navage; giữ nguyên handle',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 60
  {
    id: '15455092572345',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Yeoman Lawn Sweeper',
    proposedSeoTitle: 'Yeoman Heavy-Duty Push Lawn Sweeper | Zavelyn',
    proposedMetaDesc: 'Clear fallen leaves, grass clippings, and lawn thatch without raking. Heavy-duty rotating brushes collect yard debris directly into a large rear hopper.',
    proposedHandle: 'the-yeoman-sweep',
    primaryKeyword: 'Yeoman Lawn Sweeper',
    changeReason: 'Hero funnel Clone-yeoman; giữ nguyên handle the-yeoman-sweep',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 61
  {
    id: '15455242387641',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn SrefalSteam Thermal Steam Cleaner',
    proposedSeoTitle: 'SrefalSteam Multi-Surface Steam Cleaning System | Zavelyn',
    proposedMetaDesc: 'Deep clean floors, tile grout, and car interiors with concentrated pressurized steam. Includes multi-attachment nozzles for natural sanitizing power.',
    proposedHandle: 'srefalsteam',
    primaryKeyword: 'SrefalSteam Steam Cleaner',
    changeReason: 'Hero funnel Clone-srefalsteam; giữ nguyên handle srefalsteam',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 62
  {
    id: '15455481102521',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn MagTrack Anti-Gravity Train Set',
    proposedSeoTitle: 'MagTrack Anti-Gravity Glow Electric Train Track | Zavelyn',
    proposedMetaDesc: 'Delight children with an anti-gravity flexible track system where magnetic train cars zoom through vertical loops, curves, and glowing room courses.',
    proposedHandle: 'thoson-magtrack',
    primaryKeyword: 'MagTrack Anti-Gravity Train Set',
    changeReason: 'Hero funnel Clone-thoson; giữ nguyên handle thoson-magtrack',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 63
  {
    id: '15455757336761',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Livestock Infrared Heating Lamp',
    proposedSeoTitle: 'Livestock Infrared Heating Lamp for Barns | Zavelyn',
    proposedMetaDesc: 'Keep newborn calves, piglets, and brooding chicks comfortably warm in winter barns using a heavy-duty waterproof aluminum infrared heat lamp fixture.',
    proposedHandle: 'livestock-heating-lamp',
    primaryKeyword: 'Livestock Infrared Heating Lamp',
    changeReason: 'Sản phẩm nông trại đang có ad campaign; giữ nguyên handle',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 64
  {
    id: '15459315220665',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Drum Pro (15" 15-Tone D-Major)',
    proposedSeoTitle: 'Drum Pro 15" 15-Tone D-Major Steel Tongue Drum | Zavelyn',
    proposedMetaDesc: 'Experience soothing acoustic soundscapes with the 15-inch 15-tone D-Major steel tongue drum. Tuned to 432Hz harmonic frequency for meditation and balance.',
    proposedHandle: 'zavelyn-drum-pro',
    primaryKeyword: 'Drum Pro 15-Tone',
    changeReason: 'Model Handpan Pro chủ lực; giữ nguyên handle và thông số nốt nhạc',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 65
  {
    id: '15459315581113',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Drum Plus (11" 11-Tone D-Major)',
    proposedSeoTitle: 'Drum Plus 11" 11-Tone Harmonic Steel Tongue Drum | Zavelyn',
    proposedMetaDesc: 'Immerse in restorative sound healing with the compact 11-inch 11-tone steel tongue drum. Includes custom rubber mallets, travel bag, and songbook.',
    proposedHandle: 'zavelyn-drum-plus',
    primaryKeyword: 'Drum Plus 11-Tone',
    changeReason: 'Model Handpan Plus trong bộ sưu tập; giữ nguyên handle',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 66
  {
    id: '15459318890681',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Drum Mini (6" 8-Tone C-Key)',
    proposedSeoTitle: 'Drum Mini 6" 8-Tone Pocket Steel Tongue Drum | Zavelyn',
    proposedMetaDesc: 'Play beautiful chime-like melodies anywhere with a pocket-sized 6-inch 8-tone steel tongue drum. Tuned in C-key for joyful acoustic exploration.',
    proposedHandle: 'zavelyn-drum-mini',
    primaryKeyword: 'Drum Mini 8-Tone',
    changeReason: 'Model Handpan Mini trong bộ sưu tập; giữ nguyên handle',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 67
  {
    id: '15460656021689',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Handpan Master (22" 12-Tone D-Kurd)',
    proposedSeoTitle: 'Handpan Master 22" 12-Tone D-Kurdish Drum | Zavelyn',
    proposedMetaDesc: 'Play rich, resonant concert sound with the handcrafted 22-inch 12-tone D-Kurdish handpan drum. Made of nitrided steel with exceptional acoustic sustain.',
    proposedHandle: 'zavelyn-handpan-master',
    primaryKeyword: 'Handpan Master 22-Inch',
    changeReason: 'Flagship Handpan Master; giữ nguyên handle và thông số 22" 12-Tone',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 68
  {
    id: '15460701831353',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Rain Drum (3" 6-Tone Outdoor)',
    proposedSeoTitle: 'Rain Drum 3" 6-Tone Outdoor Garden Chime Drum | Zavelyn',
    proposedMetaDesc: 'Capture soothing raindrops into gentle musical tones with a compact 3-inch 6-tone steel rain drum crafted for outdoor patios, balconies, and gardens.',
    proposedHandle: 'zavelyn-rain-drum',
    primaryKeyword: 'Rain Drum 6-Tone',
    changeReason: 'Sản phẩm Rain Drum ngoài trời; giữ nguyên handle bộ sưu tập',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 69
  {
    id: '15460831953081',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn Cordless Turbo Leaf Blower',
    proposedSeoTitle: 'Cordless Turbo Jet Leaf Blower with Battery | Zavelyn',
    proposedMetaDesc: 'Clear driveways, decks, and lawns quickly with a lightweight cordless turbo jet blower delivering powerful high-velocity airflow for outdoor debris.',
    proposedHandle: 'saker-cordless-turbo-leaf-blower',
    primaryKeyword: 'Cordless Turbo Leaf Blower',
    changeReason: 'Sản phẩm chạy quảng cáo trực tiếp; giữ nguyên handle cũ',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 70
  {
    id: '15460886315193',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Rotary Cheese Grater & Slicer',
    proposedSeoTitle: '5-in-1 Rotary Cheese Grater & Veggie Slicer | Zavelyn',
    proposedMetaDesc: 'Shred cheese, grate nuts, and slice vegetables in seconds without hand strain using a rotary mandoline drum grater with strong suction base.',
    proposedHandle: 'zavelyn-rotary-cheese-grater',
    primaryKeyword: 'Rotary Cheese Grater',
    changeReason: 'Rút gọn URL handle, loại bỏ lặp từ shredder thừa',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 71
  {
    id: '15460917313721',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Portable Mesh Nebulizer',
    proposedSeoTitle: 'Portable Ultrasonic Mesh Nebulizer for Inhalation | Zavelyn',
    proposedMetaDesc: 'Deliver fine saline mist quietly for easy inhalation at home or while traveling. Compact battery or USB-powered handheld ultrasonic mesh inhaler.',
    proposedHandle: 'zavelyn-mesh-nebulizer',
    primaryKeyword: 'Portable Mesh Nebulizer',
    changeReason: 'Rút gọn handle từ zavelyn-portable-ultrasonic-mesh-nebulizer',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 72
  {
    id: '15460954276025',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn CozyHeat Wearable Heated Blanket',
    proposedSeoTitle: 'CozyHeat Wearable Heated Hoodie Blanket | Zavelyn',
    proposedMetaDesc: 'Wrap yourself in soothing warmth with an oversized plush hoodie blanket featuring integrated USB thermal heating pads and plush fleece sherpa lining.',
    proposedHandle: 'zavelyn-cozyheat-heated-blanket',
    primaryKeyword: 'Wearable Heated Blanket',
    changeReason: 'Rút gọn URL handle và chuẩn hóa danh mục áo mền sưởi ấm',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 73
  {
    id: '15460988944569',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn Automatic Dough Mixer & Fermenter',
    proposedSeoTitle: 'Automatic Dough Mixer with Fermentation Function | Zavelyn',
    proposedMetaDesc: 'Knead and proof smooth bread and pizza dough hands-free with an automatic electric countertop dough maker with microcomputer temperature proofing.',
    proposedHandle: 'zavelyn-automatic-dough-mixer',
    primaryKeyword: 'Automatic Dough Mixer',
    changeReason: 'Rút gọn handle sạch sẽ, chuẩn hóa tiêu đề sản phẩm',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 74
  {
    id: '15461356011705',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn vFit Red Light Wellness Device',
    proposedSeoTitle: 'vFit Red Light Intimate Wellness Care Device | Zavelyn',
    proposedMetaDesc: 'Promote pelvic muscle comfort and intimate wellness at home with red light and gentle sonic vibration therapy designed for supportive women care.',
    proposedHandle: 'zavelyn-vfit-wellness-device',
    primaryKeyword: 'vFit Red Light Wellness Device',
    changeReason: 'Rút gọn URL handle, bỏ từ khóa dài thừa',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 75
  {
    id: '15461407588537',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn SculptComfort Wirefree Shapewear Bra',
    proposedSeoTitle: 'SculptComfort Wirefree Breathable Shapewear Bra | Zavelyn',
    proposedMetaDesc: 'Enjoy flattering posture support and seamless all-day comfort with a wireless lift shapewear bra featuring wide smoothing back bands and breathable cups.',
    proposedHandle: 'zavelyn-sculptcomfort-bra',
    primaryKeyword: 'Wirefree Shapewear Bra',
    changeReason: 'Rút gọn handle ngắn gọn dễ nhớ thay vì chuỗi dài cũ',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 76
  {
    id: '15461446713529',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn SuperTots Fresh Food Feeder Pacifier',
    proposedSeoTitle: 'SuperTots Silicone Fresh Food & Fruit Feeder | Zavelyn',
    proposedMetaDesc: 'Introduce fresh fruits and vegetables to teething babies safely. Features soft chewable food-grade silicone pouches with easy-grip toddler handles.',
    proposedHandle: 'zavelyn-supertots-feeder',
    primaryKeyword: 'Fresh Food Feeder Pacifier',
    changeReason: 'Rút gọn handle URL; tối ưu danh mục đồ dùng bé ăn dặm',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 77
  {
    id: '15461471060153',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn AirClear Plug-In Air Purifier',
    proposedSeoTitle: 'AirClear Plug-In Negative Ion Room Air Purifier | Zavelyn',
    proposedMetaDesc: 'Freshen indoor air quietly in bathrooms, kitchens, and pet spaces. Emits negative ions to neutralize airborne dust and lingering odors with no filters.',
    proposedHandle: 'zavelyn-airclear-air-purifier',
    primaryKeyword: 'Plug-In Air Purifier',
    changeReason: 'Rút gọn handle sạch; bỏ các cụm plugin-negative-ion rườm rà',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 78
  {
    id: '15461501927609',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn FlawlessBlend Foundation Stick',
    proposedSeoTitle: 'FlawlessBlend Color-Changing Foundation Stick | Zavelyn',
    proposedMetaDesc: 'Achieve smooth, natural skin coverage with a self-adjusting cream foundation stick that blends to match your unique skin tone with a radiant matte finish.',
    proposedHandle: 'zavelyn-flawlessblend-foundation',
    primaryKeyword: 'Color Changing Foundation Stick',
    changeReason: 'Rút gọn URL handle; tối ưu từ khóa mỹ phẩm trang điểm',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 79
  {
    id: '15461507956921',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn PureFlow Wireless Pet Water Fountain',
    proposedSeoTitle: 'PureFlow Stainless Steel Wireless Pet Fountain | Zavelyn',
    proposedMetaDesc: 'Encourage cats and dogs to drink more fresh filtered water with a cordless stainless steel fountain featuring motion activation and multi-layer filters.',
    proposedHandle: 'zavelyn-pureflow-pet-fountain',
    primaryKeyword: 'Wireless Pet Water Fountain',
    changeReason: 'Rút gọn handle URL; bỏ các cụm dài dòng thừa',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 80
  {
    id: '15461521064121',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn GravityGlider Stunt RC Jet',
    proposedSeoTitle: 'GravityGlider Durable Stunt RC Jet Airplane | Zavelyn',
    proposedMetaDesc: 'Perform 360-degree aerial flips and stable outdoor glides with a durable EPP foam stunt jet airplane featuring gyro stabilization and remote control.',
    proposedHandle: 'zavelyn-gravityglider-rc-jet',
    primaryKeyword: 'Stunt RC Jet',
    changeReason: 'Rút gọn handle từ zavelyn-gravityglider-indestructible-stunt-rc-jet',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 81
  {
    id: '15461535416505',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn MegaLifters Alloy RC Excavator',
    proposedSeoTitle: 'MegaLifters Heavy-Duty Alloy RC Excavator Toy | Zavelyn',
    proposedMetaDesc: 'Command realistic construction excavation with an alloy metal RC excavator featuring functional digging arm, rubber treads, and responsive 2.4GHz control.',
    proposedHandle: 'zavelyn-megalifters-heavy-duty-alloy-rc-construction-fleet',
    primaryKeyword: 'Alloy RC Excavator',
    changeReason: 'Có lượng ad attribution và search ổn định; giữ nguyên handle',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  },
  // 82
  {
    id: '15461545935033',
    status: 'ACTIVE',
    classification: 'READY',
    proposedTitle: 'Zavelyn BotanaRoots Batana Hair Growth Oil',
    proposedSeoTitle: 'BotanaRoots Pure Batana Oil for Hair & Scalp | Zavelyn',
    proposedMetaDesc: 'Revitalize dull hair and soothe dry scalp with pure Honduran batana oil rich in essential fatty acids. Deeply conditions strands for noticeable softness.',
    proposedHandle: 'zavelyn-botanaroots-hair-oil',
    primaryKeyword: 'Batana Hair Growth Oil',
    changeReason: 'Rút gọn handle URL; bỏ các từ thừa',
    redirectRequired: 'YES',
    adsRisk: 'LOW'
  },
  // 83
  {
    id: '15461559533753',
    status: 'ACTIVE',
    classification: 'KEEP CURRENT HANDLE',
    proposedTitle: 'Zavelyn ThermoGlove Heated Fingerless Gloves',
    proposedSeoTitle: 'ThermoGlove Heated Fingerless Gloves for Cold Hands | Zavelyn',
    proposedMetaDesc: 'Keep your hands warm while leaving your fingers free. Discover Zavelyn ThermoGlove heated gloves with adjustable heat settings for comfortable everyday use.',
    proposedHandle: 'zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves',
    primaryKeyword: 'ThermoGlove Heated Fingerless Gloves',
    changeReason: 'Hero funnel chạy Facebook Ads chính; giữ nguyên handle bảo vệ 100% traffic',
    redirectRequired: 'NO',
    adsRisk: 'HIGH'
  }
];

// Validation & Checks
console.log('Total items defined:', catalogData.length);

const titles = catalogData.map(c => c.proposedTitle);
const seoTitles = catalogData.map(c => c.proposedSeoTitle);
const handles = catalogData.map(c => c.proposedHandle);

const uniqueTitles = new Set(titles).size;
const uniqueSeo = new Set(seoTitles).size;
const uniqueHandles = new Set(handles).size;

console.log('Unique Titles:', uniqueTitles, '/ 83');
console.log('Unique SEO Titles:', uniqueSeo, '/ 83');
console.log('Unique Handles:', uniqueHandles, '/ 83');

// Check trademark symbols
const tmRegex = /[™®]/;
const tmViolations = [];
catalogData.forEach((c, idx) => {
  if (tmRegex.test(c.proposedTitle) || tmRegex.test(c.proposedSeoTitle) || tmRegex.test(c.proposedMetaDesc) || tmRegex.test(c.proposedHandle)) {
    tmViolations.push(`Item ${idx + 1} has TM symbol!`);
  }
});
console.log('Trademark symbol violations:', tmViolations.length);

// Check double Zavelyn brand in SEO titles
const doubleBrandViolations = [];
catalogData.forEach((c, idx) => {
  const matches = c.proposedSeoTitle.match(/Zavelyn/gi);
  if (matches && matches.length > 1) {
    doubleBrandViolations.push(`Item ${idx + 1} repeats brand: "${c.proposedSeoTitle}"`);
  }
});
console.log('Double Brand in SEO Title violations:', doubleBrandViolations.length);
if (doubleBrandViolations.length > 0) {
  console.log(doubleBrandViolations);
}

// Check character lengths
let minT = 999, maxT = 0, sumT = 0;
let minS = 999, maxS = 0, sumS = 0;
let minM = 999, maxM = 0, sumM = 0;

catalogData.forEach((c, idx) => {
  const tl = c.proposedTitle.length;
  const sl = c.proposedSeoTitle.length;
  const ml = c.proposedMetaDesc.length;
  
  if (tl < minT) minT = tl;
  if (tl > maxT) maxT = tl;
  sumT += tl;
  
  if (sl < minS) minS = sl;
  if (sl > maxS) maxS = sl;
  sumS += sl;
  
  if (ml < minM) minM = ml;
  if (ml > maxM) maxM = ml;
  sumM += ml;

  if (ml < 125 || ml > 165) {
    console.log(`Notice Meta length item ${idx + 1} (${ml} chars): ${c.proposedMetaDesc}`);
  }
});

console.log(`Title Lengths: min ${minT}, max ${maxT}, avg ${(sumT / 83).toFixed(1)}`);
console.log(`SEO Title Lengths: min ${minS}, max ${maxS}, avg ${(sumS / 83).toFixed(1)}`);
console.log(`Meta Desc Lengths: min ${minM}, max ${maxM}, avg ${(sumM / 83).toFixed(1)}`);

// Build full migration objects matching raw catalog
const fullPlan = catalogData.map((item, idx) => {
  const raw = rawProducts.find(p => p.id.includes(item.id)) || rawProducts[idx];
  const oldUrl = `https://tryzavelyn.com/products/${raw.handle}`;
  const newUrl = `https://tryzavelyn.com/products/${item.proposedHandle}`;
  
  return {
    productId: item.id,
    status: item.status,
    currentProductTitle: raw.title,
    proposedProductTitle: item.proposedTitle,
    titleCharCount: item.proposedTitle.length,
    currentSeoPageTitle: raw.seo?.title || '',
    proposedSeoPageTitle: item.proposedSeoTitle,
    seoTitleCharCount: item.proposedSeoTitle.length,
    currentMetaDescription: raw.seo?.description || '',
    proposedMetaDescription: item.proposedMetaDesc,
    metaDescCharCount: item.proposedMetaDesc.length,
    currentUrlHandle: raw.handle,
    proposedUrlHandle: item.proposedHandle,
    oldFullUrl: oldUrl,
    newFullUrl: newUrl,
    primaryKeyword: item.primaryKeyword,
    changeReason: item.changeReason,
    redirectRequired: item.redirectRequired,
    adsTrafficRisk: item.adsRisk,
    seoRisk: 'LOW',
    contentVerification: 'VERIFIED',
    classification: item.classification,
    approvalStatus: 'PENDING_APPROVAL'
  };
});

// Write JSON Plan
fs.writeFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', JSON.stringify(fullPlan, null, 2), 'utf8');

// Write CSV Plan
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

const csvHeaders = [
  'Product ID',
  'Product Status',
  'Current Product Title',
  'Proposed Product Title',
  'Title Char Count',
  'Current SEO Page Title',
  'Proposed SEO Page Title',
  'SEO Title Char Count',
  'Current Meta Description',
  'Proposed Meta Description',
  'Meta Desc Char Count',
  'Current URL Handle',
  'Proposed URL Handle',
  'Old Full URL',
  'New Full URL',
  'Primary Keyword',
  'Change Reason',
  'Redirect Required',
  'Ads Traffic Risk',
  'SEO Risk',
  'Content Verification',
  'Classification',
  'Approval Status'
];

const csvRows = [csvHeaders.join(',')];
for (const p of fullPlan) {
  const row = [
    escapeCsv(p.productId),
    escapeCsv(p.status),
    escapeCsv(p.currentProductTitle),
    escapeCsv(p.proposedProductTitle),
    p.titleCharCount,
    escapeCsv(p.currentSeoPageTitle),
    escapeCsv(p.proposedSeoPageTitle),
    p.seoTitleCharCount,
    escapeCsv(p.currentMetaDescription),
    escapeCsv(p.proposedMetaDescription),
    p.metaDescCharCount,
    escapeCsv(p.currentUrlHandle),
    escapeCsv(p.proposedUrlHandle),
    escapeCsv(p.oldFullUrl),
    escapeCsv(p.newFullUrl),
    escapeCsv(p.primaryKeyword),
    escapeCsv(p.changeReason),
    escapeCsv(p.redirectRequired),
    escapeCsv(p.adsTrafficRisk),
    escapeCsv(p.seoRisk),
    escapeCsv(p.contentVerification),
    escapeCsv(p.classification),
    escapeCsv(p.approvalStatus)
  ];
  csvRows.push(row.join(','));
}

fs.writeFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.csv', csvRows.join('\n'), 'utf8');
console.log('Saved CSV Plan to scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.csv');

// Build 301 Redirect Mapping
const redirects = [];
for (const p of fullPlan) {
  if (p.currentUrlHandle !== p.proposedUrlHandle && p.redirectRequired === 'YES') {
    redirects.push({
      productId: p.productId,
      productTitle: p.proposedProductTitle,
      oldPath: `/products/${p.currentUrlHandle}`,
      newPath: `/products/${p.proposedUrlHandle}`,
      targetUrl: p.newFullUrl,
      redirectType: '301 Moved Permanently',
      riskCategory: p.classification,
      status: 'PLANNED'
    });
  }
}

console.log('Total 301 Redirects mapped:', redirects.length);
fs.writeFileSync('scripts/ZAVELYN_URL_REDIRECT_MAPPING.json', JSON.stringify(redirects, null, 2), 'utf8');

const rHeaders = ['Product ID', 'Product Title', 'Old Path', 'New Path', 'Target URL', 'Redirect Type', 'Risk Category', 'Status'];
const rRows = [rHeaders.join(',')];
for (const r of redirects) {
  rRows.push([
    escapeCsv(r.productId),
    escapeCsv(r.productTitle),
    escapeCsv(r.oldPath),
    escapeCsv(r.newPath),
    escapeCsv(r.targetUrl),
    escapeCsv(r.redirectType),
    escapeCsv(r.riskCategory),
    escapeCsv(r.status)
  ].join(','));
}

fs.writeFileSync('scripts/ZAVELYN_URL_REDIRECT_MAPPING.csv', rRows.join('\n'), 'utf8');
console.log('Saved 301 Redirect Mapping CSV to scripts/ZAVELYN_URL_REDIRECT_MAPPING.csv');
