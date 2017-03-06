exports.action = {
    name: 'deleteVariant',
    description: 'Delete a thumbnail variant.',
    sitsOptions: { checkApiKey: true },
    inputs: {
        id: { required: true },
    },
    run: (api, data, next) => {
        api.db.getVariant(data.params.id)
            .then(variant => {
                if (!variant) {
                    throw new Error('Invalid variant');
                }

                return variant.destroy();
            })
            .then(next)
            .catch(e => next(e));
    }
};
