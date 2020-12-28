import urlHub from '../configuracao/hub'
import baseServico from './base/baseServico'

// -- funções do hub -- //
function listar(req) {
  const vUrl = `${urlHub.parceiro}`
  return baseServico.hubListar(vUrl, req.query)
}

async function obter(pParceiroId, req) {
  const vUrl = `${urlHub.parceiro}`
  return baseServico.hubObter(vUrl, pParceiroId, req.query)
}

function detalhes(pParceiroId, req) {
  const vUrl = `${urlHub.parceiro}`
  return baseServico.hubListar(`${vUrl}/${pParceiroId}`, req.query)
}

async function contatos(pParceiroId) {
  const vUrl = `${urlHub.parceiro}`
  return baseServico.hubListar(`${vUrl}/${pParceiroId}/contato`)
}

function obterContato(pParceiroId, pContatoId, req) {
  const vUrl = `${urlHub.parceiro}`
  return baseServico.hubListar(`${vUrl}/${pParceiroId}/contato/${pContatoId}`)
}

const functions = {
  listar: (pParceiroId, req) => listar(pParceiroId, req),
  obter: (pParceiroId, req) => obter(pParceiroId, req),
  detalhes: (pParceiroId, req) => detalhes(pParceiroId, req),
  contatos: (pParceiroId) => contatos(pParceiroId),
  obterContato: (pParceiroId, pContatoId) => obterContato(pParceiroId, pContatoId),
}

export default functions
