const Promise = require('bluebird'),
    crypto = require('crypto'),
    fs = Promise.promisifyAll(require('fs')),
    path = require('path');

class Store {
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

    // See if we already have the asset, and if so, return it. Otherwise, get-and-go!
    get(url, variantId) {
        let assetPath = this.assetPath(url, variantId);

        return fs.accessAsync(assetPath, fs.constants.R_OK)
            .then(() => assetPath)
            .catch(() => this.api.image.downloadVariant(url, variantId, assetPath));
    }
}

module.exports = {
    initialize: (api, next) => {
        api.store = new Store(api, next);
    }
};
