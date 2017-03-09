exports.action = {
    name: 'getVariant',
    description: 'Get a single variant.',
    middleware: ['requireAPIKey'],
    inputs: {
        variantId: { required: true },
    },
    run: (api, data, next) => {
        api.db.getVariant(data.params.variantId).then(variant => {
            if (!variant) {
                throw new Error('Invalid variant');
            }

            data.response.variant = variant.get({ plain: true });
            next();

        }).catch(next);
    }
};
