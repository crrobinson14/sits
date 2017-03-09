exports.action = {
    name: 'deleteVariant',
    description: 'Delete a thumbnail variant.',
    middleware: ['requireAPIKey'],
    inputs: {
        id: { required: true },
    },
    run: (api, data, next) => {
        api.db.models.Variant.findById(data.params.id)
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
