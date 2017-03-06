exports.action = {
    name: 'getStatistics',
    description: 'Get the saved usage statistics.',
    sitsOptions: { checkApiKey: true },
    inputs: {
        clear: { required: false },
    },
    run: function(api, data, next) {
        let error = null;

        api.redis.clients.client.get(notificationKey, (err, value) => {

        });
        api.redis.clients.client.set(notificationKey, 'shown', 'EX', 2 * 86400);

        next(error);
    }
};
