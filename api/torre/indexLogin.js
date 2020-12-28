// =======================
// Imports necessarios index Global
// =======================
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import autenticacaoControlador from './controladores/autenticacaoControlador'
import cargaDadosControlador from './controladores/cargaDadosControlador'
import configuracaoBanco from './configuracao/database'
import erroControlador from './controladores/_erroControlador'

require('dotenv').config()
// =======================
// Configuração
// =======================
const app = express()
app.use(cors())

// Parser de requisição do express
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Configurações de rota
app.use('/api', autenticacaoControlador)
app.use('/api/cargaDados', cargaDadosControlador)

// Configurações do Swagger
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

let vSwaggerHost = process.env.HUM_TMS_HOST || 'localhost'

vSwaggerHost = `${vSwaggerHost}:`

if (process.env.HUB_TMS_PORT) vSwaggerHost += process.env.HUB_TMS_PORT
else vSwaggerHost += '8080'

swaggerDocument.host = vSwaggerHost

app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// conectando ao banco
mongoose.connect(configuracaoBanco.databaseTorre, { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.connect(process.env.DB_DATABASE_TORRE, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// Configuração de rota referente ao controle de erros
app.use(erroControlador)

// =======================
// Inicialização do servidor
// =======================
const vPorta = process.env.PORTA

app.listen(vPorta, () => {
  console.log(`Executando na porta: ${vPorta}`)
})

module.exports = app
