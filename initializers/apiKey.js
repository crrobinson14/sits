module.exports = {
    initialize: (api, next) => {
        api.actions.addMiddleware({
            name: 'API Key Checker',
            global: true,
            preProcessor: (data, next) => {
                let actionTemplate = api.actions.actions[data.action][data.params.apiVersion],
                    sitsOptions = actionTemplate.sitsOptions || {},
                    keyIsValid = data.params.apiKey === api.config.general.secretApiKey;

                next((!sitsOptions.checkApiKey || keyIsValid)
                    ? undefined
                    : new Error('Missing required API key.'));
            }
        });

        next();
    }
};
