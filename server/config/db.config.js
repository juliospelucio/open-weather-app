const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    'open_weather',
    'root',
    '',

    {
        host: 'localhost',
        dialect: 'mysql',
        timezone: 'America/Sao_Paulo'
    }
);

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'open_weather',
    insecureAuth: true
}

module.exports = { sequelize, config };