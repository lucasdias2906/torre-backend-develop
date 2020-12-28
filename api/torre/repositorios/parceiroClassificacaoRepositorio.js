import Base from './base/baseRepositorio'

require('../modelos/parceiroClassificacao')

export default class parceiroClassificacaoRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreParceiroClassificacao')
  }

  async listar (pParams) {
    return this.baseRepositorio.listarV2(pParams)
  }

  async obter (pId) {
    return this.baseRepositorio.obterUm({ _id: pId })
  }

  async incluir (pDados) {
    return this.baseRepositorio.incluir(pDados)
  }
}
