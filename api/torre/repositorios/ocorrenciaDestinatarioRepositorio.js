import Base from './base/baseRepositorio'

require('../modelos/ocorrenciaDestinatario')

export default class OcorrenciaDestinatarioRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreOcorrenciaDestinatario')
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
