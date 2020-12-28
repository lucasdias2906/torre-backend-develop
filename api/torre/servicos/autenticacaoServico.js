import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { isAfter } from 'date-fns'

import authConfig from '../configuracao/auth.json'

import tokenServico from './tokenServico'
import usuarioServico from './usuarioServico'
import perfilServico from './perfilServico'
import perfilPermissaoServico from './perfilPermissaoServico'
import emailServico from './emailServico'
import parametroGeralServico from './parametroGeralServico'
import BaseErro from './base/baseErro'

import AutenticacaoRepositorio from '../repositorios/autenticacaoRepositorio'

const autenticacaoRepositorio = new AutenticacaoRepositorio()


// funções internas
function gerarToken (params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: authConfig.tempoLogado,
  })
}

async function efetuarLogin (body) {
  const { login, senha } = body
  if (!login) throw new BaseErro(400, 'autenticacaoLoginNaoInformado')
  if (!senha) throw new BaseErro(400, 'autenticacaoSenhaNaoInformado')
  const vUsuario = (await usuarioServico.obterPorLogin(login)).dados

  if (!vUsuario) throw new BaseErro(400, 'autenticacaoSenhaInvalida')
  const vLoginTentativaErro = vUsuario.loginTentativaErro

  const vRetorno = await bcrypt.compare(senha, vUsuario.senha)

  const vQtdMaximaTentativa = await parametroGeralServico.obterPorCodigo('login', 'qtdMaximaTentativa')

  if (!vRetorno) {
    if (vLoginTentativaErro > vQtdMaximaTentativa) {
      await autenticacaoRepositorio.bloquear(login)
      throw new BaseErro(400, 'autenticacaoTentativasExcedidas', [vQtdMaximaTentativa])
    }
    await autenticacaoRepositorio.loginTentativaErroIncrementar(login)
    throw new BaseErro(400, 'autenticacaoSenhaInvalida')
  } else if (vUsuario.dataBloqueio && !vUsuario.status) throw new BaseErro(400, 'autenticacaoTentativasExcedidas', [vQtdMaximaTentativa])
  else if (!vUsuario.status) throw new BaseErro(400, 'autenticacaoUsuarioInativo')
  else if (vLoginTentativaErro !== 0) await autenticacaoRepositorio.loginTentativaErroZerar(login)

  const vPerfil = await perfilServico.obter(vUsuario.perfilId)

  const permissoes = await perfilPermissaoServico.listarPermissoesParaLogin(vUsuario.perfilId)
  const permissoesDoUsuario = await usuarioServico.permissaoListar(vUsuario._id)

  permissoesDoUsuario.dados.map((permissaoDoUsuario) => {
    permissoes
      .filter((permissao) => permissao.moduloId.equals(permissaoDoUsuario.moduloId)
              && permissao.funcionalidadeId.equals(permissaoDoUsuario.funcionalidadeId))
      .map((permissao) => {
        permissao.permiteConsultar = permissaoDoUsuario.permiteConsultar
        permissao.permiteAlterar = permissaoDoUsuario.permiteAlterar
      })
  })

  if (!vPerfil.dados.status) throw new BaseErro(400, 'UsuarioPerfilInativo', [vPerfil.dados.nome])

  if (!vUsuario.status) throw new BaseErro(400, 'usuarioDesativado', [login])

  const vFiliais = await usuarioServico.permissaoListarHubFilialIds(vUsuario._id)

  return {
    token: gerarToken({
      _id: vUsuario._id,
      login: vUsuario.login,
      email: vUsuario.email,
      nome: vUsuario.nome,
      filiais: vFiliais,
    }),
    permissoes,
  }
}

async function alterarSenha (req) {
  const { senha } = req.body
  const uuid = req.params.pUUID

  const usuario = await usuarioServico.validarUsuario(uuid)

  if (!senha) throw new BaseErro(400, 'autenticacaoSenhaInvalida')

  if (!usuario) throw new BaseErro(400, 'usuarioNaoEncontrado')

  const { _id } = usuario

  const hash = await bcrypt.hash(senha, 10)

  await usuarioServico.alterarSenha(_id, hash)

  return { mensagem: 'alterado' }
};

async function enviarEmail (body, template) {
  const { login } = body

  if (!login) return { mensagem: 'enviado!' }

  const vUsuario = (await usuarioServico.obterPorLogin(login)).dados

  if (!vUsuario) return { mensagem: 'enviado!' }

  const { uuidConfirmacao, dataConfirmacao } = await usuarioServico.renovarUUID(vUsuario.id)

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

async function validarTokenEmail (req, res) {
  const { login, token } = req.query

  const usuario = (await (usuarioServico.obterPorLogin(login))).dados

  if (!usuario) throw new BaseErro(400, 'usuarioNaoEncontrado')

  if (usuario.tokenSenha !== token) throw new BaseErro(400, 'usuarioTokenInvalido')

  if (!tokenServico.estaValido(token)) throw Error('usuarioTokenInvalido')

  if (isAfter(new Date(), usuario.tokenSenhaValidade)) throw Error('usuarioTokenExpirado')

  return { mensagem: 'Válido' }
};

async function validarToken (req, res, next) {
  // next();
  // return;
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (token) {
    if (!tokenServico.estaValido(token)) throw new BaseErro(400, 'autenticacaoTokenVazioOuInvalido')

    try {
      const decoded = await jwt.verify(token, authConfig.secret)
      req.usuarioLogado = decoded
      global.usuarioLogin = req.usuarioLogado
      next()
    } catch (error) {
      res.status(401).send({ message: 'Token informado é inválido' })
    }
  } else {
    res.status(401).send({ message: 'Você precisa informar um token para acessar esse recurso.' })
  }
}

async function decode (token) {
  return jwt.decode(token, { complete: true })
}

async function revalidarToken (req, res) {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  const data = await decode(token)

  if (!data) throw new BaseErro(400, 'autenticacaoTokenVazioOuInvalido')

  const { login } = data.payload

  const usuario = (await usuarioServico.obterPorLogin(login)).dados

  if (!usuario) throw new BaseErro(400, 'usuarioNaoEncontrado')

  const vFiliais = (await usuarioServico.permissaoListarHubFilialIds(usuario._id))

  return {
    token: gerarToken({
      _id: usuario._id,
      login: usuario.login,
      email: usuario.email,
      nome: usuario.nome,
      filiais: vFiliais,
    })
  }
}

async function invalidarToken (req) {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  // const data = await decode(token);
  // const { login } = data.payload;
  await tokenServico.invalidar(token)

  return { ok: true }
}

const functions = {
  login: (body) => efetuarLogin(body),
  alterarSenha: (res) => alterarSenha(res),
  enviarEmail: (body, template) => enviarEmail(body, template),
  validarTokenEmail: (req, res) => validarTokenEmail(req, res),
  validarToken: (req, res, next) => validarToken(req, res, next),
  revalidarToken: (req, res) => revalidarToken(req, res),
  invalidarToken: (req) => invalidarToken(req),
}

export default functions
