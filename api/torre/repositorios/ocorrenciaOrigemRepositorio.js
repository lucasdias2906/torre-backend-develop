import Base from './base/baseRepositorio'

require('../modelos/ocorrenciaOrigem')

export default class OcorrenciaOrigemRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreOcorrenciaOrigem')
  }

  async listar (filtro) {
    return this.baseRepositorio.listar(filtro)
  }

  async obter (id) {
    return this.baseRepositorio.obter(id)
  }

  async obterPelaDescricao (pDescricao) {
    return this.baseRepositorio.obterUm({ descricao: pDescricao })
  }
}
