import express from 'express'
import grupoServico from '../servicos/grupoServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await grupoServico.listar(req.query)
  res.status(200).json(vRetorno)
}))

router.get('/:pGrupoId/empresa', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await grupoServico.listarEmpresas(req.query)
  res.status(200).json(vRetorno)
}))

router.get('/:pGrupoId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await grupoServico.obter(req.params.pGrupoId)
  res.status(200).json(vRetorno)
}))

export default router
