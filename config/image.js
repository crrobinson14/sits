module.exports.default = {
    image: () => ({
        // We don't actually need a strong secret here, the crypto is just to avoid collisions
        hashKey: 'onomatopoeia',
        storage: __dirname + '/../public/images',
        expiration: 86400 * 2,
        requestOptions: {
            timeout: 2000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
            },
        },
    })
};
