import BaseRepositorio from './base/baseRepositorio'
import PedidoMonitoramentoCheckpoint from '../modelos/pedidoMonitoramentoCheckpoint'

export default class PedidoMonitoramentoRepositorio {
  constructor () {
    this.baseRepositorio = new BaseRepositorio('torrePedidoMonitoramentoCheckpoint')
  }

  async obter (id) {
    return this.baseRepositorio.obter(id)
  }

  async excluirCheckpointsPorLinha (pLinha) {
    return this.baseRepositorio.excluirVarios({ CODLIN: pLinha })
  }

  async listarPorLinha (pLinha) {
    return this.baseRepositorio.listar({ pagina: 0, limite: 999999 }, { CODLIN: pLinha })
  }

  async listar () {
    return this.baseRepositorio.listar({ pagina: 0, limite: 999999 }, {})
  }

  async incluir (body) {
    const pedidoMonitoramento = new PedidoMonitoramentoCheckpoint(body)
    return this.baseRepositorio.incluir(pedidoMonitoramento)
  }

  async alterar (vFiltro, data) {
    return this.baseRepositorio.alterarUm(vFiltro, data, {})
  }

  async excluir (_id) {
    return this.baseRepositorio.excluir({ _id: _id })
  }
}
