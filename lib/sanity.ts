import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

// Only create real client when a valid projectId is provided
// (a-z, 0-9, dashes only). During dev without Sanity configured,
// all fetch calls are wrapped in try/catch and return empty data.
const isValidProjectId = /^[a-z0-9-]+$/.test(PROJECT_ID);

export const config = {
    projectId: isValidProjectId ? PROJECT_ID : 'placeholder',
    dataset: DATASET,
    apiVersion: '2024-03-11',
    useCdn: false,
};

// Create client only when valid — otherwise provide a no-op stub
export const sanityClient = isValidProjectId
    ? createClient(config)
    : {
        fetch: async () => null,
    } as unknown as ReturnType<typeof createClient>;

const builder = isValidProjectId
    ? imageUrlBuilder(createClient(config))
    : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
    if (!builder) {
        // Return a stub with the same chain interface used in templates
        const stub = { url: () => '', width: () => stub, height: () => stub, auto: () => stub };
        return stub;
    }
    return builder.image(source);
}
