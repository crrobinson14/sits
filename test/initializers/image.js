describe('Image Processing', () => {
    // const clearData = () => api.models.Variant.truncate();

    // before(clearData);
    // after(clearData);

    it('Properly hashes URL:variant combinations', (done) => {
        let hash = api.image.hashUrl('http://a.b.com/path/to/1.jpg', 'testvariant');
        expect(hash).to.equal('ce8aded3ea4591337b6867004c959f3796aa2d974cd350c15dd3081e4875b31b');
        done();
    });
});
