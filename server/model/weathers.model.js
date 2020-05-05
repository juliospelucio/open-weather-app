var mysql = require('mysql');
const { Sequelize } = require("sequelize");
const db = require("../config/db.config");

exports.Weather = db.sequelize.define(
    'weather',
    {
        id: { type: Sequelize.BIGINT, primaryKey: true },
        name: Sequelize.TEXT,
        last_update: Sequelize.DATE,
        searched: Sequelize.INTEGER,
    },
    {
        timestamps: false,
        tableName: 'weathers'
    }
);

exports.createConnection = () => {
    let connection = mysql.createConnection(db.config);
    connection.connect();
}