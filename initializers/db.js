const Sequelize = require('sequelize');

class DB {
    constructor(api, next) {
        this.api = api;

        // Hello database!
        this.sequelize = new Sequelize(null, null, null, api.config.db);

        // Can haz variants?
        this.models = {
            Variant: this.sequelize.define('variant', {
                id: {
                    type: Sequelize.DataTypes.STRING,
                    primaryKey: true
                },
                transforms: Sequelize.DataTypes.STRING,
            })
        };

        // kthxbai!
        this.sequelize.sync({ force: true })
            .then(() => next())
            .catch(next);
    }

    // Get all current entry IDs.
    getVariantIds() {
        return this.models.Variant.findAll({ attributes: ['id'] })
            .then(entries => entries.map(entry => entry.id));
    }

    // Track a variant's usage, and also return its metadata
    getAndTrackVariant(variantId) {
        return this.api.tracking.track(variantId)
            .then(() => this.models.Variant.findById(variantId));
    }
}

module.exports = {
    initialize: (api, next) => {
        api.db = new DB(api, next);
    }
};
