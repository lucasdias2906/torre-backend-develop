import express from 'express'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.post('/autenticar/login', asyncMiddleware(async (req, res) => {
  const vRetorno = await autenticacaoServico.login(req.body)
  res.json({ dados: vRetorno })
}))

router.post('/autenticar/alterarSenha/:pUUID', asyncMiddleware(async (req, res) => {
  const vRetorno = await autenticacaoServico.alterarSenha(req)
  res.json({ dados: vRetorno })
}))

router.post('/autenticar/enviarEmail', asyncMiddleware(async (req, res) => {
  const vRetorno = await autenticacaoServico.enviarEmail(req.body)
  res.json({ dados: vRetorno })
}))

router.post('/autenticar/revalidarToken', asyncMiddleware(async (req, res) => {
  const vRetorno = await autenticacaoServico.revalidarToken(req, res)
  res.json({ dados: vRetorno })
}))

router.post('/autenticar/invalidarToken', asyncMiddleware(async (req, res) => {
  const vRetorno = await autenticacaoServico.invalidarToken(req)
  res.json({ dados: vRetorno })
}))

export default router


/**
   * @swagger
   * /autenticar/login:
   *   post:
   *     summary: Autenticação
   *     content:
   *       application/json:
   *     tags: [Autenticação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: Login
   *         type: object
   *         example:
   *           login: uTesteAutomatizado
   *           senha: "123456"
   *     responses:
   *       200:
   *         description: users
   */

/**
   * @swagger
   * /autenticar/alterarSenha/{pUUID}:
   *   post:
   *     summary: Efetua alteração da senha
   *     content:
   *       application/json:
   *     tags: [Autenticação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pUUID
   *         type: string
   *       - in: body
   *         name: Login
   *         type: object
   *         example:
   *           login: uTesteAutomatizado
   *           senha: "123456"
   *     responses:
   *       200:
   *         description: users
   */

/**
   * @swagger
   * /autenticar/enviarEmail:
   *   post:
   *     summary: Efetua envio do email do primeiro acesso
   *     content:
   *       application/json:
   *     tags: [Autenticação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: Login
   *         type: object
   *         example:
   *           login: uTesteAutomatizado
   *           senha: "123456"
   *     responses:
   *       200:
   *         description: users
   */

/**
   * @swagger
   * /autenticar/revalidarToken:
   *   post:
   *     summary: Faz a revalidação de um token
   *     content:
   *       application/json:
   *     tags: [Autenticação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: Login
   *         type: object
   *         example:
   *           token: "xxxxx"
   *     responses:
   *       200:
   *         description: users
   */

/**
   * @swagger
   * /autenticar/invalidarToken:
   *   post:
   *     summary: Faz a invalidação de um token
   *     content:
   *       application/json:
   *     tags: [Autenticação]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: Login
   *         type: object
   *         example:
   *           token: "xxxxx"
   *     responses:
   *       200:
   *         description: users
   */
