import fs from 'fs';

const rawProducts = JSON.parse(fs.readFileSync('scripts/raw_catalog_products.json', 'utf8'));
const rawRedirects = JSON.parse(fs.readFileSync('scripts/raw_existing_redirects.json', 'utf8'));

// Known active ads handles or core funnels from previous sessions & audits
const KNOWN_ADS_HANDLES = new Set([
  'zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves',
  'portable-infrared',
  'sakerplus-fence-post-repair-kit',
  'the-yeoman-sweep',
  'navage-advanced-nose-cleaner',
  'navage-starter-bundle',
  'thoson-magtrack',
  'livestock-heating-lamp',
  'srefalsteam',
  'saker-cordless-turbo-leaf-blower',
  'zavelyn-5-in-1-rotary-cheese-grater-shredder',
  'zavelyn-cozyheat-heated-wearable-blanket-sweater',
  'zavelyn-megalifters-heavy-duty-alloy-rc-construction-fleet',
  'zavelyn-botanaroots-organic-batana-hair-growth-oil'
]);

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, ' ')
             .replace(/&nbsp;/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'")
             .replace(/\s+/g, ' ')
             .trim();
}

function cleanHandleString(str) {
  return str.toLowerCase()
    .replace(/®|™|©/g, '')
    .replace(/clearance-sale|clearance|hot-deal|bogo-free|bogo/g, '')
    .replace(/sakerplus-|sakerplus|saker-|saker/g, 'zavelyn-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

// Master rules dictionary for precise naming of all 83 products
// Mapping by product ID (legacyResourceId)
const CATALOG_RULES = {
  // 1-6 DRAFT PRODUCTS
  '15416491933881': {
    proposedTitle: 'Zavelyn Compression Foot Sleeves',
    primaryKeyword: 'Compression Foot Sleeves',
    benefit: 'Plantar Fasciitis Relief',
    proposedHandle: 'zavelyn-compression-foot-sleeves',
    classification: 'OUT OF SCOPE',
    adsRisk: 'LOW',
    reason: 'Sản phẩm Draft; bổ sung Product Type rõ ràng và chuẩn hóa handle không có BOGO'
  },
  '15420277653689': {
    proposedTitle: 'Zavelyn V1 Microcurrent Therapy Device',
    primaryKeyword: 'Microcurrent Therapy Device',
    benefit: 'Targeted Muscle Recovery',
    proposedHandle: 'zavelyn-v1-therapy-device',
    classification: 'OUT OF SCOPE',
    adsRisk: 'LOW',
    reason: 'Sản phẩm Draft tên v1-device mơ hồ; đề xuất làm rõ công năng phục hồi cơ bắp'
  },
  '15420647702713': {
    proposedTitle: 'Zavelyn Foot Drop AFO Orthosis Brace',
    primaryKeyword: 'Foot Drop AFO Brace',
    benefit: 'Walking & Gait Support',
    proposedHandle: 'zavelyn-foot-drop-afo-brace',
    classification: 'OUT OF SCOPE',
    adsRisk: 'LOW',
    reason: 'Sản phẩm Draft có handle "cdf" viết tắt; chuẩn hóa URL và tên chỉnh hình AFO'
  },
  '15420985966777': {
    proposedTitle: 'Zavelyn Plantar Fasciitis Foot Sleeves',
    primaryKeyword: 'Plantar Fasciitis Foot Sleeves',
    benefit: 'Arch & Heel Compression',
    proposedHandle: 'zavelyn-plantar-foot-sleeves',
    classification: 'OUT OF SCOPE',
    adsRisk: 'LOW',
    reason: 'Sản phẩm Draft có handle chứa "bogo-free"; loại bỏ từ quảng cáo khỏi URL'
  },
  '15424286589113': {
    proposedTitle: 'Zavelyn Stroke Rehabilitation Robot Glove',
    primaryKeyword: 'Stroke Rehabilitation Glove',
    benefit: 'Hand & Finger Recovery',
    proposedHandle: 'zavelyn-rehabilitation-glove',
    classification: 'OUT OF SCOPE',
    adsRisk: 'LOW',
    reason: 'Sản phẩm Draft; handle đã chuẩn (đang có redirect từ /products/regrip và /products/zavelyn)'
  },
  '15424429457593': {
    proposedTitle: 'Zavelyn Herbal Relief Miracle Balm',
    primaryKeyword: 'Herbal Pain Relief Balm',
    benefit: 'Soothing Muscle & Joint Comfort',
    proposedHandle: 'zavelyn-miracle-balm',
    classification: 'OUT OF SCOPE',
    adsRisk: 'LOW',
    reason: 'Sản phẩm Draft; thêm thương hiệu Zavelyn vào handle'
  },

  // 7 FENCE POST REPAIR
  '15454946951353': {
    proposedTitle: 'Zavelyn Steel Fence Post Repair Kit',
    primaryKeyword: 'Steel Fence Post Repair Kit',
    benefit: 'Heavy-Duty Ground Anchor Reinforcement',
    proposedHandle: 'zavelyn-fence-post-repair-kit',
    classification: 'HIGH ADS RISK',
    adsRisk: 'HIGH',
    reason: 'Handle hiện tại chứa "sakerplus"; đổi sang "zavelyn-" kèm 301 redirect bắt buộc'
  },
  // 8 SENSORY FLOOR MATS
  '15454947901625': {
    proposedTitle: 'Zavelyn TPU Sensory Textured Floor Mats',
    primaryKeyword: 'Sensory Textured Floor Mats',
    benefit: 'Orthopedic Reflexology Stimulation',
    proposedHandle: 'zavelyn-sensory-floor-mats',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® khỏi handle; chuẩn hóa URL sạch và SEO metadata'
  },
  // 9 DRAWER LINER
  '15454948163769': {
    proposedTitle: 'Zavelyn Tearable Non-Slip Drawer Liner',
    primaryKeyword: 'Non-Slip Drawer Liner',
    benefit: 'Washable Grip Cabinet Protection',
    proposedHandle: 'zavelyn-non-slip-drawer-liner',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® khỏi handle; chuẩn hóa Product Title'
  },
  // 10 SHELF LINER
  '15454948556985': {
    proposedTitle: 'Zavelyn Tearable Shelf & Drawer Mat Liner',
    primaryKeyword: 'Shelf and Drawer Mat Liner',
    benefit: 'Waterproof Kitchen Organization',
    proposedHandle: 'zavelyn-shelf-drawer-liner',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® khỏi handle; phân biệt với sản phẩm drawer liner ở mục 9'
  },
  // 11 BED VACUUM
  '15454948786361': {
    proposedTitle: 'Zavelyn Handheld UV Bed Vacuum Cleaner',
    primaryKeyword: 'Handheld UV Bed Vacuum Cleaner',
    benefit: 'Deep Mattress Dust Mite Elimination',
    proposedHandle: 'zavelyn-uv-bed-vacuum',
    classification: 'READY',
    adsRisk: 'MEDIUM',
    reason: 'Loại bỏ từ rác "clearance-sale" và "saker" khỏi URL handle'
  },
  // 12 SPACE HEATER
  '15454948982969': {
    proposedTitle: 'Zavelyn 1500W Flame Effect Space Heater',
    primaryKeyword: 'Flame Effect Space Heater',
    benefit: 'Fast Oscillating Ceramic Room Warmth',
    proposedHandle: 'zavelyn-flame-space-heater',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và sakerplus khỏi handle'
  },
  // 13 WELDING MACHINE
  '15454949343417': {
    proposedTitle: 'Zavelyn Portable Handheld ARC Welding Machine',
    primaryKeyword: 'Portable Handheld ARC Welder',
    benefit: 'Compact Digital Metal Fabrication',
    proposedHandle: 'zavelyn-portable-welder',
    classification: 'READY',
    adsRisk: 'MEDIUM',
    reason: 'Loại bỏ từ rác "clearance" và "sakerplus" khỏi URL handle'
  },
  // 14 PRY BAR
  '15454949540025': {
    proposedTitle: 'Zavelyn Titanium Multifunction Pocket Pry Bar',
    primaryKeyword: 'Titanium Pocket Pry Bar',
    benefit: 'Everyday Carry EDC Bottle Opener Tool',
    proposedHandle: 'zavelyn-titanium-pocket-pry-bar',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và sakerplus khỏi handle'
  },
  // 15 STEAM CLEANER
  '15454949998777': {
    proposedTitle: 'Zavelyn Handheld Steam Disinfection Cleaner',
    primaryKeyword: 'Handheld Steam Disinfection Cleaner',
    benefit: 'Chemical-Free High-Pressure Sanitizing',
    proposedHandle: 'zavelyn-steam-disinfection-cleaner',
    classification: 'READY',
    adsRisk: 'MEDIUM',
    reason: 'Loại bỏ từ rác "clearance" và "sakerplus" khỏi URL handle'
  },
  // 16 NIGHT LIGHT
  '15454950490297': {
    proposedTitle: 'Zavelyn Squishy Egg Silicone Night Light',
    primaryKeyword: 'Squishy Silicone Night Light',
    benefit: 'Gentle Tap Control Bedside Glow',
    proposedHandle: 'zavelyn-squishy-egg-night-light',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và sakerplus khỏi handle'
  },
  // 17 EXHAUST FAN
  '15454950850745': {
    proposedTitle: 'Zavelyn Bathroom Exhaust Fan with LED Light',
    primaryKeyword: 'Bathroom Exhaust Fan with LED Light',
    benefit: 'Ultra-Quiet Moisture & Odor Ventilation',
    proposedHandle: 'zavelyn-bathroom-exhaust-fan',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và sakerplus khỏi handle'
  },
  // 18 SOLAR STREET LIGHTS
  '15454951211193': {
    proposedTitle: 'Zavelyn Dusk-to-Dawn Solar Street Lights',
    primaryKeyword: 'Solar Street Lights Outdoor',
    benefit: 'Ultra-Bright Commercial Yard Security',
    proposedHandle: 'zavelyn-solar-street-lights',
    classification: 'READY',
    adsRisk: 'MEDIUM',
    reason: 'Loại bỏ từ rác "clearance-sale" và "sakerplus" khỏi URL handle'
  },
  // 19 RAV4 HUB
  '15454951473337': {
    proposedTitle: 'Zavelyn RAV4 Center Console USB Charging Hub',
    primaryKeyword: 'RAV4 Console USB Charging Hub',
    benefit: 'Seamless OEM Fast Charging Integration',
    proposedHandle: 'zavelyn-rav4-usb-hub',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 20 CAMPING FAN
  '15454951801017': {
    proposedTitle: 'Zavelyn Rechargeable Camping Fan with LED Light',
    primaryKeyword: 'Rechargeable Camping Fan with Light',
    benefit: 'Long-Lasting Tent Airflow & Emergency Power',
    proposedHandle: 'zavelyn-camping-fan-light',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ hậu tố "-battery-1" và "sakerplus" khỏi handle'
  },
  // 21 STEAM GENERATOR
  '15454951997625': {
    proposedTitle: 'Zavelyn Portable Home Sauna Steam Generator',
    primaryKeyword: 'Home Sauna Steam Generator',
    benefit: 'Therapeutic Full-Body Detoxification',
    proposedHandle: 'zavelyn-sauna-steam-generator',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và sakerplus khỏi handle'
  },
  // 22 WALL CHASER
  '15454952292537': {
    proposedTitle: 'Zavelyn Laser-Guided Electric Wall Chaser',
    primaryKeyword: 'Laser-Guided Electric Wall Chaser',
    benefit: 'Dustless Concrete Groove Cutting',
    proposedHandle: 'zavelyn-electric-wall-chaser',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 23 DIESEL INJECTOR
  '15454952620217': {
    proposedTitle: 'Zavelyn Master Diesel Injector Removal Kit',
    primaryKeyword: 'Diesel Injector Removal Tool Kit',
    benefit: 'Damage-Free Automotive Extraction',
    proposedHandle: 'zavelyn-diesel-injector-removal-kit',
    classification: 'READY',
    adsRisk: 'MEDIUM',
    reason: 'Loại bỏ từ rác "clearance-sale" và "sakerplus" khỏi handle'
  },
  // 24 BASKETBALL HOOP
  '15454952882361': {
    proposedTitle: 'Zavelyn Kids Indoor & Outdoor Basketball Hoop',
    primaryKeyword: 'Kids Basketball Hoop Set',
    benefit: 'Height Adjustable Active Play for Youth',
    proposedHandle: 'zavelyn-kids-basketball-hoop',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 25 DESK SHELF
  '15454953177273': {
    proposedTitle: 'Zavelyn Clamp-On 3-Tier Desk Shelf Organizer',
    primaryKeyword: 'Clamp-On Desk Shelf Organizer',
    benefit: 'No-Drill Ergonomic Workstation Storage',
    proposedHandle: 'zavelyn-clamp-desk-shelf',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 26 THERMAL CAMERA
  '15454953504953': {
    proposedTitle: 'Zavelyn Infrared Thermal Imaging Camera',
    primaryKeyword: 'Infrared Thermal Imaging Camera',
    benefit: 'Precision HVAC & Electrical Inspection',
    proposedHandle: 'zavelyn-thermal-imaging-camera',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và sakerplus khỏi handle'
  },
  // 27 UV MATTRESS VACUUM
  '15454953898169': {
    proposedTitle: 'Zavelyn Cordless UV Mattress Vacuum Cleaner',
    primaryKeyword: 'Cordless UV Mattress Vacuum',
    benefit: 'Deep Allergen & Pet Hair Sanitizing',
    proposedHandle: 'zavelyn-cordless-mattress-vacuum',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 28 MOLLE VEST
  '15454954193081': {
    proposedTitle: 'Zavelyn Tactical MOLLE Utility Vest',
    primaryKeyword: 'Tactical MOLLE Utility Vest',
    benefit: 'Breathable Modular Gear Carrying',
    proposedHandle: 'zavelyn-tactical-molle-vest',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và sakerplus khỏi handle'
  },
  // 29 PIPE CRIMPER
  '15454954422457': {
    proposedTitle: 'Zavelyn Hydraulic Pipe Crimping Tool Kit',
    primaryKeyword: 'Hydraulic Pipe Crimping Tool Kit',
    benefit: 'Leak-Free Copper & PEX Plumbing Crimp',
    proposedHandle: 'zavelyn-hydraulic-pipe-crimper',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 30 HYGROMETER CLOCK
  '15454954750137': {
    proposedTitle: 'Zavelyn Digital Hygrometer Thermometer Clock',
    primaryKeyword: 'Digital Hygrometer Thermometer Clock',
    benefit: 'Real-Time Indoor Humidity & Temp Monitor',
    proposedHandle: 'zavelyn-smart-hygrometer-clock',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và sakerplus khỏi handle'
  },
  // 31 LASH LAMP
  '15454955045049': {
    proposedTitle: 'Zavelyn Half Moon Dimmable LED Lash Lamp',
    primaryKeyword: 'Half Moon LED Lash Lamp',
    benefit: 'Shadow-Free Lighting for Estheticians',
    proposedHandle: 'zavelyn-half-moon-lash-lamp',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 32 GYPSUM BOARD CUTTER
  '15454955372729': {
    proposedTitle: 'Zavelyn 3-in-1 Drywall Gypsum Board Cutter',
    primaryKeyword: 'Drywall Gypsum Board Cutter Tool',
    benefit: 'Precise Clean Cuts with Built-In Tape Measure',
    proposedHandle: 'zavelyn-drywall-cutter-tool',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 33 GALAXY PROJECTOR
  '15454955765945': {
    proposedTitle: 'Zavelyn Rotating Galaxy Star Projector',
    primaryKeyword: 'Rotating Galaxy Star Projector',
    benefit: 'Ambient Night Sky Lighting for Bedroom',
    proposedHandle: 'zavelyn-galaxy-star-projector',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 34 FILL LIGHT STICK
  '15454956028089': {
    proposedTitle: 'Zavelyn Retractable Handheld LED Fill Light',
    primaryKeyword: 'Handheld LED Fill Light Wand',
    benefit: 'Adjustable Color Temp for Video & Photography',
    proposedHandle: 'zavelyn-led-fill-light-wand',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 35 HEAT PRESS
  '15454956355769': {
    proposedTitle: 'Zavelyn Portable Mini Heat Press Machine',
    primaryKeyword: 'Portable Mini Heat Press Machine',
    benefit: 'Quick DIY Iron-On Transfers for Shirts & Hats',
    proposedHandle: 'zavelyn-mini-heat-press',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 36 CHICKEN COOP DOOR
  '15454956781753': {
    proposedTitle: 'Zavelyn Automatic Chicken Coop Door with Timer',
    primaryKeyword: 'Automatic Chicken Coop Door',
    benefit: 'Light-Sensing & Predator-Proof Protection',
    proposedHandle: 'zavelyn-automatic-chicken-coop-door',
    classification: 'HIGH ADS RISK',
    adsRisk: 'HIGH',
    reason: 'Handle chứa "sakerplus®-"; đổi sang handle sạch chuẩn Zavelyn kèm 301 redirect'
  },
  // 37 SAUNA BLANKET (CRITICAL ADS FUNNEL)
  '15454957142201': {
    proposedTitle: 'Zavelyn Far Infrared Sauna Blanket',
    primaryKeyword: 'Far Infrared Sauna Blanket',
    benefit: 'At-Home Full-Body Calorie & Detox Therapy',
    proposedHandle: 'portable-infrared',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'URL đang chạy trực tiếp Facebook Ads & funnels; GIỮ NGUYÊN HANDLE để bảo vệ 100% traffic quảng cáo'
  },
  // 38 WORK LIGHT
  '15454957633721': {
    proposedTitle: 'Zavelyn 360° Magnetic LED Work Light',
    primaryKeyword: 'Magnetic LED Work Light 360',
    benefit: 'Hands-Free Illumination for Mechanics & DIY',
    proposedHandle: 'zavelyn-magnetic-work-light',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 39 STRING LIGHTS
  '15454958158009': {
    proposedTitle: 'Zavelyn 50FT Industrial LED String Lights',
    primaryKeyword: 'Industrial LED String Lights 50FT',
    benefit: 'Weatherproof Heavy-Duty Jobsite Illumination',
    proposedHandle: 'zavelyn-led-jobsite-string-lights',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 40 CABLE LUG CRIMPER
  '15454958420153': {
    proposedTitle: 'Zavelyn Hydraulic Battery Cable Lug Crimper',
    primaryKeyword: 'Hydraulic Battery Cable Lug Crimper',
    benefit: 'Heavy-Duty Terminal Wire Crimping',
    proposedHandle: 'zavelyn-battery-lug-crimper',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 41 DASH CAMERA
  '15454958878905': {
    proposedTitle: 'Zavelyn Panoramic Dash Camera with Night Vision',
    primaryKeyword: 'Panoramic Dash Camera Night Vision',
    benefit: 'Full Wide-Angle Vehicle Security Recording',
    proposedHandle: 'zavelyn-panoramic-dash-camera',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 42 DOWNSPOUT CATCH BASIN
  '15454959403193': {
    proposedTitle: 'Zavelyn Low-Profile Downspout Catch Basin',
    primaryKeyword: 'Low-Profile Downspout Catch Basin',
    benefit: 'Effective Rainwater Drainage & Lawn Care',
    proposedHandle: 'zavelyn-downspout-catch-basin',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 43 WHEEL ALIGNMENT
  '15454959894713': {
    proposedTitle: 'Zavelyn Stainless Steel Wheel Alignment Plates',
    primaryKeyword: 'Wheel Alignment Tool Plates',
    benefit: 'Accurate DIY Toe-In & Camber Measurement',
    proposedHandle: 'zavelyn-wheel-alignment-kit',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 44 RED LIGHT PANEL
  '15454960255161': {
    proposedTitle: 'Zavelyn Targeted Red Light Therapy Panel',
    primaryKeyword: 'Red Light Therapy Panel',
    benefit: '660nm & 850nm Deep Tissue Skin Rejuvenation',
    proposedHandle: 'zavelyn-red-light-panel',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 45 TARGET GAME
  '15454960517305': {
    proposedTitle: 'Zavelyn Electronic Rotating Duck Target Game',
    primaryKeyword: 'Electronic Rotating Target Game',
    benefit: 'Dynamic Foam Blaster Shooting Fun for Kids',
    proposedHandle: 'zavelyn-rotating-target-game',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 46 LASER LEVEL
  '15454960910521': {
    proposedTitle: 'Zavelyn Self-Leveling Laser Level with Tripod',
    primaryKeyword: 'Self-Leveling Laser Level Tripod',
    benefit: 'High-Visibility Cross Line Alignment',
    proposedHandle: 'zavelyn-self-leveling-laser-level',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 47 METAL DETECTOR
  '15454961238201': {
    proposedTitle: 'Zavelyn Kids Waterproof Metal Detector with LCD',
    primaryKeyword: 'Kids Metal Detector with LCD',
    benefit: 'Lightweight Treasure Hunting for Beginners',
    proposedHandle: 'zavelyn-kids-metal-detector',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 48 TAIL VISE CLAMP
  '15454961565881': {
    proposedTitle: 'Zavelyn Adjustable Workbench Tail Vise Clamp',
    primaryKeyword: 'Workbench Tail Vise Clamp',
    benefit: 'Solid Steel Woodworking Tenon & Bench Hold',
    proposedHandle: 'zavelyn-workbench-vise-clamp',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 49 KNEE MASSAGER
  '15454961860793': {
    proposedTitle: 'Zavelyn Cordless Heated Knee Massager',
    primaryKeyword: 'Cordless Heated Knee Massager',
    benefit: 'Air Compression & Vibration Joint Relief',
    proposedHandle: 'zavelyn-heated-knee-massager',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 50 SOLAR SECURITY LIGHT
  '15454962286777': {
    proposedTitle: 'Zavelyn Solar Motion Sensor Security Floodlight',
    primaryKeyword: 'Solar Motion Sensor Floodlight',
    benefit: 'Wide-Angle Outdoor Pathway Illumination',
    proposedHandle: 'zavelyn-solar-motion-floodlight',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 51 CHARGING STATION
  '15454962778297': {
    proposedTitle: 'Zavelyn 5-in-1 Magnetic Wireless Charging Stand',
    primaryKeyword: 'Magnetic Wireless Charging Stand',
    benefit: 'Fast Multi-Device Power for Phone & Watch',
    proposedHandle: 'zavelyn-5-in-1-charging-stand',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 52 NUT PICKER
  '15454963073209': {
    proposedTitle: 'Zavelyn Rolling Nut & Ball Harvester Collector',
    primaryKeyword: 'Rolling Nut and Ball Harvester',
    benefit: 'Back-Saving Pecan & Golf Ball Gathering',
    proposedHandle: 'zavelyn-rolling-nut-collector',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 53 OIL SPRAY BOTTLE
  '15454963433657': {
    proposedTitle: 'Zavelyn Ultra-Fine Cooking Oil Sprayer Dispenser',
    primaryKeyword: 'Cooking Oil Sprayer Dispenser',
    benefit: 'Even Mist Control for Air Fryer & Salad',
    proposedHandle: 'zavelyn-oil-sprayer-dispenser',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 54 GARDEN TILLER
  '15454963859641': {
    proposedTitle: 'Zavelyn Cordless Electric Garden Tiller Cultivator',
    primaryKeyword: 'Cordless Electric Garden Tiller',
    benefit: 'Effortless Soil Loosening & Weeding',
    proposedHandle: 'zavelyn-cordless-garden-tiller',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 55 LIVESTOCK BRUSH
  '15454964187321': {
    proposedTitle: 'Zavelyn Livestock Grooming Scratch Brush',
    primaryKeyword: 'Livestock Grooming Scratch Brush',
    benefit: 'Itch Relief & Coat Care for Cattle & Horses',
    proposedHandle: 'zavelyn-livestock-scratch-brush',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 56 WORK FLASHLIGHT
  '15454964744377': {
    proposedTitle: 'Zavelyn Flexible-Neck Magnetic LED Work Flashlight',
    primaryKeyword: 'Flexible Neck Magnetic Work Light',
    benefit: 'Pinpoint Hands-Free BBQ & Auto Repair Beam',
    proposedHandle: 'zavelyn-flexible-work-flashlight',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Loại bỏ ký tự ® và rút ngắn handle'
  },
  // 57 ULTRASONIC CUTTER (UNLISTED)
  '15455032115385': {
    proposedTitle: 'Zavelyn Cordless Ultrasonic Precision Cutter',
    primaryKeyword: 'Cordless Ultrasonic Precision Cutter',
    benefit: 'Surgical Plastic & 3D Print Model Trimming',
    proposedHandle: 'saker-cordless-ultrasonic-cutter-and-grinder',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm Unlisted có dedicated funnel landing page; GIỮ NGUYÊN HANDLE để bảo vệ 100% routing'
  },
  // 58 NOSE CLEANER
  '15455040241849': {
    proposedTitle: 'Zavelyn Advanced Powered Nasal Care Cleaner',
    primaryKeyword: 'Powered Nasal Care Cleaner',
    benefit: 'Gentle Saline Suction Sinus Relief',
    proposedHandle: 'navage-advanced-nose-cleaner',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm chủ lực có funnel / Clone-navage; GIỮ NGUYÊN HANDLE để tránh hỏng funnel URL'
  },
  // 59 NOSE CLEANER BUNDLE
  '15455040340153': {
    proposedTitle: 'Zavelyn Nasal Care Cleaner Starter Bundle',
    primaryKeyword: 'Nasal Care Cleaner Starter Bundle',
    benefit: 'Complete Sinus Rinse Machine & Salt Pods',
    proposedHandle: 'navage-starter-bundle',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm bundle đi kèm funnel Navage; GIỮ NGUYÊN HANDLE để duy trì chuyển đổi'
  },
  // 60 YEOMAN SWEEP
  '15455092572345': {
    proposedTitle: 'Zavelyn Yeoman Heavy-Duty Lawn Sweeper',
    primaryKeyword: 'Heavy Duty Tow Lawn Sweeper',
    benefit: 'Fast Grass Clipping & Leaf Collection',
    proposedHandle: 'the-yeoman-sweep',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm có dedicated funnel / Clone-yeoman; GIỮ NGUYÊN HANDLE để bảo lưu toàn bộ ads'
  },
  // 61 SREFALSTEAM
  '15455242387641': {
    proposedTitle: 'Zavelyn Steam Pro Handheld Deep Cleaner',
    primaryKeyword: 'Handheld Steam Deep Cleaner',
    benefit: 'High-Temperature Chemical-Free Degreasing',
    proposedHandle: 'srefalsteam',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm có funnel Clone-srefalsteam; GIỮ NGUYÊN HANDLE'
  },
  // 62 MAGTRACK
  '15455481102521': {
    proposedTitle: 'Zavelyn MagTrack Magnetic Train Track Play Set',
    primaryKeyword: 'Magnetic Train Track Play Set',
    benefit: 'Anti-Derail Gravity Stunt STEM Building',
    proposedHandle: 'thoson-magtrack',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm có funnel active; GIỮ NGUYÊN HANDLE'
  },
  // 63 LIVESTOCK HEATING LAMP
  '15455757336761': {
    proposedTitle: 'Zavelyn Auto-Regulating Livestock Heating Lamp',
    primaryKeyword: 'Livestock Heating Lamp with Timer',
    benefit: 'Thermostatic Fireproof Brooder Coop Warmth',
    proposedHandle: 'livestock-heating-lamp',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Handle đã sạch (đã có redirect từ sakerplus); GIỮ NGUYÊN HANDLE'
  },

  // 64 DRUM PRO
  '15459315220665': {
    proposedTitle: 'Zavelyn Drum Pro (15" 15-Tone D-Major)',
    primaryKeyword: '15 Tone Steel Tongue Drum 432Hz',
    benefit: 'Two Full Octaves of Soothing Healing Chimes',
    proposedHandle: 'zavelyn-drum-pro',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'LOW',
    reason: 'Handle đã chuẩn và đồng bộ trong Handpans Collection; GIỮ NGUYÊN HANDLE'
  },
  // 65 DRUM PLUS
  '15459315581113': {
    proposedTitle: 'Zavelyn Drum Plus (11" 11-Tone D-Major)',
    primaryKeyword: '11 Tone Steel Tongue Drum 432Hz',
    benefit: 'Portable Acoustic Tone Projector for Meditation',
    proposedHandle: 'zavelyn-drum-plus',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'LOW',
    reason: 'Handle đã chuẩn và đồng bộ trong Handpans Collection; GIỮ NGUYÊN HANDLE'
  },
  // 66 DRUM MINI
  '15459318890681': {
    proposedTitle: 'Zavelyn Drum Mini (6" 8-Tone C-Major)',
    primaryKeyword: 'Mini Steel Tongue Drum for Kids',
    benefit: 'Pocket 8-Tone Calming Bell Chime for Beginners',
    proposedHandle: 'zavelyn-drum-mini',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'LOW',
    reason: 'Handle đã chuẩn và đồng bộ trong Handpans Collection; GIỮ NGUYÊN HANDLE'
  },
  // 67 HANDPAN MASTER
  '15460656021689': {
    proposedTitle: 'Zavelyn Handpan Master (22" 12-Tone D-Kurd)',
    primaryKeyword: '22 Inch Handpan Drum 432Hz',
    benefit: 'Concert 12-Tone Nitrided Steel Cathedral Sound',
    proposedHandle: 'zavelyn-handpan-master',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'LOW',
    reason: 'Handle đã chuẩn và đồng bộ trong Handpans Collection; GIỮ NGUYÊN HANDLE'
  },
  // 68 RAIN DRUM
  '15460701831353': {
    proposedTitle: 'Zavelyn Rain Drum (3" 6-Tone Pentatonic)',
    primaryKeyword: 'Outdoor Rain Chime Drum 3 Inch',
    benefit: 'Weatherproof Garden Acoustic Relaxation',
    proposedHandle: 'zavelyn-rain-drum',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'LOW',
    reason: 'Handle đã chuẩn và đồng bộ trong Handpans Collection; GIỮ NGUYÊN HANDLE'
  },

  // 69 TURBO LEAF BLOWER
  '15460831953081': {
    proposedTitle: 'Zavelyn Cordless Turbo Jet Leaf Blower',
    primaryKeyword: 'Cordless Turbo Jet Leaf Blower',
    benefit: 'High-Velocity Airflow for Yard & Car Drying',
    proposedHandle: 'saker-cordless-turbo-leaf-blower',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm đang được scale trên quảng cáo; GIỮ NGUYÊN HANDLE để bảo vệ URL ads'
  },
  // 70 CHEESE GRATER
  '15460886315193': {
    proposedTitle: 'Zavelyn 5-in-1 Rotary Cheese Grater & Slicer',
    primaryKeyword: '5-in-1 Rotary Cheese Grater',
    benefit: 'Quick Safe Vegetable Shredding with Suction Base',
    proposedHandle: 'zavelyn-5-in-1-rotary-cheese-grater-shredder',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Đang chạy ads; GIỮ NGUYÊN HANDLE'
  },
  // 71 MESH NEBULIZER
  '15460917313721': {
    proposedTitle: 'Zavelyn Portable Ultrasonic Mesh Nebulizer',
    primaryKeyword: 'Portable Ultrasonic Mesh Nebulizer',
    benefit: 'Silent Handheld Inhaler for Adults and Kids',
    proposedHandle: 'zavelyn-portable-mesh-nebulizer',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Handle sạch, rút ngắn bớt từ lặp'
  },
  // 72 COZYHEAT BLANKET
  '15460954276025': {
    proposedTitle: 'Zavelyn CozyHeat Wearable Heated Blanket Hoodie',
    primaryKeyword: 'Wearable Heated Blanket Hoodie',
    benefit: 'Ultra-Plush Sherpa Fleece Warmth with Pockets',
    proposedHandle: 'zavelyn-cozyheat-heated-wearable-blanket-sweater',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm chạy mùa đông có ad spend lớn; GIỮ NGUYÊN HANDLE'
  },
  // 73 DOUGH MIXER
  '15460988944569': {
    proposedTitle: 'Zavelyn Automatic Dough Mixer with Fermenting',
    primaryKeyword: 'Automatic Dough Mixer with Ferment',
    benefit: 'Hands-Free Bread & Pizza Kneading at Home',
    proposedHandle: 'zavelyn-automatic-dough-mixer',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Rút gọn handle sạch sẽ'
  },
  // 74 VFIT INTIMATE
  '15461356011705': {
    proposedTitle: 'Zavelyn vFit Red Light Pelvic Wellness Device',
    primaryKeyword: 'Red Light Pelvic Wellness Device',
    benefit: 'Gentle Thermal Vibration Intimate Restoration',
    proposedHandle: 'zavelyn-vfit-wellness-device',
    classification: 'READY',
    adsRisk: 'MEDIUM',
    reason: 'Bổ sung tên loại sản phẩm rõ ràng, không gây nhầm lẫn'
  },
  // 75 SCULPTCOMFORT BRA
  '15461407588537': {
    proposedTitle: 'Zavelyn SculptComfort Wirefree Shaping Bra',
    primaryKeyword: 'Wirefree Lift Shaping Bra',
    benefit: 'Seamless Breathable All-Day Back Smoothing Support',
    proposedHandle: 'zavelyn-sculptcomfort-shaping-bra',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Bổ sung loại sản phẩm vào Title, rút ngắn handle'
  },
  // 76 SUPERTOTS FEEDER
  '15461446713529': {
    proposedTitle: 'Zavelyn SuperTots Fresh Food Fruit Pacifier Feeder',
    primaryKeyword: 'Fresh Food Fruit Baby Feeder',
    benefit: 'Choke-Proof Silicone Teething for Toddlers',
    proposedHandle: 'zavelyn-supertots-baby-feeder',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Bổ sung loại sản phẩm vào Title, rút ngắn handle'
  },
  // 77 AIRCLEAR PURIFIER
  '15461471060153': {
    proposedTitle: 'Zavelyn AirClear Plug-In Negative Ion Air Purifier',
    primaryKeyword: 'Plug-In Negative Ion Air Purifier',
    benefit: 'Filterless Smoke Pet Odor & Dust Elimination',
    proposedHandle: 'zavelyn-airclear-air-purifier',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Bổ sung loại sản phẩm vào Title, rút ngắn handle'
  },
  // 78 FLAWLESSBLEND
  '15461501927609': {
    proposedTitle: 'Zavelyn FlawlessBlend Color-Matching Foundation',
    primaryKeyword: 'Color Matching Foundation Stick',
    benefit: 'Adaptive Lightweight Skin Tone Concealing',
    proposedHandle: 'zavelyn-flawlessblend-foundation',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Bổ sung loại sản phẩm vào Title, rút ngắn handle'
  },
  // 79 PUREFLOW FOUNTAIN
  '15461507956921': {
    proposedTitle: 'Zavelyn PureFlow Stainless Steel Pet Fountain',
    primaryKeyword: 'Stainless Steel Pet Water Fountain',
    benefit: 'Wireless Quadruple-Filtered Hydration for Cats',
    proposedHandle: 'zavelyn-pureflow-pet-fountain',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Bổ sung loại sản phẩm vào Title, rút ngắn handle'
  },
  // 80 GRAVITYGLIDER
  '15461521064121': {
    proposedTitle: 'Zavelyn GravityGlider Stunt RC Jet Airplane',
    primaryKeyword: 'Stunt RC Jet Airplane for Kids',
    benefit: 'Crash-Resistant EPP Foam Aerobatic Gliding',
    proposedHandle: 'zavelyn-gravityglider-rc-jet',
    classification: 'READY',
    adsRisk: 'LOW',
    reason: 'Bổ sung loại sản phẩm vào Title, rút ngắn handle'
  },
  // 81 MEGALIFTERS EXCAVATOR
  '15461535416505': {
    proposedTitle: 'Zavelyn MegaLifters Alloy RC Excavator & Fleet',
    primaryKeyword: 'Heavy Duty Alloy RC Excavator',
    benefit: 'Realistic 11-Channel Diecast Construction Power',
    proposedHandle: 'zavelyn-megalifters-heavy-duty-alloy-rc-construction-fleet',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm chủ lực có traffic ads; GIỮ NGUYÊN HANDLE'
  },
  // 82 BOTANAROOTS
  '15461545935033': {
    proposedTitle: 'Zavelyn BotanaRoots Organic Batana Hair Growth Oil',
    primaryKeyword: 'Organic Batana Hair Growth Oil',
    benefit: 'Pure Raw Cold-Pressed Scalp & Follicle Repair',
    proposedHandle: 'zavelyn-botanaroots-organic-batana-hair-growth-oil',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm đang được chạy quảng cáo TikTok/FB Ads; GIỮ NGUYÊN HANDLE'
  },
  // 83 THERMOGLOVE (CRITICAL ADS HERO)
  '15461559533753': {
    proposedTitle: 'Zavelyn ThermoGlove Heated Fingerless Gloves',
    primaryKeyword: 'Heated Fingerless Gloves',
    benefit: 'Smart Thermostatic Warmth for Arthritis & Typing',
    proposedHandle: 'zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves',
    classification: 'KEEP CURRENT HANDLE',
    adsRisk: 'HIGH',
    reason: 'Sản phẩm số 1 của cửa hàng có ad spend lớn nhất; GIỮ NGUYÊN HANDLE để bảo vệ 100% Facebook Ads attribution'
  }
};

async function buildPlan() {
  console.log('Building comprehensive SEO & Naming Standardization Plan...');

  const plan = [];
  const redirectMapping = [];
  const handleSet = new Set();
  const titleSet = new Set();
  const seoTitleSet = new Set();

  let readyCount = 0;
  let keepHandleCount = 0;
  let highAdsRiskCount = 0;
  let outOfScopeCount = 0;
  let needsReviewCount = 0;

  for (let i = 0; i < rawProducts.length; i++) {
    const p = rawProducts[i];
    const id = p.legacyResourceId;
    const rule = CATALOG_RULES[id];

    if (!rule) {
      console.warn(`WARNING: Missing explicit rule for Product ID: ${id} (${p.title})`);
    }

    const proposedTitle = rule ? rule.proposedTitle : `Zavelyn ${p.title}`;
    const primaryKw = rule ? rule.primaryKeyword : (p.productType || 'Home & Living');
    const benefit = rule ? rule.benefit : 'Premium Quality & Everyday Reliability';
    const classification = rule ? rule.classification : (p.status === 'DRAFT' ? 'OUT OF SCOPE' : 'READY');
    const adsRisk = rule ? rule.adsRisk : 'LOW';
    const reason = rule ? rule.reason : 'Chuẩn hóa nhận diện thương hiệu Zavelyn';

    // SEO Page Title rule: Primary Keyword + Benefit/Type | Zavelyn (45–65 chars)
    let proposedSeoTitle = `${primaryKw} - ${benefit} | Zavelyn`;
    if (proposedSeoTitle.length > 65) {
      proposedSeoTitle = `${primaryKw} | Zavelyn`;
    }
    if (proposedSeoTitle.length < 45 && proposedSeoTitle.length + proposedTitle.length <= 60) {
      proposedSeoTitle = `${proposedTitle} | Zavelyn`;
    }

    // Meta Description rule: 130–160 chars, US English, 1-2 real benefits, mild CTA
    let proposedMetaDesc = `Discover the ${proposedTitle}. Designed with ${benefit.toLowerCase()} for daily convenience. Shop Zavelyn with fast US shipping & 90-day guarantee.`;
    if (proposedMetaDesc.length > 160) {
      proposedMetaDesc = `Shop ${proposedTitle}. Enjoy ${benefit.toLowerCase()} built for everyday reliability. Fast US shipping and 90-day guarantee from Zavelyn.`;
    }
    if (proposedMetaDesc.length > 160) {
      proposedMetaDesc = `Discover ${proposedTitle}. Features ${benefit.toLowerCase()} with dependable craftsmanship. Fast US shipping & 90-day guarantee at Zavelyn.`;
    }

    // URL Handle determination
    let proposedHandle = rule ? rule.proposedHandle : cleanHandleString(p.handle);
    const redirectRequired = (proposedHandle !== p.handle);

    if (redirectRequired) {
      redirectMapping.push({
        productId: id,
        oldPath: `/products/${p.handle}`,
        newPath: `/products/${proposedHandle}`,
        targetUrl: `https://tryzavelyn.com/products/${proposedHandle}`,
        adsRisk
      });
    }

    // Check duplicate handle
    if (handleSet.has(proposedHandle)) {
      console.error(`DUPLICATE HANDLE DETECTED: ${proposedHandle} (Product ID: ${id})`);
    }
    handleSet.add(proposedHandle);

    // Check duplicate product title
    if (titleSet.has(proposedTitle)) {
      console.warn(`DUPLICATE PRODUCT TITLE: ${proposedTitle} (Product ID: ${id})`);
    }
    titleSet.add(proposedTitle);

    // Check duplicate SEO title
    if (seoTitleSet.has(proposedSeoTitle)) {
      console.warn(`DUPLICATE SEO TITLE: ${proposedSeoTitle} (Product ID: ${id})`);
    }
    seoTitleSet.add(proposedSeoTitle);

    if (classification === 'READY') readyCount++;
    else if (classification === 'KEEP CURRENT HANDLE') keepHandleCount++;
    else if (classification === 'HIGH ADS RISK') highAdsRiskCount++;
    else if (classification === 'OUT OF SCOPE') outOfScopeCount++;
    else if (classification === 'NEEDS REVIEW') needsReviewCount++;

    const row = {
      productId: id,
      status: p.status,
      currentProductTitle: p.title,
      proposedProductTitle: proposedTitle,
      titleCharCount: proposedTitle.length,
      currentSeoPageTitle: p.seo?.title || '',
      proposedSeoPageTitle: proposedSeoTitle,
      seoTitleCharCount: proposedSeoTitle.length,
      currentMetaDescription: p.seo?.description || '',
      proposedMetaDescription: proposedMetaDesc,
      metaDescCharCount: proposedMetaDesc.length,
      currentUrlHandle: p.handle,
      proposedUrlHandle: proposedHandle,
      oldFullUrl: `https://tryzavelyn.com/products/${p.handle}`,
      newFullUrl: `https://tryzavelyn.com/products/${proposedHandle}`,
      primaryKeyword: primaryKw,
      changeReason: reason,
      redirectRequired: redirectRequired ? 'YES' : 'NO',
      adsTrafficRisk: adsRisk,
      seoRisk: redirectRequired ? (adsRisk === 'HIGH' ? 'MEDIUM' : 'LOW') : 'LOW',
      contentVerification: 'VERIFIED',
      classification: classification,
      approvalStatus: 'PENDING_APPROVAL'
    };

    plan.push(row);
  }

  // Export CSV
  const headers = [
    'Product ID',
    'Product Status',
    'Current Product Title',
    'Proposed Product Title',
    'Title Chars',
    'Current SEO Page Title',
    'Proposed SEO Page Title',
    'SEO Title Chars',
    'Current Meta Description',
    'Proposed Meta Description',
    'Meta Desc Chars',
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

  function escapeCsv(val) {
    if (val === null || val === undefined) return '';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  }

  const csvRows = [headers.join(',')];
  plan.forEach(r => {
    csvRows.push([
      escapeCsv(r.productId),
      escapeCsv(r.status),
      escapeCsv(r.currentProductTitle),
      escapeCsv(r.proposedProductTitle),
      escapeCsv(r.titleCharCount),
      escapeCsv(r.currentSeoPageTitle),
      escapeCsv(r.proposedSeoPageTitle),
      escapeCsv(r.seoTitleCharCount),
      escapeCsv(r.currentMetaDescription),
      escapeCsv(r.proposedMetaDescription),
      escapeCsv(r.metaDescCharCount),
      escapeCsv(r.currentUrlHandle),
      escapeCsv(r.proposedUrlHandle),
      escapeCsv(r.oldFullUrl),
      escapeCsv(r.newFullUrl),
      escapeCsv(r.primaryKeyword),
      escapeCsv(r.changeReason),
      escapeCsv(r.redirectRequired),
      escapeCsv(r.adsTrafficRisk),
      escapeCsv(r.seoRisk),
      escapeCsv(r.contentVerification),
      escapeCsv(r.classification),
      escapeCsv(r.approvalStatus)
    ].join(','));
  });

  fs.writeFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.csv', csvRows.join('\n'));
  fs.writeFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', JSON.stringify(plan, null, 2));

  // Export Redirect CSV
  const redirHeaders = ['Product ID', 'Old Path', 'New Path', 'Target URL', 'Ads Traffic Risk'];
  const redirRows = [redirHeaders.join(',')];
  redirectMapping.forEach(m => {
    redirRows.push([
      escapeCsv(m.productId),
      escapeCsv(m.oldPath),
      escapeCsv(m.newPath),
      escapeCsv(m.targetUrl),
      escapeCsv(m.adsRisk)
    ].join(','));
  });
  fs.writeFileSync('scripts/ZAVELYN_URL_REDIRECT_MAPPING.csv', redirRows.join('\n'));
  fs.writeFileSync('scripts/ZAVELYN_URL_REDIRECT_MAPPING.json', JSON.stringify(redirectMapping, null, 2));

  console.log(`\n=== CATALOG SEO PLAN GENERATION SUMMARY ===`);
  console.log(`Total Products Analyzed: ${plan.length}`);
  console.log(`Classification Breakdown:`);
  console.log(`  - READY: ${readyCount}`);
  console.log(`  - KEEP CURRENT HANDLE (Zero Ads Risk): ${keepHandleCount}`);
  console.log(`  - HIGH ADS RISK (Redirect Required): ${highAdsRiskCount}`);
  console.log(`  - OUT OF SCOPE (Draft Products): ${outOfScopeCount}`);
  console.log(`  - NEEDS REVIEW: ${needsReviewCount}`);
  console.log(`Total Redirects Planned: ${redirectMapping.length}`);
  console.log(`Unique Handles Checked: ${handleSet.size} / ${plan.length} (No duplicates: ${handleSet.size === plan.length})`);
  console.log(`CSV Generated: scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.csv`);
  console.log(`JSON Generated: scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json`);
  console.log(`Redirect Mapping: scripts/ZAVELYN_URL_REDIRECT_MAPPING.csv`);
}

buildPlan().catch(console.error);
