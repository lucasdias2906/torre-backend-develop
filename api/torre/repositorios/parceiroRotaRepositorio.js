import Base from './base/baseRepositorio'

require('../modelos/parceiroRota')

export default class parceiroRotaRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreParceiroRota')
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async obter (pId) {
    return this.baseRepositorio.obterUm({ _id: pId })
  }

  async excluir (pId) {
    return this.baseRepositorio.excluir(pId, {})
  }

  async incluir (pDados) {
    return this.baseRepositorio.incluir(pDados)
  }

  async alterar (pId, pDados, pOptions) {
    return this.baseRepositorio.alterarUm({ _id: pId }, pDados, pOptions)
  }
}
