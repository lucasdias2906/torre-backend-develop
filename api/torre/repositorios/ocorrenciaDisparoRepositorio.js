import Base from './base/baseRepositorio'

require('../modelos/ocorrenciaDisparo')

export default class OcorrenciaDisparoRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreOcorrenciaDisparo')
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
