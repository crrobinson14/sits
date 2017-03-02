module.exports.default = {
    routes: () => ({
        get: [
            { path: '/statistics', action: 'getStatistics' },
            { path: '/variants', action: 'getVariants' },
            { path: '/variants/:variantId', action: 'getVariant' },
        ],

        post: [
            { path: '/variants', action: 'createVariant' },
        ],

        put: [
            { path: '/variants/:variantId', action: 'updateVariant' },
        ],

        delete: [
            { path: '/statistics', action: 'deleteStatistics' },
            { path: '/variants/:id', action: 'deleteVariant' },
        ],
    }),
};
