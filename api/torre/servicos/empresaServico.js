import urlHub from '../configuracao/hub'
import baseServico from './base/baseServico'

function listar (vReq) {
  const vUrl = `${urlHub.empresa}`
  return baseServico.hubListar(vUrl, vReq.query)
}

function obter (pFilialCodigo) {
  const vUrl = `${urlHub.empresa}`
  return baseServico.hubObter(vUrl, pFilialCodigo)
}

const functions = {
  listar: (req) => { return listar(req) },
  obter: (pFilialCodigo) => { return obter(pFilialCodigo) }
}

export default functions
