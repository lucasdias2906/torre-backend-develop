import express from 'express'
import funcionalidadeServico from '../servicos/funcionalidadeServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'
import autenticacaoServico from '../servicos/autenticacaoServico'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await funcionalidadeServico.buscarTodos()
  res.status(200).json({ dados: vRetorno })
}))

router.get('/inicializar', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await funcionalidadeServico.inicializar()
  res.status(200).json({ dados: vRetorno })
}))

export default router
