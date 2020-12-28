import Base from './base/baseRepositorio'

require('../modelos/usuario')

class autenticacaoRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreUsuario')
  }

  async loginTentativaErroZerar (pLogin) {
    return this.baseRepositorio.alterarUm({ login: pLogin }, { loginTentativaErro: 0, dataBloqueio: null }, {})
  }

  async bloquear (pLogin) {
    return this.baseRepositorio.alterarUm({ login: pLogin }, { status: false, dataBloqueio: new Date() }, {})
  }

  async loginTentativaErroIncrementar (pLogin) {
    const vUsuario = (await this.baseRepositorio.obterUm({ login: pLogin })).dados
    const vQtdTentativa = vUsuario.loginTentativaErro ? vUsuario.loginTentativaErro : 0
    return this.baseRepositorio.alterarUm({ login: pLogin }, { loginTentativaErro: vQtdTentativa + 1 }, { upsert: false, multi: true })
    // return this.baseRepositorio.alterarUm({ login: pLogin }, { $inc: { loginTentativaErro: 1 } }, {})
  }
}

export default autenticacaoRepositorio
