const Sequelize = require('sequelize');

class DB {
    constructor(api) {
        this.api = api;

        this.sequelize = new Sequelize(null, null, null, api.config.db);
    }
}

module.exports = {
    loadPriority: 1000,
    startPriority: 1000,
    stopPriority: 1000,

    initialize: function(api, next) {
        api.db = new DB();
        next();
    }
};


exports.sqlite = function(api, next) {
    var sqlize = new Sequelize(null, null, null, api.config.sqlite);

    api.sqlite = {};

    api.sqlite._start = function(api, next) {

        api.models = {
            Meat: sqlize.import(__dirname + '/../models/Meat.js')
        };

        sqlize
            .sync()
            .then(syncSuccess, syncError);

        function syncSuccess() {
            api.log('Succesfully synced DB!');
            next();
        }

        function syncError(ex) {
            api.log('Error while executing DB sync: ' + ex.message, 'error');
            process.exit();
        }
    };

    api.sqlite._stop = function(api, next) {
        next();
    };

    next();
}