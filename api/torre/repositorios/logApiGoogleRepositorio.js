import BaseRepositorio from './base/baseRepositorio'
import LogApiGoogle from '../modelos/logApiGoogle'
import utilitarios from '../funcoes/utilitarios'

export default class LogApiGoogleRepositorio {
  constructor () {
    this.baseRepositorio = new BaseRepositorio('torreLogApiGoogle')
  }

  async incluir (body) {
    const logApiGoogle = new LogApiGoogle(body)
    return this.baseRepositorio.incluir(logApiGoogle)
  }
  
  async expurgarLogsAntigos(qtdDiasExpurgo) {
    const vDataReferencia = utilitarios.obterDataCorrente()
    const vDataReferenciaParaExpurgo = vDataReferencia.clone().subtract(qtdDiasExpurgo, 'day')
    const vFiltro = { dataHora: { $lt: vDataReferenciaParaExpurgo } }

    return await this.baseRepositorio.excluirVarios(vFiltro)
  }
}
