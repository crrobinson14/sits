const testData = require('../testData.json');

describe('Action: getStatistics', () => {
    before(() => api.models.Variant.truncate().then(() => Promise.all([
        api.models.Variant.create({ id: 'A' }),
        api.models.Variant.create({ id: 'B' }),
        api.tracking.getAll(true),
    ])));

    it('Requires an API key', done => {
        api.specHelper.runAction('getStatistics', res => {
            expect(res.error).to.equal('Error: Missing required API key.');
            done();
        });
    });

    it('Can get usage stats', done => {
        Promise.all([
            api.tracking.track('A'),
            api.tracking.track('B'),
        ]).then(() => {
            api.specHelper.runAction('getStatistics', { apiKey: api.config.general.secretApiKey }, res => {
                expect(res.status).to.equal('OK');
                expect(res.usage.get('A')).to.equal(1);
                expect(res.usage.get('B')).to.equal(1);
                done();
            });
        })
    });
});
