import validate from 'uuid-validate'
import { isAfter } from 'date-fns'
import Util from '../funcoes/utilitarios'
import url from '../configuracao/hub'

import BaseErro from './base/baseErro'
import baseServico from './base/baseServico'
import empresaServico from './empresaServico'
import filialServico from './filialServico'
import parceiroServico from './parceiroServico'
import emailServico from './emailServico'

import _usuarioRepositorio from '../repositorios/usuarioRepositorio'

const usuarioRepositorio = new _usuarioRepositorio()

async function obterPorLogin (pLogin) {
  return usuarioRepositorio.obterPorLogin(pLogin)
}

async function renovarUUID (pUsuarioId) {
  const vUsuario = (await usuarioRepositorio.obter(pUsuarioId)).dados
  if (!vUsuario) throw new BaseErro(400, 'usuarioNaoEncontrado')
  const vUuid = Util.gerarUUID(vUsuario)
  const usuario = await usuarioRepositorio.renovarUUID(pUsuarioId, vUuid.uuidConfirmacao, vUuid.dataConfirmacao)
  return {
    uuidConfirmacao: usuario.dados.uuidConfirmacao,
    dataConfirmacao: usuario.dados.dataConfirmacao,
  }
}

// envia o email para liberar primeirao acesso
async function enviarEmailAcesso ({ login }, template) {
  if (!login) return { mensagem: 'enviado!' }

  const vUsuario = (await obterPorLogin(login)).dados

  if (!vUsuario) return { mensagem: 'enviado!' }

  const { uuidConfirmacao, dataConfirmacao } = await renovarUUID(vUsuario.id)

  vUsuario.uuidConfirmacao = uuidConfirmacao
  vUsuario.dataConfirmacao = dataConfirmacao

  const vHtml = await emailServico.retornarHtlm(vUsuario, template)
  const titulo = template !== undefined ? template : 'Esqueceu a Senha? Clica aqui!'

  await emailServico.enviarEmail(
    vUsuario.email,
    titulo,
    vHtml,
  )

  return { mensagem: 'enviado!!!' }
}

async function listar (pParams) {
  const vNome = pParams.nome ? pParams.nome : ''
  const vLogin = pParams.login ? pParams.login : ''

  const vFiltro = {
    nome: { $regex: `.*${vNome}.*`, $options: 'i' },
    login: { $regex: `.*${vLogin}.*`, $options: 'i' },
  }

  return usuarioRepositorio.listar(pParams, vFiltro)
}

async function listarPorPerfil (pIdPerfil) {
  const vFiltro = {}

  vFiltro.perfilId = pIdPerfil

  return usuarioRepositorio.listar({}, vFiltro)
}

async function obterDadosAdicionais (pEmpresas) {
  const vEmpresaLista = (await empresaServico.listar({})).dados // para obter dados adicionais das empresas
  const vFilialLista = (await filialServico.listar({})).dados // para obter dados adicionais das filiais

  const vEmpresas = pEmpresas.map((empresa) => {
    const vItemEmpresa = vEmpresaLista.filter((item) => item.codigoEmpresa === empresa.hubEmpresaId)

    const vFiliais = empresa.filiais.map((filial) => {
      const vItemFilial = vFilialLista.filter((item) => item.codigoFilial === filial.hubFilialId)
      return {
        hubFilialId: filial.hubFilialId,
        nomeRazaoSocial: vItemFilial.length > 0 ? vItemFilial[0].nomeRazaoSocial : null,
      }
    })

    return {
      hubEmpresaId: empresa.hubEmpresaId,
      descricaoEmpresa: vItemEmpresa.length > 0 ? vItemEmpresa[0].descricaoEmpresa : null,
      filiais: vFiliais,
    }
  })

  return vEmpresas
}

async function obter (pId) {
  const vUsuario = (await usuarioRepositorio.obter(pId)).dados
  if (!vUsuario) throw new BaseErro(400, 'usuarioNaoEncontrado')

  const vRetorno = JSON.parse(JSON.stringify(vUsuario))

  const vEmpresas = await obterDadosAdicionais(vUsuario.empresas)

  vRetorno.empresas = vEmpresas

  return { dados: vRetorno }
}

async function incluir (body) {
  const vExiste = await usuarioRepositorio.usuarioEmailExiste(body.email)
  if (vExiste) throw new BaseErro(400, 'usuarioEmailJaExiste', [body.email])
  if (!Array.isArray(body.permissoes)) throw new BaseErro(400, 'usuarioPermissoesInvalido')
  if (!Array.isArray(body.empresas)) throw new BaseErro(400, 'usuarioEmpresasInvalido')

  const vUuid = Util.gerarUUID(body.nome)
  body.uuidConfirmacao = vUuid.uuidConfirmacao
  body.dataConfirmacao = vUuid.dataConfirmacao
  body.senha = await Util.gerarSenhaAleatoria()

  const vUsuario = await usuarioRepositorio.incluir(body, {})

  await enviarEmailAcesso({ login: vUsuario.dados.login }, 'Primeiro Acesso')

  return obter(vUsuario.dados._id)
}

async function alterar (pUsuarioId, body) {
  const vExiste = await usuarioRepositorio.usuarioIdExiste(pUsuarioId)
  if (!vExiste) throw new BaseErro(400, 'usuarioNaoEncontrado')
  if (!Array.isArray(body.permissoes)) throw new BaseErro(400, 'usuarioPermissoesInvalido')
  if (!Array.isArray(body.empresas)) throw new BaseErro(400, 'usuarioEmpresasInvalido')

  const vUsuario = await usuarioRepositorio.alterar(pUsuarioId, body, {})
  return obter(vUsuario.dados._id)
}

async function buscarPorLogin (pLogin) {
  const dadosTorre = (await usuarioRepositorio.obterPorLogin(pLogin)).dados

  if (dadosTorre) {
    return {
      dados: {
        login: dadosTorre.login,
        nome: dadosTorre.nome,
        status: dadosTorre.status,
        telefone: dadosTorre.telefone,
        celular: dadosTorre.celular,
        email: dadosTorre.email,
        cpf: dadosTorre.cpf,
        sexo: dadosTorre.sexo,
        dataNascimento: dadosTorre.dataNascimento,
        origem: 'TORRE',
      },
    }
  }

  const dadosHub = await baseServico.hubObter(`${url.usuario}/obtemPorLogin/${pLogin}`, [])
  const { dados } = dadosHub

  if (dados != null) {
    return {
      dados: {
        login: dados.nomeLogin,
        nome: dados.nomeUsuario,
        status: dados.identificadorStatus === 'S',
        telefone: dados.numeroTelefone,
        celular: dados.numeroCelular,
        email: dados.nomeEmail,
        cpf: dados.numeroCPF,
        sexo: '',
        dataNascimento: '',
        origem: 'HUB',
      }
    }
  }

  return { dados: {} }
}

async function buscarEmpresaPorUsuario (pLogin, pIdEmpresa) {
  return baseServico.hubListar(`${url.usuario}/obtemPorLogin/${pLogin}/empresa/${pIdEmpresa}`, [])
}

async function buscarFiliaisPorUsuarioEmpresa (pLogin, pIdEmpresa) {
  return baseServico.hubListar(`${url.usuario}/obtemPorLogin/${pLogin}/empresa/${pIdEmpresa}/filial`, [])
}

async function alterarStatus (pUsuarioId) {
  return usuarioRepositorio.alterarStatus(pUsuarioId, {})
}

async function permissaoListar (pUsuarioId) {
  const vUsuario = (await usuarioRepositorio.obter(pUsuarioId)).dados
  if (!vUsuario) throw new BaseErro(400, 'usuarioNaoEncontrado')
  return { dados: vUsuario.permissoes }
}

async function permissaoListarEmpresa (pUsuarioId) {
  const vUsuario = (await usuarioRepositorio.obter(pUsuarioId)).dados
  const vDados = await obterDadosAdicionais(vUsuario.empresas)
  return { dados: vDados }
}

async function permissaoListarHubFilialIds (pUsuarioId) {
  const vUsuario = (await usuarioRepositorio.obter(pUsuarioId)).dados
  const vRetorno = []

  vUsuario.empresas.map((empresa) => {
    empresa.filiais.map((filial) => {
      vRetorno.push(filial.hubFilialId)
    })
  })

  return vRetorno
}

async function permissaoListarParceiro (pUsuarioId) {
  const vUsuario = (await usuarioRepositorio.obter(pUsuarioId)).dados

  let vListaParceiros

  if (vUsuario) {
    const vTempUsuarioParceiros = vUsuario.parceiros

    const vRetorno = vTempUsuarioParceiros.map(async (item) => {
      const vParceiro = (await parceiroServico.obter(item.hubParceiroId, { query: {} })).dados
      return {
        hubParceiroId: item.hubParceiroId,
        numeroCNPJ: vParceiro ? vParceiro.parceiro.numeroCNPJ : null,
        nomeRazaoSocial: vParceiro ? vParceiro.parceiro.nomeRazaoSocial : null,
        identificacaoClassificacao: vParceiro ? vParceiro.parceiro.identificacaoClassificacao : null,
        descricaoClassificacao: vParceiro ? vParceiro.parceiro.descricaoClassificacao : null,
      }
    })

    vListaParceiros = await Promise.all(vRetorno)
  }

  return { dados: vListaParceiros }
}


async function permissaoModuloListar (pUsuarioId, pModuloId) {
  const vExiste = await usuarioRepositorio.usuarioIdExiste(pUsuarioId)
  if (!vExiste) throw new BaseErro(400, 'usuarioNaoEncontrado')

  return usuarioRepositorio.permissaoModuloListar(pUsuarioId, pModuloId)
}

async function validarUsuario (uuidConfirmacao) {
  if (!validate(uuidConfirmacao)) return { mensagem: 'UUID inválido', uuidConfirmacao }

  const usuario = (await usuarioRepositorio.obterPorUUID(uuidConfirmacao)).dados

  if (!usuario) throw new BaseErro(400, 'usuarioNaoEncontrado')

  if (isAfter(new Date(), usuario.dataConfirmacao)) throw new BaseErro(400, 'usuarioUUIDTempoExpirado')

  return usuario
}

async function alterarSenha (pId, pSenhaNova) {
  return usuarioRepositorio.alterarSenha(pId, pSenhaNova)
}

const usuarioServico = {
  listar: async (pParams) => listar(pParams),
  listarPorPerfil: async (pIdPerfil) => listarPorPerfil(pIdPerfil),
  incluir: (body) => incluir(body),
  alterar: (pUsuarioId, body) => alterar(pUsuarioId, body),
  obter: async (pId) => obter(pId),
  buscarPorLogin: async (pLogin) => buscarPorLogin(pLogin),
  obterPorLogin: async (pLogin) => obterPorLogin(pLogin),
  buscarEmpresaPorUsuario: async (pLogin, pIdEmpresa) => buscarEmpresaPorUsuario(pLogin, pIdEmpresa),
  buscarFiliaisPorUsuarioEmpresa: async (pLogin, pIdEmpresa) => buscarFiliaisPorUsuarioEmpresa(pLogin, pIdEmpresa),
  alterarStatus: (pId) => alterarStatus(pId),
  permissaoListar: async (pUsuarioId) => permissaoListar(pUsuarioId),
  permissaoListarEmpresa: async (pUsuarioId) => permissaoListarEmpresa(pUsuarioId),
  permissaoListarHubFilialIds: async (pUsuarioId) => permissaoListarHubFilialIds(pUsuarioId),
  permissaoListarParceiro: async (pUsuarioId) => permissaoListarParceiro(pUsuarioId),
  permissaoModuloListar: async (pUsuarioId, pModuloId) => permissaoModuloListar(pUsuarioId, pModuloId),
  validarUsuario: (uuidConfirmacao) => validarUsuario(uuidConfirmacao),
  renovarUUID: (pUsuarioId) => renovarUUID(pUsuarioId),
  alterarSenha: (pId, pSenhaNova) => alterarSenha(pId, pSenhaNova),
}

export default usuarioServico
