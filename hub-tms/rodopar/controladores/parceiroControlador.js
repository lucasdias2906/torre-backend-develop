import express from 'express'
import parceiroServico from '../servicos/parceiroServico'

import asyncMiddleware from '../funcoes/asyncMiddleware'

const router = express.Router()

router.get('/', asyncMiddleware(async (req, res) => {
  const vRetorno = await parceiroServico.listaParceiros(req)
  res.status(200).json(vRetorno)
}))

/* router.get('/lista/:pCodigoParceiro', function (req, res) {
    console.log('obter parceiro - controler');
    parceiroServico
        .obter(req.params.pCodigoParceiro)
        .then(result => {
            return res.json(result);
        })
        .catch(err => {
            return res.status(400).json({ mensagem: err.message });
        });
}); */

router.get('/:pCodigoParceiro', asyncMiddleware(async (req, res) => {
  const vRetorno = await parceiroServico.listarDetalhes(req.params.pCodigoParceiro, req)
  res.status(200).json(vRetorno)
}))

router.get('/:pParceiroId/contato', asyncMiddleware(async (req, res) => {
  const vRetorno = await parceiroServico.listarContato(req.params.pParceiroId, req)
  res.status(200).json(vRetorno)
}))

router.get('/:pParceiroId/contato/:pContatoId', asyncMiddleware(async (req, res) => {
  const vRetorno = await parceiroServico.obterContato(req.params.pParceiroId, req.params.pContatoId, req)
  res.status(200).json(vRetorno)
}))

export default router
