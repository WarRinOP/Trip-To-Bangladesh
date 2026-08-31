import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Escape user-supplied text before interpolating it into an HTML string.
// React escapes automatically; hand-built HTML (e.g. email templates) does not.
export function escapeHtml(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const COUNTRY_FLAGS: Record<string, string> = {
    'united kingdom': '🇬🇧',
    'uk': '🇬🇧',
    'usa': '🇺🇸',
    'united states': '🇺🇸',
    'us': '🇺🇸',
    'germany': '🇩🇪',
    'france': '🇫🇷',
    'netherlands': '🇳🇱',
    'australia': '🇦🇺',
    'canada': '🇨🇦',
    'italy': '🇮🇹',
    'switzerland': '🇨🇭',
    'ireland': '🇮🇪',
    'china': '🇨🇳',
    'japan': '🇯🇵',
    'sweden': '🇸🇪',
    'norway': '🇳🇴',
    'spain': '🇪🇸',
    'belgium': '🇧🇪',
    'austria': '🇦🇹',
    'denmark': '🇩🇰',
    'finland': '🇫🇮',
    'new zealand': '🇳🇿',
    'singapore': '🇸🇬',
    'india': '🇮🇳',
    'bangladesh': '🇧🇩',
};

export function getCountryFlag(country: string | null | undefined): string {
    if (!country) return '🌍';
    return COUNTRY_FLAGS[country.toLowerCase().trim()] ?? '🌍';
}
