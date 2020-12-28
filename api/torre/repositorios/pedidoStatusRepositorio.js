import Base from './base/baseRepositorio'

require('../modelos/pedidoStatus')

export default class pedidoStatusRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torrePedidoStatus')
  }

  async incluir (pDados, pOptions) {
    return this.baseRepositorio.incluir(pDados, pOptions)
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async obterPelaDescricao (pDescricao) {
    return this.baseRepositorio.obterUm({ descricao: pDescricao })
  }
}
