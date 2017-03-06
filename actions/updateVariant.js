exports.action = {
    name: 'updateVariant',
    description: 'Update a thumbnail variant.',
    sitsOptions: { checkApiKey: true },
    inputs: {
        id: { required: true },
        transforms: { required: true },
    },
    run: (api, data, next) => {
        api.db.getVariant(data.params.id)
            .then(variant => {
                if (!variant) {
                    throw new Error('Invalid variant');
                }

                return variant.update({ transforms: data.params.transforms });
            })
            .then(next)
            .catch(e => api.db.reportActionError(next, e));
    }
};
