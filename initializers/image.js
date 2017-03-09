const Promise = require('bluebird'),
    request = require('request'),
    crypto = require('crypto'),
    gm = require('gm'),
    fs = Promise.promisifyAll(require('fs')),
    path = require('path');

class Image {
    constructor(api, next) {
        this.api = api;

        // Simple hashing structure for images
        Promise.mapSeries(['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'], (subdir) => {
            return fs.mkdirAsync(path.join(api.config.image.storage, subdir), 0o755).catch(e => {
                if (e && e.code !== 'EEXIST') {
                    throw e;
                }

                return true;
            });
        }).then(() => next()).catch(next);
    }

    // Calculate the final resting place for a source:variant combination
    assetPath(url, variantId) {
        let hash = crypto
            .createHmac('sha256', this.api.config.image.hashKey)
            .update(variantId + ':' + url)
            .digest('hex');

        return path.join(this.api.config.image.storage, hash.substring(0, 1), hash + '.jpg');
    }

    // Track a variant's usage, and return its metadata
    getAndTrackVariant(variantId) {
        return this.api.tracking.track(variantId).then(() => this.api.db.models.Variant.findById(variantId));
    }

    // Download and transform an image
    downloadAndProcess(url, variantId, outPath) {
        return this.getAndTrackVariant(variantId).then(variant => new Promise((resolve, reject) => {
            let gmRequest = gm(request(url, this.api.config.image.requestOptions)),
                transforms = variant.transforms.split(' ');

            while (transforms.length >= 2) {
                gmRequest.out(transforms.shift(), transforms.shift());
            }

            gmRequest.write(outPath, err => err ? reject(err) : resolve(outPath));
        }));
    }

    // Thumbnail an image
    convert(url, variantId) {
        let assetPath = this.assetPath(url, variantId);

        return fs.accessAsync(assetPath, fs.constants.R_OK)
            .then(() => assetPath)
            .catch(() => this.downloadAndProcess(url, variantId, assetPath));
    }
}

module.exports = {
    initialize: (api, next) => {
        api.image = new Image(api, next);
    }
};
