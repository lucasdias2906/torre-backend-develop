import _notificacaoRepositorio from '../repositorios/notificacaoRepositorio'
import OcorrenciaDestinatarioRepositorio from '../repositorios/ocorrenciaDestinatarioRepositorio'

import BaseErro from './base/baseErro'
import emailServico from './emailServico'
import usuarioServico from './usuarioServico'
import pedidoServico from './pedidoServico'
import parceiroServico from './parceiroServico'
import parametroGeralServico from './parametroGeralServico'

const notificacaoRepositorio = new _notificacaoRepositorio()

async function listar(req, pFiltroLido) {
  const notificacoes = await notificacaoRepositorio.obterNotificacoesPorUsuario(req, pFiltroLido)

  const dados = notificacoes.dados.map((notificacao) => {
    // eslint-disable-next-line eqeqeq
    const usuarioNotificacao = notificacao.usuarios.filter((usuario) => (usuario.usuarioId == req.usuarioLogado._id))

    let lido = false
    let dataLeitura = null

    if (usuarioNotificacao.length > 0) {
      lido = usuarioNotificacao[0].lido
      dataLeitura = usuarioNotificacao[0].dataLeitura
    }

    return {
      _id: notificacao.id,
      ocorrenciaId: notificacao.ocorrenciaId,
      titulo: notificacao.titulo,
      corpo: notificacao.corpo,
      lido,
      dataHora: notificacao.dataHora,
      dataLeitura,
      log: notificacao.log,
    }
  })

  return {
    totalRegistros: notificacoes.totalRegistros,
    totalRegistrosPagina: notificacoes.totalRegistrosPagina,
    dados,
  }
}

async function expurgarNotificacoesAntigas() {
  const vQtdDiasExpurgoNotificacoes = await parametroGeralServico.obterPorCodigo('monitoramento', 'QTD_DIAS_EXPURGO_NOTIFICACOES')
  const ret = await notificacaoRepositorio.expurgarNotificacoesAntigas(vQtdDiasExpurgoNotificacoes)
  console.log('Qtde de Notificações Expurgadas: ', ret.n)
}

async function incluir(body) {
  return notificacaoRepositorio.incluir(body, {})
}

async function marcarLido(pNotificacaoId, pUsuarioId) {
  return notificacaoRepositorio.marcarLido(pNotificacaoId, pUsuarioId, {})
}

async function marcarNaoLido(pNotificacaoId, pUsuarioId) {
  return notificacaoRepositorio.marcarNaoLido(pNotificacaoId, pUsuarioId, {})
}

async function enviarEmail(pNotificacaoId) {
  const vNotificacao = (await notificacaoRepositorio.obter(pNotificacaoId)).dados

  if (vNotificacao == null) throw new BaseErro(400, 'genericoNenhumRegistroAlterado')

  vNotificacao.emails.forEach((elemento) => {
    if (!elemento.enviado) {
      emailServico.enviarEmail(
        elemento.email,
        vNotificacao.titulo,
        vNotificacao.corpo,
      )

      elemento.enviado = true
      elemento.dataEnvio = Date.now()
    }
  })

  return notificacaoRepositorio.alterar(pNotificacaoId, vNotificacao, {})
}

async function encontrarUsuariosParaNotificacao(perfis) {
  const usuariosParaNotificacao = []

  for (let p = 0; p < perfis.length; p += 1) {
    const usuarios = await usuarioServico.listarPorPerfil(perfis[p].perfilId)

    for (let u = 0; u < usuarios.dados.length; u += 1) {
      usuariosParaNotificacao.push({
        usuarioId: usuarios.dados[u]._id
      })
    }
  }

  return usuariosParaNotificacao
}

async function encontrarEmailsParaNotificacao(pedido, destinatarios) {
  const emailsParaNotificacao = []

  for (let p = 0; p < destinatarios.length; p++) {
    const destinatario = await new OcorrenciaDestinatarioRepositorio().obter(destinatarios[p].destinatarioId)

    const pedidoMonitoramentoConsulta = await pedidoMonitoramentoRepositorio.obterPorPedidoAndFilial(pedido.numeroPedido, pedido.codigoFilial)

    const {
      codigoTomador,
      codigoRemetente,
      codigoDestinatario
    } = pedidoMonitoramentoConsulta.dados.pedido

    if (destinatario) {
      switch (destinatario.dados.identificador) {
        case 'TOMADOR_SERVICO': {
          const contatosTomador = await parceiroServico.contatos(codigoTomador)
          contatosTomador.dados.forEach(contato => {
            emailsParaNotificacao.push({
              email: contato.EmailContato
            })
          })
          break
        }
        case 'CLIENTE_CARGA': {
          const contatosRemetente = await parceiroServico.contatos(codigoRemetente)
          contatosRemetente.dados.forEach(contato => {
            emailsParaNotificacao.push({
              email: contato.EmailContato
            })
          })
          break
        }
        case 'CLIENTE_DESCARGA': {
          const contatosDestinatario = await parceiroServico.contatos(codigoDestinatario)
          contatosDestinatario.dados.forEach(contato => {
            emailsParaNotificacao.push({
              email: contato.EmailContato
            })
          })
          break
        }
        case 'PROGRAMADOR':
          // TODO Definir como obter email de Programador
          break
        case 'MOTORISTA':
          // TODO Definir como obter email de Motorista
          break
        case 'USUARIO_INCLUSAO':
          // TODO Definir como obter email de Motorista
          break
        case 'ADMINISTRATIVO_TORRE': {
          const emailsAdministrativos = await parametroGeralServico.obterEmailsAdministrativos()

          emailsAdministrativos.split(';').forEach(emailAdministrativo => {
            if (emailAdministrativo.trim() !== '') {
              emailsParaNotificacao.push({
                email: emailAdministrativo.trim()
              })
            }
          })
          break
        }
      }
    }
  }

  return emailsParaNotificacao
}

async function inserirNotificacoes(ocorrenciaParaInclusao, idOcorrencia, numeroPedido, codigoFilial) {
  const usuariosParaNotificacao = await encontrarUsuariosParaNotificacao(ocorrenciaParaInclusao.perfis)

  const pedido = {
    numeroPedido,
    codigoFilial,
  }

  const emailsParaNotificacao = numeroPedido ? await encontrarEmailsParaNotificacao(pedido, ocorrenciaParaInclusao.destinatarios) : []

  if (usuariosParaNotificacao.length > 0 || emailsParaNotificacao.length > 0) {
    let vTitulo
    let vCorpo
    if (ocorrenciaParaInclusao.origem === 'PEDIDO') {
      vTitulo = `Ocorrência de número ${ocorrenciaParaInclusao.codigo} criada para o pedido - ${numeroPedido} - Filial ${codigoFilial} - ${ocorrenciaParaInclusao.descricao}`
      vCorpo = `[${ocorrenciaParaInclusao.descricao}] número ${ocorrenciaParaInclusao.codigo} referente ao pedido - ${numeroPedido} - Filial ${codigoFilial}`
    } else if (ocorrenciaParaInclusao.origem === 'VEICULO') {
      vTitulo = `Ocorrência de número ${ocorrenciaParaInclusao.codigo} criada para o veículo - ${ocorrenciaParaInclusao.veiculo.codigo} - ${ocorrenciaParaInclusao.descricao}`
      vCorpo = `[${ocorrenciaParaInclusao.descricao}] número ${ocorrenciaParaInclusao.codigo} referente ao veículo ${ocorrenciaParaInclusao.veiculo.placa}`
    } else if (ocorrenciaParaInclusao.origem === 'MOTORISTA') {
      vTitulo = `Ocorrência de número ${ocorrenciaParaInclusao.codigo} criada para o motorista - ${ocorrenciaParaInclusao.motorista.codigo} - ${ocorrenciaParaInclusao.motorista.nome} - ${ocorrenciaParaInclusao.descricao}`
      vCorpo = `[${ocorrenciaParaInclusao.descricao}] número ${ocorrenciaParaInclusao.codigo} referente ao motorista código: ${ocorrenciaParaInclusao.motorista.codigo} - Nome: ${ocorrenciaParaInclusao.motorista.nome}`
    }
    const notificacao = {
      ocorrenciaId: idOcorrencia,
      titulo: vTitulo,
      corpo: vCorpo,
      dataHora: Date.now(),
      usuarios: usuariosParaNotificacao,
      emails: emailsParaNotificacao,
    }

    await incluir(notificacao)
  }
}

async function listarEmailsNaoEnviados(req) {
  if (!req.query) req.query = {}
  return notificacaoRepositorio.listarEmailsNaoEnviados(req)
}

async function marcarNotificacaoEmailEnviado(pNotificacaoId, pEmail, pDataEnvio, pOptions) {
  return notificacaoRepositorio.marcarNotificacaoEmailEnviado(pNotificacaoId, pEmail, pDataEnvio, pOptions)
}

async function processarEmailEnvioOcorrencias() {

  //Remoção de notificações antigas
  await expurgarNotificacoesAntigas()

  const resultado = []
  // Obtém a listagem dos emails a serem enviados
  const vNotificaoEmailLista = (await listarEmailsNaoEnviados({})).dados

  const vTemplate = emailServico.obterTemplate('templateOcorrencia.html')

  for (let i = 0; i < vNotificaoEmailLista.length; i += 1) {
    const vCorpo = vTemplate.replace(/@@corpo@@/g, `${vNotificaoEmailLista[i].corpo}`)
    emailServico.enviarEmail(vNotificaoEmailLista[i].email, vNotificaoEmailLista[i].titulo, vCorpo).then(() => {
      console.log('Enviando email ocorrência para: ', vNotificaoEmailLista[i].email)
      marcarNotificacaoEmailEnviado(vNotificaoEmailLista[i]._id, vNotificaoEmailLista[i].email, new Date(), {})
    }, (error) => {
    })
  }

  return Promise.all(resultado)
}

const functions = {
  listar: (req, pFiltroLido) => listar(req, pFiltroLido),
  incluir: (body) => incluir(body),
  marcarLido: (pNotificacaoId, pUsuarioId) => marcarLido(pNotificacaoId, pUsuarioId),
  marcarNaoLido: (pNotificacaoId, pUsuarioId) => marcarNaoLido(pNotificacaoId, pUsuarioId),
  enviarEmail: (pId) => enviarEmail(pId),
  encontrarUsuariosParaNotificacao: (perfis) => encontrarUsuariosParaNotificacao(perfis),
  encontrarEmailsParaNotificacao: (pedido, destinatarios) => encontrarEmailsParaNotificacao(pedido, destinatarios),
  inserirNotificacoes: (ocorrenciaParaInclusao, idOcorrencia, numeroPedido, codigoFilial) => inserirNotificacoes(ocorrenciaParaInclusao, idOcorrencia, numeroPedido, codigoFilial),
  listarEmailsNaoEnviados: (req) => listarEmailsNaoEnviados(req),
  marcarNotificacaoEmailEnviado: (pNotificacaoId, pEmail, pDataEnvio, pOptions) => marcarNotificacaoEmailEnviado(pNotificacaoId, pEmail, pDataEnvio, pOptions),
  processarEmailEnvioOcorrencias: () => processarEmailEnvioOcorrencias(),
}

export default functions
