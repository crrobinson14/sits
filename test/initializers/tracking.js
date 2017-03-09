describe('Initializer: Tracking', () => {
    before(() => api.db.models.Variant.truncate().then(() => Promise.all([
        api.db.models.Variant.create({ id: 'A' }),
        api.db.models.Variant.create({ id: 'B' }),
        api.tracking.getAll(true),
    ])));

    it('Can record a usage of a variant', () => api.tracking.track('A'));

    it('Can get usage stats', () => Promise.all([
        api.tracking.track('A'),
        api.tracking.track('B'),
    ]).then(() => api.tracking.getAll(false).then(res => {
        expect(res.get('A')).to.equal(2);
        expect(res.get('B')).to.equal(1);
    })));

    it('Can clear usage stats', () => api.tracking.getAll(true).then(() => {
            return api.tracking.getAll(false).then(res => {
                expect(res.get('A')).to.equal(0);
                expect(res.get('B')).to.equal(0);
            })
        }
    ));
});
