import express from 'express'
import tipoOcorrenciaServico from '../servicos/tipoOcorrenciaServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await tipoOcorrenciaServico.listar(req)
  return res.status(200).json(vRetorno)
}))

router.post('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await tipoOcorrenciaServico.incluir(req)
  res.status(200).json(retorno)
}))

router.get('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await tipoOcorrenciaServico.obter(req.params.pId)
  return res.status(200).json(vRetorno)
}))

router.put('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await tipoOcorrenciaServico.alterar(req.params.pId, req.body)
  res.status(200).json(retorno)
}))

router.delete('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await tipoOcorrenciaServico.excluir(req.params.pId)
  res.status(200).json({ dados: retorno })
}))

router.put('/:pId/alterarStatus', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await tipoOcorrenciaServico.alterarStatus(req.params.pId, req)
  res.status(200).json(retorno)
}))

export default router
