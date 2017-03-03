const Sequelize = require('sequelize');

class DB {
    constructor(api, next) {
        this.api = api;

        let db = this.sequelize = new Sequelize(null, null, null, api.config.db);
        const DataTypes = db.Sequelize.DataTypes;

        api.models = {
            Variant: db.define('variant', {
                id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
                name: DataTypes.STRING,
                tastes_like: DataTypes.STRING,
                is_tasty: DataTypes.BOOLEAN
            }),
        };

        this.sequelize
            .sync({ force: true })
            .then(() => next())
            .catch(next);
    }
}

module.exports = {
    initialize: function(api, next) {
        api.db = new DB(api, next);
    }
};
