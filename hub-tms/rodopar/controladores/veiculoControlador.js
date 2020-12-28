import express from 'express';
import veiculoServico from '../servicos/veiculoServico';

import asyncMiddleware from '../funcoes/asyncMiddleware';

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  const vRetorno = await veiculoServico.listar(req);
  res.status(200).json(vRetorno);
}));

router.get('/marca', asyncMiddleware(async (req, res) => {
  const vRetorno = await veiculoServico.listarMarca(req);
  res.status(200).json(vRetorno);
}));

router.get('/totais', asyncMiddleware(async (req, res) => {
  const vRetorno = await veiculoServico.obterTotais(req);
  res.status(200).json(vRetorno);
}));

router.get('/:pCodigoVeiculo', asyncMiddleware(async (req, res) => {
  const vRetorno = await veiculoServico.obter(req.params.pCodigoVeiculo, req);
  res.status(200).json(vRetorno);
}));

router.get('/:pCodigoVeiculo/parametrosLicencas', asyncMiddleware(async (req, res) => {
  const vRetorno = await veiculoServico.obterParametrosLicencas(req.params.pCodigoVeiculo, req);
  res.status(200).json(vRetorno);
}));

router.get('/:pMarcaID/modelo', asyncMiddleware(async (req, res) => {
  const vRetorno = await veiculoServico.listarModelo(req.params.pMarcaID);
  res.status(200).json(vRetorno);
}));

export default router;
