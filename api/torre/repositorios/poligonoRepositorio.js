import Base from './base/baseRepositorio'
import Poligono from '../modelos/poligono'

export default class poligonoRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torrePoligono')
  }

  async obter (id) {
    return this.baseRepositorio.obter(id)
  }

  async obterPorTipoAndParceiro (pCodigoParceiro, pIdTipoPoligono) {
    return this.baseRepositorio.obterUm({ hubParceiroId: pCodigoParceiro, tipoPoligonoId: pIdTipoPoligono })
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async listarPontos (pFiltro) {
    return Poligono.find(pFiltro).sort({ sequenciaPonto: 'ASC' }).select({ pontos: 1, _id: 0 })
  }

  async incluir (body) {
    const poligono = new Poligono(body)
    return this.baseRepositorio.incluir(poligono)
  }

  async alterar (vFiltro, data) {
    return this.baseRepositorio.alterarUm(vFiltro, data, {})
  }

  async excluir (_id) {
    return this.baseRepositorio.excluir({ _id: _id })
  }


}
