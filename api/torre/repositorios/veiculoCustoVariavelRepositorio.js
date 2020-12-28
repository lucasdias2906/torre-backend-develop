import Base from './base/baseRepositorio'
import CustoVariavel from '../modelos/veiculoCustoVariavel'

export default class veiculoCustoVariavelRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreVeiculoCustoVariavel')
  }

  async obter (id) {
    return this.baseRepositorio.obter(id)
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async incluir (body) {
    const custoVariavel = new CustoVariavel(body)
    return this.baseRepositorio.incluir(custoVariavel)
  }

  async alterar (_id, body) {
    return this.baseRepositorio.alterarUm({ _id: _id }, body, {})
  }

  async excluir (_id) {
    return this.baseRepositorio.excluir({ _id: _id })
  }
}
