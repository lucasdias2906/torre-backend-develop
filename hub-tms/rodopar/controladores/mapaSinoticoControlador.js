import express from 'express'
import MapaSinoticoServico from '../servicos/mapaSinoticoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/listarViagens', asyncMiddleware(async (req, res) => {
  const vRetorno = await MapaSinoticoServico.listarViagens(req)
  res.status(200).json(vRetorno)
}))


router.get('/listarCheckpoints', asyncMiddleware(async (req, res) => {
  const vRetorno = await MapaSinoticoServico.listarCheckpoints(req)
  res.status(200).json(vRetorno)
}))

export default router
