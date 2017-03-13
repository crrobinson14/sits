exports.action = {
    name: 'getImage',
    description: 'Get an individual image, either from the cache or processed with the specified variant.',
    blockedConnectionTypes: ['websocket'],
    inputs: {
        url: { required: true },
        variantId: { required: true },
    },
    run: function(api, data, next) {
        let connection = data.connection,
            server = api.servers.servers[connection.type];

        api.store.get(data.params.url, data.params.variantId).then(path => {
            connection.params.file = path;
            server.processFile(connection);
            // NOTE: No next() callback is needed here because processFile destroys the connection.

        }).catch(e => {
            // This is the primary end-developer endpoint so we're a little more friendly here with errors
            api.log(['Error processing `%s` variant `%s`', data.params.url, data.params.variantId], 'error', e);
            connection.error = 'Error processing request.';
            next(connection, true);

        });
    }
};
