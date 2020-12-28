import express from 'express'
import moduloServico from '../servicos/tipoCargaServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await moduloServico.listar(req)
  return res.status(200).json(vRetorno)
}))

router.get('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await moduloServico.obter(req.params.pId)
  return res.status(200).json(vRetorno)
}))

export default router

/**
   * @swagger
   * /tipoCarga:
   *   get:
   *     summary: Listagem dos tipos de carga
   *     content:
   *       application/json:
   *     tags: [Tipos de Carga]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: limite
   *         default: 20
   *         type: string
   *     responses:
   *       200:
   *         description: tipo de carga
   */


/**
   * @swagger
   * /tipoCarga/{pId}:
   *   get:
   *     summary: Listagem dos tipos de carga
   *     content:
   *       application/json:
   *     tags: [Tipos de Carga]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         default: 1
   *         type: string
   *     responses:
   *       200:
   *         description: tipo de carga
   */
