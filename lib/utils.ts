import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
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
