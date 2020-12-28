import urlHub from '../configuracao/hub'
import baseServico from './base/baseServico'

function listar (req) {
  const vUrl = `${urlHub.fornecedor}`
  return baseServico.hubListar(vUrl, req.query)
}

function detalhes (pFornecedorId, req) {
  const vUrl = `${urlHub.fornecedor}`
  return baseServico.hubListar(`${vUrl}/${pFornecedorId}`, req.query)
}

const functions = {
  listar: (pFornecedorId, req) => listar(pFornecedorId, req),
  detalhes: (pFornecedorId, req) => detalhes(pFornecedorId, req),
}

export default functions
