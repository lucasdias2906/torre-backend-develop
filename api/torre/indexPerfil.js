// =======================
// Imports necessarios para Perfil
// =======================
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import configuracaoBanco from './configuracao/database';
import funcionalidadeControlador from './controladores/funcionalidadeControlador';
import moduloControlador from './controladores/moduloControlador';
import perfilControlador from './controladores/perfilControlador';

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
app.use('/api', moduloControlador);
app.use('/api', funcionalidadeControlador);
app.use('/api/perfil', perfilControlador);

// conectando ao banco
mongoose.connect(configuracaoBanco.databaseTorre, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Configuração de rota referente ao controle de erros
app.use(erroControlador);

// =======================
// Inicialização do servidor
// =======================
const vPorta = process.env.PORTA;

app.listen(vPorta);

console.log(`executando na porta ${vPorta}`);

module.exports = app;
