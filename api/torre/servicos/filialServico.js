import urlHub from '../configuracao/hub'
import baseServico from './base/baseServico'

function listar (req) {
  const vUrl = `${urlHub.filial}`
  return baseServico.hubListar(vUrl, req.query)
}

function listarPorEmpresa (pReq, pEmpresaId) {
  const vUrl = `${urlHub.empresa}`
  return baseServico.hubListar(`${vUrl}/${pEmpresaId}/filial`, pReq.query)
}

function obter (pFilialCodigo) {
  const vUrl = `${urlHub.filial}`
  return baseServico.hubObter(vUrl, pFilialCodigo)
}

const functions = {
  listar: (req) => listar(req),
  listarPorEmpresa: (req, pEmpresaId) => listarPorEmpresa(req, pEmpresaId),
  obter: (pFilialCodigo) => obter(pFilialCodigo),
}

export default functions
