exports.action = {
    name: 'createVariant',
    description: 'Create a thumbnail variant.',
    sitsOptions: { checkApiKey: true },
    inputs: {
        id: { required: true },
        transforms: { required: true },
    },
    run: (api, data, next) => {
        // NOTE: We do basically no error checking because we expect to only be supporting
        // variant-creation from trusted (internal) sources!!! But this isn't as bad as it
        // looks. The DB will prevent ID conflicts, and node-gm escapes transform args.
        // What we would really want is sanity checking, like ID formats (no spaces, length
        // limits, etc.) and transforms (length, expected format).
        let variant = {
            id: data.params.id,
            transforms: data.params.transforms,
        };

        api.log('Creating variant', 'info', variant);

        api.models.Variant.create(variant).then(result => {
            data.response.status = 'OK';
            data.response.variant = result.get({ plain: true });
            next();

        }).catch(e => {
            // We log the full error, but only give the caller a summary
            api.log('Error creating variant', 'error', e);
            next(new Error('Error creating variant: ' + e.message + ' (' + e.errors[0].message + ')'));
        });
    }
};
