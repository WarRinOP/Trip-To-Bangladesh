// Zod schemas, types, and constants for the AI Itinerary Generator

import { z } from 'zod';

// ─── Destination Options ────────────────────────────────
export const DESTINATION_OPTIONS = [
  { value: 'sundarbans', label: 'Sundarbans' },
  { value: 'coxs-bazar', label: "Cox's Bazar" },
  { value: 'dhaka', label: 'Dhaka' },
  { value: 'village-life', label: 'Village Life' },
  { value: 'hill-tracts', label: 'Hill Tracts' },
  { value: 'coastal-bangladesh', label: 'Coastal Bangladesh' },
  { value: 'surprise-me', label: 'Surprise Me (AI Decides)' },
] as const;

export const DESTINATION_SLUGS = DESTINATION_OPTIONS.map((d) => d.value);

// ─── Budget Options ─────────────────────────────────────
export const BUDGET_OPTIONS = [
  { value: 'budget', label: 'Budget', range: '$50–100/day' },
  { value: 'midrange', label: 'Mid-range', range: '$100–200/day' },
  { value: 'premium', label: 'Premium', range: '$200–400/day' },
  { value: 'luxury', label: 'Luxury', range: '$400+/day' },
] as const;

// ─── Group Type Options ─────────────────────────────────
export const GROUP_TYPE_OPTIONS = [
  { value: 'solo', label: 'Solo Traveler' },
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family with Children' },
  { value: 'small_group', label: 'Small Group (3–6)' },
  { value: 'large_group', label: 'Large Group (7+)' },
] as const;

// ─── Request Validation Schema ──────────────────────────
export const itineraryRequestSchema = z.object({
  duration: z.coerce.number().int().min(1).max(30),
  budget: z.enum(['budget', 'midrange', 'premium', 'luxury']),
  groupType: z.enum(['solo', 'couple', 'family', 'small_group', 'large_group']),
  destinations: z
    .array(z.enum(['sundarbans', 'coxs-bazar', 'dhaka', 'village-life', 'hill-tracts', 'coastal-bangladesh', 'surprise-me']))
    .min(1, 'Select at least one destination'),
});

export type ItineraryRequest = z.infer<typeof itineraryRequestSchema>;

// ─── Response Types (from Claude output) ────────────────
export interface TourRecommendation {
  slug: string | null;
  reason: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation: string;
  estimatedCost: number;
  tourRecommendation: TourRecommendation | null;
}

export interface ItineraryResponse {
  title: string;
  summary: string;
  bestTimeToVisit: string;
  totalEstimatedCost: number;
  packingSuggestions: string[];
  days: ItineraryDay[];
}

// ─── Bangladesh Facts (loading state) ───────────────────
export const BANGLADESH_FACTS = [
  'Bangladesh has the world\'s largest river delta',
  'The Sundarbans is home to 300+ Royal Bengal Tigers',
  'Cox\'s Bazar is the world\'s longest natural sea beach',
  'Bangladesh has 700+ rivers flowing through it',
  'Dhaka is one of the world\'s most densely populated cities',
];
