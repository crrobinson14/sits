module.exports = {
    default: {
        tasks: () => ({
            scheduler: true,
            queues: ['*'],
            minTaskProcessors: 1,
            maxTaskProcessors: 1,
        })
    },

    test: {
        tasks: () => ({ scheduler: false })
    }
};
