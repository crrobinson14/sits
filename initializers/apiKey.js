module.exports = {
    initialize: function(api, next) {
        api.actions.addMiddleware({
            name: 'API Key Checker',
            global: true,
            priority: 1000,
            preProcessor: function(data, next) {
                let actionTemplate = api.actions.actions[data.action][data.params.apiVersion],
                    sitsOptions = actionTemplate.sitsOptions || {};

                // If this flag is not truthy, or we have the key, we're good to go.
                if (!sitsOptions.checkApiKey || data.params.apiKey === api.config.general.secretApiKey) {
                    next();
                } else {
                    next(new Error('Missing required API key.'));
                }
            }
        });

        next();
    }
};
