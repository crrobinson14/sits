const path = require('path');

const testData = {
    url: 'https://placeholdit.imgix.net/~text?txtsize=20&txt=TEST&w=100&h=100&fm=png',
    hash: 'f4d3238a2d67624358e02d9c24e77aad5b9ddf2d34b895fd39e2b50a73ed5cc0',
    path: 'f/f4d3238a2d67624358e02d9c24e77aad5b9ddf2d34b895fd39e2b50a73ed5cc0.jpg',
    variant: {
        name: 'testvariant',
        transforms: [
            ['-geometry', '200x200']
        ]
    },
};

describe('Image Processing', () => {
    before(done => {

        console.log('clearing');
        done();
    });

    it('Properly hashes URL:variant combinations', done => {
        let hash = api.image.hashUrl(testData.url, testData.variant.name);
        expect(hash).to.equal(testData.hash);
        done();
    });

    it('Properly calculates asset paths', done => {
        let path = api.image.assetPath(api.image.hashUrl(testData.url, testData.variant.name));
        expect(path).to.equal(require('path').join(api.config.image.storage, testData.path));
        done();
    });

    it('Can download and transform files', () => {
        let outputPath = path.join(api.config.image.storage, testData.path);
        return api.image.downloadAndProcess(testData.url, testData.variant.name, outputPath).then(res => {
            console.log(res);
        })
    });

    // it('Is able to retrieve and convert a placeholder image', done => {
    //     api.image.convert('https://placeholdit.imgix.net/~text?txtsize=20&txt=TEST&w=100&h=100&fm=png',
    // })
});
