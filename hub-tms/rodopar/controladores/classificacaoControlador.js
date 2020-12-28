import express from 'express';
import classificacaoServico from '../servicos/classificacaoServico';

import asyncMiddleware from '../funcoes/asyncMiddleware';

const router = express.Router();

router.get('/:pTipoClassificacao/classificacao', asyncMiddleware(async (req, res) => {
  const vRetorno = await classificacaoServico.listar(req);
  res.status(200).json(vRetorno);
}));

router.get('/:pTipoClassificacao/classificacao/:pCodigo', asyncMiddleware(async (req, res) => {
  const vRetorno = await classificacaoServico.obter(req.params.pTipoClassificacao, req.params.pCodigo, req);
  res.status(200).json(vRetorno);
}));

export default router;
