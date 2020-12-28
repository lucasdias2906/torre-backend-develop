import express from 'express';
import ocorrenciaServico from '../servicos/ocorrenciaServico';

import asyncMiddleware from '../funcoes/asyncMiddleware';

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  const vRetorno = await ocorrenciaServico.listar(req);
  res.status(200).json(vRetorno);
}));

router.get('/:pTipoOcorrencia/ocorrencias', asyncMiddleware(async (req, res) => {
  const vRetorno = await ocorrenciaServico.listarPorTipoOcorrencia(req);
  res.status(200).json(vRetorno);
}));

export default router;
