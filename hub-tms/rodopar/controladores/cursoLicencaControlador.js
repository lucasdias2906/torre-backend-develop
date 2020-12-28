import express from 'express';
import cursoLicencaServico from '../servicos/cursoLicencaServico';

import asyncMiddleware from '../funcoes/asyncMiddleware';

const router = express.Router();

router.get('/:pTipoValidade', asyncMiddleware(async (req, res) => {
  const vRetorno = await cursoLicencaServico.listar(req.params.pTipoValidade, req);
  res.status(200).json(vRetorno);
}));

export default router;
