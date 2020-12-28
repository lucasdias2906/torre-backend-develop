import BaseErro from './base/baseErro'
import Util from '../funcoes/utilitarios'
import enums from './../modelos/_enums'
import ocorrencia from './../modelos/ocorrencia'

import OcorrenciaOrigemRepositorio from '../repositorios/ocorrenciaOrigemRepositorio'
import OcorrenciaDisparoRepositorio from '../repositorios/ocorrenciaDisparoRepositorio'
import OcorrenciaClassificacaoRepositorio from '../repositorios/ocorrenciaClassificacaoRepositorio'
import OcorrenciaPrioridadeRepositorio from '../repositorios/ocorrenciaPrioridadeRepositorio'
import OcorrenciaDestinatarioRepositorio from '../repositorios/ocorrenciaDestinatarioRepositorio'
import OcorrenciaStatusRepositorio from '../repositorios/ocorrenciaStatusRepositorio'
import OcorrenciaRepositorio from '../repositorios/ocorrenciaRepositorio'
import TipoOcorrenciaRepositorio from '../repositorios/tipoOcorrenciaRepositorio'
import UsuarioRepositorio from '../repositorios/usuarioRepositorio'
import PedidoMonitoramentoRepositorio from '../repositorios/pedidoMonitoramentoRepositorio'

import PedidoServico from '../servicos/pedidoServico'
import MotoristaServico from '../servicos/motoristaServico'
import VeiculoServico from '../servicos/veiculoServico'
import mapaSinoticoServico from '../servicos/mapaSinoticoServico'
import notificacaoServico from '../servicos/notificacaoServico'

import { enumStatusOcorrencia } from '../modelos/enumStatusOcorrencia'
import moment from 'moment'

const ocorrenciaRepositorio = new OcorrenciaRepositorio()
const pedidoMonitoramentoRepositorio = new PedidoMonitoramentoRepositorio()

async function listarOrigemOcorrencia(req) {
  return new OcorrenciaOrigemRepositorio().listar({})
}

async function listarDisparoOcorrencia(req) {
  return new OcorrenciaDisparoRepositorio().listar({})
}

async function listarClassificacaoOcorrencia(req) {
  return new OcorrenciaClassificacaoRepositorio().listar({})
}

async function listarPrioridadeOcorrencia(req) {
  return new OcorrenciaPrioridadeRepositorio().listar({})
}

async function listarDestinatarioOcorrencia(req) {
  return new OcorrenciaDestinatarioRepositorio().listar({})
}

async function listarStatusOcorrencia(req) {
  return new OcorrenciaStatusRepositorio().listar({})
}

async function listarOcorrencias(req) {
  // const vNome = pParams.nome ? pParams.nome : "";
  const vCodigo = req.query.codigo ? req.query.codigo : null
  const vNumeroPedido = req.query.numeroPedido ? req.query.numeroPedido : null
  const vCodigoFilial = req.query.codigoFilial ? req.query.codigoFilial : null
  const vCodigoMotorista = req.query.codigoMotorista ? req.query.codigoMotorista : null
  const vCodigoVeiculo = req.query.codigoVeiculo ? req.query.codigoVeiculo : null

  const vDescricao = req.query.descricao ? req.query.descricao : ''
  const vStatus = req.query.status ? req.query.status : ''
  const vOrigem = req.query.origem ? req.query.origem : ''
  const vPrioridade = req.query.prioridade ? req.query.prioridade : ''
  const vClassificacao = req.query.classificacao ? req.query.classificacao : ''

  //let minDate = req.query.periodoInicial ? req.query.periodoInicial : new Date(moment().subtract(90, 'days').toString())
  //let maxDate = req.query.periodoFinal ? req.query.periodoFinal : new Date(moment().add(90, 'days').toString())

  const vFiltro = {
    descricao: { $regex: '.*' + vDescricao + '.*', $options: 'i' },
    status: { $regex: '.*' + vStatus + '.*', $options: 'i' },
    origem: { $regex: '.*' + vOrigem + '.*', $options: 'i' },
    prioridade: { $regex: '.*' + vPrioridade + '.*', $options: 'i' },
    classificacao: { $regex: '.*' + vClassificacao + '.*', $options: 'i' },
    //dataOcorrencia: { $gte: minDate, $lte: maxDate }
  }

  if (vCodigo) vFiltro['codigo'] = vCodigo
  if (vNumeroPedido) vFiltro['pedido.numero'] = vNumeroPedido
  if (vCodigoFilial) vFiltro['pedido.codigoFilial'] = vCodigoFilial
  if (vCodigoMotorista) vFiltro['motorista.codigo'] = vCodigoMotorista
  if (vCodigoVeiculo) vFiltro['veiculo.codigo'] = vCodigoVeiculo

  return ocorrenciaRepositorio.listar(req.query, vFiltro)
}

async function obterOcorrencia(pId) {
  const dadosOcorrencia = (await ocorrenciaRepositorio.obter(pId)).dados

  const ocorrencia = {
    dados: {
      _id: dadosOcorrencia._id,
      codigo: dadosOcorrencia.codigo,
      tipoOcorrenciaId: dadosOcorrencia.tipoOcorrenciaId,
      origem: dadosOcorrencia.origem,
      disparo: dadosOcorrencia.disparo,
      classificacao: dadosOcorrencia.classificacao,
      prioridade: dadosOcorrencia.prioridade,
      descricao: dadosOcorrencia.descricao,
      descricaoDetalhada: dadosOcorrencia.descricaoDetalhada,
      tempoMaximoOcorrenciaSemAcao: dadosOcorrencia.tempoMaximoOcorrenciaSemAcao,
      tempoMaximoOcorrenciaPendente: dadosOcorrencia.tempoMaximoOcorrenciaPendente,
      dataLimitePrimeiraAcao: dadosOcorrencia.dataLimitePrimeiraAcao,
      dataLimiteEncerramento: dadosOcorrencia.dataLimiteEncerramento,
      dataEfetivaPrimeiraAcao: dadosOcorrencia.dataEfetivaPrimeiraAcao || null,
      informacoesAdicionais: dadosOcorrencia.informacoesAdicionais || null,
      perfis: dadosOcorrencia.perfis,
      destinatarios: dadosOcorrencia.destinatarios,
      status: dadosOcorrencia.status,
      dataOcorrencia: dadosOcorrencia.dataOcorrencia,
      dataFimOcorrencia: dadosOcorrencia.dataFimOcorrencia || null,
      abertura: dadosOcorrencia.abertura,
      encerramento: dadosOcorrencia.encerramento || null,
      pedido: dadosOcorrencia.pedido || null,
      motorista: dadosOcorrencia.motorista || null,
      veiculo: dadosOcorrencia.veiculo || null,
      historicoAcoes: dadosOcorrencia.historicoAcoes,
      log: dadosOcorrencia.log
    }
  }

  ocorrencia.dados.estouroTempoSemAcao = (ocorrencia.dados.dataEfetivaPrimeiraAcao || Date.now()) > ocorrencia.dados.dataLimitePrimeiraAcao
  ocorrencia.dados.estouroTempoEncerramento = ocorrencia.dados.dataFimOcorrencia > ocorrencia.dados.dataLimiteEncerramento

  switch (ocorrencia.dados.status) {
    case 'ABERTA': {
      ocorrencia.dados.statusDetalhado =
        ocorrencia.dados.historicoAcoes.length === 0
          ? 'NENHUMA AÇÃO registrada para esta ocorrência. '
          : ''

      ocorrencia.dados.statusDetalhado +=
        ocorrencia.dados.estouroTempoSemAcao
          ? 'ESTOURO DO TEMPO LIMITE de registro de ação.'
          : ''

      break
    }
    case 'FECHADA': {
      if (ocorrencia.dados.estouroTempoEncerramento) {
        ocorrencia.dados.statusDetalhado = 'Ocorrência fechada FORA DO TEMPO PREVISTO.'
      } else {
        ocorrencia.dados.statusDetalhado = 'Ocorrência fechada DENTRO DO TEMPO PREVISTO.'
      }
      break
    }
    case 'CANCELADA': {
      ocorrencia.dados.statusDetalhado = 'Ocorrência cancelada.'
      break
    }
  }

  return ocorrencia
}

function formatarData(pData) {
  return pData // moment(pData).format('DD/MM/YYYY HH:mm')
}

async function incluirOcorrenciaAutomaticaMotorista(
  tipoOcorrenciaCodigo,
  codigoMotorista,
  informacoesAdicionais,
) {
  let informacoesAdicionaisOcorrencia = ''

  if (informacoesAdicionais) { }

  const req = {
    body: {
      tipoOcorrenciaCodigo,
      codigoMotorista,
      dataOcorrencia: Date.now(),
      informacoesAdicionaisOcorrencia: informacoesAdicionaisOcorrencia === '' ? null : informacoesAdicionaisOcorrencia,
    },
    query: {},
  }

  const ocorrenciaParaInclusao = await montarOcorrencia(req, 'AUTOMATICA')

  const vExiste = await ocorrenciaRepositorio.VerificarOcorrenciaExiste(
    ocorrenciaParaInclusao.origem,
    ocorrenciaParaInclusao.tipoOcorrenciaId,
    ocorrenciaParaInclusao.motorista.codigo,
    ocorrenciaParaInclusao.status,
    ocorrenciaParaInclusao.prioridade,
    ocorrenciaParaInclusao.classificacao,
    ocorrenciaParaInclusao.dataOcorrencia,
  )

  let ocorrenciaIncluida = { dados: null }

  if (!vExiste) {
    const vOcorrenciaInclusao = await ocorrenciaRepositorio.incluir(ocorrenciaParaInclusao)

    notificacaoServico.inserirNotificacoes(
      ocorrenciaParaInclusao,
      vOcorrenciaInclusao.dados._id,
      null,
      null,
    )
    ocorrenciaIncluida = await obterOcorrencia(vOcorrenciaInclusao.dados._id)
  }

  return ocorrenciaIncluida
}

async function incluirOcorrenciaAutomaticaVeiculo(
  tipoOcorrenciaCodigo,
  codigoVeiculo,
  informacoesAdicionais,
) {
  let informacoesAdicionaisOcorrencia = ''

  if (informacoesAdicionais) { }

  const req = {
    body: {
      tipoOcorrenciaCodigo,
      codigoVeiculo,
      dataOcorrencia: Date.now(),
      informacoesAdicionaisOcorrencia: informacoesAdicionaisOcorrencia === '' ? null : informacoesAdicionaisOcorrencia,
    },
    query: {},
  }

  const ocorrenciaParaInclusao = await montarOcorrencia(req, 'AUTOMATICA')

  const vExiste = await ocorrenciaRepositorio.VerificarOcorrenciaExiste(
    ocorrenciaParaInclusao.origem,
    ocorrenciaParaInclusao.tipoOcorrenciaId,
    ocorrenciaParaInclusao.veiculo.codigo,
    ocorrenciaParaInclusao.status,
    ocorrenciaParaInclusao.prioridade,
    ocorrenciaParaInclusao.classificacao,
    ocorrenciaParaInclusao.dataOcorrencia,
  )

  let ocorrenciaIncluida = { dados: null }

  if (!vExiste) {
    const vOcorrenciaInclusao = await ocorrenciaRepositorio.incluir(ocorrenciaParaInclusao)

    notificacaoServico.inserirNotificacoes(
      ocorrenciaParaInclusao,
      vOcorrenciaInclusao.dados._id,
      null,
      null,
    )
    ocorrenciaIncluida = await obterOcorrencia(vOcorrenciaInclusao.dados._id)
  }

  return ocorrenciaIncluida
}

async function incluirOcorrenciaAutomatica(
  tipoOcorrenciaCodigo,
  numeroPedido,
  codigoFilial,
  informacoesAdicionais,
  proximaEtapa,
) {
  let informacoesAdicionaisOcorrencia = ''

  if (informacoesAdicionais) {
    const {
      tempoExcedido,
      dataLimiteProgramacao,
      dataEfetivaProgramacao,
      rastreador,
      ultimaComunicacao,
      novaPrevisaoChegada,
      dataHoraEntradaEfetiva,
      dataHoraSaidaEfetiva,
    } = informacoesAdicionais

    informacoesAdicionaisOcorrencia += tempoExcedido ? `Tempo Excedido: ${tempoExcedido === true ? 'Sim' : 'Não'}\n` : ''
    informacoesAdicionaisOcorrencia += dataLimiteProgramacao ? `Data Limite Programação: ${formatarData(dataLimiteProgramacao)}\n` : ''
    informacoesAdicionaisOcorrencia += dataEfetivaProgramacao ? `Data Efetiva Programação: ${formatarData(dataEfetivaProgramacao)}\n` : ''
    informacoesAdicionaisOcorrencia += rastreador ? `Número Rastreador: ${rastreador}\n` : ''
    informacoesAdicionaisOcorrencia += ultimaComunicacao ? `Data Última Comunicação: ${formatarData(ultimaComunicacao)}\n` : ''
    informacoesAdicionaisOcorrencia += novaPrevisaoChegada ? `Data Nova Previsão Chegada: ${formatarData(novaPrevisaoChegada)}\n` : ''
    informacoesAdicionaisOcorrencia += dataHoraEntradaEfetiva ? `Data Entrada Efetiva: ${formatarData(dataHoraEntradaEfetiva)}\n` : ''
    informacoesAdicionaisOcorrencia += dataHoraSaidaEfetiva ? `Data Saída Efetiva: ${formatarData(dataHoraSaidaEfetiva)}\n` : ''


    if (proximaEtapa && proximaEtapa.idProximaEtapa) {
      switch (tipoOcorrenciaCodigo) {
        case enums.OCORRENCIA.REGISTRO_ENTRADA_AREA_COLETA:
        case enums.OCORRENCIA.REGISTRO_ENTRADA_AREA_ENTREGA:
          await mapaSinoticoServico.registrarEntradaEmPoligono(proximaEtapa.idProximaEtapa, dataHoraEntradaEfetiva)
          break
        case enums.OCORRENCIA.REGISTRO_SAIDA_AREA_COLETA:
        case enums.OCORRENCIA.REGISTRO_SAIDA_AREA_ENTREGA:
          await mapaSinoticoServico.registrarSaidaDoPoligono(proximaEtapa.idProximaEtapa, dataHoraSaidaEfetiva)
          break
      }
    }
  }

  const req = {
    body: {
      tipoOcorrenciaCodigo,
      numeroPedido,
      codigoFilial,
      dataOcorrencia: Date.now(),
      informacoesAdicionaisOcorrencia: informacoesAdicionaisOcorrencia === '' ? null : informacoesAdicionaisOcorrencia,
      parceiroComercial: proximaEtapa ? proximaEtapa.idParceiroComercial : null
    }
  }

  const ocorrenciaParaInclusao = await montarOcorrencia(req, 'AUTOMATICA')

  const vExiste = await ocorrenciaRepositorio.VerificarOcorrenciaExiste(
    ocorrenciaParaInclusao.origem,
    ocorrenciaParaInclusao.tipoOcorrenciaId,
    ocorrenciaParaInclusao.pedido.numero,
    ocorrenciaParaInclusao.status,
    ocorrenciaParaInclusao.prioridade,
    ocorrenciaParaInclusao.classificacao,
    ocorrenciaParaInclusao.dataOcorrencia,
    ocorrenciaParaInclusao.pedido.parceiroComercial
  )

  let ocorrenciaIncluida = { dados: null }
  if (!vExiste) {
    const vOcorrenciaInclusao = await ocorrenciaRepositorio.incluir(ocorrenciaParaInclusao)

    notificacaoServico.inserirNotificacoes(
      ocorrenciaParaInclusao,
      vOcorrenciaInclusao.dados._id,
      numeroPedido,
      codigoFilial,
    )

    ocorrenciaIncluida = await obterOcorrencia(vOcorrenciaInclusao.dados._id)
  }
  else if (tipoOcorrenciaCodigo == 5) {    

    const vOcorrenciaInclusao = await ocorrenciaRepositorio.alterar({ _id: vExiste._id }, ocorrenciaParaInclusao)

    notificacaoServico.inserirNotificacoes(
      ocorrenciaParaInclusao,
      vOcorrenciaInclusao.dados._id,
      numeroPedido,
      codigoFilial,
    )

    ocorrenciaIncluida = await obterOcorrencia(vOcorrenciaInclusao.dados._id)
  }

  return ocorrenciaIncluida
}

async function incluirOcorrenciaManual(req) {
  const ocorrenciaParaInclusao = await montarOcorrencia(req, 'MANUAL')

  const vOcorrenciaInclusao = await ocorrenciaRepositorio.incluir(ocorrenciaParaInclusao)

  notificacaoServico.inserirNotificacoes(
    ocorrenciaParaInclusao,
    vOcorrenciaInclusao.dados._id,
    req.body.numeroPedido,
    req.body.codigoFilial,
  )

  const ocorrenciaIncluida = await obterOcorrencia(vOcorrenciaInclusao.dados._id)

  return ocorrenciaIncluida
}

async function montarOcorrencia(req, disparo) {
  const { body } = req

  if (!body.tipoOcorrenciaCodigo && !body.tipoOcorrenciaId) throw new BaseErro(400, 'tipoOcorrenciaNaoExiste')

  let tipoOcorrencia = {}

  if (body.tipoOcorrenciaCodigo) tipoOcorrencia = await new TipoOcorrenciaRepositorio().obterPorCodigo(body.tipoOcorrenciaCodigo)
  if (body.tipoOcorrenciaId) tipoOcorrencia = await new TipoOcorrenciaRepositorio().obter(body.tipoOcorrenciaId)

  let usuarioLogin = null
  let usuarioNome = null
  let pedidoConsulta = null
  let pedidoMonitoramentoConsulta
  let motoristaConsulta = null
  let motoristaDocumentacaoConsulta = null
  let veiculoConsulta = null
  let vCodigoFilial = -1

  if (!tipoOcorrencia) throw new BaseErro(400, 'tipoOcorrenciaNaoExiste')

  if (tipoOcorrencia.dados.disparo !== disparo && tipoOcorrencia.dados.disparo !== 'AMBAS') throw new BaseErro(400, 'tipoOcorrenciaNaoExiste')

  if (tipoOcorrencia.dados.disparo === 'AUTOMATICA' || tipoOcorrencia.dados.disparo === 'AMBAS') {
    body.perfis = tipoOcorrencia.dados.perfis
    body.destinatarios = tipoOcorrencia.dados.destinatarios
  }

  if (tipoOcorrencia.dados.disparo !== 'AUTOMATICA') {
    if (global.usuarioLogin) {
      const usuarioAbertura = await new UsuarioRepositorio().obter(global.usuarioLogin._id)
      usuarioLogin = usuarioAbertura.dados.login
      usuarioNome = usuarioAbertura.dados.nome
      if (!usuarioAbertura) throw new BaseErro(400, 'usuarioNaoEncontrado')
    } else {
      usuarioLogin = 'N/A'
      usuarioNome = 'N/A'
    }
  }

  if (tipoOcorrencia.dados.origem === 'PEDIDO') {
    if (!body.numeroPedido) throw new BaseErro(400, 'pedidoOcorrenciaNaoInformado')
    if (!body.codigoFilial) throw new BaseErro(400, 'pedidoOcorrenciaNaoInformado')

    vCodigoFilial =  body.codigoFilial

    pedidoMonitoramentoConsulta = await pedidoMonitoramentoRepositorio.obterPorPedidoAndFilial(body.numeroPedido, body.codigoFilial)
  } else if (tipoOcorrencia.dados.origem === 'MOTORISTA') {
    if (!body.codigoMotorista) throw new BaseErro(400, 'motoristaOcorrenciaNaoInformado')

    motoristaConsulta = await MotoristaServico.obterDadosPessoais(body.codigoMotorista)
    motoristaDocumentacaoConsulta = await MotoristaServico.obterDocumentacao(body.codigoMotorista)

    vCodigoFilial = motoristaConsulta.dados.localizacao.codigoFilial

  } else if (tipoOcorrencia.dados.origem === 'VEICULO') {
    if (!body.codigoVeiculo) throw new BaseErro(400, 'veiculoOcorrenciaNaoInformado')

    veiculoConsulta = (await VeiculoServico.obter(body.codigoVeiculo, req)).dados
    vCodigoFilial = veiculoConsulta ? veiculoConsulta.veiculo.codigoFilial : -1
  }

  const vCodigoOcorrencia = await Util.gerarSequencia('codigoOcorrencia')

  const ocorrencia = {
    codigo: vCodigoOcorrencia,
    tipoOcorrenciaId: tipoOcorrencia.dados._id,
    dataOcorrencia: body.dataOcorrencia,
    origem: tipoOcorrencia.dados.origem,
    disparo: tipoOcorrencia.dados.disparo,
    classificacao: tipoOcorrencia.dados.classificacao,
    prioridade: body.prioridade || tipoOcorrencia.dados.prioridade,
    tempoMaximoOcorrenciaSemAcao: tipoOcorrencia.dados.tempoMaximoOcorrenciaSemAcao,
    tempoMaximoOcorrenciaPendente: tipoOcorrencia.dados.tempoMaximoOcorrenciaPendente,
    dataLimitePrimeiraAcao: moment(new Date()).add(tipoOcorrencia.dados.tempoMaximoOcorrenciaSemAcao, 'hours'),
    dataLimiteEncerramento: moment(new Date()).add(tipoOcorrencia.dados.tempoMaximoOcorrenciaPendente, 'days'),
    descricao: tipoOcorrencia.dados.descricao,
    descricaoDetalhada: body.descricaoDetalhada || tipoOcorrencia.dados.textoPadrao,
    status: tipoOcorrencia.dados.classificacao === 'GERENCIAL' ? enumStatusOcorrencia.ABERTA : enumStatusOcorrencia.FECHADA,
    informacoesAdicionais: body.informacoesAdicionaisOcorrencia,
    codigoFilial: vCodigoFilial,
    perfis: body.perfis,
    destinatarios: body.destinatarios,
    abertura: {
      data: new Date(),
      usuarioLogin: usuarioLogin,
      usuarioNome: usuarioNome
    },
    pedido:
      tipoOcorrencia.dados.origem === 'PEDIDO'
        ? pedidoMonitoramentoConsulta == null || {
          numero: pedidoMonitoramentoConsulta.dados.numeroPedido,
          codigoFilial: pedidoMonitoramentoConsulta.dados.codigoFilial,
          nomeFilial: pedidoMonitoramentoConsulta.dados.nomeFilial,
          cliente: pedidoMonitoramentoConsulta.dados.nomeTomador,
          placaVeiculo: pedidoMonitoramentoConsulta.dados.placaVeiculo,
          origem: pedidoMonitoramentoConsulta.dados.nomeRemetente,
          destino: pedidoMonitoramentoConsulta.dados.nomeDestinatario,
          motorista: pedidoMonitoramentoConsulta.dados.codigoMotorista1,
          nomeMotorista: pedidoMonitoramentoConsulta.dados.nomeMotorista,
          parceiroComercial: body.parceiroComercial
        }
        : null,
    motorista:
      tipoOcorrencia.dados.origem === 'MOTORISTA'
        ? motoristaConsulta == null || {
          codigo: motoristaConsulta.dados.documentos.codigoMotorista,
          nome: motoristaConsulta.dados.documentos.nomeMotorista,
          cpf: motoristaConsulta.dados.documentos.numeroCPF,
          rg: motoristaDocumentacaoConsulta.dados.rg.numeroRG,
          cnh: motoristaDocumentacaoConsulta.dados != null ? motoristaDocumentacaoConsulta.dados.habilitacao.numeroCNH : null,
          dataNascimento: motoristaConsulta.dados.documentos.dataNascimento,
          codigoFilial: motoristaConsulta.dados.localizacao.codigoFilial,
        }
        : null,
    veiculo:
      tipoOcorrencia.dados.origem === 'VEICULO'
        ? veiculoConsulta == null || {
          codigo: veiculoConsulta ? veiculoConsulta.veiculo.codigoVeiculo : null,
          codigoFilial: veiculoConsulta ? veiculoConsulta.veiculo.codigoFilial : -1,
          nomeProprietario: veiculoConsulta ? veiculoConsulta.veiculo.nomeProprietario : null,
          placa: veiculoConsulta ? veiculoConsulta.veiculo.identificacaoPlacaVeiculo : null,
          chassi: veiculoConsulta ? veiculoConsulta.veiculo.numeroChassi : null,
          marca: veiculoConsulta ? veiculoConsulta.veiculo.descricaoMarca : null,
          modelo: veiculoConsulta ? veiculoConsulta.veiculo.descricaoModelo : null,
        }
        : null,
  }

  return ocorrencia
}

async function incluirAcao(pId, req) {
  const vFiltro = { _id: pId }
  const ocorrencia = await ocorrenciaRepositorio.obter(pId)

  const usuarioAbertura = await new UsuarioRepositorio().obter(global.usuarioLogin._id)
  const usuarioLogin = usuarioAbertura.dados.login
  const usuarioNome = usuarioAbertura.dados.nome

  const historicoAcao = {
    acao: req.body.acao,
    dataAcao: Date.now(),
    usuarioLogin,
    usuarioNome,
  }

  const ocorrenciaEditada = ocorrencia.dados

  ocorrenciaEditada.log = {}
  ocorrenciaEditada.dataEfetivaPrimeiraAcao = ocorrenciaEditada.historicoAcoes.length === 0 ? Date.now() : ocorrenciaEditada.dataEfetivaPrimeiraAcao
  ocorrenciaEditada.historicoAcoes.push(historicoAcao)

  const vOcorrencia = await ocorrenciaRepositorio.alterar(vFiltro, ocorrenciaEditada)

  return vOcorrencia
}

async function encerrarOcorrencia(pId, req) {
  if (!req.body.dataFimOcorrencia) throw new BaseErro(400, 'dataFimOcorrenciaNaoInformada')

  const vFiltro = { _id: pId }
  const ocorrencia = await ocorrenciaRepositorio.obter(pId)

  const usuarioAbertura = await new UsuarioRepositorio().obter(global.usuarioLogin._id)
  const usuarioLogin = usuarioAbertura.dados.login
  const usuarioNome = usuarioAbertura.dados.nome

  const historicoAcao = {
    acao: req.body.acao,
    dataAcao: Date.now(),
    usuarioLogin,
    usuarioNome,
  }

  const ocorrenciaEditada = ocorrencia.dados

  ocorrenciaEditada.dataFimOcorrencia = req.body.dataFimOcorrencia
  ocorrenciaEditada.status = 'FECHADA'
  ocorrenciaEditada.encerramento.data = Date.now()
  ocorrenciaEditada.encerramento.usuarioLogin = usuarioLogin
  ocorrenciaEditada.encerramento.usuarioNome = usuarioNome
  ocorrenciaEditada.log = {}
  ocorrenciaEditada.historicoAcoes.push(historicoAcao)

  const vOcorrencia = await ocorrenciaRepositorio.alterar(vFiltro, ocorrenciaEditada)

  return vOcorrencia
}

async function listarPedidoOcorrencia(pReq, prioridade) {

  let periodoViagemInicial = new Date()
  let periodoViagemFinal = new Date()

  if (pReq.query.dataRetiradaInicial) {
    periodoViagemInicial = pReq.query.dataRetiradaInicial
    periodoViagemFinal = pReq.query.dataRetiradaFinal
  } else if (pReq.query.dataEntregaInicial) {
    periodoViagemInicial = pReq.query.dataRetiradaInicial
    periodoViagemFinal = pReq.query.dataRetiradaFinal
  }
  else {
    periodoViagemInicial = pReq.query.dataPrevisaoChegadaInicial
    periodoViagemFinal = pReq.query.dataPrevisaoChegadaFinal
  }

  let dados = await ocorrencia.aggregate([
    {
      $match: {
        "pedido.codigoFilial": { $in: pReq.usuarioLogado.filiais.map(String) },
        dataOcorrencia: { $gte: new Date(periodoViagemInicial), $lte: new Date(periodoViagemFinal) },
        prioridade: prioridade,
        status: "ABERTA"
      }
    },
    {
      "$group": {
        "_id": null,
        "distinct": {
          "$addToSet": "$$ROOT"
        }
      }
    },
    {
      "$unwind": {
        "path": "$distinct",
        "preserveNullAndEmptyArrays": false
      }
    },
    {
      "$replaceRoot": {
        "newRoot": "$distinct"
      }
    }
  ]);

  let numeroPedido = []
  dados.map((elem) => { numeroPedido.push(elem.pedido.numero) })
  return numeroPedido
}

async function listarRatreadoresOcorrencias(pReq, origem, placas) {

  let vFiltro = []
  let periodoViagemInicial = new Date(moment().subtract(90, 'days').toString());
  let periodoViagemFinal = new Date(moment().add(90, 'days').toString());

  if (origem == "VEICULO") {
    vFiltro = {
      "torreTipoOcorrencia.codigo": {
        $in: [enums.OCORRENCIA.RASTREADOR_CARRETA_SEM_COMUNICACAO,
        enums.OCORRENCIA.RASTREADOR_CAVALO_SEM_COMUNICACAO]
      },
      "dataOcorrencia": { $gte: new Date(pReq.query.periodoViagemInicial), $lte: new Date(pReq.query.periodoViagemFinal) },
      "torreOcorrencia.veiculo.placa": {
        $in: [...placas]
      }
    }
  } else {

    if (pReq.query.dataRetiradaInicial) {
      periodoViagemInicial = pReq.query.dataRetiradaInicial
      periodoViagemFinal = pReq.query.dataRetiradaFinal
    } else if (pReq.query.dataEntregaInicial) {
      periodoViagemInicial = pReq.query.dataRetiradaInicial
      periodoViagemFinal = pReq.query.dataRetiradaFinal
    }
    else {
      periodoViagemInicial = pReq.query.dataPrevisaoChegadaInicial
      periodoViagemFinal = pReq.query.dataPrevisaoChegadaFinal
    }

    vFiltro = {
      "torreTipoOcorrencia.codigo": {
        $in: [enums.OCORRENCIA.RASTREADOR_PEDIDO_CAVALO_SEM_COMUNICACAO,
        enums.OCORRENCIA.RASTREADOR_PEDIDO_CARRETA_SEM_COMUNICACAO,
        enums.OCORRENCIA.ATRASO_CHEGADA_AREA_COLETA]
      },
      "torreOcorrencia.pedido.placaVeiculo": {
        $in: [...placas]
      }
    }
  }

  let dados = await ocorrencia.aggregate([
    [
      {
        $project: {
          _id: "NumberInt(0)",
          torreOcorrencia: "$$ROOT"
        }
      },
      {
        $lookup: {
          localField: "torreOcorrencia.tipoOcorrenciaId",
          from: "torreTipoOcorrencia",
          foreignField: "_id",
          as: "torreTipoOcorrencia"
        }
      },
      {
        $match: {
          $and: [
            {
              "torreOcorrencia.status": "ABERTA"
            },
            vFiltro
          ]
        }
      },
      {
        "$group": {
          "_id": null,
          "distinct": {
            "$addToSet": "$$ROOT"
          }
        }
      },
      {
        "$unwind": {
          "path": "$distinct",
          "preserveNullAndEmptyArrays": false
        }
      },
      {
        "$replaceRoot": {
          "newRoot": "$distinct"
        }
      }
    ],
  ]);

  let placaVeiculo = []
  dados.map((elem) => {
    if (origem == "PEDIDO") placaVeiculo.push(String(elem.torreOcorrencia.pedido.placaVeiculo).replace(/[-]/, ''))
    if (origem == "VEICULO") placaVeiculo.push(String(elem.torreOcorrencia.veiculo.codigo))
  })
  return [...new Set(placaVeiculo)]
}

const functions = {
  listarOrigemOcorrencia: (req) => { return listarOrigemOcorrencia(req) },
  listarDisparoOcorrencia: (req) => { return listarDisparoOcorrencia(req) },
  listarClassificacaoOcorrencia: (req) => { return listarClassificacaoOcorrencia(req) },
  listarPrioridadeOcorrencia: (req) => { return listarPrioridadeOcorrencia(req) },
  listarDestinatarioOcorrencia: (req) => { return listarDestinatarioOcorrencia(req) },
  listarStatusOcorrencia: (req) => { return listarStatusOcorrencia(req) },
  listarOcorrencias: (req) => { return listarOcorrencias(req) },
  listarPedidoOcorrencia: (pReq, prioridade) => { return listarPedidoOcorrencia(pReq, prioridade) },
  listarRatreadoresOcorrencias: (pReq, origem, placas) => { return listarRatreadoresOcorrencias(pReq, origem, placas) },
  obterOcorrencia: (req) => { return obterOcorrencia(req) },
  incluirOcorrenciaManual: (req) => { return incluirOcorrenciaManual(req) },
  incluirOcorrenciaAutomatica: (tipoOcorrenciaCodigo, numeroPedido, codigoFilial, informacoesAdicionais, proximaEtapa) => incluirOcorrenciaAutomatica(tipoOcorrenciaCodigo, numeroPedido, codigoFilial, informacoesAdicionais, proximaEtapa),
  incluirOcorrenciaAutomaticaVeiculo: (tipoOcorrenciaCodigo, codigoVeiculo, informacoesAdicionais) => incluirOcorrenciaAutomaticaVeiculo(tipoOcorrenciaCodigo, codigoVeiculo, informacoesAdicionais),
  incluirOcorrenciaAutomaticaMotorista: (tipoOcorrenciaCodigo, codigoMotorista, informacoesAdicionais) => incluirOcorrenciaAutomaticaMotorista(tipoOcorrenciaCodigo, codigoMotorista, informacoesAdicionais),
  incluirAcao: (pId, req) => { return incluirAcao(pId, req) },
  encerrarOcorrencia: (pId, req) => { return encerrarOcorrencia(pId, req) }
}

export default functions
