exports.action = {
    name: 'getVariants',
    description: 'Get a list of all variants.',
    middleware: ['requireAPIKey'],
    inputs: {},
    run: (api, data, next) => {
        api.models.Variant.findAll({ order: ['id'] }).then(variants => {
            data.response.variants = (variants || []).map(variant => variant.get({ plain: true }));
            next();

        }).catch(e => api.db.reportActionError(next, e));
    }
};
