require('dotenv').config();

module.exports = {
  dialect: 'mssql',
  schema: 'dbo',
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialectOptions: {
    options: {
      encrypt: true,
      requestTimeout: 600000,
      useUTC: false, // for reading from database -- https://stackoverflow.com/questions/52096692/change-sequelize-timezone
    },
  },
  timezone: '-03:00',
};
