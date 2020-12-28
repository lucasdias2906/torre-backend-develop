import Base from './base/baseRepositorio';

require('../modelos/perfilPermissao');

class perfilPermissaoRepositorio {

  constructor() {
    this.baseRepositorio = new Base('torrePerfilPermissao');
  }

  async incluir(data, pOptions) {
    return this.baseRepositorio.incluir(data, pOptions);
  }

  async alterar(id, data, pOptions) {
    return this.baseRepositorio.alterar(id, data, pOptions);
  }

  async excluir(id, pOptions) {
    return this.baseRepositorio.excluir(id, pOptions);
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro);
  }

  async listarPorPerfil(pPerfilId) {
    return this.baseRepositorio.listar({}, { perfilId: pPerfilId });
  }

  async obter(id) {
    return this.baseRepositorio.obter(id);
  }

  async obterPorPerfilModuloFuncionalidade(pPerfilId, pModuloId, pFuncionalidadeId) {
    const vFiltro = {
      moduloId: pModuloId,
      perfilId: pPerfilId,
      funcionalidadeId: pFuncionalidadeId,
    };

    return this.baseRepositorio.obterUm(vFiltro);
  }
}

export default perfilPermissaoRepositorio;
