const testUrl = 'https://placeholdit.imgix.net/~text?txtsize=20&txt=TEST&w=100&h=100&fm=png',
    testHash = 'f4d3238a2d67624358e02d9c24e77aad5b9ddf2d34b895fd39e2b50a73ed5cc0',
    testPath = 'f/f4d3238a2d67624358e02d9c24e77aad5b9ddf2d34b895fd39e2b50a73ed5cc0.jpg';

describe('Image Processing', () => {
    it('Properly hashes URL:variant combinations', done => {
        let hash = api.image.hashUrl(testUrl, 'testvariant');
        expect(hash).to.equal(testHash);
        done();
    });

    it('Properly calculates asset paths', done => {
        let path = api.image.assetPath(api.image.hashUrl(testUrl, 'testvariant'));
        expect(path).to.equal(require('path').join(api.config.image.storage, testPath));
        done();
    });

    // it('Is able to retrieve and convert a placeholder image', done => {
    //     api.image.convert('https://placeholdit.imgix.net/~text?txtsize=20&txt=TEST&w=100&h=100&fm=png',
    // })
});
