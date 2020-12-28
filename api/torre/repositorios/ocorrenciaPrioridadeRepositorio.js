import BaseRepositorio from './base/baseRepositorio'

require('../modelos/ocorrenciaPrioridade')

export default class OcorrenciaPrioridadeRepositorio {
  constructor () {
    this.baseRepositorio = new BaseRepositorio('torreOcorrenciaPrioridade')
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
