const request = require('request'),
    testData = require('../testData.json');

describe('Action: getImage', () => {
    before(() => api.db.models.Variant.truncate()
        .then(() => api.db.models.Variant.create(testData.variant)));

    it('Properly processes image requests', done => {
        let url = [
            'http:/',
            ['localhost', api.config.servers.web.port].join(':'),
            api.config.servers.web.urlPathForActions,
            'image',
            testData.variant.id,
            encodeURIComponent(testData.url)
        ].join('/');

        request(url, function(error, response, body) {
            expect(error).to.be.null();
            expect(response.headers['content-type']).to.be.equal('image/jpeg');
            expect(body.length).to.be.above(3000);
            done();
        });
    });
});
