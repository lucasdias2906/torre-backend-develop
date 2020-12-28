import BaseRepositorio from './base/baseRepositorio'

require('../modelos/ocorrenciaStatus')

export default class OcorrenciaStatusRepositorio {
  constructor () {
    this.baseRepositorio = new BaseRepositorio('torreOcorrenciaStatus')
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
