import express from 'express'
import rastreadorServico from '../servicos/rastreadorServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()


/**
   * @swagger
   * /rastreador:
   *   get:
   *     summary: Listagem dos Rastreadores
   *     content:
   *       application/json:
   *     tags: [Rastreador]
   *     parameters:
   *       - in: query
   *         required: true
   *         name: placa
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: users
   */

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await rastreadorServico.listar(req)
  res.status(200).json(vRetorno)
}))

export default router
