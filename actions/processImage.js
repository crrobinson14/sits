exports.action = {
    name: 'processImage',
    description: 'Process and store an image using all specified variants. May overwrite existing files.',
    blockedConnectionTypes: ['websocket'],
    middleware: ['requireAPIKey'],
    inputs: {
        url: {
            required: true,
        },
        variantIds: {
            required: true,
            validator: (p, conn, tmpl) => (Array.isArray(p) && p.length > 0) || 'must be non-empty array',
        },
    },
    run: function(api, data, next) {
        Promise.all(data.params.variantIds.map(variantId => api.image.convert(data.params.url, variantId)))
            .then(() => next())
            .catch(e => next(e));
    }
};
