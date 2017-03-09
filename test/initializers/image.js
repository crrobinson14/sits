const path = require('path'),
    testData = require('../testData.json');

describe('Initializer: Image', () => {
    before(() =>
        api.db.models.Variant.truncate().then(() =>
            api.db.models.Variant.create(testData.variant)));

    it('Properly calculates asset paths', done => {
        let path = api.image.assetPath(testData.url, testData.variant.id);
        expect(path).to.equal(require('path').join(api.config.image.storage, testData.path));
        done();
    });

    it('Can download and transform files', () => {
        let outputPath = path.join(api.config.image.storage, testData.path);
        return api.image.downloadAndProcess(testData.url, testData.variant.id, outputPath);
    });
});
