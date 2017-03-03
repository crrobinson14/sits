const path = require('path'),
    testData = require('../testData.json');

describe('Image Processing', () => {
    before(() =>
        api.models.Variant.truncate().then(() =>
            api.models.Variant.create(testData.variant)));

    it('Properly hashes URL:variant combinations', done => {
        let hash = api.image.hashUrl(testData.url, testData.variant.id);
        expect(hash).to.equal(testData.hash);
        done();
    });

    it('Properly calculates asset paths', done => {
        let path = api.image.assetPath(api.image.hashUrl(testData.url, testData.variant.id));
        expect(path).to.equal(require('path').join(api.config.image.storage, testData.path));
        done();
    });

    it('Can download and transform files', () => {
        let outputPath = path.join(api.config.image.storage, testData.path);
        return api.image.downloadAndProcess(testData.url, testData.variant.id, outputPath).then(res => {
            // console.log(res);
        })
    });

    // it('Is able to retrieve and convert a placeholder image', done => {
    //     api.image.convert('https://placeholdit.imgix.net/~text?txtsize=20&txt=TEST&w=100&h=100&fm=png',
    // })
});
