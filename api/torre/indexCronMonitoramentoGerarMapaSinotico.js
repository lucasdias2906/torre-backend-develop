import express from 'express'
import cron from 'node-cron'
import util from './funcoes/utilitarios'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import monitoramentoServico from './servicos/monitoramentoServico'
import parametroGeralServico from './servicos/parametroGeralServico'
import mapaSinoticoServico from './servicos/mapaSinoticoServico'

import configuracaoBanco from './configuracao/database'


require('dotenv').config()

process.env.PORT = 8081

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(configuracaoBanco.databaseTorre, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)


const execucao = async () => {
  const vRetornoProcesso = await mapaSinoticoServico.processarViagens({})
  console.log(`Total de Pedidos Processados: ${vRetornoProcesso}`)
}

execucao().then(() => {
  console.log('ok')
  process.exit(0)
})
  .catch((e) => {
    console.log('erro', e)
    process.exit(0)
  })

console.log("fim...")
