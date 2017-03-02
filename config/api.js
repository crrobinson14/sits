const path = require('path');

module.exports.default = {
    general: api => {
        const packageJSON = require(api.projectRoot + path.sep + 'package.json');

        return {
            apiVersion: packageJSON.version,
            serverName: packageJSON.name,
            serverToken: 'sits-change-me',
            developmentMode: true,
            paths: {
                'action': [path.join(__dirname, '/../actions')],
                'task': [path.join(__dirname, '/../tasks')],
                'public': [path.join(__dirname, '/../public')],
                'pid': [path.join(__dirname, '/../pids')],
                'log': [path.join(__dirname, '/../log')],
                'server': [path.join(__dirname, '/../servers')],
                'initializer': [path.join(__dirname, '/../initializers')],
                'plugin': [path.join(__dirname, '/../node_modules')],
                'locale': [path.join(__dirname, '/../locales')]
            },
        }
    }
};
