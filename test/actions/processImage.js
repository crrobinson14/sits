const testData = require('../testData.json');

describe('Action: processImage', () => {
    before(() => api.models.Variant.truncate().then(() => Promise.all([
        api.models.Variant.create(testData.variant),
        api.models.Variant.create(testData.variant2),
        api.tracking.getAll(true),
    ])));

    it('Requires an API key', done => {
        api.specHelper.runAction('processImage', response => {
            expect(response.error).to.equal('Error: Missing required API key.');
            done();
        });
    });

    it('Requires a URL', done => {
        let params = { apiKey: api.config.general.secretApiKey, variantIds: ['1'] };
        api.specHelper.runAction('processImage', params, response => {
            expect(response.error).to.equal('Error: url is a required parameter for this action');
            done();
        });
    });

    it('Requires a variants list', done => {
        let params = { apiKey: api.config.general.secretApiKey, url: 'a', };
        api.specHelper.runAction('processImage', params, response => {
            expect(response.error).to.equal('Error: variantIds is a required parameter for this action');
            done();
        });
    });

    it('Requires an array of variants', done => {
        let params = { apiKey: api.config.general.secretApiKey, url: 'a', variantIds: '1' };
        api.specHelper.runAction('processImage', params, response => {
            expect(response.error).to.equal('Error: must be non-empty array');
            done();
        });
    });

    it('Properly processes all variants of a request', done => {
        let params = {
            apiKey: api.config.general.secretApiKey,
            url: testData.url,
            variantIds: [
                testData.variant.id,
                testData.variant2.id,
            ]
        };
        api.specHelper.runAction('processImage', params, () => done());
    });
});
