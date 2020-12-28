import express from 'express';
import filialServico from '../servicos/filialServico';
import empresaServico from '../servicos/empresaServico';

import asyncMiddleware from '../funcoes/asyncMiddleware';

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  const vRetorno = await empresaServico.listar(req);
  res.status(200).json(vRetorno);
}));

router.get('/:pEmpresaId', asyncMiddleware(async (req, res) => {
  const vRetorno = await empresaServico.obter(req.params.pEmpresaId);
  res.status(200).json(vRetorno);
}));

router.get('/:pEmpresaId/filial', asyncMiddleware(async (req, res) => {
  const vRetorno = await filialServico.listarPorEmpresa(req, req.params.pEmpresaId);
  res.status(200).json(vRetorno);
}));

module.exports = router;
