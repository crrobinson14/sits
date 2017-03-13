const path = require('path'),
    testData = require('../testData.json');

describe('Initializer: Image', () => {
    before(() =>
        api.db.models.Variant.truncate().then(() =>
            api.db.models.Variant.create(testData.variant)));

    it('Can download and transform files', () => {
        let outputPath = path.join(api.config.image.storage, testData.path);
        return api.image.downloadVariant(testData.url, testData.variant.id, outputPath);
    });
});
