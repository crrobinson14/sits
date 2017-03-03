const gm = require('gm');
const request = require('request');
const crypto = require('crypto');
const fs = require('fs');

class Image {
    constructor(api) {
        this.api = api;
    }

    hashUrl(url, variant) {
        return crypto
            .createHmac('sha256', this.api.config.image.hashKey)
            .update(variant + ':' + url)
            .digest('hex');
    }

    convert(url, variant) {
        gm(request(url))
            .write('/path/to/reformat.png', function(err) {
                if (!err) console.log('done');
            });
    }
}

module.exports = {
    initialize: function(api, next) {
        api.image = new Image(api);
        // console.log(api.image.hashUrl('http://a.b.com/path/to/1.jpg', 'testvariant'));

        fs.mkdir(api.config.image.storage, 0o755, (err, result) => {
            next((err && err.code !== 'EEXIST') ? err : undefined);
        });
    }
};
