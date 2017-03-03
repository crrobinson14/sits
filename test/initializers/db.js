const testData = require('../testData.json');

describe('Data Storage', () => {
    const clearData = () => api.models.Variant.truncate();

    before(clearData);
    after(clearData);

    it('Can save a Variant record', () => api.models.Variant.create(testData.variant));

    it('Can retrieve a Variant record', () => api.models.Variant.findAll({
        where: { name: testData.variant.name }
    }).then(variants => {
        expect(variants.length).to.equal(1);
        expect(variants[0].name).to.equal(testData.variant.name);
        expect(variants[0].transforms.length).to.equal(testData.variant.transforms.length);
    }));
});
