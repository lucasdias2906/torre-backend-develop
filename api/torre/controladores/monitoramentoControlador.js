import express from 'express'
import monitoramentoServico from '../servicos/monitoramentoServico'
import rastreadorServico from '../servicos/rastreadorServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await monitoramentoServico.monitorarOperacao()
  res.status(200).json(vRetorno)
}))

router.post('/rastreador/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await rastreadorServico.incluir(req)
  res.status(200).json(vRetorno)
}))

export default router
