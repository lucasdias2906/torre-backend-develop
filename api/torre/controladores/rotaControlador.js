import express from 'express'
import asyncMiddleware from '../funcoes/asyncMiddleware'
import autenticacaoServico from '../servicos/autenticacaoServico'
import rotaServico from '../servicos/rotaServico'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await rotaServico.listar(req)
  return res.status(200).json(result)
}))

router.get('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await rotaServico.obter(req.params.pId, req)
  return res.status(200).json(result)
}))

router.post('/dadosComplementares', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await rotaServico.incluir(req.body)
  res.status(200).json(vRetorno)
}))

router.get('/:pHubIdRota/dadosComplementares', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await rotaServico.listarDadosComplementares(req.params.pHubIdRota, req)
  res.status(200).json(vRetorno)
}))

router.get('/dadosComplementares/:pDadoComplementarId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await rotaServico.obterDadosComplementar(req.params.pDadoComplementarId)
  res.status(200).json(vRetorno)
}))

router.put('/dadosComplementares/:pDadoComplementarId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await rotaServico.alterar(req.params.pDadoComplementarId, req.body)
  res.status(200).json(vRetorno)
}))

router.delete('/dadosComplementares/:pDadoComplementarId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await rotaServico.excluir(req.params.pDadoComplementarId)
  res.status(200).json(vRetorno)
}))

router.get('/:pId/trecho', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const result = await rotaServico.listarTrecho(req.params.pId, req)
  return res.status(200).json(result)
}))

export default router

/**
   * @swagger
   * /rota:
   *   get:
   *     summary: Listagem de rotas
   *     content:
   *       application/json:
   *     tags: [Rotas]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: codigoLinha
   *         description: Código da linha (Código da Rota)
   *         type: string
   *       - in: query
   *         required: false
   *         name: identificaoSituacaoLinha
   *         description: Identificação da Situação da Linha
   *         type: string
   *       - in: query
   *         required: false
   *         name: descricaoStatusLinha
   *         description: Descrição do status da linha
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoPontoInicial
   *         description: Codigo do ponto inicial
   *         type: string
   *       - in: query
   *         required: false
   *         name: nomeMunicipioInicial
   *         description: Nome do município inicial
   *         type: string
   *       - in: query
   *         required: false
   *         name: siglaUFMunicipioInicial
   *         description: Siga da UF do municipio inicial
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoPontoFinal
   *         description: Código do ponto inicial
   *         type: string
   *       - in: query
   *         required: false
   *         name: nomeMunicipioFinal
   *         description: Nome do município final
   *         type: string
   *       - in: query
   *         required: false
   *         name: siglaUFMunicipioFinal
   *         description: Siga da UF do municipio final
   *         type: string
   *       - in: query
   *         required: false
   *         name: ordenacao
   *         description: Campo para ordenação Ex - codigoLinha,identificaoSituacaoLinha,descricaoStatusLinha,codigoPontoInicial,nomeMunicipioInicial,siglaUFMunicipioInicial,codigoPontoFinal,nomeMunicipioFinal,siglaUFMunicipioFinal
   *         type: string
   *       - in: query
   *         required: false
   *         name: pagina
   *         description: Numero da pagina de retorno
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         description: Limite por pagina
   *         type: string
   *         default: 20
   *     responses:
   *       200:
   *         description: Rota
   */


/**
   * @swagger
   * /rota/{hubRotaId}:
   *   get:
   *     summary: Listagem das rotas
   *     content:
   *       application/json:
   *     tags: [Rotas]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: hubRotaId
   *         description: Código da linha (Código da rota no hub)
   *         type: string
   *     responses:
   *       200:
   *         description: Rota
   */


/**
   * @swagger
   * /rota/dadosComplementares:
   *   post:
   *     summary: Insere dados complementares de uma rota
   *     content:
   *       application/json:
   *     tags: [Rotas]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: dados da rota
   *         description: Dados da rota a ser inserida
   *         example:
   *           hubRotaId: 1
   *           hubVeiculoClassificacaoId: 1
   *           velocidadeMediaVazio: 129
   *           velocidadeMediaCarregado: 39
   *     responses:
   *       200:
   *         description: Rota
   */


/**
   * @swagger
   * /rota/{hubRotaId}/dadosComplementares:
   *   get:
   *     summary: Obtém os dados complementares da rota
   *     content:
   *       application/json:
   *     tags: [Rotas]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: hubRotaId
   *         description: Código da linha (Código da rota no hub)
   *         type: string
   *     responses:
   *       200:
   *         description: Rota
   */

/**
   * @swagger
   * /rota/dadosComplementares/{pDadoComplementarId}:
   *   get:
   *     summary: Obtém os dados complementares da rota
   *     content:
   *       application/json:
   *     tags: [Rotas]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pDadoComplementarId
   *         description: id do dado complementar da rota
   *         type: string
   *     responses:
   *       200:
   *         description: Rota
   */

/**
   * @swagger
   * /rota/dadosComplementares/{pDadoComplementarId}:
   *   put:
   *     summary: Altera os dados complementares da rota
   *     content:
   *       application/json:
   *     tags: [Rotas]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pDadoComplementarId
   *         description: id do dado complementar da rota
   *         type: string
   *       - in: body
   *         name: dados da rota
   *         description: Dados da rota a ser alterada
   *         example:
   *           hubRotaId: 1
   *           hubVeiculoClassificacaoId: 1
   *           velocidadeMediaVazio: 129
   *           velocidadeMediaCarregado: 39
   *     responses:
   *       200:
   *         description: Rota
   */


/**
   * @swagger
   * /rota/dadosComplementares/{pDadoComplementarId}:
   *   delete:
   *     summary: Exclui os dados complementares de uma rota
   *     content:
   *       application/json:
   *     tags: [Rotas]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pDadoComplementarId
   *         description: id do dado complementar a ser excluído
   *         type: string
   *     responses:
   *       200:
   *         description: Rota
   */

/**
   * @swagger
   * /rota/{pHubRotaId}/trecho:
   *   get:
   *     summary: Lista os trechos de uma rota
   *     content:
   *       application/json:
   *     tags: [Rotas]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pHubRotaId
   *         description: id da rota no hub
   *         type: string
   *       - in: query
   *         required: false
   *         name: ordenacao
   *         description: Campo para ordenação Ex - sequenciaTrecho,codigoTrecho,quantidadeKmsTrecho,tipoCalculo
   *         type: string
   *       - in: query
   *         required: false
   *         name: pagina
   *         description: Página a ser listada
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         description: limite de registros por página
   *         default: 20
   *         type: string
   *       - in: query
   *         required: false
   *         name: direcao
   *         description: asc ou desc
   *         type: string
   *     responses:
   *       200:
   *         description: Rota
   */
