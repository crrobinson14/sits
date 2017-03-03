// NOTE: The way we're syncing our models will wipe out the saved data every run!
// SQLite in this mode is not server-based anyway. This demo isn't about "how to
// use SQLite in ActionHero". We're just using SQLite here to support the rest of
// the demo.

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

// We only need one model for now
const VariantModel = (db) => db.define('variant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    tastes_like: DataTypes.STRING,
    is_tasty: DataTypes.BOOLEAN
});

class DB {
    constructor(api) {
        this.api = api;
        this.sequelize = new Sequelize(null, null, null, api.config.db);

        api.models = {
            Variant: VariantModel(this.sequelize),
        };
    }

    init() {
        return this.sequelize.sync({ force: true });
    }
}

module.exports = {
    initialize: function(api, next) {
        api.db = new DB(api);

        api.db.init()
            .then(() => next())
            .catch(next);
    }
};
