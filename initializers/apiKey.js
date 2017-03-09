const processAPIKey = (data, next) => {
    next(data.params.apiKey === api.config.general.secretApiKey
        ? undefined
        : new Error('Missing required API key.'));
};

module.exports = {
    initialize: (api, next) => {
        if (api.config.general.secretApiKey === 'CHANGEME') {
            api.log('You must change config.api.secretApiKey before using this in production!', 'error');
        }

        api.actions.addMiddleware({
            name: 'requireAPIKey',
            preProcessor: processAPIKey
        });

        next();
    }
};
