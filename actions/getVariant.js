exports.action = {
    name: 'getVariant',
    description: 'Get a single variant.',
    sitsOptions: { checkApiKey: true },
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

        }).catch(e => api.db.reportActionError(next, e));
    }
};
