describe('Data Storage', () => {
    it('Can save a Variant record', () => api.models.Variant.create({
        name: 'Test Variant'
    }));

    it('Can retrieve a Variant record', () => api.models.Variant.findAll({
        where: {
            name: 'Test Variant'
        }
    }).then(variants => {
        expect(variants.length).to.equal(1);
        expect(variants[0].name).to.equal('Test Variant');
    }));
});
