const testData = require('../testData.json');

describe('Action: getVariants', () => {
    const clearData = () => api.models.Variant.truncate();

    before(clearData);
    after(clearData);

    it('Requires an API key', done => {
        api.specHelper.runAction('createVariant', response => {
            expect(response.error).to.equal('Error: Missing required API key.');
            done();
        });
    });

    it('Can get the list of variants', done => {
        let uparams = Object.assign({}, testData.variant, { apiKey: api.config.general.secretApiKey });
        api.specHelper.runAction('createVariant', uparams, response => {
            expect(response.status).to.equal('OK');

            let gparams = Object.assign({}, { id: testData.variant.id }, { apiKey: api.config.general.secretApiKey });
            api.specHelper.runAction('getVariants', gparams, response => {
                expect(response.status).to.equal('OK');
                expect(response.variants.length).to.equal(1);

                expect(response.variants[0].id).to.equal(testData.variant.id);
                expect(response.variants[0].transforms).to.equal(testData.variant.transforms);
                expect(response.variants[0].createdAt).to.not.be.undefined();
                expect(response.variants[0].updatedAt).to.not.be.undefined();
                done();
            });
        });
    });
});
