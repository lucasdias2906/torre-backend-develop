import Base from './base/baseRepositorio'

require('../modelos/rotinaLog')

export default class RotinaLogRepositorio {
  constructor() {
    this.baseRepositorio = new Base('torreRotinaLog')
  }

  async incluir(pRotinaId, pLog) {
    const vLog = {
      rotinaId: pRotinaId,
      observacao: pLog,
    }
    return this.baseRepositorio.incluir(vLog)
  }
}
