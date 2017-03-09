const requireAPIKey = {
    name: 'requireAPIKey',
    preProcessor: (data, next) => {
        next(data.params.apiKey === api.config.general.secretApiKey
            ? undefined
            : new Error('Missing required API key.'));
    }
};

module.exports = {
    initialize: (api, next) => {
        api.actions.addMiddleware(requireAPIKey);
        next();
    }
};
