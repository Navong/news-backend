module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'News API',
        version: '1.0.0',
        description: 'API for fetching news articles by category',
    },
    servers: [
        {
            url: 'https://news-backend.navong.cloud'
        }
    ],
    paths: {
        '/api/news/{category}': {
            get: {
                summary: 'Fetch articles by category',
                description:
                    'Available categories: "technology", "science", "health", "sports", "business", "entertainment".',
                parameters: [
                    {
                        in: 'path',
                        name: 'category',
                        schema: {
                            type: 'string',
                        },
                        required: true,
                        description: 'The category of articles to fetch.',
                        enum: ['technology', 'health', 'sports', 'business'],
                    },
                ],
                responses: {
                    200: {
                        description: 'Successfully fetched articles.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        articles: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'string' },
                                                    title: { type: 'string' },
                                                    category: { type: 'string' },
                                                    publishedAt: { type: 'string', format: 'date-time' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: { description: 'Category is required.' },
                    404: { description: 'No articles found for the specified category.' },
                    500: { description: 'Failed to fetch news articles.' },
                },
            },
        },
    },
};
