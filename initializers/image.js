const Promise = require('bluebird'),
    request = require('request'),
    crypto = require('crypto'),
    gm = require('gm'),
    fs = require('fs'),
    path = require('path'),
    mkdirAsync = Promise.promisify(fs.mkdir),
    accessAsync = Promise.promisify(fs.access),
    hexArray = ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

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

    //noinspection JSMethodCanBeStatic
    assetPath(hash) {
        return path.join(api.config.image.storage, hash.substring(0, 1), hash + '.jpg');
    }

    downloadAndProcess(url, variant, outPath) {
        return this.api.tracking.track(variant).then(() => new Promise((resolve, reject) => {
            let r = request(url, api.config.image.requestOptions);
            gm(r)
                .out('-resize', '300x200')
                .write(outPath, err => {
                    err ? reject(err) : resolve(outPath)
                });
        }));
    }

    convert(url, variant) {
        let hash = this.hashUrl(url, variant),
            path = this.assetPath(hash);

        return accessAsync(path, fs.constants.R_OK)
            .then(() => path)
            .catch(() => this.downloadAndProcess(url, variant, path));
    }
}

module.exports = {
    initialize: function(api, next) {
        api.image = new Image(api);

        // Simple hashing structure for images
        Promise.mapSeries(hexArray, (subdir) => {
            return mkdirAsync(path.join(api.config.image.storage, subdir), 0o755).catch(e => {
                if (e && e.code !== 'EEXIST') {
                    throw e;
                }

                return true;
            });
        }).then(() => next()).catch(next);
    }
};
