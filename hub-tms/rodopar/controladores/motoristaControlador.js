import express from 'express';
import motoristaServico from '../servicos/motoristaServico';

import asyncMiddleware from '../funcoes/asyncMiddleware';

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listar(req, res);
  res.status(200).json(vRetorno);
}));

router.get('/statusGestorRisco',
  asyncMiddleware(async (req, res) => {
    const vRetorno = await motoristaServico.listarStatusGestorRisco(req);
    res.status(200).json(vRetorno);
  }));

router.get('/situacao', asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarSituacao(req);
  res.status(200).json(vRetorno);
}));

router.get('/totais', asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.obterTotais(req);
  res.status(200).json(vRetorno);
}));

router.get('/:pMotoristaCodigo/dadosPessoais', asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.obterDadosPessoais(req.params.pMotoristaCodigo, req);
  res.status(200).json(vRetorno);
}));

router.get('/:pMotoristaCodigo/outrasInformacoes', asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.obterOutrasInformacoes(req.params.pMotoristaCodigo, req);
  res.status(200).json(vRetorno);
}));

router.get('/:pMotoristaCodigo/documentacao', asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.obterDocumentacao(req.params.pMotoristaCodigo, req);
  res.status(200).json(vRetorno);
}));

router.get('/:pMotoristaCodigo/gerenciamentoRisco', asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarGerenciamentoRisco(req.params.pMotoristaCodigo, req);
  res.status(200).json(vRetorno);
}));

router.get('/:pMotoristaCodigo/anexo', asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.listarAnexo(req.params.pMotoristaCodigo, req);
  res.status(200).json(vRetorno);
}));

router.get('/anexo/:hubAnexoId', asyncMiddleware(async (req, res) => {
  const vRetorno = await motoristaServico.obterAnexo(req.params.hubAnexoId, req);
  res.status(200).json(vRetorno);
}));

export default router;
