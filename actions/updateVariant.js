exports.action = {
    name: 'updateVariant',
    description: 'Update a thumbnail variant.',
    middleware: ['requireAPIKey'],
    inputs: {
        id: { required: true },
        transforms: { required: true },
    },
    run: (api, data, next) => {
        api.db.models.Variant.findById(data.params.id)
            .then(variant => {
                if (!variant) {
                    throw new Error('Invalid variant');
                }

                return variant.update({ transforms: data.params.transforms });
            })
            .then(next)
            .catch(next);
    }
};
