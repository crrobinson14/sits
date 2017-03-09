const Sequelize = require('sequelize');

// We only need one model for now
const VariantModel = (db) => db.define('variant', {
    id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true
    },
    transforms: {
        type: Sequelize.DataTypes.STRING
    },
});

class DB {
    constructor(api) {
        this.api = api;
        this.sequelize = new Sequelize(null, null, null, api.config.db);

        this.models = api.models = {
            Variant: VariantModel(this.sequelize),
        };

        api.db.sequelize.sync({ force: true })
            .then(() => next())
            .catch(next);
    }

    // Get all current entry IDs.
    getVariantIds() {
        return this.models.Variant.findAll({ attributes: ['id'] })
            .then(entries => entries.map(entry => entry.id));
    }

    // Get a variant's record by its ID
    getVariant(id) {
        return this.models.Variant.findById(id);
    }

    // Helper to clean up error reporting in actions
    reportActionError(next, e) {
        let sqlError = (e.errors || [])[0] || { message: '-' };

        // We log the full error, but only give the caller a summary
        this.api.log('Database error', 'error', e);
        next(new Error('Database error: ' + e.message + ' (' + sqlError.message + ')'));
    }
}

module.exports = {
    initialize: function(api, next) {
        api.db = new DB(api);
        next();
    }
};
