import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const config = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dummy_project_id',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-03-11',
    useCdn: false,
};

export const sanityClient = createClient(config);

const builder = imageUrlBuilder(sanityClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
    return builder.image(source);
}
