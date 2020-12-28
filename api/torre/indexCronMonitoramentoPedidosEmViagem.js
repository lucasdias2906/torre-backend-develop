import express from 'express'
import cron from 'node-cron'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import util from './funcoes/utilitarios'

import rotinaServico from './servicos/rotinaServico'
import monitoramentoServico from './servicos/monitoramentoServico'
import parametroGeralServico from './servicos/parametroGeralServico'

import configuracaoBanco from './configuracao/database'

require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(configuracaoBanco.databaseTorre, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// MONITORAMENTO PRINCIPAL PARA PEDIDOS EM VIAGEM
// SERÁ CONSIDERADO UM HORÁRIO DE INÍCIO E HORÁRIO DE TÉRMINO PARA
// EXECUÇÃO DO MONITORAMENTO EM FREQUÊNCIA DE 60 MINUTOS
// *******************************************************************************
cron.schedule('0 */60 * * * *', async () => {
  const horaCorrente = parseInt(util.formatarData(Date.now()).substring(11, 13))

  const horarioInicioMonitoramento = await parametroGeralServico.obterPorCodigo('monitoramento', 'HORARIO_INICIO_MONITORAMENTO')
  const horarioTerminoMonitoramento = await parametroGeralServico.obterPorCodigo('monitoramento', 'HORARIO_TERMINO_MONITORAMENTO')

  if (horaCorrente < horarioInicioMonitoramento || horaCorrente > horarioTerminoMonitoramento) {
    console.log(`MONITORAMENTO PRINCIPAL - Não Executado`)
    console.log(`Execução Fora do Horário ==> Hora Corrente: ${horaCorrente}`)
    console.log()
    return
  }

  const vRotinaMonitoramento = monitoramentoServico.monitorarPedidosEmViagem
  rotinaServico.processar(vRotinaMonitoramento, 'MONITORAMENTO_EM_VIAGEM')
    .then((retorno) => console.log('Fim da execução...', retorno))
    .catch((e) => console.log(e))
})



// // MONITORAMENTO SECUNDÁRIO PARA PEDIDOS EM VIAGEM
// // SERÁ CONSIDERADO UM HORÁRIO DE INÍCIO E HORÁRIO DE TÉRMINO EXCLUDENTES PARA
// // EXECUÇÃO DO MONITORAMENTO EM FREQUÊNCIA DE 120 MINUTOS
// // *******************************************************************************
// cron.schedule('5,15,25,35,45,55 * * * *', async () => {
//   const horaCorrente = parseInt(util.formatarData(Date.now()).substring(11, 13))

//   const horarioInicioMonitoramento = await parametroGeralServico.obterPorCodigo('monitoramento', 'HORARIO_INICIO_MONITORAMENTO')
//   const horarioTerminoMonitoramento = await parametroGeralServico.obterPorCodigo('monitoramento', 'HORARIO_TERMINO_MONITORAMENTO')

//   if (horaCorrente >= horarioInicioMonitoramento && horaCorrente <= horarioTerminoMonitoramento) {
//     console.log(`MONITORAMENTO SECUNDÁRIO - Não Executado`)
//     console.log(`Execução Fora do Horário ==> Hora Corrente: ${horaCorrente}`)
//     console.log()
//     return
//   }

//   console.log('rodou secundário....')
//   // const vRotinaMonitoramento = monitoramentoServico.monitorarPedidosEmViagem
//   // rotinaServico.processar(vRotinaMonitoramento, 'MONITORAMENTO_EM_VIAGEM')
//   //   .then((retorno) => console.log('Fim da execução...', retorno))
//   //   .catch((e) => console.log(e))
// })
