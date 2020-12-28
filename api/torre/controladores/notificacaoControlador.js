import express from 'express'
import notificacaoServico from '../servicos/notificacaoServico'
import autenticacaoServico from '../servicos/autenticacaoServico'

import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await notificacaoServico.listar(req, 'T') // Todas
  res.status(200).json(vRetorno)
}))

router.get('/nao-lidas', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await notificacaoServico.listar(req, 'N') // Somente não lidas
  res.status(200).json(vRetorno)
}))

router.put('/:pNotificacaoId/lida', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  await notificacaoServico.marcarLido(req.params.pNotificacaoId, req.usuarioLogado._id)
  res.status(200).json()
}))

router.put('/:pNotificacaoId/nao-lida', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  await notificacaoServico.marcarNaoLido(req.params.pNotificacaoId, req.usuarioLogado._id)
  res.status(200).json()
}))

router.post('/:pNotificacaoId/enviarEmail', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  // TODO Avaliar o envio de e-mail
  const retorno = await notificacaoServico.enviarEmail(req.params.pNotificacaoId)
  res.status(200).json(retorno)
}))

export default router

/**
   * @swagger
   * /notificacao:
   *   get:
   *     summary: Listar notificações do usuário logado
   *     content:
   *       application/json:
   *     tags: [Notificação]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: notificacao
   */

/**
   * @swagger
   * /notificacao/nao-lidas:
   *   get:
   *     summary: Listar notificações não lidas
   *     content:
   *       application/json:
   *     tags: [Notificação]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: notificacao
   */


/**
   * @swagger
   * /notificacao/{pNotificacaoId}/lida:
   *   put:
   *     summary: Marcar notificação como lida
   *     content:
   *       application/json:
   *     tags: [Notificação]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pNotificacaoId
   *         description: _id da notificação
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: notificacao
   */


/**
   * @swagger
   * /notificacao/{pNotificacaoId}/nao-lida:
   *   put:
   *     summary: Marcar notificação como não lida
   *     content:
   *       application/json:
   *     tags: [Notificação]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pNotificacaoId
   *         description: _id da notificação
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: notificacao
   */

/**
   * @swagger
   * /notificacao/{pNotificacaoId}/enviarEmail:
   *   put:
   *     summary: Enviar email de notificação
   *     content:
   *       application/json:
   *     tags: [Notificação]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pNotificacaoId
   *         description: _id da notificação
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: notificacao
   */
