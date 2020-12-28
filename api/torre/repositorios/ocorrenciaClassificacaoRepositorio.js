import BaseRepositorio from './base/baseRepositorio'

require('../modelos/ocorrenciaClassificacao')

export default class OcorrenciaClassificacaoRepositorio {
  constructor () {
    this.baseRepositorio = new BaseRepositorio('torreOcorrenciaClassificacao')
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
