const testData = require('../testData.json');

describe('Action: getVariant', () => {
    const clearData = () => api.db.models.Variant.truncate();

    before(clearData);
    after(clearData);

    it('Requires an API key', done => {
        api.specHelper.runAction('getVariant', response => {
            expect(response.error).to.equal('Error: Missing required API key.');
            done();
        });
    });

    it('Requires an ID', done => {
        let params = { apiKey: api.config.general.secretApiKey, transforms: 'x' };
        api.specHelper.runAction('getVariant', params, response => {
            expect(response.error).to.equal('Error: variantId is a required parameter for this action');
            done();
        });
    });

    it('Tolerates/reports requests to delete non-existent variants', done => {
        let params = Object.assign({}, { variantId: testData.variant.id }, { apiKey: api.config.general.secretApiKey });
        api.specHelper.runAction('getVariant', params, response => {
            expect(response.error).to.equal('Error: Invalid variant');
            done();
        });
    });

    it('Can get a variant', done => {
        let uparams = Object.assign({}, testData.variant, { apiKey: api.config.general.secretApiKey });
        api.specHelper.runAction('createVariant', uparams, response => {
            let gparams = Object.assign({}, { variantId: testData.variant.id }, { apiKey: api.config.general.secretApiKey });
            api.specHelper.runAction('getVariant', gparams, response => {
                expect(response.variant.id).to.equal(testData.variant.id);
                expect(response.variant.transforms).to.equal(testData.variant.transforms);
                expect(response.variant.createdAt).to.not.be.undefined();
                expect(response.variant.updatedAt).to.not.be.undefined();
                done();
            });
        });
    });
});
