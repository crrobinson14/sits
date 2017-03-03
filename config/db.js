module.exports.default = {
    db: () => ({
        storage: __dirname + '/../db.sqlite',
        dialect: 'sqlite',
        logging: null
    })
};
