'use client';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
    name: 'trip-to-bangladesh',
    title: 'Trip to Bangladesh',
    projectId: 'zj7x6cld',
    dataset: 'production',
    plugins: [
        structureTool(),
    ],
    schema: {
        types: schemaTypes,
    },
    basePath: '/studio',
});
