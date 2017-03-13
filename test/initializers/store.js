const path = require('path'),
    testData = require('../testData.json');

describe('Initializer: Store', () => {
    before(() =>
        api.db.models.Variant.truncate().then(() =>
            api.db.models.Variant.create(testData.variant)));

    it('Properly calculates asset paths', done => {
        let path = api.store.assetPath(testData.url, testData.variant.id);
        expect(path).to.equal(require('path').join(api.config.store.storage, testData.path));
        done();
    });
});
