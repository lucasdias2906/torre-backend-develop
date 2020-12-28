import BaseRepositorio from './base/baseRepositorio'
import { fil } from 'date-fns/locale'

require('../modelos/parametroGeral')

export default class ParametroGeralRepositorio {
  constructor() {
    this.baseRepositorio = new BaseRepositorio('torreParametroGeral')
  }

  async incluir(pDados) {
    const vFiltro = {}
    return this.baseRepositorio.incluir(pDados)
  }

  async listar(filtro) {  
    return this.baseRepositorio.listar({}, filtro || {})
    }

  async obter(id) {
    return this.baseRepositorio.obter(id)
  }

  async obterPorCodigo(pGrupo, pCodigo) {
    return this.baseRepositorio.obterUm({ grupo: pGrupo, codigo: pCodigo })
  }

  async obterPorChave(pGrupo, pChave) {
    return this.baseRepositorio.obterUm({ grupo: pChave, chave: pChave })
  }

  async alterar(vFiltro, data) {
    return this.baseRepositorio.alterarUm(vFiltro, data, {})
  }
}
