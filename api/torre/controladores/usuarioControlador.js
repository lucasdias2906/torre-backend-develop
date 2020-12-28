import express from 'express'
import usuarioServico from '../servicos/usuarioServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.listar(req.query)
  res.json(vRetorno)
}))

router.get('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.obter(req.params.pId)
  res.json(vRetorno)
}))

router.post('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.incluir(req.body)
  res.json(vRetorno)
}))

router.put('/:pId', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.alterar(req.params.pId, req.body)
  res.json(vRetorno)
}))

router.get('/login/:pLogin', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.buscarPorLogin(req.params.pLogin)
  res.json(vRetorno)
}))

router.get('/obterporlogin/:pLogin/empresa/:pIdEmpresa', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.buscarEmpresaPorUsuario(req.params.pLogin, req.params.pIdEmpresa)
  res.json(vRetorno)
}))

router.get('/obterporlogin/:pLogin/empresa/:pIdEmpresa/filial', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.buscarFiliasPorUsuarioEmpresa(req.params.pLogin, req.params.pIdEmpresa)
  res.json(vRetorno)
}))

router.put('/:pId/alterarStatus', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.alterarStatus(req.params.pId)
  res.json(vRetorno)
}))

router.get('/:pId/permissao', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.permissaoListar(req.params.pId)
  res.json(vRetorno)
}))

router.get('/:pUsuarioId/permissao/empresa', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.permissaoListarEmpresa(req.params.pUsuarioId)
  res.json(vRetorno)
}))

router.get('/:pUsuarioId/permissao/parceiro', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.permissaoListarParceiro(req.params.pUsuarioId)
  res.json(vRetorno)
}))

router.get('/:pUsuarioId/modulo/:pModuloId/permissao', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.permissaoModuloListar(req.params.pUsuarioId, req.params.pModuloId)
  res.json({ dados: vRetorno })
}))

router.get('/confirmacao/:uuidConfirmacao', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.validarUsuario(req.params.uuidConfirmacao)
  res.status(200).json({ dados: vRetorno })
}))

router.put('/renovarUUID/:pUsuarioId', asyncMiddleware(async (req, res) => {
  const vRetorno = await usuarioServico.renovarUUID(req.params.pUsuarioId)
  res.status(200).json({ dados: vRetorno })
}))

export default router

/* */

/**
   * @swagger
   * /usuario:
   *   get:
   *     summary: Listagem dos usuários
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: nome
   *         type: string
   *       - in: query
   *         required: false
   *         name: login
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */

/**
   * @swagger
   * /usuario/{usuarioId}:
   *   get:
   *     summary: Obter usuário
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: false
   *         name: usuarioId
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */

/**
   * @swagger
   * /usuario:
   *   post:
   *     summary: Inclusão de usuário
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: usuario
   *         description: Usuario a ser inserido
   *         example:
   *           nome: "Bill Gates"
   *           login: "billgates"
   *           senha: "123456"
   *           email: "billgates@cuboconnect.com.br"
   *           celular: "123123123213"
   *           telefone: "123123123213"
   *           cpf: "123123123213"
   *           ehCliente: false
   *           sexo: "M"
   *           status: true
   *           dataNascimento: "1994-11-05T08:15:30-05:00"
   *           perfilId: "000000000000000000000001"
   *           permissoes: [
   *             {
   *             moduloId: "000000000000000000000001",
   *             funcionalidadeId: "000000000000000000000001",
   *             permiteAlterar: "true",
   *             permiteConsultar: "true"
   *             }
   *           ]
   *           empresas: [
   *            {
   *              hubEmpresaId: 1232,
   *              filiais: [
   *                {
   *                  hubFilialId: 123
   *                }
   *              ]
   *            }
   *           ]
   *           parceiros: [
   *             {
   *               hubParceiroId: 123
   *             }
   *           ]
   *     responses:
   *       200:
   *         description: empresa
   */

/**
   * @swagger
   * /usuario/{usuarioId}:
   *   put:
   *     summary: alteração de usuário
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *       - in: path
   *         name: usuarioId
   *         required: true
   *         description: Usuário
   *         type: string
   *     parameters:
   *       - in: body
   *         name: usuario
   *         description: Usuario a ser inserido
   *         example:
   *           nome: "Bill Gates"
   *           login: "billgates"
   *           senha: "123456"
   *           email: "billgates@cuboconnect.com.br"
   *           celular: "123123123213"
   *           telefone: "123123123213"
   *           cpf: "123123123213"
   *           ehCliente: false
   *           sexo: "M"
   *           status: true
   *           dataNascimento: "1994-11-05T08:15:30-05:00"
   *           perfilId: "000000000000000000000001"
   *           permissoes: [
   *             {
   *             moduloId: "000000000000000000000001",
   *             funcionalidadeId: "000000000000000000000001",
   *             permiteAlterar: "true",
   *             permiteConsultar: "true"
   *             }
   *           ]
   *           empresas: [
   *            {
   *              hubEmpresaId: 1232,
   *              filiais: [
   *                {
   *                  hubFilialId: 123
   *                }
   *              ]
   *            }
   *           ]
   *           parceiros: [
   *             {
   *               hubParceiroId: 123
   *             }
   *           ]
   *     responses:
   *       200:
   *         description: empresa
   */

/**
   * @swagger
   * /usuario/login/{pLogin}:
   *   get:
   *     summary: Obter usuário pelo login
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pLogin
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */

/**
   * @swagger
   * /usuario/obterporlogin/{pLogin}/empresa/{pIdEmpresa}:
   *   get:
   *     summary: /usuario/obterporlogin/{pLogin}/empresa/{pIdEmpresa}
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pLogin
   *         type: string
   *       - in: path
   *         required: true
   *         name: pIdEmpresa
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */

/**
   * @swagger
   * /usuario/obterporlogin/{pLogin}/empresa/{pIdEmpresa}/filial:
   *   get:
   *     summary: Listagem das filiais e empresa por login e empresa ID
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pLogin
   *         type: string
   *       - in: path
   *         required: true
   *         name: pIdEmpresa
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */

/**
   * @swagger
   * /usuario/{pUsuarioId}/permissao:
   *   get:
   *     summary: Obter permissões do usuário
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pUsuarioId
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */

/**
   * @swagger
   * /usuario/{pUsuarioId}/permissao/empresa:
   *   get:
   *     summary: Obter permissões de empresa do usuário
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pUsuarioId
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */

/**
   * @swagger
   * /usuario/{pUsuarioId}/permissao/parceiro:
   *   get:
   *     summary: Obter a listagem dos parceiros acessíveis pelo usuário
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pUsuarioId
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */


/**
   * @swagger
   * /{pUsuarioId}/modulo/{pModuloId}/permissao:
   *   get:
   *     summary: Obter a listagem das permissões por módulo
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pUsuarioId
   *         type: string
  *       - in: path
   *         required: true
   *         name: pUsuarioId
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */


/**
   * @swagger
   * /usuario/confirmacao/{uuidConfirmacao}:
   *   get:
   *     summary: Confirmar UUID do usuário
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: uuidConfirmacao
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */

/**
   * @swagger
   * /usuario/renovarUUID/{pUsuarioId}:
   *   put:
   *     summary: Atualiza UUIDConfirmacao, dataConfirmacao do usuario e notifica por e-mail a solicitação de troca de senha
   *     content:
   *       application/json:
   *     tags: [Usuário]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pUsuarioId
   *         type: string
   *     responses:
   *       200:
   *         description: usuario
   */
