import Base from './base/baseRepositorio'

import util from '../funcoes/utilitarios'

require('../modelos/rotina')

export default class RotinaRepositorio {
  constructor() {
    this.baseRepositorio = new Base('torreRotina')
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async obter(id) {
    return this.baseRepositorio.obter(id)
  }

  async existeRotinaNaoFinalizada(pRotinaTipo) {
    const vExisteRotinaNaoFinalizada = (await this.baseRepositorio.obterUm({ status: 'G', tipo: pRotinaTipo })).dados
    return vExisteRotinaNaoFinalizada != null
  }

  async incluir(pRotinaTipo) {
    const vRotina = {
      descricao: `Rotina de Geração de ${pRotinaTipo}`,
      observacao: '-',
      status: 'G',
      tipo: pRotinaTipo,
      inicioProcessamento: util.obterDataCorrente(),
    }
    return this.baseRepositorio.incluir(vRotina)
  }

  async atualizarProcessamento(pId, pObservacao, pStatus, pQtdIncluidos, pQtdAlterados, pQtdErros) {
    return this.baseRepositorio.alterarUm({ _id: pId },
      {
        observacao: pObservacao, status: pStatus, qtdIncluidos: pQtdIncluidos, qtdAlterados: pQtdAlterados, qtdErros: pQtdErros, fimProcessamento: util.obterDataCorrente(),
      }, {})
  }
}
