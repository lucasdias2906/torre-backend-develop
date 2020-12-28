import Base from './base/baseRepositorio'

require('./../modelos/veiculoTipoVinculo')

export default class veiculoTipoVinculoRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreVeiculoTipoVinculo')
  }

  async listar (filtro) {
    return this.baseRepositorio.listar(filtro)
  }

  async incluir (pDados, pOptions) {
    return this.baseRepositorio.incluir(pDados, pOptions)
  }
}
