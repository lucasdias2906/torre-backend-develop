import Base from './base/baseRepositorio'

export default class TokenRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreToken')
  }

  async obterUm (filtro) {
    return this.baseRepositorio.obterUm(filtro)
  }

  async incluir (token) {
    return this.baseRepositorio.incluir(token)
  }
}
