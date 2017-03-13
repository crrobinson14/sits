const Promise = require('bluebird'),
    request = require('request'),
    gm = require('gm');

class Image {
    constructor(api, next) {
        this.api = api;
        next();
    }

    // Download and transform an image, saving the result in an output path
    downloadVariant(url, variantId, assetPath) {
        return this.api.db.getAndTrackVariant(variantId)
            .then(variant => new Promise((resolve, reject) => {
                let gmRequest = gm(request(url, this.api.config.image.requestOptions)),
                    transforms = variant.transforms.split(' ');

                while (transforms.length >= 2) {
                    gmRequest.out(transforms.shift(), transforms.shift());
                }

                gmRequest.write(assetPath, err => err ? reject(err) : resolve(assetPath));
            }));
    }
}

module.exports = {
    initialize: (api, next) => {
        api.image = new Image(api, next);
    }
};
