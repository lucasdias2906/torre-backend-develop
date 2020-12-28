import Base from './base/baseRepositorio'

require('../modelos/modulo')

class moduloRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreModulo')
  }

  async incluir (data, pOptions) {
    return this.baseRepositorio.incluir(data, pOptions)
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }
}

export default moduloRepositorio
