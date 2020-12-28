import express from 'express'
import cron from 'node-cron'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import rotinaServico from './servicos/rotinaServico'
import monitoramentoServico from './servicos/monitoramentoServico'

import configuracaoBanco from './configuracao/database'

require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(configuracaoBanco.databaseTorre, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

cron.schedule('0 */2 * * * *', () => {
  console.log()
  console.log('Iniciando execução...')
  const vRotinaMonitoramento = monitoramentoServico.atualizarPedidosParaMonitoramento
  rotinaServico.processar(vRotinaMonitoramento, 'ATUALIZACAO_PEDIDOS_PARA_MONITORAMENTO')
    .then((retorno) => console.log('Fim da execução...', retorno))
    .catch((e) => console.log(e))
})
