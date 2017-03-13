module.exports.default = {
    store: () => ({
        // We don't actually need a strong secret here, the crypto is just to avoid collisions
        hashKey: 'onomatopoeia',
        storage: __dirname + '/../public/images',
        expiration: 86400 * 2,
    })
};
