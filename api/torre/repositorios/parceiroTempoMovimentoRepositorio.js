import Base from './base/baseRepositorio';

require('../modelos/parceiroTempoMovimento');

export default class parceiroTempoMovimentoRepositorio {
  constructor() {
    this.baseRepositorio = new Base('torreParceiroTempoMovimento');
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro);
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
