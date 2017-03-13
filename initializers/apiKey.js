module.exports = {
    initialize: (api, next) => {
        // Allow actions to require an API key to access them
        api.actions.addMiddleware({
            name: 'requireAPIKey',
            preProcessor: (data, next) => data.params.apiKey === api.config.general.secretApiKey
                ? next(undefined)
                : next(new Error('Missing required API key.'))

        });

        // Make sure we have changed the default secret key!
        if (process.env.NODE_ENV !== 'development' &&
            api.config.general.secretApiKey === 'CHANGEME') {
            api.log('You must change config.api.secretApiKey before using this in production!', 'error');
        }

        next();
    }
};
