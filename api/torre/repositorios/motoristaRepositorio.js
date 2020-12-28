import Base from './base/baseRepositorio'

require('../modelos/motorista')

class motoristaRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreMotorista')
  }

  async obterDadosComplementares (pHubMotoristaId) {
    return this.baseRepositorio.obterUm({ codigoMotorista: pHubMotoristaId })
  }

  async incluir (data, pOptions) {
    return this.baseRepositorio.incluir(data, pOptions)
  }

  async alterar (pHubMotoristaId, data, pOptions) {
    const vFiltro = { codigoMotorista: pHubMotoristaId }
    return this.baseRepositorio.alterarUm(vFiltro, data, pOptions)
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async obter (id) {
    const vPerfil = await this.baseRepositorio.obter(id)
    return vPerfil
  }
}

export default motoristaRepositorio
