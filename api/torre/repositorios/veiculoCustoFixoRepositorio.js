import Base from './base/baseRepositorio'
import VeiculoCustoFixo from '../modelos/veiculoCustoFixo';

export default class veiculoCustoFixoRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreVeiculoCustoFixo')
  }

  async obter (id) {
    return this.baseRepositorio.obter(id)
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async incluir (body) {
    const veiculoCustoFixo = new VeiculoCustoFixo(body)
    return this.baseRepositorio.incluir(veiculoCustoFixo)
  }

  async alterar (_id, body) {
    return this.baseRepositorio.alterar({ _id: _id }, body, { runValidators: true, new: true })
  }

  async excluir (_id) {
    return this.baseRepositorio.excluir({ _id: _id })
  }
}
