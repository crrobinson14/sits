module.exports.default = {
    db: () => ({
        storage: __dirname + '/../db/db.sqlite',
        dialect: 'sqlite'
    })
};
