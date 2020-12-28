import express from 'express'
import perfilServico from '../servicos/perfilServico'
import perfilPermissaoServico from '../servicos/perfilPermissaoServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await perfilServico.listar(req.query)
  res.status(200).json(vRetorno)
}))

router.get('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await perfilServico.obter(req.params.pId)
  res.status(200).json(vRetorno)
}))

router.post('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await perfilServico.incluir(req.body)
  res.status(200).json(vRetorno)
}))

router.put('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await perfilServico.alterar(req.params.pId, req.body)
  res.status(200).json(vRetorno)
}))

router.put('/:pId/alterarStatus', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await perfilServico.alterarStatus(req.params.pId)
  res.status(200).json(vRetorno)
}))

router.get('/:pId/permissao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await perfilPermissaoServico.listarPorPerfil(req.params.pId)
  res.status(200).json({ dados: vRetorno })
}))

router.put('/:pId/permissao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await perfilPermissaoServico.criar(req.params.pId, req.body)
  res.status(200).json({ dados: vRetorno })
}))

router.get('/:pPerfilId/modulo/:pModuloId/permissao', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vPerfilId = req.params.pPerfilId
  const vModuloId = req.params.pModuloId
  const vRetorno = await perfilPermissaoServico.listarPermissoesPorModulo(vPerfilId, vModuloId)
  res.status(200).json({ dados: vRetorno })
}))

export default router

/**
   * @swagger
   * /perfil:
   *   get:
   *     tags: [Perfil]
   *     description: Retorna os perfils
   *     parameters:
   *       - in: query
   *         name: descricao
   *         description: descrição
   *         type: string
   *     responses:
   *       200:
   *         description: ok
   */

/**
   * @swagger
   * /perfil/{perfilId}:
   *   get:
   *     tags: [Perfil]
   *     description: Obtém um perfil
   *     parameters:
   *       - in: path
   *         name: perfilId
   *         description: Perfil
   *         type: string
   *     responses:
   *       200:
   *         description: ok
   */

/**
   * @swagger
   * /perfil:
   *   post:
   *     summary: Insere um perfil
   *     content:
   *       application/json:
   *     tags: [Perfil]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: perfil
   *         description: Perfil a ser inserido
   *         example:
   *           nome: "Administrador"
   *           status: true,
   *           descricao: "Administradores com privilégio total"
   *           permissoes: [
   *            {
   *              perfilId: "5e00c1b3ef9b422a54182443",
   *              moduloId: "5e00c1b3ef9b422a54182443",
   *              funcionalidadeId: "5e00c1b3ef9b422a54182443",
   *              permiteAlterar: "true",
   *              permiteConsultar: "true"
   *            }
   *           ]
   *     responses:
   *       200:
   *         description: perfil
   */

/**
   * @swagger
   * /perfil/{perfilId}:
   *   put:
   *     summary: Altera um perfil
   *     content:
   *       application/json:
   *     tags: [Perfil]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: Perfil
   *         description: Perfil
   *         type: object
   *         example:
   *           nome: Modulo Teste
   *     responses:
   *       200:
   *         description: módulo
   */

/**
   * @swagger
   * /perfil/{perfilId}/alterarStatus:
   *   put:
   *     summary: Altera status do perfil
   *     content:
   *       application/json:
   *     tags: [Perfil]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: perfilId
   *         required: true
   *         description: Perfil
   *         type: string
   *     responses:
   *       200:
   *         description: perfil
   */

/**
   * @swagger
   * /perfil/{perfilId}/permissao:
   *   get:
   *     tags: [Perfil]
   *     description: Obtém um perfil
   *     parameters:
   *       - in: path
   *         name: perfilId
   *         required: true
   *         description: Perfil
   *         type: string
   *     responses:
   *       200:
   *         description: ok
   */

/**
   * @swagger
   * /perfil/{perfilId}/modulo/{moduloId}/permissao:
   *   get:
   *     tags: [Perfil]
   *     description: Obtém um perfil
   *     parameters:
   *       - in: path
   *         name: perfilId
   *         required: true
   *         description: Perfil
   *         type: string
   *       - in: path
   *         name: moduloId
   *         required: true
   *         description: Módulo
   *         type: string
   *     responses:
   *       200:
   *         description: ok
   */
