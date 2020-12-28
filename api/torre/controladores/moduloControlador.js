import express from 'express'
import moduloServico from '../servicos/moduloServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await moduloServico.listar()
  res.status(200).json(vRetorno)
}))

router.get('/:pId/funcionalidade', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await moduloServico.listarFuncionalidades(req.params.pId)
  res.status(200).json(vRetorno)
}))

router.post('/', autenticacaoServico.validarToken, autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await moduloServico.incluir(req.body)
  res.status(200).json(retorno)
}))

router.post('/:pId/funcionalidade', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await moduloServico.incluirFuncionalidade(req.params.pId, req.body)
  res.status(200).json(vRetorno)
}))

router.get('/inicializar', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await moduloServico.inicializar()
  res.status(200).json({ dados: vRetorno })
}))

export default router

/**
   * @swagger
   * /modulo:
   *   get:
   *     tags: [Módulos]
   *     description: Retorna os módulos
   *     responses:
   *       200:
   *         description: ok
   */

/**
   * @swagger
   * /modulo/{moduloId}/funcionalidade:
   *   get:
   *     tags: [Módulos]
   *     description: Retorna as funcionalidades
   *     parameters:
   *       - in: path
   *         name: moduloId
   *         description: Funcionalidade
   *         type: string
   *     responses:
   *       200:
   *         description: ok
   */

/**
   * @swagger
   * /modulo:
   *   post:
   *     summary: Insere um módulo
   *     content:
   *       application/json:
   *     tags: [Módulos]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: Módulo
   *         description: Módulo
   *         type: object
   *         example:
   *           nome: Modulo Teste
   *     responses:
   *       200:
   *         description: módulo
   */

/**
   * @swagger
   * /modulo/{moduloId}/funcionalidade:
   *   post:
   *     summary: Insere uma funcionalidade
   *     content:
   *       application/json:
   *     tags: [Módulos]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: moduloId
   *         description: Funcionalidade
   *         type: string
   *       - in: body
   *         name: Funcionalidade
   *         description: Funcionalidade
   *         type: object
   *         example:
   *           nome: Funcionalidade Teste
   *     responses:
   *       200:
   *         description: módulo
   */
