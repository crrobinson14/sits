const testData = require('../testData.json');

describe('Action: createVariant', () => {
    it('Requires an API key', done => {
        api.specHelper.runAction('createVariant', response => {
            expect(response.error).to.equal('Error: Missing required API key.');
            done();
        });
    });

    it('Requires an ID', done => {
        let params = { apiKey: api.config.general.secretApiKey, transforms: 'x' };
        api.specHelper.runAction('createVariant', params, response => {
            expect(response.error).to.equal('Error: id is a required parameter for this action');
            done();
        });
    });

    it('Requires a set of transforms', done => {
        let params = { apiKey: api.config.general.secretApiKey, id: 'x' };
        api.specHelper.runAction('createVariant', params, response => {
            expect(response.error).to.equal('Error: transforms is a required parameter for this action');
            done();
        });
    });

    it('Can create a simple variant', done => {
        let params = Object.assign({}, testData.variant, { apiKey: api.config.general.secretApiKey });
        api.specHelper.runAction('createVariant', params, response => {
            expect(response.variant.id).to.equal(testData.variant.id);
            expect(response.variant.transforms).to.equal(testData.variant.transforms);
            expect(response.variant.createdAt).to.not.be.undefined();
            expect(response.variant.updatedAt).to.not.be.undefined();
            done();
        });
    });

    it('Blocks duplicate-variant creation attempts', done => {
        let params = Object.assign({}, testData.variant, { apiKey: api.config.general.secretApiKey });
        api.specHelper.runAction('createVariant', params, response => {
            expect(response.error).to.equal('Error: Error creating variant: Validation error (id must be unique)');
            done();
        });
    });
});
