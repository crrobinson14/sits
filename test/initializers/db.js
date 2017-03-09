const testData = require('../testData.json');

describe('Initializer: DB', () => {
    const clearData = () => api.db.models.Variant.truncate();

    before(clearData);
    after(clearData);

    it('Can save a Variant record', () => api.db.models.Variant.create(testData.variant));

    it('Can retrieve a Variant record', () => api.db.getVariant(testData.variant.id).then(variant => {
        expect(variant.id).to.equal(testData.variant.id);
        expect(variant.transforms.length).to.equal(testData.variant.transforms.length);
    }));
});
