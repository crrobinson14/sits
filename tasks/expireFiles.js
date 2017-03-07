// TODO: Find a replacement, this module has not been maintained in awhile.
const findRemoveSync = require('find-remove');

exports.task = {
    name: 'expireFiles',
    description: 'Clean up old files.',
    queue: 'default',
    frequency: 5 * 60,
    run: (api, params, next) => {
        let result = findRemoveSync(api.config.image.storage, {
            maxLevel: 2,
            extensions: '.jpg',
            age: { seconds: api.config.image.expiration },
        });

        next(null, 'Expired ' + Object.keys(result || {}).length + ' image files.');
    }
};
