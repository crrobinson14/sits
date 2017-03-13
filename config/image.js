module.exports.default = {
    image: () => ({
        requestOptions: {
            timeout: 2000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
            },
        },
    })
};
