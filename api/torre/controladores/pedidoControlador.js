import express from 'express'
import pedidoServico from '../servicos/pedidoServico'
import pedidoStatusServico from '../servicos/pedidoStatusServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import mapaSinoticoServico from '../servicos/mapaSinoticoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.listar('S', req)
  res.status(200).json(retorno)
}))

router.get('/status', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoStatusServico.listar(req)
  res.status(200).json(retorno)
}))

router.get('/diferencial', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.listarDiferencial(req)
  res.status(200).json(retorno)
}))

router.get('/agrupados', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.listar('N', req)
  res.status(200).json(retorno)
}))

router.get('/obter', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.obter(req)
  res.status(200).json(retorno)
}))

router.get('/composicaoCarga', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.listarComposicaoCarga(req)
  res.status(200).json(retorno)
}))

router.get('/programacaoVeiculo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.listarProgramacaoVeiculo(req)
  res.status(200).json(retorno)
}))

router.get('/emViagem', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.listarPedidosEmViagem(req)
  res.status(200).json(retorno)
}))

router.get('/novosAndEmAlocacao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.listarPedidosNovosAndEmAlocacao(req)
  res.status(200).json(retorno)
}))

router.get('/pontosPassagem', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.listarPontosPassagem(req)
  res.status(200).json(retorno)
}))

router.put('/fimDaViagem', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.registrarFimDaViagem(req)
  res.status(200).json(retorno)
}))

router.put('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await pedidoServico.alterar(req)
  res.status(200).json(retorno)
}))

router.get('/mapaSinotico', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await mapaSinoticoServico.obterDetalhado(req.query.numeroPedido, req.query.codigoFilial)
  res.status(200).json(retorno)
}))

export default router


/**
   * @swagger
   * /pedido:
   *   get:
   *     summary: Listagem dos pedidos
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         description: Número do pedido
   *         name: numeroPedido
   *         type: string
   *       - in: query
   *         required: false
   *         description: Data retirada inicial
   *         name: dataRetiradaInicial
   *         default: 2020-03-23T04:00:00.000Z
   *       - in: query
   *         required: false
   *         description: Data retirada final
   *         name: dataRetiradaFinal
   *         default: 2020-03-23T04:00:00.000Z
   *         type: string
   *       - in: query
   *         required: false
   *         description: Data entrega final
   *         name: dataEntregaFinal
   *         default: 2020-03-23T04:00:00.000Z
   *         type: string
   *       - in: query
   *         required: false
   *         description: Data Previsão Chegada Inicial
   *         name: dataPrevisaoChegadaInicial
   *         default: 2020-03-23T04:00:00.000Z
   *         type: string
   *       - in: query
   *         required: false
   *         description: Data Previsão Chegada Final
   *         name: dataPrevisaoChegadaFinal
   *         default: 2020-03-23T04:00:00.000Z
   *         type: string
   *       - in: query
   *         required: false
   *         description: Código filial
   *         name: codigoFilial
   *         type: string
   *       - in: query
   *         required: false
   *         description: Código tipo carga
   *         name: codigoTipoCarga
   *         type: string
   *       - in: query
   *         required: false
   *         description: Descrição status pedido torre
   *         name: descricaoStatusPedidoTorre
   *         type: string
   *       - in: query
   *         required: false
   *         description: Código status pedido torre
   *         name: codigoStatusPedidoTorre
   *         type: string
   *       - in: query
   *         required: false
   *         description: Placa veículo
   *         name: placaVeiculo
   *         type: string
   *       - in: query
   *         required: false
   *         description: Código da linha (rota)
   *         name: codigoLinha
   *         type: string
   *       - in: query
   *         required: false
   *         description: Código do remetente
   *         name: codigoRemetente
   *         type: string
   *       - in: query
   *         required: false
   *         description: Código do destinatário
   *         name: codigoDestinatario
   *         type: string
   *       - in: query
   *         required: false
   *         description: diferencial
   *         default: RODOTREM
   *         name: diferencial
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         default: 20
   *         type: string
   *     responses:
   *       200:
   *         description: pedido
   */


/**
   * @swagger
   * /pedido/status:
   *   get:
   *     summary: Listagem tabela de status dos pedidos
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: pedido
   */

/**
   * @swagger
   * /pedido/diferencial:
   *   get:
   *     summary: Listagem tabela de diferenciais
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: pedido
   */


/**
   * @swagger
   * /pedido/agrupados:
   *   get:
   *     summary: Listagem dos pedidos agrupados
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: true
   *         name: numeroPedido
   *         default: 11268
   *         type: string
   *       - in: query
   *         required: true
   *         name: codigoFilial
   *         default: 19
   *         type: string
   *     responses:
   *       200:
   *         description: pedido
   */

/**
   * @swagger
   * /pedido/obter:
   *   get:
   *     summary: Listagem dos pedidos
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: true
   *         name: numeroPedido
   *         default: 11268
   *         type: string
   *       - in: query
   *         required: true
   *         name: codigoFilial
   *         default: 19
   *         type: string
   *     responses:
   *       200:
   *         description: pedido
   */


/**
   * @swagger
   * /pedido/composicaoCarga:
   *   get:
   *     summary: Listagem da composição da carga de um pedido
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: true
   *         name: numeroPedido
   *         default: 98040
   *         type: string
   *       - in: query
   *         required: true
   *         name: codigoFilial
   *         default: 38
   *         type: string
   *     responses:
   *       200:
   *         description: pedido
   */


/**
   * @swagger
   * /pedido/programacaoVeiculo:
   *   get:
   *     summary: Listagem da programação de veículo
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: true
   *         name: numeroProgramacaoVeiculo
   *         default: 98040
   *         type: string
   *       - in: query
   *         required: true
   *         name: codigoFilial
   *         default: 38
   *         type: string
   *     responses:
   *       200:
   *         description: pedido
   */


/**
   * @swagger
   * /pedido/emViagem:
   *   get:
   *     summary: Listagem da pedidos em viagem
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: pedido
   */


/**
   * @swagger
   * /pedido/novosAndEmAlocacao:
   *   get:
   *     summary: Listagem da pedidos novos ou em alocação
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: pedido
   */

/**
   * @swagger
   * /pedido/pontosPassagem:
   *   get:
   *     summary: Listagem dos pontos de passagem
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: true
   *         name: numeroPedido
   *         default: 98040
   *         type: string
   *       - in: query
   *         required: true
   *         name: codigoFilial
   *         default: 38
   *         type: string
   *     responses:
   *       200:
   *         description: pedido
   */

/**
   * @swagger
   * /pedido/fimDaViagem:
   *   put:
   *     summary: Listagem da pedidos novos ou em alocação
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     parameters:
   *       - in: query
   *         required: true
   *         name: numeroPedido
   *         default: SP-05-SEG-11052020
   *         type: string
   *       - in: query
   *         required: true
   *         name: codigoFilial
   *         default: 38
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: pedido
   */


/**
   * @swagger
   * /pedido:
   *   put:
   *     summary: Altera um pedido
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     parameters:
   *       - in: query
   *         required: true
   *         name: numeroPedido
   *         default: SP-05-SEG-11052020
   *         type: string
   *       - in: query
   *         required: true
   *         name: codigoFilial
   *         default: 38
   *         type: string
   *       - in: body
   *         name: pedido
   *         description: Pedido a ser alterado
   *         example:
   *           numeroPedido: SP-05-SEG-11052020
   *           codigoFilial: 38
   *           codigoMotorista1: 1111
   *           codigoMotorista2: 1111
   *           placa1: AAA1212
   *           placa2: AAA1212
   *           placa3: AAA1212
   *           placa4: AAA1212
   *           dataSaida: 12/12/2000
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: pedido
   */

/**
   * @swagger
   * /pedido/mapaSinotico:
   *   put:
   *     summary: Obter o mapa sinótico detalhado
   *     content:
   *       application/json:
   *     tags: [Pedido]
   *     parameters:
   *       - in: query
   *         required: true
   *         name: numeroPedido
   *         default: 98040
   *         type: string
   *       - in: query
   *         required: true
   *         name: codigoFilial
   *         default: 38
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: pedido
   */
