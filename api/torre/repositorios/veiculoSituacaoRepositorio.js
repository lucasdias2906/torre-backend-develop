import Base from './base/baseRepositorio'

require('../modelos/veiculoSituacao')

export default class veiculoSituacaoRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreVeiculoSituacao')
  }

  async listar (filtro) {
    return this.baseRepositorio.listar(filtro)
  }

  async incluir (body) {
    return this.baseRepositorio.incluir(body)
  }

  async obterPelaDescricao (pDescricao) {
    return this.baseRepositorio.obterUm({ descricaoSituacaoVeiculo: pDescricao })
  }
}
