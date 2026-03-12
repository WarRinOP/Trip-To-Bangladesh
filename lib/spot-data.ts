// Polaroid spot data — 4 key locations per destination (24 total)
// Rotation is pre-computed deterministically so it never re-randomizes

export interface SpotMarker {
  id: string;
  destinationSlug: string;
  name: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  rotation: number;              // fixed rotation -3 to +3 degrees
}

// Deterministic rotation: -3 to +3 based on string hash
function rotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffff;
  }
  return ((hash % 7) - 3);
}

function spot(
  id: string,
  destinationSlug: string,
  name: string,
  description: string,
  lng: number,
  lat: number
): SpotMarker {
  return { id, destinationSlug, name, description, coordinates: [lng, lat], rotation: rotation(id) };
}

export const SPOT_MARKERS: Record<string, SpotMarker[]> = {

  dhaka: [
    spot('dhaka-old',     'dhaka', 'Old Dhaka',      'Ancient Mughal architecture and vibrant street life',          90.4074, 23.7104),
    spot('dhaka-lalbagh', 'dhaka', 'Lalbagh Fort',   '17th century Mughal fort with ornate gardens',                 90.3894, 23.7187),
    spot('dhaka-ahsan',   'dhaka', 'Ahsan Manzil',   'The Pink Palace — iconic riverside heritage mansion',          90.4055, 23.7059),
    spot('dhaka-hatir',   'dhaka', 'Hatirjheel',     'Stunning lakeside promenade with evening reflections',          90.4264, 23.7507),
  ],

  sundarbans: [
    spot('sun-tiger',  'sundarbans', 'Tiger Reserve', 'Home to the Royal Bengal Tiger in dense mangroves',            89.1833, 21.9497),
    spot('sun-kotka',  'sundarbans', 'Kotka Beach',   'Pristine beach where forest meets the Bay of Bengal',          89.6500, 21.7667),
    spot('sun-hiron',  'sundarbans', 'Hiron Point',   'Lighthouse point with breathtaking sunset panoramas',          89.4167, 21.8000),
    spot('sun-dublar', 'sundarbans', 'Dublar Char',   'Remote island famous for annual Hindu pilgrimages',            89.7833, 21.5667),
  ],

  'coxs-bazar': [
    spot('cox-main',    'coxs-bazar', 'Main Beach',         "World's longest natural sea beach — 120km unbroken",     91.9769, 21.4272),
    spot('cox-inani',   'coxs-bazar', 'Inani Beach',        'Coral stone beach with crystal clear turquoise waters',  92.0264, 21.2831),
    spot('cox-himchari','coxs-bazar', 'Himchari',           'Waterfall cascading directly onto the sandy beach',      91.9606, 21.3578),
    spot('cox-mahesh',  'coxs-bazar', 'Maheshkhali Island', 'Sacred island with ancient Adinath temple on hilltop',  91.8833, 21.6333),
  ],

  'hill-tracts': [
    spot('hill-kaptai',   'hill-tracts', 'Kaptai Lake',      'Largest artificial lake in Bangladesh with misty hills', 92.2167, 22.5000),
    spot('hill-sajek',    'hill-tracts', 'Sajek Valley',     'Cloud-touching valley with tribal villages and sunsets', 92.2931, 23.3817),
    spot('hill-nilgiri',  'hill-tracts', 'Nilgiri',          'Hilltop resort above the clouds at 2200ft elevation',    92.3167, 21.8833),
    spot('hill-bridge',   'hill-tracts', 'Hanging Bridge',   'Swaying suspension bridge deep in the tribal forest',    92.2058, 22.6352),
  ],

  'village-life': [
    spot('vil-launch',  'village-life', 'Launch Ghat',     'Iconic rocket steamers departing at dawn on the river',  90.3535, 22.7010),
    spot('vil-market',  'village-life', 'Floating Market', 'Vendors sell produce from boats on the canal network',    90.3200, 22.6500),
    spot('vil-rice',    'village-life', 'Rice Fields',     'Endless emerald paddies reflecting the monsoon sky',      90.3800, 22.7500),
    spot('vil-canal',   'village-life', 'Canal Routes',    'Narrow waterways threading through ancient villages',     90.3100, 22.7200),
  ],

  'coastal-bangladesh': [
    spot('coast-kuakata',  'coastal-bangladesh', 'Kuakata Beach',    'Rare beach where both sunrise and sunset are visible', 90.1181, 21.8311),
    spot('coast-fatrar',   'coastal-bangladesh', 'Fatrar Char',      'Uninhabited mangrove island accessible only by boat',  90.0833, 21.7667),
    spot('coast-temple',   'coastal-bangladesh', 'Buddhist Temple',  'Ancient Rakhaine Buddhist temple with golden statues', 90.1167, 21.8167),
    spot('coast-sunrise',  'coastal-bangladesh', 'Sunrise Point',    "Best vantage point for Kuakata's legendary sunrise",   90.1300, 21.8400),
  ],
};
