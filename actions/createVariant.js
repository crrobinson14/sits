exports.action = {
    name: 'createVariant',
    description: 'Create a thumbnail variant.',
    sitsOptions: { checkApiKey: true },
    inputs: {
        id: { required: true },
        transforms: { required: true },
    },
    run: (api, data, next) => {
        api.models.Variant.create({
            id: data.params.id,
            transforms: data.params.transforms,
        }).then(result => {
            data.response.variant = result.get({ plain: true });
            next();

        }).catch(e => next(e));
    }
};
