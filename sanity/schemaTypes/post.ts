export default {
    name: 'post',
    title: 'Blog Post',
    type: 'document' as const,
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: { required: () => unknown }) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule: { required: () => unknown }) => Rule.required(),
        },
        {
            name: 'excerpt',
            title: 'Excerpt (Meta Description)',
            type: 'text',
            rows: 3,
            description: 'Used for SEO meta description. Keep under 155 characters.',
        },
        {
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true },
            fields: [
                {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    description: 'Describe the image for SEO and accessibility',
                },
            ],
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
                { type: 'block' },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        { name: 'alt', title: 'Alt Text', type: 'string' },
                        { name: 'caption', title: 'Caption', type: 'string' },
                    ],
                },
            ],
        },
        {
            name: 'author',
            title: 'Author',
            type: 'string',
            initialValue: 'Trip to Bangladesh',
        },
        {
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Travel Guide', value: 'travel-guide' },
                    { title: 'Destination', value: 'destination' },
                    { title: 'Tips & Advice', value: 'tips-advice' },
                    { title: 'Culture', value: 'culture' },
                    { title: 'Wildlife', value: 'wildlife' },
                    { title: 'Food', value: 'food' },
                ],
            },
        },
        {
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        },
        {
            name: 'featured',
            title: 'Featured Post',
            type: 'boolean',
            initialValue: false,
            description: 'Featured posts appear at the top of the blog page',
        },
        {
            name: 'readTime',
            title: 'Read Time (minutes)',
            type: 'number',
            description: 'Estimated read time in minutes',
        },
        {
            name: 'seoTitle',
            title: 'SEO Title',
            type: 'string',
            description: 'Leave blank to use post title. Max 60 characters.',
        },
    ],
    preview: {
        select: {
            title: 'title',
            media: 'coverImage',
            subtitle: 'publishedAt',
        },
    },
    orderings: [
        {
            title: 'Published Date, New',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' as const }],
        },
    ],
};
