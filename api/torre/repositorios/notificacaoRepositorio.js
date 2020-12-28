import Base from './base/baseRepositorio'
import utilitarios from '../funcoes/utilitarios'

require('../modelos/notificacao')

class notificacaoRepositorio {
  constructor() {
    this.baseRepositorio = new Base('torreNotificacao')
  }

  async incluir(data, pOptions) {
    return this.baseRepositorio.incluir(data, pOptions)
  }

  async listar(pParams, pFiltro) {
    return this.baseRepositorio.listar(pParams, pFiltro)
  }

  async expurgarNotificacoesAntigas(qtdDiasExpurgo) {
    const vDataReferencia = utilitarios.obterDataCorrente()
    const vDataReferenciaParaExpurgo = vDataReferencia.clone().subtract(qtdDiasExpurgo, 'day')
    const vFiltro = { dataHora: { $lt: vDataReferenciaParaExpurgo } }

    return await this.baseRepositorio.excluirVarios(vFiltro)
  }

  async listarNotificacoesParExpurgo() {
    // var dataReferencia = new Date()
    // dataReferencia.setDate(dataReferencia.getDate()-5)

    // console.log('dataReferencia', dataReferencia)

    const vDataReferencia = utilitarios.obterDataCorrente()
    const vDataReferenciaMenosDois = vDataReferencia.clone().subtract(2, 'day')

    const vFiltro = { dataHora: { $lt: vDataReferenciaMenosDois } }

    console.log('sfiltro', vFiltro)

    return this.baseRepositorio.listar({ pagina: 0, limite: 999 }, vFiltro)
  }

  async obter(id) {
    return this.baseRepositorio.obter(id)
  }

  async alterar(id, data, pOptions) {
    return this.baseRepositorio.alterar(id, data, pOptions)
  }

  async marcarLido(pNotificacaoId, pUsuarioId, pOptions) {
    const vFiltro = { _id: pNotificacaoId, 'usuarios.usuarioId': pUsuarioId }
    return this.baseRepositorio.alterarUm(vFiltro, { 'usuarios.$.lido': true, 'usuarios.$.dataLeitura': new Date() }, pOptions)
  }

  async marcarNaoLido(pNotificacaoId, pUsuarioId, pOptions) {
    const vFiltro = { _id: pNotificacaoId, 'usuarios.usuarioId': pUsuarioId }
    return this.baseRepositorio.alterarUm(vFiltro, { 'usuarios.$.lido': false, 'usuarios.$.dataLeitura': null }, pOptions)
  }

  async obterNotificacoesPorUsuario(req, pFiltroLido) {
    const vUsuarioId = req.usuarioLogado._id
    let vFiltro
    if (pFiltroLido === 'L') { // Lidos
      vFiltro = { $and: [{ 'usuarios.usuarioId': vUsuarioId }, { 'usuarios.lido': true }] }
    } else if (pFiltroLido === 'N') { // Não Lidos
      vFiltro = { $and: [{ 'usuarios.usuarioId': vUsuarioId }, { 'usuarios.lido': false }] }
    } else { // Todos
      vFiltro = { 'usuarios.usuarioId': vUsuarioId }
    }

    return this.baseRepositorio.listar(req.query, vFiltro)
  }

  async listarEmailsNaoEnviados(req) {
    const vAggregate = [
      { $unwind: '$emails' },
      { $match: { 'emails.enviado': false } },
      {
        $replaceWith: {
          _id: '$_id',
          titulo: '$titulo',
          corpo: '$corpo',
          dataEnvio: '$emails.dataEnvio',
          enviado: '$emails.enviado',
          email: '$emails.email',
        },
      },
    ]

    const pParams = req.query
    pParams.instrucao = vAggregate

    return this.baseRepositorio.agregar(pParams)
  }

  async marcarNotificacaoEmailEnviado(pNotificacaoId, pEmail, pDataEnvio, pOptions) {
    const vFiltro = { _id: pNotificacaoId, 'emails.email': pEmail }
    return this.baseRepositorio.alterarUm(vFiltro, { 'emails.$[].enviado': true, 'emails.$[].dataEnvio': pDataEnvio }, pOptions)
  }


}

export default notificacaoRepositorio
