import express from 'express'
import parametroGeralServico from '../servicos/parametroGeralServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await parametroGeralServico.listar()
  return res.status(200).json(vRetorno)
}))

router.get('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await parametroGeralServico.obter(req.params.pId)
  return res.status(200).json(vRetorno)
}))

router.put('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await parametroGeralServico.alterar(req.params.pId, req.body)
  res.status(200).json(retorno)
}))

export default router
