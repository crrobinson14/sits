const testData = require('../testData.json');

describe('Action: deleteVariant', () => {
    const clearData = () => api.models.Variant.truncate();

    before(clearData);
    after(clearData);

    it('Requires an API key', done => {
        api.specHelper.runAction('deleteVariant', response => {
            expect(response.error).to.equal('Error: Missing required API key.');
            done();
        });
    });

    it('Requires an ID', done => {
        let params = { apiKey: api.config.general.secretApiKey };
        api.specHelper.runAction('deleteVariant', params, response => {
            expect(response.error).to.equal('Error: id is a required parameter for this action');
            done();
        });
    });

    it('Tolerates/reports requests to delete non-existent variants', done => {
        let params = Object.assign({}, { id: testData.variant.id }, { apiKey: api.config.general.secretApiKey });
        api.specHelper.runAction('deleteVariant', params, response => {
            expect(response.error).to.equal('Error: Database error: Invalid variant (-)');
            done();
        });
    });

    it('Can delete a variant', done => {
        let cparams = Object.assign({}, testData.variant, { apiKey: api.config.general.secretApiKey });
        api.specHelper.runAction('createVariant', cparams, response => {
            expect(response.status).to.equal('OK');

            let dparams = Object.assign({}, { id: testData.variant.id }, { apiKey: api.config.general.secretApiKey });
            api.specHelper.runAction('deleteVariant', dparams, response => {
                expect(response.status).to.equal('OK');

                api.db.getVariant(testData.variant.id).then(testRecord => {
                    expect(testRecord).to.be.null();
                    done();
                });
            });
        });
    });
});
