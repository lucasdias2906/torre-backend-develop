import express from 'express'
import regiaoOperacaoServico from '../servicos/regiaoOperacaoServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.post('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await regiaoOperacaoServico.incluir(req.body)
  res.status(200).json(retorno)
}))

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await regiaoOperacaoServico.listar(req.query)
  res.status(200).json(retorno)
}))

router.put('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await regiaoOperacaoServico.alterar(req.params.pId, req.body)
  res.status(200).json(retorno)
}))

router.delete('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await regiaoOperacaoServico.excluir(req.params.pId)
  res.status(200).json(retorno)
}))

router.post('/:pCodigoRegiaoOperacao/vigencia', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await regiaoOperacaoServico.incluirRegiaoOperacaoVigencia(req.params.pCodigoRegiaoOperacao, req.body)
  res.status(200).json(retorno)
}))

router.get('/:pCodigoRegiaoOperacao/vigencia', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await regiaoOperacaoServico.listarRegiaoOperacaoVigencia(req.params.pCodigoRegiaoOperacao, req.query)
  res.status(200).json(retorno)
}))

router.get('/vigencia/:pCodigoRegiaoOPVigencia', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await regiaoOperacaoServico.obterRegiaoOPVigencia(req.params.pCodigoRegiaoOPVigencia)
  res.status(200).json(retorno)
}))

router.put('/vigencia/:pCodigoRegiaoOPVigencia', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await regiaoOperacaoServico.alterarRegiaoOperacaoVigencia(req.params.pCodigoRegiaoOPVigencia, req.body)
  res.status(200).json(retorno)
}))

router.delete('/vigencia/:pCodigoRegiaoOPVigencia', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await regiaoOperacaoServico.excluirRegiaoOperacaoVigencia(req.params.pCodigoRegiaoOPVigencia)
  res.status(200).json(retorno)
}))

export default router

/**
   * @swagger
   * /regiaoOperacao:
   *   post:
   *     summary: Inclusão de região de operação
   *     content:
   *       application/json:
   *     tags: [Região de Operação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: Região de Operação
   *         description: Região de Operação
   *         example:
   *           regiaoOperacao: "teste Regiao Operacao"
   *     responses:
   *       200:
   *         description: regiao de operacao
   */

/**
   * @swagger
   * /regiaoOperacao:
   *   get:
   *     summary: Inclusão de região de operação
   *     content:
   *       application/json:
   *     tags: [Região de Operação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: regiaoOperacao
   *         description: Região de operação a ser pesquisado
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoRegiaoOperacao
   *         description: Código da região de operação a ser pesquisado
   *         type: string
   *     responses:
   *       200:
   *         description: regiao de operacao
   */

/**
   * @swagger
   * /regiaoOperacao/{pId}:
   *   put:
   *     summary: Altera região de operação
   *     content:
   *       application/json:
   *     tags: [Região de Operação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         description: Id da região de operação
   *         type: string
   *       - in: body
   *         name: Região de Operação
   *         description: Região de Operação
   *         example:
   *           regiaoOperacao: "teste Regiao Operacao"
   *     responses:
   *       200:
   *         description: regiao de operacao
   */

/**
   * @swagger
   * /regiaoOperacao/{pId}:
   *   delete:
   *     summary: Exclui região de operação
   *     content:
   *       application/json:
   *     tags: [Região de Operação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         description: Id da região de operação
   *         type: string
   *     responses:
   *       200:
   *         description: regiao de operacao
   */


/**
   * @swagger
   * /regiaoOperacao/{codigoRegiaoOperacao}/vigencia:
   *   post:
   *     summary: Inclusão de vigência região de operação
   *     content:
   *       application/json:
   *     tags: [Região de Operação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: codigoRegiaoOperacao
   *         description: Código da região de operação a ser pesquisado
   *         type: string
   *       - in: body
   *         name: Região de Operação
   *         description: Região de Operação
   *         example:
   *           vigenciaRegiaoOperacao: "2020-12-01"
   *           codigoRegiaoOperacao: 12
   *           custoOleoDiesel: 0
   *           custoGalaoArla: 0
   *           custoLavagem: 0
   *     responses:
   *       200:
   *         description: regiao de operacao
   */

 /**
   * @swagger
   * /regiaoOperacao/{codigoRegiaoOperacao}/vigencia:
   *   get:
   *     summary: Inclusão de vigência região de operação
   *     content:
   *       application/json:
   *     tags: [Região de Operação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: codigoRegiaoOperacao
   *         description: Código da região de operação a ser pesquisado
   *         type: string
   *     responses:
   *       200:
   *         description: regiao de operacao
   */

/**
   * @swagger
   * /regiaoOperacao/vigencia/{pCodigoRegiaoOPVigencia}:
   *   get:
   *     summary: Obter vigência região de operação
   *     content:
   *       application/json:
   *     tags: [Região de Operação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCodigoRegiaoOPVigencia
   *         description: Código da vigência da região de operação
   *         type: string
   *     responses:
   *       200:
   *         description: regiao de operacao
   */

/**
   * @swagger
   * /regiaoOperacao/vigencia/{pCodigoRegiaoOPVigencia}:
   *   put:
   *     summary: Obter vigência região de operação
   *     content:
   *       application/json:
   *     tags: [Região de Operação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCodigoRegiaoOPVigencia
   *         description: Código da vigência da região de operação
   *         type: string
   *       - in: body
   *         name: Região de Operação
   *         description: Região de Operação
   *         example:
   *           vigenciaRegiaoOperacao: "2020-12-01"
   *           codigoRegiaoOperacao: 12
   *           custoOleoDiesel: 0
   *           custoGalaoArla: 0
   *           custoLavagem: 0
   *     responses:
   *       200:
   *         description: regiao de operacao
   */

/**
   * @swagger
   * /regiaoOperacao/vigencia/{pCodigoRegiaoOPVigencia}:
   *   delete:
   *     summary: Obter vigência região de operação
   *     content:
   *       application/json:
   *     tags: [Região de Operação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCodigoRegiaoOPVigencia
   *         description: Código da vigência da região de operação
   *         type: string
   *     responses:
   *       200:
   *         description: regiao de operacao
   */
