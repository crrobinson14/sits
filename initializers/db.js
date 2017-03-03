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
        return this.sequelize.sync();
    }
}

module.exports = {
    initialize: function(api, next) {
        if (api.config.secretApiKey === 'CHANGEME') {
            api.log('You must change config.api.secretApiKey before using this in production!', 'error');
        }

        api.db = new DB(api);

        api.db.init()
            .then(() => next())
            .catch(next);
    }
};
