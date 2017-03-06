exports.action = {
    name: 'deleteVariant',
    description: 'Delete a thumbnail variant.',
    sitsOptions: { checkApiKey: true },
    inputs: {
        id: { required: true },
    },
    run: (api, data, next) => {
        api.log('Deleting variant ' + data.params.id, 'info');
        api.db.getVariant(data.params.id).then(variant => {
            if (!variant) {
                throw new Error('Invalid variant');
            }

            return variant.destroy();

        }).then(() => {
            data.response.status = 'OK';
            next();

        }).catch(e => api.db.reportActionError(next, e));
    }
};
