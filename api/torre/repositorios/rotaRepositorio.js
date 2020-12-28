import Base from './base/baseRepositorio'

require('../modelos/rotaDadoComplementar')

class rotaRepositorio {
  constructor() {
    this.baseRepositorio = new Base('torreRotaDadoComplementar')
  }

  async incluir(data, pOptions) {
    const vFiltro = { hubRotaId: data.hubRotaId, hubVeiculoClassificacaoId: data.hubVeiculoClassificacaoId }
    const vItem = await this.baseRepositorio.listar({}, vFiltro)
    if (vItem.dados.length > 0) return this.baseRepositorio.alterarUm(vFiltro, data, pOptions, {})
    return this.baseRepositorio.incluir(data, {})
  }

  async alterar(pRotaDadoComplementarId, data, pOptions) {
    const vFiltro = { _id: pRotaDadoComplementarId }
    return this.baseRepositorio.alterarUm(vFiltro, data, pOptions)
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async obter(id) {
    const vPerfil = await this.baseRepositorio.obter(id)
    return vPerfil
  }

  async excluir(id) {
    return this.baseRepositorio.excluir(id)
  }
}

export default rotaRepositorio
