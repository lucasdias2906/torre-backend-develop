import Base from './base/baseRepositorio';

require('../modelos/parceiroTempoLimite');

export default class parceiroTempoLimiteRepositorio {
  constructor() {
    this.baseRepositorio = new Base('torreParceiroTempoLimite');
  }

  async obterPorParceiro (pFiltro) {
    return this.baseRepositorio.obterUm(pFiltro)
  }

  async obter(pId) {
    return this.baseRepositorio.obterUm({ _id: pId });
  }

  async incluir(pDados, pOptions) {
    return this.baseRepositorio.incluir(pDados, pOptions);
  }

  async excluir(pId) {
    return this.baseRepositorio.excluir(pId);
  }

  async alterar(pId, pBody, pOptions) {
    return this.baseRepositorio.alterar(pId, pBody, pOptions);
  }
}
