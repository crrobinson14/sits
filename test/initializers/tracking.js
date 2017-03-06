describe('Initializer: Tracking', () => {
    it('Can record a usage of a variant', () => api.tracking.track('A'));

    it('Can get usage stats', () => Promise.all([
        api.tracking.track('A'),
        api.tracking.track('B'),
    ]).then(() => api.tracking.get().then(res => {
        expect(res.get('A')).to.equal(2); // we haven't cleared the first test
        expect(res.get('B')).to.equal(1);
    })));

    it('Can clear usage stats', () => api.tracking.clear().then(() => {
        return api.tracking.get().then(res => {
            expect(res).to.be.an('object');
            expect(res).to.be.empty();
        })
    }));
});
