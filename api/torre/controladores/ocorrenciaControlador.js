import express from 'express'
import autenticacaoServico from '../servicos/autenticacaoServico'
import ocorrenciaServico from '../servicos/ocorrenciaServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await ocorrenciaServico.listarOcorrencias(req)
  res.status(200).json(vRetorno)
}))

router.get('/origemOcorrencia/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await ocorrenciaServico.listarOrigemOcorrencia(req)
  res.status(200).json(retorno)
}))

router.get('/disparoOcorrencia/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await ocorrenciaServico.listarDisparoOcorrencia(req)
  res.status(200).json(retorno)
}))

router.get('/classificacaoOcorrencia/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await ocorrenciaServico.listarClassificacaoOcorrencia(req)
  res.status(200).json(retorno)
}))

router.get('/prioridadeOcorrencia/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await ocorrenciaServico.listarPrioridadeOcorrencia(req)
  res.status(200).json(retorno)
}))

router.get('/destinatarioOcorrencia/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await ocorrenciaServico.listarDestinatarioOcorrencia(req)
  res.status(200).json(retorno)
}))

router.get('/statusOcorrencia/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await ocorrenciaServico.listarStatusOcorrencia(req)
  res.status(200).json(retorno)
}))

router.post('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await ocorrenciaServico.incluirOcorrenciaManual(req)
  res.status(200).json(retorno)
}))

router.get('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await ocorrenciaServico.obterOcorrencia(req.params.pId)
  return res.status(200).json(vRetorno)
}))

router.post('/:pId/acao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await ocorrenciaServico.incluirAcao(req.params.pId, req)
  res.status(200).json(retorno)
}))

router.post('/:pId/encerramento', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await ocorrenciaServico.encerrarOcorrencia(req.params.pId, req)
  res.status(200).json(retorno)
}))

export default router

/**
   * @swagger
   * /ocorrencia:
   *   get:
   *     summary: Listar ocorrência
   *     content:
   *       application/json:
   *     tags: [Ocorrencia]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: mmotorista
   */

/**
   * @swagger
   * /ocorrencia/{pId}:
   *   get:
   *     summary: Obter ocorrência
   *     content:
   *       application/json:
   *     tags: [Ocorrencia]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: pId
   *         description: id da ocorrência
   *         required: true
   *     responses:
   *       200:
   *         description: mmotorista
   */
