import Base from './base/baseRepositorio'

require('../modelos/veiculoClassificacao')

class veiculoClassificacaoRepositorio {
  constructor() {
    this.baseRepositorio = new Base('torreVeiculoClassificacao')
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async listarClassificacaoUsaCombustivel() {
    return this.baseRepositorio.listar({}, { usaCombustivel: true, ativo: true })
  }

  async incluir(pDados, pOptions) {
    return this.baseRepositorio.incluir(pDados, pOptions)
  }

  async verificarClassificacao(pCodigoClassificacao) {
    const vRetorno = (this.baseRepositorio.obterUm({ codigoClassificacao: pCodigoClassificacao, ativo: true })).dados

    if (!vRetorno) return { habiltar: false }
    return { habiltar: true }
  }
}

export default veiculoClassificacaoRepositorio
