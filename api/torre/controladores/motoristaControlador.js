import express from 'express'
import autenticacaoServico from '../servicos/autenticacaoServico'
import motoristaServico from '../servicos/motoristaServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listar(req)
  res.status(200).json(vRetorno)
}))

router.post('/dadosComplementares', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.incluirOuAtualizar(req.body)
  res.status(200).json(vRetorno)
}))

router.get('/:pHubIdMotorista/dadosComplementares', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.obterDadosComplementares(req.params.pHubIdMotorista)
  res.status(200).json(vRetorno)
}))

router.get('/classificacao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarClassificacao(req)
  res.status(200).json(vRetorno)
}))

router.get('/statusGestorRisco', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarStatusGestorRisco(req)
  res.status(200).json(vRetorno)
}))

router.get('/situacao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarSituacao(req)
  res.status(200).json(vRetorno)
}))

router.get('/:pMotoristaCodigo/dadosPessoais', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.obterDadosPessoais(req.params.pMotoristaCodigo)
  res.status(200).json(vRetorno)
}))

router.get('/:pMotoristaCodigo/outrasInformacoes', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.obterOutrasInformacoes(req.params.pMotoristaCodigo)
  res.status(200).json(vRetorno)
}))

router.get('/:pMotoristaCodigo/documentacao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.obterDocumentacao(req.params.pMotoristaCodigo)
  res.status(200).json(vRetorno)
}))

router.get('/:pMotoristaCodigo/ocorrencias', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarOcorrencias(req.params.pMotoristaCodigo, req)
  res.status(200).json(vRetorno)
}))

router.get('/:pMotoristaCodigo/cursosLicencas/vencido', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarCursosLicencas(req.params.pMotoristaCodigo, 'vencido', req)
  res.status(200).json(vRetorno)
}))

router.get('/:pMotoristaCodigo/cursosLicencas/valido', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarCursosLicencas(req.params.pMotoristaCodigo, 'valido', req)
  res.status(200).json(vRetorno)
}))

router.get('/:pMotoristaCodigo/gerenciamentoRisco', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarGerenciamentoRisco(req.params.pMotoristaCodigo, req)
  res.status(200).json(vRetorno)
}))

router.get('/:pMotoristaCodigo/anexo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarAnexo(req.params.pMotoristaCodigo)
  res.status(200).json(vRetorno)
}))

router.get('/anexo/:pHubAnexoId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.obterAnexo(req.params.pHubAnexoId)
  res.status(200).json(vRetorno)
}))

export default router

// #region /motorista
/**
   * @swagger
   * /motorista:
   *   get:
   *     summary: Listagem dos Motoristas
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: ordenacao
   *         description: Campo para ordenação Ex - codigoMotorista,nomeMotorista,numeroCPF,codigoClassificacao,descricaoClassificacao,descricaoSituacao
   *         type: string
   *       - in: query
   *         required: false
   *         name: pagina
   *         default: 20
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         type: string
   *       - in: query
   *         required: false
   *         name: direcao
   *         type: string
   *         description: asc ou desc
   *       - in: query
   *         required: false
   *         name: codigoMotorista
   *         description: código do motorista
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoClassificacao
   *         description: Código da Classificação do Motorista
   *         type: string
   *       - in: query
   *         required: false
   *         name: nomeMotorista
   *         description: Nome do Motorista
   *         type: string
   *       - in: query
   *         required: false
   *         name: numeroCPF
   *         description: número do CPF
   *         type: string
   *       - in: query
   *         required: false
   *         name: identificacaoStatusGestoraRisco
   *         description: Status Gestora de Risco
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoSituacao
   *         description: Código da Situação A - Ativo, I - Inativo, L - AGUARDANDO LIBERACAO
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/dadosComplementares
/**
   * @swagger
   * /motorista/dadosComplementares:
   *   post:
   *     summary: Dados Complementares
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: usuario
   *         description: Usuario a ser inserido
   *         example:
   *           codigoMotorista: 10
   *           valorSalarioBase: 10
   *           valorTotalEncargos: 20
   *           valorTotalBeneficios: 30
   *           quantidadeHorasExtras: 40
   *           codigoSegurancaCNH: 12345478900
   *           valorCafeManha: 123.00
   *           valorAlmoco: 20.00
   *           valorJantar: 20.00
   *           valorPerNoite: 22.00
   *     responses:
   *       200:
   *         description: mmotorista
   */
// #endregion

// #region /motorista/{hubMotoristaId}/dadosComplementares
/**
   * @swagger
   * /motorista/{hubMotoristaId}/dadosComplementares:
   *   get:
   *     summary: Dados Complementares
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: hubMotoristaId
   *         type: string
   *     responses:
   *       200:
   *         description: mmotorista
   */
// #endregion

// #region /motorista/classificacao
/**
   * @swagger
   * /motorista/classificacao:
   *   get:
   *     summary: Listagem das classificações do motorista
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: ordenacao
   *         description:
   *         type: string
   *       - in: query
   *         required: false
   *         name: pagina
   *         default: 20
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         type: string
   *       - in: query
   *         required: false
   *         name: direcao
   *         type: string
   *         description: asc ou desc
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/statusGestorRisco
/**
   * @swagger
   * /motorista/statusGestorRisco:
   *   get:
   *     summary: Listagem dos status de gestor de risco
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: ordenacao
   *         description:
   *         type: string
   *       - in: query
   *         required: false
   *         name: pagina
   *         default: 20
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         type: string
   *       - in: query
   *         required: false
   *         name: direcao
   *         type: string
   *         description: asc ou desc
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/situacao
/**
   * @swagger
   * /motorista/situacao:
   *   get:
   *     summary: Listagem das situações do motorista
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: ordenacao
   *         description:
   *         type: string
   *       - in: query
   *         required: false
   *         name: pagina
   *         default: 20
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         type: string
   *       - in: query
   *         required: false
   *         name: direcao
   *         type: string
   *         description: asc ou desc
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/{pMotoristaCodigo}/dadospessoais
/**
   * @swagger
   * /motorista/{pMotoristaCodigo}/dadospessoais:
   *   get:
   *     summary: Dados pessoais do motorista
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pMotoristaCodigo
   *         default: 123
   *         description:
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/{pMotoristaCodigo}/outrasInformacoes
/**
   * @swagger
   * /motorista/{pMotoristaCodigo}/outrasInformacoes:
   *   get:
   *     summary: Outras informações do motorista
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pMotoristaCodigo
   *         default: 123
   *         description:
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/{pMotoristaCodigo}/documentacao
/**
   * @swagger
   * /motorista/{pMotoristaCodigo}/documentacao:
   *   get:
   *     summary: Documentação do motorista
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         default: 123
   *         name: pMotoristaCodigo
   *         description:
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/{pMotoristaCodigo}/ocorrencias
/**
   * @swagger
   * /motorista/{pMotoristaCodigo}/ocorrencias:
   *   get:
   *     summary: Ocorrências do motorista
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pMotoristaCodigo
   *         default: 123
   *         description:
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/{pMotoristaCodigo}/cursosLicencas/vencido
/**
   * @swagger
   * /motorista/{pMotoristaCodigo}/cursosLicencas/vencido:
   *   get:
   *     summary: Ocorrências do motorista
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pMotoristaCodigo
   *         default: 4669
   *         description:
   *         type: string
   *       - in: query
   *         name: dataInicialValidade
   *         description: Data Inicial Validade (Formato YYYY-MM-DD)
   *         type: string
   *       - in: query
   *         name: dataFinalValidade
   *         description: Data Final Validade (Formato YYYY-MM-DD)
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/{pMotoristaCodigo}/cursosLicencas/valido
/**
   * @swagger
   * /motorista/{pMotoristaCodigo}/cursosLicencas/valido:
   *   get:
   *     summary: Licenças válidas do motorista
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: false
   *         name: pMotoristaCodigo
   *         default: 4669
   *         description:
   *         type: string
   *       - in: query
   *         name: dataInicialValidade
   *         description: Data Inicial Validade (Formato YYYY-MM-DD)
   *         type: string
   *       - in: query
   *         name: dataFinalValidade
   *         description: Data Final Validade (Formato YYYY-MM-DD)
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/{pMotoristaCodigo}/gerenciamentoRisco
/**
   * @swagger
   * /motorista/{pMotoristaCodigo}/gerenciamentoRisco:
   *   get:
   *     summary: Obtém a listagem do histórico referente ao gerenciamento de Risco
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pMotoristaCodigo
   *         default: 3458
   *         description:
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/{motoristaId}/anexo
/**
   * @swagger
   * /motorista/{motoristaId}/anexo:
   *   get:
   *     summary: Ocorrências do motorista
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: motoristaId
   *         default: 182
   *         description: id do Motorista no Hub
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion

// #region /motorista/anexo/{hubAnexoId}
/**
   * @swagger
   * /motorista/anexo/{hubAnexoId}:
   *   get:
   *     summary: Ocorrências do motorista
   *     content:
   *       application/json:
   *     tags: [Motorista]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: hubAnexoId
   *         default: 182
   *         description: id do Anexo no Hub
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
// #endregion
