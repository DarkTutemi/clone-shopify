import fs from 'fs';

const raw = JSON.parse(fs.readFileSync('scripts/products_list.json', 'utf-8'));

// Helper mapping function for each product
function cleanTitle(p) {
  const t = p.title;

  // Specific high-profile DTC hero products (exact match or pattern)
  const dtcMap = {
    'Zavelyn ThermoGlove™ Smart Thermostatic Heated Fingerless Winter Gloves': 'Zavelyn ThermoGlove',
    'Zavelyn BotanaRoots™ 100% Organic Honduran Batana Hair Growth & Scalp Revitalizing Oil': 'Zavelyn BotanaRoots',
    'Zavelyn MegaLifters™ Heavy-Duty Alloy Remote Control Construction Fleet': 'Zavelyn MegaLifters',
    'Zavelyn GravityGlider™ Indestructible Stunt RC Jet Aircraft': 'Zavelyn GravityGlider',
    'Zavelyn PureFlow™ Ultra-Quiet Wireless Stainless Steel Pet Water Fountain': 'Zavelyn PureFlow',
    'Zavelyn FlawlessBlend™ Self-Adjusting Color-Changing Foundation Stick': 'Zavelyn FlawlessBlend',
    'Zavelyn AirClear™ Plug-In Negative Ion Air Purifier & Odor Eliminator': 'Zavelyn AirClear',
    'Zavelyn SuperTots™ Fresh Food & Fruit Feeder Pacifier': 'Zavelyn SuperTots',
    'Zavelyn SculptComfort™ Wire-Free Breast Shapewear Bra': 'Zavelyn SculptComfort',
    'Zavelyn vFit™ Red Light Intimate Wellness & Pelvic Rejuvenation Device': 'Zavelyn vFit',
    'Zavelyn CozyHeat™ USB Heated Wearable Blanket Sweater': 'Zavelyn CozyHeat',
    'Zavelyn Drum™ Pro (15-Tone Steel Tongue Handpan Drum)': 'Zavelyn Drum Pro',
    'Zavelyn Drum™ Plus (11-Tone Steel Tongue Handpan Drum)': 'Zavelyn Drum Plus',
    'Zavelyn Drum™ Mini (8-Tone Steel Tongue Handpan Drum)': 'Zavelyn Drum Mini',
    'Zavelyn Handpan™ Master (12-Tone 432Hz D-Minor Kurd)': 'Zavelyn Handpan Master',
    'Zavelyn Rain Drum™ (3-Inch 6-Tone Outdoor Pocket Drum)': 'Zavelyn Rain Drum',
    'Zavelyn® 2.0 | Portable Ultrasonic Mesh Nebulizer': 'Zavelyn Mesh Nebulizer',
    'Zavelyn Miracle Balm™ | Plantar Fasciitis Relief': 'Zavelyn Miracle Balm',
    'Zavelyn Starter Bundle: Nose Cleaner and 30 SaltPod Capsules': 'Zavelyn Nose Cleaner Starter Bundle',
    'Zavelyn V1 Device + Bonuses': 'Zavelyn V1 Device',
    'Zavelyn Foot Sleeve (BOGO Free Unit)': 'Zavelyn Foot Sleeve',
    'Zavelyn 40kHz Cordless Ultrasonic Precision Cutter Kit': 'Zavelyn Ultrasonic Precision Cutter',
    'Zavelyn 5-in-1 Rotary Cheese Grater & Shredder': 'Zavelyn 5-in-1 Rotary Cheese Grater',
    'Zavelyn Automatic Dough Mixer With Ferment Function': 'Zavelyn Automatic Dough Mixer',
    'Zavelyn Cordless Electric Garden Tiller Cultivator – Clearance': 'Zavelyn Cordless Garden Tiller',
    'Zavelyn Powerful UV Bed Vacuum Cleaner-Clearance Sale': 'Zavelyn UV Bed Vacuum Cleaner',
    'Zavelyn 1500W Flame Effect Oscillating Space Heater': 'Zavelyn Flame Effect Space Heater',
    'Zavelyn Portable Welding Machine-Clearance': 'Zavelyn Portable Welding Machine',
    'Zavelyn Titanium Alloy Multifunction Pocket Pry Bar': 'Zavelyn Titanium Pocket Pry Bar',
    'Zavelyn Steam Disinfection Cleaner-Clearance': 'Zavelyn Steam Disinfection Cleaner',
    'Zavelyn Squishy Egg Multicolor Tap Night Light': 'Zavelyn Squishy Egg Night Light',
    'Zavelyn Bathroom Exhaust Fan With LED Light': 'Zavelyn Bathroom Exhaust Fan',
    'Zavelyn Solar Street Lights-Clearance Sale': 'Zavelyn Solar Street Lights',
    'Zavelyn Toyota RAV4 LED USB Charging Hub': 'Zavelyn RAV4 USB Charging Hub',
    'Zavelyn Camping Fan with Light & Battery-Clearance Sale': 'Zavelyn Camping Fan with Light',
    'Zavelyn Portable Home Sauna Steam Generator': 'Zavelyn Home Sauna Generator',
    'Zavelyn Laser Guided Electric Wall Chaser': 'Zavelyn Electric Wall Chaser',
    'Zavelyn Universal Diesel Injector Removal Kit Clearance Sale': 'Zavelyn Diesel Injector Removal Kit',
    'Zavelyn Kids Indoor Outdoor Basketball Hoop Set': 'Zavelyn Kids Basketball Hoop Set',
    'Zavelyn Three-Tier Clamp-On Desk Shelf Organizer': 'Zavelyn Clamp-On Desk Shelf',
    'Zavelyn High Precision Infrared Thermal Imaging Camera': 'Zavelyn Thermal Imaging Camera',
    'Zavelyn Cordless Handheld UV Mattress Vacuum Cleaner': 'Zavelyn UV Mattress Vacuum',
    'Zavelyn Tactical MOLLE Utility Vest': 'Zavelyn Tactical MOLLE Vest',
    'Zavelyn Cordless Hydraulic Pipe Crimping Tool Kit': 'Zavelyn Hydraulic Pipe Crimper Kit',
    'Zavelyn Smart Thermometer Hygrometer Clock': 'Zavelyn Smart Hygrometer Clock',
    'Zavelyn Dimmable Half Moon LED Lash Lamp': 'Zavelyn Half Moon LED Lash Lamp',
    'Zavelyn 3-in-1 Gypsum Board Cutting Tool': 'Zavelyn 3-in-1 Gypsum Board Cutter',
    'Zavelyn Rotating Galaxy Projector With Adjustable Focus': 'Zavelyn Rotating Galaxy Projector',
    'Zavelyn Rechargeable Retractable LED Fill Light Stick': 'Zavelyn Retractable LED Fill Light',
    'Zavelyn Portable Digital Mini Heat Press Machine': 'Zavelyn Mini Heat Press Machine',
    'Zavelyn Battery Powered Automatic Chicken Coop Door': 'Zavelyn Automatic Chicken Coop Door',
    'Zavelyn Portable Infrared Sauna Blanket For Home': 'Zavelyn Infrared Sauna Blanket',
    'Zavelyn 360° App-Controlled Magnetic Work Light': 'Zavelyn 360° Magnetic Work Light',
    'Zavelyn 50FT Industrial LED Construction String Lights': 'Zavelyn 50FT LED String Lights',
    'Zavelyn Hydraulic Battery Cable Lug Crimping Tool': 'Zavelyn Cable Lug Crimper',
    'Zavelyn Panoramic Dash Camera With Night Vision': 'Zavelyn Panoramic Dash Camera',
    'Zavelyn Low Profile Downspout Catch Basin': 'Zavelyn Downspout Catch Basin',
    'Zavelyn Stainless Steel Wheel Alignment Kit': 'Zavelyn Wheel Alignment Kit',
    'Zavelyn Adjustable Red Light Therapy Panel': 'Zavelyn Red Light Therapy Panel',
    'Zavelyn Electronic Rotating Goose Target Game': 'Zavelyn Rotating Goose Target Game',
    'Zavelyn Self-Leveling Laser Level With Tripod': 'Zavelyn Self-Leveling Laser Level',
    'Zavelyn Kids Metal Detector With LCD Display': 'Zavelyn Kids Metal Detector',
    'Zavelyn Adjustable Workbench Tail Vise Clamp': 'Zavelyn Workbench Tail Vise Clamp',
    'Zavelyn Cordless Heated Knee Massage Device': 'Zavelyn Heated Knee Massager',
    'Zavelyn Outdoor Solar Motion Sensor Security Light': 'Zavelyn Solar Motion Security Light',
    'Zavelyn 5-in-1 Magnetic Wireless Charging Station': 'Zavelyn 5-in-1 Magnetic Charging Station',
    'Zavelyn Rolling Nut And Ball Picker': 'Zavelyn Rolling Nut & Ball Picker',
    'Zavelyn Ultra Fine Cooking Oil Spray Bottle': 'Zavelyn Oil Spray Bottle',
    'Zavelyn Livestock Massage Grooming Scratch Brush': 'Zavelyn Livestock Grooming Scratch Brush',
    'Zavelyn Outdoor Flexible-Neck Work Flashlight': 'Zavelyn Flexible-Neck Work Flashlight',
    'Zavelyn TPU Sensory Textured Floor Mats': 'Zavelyn Sensory Floor Mats',
    'Zavelyn Tearable Non-Slip Drawer Liner': 'Zavelyn Non-Slip Drawer Liner',
    'Zavelyn Tearable Shelf Liner And Drawer Liner': 'Zavelyn Shelf & Drawer Liner'
  };

  if (dtcMap[t]) return dtcMap[t];

  // Algorithmic cleanup fallback for anything else
  let cleaned = t;
  // Remove Clearance Sale, -Clearance, etc.
  cleaned = cleaned.replace(/[-–\s]*(Clearance\s*Sale|Clearance)$/i, '');
  // Remove ™, ®, ©
  cleaned = cleaned.replace(/[™®©]/g, '');
  // Remove parenthesis with descriptions like (15-Tone Steel Tongue Handpan Drum)
  cleaned = cleaned.replace(/\s*\([^)]*\)/g, '');
  // Remove double spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

  return cleaned;
}

const plan = raw.map(p => ({
  id: p.id,
  handle: p.handle,
  oldTitle: p.title,
  newTitle: cleanTitle(p),
  changed: p.title !== cleanTitle(p)
}));

fs.writeFileSync('scripts/title_change_plan.json', JSON.stringify(plan, null, 2));

console.log('Total products:', plan.length);
console.log('Products to change:', plan.filter(p => p.changed).length);
console.log('Unchanged products:', plan.filter(p => !p.changed).length);

console.log('\n--- SAMPLE CHANGES ---');
plan.filter(p => p.changed).slice(0, 20).forEach(p => {
  console.log(`"${p.oldTitle}"\n  -> "${p.newTitle}"\n`);
});
