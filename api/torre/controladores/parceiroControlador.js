import express from 'express'
import parceiroServico from '../servicos/parceiroServico'
import parceiroRotaServico from '../servicos/parceiroRotaServico'
import parceiroCustoOperacaoServico from '../servicos/parceiroCustoOperacaoServico'
import parceiroClassificacaoServico from '../servicos/parceiroClassificacaoServico'
import parceiroTempoMovimentoServico from '../servicos/parceiroTempoMovimentoServico'
import parceiroTempoLimiteServico from '../servicos/parceiroTempoLimiteServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroServico.listar(req)
  res.status(200).json(result)
}))

router.get('/:pParceiroId/contato', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroServico.contatos(req.params.pParceiroId)
  return res.status(200).json(result)
}))

router.get('/:pParceiroId/contato/:pContatoId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroServico.obterContato(req.params.pParceiroId, req.params.pContatoId)
  return res.status(200).json(result)
}))

// Rotas do Parceiro
router.get('/:pParceiroId/rota', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroRotaServico.listar(req.params.pParceiroId, req.query)
  return res.status(200).json(result)
}))

router.get('/:pParceiroId/rotadetalhe', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroRotaServico.listarRotaDetalhe(req.params.pParceiroId, req.query)
  return res.status(200).json(result)
}))

router.get('/:pParceiroId/rota/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroRotaServico.obter(req.params.pId)
  return res.status(200).json(result)
}))

router.post('/rota', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroRotaServico.incluir(req.body)
  return res.status(200).json(result)
}))

router.delete('/rota/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroRotaServico.excluir(req.params.pId)
  return res.status(200).json(result)
}))

router.put('/rota/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroRotaServico.alterar(req.params.pId, req.body)
  return res.status(200).json(result)
}))

// Fim Rotas do Parceiro

router.get('/:pParceiroId/tempolimiteaceite', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroTempoLimiteServico.listar(req.params.pParceiroId)
  return res.status(200).json(result)
}))

router.get('/:pParceiroId/tempolimiteaceite/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroTempoLimiteServico.obter(req.params.pId)
  return res.status(200).json(result)
}))

router.post('/tempolimiteaceite', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroTempoLimiteServico.incluir(req.body)
  return res.status(200).json(result)
}))

router.delete('/tempolimiteaceite/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroTempoLimiteServico.excluir(req.params.pId)
  return res.status(200).json(result)
}))

router.put('/tempolimiteaceite/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroTempoLimiteServico.alterar(req.params.pId, req.body)
  return res.status(200).json(result)
}))

router.get('/:pHubParceiroId/tempomovimento', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroTempoMovimentoServico.listar(req.params.pHubParceiroId, req.query)
  return res.status(200).json(result)
}))

router.get('/:pParceiroId/tempomovimento/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroTempoMovimentoServico.obter(req.params.pId)
  return res.status(200).json(result)
}))

router.post('/tempomovimento', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroTempoMovimentoServico.incluir(req.body, {})
  return res.status(200).json(result)
}))

router.delete('/tempomovimento/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroTempoMovimentoServico.excluir(req.params.pId)
  return res.status(200).json(result)
}))

router.put('/tempomovimento/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroTempoMovimentoServico.alterar(req.params.pId, req.body, {})
  return res.status(200).json(result)
}))

router.get('/:pParceiroId/custooperacao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroCustoOperacaoServico.listar(req.params.pParceiroId, req.query)
  res.status(200).json(result)
}))

router.get('/:pParceiroId/custooperacao/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroCustoOperacaoServico.obter(req.params.pId)
  res.status(200).json(result)
}))

router.post('/custooperacao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroCustoOperacaoServico.incluir(req.body)
  res.status(200).json(result)
}))

router.delete('/custooperacao/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroCustoOperacaoServico.excluir(req.params.pId, {})
  res.status(200).json(result)
}))

router.put('/custooperacao/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroCustoOperacaoServico.alterar(req.params.pId, req.body)
  res.status(200).json(result)
}))

router.get('/classificacao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroClassificacaoServico.listar(req.query)
  return res.status(200).json(result)
}))

router.get('/classificacao/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroClassificacaoServico.obter(req.params.pId)
  return res.status(200).json(result)
}))

router.post('/classificacao/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroClassificacaoServico.incluir(req.body)
  return res.status(200).json(result)
}))

router.delete('/classificacao/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroClassificacaoServico.deletar(req.params.pId)
  return res.status(200).json(result)
}))

router.put('/classificacao/:pId/alterar', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroClassificacaoServico.alterar(req.params.pId, req.body)
  return res.status(200).json(result)
}))

router.get('/:pParceiroId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await parceiroServico.detalhes(req.params.pParceiroId, req)
  return res.status(200).json(result)
}))

export default router


/**
   * @swagger
   * /parceiro:
   *   get:
   *     summary: Listagem dos parceiros
   *     content:
   *       application/json:
   *     tags: [Parceiro]
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
   *         description: parceiro
   */

/**
   * @swagger
   * /parceiro/{pParceiroId}/contato:
   *   get:
   *     summary: Contatos de um parceiro
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pParceiroId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: parceiro
   */

/**
   * @swagger
   * /parceiro/{pParceiroId}/contato/{pContatoId}:
   *   get:
   *     summary: Obter o contato pelo id
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pContatoId
   *         default: 754
   *         type: string
   *     responses:
   *       200:
   *         description: parceiro
   */
/*


/**
   * @swagger
   * /parceiro/{pParceiroId}/rota:
   *   get:
   *     summary: Obter as rotas de um parceiro
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pParceiroId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: parceiro
   */


/**
   * @swagger
   * /parceiro/{pParceiroId}/rotadetalhe:
   *   get:
   *     summary: Obter o detalhe de uma rota
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pParceiroId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: parceiro
   */

/**
   * @swagger
   * /parceiro/{pParceiroId}/rota/{pId}:
   *   get:
   *     summary: Obter o detalhe de uma rota
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pParceiroId
   *         default: 12
   *         type: string
   *       - in: path
   *         required: true
   *         name: pId
   *         default: 5eca63e196a28a15e0bfaf3a
   *         type: string
   *     responses:
   *       200:
   *         description: parceiro
   */

/**
   * @swagger
   * /parceiro/rota:
   *   post:
   *     summary: Gravar uma rota
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: rota
   *         description: Rota a ser atualizada
   *         example:
   *           hubParceiroId: 1232
   *           hubRotaId: 138
   *           identificaoSituacaoLinha: "true"
   *           codigoPontoInicial: "AAE"
   *           nomeMunicipioInicial: "CASCAVEL"
   *           codigoPontoFinal: "WNA"
   *           nomeMunicipioFinal: "MACAE"
   *     responses:
   *       200:
   *         description: rota
   */

/**
   * @swagger
   * /parceiro/rota/{rotaId}:
   *   delete:
   *     summary: Excluir uma rota
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: rotaId
   *         default: 5eca63e196a28a15e0bfaf3a
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/rota/{rotaId}:
   *   put:
   *     summary: Altera uma rota
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: rotaId
   *         default: 5eca63e196a28a15e0bfaf3a
   *         type: string
   *       - in: body
   *         name: rota
   *         description: Dados da rota a ser atualizada
   *         example:
   *           hubParceiroId: 1232
   *           hubRotaId: 138
   *           identificaoSituacaoLinha: "true"
   *           codigoPontoInicial: "AAE"
   *           nomeMunicipioInicial: "CASCAVEL"
   *           codigoPontoFinal: "WNA"
   *           nomeMunicipioFinal: "MACAE"
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/{pParceiroId}/tempolimiteaceite:
   *   get:
   *     summary: Obter os tempos limites de aceite
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pParceiroId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */
/*


/**
   * @swagger
   * /parceiro/{pParceiroId}/tempolimiteaceite/{pId}:
   *   get:
   *     summary: Obter os tempos limites de aceite pelo id
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pParceiroId
   *         default: 12
   *         type: string
   *       - in: path
   *         required: true
   *         name: pId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */
/*


/**
   * @swagger
   * /parceiro/tempolimiteaceite:
   *   post:
   *     summary: Insere um tempo limite de aceite
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: rota
   *         description: Dados do tempo limite de aceite
   *         example:
   *           hubParceiroId: 134
   *           tempoLimitePedidoAceite: "00:30"
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/tempolimiteaceite/{pId}:
   *   delete:
   *     summary: Excluir tempo limite de aceite
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: ok
   */
/*


/**
   * @swagger
   * /parceiro/tempolimiteaceite/{pId}:
   *   put:
   *     summary: Altera tempo limite de aceite
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         default: 12
   *         type: string
   *       - in: body
   *         name: rota
   *         description: Dados do tempo limite de aceite
   *         example:
   *           hubParceiroId: 134
   *           tempoLimitePedidoAceite: "00:30"
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/{pHubParceiroId}/tempomovimento:
   *   get:
   *     summary: obter tempo movimento
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pHubParceiroId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/{pParceiroId}/tempomovimento/{pId}:
   *   get:
   *     summary: obter tempo movimento
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pParceiroId
   *         default: 12
   *         type: string
   *       - in: path
   *         required: true
   *         name: pId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */

/**
   * @swagger
   * /parceiro/tempomovimento:
   *   post:
   *     summary: Incluir tempo movimento
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: rota
   *         description: Dados do tempo movimento
   *         example:
   *           hubParceiroId: 134
   *           hubFornecedorId: 489
   *           descricaoFornecedor: "FOTOGRAVURA ZEYANA LTDA"
   *           tempoAguardandoPatio: "16:12"
   *           tempoCarregamento: "09:00"
   *           tempoDescarga: "03:00"
   *           tempoEmissao: "02:00"
   *           tempoFornecedor: "11:00"
   *           tempoFreeTimeCliente: "10:00"
   *           tempoMaxCliente: "02:00"
   *           tempoSlaEntrega: "11:00"
   *           identificacaoClassificacaoVeiculo: 13
   *           descricaoClassificacaoVeiculo: "BI-TREM GRANELEIRO"
   *     responses:
   *       200:
   *         description: rota
   */

/**
   * @swagger
   * /parceiro/tempomovimento/{pId}:
   *   delete:
   *     summary: exclui tempo movimento
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */

/**
   * @swagger
   * /parceiro/tempomovimento/{pId}:
   *   put:
   *     summary: Atualizar tempo movimento
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         default: 12
   *         type: string
   *       - in: body
   *         name: rota
   *         description: Dados do tempo movimento
   *         example:
   *           hubParceiroId: 134
   *           hubFornecedorId: 489
   *           descricaoFornecedor: "FOTOGRAVURA ZEYANA LTDA"
   *           tempoAguardandoPatio: "16:12"
   *           tempoCarregamento: "09:00"
   *           tempoDescarga: "03:00"
   *           tempoEmissao: "02:00"
   *           tempoFornecedor: "11:00"
   *           tempoFreeTimeCliente: "10:00"
   *           tempoMaxCliente: "02:00"
   *           tempoSlaEntrega: "11:00"
   *           identificacaoClassificacaoVeiculo: 13
   *           descricaoClassificacaoVeiculo: "BI-TREM GRANELEIRO"
   *     responses:
   *       200:
   *         description: rota
   */

/**
   * @swagger
   * /parceiro/{pParceiroId}/custooperacao:
   *   get:
   *     summary: listar custos de operação por parceiro
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pParceiroId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */

/**
   * @swagger
   * /parceiro/{pParceiroId}/custooperacao/{pId}:
   *   get:
   *     summary: Obter custo de operação por id
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pParceiroId
   *         default: 12
   *         type: string
   *       - in: path
   *         required: true
   *         name: pId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/custooperacao:
   *   post:
   *     summary: Incluir custo de operação
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: rota
   *         description: Dados do custo de operação
   *         example:
   *           hubParceiroId: 134
   *           codigoTipoOperacao: "10"
   *           descricaoTipoOperacao: "teste descrição tipo operação"
   *           identificacaoClassificacaoVeiculo: 15
   *           descricaoClassificacaoVeiculo: "Teste Classificação Veículo"
   *           valorCustoFreeTime": "2.52"
   *           tempoLimitePedidoAceite": "00:30"
   *     responses:
   *       200:
   *         description: rota
   */

/**
   * @swagger
   * /parceiro/custooperacao/{pId}:
   *   delete:
   *     summary: exclui custo de operação
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         default: 12
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/custooperacao/{pId}:
   *   put:
   *     summary: Alterar custo de operação
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         type: string
   *       - in: body
   *         name: rota
   *         description: Dados do custo de operação
   *         example:
   *           hubParceiroId: 134
   *           codigoTipoOperacao: "10"
   *           descricaoTipoOperacao: "teste descrição tipo operação"
   *           identificacaoClassificacaoVeiculo: 15
   *           descricaoClassificacaoVeiculo: "Teste Classificação Veículo"
   *           valorCustoFreeTime": "2.52"
   *           tempoLimitePedidoAceite": "00:30"
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/classificacao:
   *   get:
   *     summary: Listar Classificações do Parceiro
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/classificacao/{pId}:
   *   get:
   *     summary: Obter classificações do Parceiro
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/classificacao:
   *   post:
   *     summary: Incluir classificação
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: classificação
   *         description: Dados da classificação
   *         example:
   *           identificacaoClassificacao: 1
   *           descricaoClassificacao: "CLIENTE"
   *     responses:
   *       200:
   *         description: classificação
   */


/**
   * @swagger
   * /parceiro/classificacao/{pId}:
   *   delete:
   *     summary: Excluir classificação
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         type: string
   *     responses:
   *       200:
   *         description: rota
   */


/**
   * @swagger
   * /parceiro/classificacao/{pId}/alterar:
   *   put:
   *     summary: Alterar classificação
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         type: string
   *       - in: body
   *         name: classificação
   *         description: Dados da classificação
   *         example:
   *           identificacaoClassificacao: 1
   *           descricaoClassificacao: "CLIENTE"
   *     responses:
   *       200:
   *         description: classificação
   */


/**
   * @swagger
   * /parceiro/{pParceiroId}:
   *   get:
   *     summary: Obter parceiro
   *     content:
   *       application/json:
   *     tags: [Parceiro]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pParceiroId
   *         type: string
   *     responses:
   *       200:
   *         description: parceiro
   */
