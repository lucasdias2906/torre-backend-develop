import Base from './base/baseRepositorio'
import Rastreador from '../modelos/rastreador'
import utilitarios from '../funcoes/utilitarios'

export default class RastreadorRepositorio {
  constructor() {
    this.baseRepositorio = new Base('torreLogRastreador')
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async obter(id) {
    const vRastreador = await this.baseRepositorio.obter(id)
    return vRastreador
  }

  async listarRastreador(pFiltro) {
    return Rastreador.find(pFiltro).sort({ sequenciaPonto: 'ASC' }).select({ pontos: 1, _id: 0 })
  }

  async incluir(body) {
    const rastreador = new Rastreador(body)

    return this.baseRepositorio.incluir(rastreador)
  }
  
  async expurgarLogsAntigos(qtdDiasExpurgo) {
    const vDataReferencia = utilitarios.obterDataCorrente()
    const vDataReferenciaParaExpurgo = vDataReferencia.clone().subtract(qtdDiasExpurgo, 'day')
    const vFiltro = { dataHora: { $lt: vDataReferenciaParaExpurgo } }

    return await this.baseRepositorio.excluirVarios(vFiltro)
  }
}
