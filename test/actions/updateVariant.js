const testData = require('../testData.json');

describe('Action: updateVariant', () => {
    const clearData = () => api.db.models.Variant.truncate();

    before(clearData);
    after(clearData);

    it('Requires an API key', done => {
        api.specHelper.runAction('updateVariant', response => {
            expect(response.error).to.equal('Error: Missing required API key.');
            done();
        });
    });

    it('Requires an ID', done => {
        let params = { apiKey: api.config.general.secretApiKey };
        api.specHelper.runAction('updateVariant', params, response => {
            expect(response.error).to.equal('Error: id is a required parameter for this action');
            done();
        });
    });

    it('Tolerates/reports requests to update non-existent variants', done => {
        let params = Object.assign({}, { id: testData.variant.id, transforms: 'XYZ' }, { apiKey: api.config.general.secretApiKey });
        api.specHelper.runAction('updateVariant', params, response => {
            expect(response.error).to.equal('Error: Invalid variant');
            done();
        });
    });

    it('Can update a variant', done => {
        let uparams = Object.assign({}, testData.variant, { apiKey: api.config.general.secretApiKey });
        api.specHelper.runAction('createVariant', uparams, response => {
            let dparams = Object.assign({}, { id: testData.variant.id, transforms: 'XYZ' }, { apiKey: api.config.general.secretApiKey });
            api.specHelper.runAction('updateVariant', dparams, response => {
                api.db.models.Variant.findById(testData.variant.id).then(testRecord => {
                    expect(testRecord.transforms).to.equal('XYZ');
                    done();
                });
            });
        });
    });
});
