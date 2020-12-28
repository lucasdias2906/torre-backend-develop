import express from 'express'
import poligonoServico from '../servicos/poligonoServico'
import poligonoTipoServico from '../servicos/poligonoTipoServico'
import autenticacaoServico from '../servicos/autenticacaoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoServico.listar(req)
  res.status(200).json(retorno)
}))

router.post('/', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoServico.incluir(req)
  res.status(200).json(retorno)
}))

router.get('/:pCodigoPoligono/pontos', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoServico.listarPontos(req)
  res.status(200).json(retorno)
}))

router.get('/tipo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoTipoServico.listar(req)
  res.status(200).json(retorno)
}))

router.post('/tipo', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoTipoServico.incluir(req)
  res.status(200).json(retorno)
}))

router.get('/tipo/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoTipoServico.obter(req.params.pId, req)
  res.status(200).json(retorno)
}))

router.put('/tipo/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoTipoServico.alterar(req.params.pId, req.body)
  res.status(200).json(retorno)
}))

router.delete('/tipo/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoTipoServico.excluir(req.params.pId)
  res.status(200).json({ dados: retorno })
}))

router.get('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoServico.obter(req.params.pId, req)
  res.status(200).json({ dados: retorno })
}))

router.put('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoServico.alterar(req.params.pId, req.body)
  res.status(200).json(retorno)
}))

router.delete('/:pId', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoServico.excluir(req.params.pId)
  res.status(200).json({ dados: retorno })
}))

router.put('/:pId/alterarStatus', autenticacaoServico.validarToken, asyncMiddleware(async (req, res) => {
  const retorno = await poligonoServico.alterarStatus(req.params.pId, req)
  res.status(200).json(retorno)
}))

export default router

/**
   * @swagger
   * /poligono:
   *   get:
   *     summary: Listagem dos polígonos
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: query
   *         required: false
   *         name: codigoPoligono
   *         description: Código do poligono
   *         type: string
   *       - in: query
   *         required: false
   *         name: descricao
   *         description: Descrição do poligono
   *         type: string
   *       - in: query
   *         required: false
   *         name: tipoPoligonoId
   *         description: tipoPoligonoId _id do tipo poligono
   *         type: string
   *       - in: query
   *         required: false
   *         name: hubParceiroId
   *         description: hubParceiroId do parceiro
   *         type: string
   *       - in: query
   *         required: false
   *         name: limite
   *         default: 20
   *         type: string
   *     responses:
   *       200:
   *         description: poligono
   */

/**
   * @swagger
   * /poligono:
   *   post:
   *     summary: Insere um polígono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: poligono
   *         description: Polígono a ser incluído
   *         example:
   *           descricao: Área descanso Petrobrás
   *           tipoPoligonoId: 5e45a2e8a3993736a8a81125
   *           hubParceiroId: 1
   *           ativo: "true"
   *           pontos: [
   *             {
   *               sequenciaPonto: 1,
   *               latitude: "21.489879",
   *               longitude: "81.990986"
   *             },
   *             {
   *               sequenciaPonto: 2,
   *               latitude: "31.489879",
   *               longitude: "91.990986"
   *             },
   *             {
   *               sequenciaPonto: 3,
   *               latitude: "21.489879",
   *               longitude: "11.990986"
   *             }
   *           ]
   *     responses:
   *       200:
   *         description: rota
   */

/**
   * @swagger
   * /poligono/{pCodigoPoligono}/pontos:
   *   get:
   *     summary: Listagem dos pontos do polígono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pCodigoPoligono
   *         description: Código do poligono
   *         type: string
   *     responses:
   *       200:
   *         description: poligono
   */

/**
   * @swagger
   * /poligono/tipo:
   *   get:
   *     summary: Listagem dos tipos de poligono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: poligono
   */

/**
   * @swagger
   * /poligono/tipo:
   *   post:
   *     summary: Insere um tipo de polígono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     parameters:
   *       - in: body
   *         name: poligono
   *         description: Tipo do polígono a ser incluído
   *         example:
   *           descricao: Poligono Area
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: poligono
   */

/**
   * @swagger
   * /poligono/tipo/{pId}:
   *   get:
   *     summary: Listagem dos tipos de poligono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         description: _id do tipo do poligono
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: poligono
   */

/**
   * @swagger
   * /poligono/tipo/{pId}:
   *   put:
   *     summary: Listagem dos tipos de poligono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         description: _id do tipo do poligono
   *         type: string
   *       - in: body
   *         name: poligono
   *         description: Tipo do polígono a ser incluído
   *         example:
   *           descricao: Poligono Area
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: poligono
   */

/**
   * @swagger
   * /poligono/tipo/{pId}:
   *   delete:
   *     summary: Listagem dos tipos de poligono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         description: _id do poligono
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: poligono
   */

/**
   * @swagger
   * /poligono/{pId}:
   *   get:
   *     summary: Listagem dos tipos de poligono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         description: _id do poligono
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: poligono
   */


/**
   * @swagger
   * /poligono/{pId}:
   *   put:
   *     summary: Altera um polígono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         description: _id do poligono
   *         type: string
   *       - in: body
   *         name: poligono
   *         description: Polígono a ser incluído
   *         example:
   *           descricao: Área descanso Petrobrás
   *           tipoPoligonoId: 5e45a2e8a3993736a8a81125
   *           hubParceiroId: 1
   *           ativo: "true"
   *           pontos: [
   *             {
   *               sequenciaPonto: 1,
   *               latitude: "21.489879",
   *               longitude: "81.990986"
   *             },
   *             {
   *               sequenciaPonto: 2,
   *               latitude: "31.489879",
   *               longitude: "91.990986"
   *             },
   *             {
   *               sequenciaPonto: 3,
   *               latitude: "21.489879",
   *               longitude: "11.990986"
   *             }
   *           ]
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: poligono
   */


/**
   * @swagger
   * /poligono/{pId}:
   *   delete:
   *     summary: Excluí um polígono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         description: _id do poligono
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: poligono
   */


/**
   * @swagger
   * /poligono/{pId}/alterarStatus:
   *   put:
   *     summary: Altera status do polígono
   *     content:
   *       application/json:
   *     tags: [Polígonos]
   *     parameters:
   *       - in: path
   *         required: true
   *         name: pId
   *         description: _id do polígono
   *         type: string
   *     consumes:
   *       - application/json
   *     responses:
   *       200:
   *         description: poligono
   */
