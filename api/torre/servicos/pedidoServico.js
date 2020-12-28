import BaseErro from './base/baseErro'
import baseServico from './base/baseServico'
import ocorrenciaServico from './../servicos/ocorrenciaServico'
import enums from './../modelos/_enums'
import urlHub from '../configuracao/hub'
import moment from 'moment'

async function listar(pAgrupar, pReq) {
  if (pAgrupar === 'S') {
    if ((pReq.query.dataRetiradaInicial && !pReq.query.dataRetiradaFinal) ||
      (!pReq.query.dataRetiradaInicial && pReq.query.dataRetiradaFinal)) throw new BaseErro(400, 'pedidoDataRetiradaFaixaObrigatorio')
    else {
      pReq.query.dataRetiradaInicial = !pReq.query.dataRetiradaInicial ? pReq.query.dataRetiradaInicial : pReq.query.dataRetiradaInicial
      pReq.query.dataRetiradaFinal = !pReq.query.dataRetiradaFinal ? pReq.query.dataRetiradaFinal : pReq.query.dataRetiradaFinal
    }

    if ((pReq.query.dataEntregaInicial && !pReq.query.dataEntregaFinal) ||
      (!pReq.query.dataEntregaInicial && pReq.query.dataEntregaFinal)) throw new BaseErro(400, 'pedidoDataEntregaFaixaObrigatorio')

    if ((pReq.query.dataPrevisaoChegadaInicial && !pReq.query.dataPrevisaoChegadaFinal) ||
      (!pReq.query.dataPrevisaoChegadaInicial && pReq.query.dataPrevisaoChegadaFinal)) throw new BaseErro(400, 'pedidoDataPrevisaoChegadaFaixaObrigatorio')

    if (!pReq.query.dataRetiradaInicial && !pReq.query.dataEntregaInicial && !pReq.query.dataPrevisaoChegadaInicial) throw new BaseErro(400, 'pedidoDataFaixaUmaObrigatorio')
  } else {
    if (!pReq.query.codigoFilial) throw new BaseErro(400, 'pedidoCodigoFilialObrigatorio')
    if (!pReq.query.numeroPedido) throw new BaseErro(400, 'pedidoNumeroPedidoObrigatorio')
  }

  if (pReq.query.codigoFilial) pReq.body.codigoFilial = pReq.query.codigoFilial
  if (pReq.query.numeroPedido) pReq.body.numeroPedido = pReq.query.numeroPedido
  if (pReq.query.dataRetiradaInicial) pReq.body.dataRetiradaInicial = pReq.query.dataRetiradaInicial
  if (pReq.query.dataRetiradaFinal) pReq.body.dataRetiradaFinal = pReq.query.dataRetiradaFinal
  if (pReq.query.dataEntregaInicial) pReq.body.dataEntregaInicial = pReq.query.dataEntregaInicial
  if (pReq.query.dataEntregaFinal) pReq.body.dataEntregaFinal = pReq.query.dataEntregaFinal
  if (pReq.query.dataPrevisaoChegadaInicial) pReq.body.dataPrevisaoChegadaInicial = pReq.query.dataPrevisaoChegadaInicial
  if (pReq.query.dataPrevisaoChegadaFinal) pReq.body.dataPrevisaoChegadaFinal = pReq.query.dataPrevisaoChegadaFinal
  if (pReq.query.ordenacao) pReq.body.ordenacao = pReq.query.ordenacao
  if (pReq.query.pagina) pReq.body.pagina = pReq.query.pagina
  if (pReq.query.limite) pReq.body.limite = pReq.query.limite
  if (pReq.query.direcao) pReq.body.direcao = pReq.query.direcao
  if (pReq.query.codigoTipoCarga) pReq.body.codigoTipoCarga = pReq.query.codigoTipoCarga
  if (pReq.query.codigoStatusPedidoTorre) pReq.body.codigoStatusPedidoTorre = pReq.query.codigoStatusPedidoTorre
  if (pReq.query.placaVeiculo) pReq.body.placaVeiculo = pReq.query.placaVeiculo
  if (pReq.query.codigoLinha) pReq.body.codigoLinha = pReq.query.codigoLinha
  if (pReq.query.codigoRemetente) pReq.body.codigoRemetente = pReq.query.codigoRemetente
  if (pReq.query.codigoDestinatario) pReq.body.codigoDestinatario = pReq.query.codigoDestinatario
  if (pReq.query.diferencial) pReq.body.diferencial = pReq.query.diferencial

  pReq.body.ocorrenciasAltas = await ocorrenciaServico.listarPedidoOcorrencia(pReq, 'ALTA');
  pReq.body.ocorrenciasBaixas = await ocorrenciaServico.listarPedidoOcorrencia(pReq, 'BAIXA');

  let vUrl = `${urlHub.pedido}`
  if (pAgrupar === 'N') vUrl = `${vUrl}/agrupados`

  const { resumo, totalRegistros, totalRegistrosPagina, dados } = await baseServico.hubListarEspecial(vUrl, pReq)

  let placas = []

  dados.map(ped => {
    ped.codigoPlacaVeiculo !== undefined && ped.codigoPlacaVeiculo !== null ? placas.push(ped.codigoPlacaVeiculo) : 0
    ped.codigoPlacaVeiculo2 !== undefined && ped.codigoPlacaVeiculo2 !== null ? placas.push(ped.codigoPlacaVeiculo2) : 0
    ped.codigoPlacaVeiculo3 !== undefined && ped.codigoPlacaVeiculo3 !== null ? placas.push(ped.codigoPlacaVeiculo3) : 0
  });

  let rastreadores = await ocorrenciaServico.listarRatreadoresOcorrencias(pReq, 'PEDIDO', placas)

  let result = dados.map(ped => {

    pReq.query.numeroPedido = ped.numeroPedido

    return {
      codigoDestinatario: ped.codigoDestinatario,
      codigoEmpresa: ped.codigoEmpresa,
      codigoFilial: ped.codigoFilial,
      codigoLinha: ped.codigoLinha,
      codigoMotorista1: ped.codigoMotorista1,
      codigoMotorista2: ped.codigoMotorista2,
      codigoPlacaVeiculo: ped.codigoPlacaVeiculo,
      codigoPlacaVeiculo2: ped.codigoPlacaVeiculo2,
      codigoPlacaVeiculo3: ped.codigoPlacaVeiculo3,
      codigoPlacaVeiculo4: ped.codigoPlacaVeiculo4,
      codigoRemetente: ped.codigoRemetente,
      codigoStatusPedidoTorre: ped.codigoStatusPedidoTorre,
      codigoTipoCarga: ped.codigoTipoCarga,
      dataChegada: ped.dataChegada,
      dataChegadaPrevista: ped.dataChegadaPrevista,
      dataRetirada: ped.dataRetirada,
      descricaoStatusPedidoTorre: ped.descricaoStatusPedidoTorre,
      descricaoTipoCarga: ped.descricaoTipoCarga,
      diferencial: ped.diferencial,
      nomeDestinatario: ped.nomeDestinatario,
      nomeEmpresa: ped.nomeEmpresa,
      nomeFilial: ped.nomeFilial,
      nomeRemetente: ped.nomeRemetente,
      numeroLinha: ped.numeroLinha,
      numeroPedido: ped.numeroPedido,
      ocorrenciaCriticidadeAlta: ped.ocorrenciaCriticidadeAlta,
      ocorrenciaCriticidadeBaixa: ped.ocorrenciaCriticidadeBaixa,
      placa: ped.placa,
      qtd: ped.qtd,
      sequenciaOrdenacaoPedido: ped.sequenciaOrdenacaoPedido,
      situacaoRastreador1: rastreadores.find(e => e == ped.codigoPlacaVeiculo) !== undefined ? 1 : 0,
      situacaoRastreador2: rastreadores.find(e => e == ped.codigoPlacaVeiculo2) !== undefined ? 1 : 0,
      situacaoRastreador3: rastreadores.find(e => e == ped.codigoPlacaVeiculo3) !== undefined ? 1 : 0,
    }
  })


  return { resumo, totalRegistros, totalRegistrosPagina, dados: [...result] }
}

async function obter(pReq) {
  if (!pReq.query.codigoFilial) throw new BaseErro(400, 'pedidoCodigoFilialObrigatorio')
  if (!pReq.query.numeroPedido) throw new BaseErro(400, 'pedidoNumeroPedidoObrigatorio')

  return baseServico.hubListar(`${urlHub.pedido}/obter`, pReq.query)
}

async function listarComposicaoCarga(pReq) {
  if (!pReq.query.codigoFilial) throw new BaseErro(400, 'pedidoCodigoFilialObrigatorio')
  if (!pReq.query.numeroPedido) throw new BaseErro(400, 'pedidoNumeroPedidoObrigatorio')

  return baseServico.hubListar(`${urlHub.pedido}/composicaoCarga`, pReq.query)
}

async function listarProgramacaoVeiculo(pReq) {
  if (!pReq.query.numeroProgramacaoVeiculo) throw new BaseErro(400, 'pedidoNumeroProgramacaoVeiculoObrigatorio')
  if (!pReq.query.codigoFilial) throw new BaseErro(400, 'pedidoCodigoFilialObrigatorio')

  return baseServico.hubListar(`${urlHub.pedido}/pontosPassagem`, pReq.query)
}

async function listarPedidosEmViagem(pReq) {
  return baseServico.hubListar(`${urlHub.pedido}/emViagem`, pReq.query)
}

async function listarPedidosNovosAndEmAlocacao(pReq) {
  return baseServico.hubListar(`${urlHub.pedido}/novosAndEmAlocacao`, pReq.query)
}

async function listarPontosPassagem(pReq) {
  if (!pReq.query.numeroPedido) throw new BaseErro(400, 'pedidoNumeroPedidoObrigatorio')
  if (!pReq.query.codigoFilial) throw new BaseErro(400, 'pedidoCodigoFilialObrigatorio')

  return baseServico.hubListar(`${urlHub.pedido}/pontosPassagem`, pReq.query)
}

async function listarDiferencial(pParams) {
  return { dados: { listar: 'diferencial' } }
}

async function alterar(req) {
  const vUrl = `${urlHub.pedido}?numeroPedido=${req.query.numeroPedido}&codigoFilial=${req.query.codigoFilial}`

  req.body.usuarioLogado = req.usuarioLogado ? req.usuarioLogado.login : null
  req.body.dataSaida = req.body.dataSaida ? moment(req.body.dataSaida).format('YYYY-MM-DDT00:00:00.000').toString() : null

  const result = await baseServico.hubAlterar(vUrl, req.body)

  if (result.length <= 0) {
    throw new BaseErro(500, 'erroAlocacaoPedido', ['Erro indefinido'])
  }

  if (result[0].retorno !== 'OK') {
    throw new BaseErro(500, 'erroAlocacaoPedido', [result[0].retorno])
  }

  return result[0]
}

async function registrarFimDaViagem(req) {

  const vUrl = `${urlHub.pedido}/fimDaViagem?numeroPedido=${req.query.numeroPedido}&codigoFilial=${req.query.codigoFilial}`
  req.body.usuarioLogado = req.usuarioLogado ? req.usuarioLogado.login : null

  const result = await baseServico.hubAlterar(vUrl, req.body)

  if (result.length <= 0) {
    throw new BaseErro(500, 'erroFimDaViagemPedido', ['Erro indefinido'])
  }

  if (result[0].retorno !== 'OK') {
    throw new BaseErro(500, 'erroFimDaViagemPedido', [result[0].retorno])
  }

  if (result[0].retorno === 'OK') {
    return ocorrenciaServico.incluirOcorrenciaAutomatica(
      enums.OCORRENCIA.BAIXA_DA_PV_EFETUADA_PELA_TORRE,
      req.query.numeroPedido,
      req.query.codigoFilial,
      null,
      null)
  }

  return result[0]
}

const functions = {
  obter: async (pReq) => obter(pReq),
  listar: async (pAgrupar, pReq) => listar(pAgrupar, pReq),
  alterar: async (pReq) => alterar(pReq),
  registrarFimDaViagem: async (pReq) => registrarFimDaViagem(pReq),
  listarDiferencial: async (pParams) => listarDiferencial(pParams),
  listarComposicaoCarga: async (pReq) => listarComposicaoCarga(pReq),
  listarProgramacaoVeiculo: async (pReq) => listarProgramacaoVeiculo(pReq),
  listarPedidosEmViagem: async (pReq) => listarPedidosEmViagem(pReq),
  listarPedidosNovosAndEmAlocacao: async (pReq) => listarPedidosNovosAndEmAlocacao(pReq),
  listarPontosPassagem: async (pReq) => listarPontosPassagem(pReq)
}

export default functions
