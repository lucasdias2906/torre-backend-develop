import express from 'express'
import PedidoServico from '../servicos/pedidoServico'
import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.post('/', asyncMiddleware(async (req, res) => {
  req.body.agrupar = 'S'
  const vRetorno = await PedidoServico.listar(req)
  res.status(200).json(vRetorno)
}))

router.post('/agrupados', asyncMiddleware(async (req, res) => { 
  const vRetorno = await PedidoServico.listarAgrupados(req)
  res.status(200).json(vRetorno)
}))

router.get('/obter', asyncMiddleware(async (req, res) => {
  const vRetorno = await PedidoServico.obter(req)
  res.status(200).json(vRetorno)
}))

router.get('/composicaoCarga', asyncMiddleware(async (req, res) => {
  const vRetorno = await PedidoServico.listarComposicaoCarga(req)
  res.status(200).json(vRetorno)
}))

router.get('/programacaoVeiculo', asyncMiddleware(async (req, res) => {
  const vRetorno = await PedidoServico.listarProgramacaoVeiculo(req)
  res.status(200).json(vRetorno)
}))

router.get('/pontosPassagem', asyncMiddleware(async (req, res) => {
  const vRetorno = await PedidoServico.listarPontosPassagemPedido(req)
  res.status(200).json(vRetorno)
}))

router.put('/fimDaViagem', asyncMiddleware(async (req, res) => {
  const vRetorno = await PedidoServico.registrarFimDaViagem(req)
  res.status(200).json(vRetorno)
}))

router.put('/', asyncMiddleware(async (req, res) => {
  const vRetorno = await PedidoServico.gerarProgramacaoVeiculo(req)
  res.status(200).json(vRetorno)
}))

router.get('/emViagem', asyncMiddleware(async (req, res) => {
  const vRetorno = await PedidoServico.listarPedidosEmViagem(req)
  res.status(200).json(vRetorno)
}))

router.get('/novosAndEmAlocacao', asyncMiddleware(async (req, res) => {
  const vRetorno = await PedidoServico.listarPedidosNovosAndEmAlocacao(req)
  res.status(200).json(vRetorno)
}))

router.get('/:pedidoNumero', asyncMiddleware(async (req, res) => {
  req.query.pedidoNumero = req.params.pedidoNumero
  req.query.agrupar = 'N'
  const vRetorno = await PedidoServico.listar(req)
  res.status(200).json(vRetorno)
}))

export default router
