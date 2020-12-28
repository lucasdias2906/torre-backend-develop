import express from 'express'
import disponibilidadeServico from '../servicos/disponibilidadeServico'

import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/veiculo', asyncMiddleware(async (req, res) => {
  const vRetorno = await disponibilidadeServico.listarVeiculo(req)
  res.status(200).json(vRetorno)
}))

router.get('/veiculo-quantidade', asyncMiddleware(async (req, res) => {
  const vRetorno = await disponibilidadeServico.obterQuantidadeVeiculo(req)
  res.status(200).json(vRetorno)
}))

router.get('/motorista', asyncMiddleware(async (req, res) => {
  const vRetorno = await disponibilidadeServico.listarMotorista(req)
  res.status(200).json(vRetorno)
}))

router.get('/motorista-quantidade', asyncMiddleware(async (req, res) => {
  const vRetorno = await disponibilidadeServico.obterQuantidadeMotorista(req)
  res.status(200).json(vRetorno)
}))

export default router
