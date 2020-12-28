import Base from './base/baseRepositorio'

require('../modelos/regiaoOperacaoVigencia')

export default class RegiaoOperacaoVigenciaRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreRegiaoOperacaoVigencia')
  }

  async obter (id) {
    return this.baseRepositorio.obter(id)
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async incluir (body) {
    return this.baseRepositorio.incluir(body)
  }

  async alterar (_id, body) {
    return this.baseRepositorio.alterar({ _id: _id }, body, { runValidators: true, new: true })
  }

  async excluir (_id) {
    return this.baseRepositorio.excluir({ _id: _id })
  }
}
