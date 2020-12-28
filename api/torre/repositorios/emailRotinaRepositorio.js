import Base from './base/baseRepositorio'

require('../modelos/emailRotina')

class emailRotinaRepositorio {
  constructor() {
    this.baseRepositorio = new Base('torreEmailRotina')
  }

  async incluir(data, pOptions) {
    return this.baseRepositorio.incluir(data, pOptions)
  }

  async alterar(pId, pDados, pOptions) {
    return this.baseRepositorio.alterarUm({ _id: pId }, pDados, pOptions)
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }
}

export default emailRotinaRepositorio
