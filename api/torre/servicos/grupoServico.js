import urlHub from '../configuracao/hub'
import baseServico from './base/baseServico'
import empresaServico from './empresaServico'

function listar (pReqQuery) {
  const vUrl = `${urlHub.grupo}`
  return baseServico.hubListar(vUrl, pReqQuery)
}

async function listarEmpresas (pReqQuery) {
  const vReqQuery = pReqQuery
  return empresaServico.listar(vReqQuery)
}

function obter (pGrupoId) {
  const vUrl = `${urlHub.grupo}`
  return baseServico.hubObter(vUrl, pGrupoId)
}

const functions = {
  listar: (req) => listar(req),
  listarEmpresas: (req) => listarEmpresas(req),
  obter: (pGrupoId) => obter(pGrupoId),
}

export default functions
