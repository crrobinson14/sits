exports.action = {
    name: 'getVariant',
    description: 'Get a single variant.',
    sitsOptions: { checkApiKey: true },
    inputs: {
        id: { required: true },
    },
    run: (api, data, next) => {
        api.log('Getting variant ' + data.params.id, 'info');
        api.db.getVariant(data.params.id).then(variant => {
            if (!variant) {
                throw new Error('Invalid variant');
            }

            data.response.variant = variant.get({ plain: true });
            next();

        }).catch(e => api.db.reportActionError(next, e));
    }
};
