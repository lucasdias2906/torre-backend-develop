import express from 'express'
import asyncMiddleware from '../funcoes/asyncMiddleware'
import filialServico from '../servicos/filialServico'
import autenticacaoServico from '../servicos/autenticacaoServico'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await filialServico.listar(req)
  res.status(200).json(vRetorno)
}))

router.get('/:idFilialHub', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await filialServico.obter(req.params.idFilialHub)
  res.status(200).json(vRetorno)
}))

export default router

/**
   * @swagger
   * /filial:
   *   get:
   *     summary: Listagem das empresas
   *     content:
   *       application/json:
   *     tags: [Filial]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: filial
   */


/**
   * @swagger
   * /filial/{idFilialHub}:
   *   get:
   *     summary: obter empresa
   *     content:
   *       application/json:
   *     tags: [Filial]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: idFilialHub
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: empresa
   */
