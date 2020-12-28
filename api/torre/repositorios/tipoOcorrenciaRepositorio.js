import BaseRepositorio from './base/baseRepositorio'
import TipoOcorrencia from '../modelos/tipoOcorrencia'

export default class TipoOcorrenciaRepositorio {
  constructor () {
    this.baseRepositorio = new BaseRepositorio('torreTipoOcorrencia')
  }

  obter2 (id) {
    return this.baseRepositorio.obter2(id)
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
    const tipoOcorrencia = new TipoOcorrencia(body)
    return this.baseRepositorio.incluir(tipoOcorrencia)
  }

  async alterar (vFiltro, data) {
    return this.baseRepositorio.alterarUm(vFiltro, data, {})
  }

  async excluir (_id) {
    return this.baseRepositorio.excluir({ _id: _id })
  }
}
