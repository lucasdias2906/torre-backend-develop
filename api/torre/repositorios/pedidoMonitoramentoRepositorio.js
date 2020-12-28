import BaseRepositorio from './base/baseRepositorio'
import PedidoMonitoramento from '../modelos/pedidoMonitoramento'

export default class PedidoMonitoramentoRepositorio {
  constructor () {
    this.baseRepositorio = new BaseRepositorio('torrePedidoMonitoramento')
  }

  async obter (id) {
    return this.baseRepositorio.obter(id)
  }

  async obterPorPedidoAndFilial (pPedido, pFilial) {
    const filtro = { numeroPedido: pPedido, codigoFilial: pFilial }
    return this.baseRepositorio.obterUm(filtro)
  }

  async listarPendentesInformacaoNovosOrEmAlocacao () {
    return this.baseRepositorio.listar(
      {
        pagina: 0,
        limite: 5 },
      {
        statusMonitoramento: 'PENDENTE_INFORMACAO',
        tipoMonitoramento: 'NOVO_ALOCACAO'
      }
    )
  }

  async listarPendentesInformacaoEmViagem () {
    return this.baseRepositorio.listar(
      {
        pagina: 0,
        limite: 10 },
      {
        statusMonitoramento: 'PENDENTE_INFORMACAO',
        tipoMonitoramento: 'EM_VIAGEM'
      }
    )
  }

  async listarDisponiveisMonitoramentoNovosEmAlocacaoMaisAntigos () {
    return this.baseRepositorio.listar(
      {
        pagina: 0,
        limite: 5,
        ordenacao: 'qtdeAtualizacoes'
      },
      {
        statusMonitoramento: 'DISPONIVEL_MONITORAMENTO',
        tipoMonitoramento: 'NOVO_ALOCACAO'
      }
    )
  }

  async listarDisponiveisMonitoramentoEmViagemMaisAntigos () {
    return this.baseRepositorio.listar(
      {
        pagina: 0,
        limite: 5,
        ordenacao: 'qtdeAtualizacoes'
      },
      {
        statusMonitoramento: 'DISPONIVEL_MONITORAMENTO',
        tipoMonitoramento: 'EM_VIAGEM'
      }
    )
  }

  async listarDisponiveisMonitoramentoNovosOrEmAlocacao () {
    return this.baseRepositorio.listar(
      {
        pagina: 0,
        limite: 999999
      },
      {
        statusMonitoramento: 'DISPONIVEL_MONITORAMENTO',
        tipoMonitoramento: 'NOVO_ALOCACAO'
      }
    )
  }

  async listarDisponiveisMonitoramentoEmViagem () {
    return this.baseRepositorio.listar(
      {
        pagina: 0,
        limite: 999999
      },
      {
        statusMonitoramento: 'DISPONIVEL_MONITORAMENTO',
        tipoMonitoramento: 'EM_VIAGEM'
      }
    )
  }

  async listarLinhasTrecho () {
    return this.baseRepositorio.listarDistinct({}, 'codigoLinhaTrecho')
  }

  async listar () {
    return this.baseRepositorio.listar({ pagina: 0, limite: 999999 }, {})
  }

  async incluir (body) {
    const pedidoMonitoramento = new PedidoMonitoramento(body)
    return this.baseRepositorio.incluir(pedidoMonitoramento)
  }

  async alterar (vFiltro, data) {
    return this.baseRepositorio.alterarUm(vFiltro, data, {})
  }

  async excluir (_id) {
    return this.baseRepositorio.excluir({ _id: _id })
  }
}
