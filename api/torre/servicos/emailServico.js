
import nodemailer from 'nodemailer'
import fs from 'fs'
import templates from './templates/templates'
import parametrosGeralServico from './parametroGeralServico'
import EmailRotinaRepositorio from '../repositorios/emailRotinaRepositorio'

const emailRotinaRepositorio = new EmailRotinaRepositorio()

async function enviarEmail(para, titulo, corpo) {

  const mailHost = await parametrosGeralServico.obterPorCodigo('smtp', 'MAIL_HOST')
  const mailPort = await parametrosGeralServico.obterPorCodigo('smtp', 'MAIL_PORT')
  const mailUser = await parametrosGeralServico.obterPorCodigo('smtp', 'MAIL_USER')
  const mailFrom = await parametrosGeralServico.obterPorCodigo('smtp', 'MAIL_FROM')
  const mailPassword = await parametrosGeralServico.obterPorCodigo('smtp', 'MAIL_PASS')

  const mailConfig = {
    host: mailHost,
    port: mailPort,
    auth: {
      user: mailUser,
      pass: mailPassword,
    },
    from: mailFrom,
  }

  const mail = nodemailer.createTransport(mailConfig)
  return mail.sendMail({
    from: mailConfig.from,
    to: para,
    subject: titulo,
    html: corpo,
  })
}

function obterTemplate(pArquivoTemplate) {
  const template = fs.readFileSync(`${__dirname}/templates/${pArquivoTemplate}`, { encoding: 'utf-8' })
  return template
}

// Rotina de envio de email's das notificações
async function rotina() {
  // iniciar rotina de envio
  const vRetorno = await emailRotinaRepositorio.incluir({ dataInicio: new Date() }, {})
  const vTemplate = obterTemplate('templateOcorrencia.html')

  await enviarEmail('carlos.saito@cuboconnect.com.br', 'teste de notificação email', vTemplate)

  await emailRotinaRepositorio.alterar(vRetorno.dados._id, { dataFim: new Date() }, {})
  // Fim da Rotina
}

async function retornarHtlm(usuario, template) {
  const vUrlBase = (await parametrosGeralServico.obterPorCodigo('geral', 'urlBase'))
  let html = ''

  if (template !== undefined)
    html = templates.primeiroAcesso;
  else
    html = templates.trocaSenha;

  return html = String(html)
    .replace(/StringNome/g, `${usuario.nome}`)
    .replace(/StringBase/g, `${!vUrlBase ? 'http://localhost:4200' : vUrlBase}`)
    .replace(/StringHref/g, `${!vUrlBase ? 'http://localhost:4200' : vUrlBase}/signin/${usuario.uuidConfirmacao}`)
}

async function retornarHtlmCriarSenha(usuario) {
  const vUrlBase = (await parametrosGeralServico.obterPorCodigo('geral', 'urlBase'))
  return templates.trocaSenha.replace('StringHref', `${vUrlBase}/signin/${usuario.uuidConfirmacao}`)
}

async function enviarEmailAcesso(pUsuario, template) {
  // { login, email, uuidConfirmacao, dataConfirmacao}
  // if (!pUsuario.login) return { mensagem: 'enviado!' }

  // const vUsuario = (await usuarioServico.obterPorLogin(login)).dados

  // if (!vUsuario) return { mensagem: 'enviado!' }

  // const { uuidConfirmacao, dataConfirmacao } = await usuarioServico.renovarUUID(vUsuario.id)

  // pUsuario.uuidConfirmacao = uuidConfirmacao
  // pUsuario.dataConfirmacao = dataConfirmacao

  const vHtml = await retornarHtlm(pUsuario, template)
  const titulo = template !== undefined ? template : 'Esqueceu a Senha? Clica aqui!'

  await enviarEmail(
    pUsuario.email,
    titulo,
    vHtml,
  )

  return { mensagem: 'enviado!!!' }
}

const functions = {
  rotina: () => rotina(),
  enviarEmailAcesso: (body, template) => enviarEmailAcesso(body, template),
  enviarEmail: (para, titulo, corpo) => enviarEmail(para, titulo, corpo),
  retornarHtlmCriarSenha: (usuario, template) => retornarHtlmCriarSenha(usuario, template),
  retornarHtlm: (usuario, template) => retornarHtlm(usuario, template),
  obterTemplate: (pTemplateArquivoNome) => obterTemplate(pTemplateArquivoNome),
}
export default functions
