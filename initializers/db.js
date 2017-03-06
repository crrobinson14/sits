const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

// We only need one model for now
const VariantModel = (db) => db.define('variant', {
    id: { type: DataTypes.STRING, primaryKey: true },
    transforms: { type: DataTypes.STRING },
});

class DB {
    constructor(api) {
        this.api = api;
        this.sequelize = new Sequelize(null, null, null, api.config.db);

        api.models = {
            Variant: VariantModel(this.sequelize),
        };
    }

    // Get a variant's record by its ID
    //noinspection JSMethodCanBeStatic
    getVariant(id) {
        return api.models.Variant.findById(id);
    }

    // Helper to clean up error reporting in actions
    //noinspection JSMethodCanBeStatic
    reportActionError(next, e) {
        let sqlError = (e.errors || [])[0] || { message: '-' };

        // We log the full error, but only give the caller a summary
        api.log('Database error', 'error', e);
        next(new Error('Database error: ' + e.message + ' (' + sqlError.message + ')'));
    }
}

module.exports = {
    initialize: function(api, next) {
        if (api.config.secretApiKey === 'CHANGEME') {
            api.log('You must change config.api.secretApiKey before using this in production!', 'error');
        }

        api.db = new DB(api);

        api.db.sequelize.sync({ force: true })
            .then(() => next())
            .catch(next);
    }
};
