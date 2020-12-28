import Base from './base/baseRepositorio'

require('../modelos/parceiroCustoOperacao')

export default class parceiroCustoOperacaoRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreParceiroCustoOperacao')
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async obter (pId) {
    return this.baseRepositorio.obterUm({ _id: pId })
  }

  async incluir (pDados) {
    return this.baseRepositorio.incluir(pDados)
  }

  async excluir (pId, pOptions) {
    return this.baseRepositorio.excluir(pId, pOptions)
  }

  async alterar (pId, pBody, pOptions) {
    return this.baseRepositorio.alterar(pId, pBody, pOptions)
  }
}
