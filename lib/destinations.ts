// Centralized destination data — used by map, weather API, and destination pages

export interface Destination {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  duration: string;
  priceFrom: string;
  highlights: string[];
  image: string;
}

export const DESTINATIONS: Destination[] = [
  {
    slug: 'sundarbans',
    name: 'Sundarbans',
    tagline: 'The World\'s Largest Mangrove Forest',
    description: 'Journey into a UNESCO World Heritage site where 300+ Royal Bengal Tigers roam ancient waterways and towering mangroves.',
    coordinates: [89.1833, 21.9497],
    duration: '3–5 Days',
    priceFrom: '$280',
    highlights: ['Tiger tracking', 'Boat safari', 'Bird watching', 'Forest camping'],
    image: '/images/sundarbans.jpg',
  },
  {
    slug: 'coxs-bazar',
    name: "Cox's Bazar",
    tagline: 'The World\'s Longest Natural Sea Beach',
    description: '125km of unbroken shoreline where golden sands meet the Bay of Bengal in one of nature\'s most spectacular displays.',
    coordinates: [91.9769, 21.4272],
    duration: '2–4 Days',
    priceFrom: '$180',
    highlights: ['Sunrise walks', 'Fishing villages', 'Inani Beach', 'Himchori Falls'],
    image: '/images/coxs-bazar.jpg',
  },
  {
    slug: 'dhaka',
    name: 'Dhaka',
    tagline: 'A City of Contrasts and Living History',
    description: 'Old Dhaka\'s Mughal grandeur meets modern energy in rickshaw-filled lanes, ancient mosques, and vibrant markets.',
    coordinates: [90.4125, 23.8103],
    duration: '2–3 Days',
    priceFrom: '$150',
    highlights: ['Lalbagh Fort', 'Old Dhaka rickshaw tour', 'Sadarghat riverfront', 'Muslin weaving'],
    image: '/images/dhaka.jpg',
  },
  {
    slug: 'village-life',
    name: 'Village Life',
    tagline: 'Authentic Bangladesh Beyond the Cities',
    description: 'Experience the soul of Bangladesh — riverside villages, golden paddy fields, boat journeys, and warm community hospitality.',
    coordinates: [90.3535, 22.7010],
    duration: '3–5 Days',
    priceFrom: '$200',
    highlights: ['Homestays', 'Boat journeys', 'Paddy harvesting', 'Traditional cooking'],
    image: '/images/village-life.jpg',
  },
  {
    slug: 'hill-tracts',
    name: 'Hill Tracts',
    tagline: 'Misty Mountains and Indigenous Cultures',
    description: 'Rangamati\'s emerald lakes and forested hills are home to 13 indigenous communities living in harmony with ancient traditions.',
    coordinates: [92.2058, 22.6352],
    duration: '4–6 Days',
    priceFrom: '$320',
    highlights: ['Kaptai Lake boat', 'Indigenous village stays', 'Hill trekking', 'Tribal markets'],
    image: '/images/hill-tracts.jpg',
  },
  {
    slug: 'coastal-bangladesh',
    name: 'Coastal Bangladesh',
    tagline: 'Where the Land Meets the Bay of Bengal',
    description: 'Kuakata\'s unspoilt coastline offers both sunrise and sunset over the same beach — a rare natural wonder known to few.',
    coordinates: [90.1181, 21.8311],
    duration: '2–3 Days',
    priceFrom: '$160',
    highlights: ['Kuakata shoreline', 'Fishing community', 'Buddhist temples', 'Mangrove walks'],
    image: '/images/coastal-bangladesh.jpg',
  },
];

// Travel order for route line animation (logical journey)
export const ROUTE_ORDER: string[] = [
  'dhaka',
  'sundarbans',
  'coastal-bangladesh',
  'coxs-bazar',
  'hill-tracts',
  'village-life',
];
