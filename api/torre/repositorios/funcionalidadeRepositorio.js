import Base from './base/baseRepositorio'

require('../modelos/funcionalidade')

class funcionalidadeRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreFuncionalidade')
  }

  async incluir (data, pOptions) {
    return this.baseRepositorio.incluir(data, pOptions)
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }
}

export default funcionalidadeRepositorio
