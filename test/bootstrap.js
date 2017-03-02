const ActionHero = require('actionhero'),
    chai = require('chai'),
    dirtyChai = require('dirty-chai');

let running = true,
    actionhero = new ActionHero();

chai.use(dirtyChai);

global.bootstrap = {
    init: done => {
        actionhero.start((err, api) => {
            if (err) {
                throw err;
            }

            running = true;
            global.api = api;
            global.expect = chai.expect;

            done();
        });
    },

    teardown: done => {
        if (running) {
            actionhero.stop(() => {
                delete global.api;
                delete global.expect;
            });
        }

        done();
    }
};
