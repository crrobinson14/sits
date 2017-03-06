const toConsole = (api, winston) => new (winston.transports.Console)({
    colorize: true,
    level: 'info',
});

const toFile = (api, winston) => new (winston.transports.File)({
    filename: './log/actionhero.log',
    level: 'info',
    timestamp: true,
    json: false,
    options: { flags: 'w' },
});

module.exports.default = {
    logger: () => {
        return { transports: [toConsole, toFile] };
    }
};

module.exports.test = {
    logger: () => {
        return { transports: [toFile] };
    }
};
