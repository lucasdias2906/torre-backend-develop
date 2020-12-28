const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('../configuracao/database');

const db = {};
const sequelize = new Sequelize(config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

fs.readdirSync(__dirname)
    .filter(
        file =>
            file.indexOf('.') !== 0 &&
            file !== path.basename(__filename) &&
            file.slice(-3) === '.js'
    )
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
