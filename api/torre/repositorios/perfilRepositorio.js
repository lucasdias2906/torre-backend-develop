import mongoose from 'mongoose'

import Base from './base/baseRepositorio'
import BaseErro from '../servicos/base/baseErro'
import PerfilPermissao from '../modelos/perfilPermissao'
import _perfilPermissaoRepositorio from './perfilPermissaoRepositorio'

require('../modelos/perfil')

const perfilPermissaoRepositorio = new _perfilPermissaoRepositorio()

class perfilRepositorio {

  constructor() {
    this.baseRepositorio = new Base('torrePerfil')
  }

  async incluir(pDados, pOptions) {
    const vPermissoes = pDados.permissoes
    // const vSessao = await mongoose.startSession()
    // vSessao.startTransaction()
    if (!pOptions) pOptions = {}
    // pOptions.session = vSessao

    try {
      const vPerfilIdSalvo = await this.baseRepositorio.incluir(pDados, pOptions);

      for (var item of vPermissoes) {
        item["perfilId"] = vPerfilIdSalvo.dados._id
        await perfilPermissaoRepositorio.incluir(item, pOptions)
      }

      // await vSessao.commitTransaction()
      // await vSessao.endSession()
      return this.obter(vPerfilIdSalvo.dados._id)
    }
    catch (e) {
      // await vSessao.abortTransaction()
      // await vSessao.endSession()
      throw e
    }
  }

  async alterar(pId, pDados, pOptions) {
    const vPermissoes = pDados.permissoes
    // const vSessao = await mongoose.startSession()
    // vSessao.startTransaction()
    // pOptions.session = vSessao

    try {
      await this.baseRepositorio.alterar(pId, pDados, pOptions)

      const vRegistros = (await perfilPermissaoRepositorio.listar({}, { perfilId: pId })).dados

      let i = 0
      for (i = 0; i < vRegistros.length; i += 1) {
        perfilPermissaoRepositorio.excluir(vRegistros[i]._id, pOptions)
      }

      for (var item of vPermissoes) {
        item.perfilId = pId
        await perfilPermissaoRepositorio.incluir(item, pOptions)
      }
      // await vSessao.commitTransaction()
      // await vSessao.endSession()
    }
    catch (e) {
      // await vSessao.abortTransaction()
      // await vSessao.endSession()
      throw e
    }
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async obter(pId) {
    const vPerfil = await this.baseRepositorio.obter(pId)
    if (!vPerfil.dados) throw new BaseErro(400, 'perfilNaoEncontrado')
    const vRetorno = JSON.parse(JSON.stringify(vPerfil))
    vRetorno.dados.permissoes = (await perfilPermissaoRepositorio.listarPorPerfil(pId)).dados
    return vRetorno
  }

  async alterarStatus(pId, pOptions) {
    const vStatusAtual = await this.baseRepositorio._model.findOne({ _id: pId })
    return await this.baseRepositorio.alterarUm({ _id: pId }, { status: !vStatusAtual.status }, {})
  }

  async perfilNomeExiste(pNome) {
    const vPerfil = await this.baseRepositorio._model.findOne({ nome: pNome })
    return vPerfil != null
  }


  async validarPermissoes(pPerfilId, pPerfilPermissoes) {
    let vMensagem = ''

    if (!Array.isArray(pPerfilPermissoes)) return 'Favor passar uma array com as permissões!'

    for (var item of pPerfilPermissoes) {
      const oPerfilPermissao = new PerfilPermissao(item)
      oPerfilPermissao.perfilId = pPerfilId
      const x = await oPerfilPermissao.validate().catch(function (err) { vMensagem = err.message; })
    }

    return vMensagem
  }

}

export default perfilRepositorio
