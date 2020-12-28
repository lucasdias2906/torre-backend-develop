import _funcionalidadeRepositorio from './funcionalidadeRepositorio'
import _perfilPermissaoRepositorio from './perfilPermissaoRepositorio'
import BaseErro from '../servicos/base/baseErro'
import Base from './base/baseRepositorio'

require('../modelos/usuario')

const funcionalidadeRepositorio = new _funcionalidadeRepositorio()
const perfilPermissaoRepositorio = new _perfilPermissaoRepositorio()

class usuarioRepositorio {
  constructor () {
    this.baseRepositorio = new Base('torreUsuario')
  }

  async obter (pUsuarioId) {
    return this.baseRepositorio.obter(pUsuarioId)
  }

  async obterPorLogin (pLogin) {
    return this.baseRepositorio.obterUm({ login: pLogin })
  }

  async listar (pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async incluir (pDados, pOptions) {
    const vUsuario = await this.baseRepositorio.incluir(pDados, pOptions)
    return vUsuario
  }

  async alterar (pUsuarioId, pDados, pOptions) {
    return this.baseRepositorio.alterarUm({ _id: pUsuarioId }, pDados, pOptions)
  }

  async permissaoModuloListar (pUsuarioId, pModuloId) {
    const vUsuario = (await this.baseRepositorio.obter(pUsuarioId)).dados
    const vPerfilId = vUsuario.perfilId

    let vFuncionalidades = []

    if (pModuloId !== undefined && pModuloId !== 'undefined' && pModuloId !== '0') {
      vFuncionalidades = (await funcionalidadeRepositorio.listar({}, { moduloId: pModuloId })).dados
    }
    else vFuncionalidades = (await funcionalidadeRepositorio.listar({}, {})).dados

    const vRetorno = []

    // eslint-disable-next-line no-restricted-syntax
    for (const item of vFuncionalidades) {
      let vPermiteAlterar = false
      let vPermiteConsultar = false
      let vOrigemPermiteAlterar = ''
      let vOrigemPermiteConsultar = ''

      const vPerfilPermissao = (await perfilPermissaoRepositorio.obterPorPerfilModuloFuncionalidade(item.moduloId, vPerfilId, item._id)).dados

      // verifica as permissões do Perfil
      if (vPerfilPermissao !== null) {
        vPermiteAlterar = vPerfilPermissao.permiteAlterar
        vPermiteConsultar = vPerfilPermissao.permiteConsultar
        vOrigemPermiteAlterar = 'Perfil'
        vOrigemPermiteConsultar = 'Perfil'
      }

      const vUsuarioPermissaoLista = vUsuario.permissoes.filter((elem) => { if (elem.usuarioId === item.usuarioId
                                                                                && elem.perfilId === vPerfilId
                                                                                && elem.moduloId === item.moduloId
                                                                                && elem.funcionalidadeId === item._id ) return elem; })

      const vUsuarioPermissao = (vUsuarioPermissaoLista.length > 0 ? vUsuarioPermissaoLista[0] : null)

      if (vUsuarioPermissao !== null) {
        // somente adiciona permissões, nunca retira
        if (!vPermiteAlterar) {
          if (vUsuarioPermissao.permiteAlterar) {
            vPermiteAlterar = true
            vOrigemPermiteAlterar = 'Usuario'
          }
        }

        if (vUsuarioPermissao.permiteConsultar) {
          vPermiteConsultar = true
          vOrigemPermiteConsultar = 'Usuario'
        }
      }

      vRetorno.push({
        perfilId: vPerfilId,
        funcionalidadeId: item._id,
        funcionalidadeNome: item.nome,
        moduloId: item.moduloId,
        permiteConsultar: vPermiteConsultar,
        permiteAlterar: vPermiteAlterar,
        origemPermiteAlterar: vOrigemPermiteAlterar,
        origemPermiteConsultar: vOrigemPermiteAlterar,
      })
    }
    return vRetorno
  }


  async usuarioIdExiste (pUsuarioId) {
    const vUsuario = await this.baseRepositorio.listar({}, { _id: pUsuarioId })
    return vUsuario.dados.length > 0
  }

  async usuarioEmailExiste (pEmail) {
    const vUsuario = await this.baseRepositorio.listar({}, { email: pEmail })
    return vUsuario.dados.length > 0
  }

  async alterarStatus (pUsuarioId, pOptions) {
    const vUsuario = await this.obter(pUsuarioId)
    if (vUsuario.dados == null) throw new BaseErro(400, 'genericoNenhumRegistroAlterado')
    return this.baseRepositorio.alterarUm({ _id: pUsuarioId }, { status: !vUsuario.dados.status }, pOptions)
  }

  async obterPorUUID (pUUID) {
    return this.baseRepositorio.obterUm({ uuidConfirmacao: pUUID })
  }

  async renovarUUID (pId, uuidConfirmacao, dataConfirmacao) {
    return this.baseRepositorio.alterarUm({ _id: pId }, { uuidConfirmacao: uuidConfirmacao, dataConfirmacao: dataConfirmacao }, {})
  }

  async alterarSenha (pId, pSenhaNova) {
    return this.baseRepositorio.alterarUm({ _id: pId }, { senha: pSenhaNova }, {})
  }
}

export default usuarioRepositorio
