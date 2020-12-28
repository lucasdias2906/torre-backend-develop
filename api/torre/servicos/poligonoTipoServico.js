import PoligonoTipoRepositorio from '../repositorios/poligonoTipoRepositorio'

async function obter (pId) {
  const repositorio = new PoligonoTipoRepositorio()
  return repositorio.obter(pId)
}

async function listar (req) {
  const pParams = req.query
  const repositorio = new PoligonoTipoRepositorio()
  return repositorio.listar(pParams, {})
}

async function incluir (req) {
  const { body } = req
  const repositorio = new PoligonoTipoRepositorio()
  return repositorio.incluir(body)
}

async function alterar (pId, body) {
  const vFiltro = { _id: pId }
  const repositorio = new PoligonoTipoRepositorio()
  const vPoligono = await repositorio.alterar(vFiltro, body)
  return vPoligono
}

async function excluir (pId) {
  const repositorio = new PoligonoTipoRepositorio()
  return repositorio.excluir(pId)
}

const functions = {
  obter: (pId, req) => obter(pId, req),
  listar: (req) => listar(req),
  incluir: (req) => incluir(req),
  alterar: (pId, body) => alterar(pId, body),
  excluir: (pId) => excluir(pId),
}

export default functions
