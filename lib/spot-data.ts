// Polaroid spot data — 4 cards per destination, always clustered around map center
// Coordinates are computed as small offsets from each destination's pin center,
// so they always scatter into the visible viewport after flyTo regardless of destination.

export interface SpotMarker {
  id: string;
  destinationSlug: string;
  name: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  rotation: number;              // fixed rotation -3 to +3 degrees
}

// Deterministic rotation seeded from id string so it never re-randomizes
function rotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffff;
  }
  return ((hash % 7) - 3);
}

// Viewport scatter offsets in degrees [lng, lat]
// At zoom 11.5, ~0.03° ≈ visible screen area — keeps all 4 cards near center
const SCATTER: [number, number][] = [
  [-0.022,  0.015],  // upper-left
  [ 0.024,  0.013],  // upper-right
  [-0.013, -0.021],  // lower-left
  [ 0.020, -0.018],  // lower-right
];

function makeSpots(
  slug: string,
  centerLng: number,
  centerLat: number,
  spots: Array<{ id: string; name: string; description: string }>
): SpotMarker[] {
  return spots.map((s, i) => ({
    id: s.id,
    destinationSlug: slug,
    name: s.name,
    description: s.description,
    coordinates: [
      centerLng + SCATTER[i][0],
      centerLat + SCATTER[i][1],
    ],
    rotation: rotation(s.id),
  }));
}

export const SPOT_MARKERS: Record<string, SpotMarker[]> = {

  dhaka: makeSpots('dhaka', 90.4125, 23.8103, [
    { id: 'dhaka-old',     name: 'Old Dhaka',      description: 'Ancient Mughal architecture and vibrant street life' },
    { id: 'dhaka-lalbagh', name: 'Lalbagh Fort',   description: '17th century Mughal fort with ornate gardens' },
    { id: 'dhaka-ahsan',   name: 'Ahsan Manzil',   description: 'The Pink Palace — iconic riverside heritage mansion' },
    { id: 'dhaka-hatir',   name: 'Hatirjheel',     description: 'Stunning lakeside promenade with evening reflections' },
  ]),

  sundarbans: makeSpots('sundarbans', 89.1833, 21.9497, [
    { id: 'sun-tiger',  name: 'Tiger Reserve', description: 'Home to the Royal Bengal Tiger in dense mangroves' },
    { id: 'sun-kotka',  name: 'Kotka Beach',   description: 'Pristine beach where forest meets the Bay of Bengal' },
    { id: 'sun-hiron',  name: 'Hiron Point',   description: 'Lighthouse point with breathtaking sunset panoramas' },
    { id: 'sun-dublar', name: 'Dublar Char',   description: 'Remote island famous for annual Hindu pilgrimages' },
  ]),

  'coxs-bazar': makeSpots('coxs-bazar', 91.9769, 21.4272, [
    { id: 'cox-main',     name: 'Main Beach',         description: "World's longest natural sea beach — 120km unbroken" },
    { id: 'cox-inani',    name: 'Inani Beach',        description: 'Coral stone beach with crystal clear turquoise waters' },
    { id: 'cox-himchari', name: 'Himchari',           description: 'Waterfall cascading directly onto the sandy beach' },
    { id: 'cox-mahesh',   name: 'Maheshkhali Island', description: 'Sacred island with ancient Adinath temple on hilltop' },
  ]),

  'hill-tracts': makeSpots('hill-tracts', 92.2058, 22.6352, [
    { id: 'hill-kaptai',  name: 'Kaptai Lake',    description: 'Largest artificial lake in Bangladesh with misty hills' },
    { id: 'hill-sajek',   name: 'Sajek Valley',   description: 'Cloud-touching valley with tribal villages and sunsets' },
    { id: 'hill-nilgiri', name: 'Nilgiri',         description: 'Hilltop resort above the clouds at 2200ft elevation' },
    { id: 'hill-bridge',  name: 'Hanging Bridge',  description: 'Swaying suspension bridge deep in the tribal forest' },
  ]),

  'village-life': makeSpots('village-life', 90.3535, 22.7010, [
    { id: 'vil-launch', name: 'Launch Ghat',     description: 'Iconic rocket steamers departing at dawn on the river' },
    { id: 'vil-market', name: 'Floating Market', description: 'Vendors sell produce from boats on the canal network' },
    { id: 'vil-rice',   name: 'Rice Fields',     description: 'Endless emerald paddies reflecting the monsoon sky' },
    { id: 'vil-canal',  name: 'Canal Routes',    description: 'Narrow waterways threading through ancient villages' },
  ]),

  'coastal-bangladesh': makeSpots('coastal-bangladesh', 90.1181, 21.8311, [
    { id: 'coast-kuakata', name: 'Kuakata Beach',   description: 'Rare beach where both sunrise and sunset are visible' },
    { id: 'coast-fatrar',  name: 'Fatrar Char',     description: 'Uninhabited mangrove island accessible only by boat' },
    { id: 'coast-temple',  name: 'Buddhist Temple', description: 'Ancient Rakhaine Buddhist temple with golden statues' },
    { id: 'coast-sunrise', name: 'Sunrise Point',   description: "Best vantage point for Kuakata's legendary sunrise" },
  ]),
};
