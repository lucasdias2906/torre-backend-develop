require('dotenv').config();

module.exports = {
  instancia: process.env.DB_INSTANCIA,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  conexao_torre: process.env.CONEXAO_TORRE,
  databaseTorre: process.env.DB_DATABASE_TORRE,
};
