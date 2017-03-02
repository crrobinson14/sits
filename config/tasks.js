module.exports.default = {
    tasks: () => ({
        scheduler: false,
        queues: ['*'],
        timeout: 5000,
        minTaskProcessors: 0,
        maxTaskProcessors: 0,
        checkTimeout: 500,
    })
};
