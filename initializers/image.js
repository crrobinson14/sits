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

    // Combine a URL:Variant combination into a hash for filename storage
    hashUrl(url, variantId) {
        return crypto
            .createHmac('sha256', this.api.config.image.hashKey)
            .update(variantId + ':' + url)
            .digest('hex');
    }

    // Get the filesystem storage path for a given hash object
    //noinspection JSMethodCanBeStatic
    assetPath(hash) {
        return path.join(this.api.config.image.storage, hash.substring(0, 1), hash + '.jpg');
    }

    // Make sure a variant is valid, track a hit against it, and return its data
    getAndTrackVariant(variantId) {
        return this.api.tracking.track(variantId).then(() => this.api.db.getVariant(variantId));
    }

    // Download a remote image, and convert it to a stored output file
    downloadAndProcess(url, variantId, outPath) {
        return this.getAndTrackVariant(variantId).then(variant => new Promise((resolve, reject) => {
            let gmRequest = gm(request(url, this.api.config.image.requestOptions)),
                transforms = variant.transforms.split(' ');

            // GM expects us to call .out() with (option, value) pairs.
            while (transforms.length >= 2) {
                let option = transforms.shift();
                let value = transforms.shift();
                gmRequest.out(option, value);
            }

            // Produce the final output file
            gmRequest.write(outPath, err => err ? reject(err) : resolve(outPath));
        }));
    }

    // Convert a URL to a variant. If already downloaded, returns stored asset.
    // If not yet downloaded, calls `downloadAndProcess` to do so.
    convert(url, variantId) {
        let hash = this.hashUrl(url, variantId),
            path = this.assetPath(hash);

        return accessAsync(path, fs.constants.R_OK)
            .then(() => path)
            .catch(() => this.downloadAndProcess(url, variantId, path));
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
