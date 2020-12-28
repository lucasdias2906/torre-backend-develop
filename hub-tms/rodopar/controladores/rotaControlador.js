import express from 'express';
import rotaServico from '../servicos/rotaServico';

import asyncMiddleware from '../funcoes/asyncMiddleware';

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  const vRetorno = await rotaServico.listar(req, res);
  res.status(200).json(vRetorno);
}));

router.get('/:pRotaId', asyncMiddleware(async (req, res) => {
  const vRetorno = await rotaServico.obter(req.params.pRotaId, req);
  res.status(200).json(vRetorno);
}));

router.get('/:pRotaId/trecho', asyncMiddleware(async (req, res) => {
  const vRetorno = await rotaServico.listarTrechos(req.params.pRotaId, req);
  res.status(200).json(vRetorno);
}));

module.exports = router;
