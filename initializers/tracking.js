const bluebird = require('bluebird'),
    prefix = 'tracking:';

// Convert a pair of ['tracking:A', tracking:'B', ...] , [1, 2, ...] arrays
// to {A:1, B:2, ...}
const arraysToStatsMap = (keys, values) => new Map(
    keys.map((key, index) => [
        key.replace(prefix, ''), // 'tracking:A' => 'A'
        +values[index]           // '1' => 1
    ])
);

class Tracking {
    constructor(api) {
        this.api = api;
        this.redis = bluebird.promisifyAll(this.api.redis.clients.client);
    }

    // Helper to get all current entries
    allEntries() {
        return this.redis.keysAsync(prefix + '*');
    }

    // Record a call to a variant
    track(variant) {
        return this.redis.incrAsync(prefix + variant);
    }

    // Clear all variant stats
    clear() {
        return this.allEntries().then(keys => this.redis.delAsync(keys));
    }

    // Get all variant stats
    get() {
        return this.allEntries().then(keys => {
            return (keys && keys.length > 0)
                ? this.redis.mgetAsync(keys).then(values => arraysToStatsMap(keys, values))
                : {};
        });
    }
}

module.exports = {
    initialize: function(api, next) {
        api.tracking = new Tracking(api);
        next();
    }
};
