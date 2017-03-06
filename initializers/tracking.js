const Promise = require('bluebird'),
    prefix = 'variantusage:';

class Tracking {
    constructor(api) {
        this.api = api;
        this.redis = Promise.promisifyAll(api.redis.clients.client);
    }

    // Record a call to a variant
    track(variantId) {
        return this.redis.incrAsync(prefix + variantId);
    }

    getStat(variantId, clear) {
        let call = clear
            ? this.redis.getsetAsync(api.config.tracking.variantPrefix + variantId, 0)
            : this.redis.getAsync(api.config.tracking.variantPrefix + variantId);

        return call.then(result => ([variantId, +result]));
    }

    // Get all variant stats, optionally clearing them as well
    getAll(clear) {
        return Promise
            .map(this.api.db.getVariantIds(), variantId => this.getStat(variantId, clear))
            .reduce((result, entry) => result.set(...entry), new Map());
    }
}

module.exports = {
    initialize: function(api, next) {
        api.tracking = new Tracking(api);
        next();
    }
};
