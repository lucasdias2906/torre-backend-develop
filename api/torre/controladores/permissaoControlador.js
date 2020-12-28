import express from 'express'
import moduloServico from '../servicos/moduloServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/permissao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await moduloServico.buscarTodos()
  return res.status(200).json({ dados: retorno })
}))

router.get('/permissao/:pId/funcionalidade', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await moduloServico.buscarFuncionalidades(req.params.pId)
  return res.status(200).json({ dados: retorno })
}))

export default router
