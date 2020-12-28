import express from 'express'
import cron from 'node-cron'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import mapaSinoticoServico from './servicos/mapaSinoticoServico'
import rotinaServico from './servicos/rotinaServico'
import configuracaoBanco from './configuracao/database'


require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(configuracaoBanco.databaseTorre, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)


cron.schedule('0 */10 * * * *', () => {
  console.log('Iniciando execução...')
  const vRotinaMonitoramento = mapaSinoticoServico.processarMapaSinotico
  rotinaServico.processar(vRotinaMonitoramento, 'MAPA_SINOTICO', {})
    .then((retorno) => console.log('Fim da execução...', retorno))
    .catch((e) => console.log(e))
})
