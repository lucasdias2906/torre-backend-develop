import Base from './base/baseRepositorio'
import PoligonoTipo from '../modelos/poligonoTipo'

import Util from '../funcoes/utilitarios'

export default class poligonoRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torrePoligonoTipo')
  }

  async obter (id) {
    return this.baseRepositorio.obter(id)
  }

  async obterPorCodigo (pCodigo) {
    return this.baseRepositorio.obterUm({ codigo: pCodigo })
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async incluir (body) {
    const vCodigoTipoPoligono = await Util.obterSequencia('codigoTipoPoligono')
    const poligonoTipo = new PoligonoTipo(body)
    poligonoTipo.codigo = vCodigoTipoPoligono

    return this.baseRepositorio.incluir(poligonoTipo)
  }

  async alterar (vFiltro, data) {
    return this.baseRepositorio.alterarUm(vFiltro, data, {})
  }

  async excluir (_id) {
    return this.baseRepositorio.excluir({ _id: _id })
  }
}
