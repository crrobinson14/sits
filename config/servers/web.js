module.exports.default = {
    servers: {
        web: () => ({
            enabled: true,
            port: process.env.PORT || 8080,
            bindIP: '0.0.0.0',
            urlPathForActions: 'api',
            queryRouting: true,
            padding: 2,
            metadataOptions: {
                serverInformation: true,
                requesterInformation: true
            },
        })
    }
};
