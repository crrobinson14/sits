const Sequelize = require('sequelize');

class DB {
    constructor(api, next) {
        this.api = api;

        this.sequelize = new Sequelize(null, null, null, api.config.db);

        this.models = {
            Variant: this.sequelize.define('variant', {
                id: {
                    type: Sequelize.DataTypes.STRING,
                    primaryKey: true
                },
                transforms: Sequelize.DataTypes.STRING,
            })
        };

        this.sequelize.sync({ force: true })
            .then(() => next())
            .catch(next);
    }

    // Get all current entry IDs.
    getVariantIds() {
        return this.models.Variant.findAll({ attributes: ['id'] })
            .then(entries => entries.map(entry => entry.id));
    }
}

module.exports = {
    initialize: (api, next) => {
        api.db = new DB(api, next);
    }
};
