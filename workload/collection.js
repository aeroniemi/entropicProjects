const { Sequelize, Op, Model, DataTypes } = require('sequelize');

// define the database to use
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/core.db'
});

function connect() {
    return new Promise(function (resolve, reject) {
    })
}
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}