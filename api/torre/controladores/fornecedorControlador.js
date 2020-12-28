import express from 'express'
import parceiroFornecedor from '../servicos/fornecedorServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'
import autenticacaoServico from '../servicos/autenticacaoServico'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroFornecedor.listar(req)
  return res.status(200).json(result)
}))

router.get('/:pFornecedorId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroFornecedor.detalhes(req.params.pFornecedorId, req)
  return res.status(200).json(result)
}))

export default router
