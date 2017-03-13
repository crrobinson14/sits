module.exports.default = {
    routes: () => ({
        get: [
            { path: '/image/:variantId/:url', action: 'getImage' },
            { path: '/statistics', action: 'getStatistics' },
            { path: '/variants', action: 'getVariants' },
            { path: '/variants/:variantId', action: 'getVariant' },
        ],

        post: [
            { path: '/variants', action: 'createVariant' },
            { path: '/image', action: 'processImage' },
        ],

        put: [
            { path: '/variants/:variantId', action: 'updateVariant' },
        ],

        delete: [
            { path: '/variants/:id', action: 'deleteVariant' },
        ],
    }),
};
