import express from 'express'
import autenticacaoServico from '../servicos/autenticacaoServico'
import mapaSinoticoServico from '../servicos/mapaSinoticoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()


router.get('/processarViagens', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await mapaSinoticoServico.processarViagens(req)
  res.status(200).json({ ok: true })
}))

// Observação: a rota detalhada tem que vir antes da rota de listagem
router.get('/detalhe', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await mapaSinoticoServico.obterDetalhado(req.query.numeroPedido, req.query.codigoFilial)
  res.status(200).json(retorno)
}))

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await mapaSinoticoServico.listar(req)
  res.status(200).json(vRetorno)
}))

router.get('/listarViagens', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await mapaSinoticoServico.listarViagens(req)
  res.status(200).json(vRetorno)
}))

router.get('/listarCheckpoints', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await mapaSinoticoServico.listarCheckpoints(req)
  res.status(200).json(vRetorno)
}))

// router.post('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
//   const vRetorno = await mapaSinoticoServico.incluir(req.body)
//   res.status(200).json(vRetorno)
// }))

router.get('/:pId/proximaEtapa', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await mapaSinoticoServico.obterProximaEtapa(req.params.pId)
  res.status(200).json(vRetorno)
}))

router.get('/obter', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await mapaSinoticoServico.obterPorProgramacaoVeiculo(req.query.numeroProgramacaoVeiculo, req.query.codigoFilial)
  res.status(200).json(vRetorno)
}))

router.get('/:pId/etapas/:pIdEtapa', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await mapaSinoticoServico.obterEtapa(req.params.pId, req.params.pIdEtapa)
  res.status(200).json(vRetorno)
}))

router.get('/:pId/etapas', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await mapaSinoticoServico.listarEtapas(req.params.pId)
  res.status(200).json(vRetorno)
}))

router.get('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await mapaSinoticoServico.obter(req.params.pId)
  res.status(200).json(vRetorno)
}))

router.put('/marcarEtapaConcluida', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await mapaSinoticoServico.marcarEtapaConcluida(req.params.pMapaSinotico)
  res.status(200).json(retorno)
}))

router.put('/assinalarUltimaPosicaoVeiculoPrincipal', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vMapaSinoticoId = req.body.mapaSinoticoId
  const vPlaca = req.body.placa
  const retorno = await mapaSinoticoServico.assinalarUltimaPosicaoVeiculoPrincipal(vMapaSinoticoId, vPlaca)
  res.status(200).json(retorno)
}))


export default router

/**
   * @swagger
   * /mapaSinotico/processarViagens:
   *   get:
   *     summary: Processa as viagens, criando o mapa sinótico
   *     content:
   *       application/json:
   *     tags: [MapaSinótico]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: viagens incluídas
   */


/**
   * @swagger
   * /mapaSinotico:
   *   get:
   *     summary: Listagem do Mapa Sinótico
   *     content:
   *       application/json:
   *     tags: [MapaSinótico]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: usuario
   */

/**
   * @swagger
   * /mapaSinotico/detalhe:
   *   get:
   *     summary: Obter Mapa Sinótico detalhado
   *     content:
   *       application/json:
   *     parameters:
   *       - in: query
   *         name: numeroPedido
   *         required: true
   *         description: Número do pedido
   *         default: 13522
   *         type: string
   *       - in: query
   *         name: codigoFilial
   *         required: true
   *         description: Código da filial
   *         default: 33
   *         type: string
   *     tags: [MapaSinótico]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: mapa
   */

/**
   * @swagger
   * /mapaSinotico/listarViagens:
   *   get:
   *     summary: Listagem Viagens em andamento
   *     content:
   *       application/json:
   *     tags: [MapaSinótico]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: viagens
   */

/**
   * @swagger
   * /mapaSinotico/listarCheckpoints:
   *   get:
   *     summary: Listagem Checkpoints da rota
   *     content:
   *       application/json:
   *     tags: [MapaSinótico]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: checkpoints
   */

/**
   * @swagger
   * /mapaSinotico:
   *   post:
   *     summary: Inserir um Mapa Sinótico
   *     content:
   *       application/json:
   *     tags: [MapaSinótico]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: numeroPedido
   *         description: número do pedido
   *         example:
   *           numeroPedido: 73490
   *           codigoFilial: 38
   *     responses:
   *       200:
   *         description: usuario
   */

/**
   * @swagger
   * /mapaSinotico/assinalarUltimaPosicaoVeiculoPrincipal:
   *   put:
   *     summary: Atualizar última posição veículo, com base nos dados do rastreador
   *     content:
   *       application/json:
   *     tags: [MapaSinótico]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: mapaSinotico
   *         description: nmapaSinotico
   *         example:
   *           mapaSinoticoId: 5ecbc503f5e8015ed81af126
   *           placa: 38
   *     responses:
   *       200:
   *         description: mapa sinotico
   */
