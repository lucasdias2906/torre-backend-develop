import express from 'express'
import MonitoramentoServico from '../servicos/monitoramentoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/listarViagens', asyncMiddleware(async (req, res) => {
  const vRetorno = await MonitoramentoServico.listarViagens(req)
  res.status(200).json(vRetorno)
}))

router.get('/listarMotoristas', asyncMiddleware(async (req, res) => {
  const vRetorno = await MonitoramentoServico.listarMotoristas(req)
  res.status(200).json(vRetorno)
}))

router.get('/listarMotoristaSemAlocacaoPorTempo', asyncMiddleware(async (req, res) => {
  const vRetorno = await MonitoramentoServico.listarMotoristaSemAlocacaoPorTempo(req)
  res.status(200).json(vRetorno)
}))

router.get('/listarMotoristaFerias', asyncMiddleware(async (req, res) => {
  const vRetorno = await MonitoramentoServico.listarMotoristaFerias(req)
  res.status(200).json(vRetorno)
}))

router.get('/listarVeiculos', asyncMiddleware(async (req, res) => {
  const vRetorno = await MonitoramentoServico.listarVeiculos(req)
  res.status(200).json(vRetorno)
}))

export default router
