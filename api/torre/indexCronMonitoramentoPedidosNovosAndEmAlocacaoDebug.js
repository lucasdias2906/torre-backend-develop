import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import monitoramentoServico from './servicos/monitoramentoServico'

import configuracaoBanco from './configuracao/database'

require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(configuracaoBanco.databaseTorre, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)


function sleep(milliseconds) {
  const start = new Date().getTime()
  for (let i = 0; i < 1e7; i += 1) {
    if ((new Date().getTime() - start) > milliseconds) break
  }
}

sleep(3000)
console.log('Iniciando execução Pedidos Novos and Em Alocação...')
monitoramentoServico.monitorarPedidosNovosAndEmAlocacao().then((retorno) => console.log('Fim da execução Pedidos Novos and Em Alocação...', retorno)).catch((e) => console.log(e))
