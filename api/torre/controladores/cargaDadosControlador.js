import express from 'express'
import cargaDadosServico from '../servicos/cargaDados/cargaDadosServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/processar', asyncMiddleware(async (req, res) => {
  await cargaDadosServico.processar()
  return res.json({ ok: true })
}))

router.get('/inicializarTabelas', asyncMiddleware(async (req, res) => {
  if (req.query.codigo !== 'AXSD!231231') return res.json({ mensagem: 'Chave Inválida!' })
  await cargaDadosServico.inicializarTabelas()
  return res.json({ ok: true })
}))

router.get('/inicializarDadosTeste', asyncMiddleware(async (req, res) => {
  await cargaDadosServico.inicializarDadosTeste()
  return res.json({ ok: true })
}))

router.get('/fakeRastreador/placa/:pPlaca/latitude/:pLatitude/longitude/:pLongitude', asyncMiddleware(async (req, res) => {
  const vPlaca = req.params.pPlaca
  const vLatitude = req.params.pLatitude
  const vLongitude = req.params.pLongitude
  const mongoose = require('mongoose')

  const vFakeGPS = {
    DATAHORA: new Date(),
    DESCRICAO: 'fake point gps',
    IDMENSAGEM: '21033333425',
    IDRASTREADOR: '321633',
    LATITUDE: vLatitude,
    LONGITUDE: vLongitude,
    PLACA: vPlaca,
    IGNICAO: 2,
    VELOCIDADE: 0,
  }

  await mongoose.connection.db.collection('_torreFakeGPS').findOneAndUpdate( { PLACA: vFakeGPS.PLACA } , {  $set: vFakeGPS } , { upsert: true})
  return res.json({ ok: true })
}))

export default router

/**
   * @swagger
   * /cargaDados/processar:
   *   get:
   *     tags: [Carga de Dados]
   *     description: Processa carga de dados inicial do sistema
   *     parameters:
   *       - in: query
   *         required: false
   *         name: chave
   *         type: string
   *     responses:
   *       200:
   *         description: hello world
   */

/**
   * @swagger
   * /cargaDados/inicializarTabelas:
   *   get:
   *     tags: [Carga de Dados]
   *     description: Processa carga de dados inicial do sistema
   *     parameters:
   *       - in: query
   *         required: true
   *         name: codigo
   *         type: string
   *     responses:
   *       200:
   *         description: ok
   */
