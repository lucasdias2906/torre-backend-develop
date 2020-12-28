import Base from './base/baseRepositorio'

require('../modelos/_logErro')

export default class logErroRepositorio {
  constructor () {
    this.baseRepositorio = new Base('_logErro')
  }

  async incluir (body) {
    return this.baseRepositorio.incluirLog(body, {})
  }
}
