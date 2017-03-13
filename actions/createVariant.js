exports.action = {
    name: 'createVariant',
    description: 'Create a thumbnail variant.',
    middleware: ['requireAPIKey'],
    inputs: {
        id: { required: true },
        transforms: { required: true },
    },
    run: (api, data, next) => {
        let record = {
            id: data.params.id,
            transforms: data.params.transforms,
        };

        api.db.models.Variant.create(record)
            .then(result => {
                data.response.variant = result.get({ plain: true });
                next();

            }).catch(e => next(e));
    }
};
