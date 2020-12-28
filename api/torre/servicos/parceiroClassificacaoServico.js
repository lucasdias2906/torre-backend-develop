import _parceiroClassificacaoRepositorio from '../repositorios/parceiroClassificacaoRepositorio'

const parceiroClassificacaoRepositorio = new _parceiroClassificacaoRepositorio()

async function listar (pParams) {
  return parceiroClassificacaoRepositorio.listar(pParams)
}

async function incluir (body) {
  return parceiroClassificacaoRepositorio.incluir(body)
}

async function obter (pId) {
  return parceiroClassificacaoRepositorio.obter(pId)
}

function deletar (id) {
}

async function alterar (pId, body) {

}

const functions = {
  deletar: (id) => deletar(id),
  listar: (pParams) => listar(pParams),
  incluir: (body) => incluir(body),
  obter: (pId) => obter(pId),
  alterar: (pId, body) => alterar(pId, body),

}

export default functions
