const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false, // Désactive les logs SQL
});

const db = {};

fs.readdirSync(__dirname)
    .filter(
        (file) =>
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    )
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

// 🔁 Exécuter les associations
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
