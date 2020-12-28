// =======================
// Imports necessarios index Global
// =======================
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import usuarioControlador from './controladores/usuarioControlador';
import configuracaoBanco from './configuracao/database';
import erroControlador from './controladores/_erroControlador';


require('dotenv').config();
// =======================
// Configuração
// =======================
const app = express();

app.use(cors());

// Parser de requisição do express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurações de rota

app.use('/api/usuario', usuarioControlador);

// Conectando ao banco
mongoose.connect(configuracaoBanco.databaseTorre, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Configuração de rota referente ao controle de erros
app.use(erroControlador);

// =======================
// Inicialização do servidor
// =======================
const vPorta = process.env.PORTA || 3001;

console.log(`Database: ${configuracaoBanco.databaseTorre}`);

app.listen(vPorta, () => {
  console.log(`Executando na porta: ${vPorta}`);
});

module.exports = app;
