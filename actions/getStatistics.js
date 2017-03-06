exports.action = {
    name: 'getStatistics',
    description: 'Get the saved usage statistics.',
    sitsOptions: { checkApiKey: true },
    inputs: {
        clear: { required: false },
    },
    run: function(api, data, next) {
        api.tracking.getAll(data.params.clear === true).then(res => {
            data.response.usage = res;
            next();

        }).catch(e => new Error(e.message));
    }
};
