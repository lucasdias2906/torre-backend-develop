import express from 'express'
import asyncMiddleware from '../funcoes/asyncMiddleware'
import empresaServico from '../servicos/empresaServico'
import filialServico from '../servicos/filialServico'
import autenticacaoServico from '../servicos/autenticacaoServico'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await empresaServico.listar(req)
  res.status(200).json(vRetorno)
}))

router.get('/:idEmpresaHub', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await empresaServico.obter(req.params.idEmpresaHub)
  res.status(200).json(vRetorno)
}))

router.get('/:idEmpresaHub/filial', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const vRetorno = await filialServico.listarPorEmpresa(req, req.params.idEmpresaHub)
  res.status(200).json(vRetorno)
}))

export default router

/**
   * @swagger
   * /empresa:
   *   get:
   *     summary: Listagem das empresas
   *     content:
   *       application/json:
   *     tags: [Empresas]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: codigoEmpresa
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoEmpresa
   *         type: string
   *     responses:
   *       200:
   *         description: empresa
   */


/**
   * @swagger
   * /empresa/{idEmpresaHub}:
   *   get:
   *     summary: obter empresa
   *     content:
   *       application/json:
   *     tags: [Empresas]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: idEmpresaHub
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: empresa
   */

/**
   * @swagger
   * /empresa/{idEmpresaHub}/filial:
   *   get:
   *     summary: listar filiais da empresa
   *     content:
   *       application/json:
   *     tags: [Empresas]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: idEmpresaHub
   *         type: string
   *       - in: query
   *         required: false
   *         name: codigoFilial
   *         type: string
   *       - in: query
   *         required: false
   *         name: nomeRazaoSocial
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: empresa
   */
