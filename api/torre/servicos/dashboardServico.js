import urlHub, { motorista, pedido } from '../configuracao/hub';
import baseServico from './base/baseServico';
import Ocorrencia from '../modelos/ocorrencia';
import { format } from 'date-fns'
import moment from 'moment'
import disponibilidadeServico from './disponibilidadeServico'
import motoristaServico from './motoristaServico';
import veiculoServico from './veiculoServico';
import pedidoServico from './pedidoServico';
import streamBuffers from 'stream-buffers';
import PDFDocument from 'pdfkit';
import util from '../funcoes/utilitarios'

async function listarOcorrenciaSla(pReq) {

  let vParams = pReq.query
  let estouroTempoSemAcao = []
  let estouroTempoEncerramento = []
  let vFiltro = []

  if (vParams.origem == "PEDIDO") {
    vFiltro = { origem: "PEDIDO" }
  }
  else if (vParams.origem == "VEICULO") {
    vFiltro = { origem: "VEICULO" }
  }
  else if (vParams.origem == "MOTORISTA") {
    vFiltro = { origem: "MOTORISTA" }
  }

  let periodoViagemInicial = new Date(moment().subtract(45, 'days').toString());
  let periodoViagemFinal = new Date(moment().add(45, 'days').toString());

  if (pReq.query.periodoViagemInicial && pReq.query.periodoViagemFinal) {
    periodoViagemInicial = pReq.query.periodoViagemInicial
    periodoViagemFinal = pReq.query.periodoViagemFinal
  }

  let ocorrencias = await Ocorrencia.aggregate([
    {
      $match: {
        $and: [
          { codigoFilial: { $in: pReq.usuarioLogado.filiais.map(String) } },
          { dataOcorrencia: { $gte: new Date(periodoViagemInicial), $lte: new Date(periodoViagemFinal) } },
          { origem: "PEDIDO" }
        ],
        vFiltro
      }
    },
    {
      $lookup:
      {
        from: "torreOcorrencia",
        localField: "_id",
        foreignField: "tipoOcorrenciaId",
        as: "ocorrencias"
      }
    }])

  if (ocorrencias.length > 0) {
    ocorrencias.map((elem) => {
      estouroTempoSemAcao.push((elem.dataEfetivaPrimeiraAcao || Date.now()) > elem.dataLimitePrimeiraAcao ? 1 : 0)
      estouroTempoEncerramento.push(elem.dataFimOcorrencia > elem.dataLimiteEncerramento ? 1 : 0)
    }, 0)
  }

  return {
    estouroTempoSemAcao: estouroTempoSemAcao ? estouroTempoSemAcao.length : 0,
    estouroTempoEncerramento: estouroTempoEncerramento ? estouroTempoEncerramento.length : 0
  }
}

async function listarOcorrenciaOrigem(pReq) {

  let periodoViagemInicial = new Date(moment().subtract(45, 'days').toString());
  let periodoViagemFinal = new Date(moment().add(45, 'days').toString());

  if (pReq.query.periodoViagemInicial && pReq.query.periodoViagemFinal) {
    periodoViagemInicial = pReq.query.periodoViagemInicial
    periodoViagemFinal = pReq.query.periodoViagemFinal
  }

  let vTotaisPrioridade = await Ocorrencia.aggregate([
    {
      $match: {
        $and: [
          { codigoFilial: { $in: pReq.usuarioLogado.filiais.map(String) } },
          { dataOcorrencia: { $gte: new Date(periodoViagemInicial), $lte: new Date(periodoViagemFinal) } },
        ]
      }
    },
    { $unwind: "$origem" },
    { $sortByCount: "$origem" },
    { $sort: { count: -1 } },
  ]);

  const vOrigem = vTotaisPrioridade.map((tot) => {
    return { _id: tot._id, value: tot.count }
  }, 0)

  return {
    ocorrenciasPedido: vOrigem.filter((o) => o._id == "PEDIDO")[0] != undefined ? vOrigem.filter((o) => o._id == "PEDIDO")[0].value : 0,
    ocorrenciasMotorista: vOrigem.filter((o) => o._id == "MOTORISTA")[0] != undefined ? vOrigem.filter((o) => o._id == "MOTORISTA")[0].value : 0,
    ocorrenciaVeiculo: vOrigem.filter((o) => o._id == "VEICULO")[0] != undefined ? vOrigem.filter((o) => o._id == "VEICULO")[0].value : 0
  }
}

async function listarTipoOcorrencias(pReq) {

  let vParams = pReq.query
  let ocorrenciasCriticas = []
  let ocorrenciasDescricao = []
  let vFiltro = {}

  let periodoViagemInicial = new Date(moment().subtract(45, 'days').toString());
  let periodoViagemFinal = new Date(moment().add(45, 'days').toString());

  if (pReq.query.periodoViagemInicial && pReq.query.periodoViagemFinal) {
    periodoViagemInicial = pReq.query.periodoViagemInicial
    periodoViagemFinal = pReq.query.periodoViagemFinal
  }

  if (vParams.origem == "PEDIDO") {
    if (vParams.numeroPedido) {
      vFiltro = { origem: "PEDIDO", "torreOcorrencia.pedido.numero": vParams.pedido }
    } else
      vFiltro = { origem: "PEDIDO" }
  }
  else if (vParams.origem == "VEICULO") {
    vFiltro = { origem: "VEICULO" }
  }
  else if (vParams.origem == "MOTORISTA") {
    vFiltro = { origem: "MOTORISTA" }
  }

  let vTotaisTipoOcorrencias = await Ocorrencia.aggregate([
    {
      $match: {
        $and: [
          { dataOcorrencia: { $gte: new Date(periodoViagemInicial), $lte: new Date(periodoViagemFinal) } },
          // { origem: { $in: ["VEICULO", "MOTORISTA", "PEDIDO"] } },
          { codigoFilial: { $in: pReq.usuarioLogado.filiais.map(String) } },
          vFiltro
        ]
      }
    },
    { $unwind: "$tipoOcorrenciaId" },
    { $sortByCount: "$tipoOcorrenciaId" },
    { $sort: { count: -1 } },
    {
      $lookup:
      {
        from: "torreOcorrencia",
        localField: "_id",
        foreignField: "tipoOcorrenciaId",
        as: "ocorrencias"
      }
    }]);

  let descricao;
  let prioridade

  vTotaisTipoOcorrencias.map((tot) => {
    [{ descricao, prioridade }] = tot.ocorrencias
    ocorrenciasCriticas.push(tot.count)
    ocorrenciasDescricao.push(String(descricao).toUpperCase())
    if (vParams.numeroPedido && prioridade == 'ALTA') {
      ocorrenciasDescricao.push(String(descricao).toUpperCase())
    }
  }, 0)

  if (vParams.numeroPedido)
    return { tipoOcorrencia: [...ocorrenciasDescricao] }

  return {
    tipoOcorrencia: [...ocorrenciasDescricao],
    tipoOcorenciasCriticas: [...ocorrenciasCriticas]
  }
}

async function listarCriticidade(pReq) {

  let vParams = pReq.query
  let ocorrenciasCriticas = []
  let ocorrenciasNaoCriticas = []
  let vFiltro = {}

  if (vParams.origem == "PEDIDO") {
    vFiltro = { origem: "PEDIDO" }
  }
  else if (vParams.origem == "VEICULO") {
    vFiltro = { origem: "VEICULO" }
  }
  else if (vParams.origem == "MOTORISTA") {
    vFiltro = { origem: "MOTORISTA" }
  }

  let periodoViagemInicial = new Date(moment().subtract(45, 'days').toString());
  let periodoViagemFinal = new Date(moment().add(45, 'days').toString());

  if (pReq.query.periodoViagemInicial && pReq.query.periodoViagemFinal) {
    periodoViagemInicial = pReq.query.periodoViagemInicial
    periodoViagemFinal = pReq.query.periodoViagemFinal
  }

  let vTotaisPrioridade = await Ocorrencia.aggregate([
    {
      $match: {
        $and: [
          { codigoFilial: { $in: pReq.usuarioLogado.filiais.map(String) } },
          { dataOcorrencia: { $gte: new Date(periodoViagemInicial), $lte: new Date(periodoViagemFinal) } },
          vFiltro
        ]
      }
    },
    { $unwind: "$prioridade" },
    { $sortByCount: "$prioridade" },
    { $sort: { count: -1 } },
  ]);

  if (vTotaisPrioridade.length > 0) {
    vTotaisPrioridade.map((tot) => {
      tot._id === 'ALTA' ? ocorrenciasCriticas.push(tot.count) : tot._id === 'BAIXA' ? ocorrenciasNaoCriticas.push(tot.count) : 0
    }, 0)
  }
  else {
    ocorrenciasCriticas.push(0)
    ocorrenciasNaoCriticas.push(0)
  }

  return {
    criticas: ocorrenciasCriticas[0],
    naoCriticas: ocorrenciasNaoCriticas[0]
  }
}

async function listarStatus(pReq) {

  let vParams = pReq.query
  let ocorrenciasAbertas = []
  let ocorrenciasFechadas = []
  let vFiltro = {}

  if (vParams.origem == "PEDIDO") {
    vFiltro = { origem: "PEDIDO" }
  }
  else if (vParams.origem == "VEICULO") {
    vFiltro = { origem: "VEICULO" }
  }
  else if (vParams.origem == "MOTORISTA") {
    vFiltro = { origem: "MOTORISTA" }
  }

  let periodoViagemInicial = new Date(moment().subtract(45, 'days').toString());
  let periodoViagemFinal = new Date(moment().add(45, 'days').toString());

  if (pReq.query.periodoViagemInicial && pReq.query.periodoViagemFinal) {
    periodoViagemInicial = pReq.query.periodoViagemInicial
    periodoViagemFinal = pReq.query.periodoViagemFinal
  }

  let vTotaisStatus = await Ocorrencia.aggregate([
    {
      $match: {
        $and: [
          { codigoFilial: { $in: pReq.usuarioLogado.filiais.map(String) } },
          { dataOcorrencia: { $gte: new Date(periodoViagemInicial), $lte: new Date(periodoViagemFinal) } },
          vFiltro
        ]
      },
    },
    { $unwind: "$status" },
    { $sortByCount: "$status" },
    { $sort: { count: -1 } },

  ]);

  if (vTotaisStatus.length > 0) {
    vTotaisStatus.map((tot) => {
      tot._id === 'ABERTA' ? ocorrenciasAbertas.push(tot.count) : tot._id === 'FECHADA' ? ocorrenciasFechadas.push(tot.count) : 0
    }, 0)
  }
  else {
    ocorrenciasAbertas.push(0)
    ocorrenciasFechadas.push(0)
  }

  return {
    abertas: ocorrenciasAbertas[0],
    fechadas: ocorrenciasFechadas[0]
  }
}

async function listarOcorrenciasHistorico(pReq) {

  let vParams = pReq.query
  let vFiltro = {}
  let diasSemana = []
  let ocorrenciasCriticas = []
  let ocorrenciasNaoCriticas = []
  let aux, vTotaisPrioridade

  if (vParams.origem == "PEDIDO") {
    vFiltro = { origem: "PEDIDO" }
  }
  else if (vParams.origem == "VEICULO") {
    vFiltro = { origem: "VEICULO" }
  }
  else if (vParams.origem == "MOTORISTA") {
    vFiltro = { origem: "MOTORISTA" }
  }

  function subtrairDia(aux, hour) {
    let data = new Date(moment().subtract(aux, 'days'))
    if (hour) return new Date(data.setHours(0, 0, 0, 0))
    return new Date(data.setHours(23, 59, 59, 59))
  }

  for (aux = 0; aux < 7; aux++) {

    vTotaisPrioridade = await Ocorrencia.aggregate([
      {
        $match: {
          $and: [
            { codigoFilial: { $in: pReq.usuarioLogado.filiais.map(String) } },
            { dataOcorrencia: { $gte: subtrairDia(aux, 1), $lte: subtrairDia(aux) } },
            vFiltro
          ]
        },
      },
      { $unwind: "$prioridade" },
      { $sortByCount: "$prioridade" },
      { $sort: { count: -1 } },
    ]);

    diasSemana.push(format(subtrairDia(aux), 'dd/MMM'))

    if (vTotaisPrioridade.length > 0) {
      vTotaisPrioridade.map((tot) => {
        tot._id === 'ALTA' ? ocorrenciasCriticas.push(tot.count) : tot._id === 'BAIXA' ? ocorrenciasNaoCriticas.push(tot.count) : 0
      }, 0)
    }
    else {
      ocorrenciasCriticas.push(0)
      ocorrenciasNaoCriticas.push(0)
    }
  }

  diasSemana.reverse()
  ocorrenciasCriticas.reverse()
  ocorrenciasNaoCriticas.reverse()

  const vRetorno = {
    diasSemana: [...new Set(diasSemana)],
    ocorenciasCriticas: [...ocorrenciasCriticas],
    ocorrenciasNaoCriticas: [...ocorrenciasNaoCriticas]
  };

  return vRetorno
}

async function listarOcorrencias(pReq) {

  return Promise.all([
    listarStatus(pReq),
    listarTipoOcorrencias(pReq),
    listarCriticidade(pReq)
  ]).then(r => r[0].concat(r[1]).concat(r[2]));

}

async function listarMotoristasClassificacoes(pReq) {

  pReq.query.totais = "CLASSIFICACOES"
  const { dados } = await motoristaServico.obterTotais(pReq)

  return {
    motoristasAgregados: dados.motoristasAgregados,
    motoristasTerceiros: dados.mototistasTerceiros,
    motoristasFrotas: dados.motoristasFrotas
  }
}

async function listarMotoristasStatus(pReq) {

  const { dados } = await motoristaServico.obterTotais(pReq)

  return {
    motoristasInaptos: dados.motoristasInaptos,
    motoristasAguardandoLiberacao: dados.mototistasAguardandoLiberacao,
    motoristasAptosRestricao: dados.motoristasAptosRestricao,
    motoristasAptos: dados.motoristasAptos
  }
}

async function listarMotoristasDisponiveis(pReq) {

  let periodoViagemInicial = util.obterDataCorrente().local().hours(0).minutes(0).seconds(0).format('YYYY-MM-DDTHH:mm:ss')
  let periodoViagemFinal = util.obterDataCorrente().local().add(15, 'days').hours(23).minutes(59).seconds(59).format('YYYY-MM-DDTHH:mm:ss')

  pReq.query.periodoViagemInicial = periodoViagemInicial
  pReq.query.periodoViagemFinal = periodoViagemFinal
  pReq.query.situacao = 'D'

  const motoristas = await disponibilidadeServico.listarMotoristaQuantidade(pReq)

  const totalMotoristas = motoristas.dados.quantidadeMotoristasDisponiveis

  return {
    motoristasDisponiveis: totalMotoristas
  }
}

async function listarMotoristasDisponiveisAlocados(pReq) {
  const aux = []

  pReq = parametrosDisponibilidade(pReq, 'M')
  const motoristasDisponiveis = await disponibilidadeServico.listarMotorista(pReq)
  const totalMotoristas = motoristasDisponiveis.dados.quantidadeMotoristasDisponiveis

  let { dados } = await listarResumo(pReq)

  console.log(dados)

  dados = dados.reduce((prev, curr) => {
    if (curr.codigoStatusPedidoTorre === 4 || curr.codigoStatusPedidoTorre === 2) {
      aux.push(curr.codigoMotorista1)
      curr.codigoMotorista2 ? aux.push(curr.codigoMotorista2) : ''
    }
    return prev
  }, { motorista: [] })

  const array = new Set(aux)
  const motorista = [...array]

  return {
    motoristasDisponiveis: totalMotoristas,
    motoristasAlocados: motorista.length
  }
}

async function listarVeiculosClassificacoes(pReq) {

  const { dados } = await veiculoServico.obterTotais(pReq)

  return {
    CavaloToco4X2: dados.CavaloToco4X2,
    CavaloTruncado6X2: dados.CavaloTruncado6X2,
    CavaloTruncado6X4: dados.CavaloTruncado6X4,
    BiTremCargaSeca: dados.BiTremCargaSeca,
    BiTremGraneleiro: dados.BiTremGraneleiro,
    BitrenzaoCargaSeca: dados.BitrenzaoCargaSeca,
    RodoTremCargaSeca: dados.RodoTremCargaSeca,
    RodoTremSider: dados.RodoTremSider,
    BitrenzaoSider: dados.BitrenzaoSider,
    Outros: dados.Outros
  }
}

async function listarVeiculosStatus(pReq) {

  const { dados } = await veiculoServico.obterTotais(pReq)

  return {
    Terceiro: dados.Terceiro,
    Agregado: dados.Agregado,
    Aluguel: dados.Aluguel,
    Cliente: dados.Cliente,
    Outros: dados.Outros
  }
}

async function listarVeiculosDisponiveis(pReq) {

  let periodoViagemInicial = util.obterDataCorrente().local().hours(0).minutes(0).seconds(0).format('YYYY-MM-DDTHH:mm:ss')
  let periodoViagemFinal = util.obterDataCorrente().local().add(15, 'days').hours(23).minutes(59).seconds(59).format('YYYY-MM-DDTHH:mm:ss')

  pReq.query.periodoViagemInicial = periodoViagemInicial
  pReq.query.periodoViagemFinal = periodoViagemFinal

  const veiculos = await disponibilidadeServico.listarVeiculoQuantidade(pReq)
  const totalVeiculos = veiculos.dados.quantidadeVeiculosDisponiveis

  return {
    veiculosDisponiveis: totalVeiculos
  }
}

async function listarVeiculosDisponiveisAlocados(pReq) {
  const aux = []

  let periodoViagemInicial = new Date(new Date(new Date().setHours(0, 0, 0, 0)))
  let periodoViagemFinal = new Date(moment().add(15, 'days').toString())

  pReq.query.periodoViagemInicial = periodoViagemInicial
  pReq.query.periodoViagemFinal = periodoViagemFinal

  const veiculos = await disponibilidadeServico.listarVeiculoQuantidade(pReq)
  const totalVeiculos = veiculos.dados.quantidadeVeiculosDisponiveis

  pReq.query.dataRetiradaInicial = pReq.query.periodoViagemInicial
  pReq.query.dataRetiradaFinal = pReq.query.periodoViagemFinal

  let { dados } = await listarResumo(pReq)

  dados = dados.reduce((prev, curr) => {
    if (curr.codigoStatusPedidoTorre === 4 || curr.codigoStatusPedidoTorre === 2) {
      aux.push(curr.codigoPlacaVeiculo)
      curr.codigoPlacaVeiculo2 ? aux.push(curr.codigoPlacaVeiculo2) :
        curr.codigoPlacaVeiculo3 ? aux.push(curr.codigoPlacaVeiculo3) :
          curr.codigoPlacaVeiculo4 ? aux.push(curr.codigoPlacaVeiculo4) : ''
    }
    return prev
  }, { veiculo: [] })

  const array = new Set(aux)
  const veiculo = [...array]

  return {
    veiculosDisponiveis: totalVeiculos,
    veiculosAlocados: veiculo.length
  }
}

async function listarVeiculos(pReq) {
  const aux = []
  const vUrl = `${urlHub.disponibilidade}/veiculo`

  pReq = parametrosDisponibilidade(pReq)
  const veiculos = await baseServico.hubListar(vUrl, pReq.query)
  const totalVeiculos = veiculos.totalRegistros

  let { dados } = await listarResumo(pReq)

  dados = dados.reduce((prev, curr) => {
    if (curr.codigoStatusPedidoTorre === 4) {
      aux.push(curr.codigoPlacaVeiculo)
      curr.codigoPlacaVeiculo2 ? aux.push(curr.codigoPlacaVeiculo2) : ''
      curr.codigoPlacaVeiculo3 ? aux.push(curr.codigoPlacaVeiculo3) : ''
      curr.codigoPlacaVeiculo4 ? aux.push(curr.codigoPlacaVeiculo4) : ''
    }
    return prev
  }, { codigoPlacaVeiculo: [] })

  const array = new Set(aux)
  const codigoPlacaVeiculo = [...array]

  return {
    dataRetiradaInicial: pReq.query.dataRetiradaInicial,
    dataRetiradaFinal: pReq.query.dataRetiradaFinal,
    totalVeiculos: totalVeiculos,
    totalEmViagem: codigoPlacaVeiculo.length,
    totalSemAlocacao: totalVeiculos == 0 ? 0 : (totalVeiculos - codigoPlacaVeiculo.length)
  }
}

async function listarPedidos(pReq) {
  const { resumo } = await listarResumo(pReq)

  let ocorrencias = await Ocorrencia.find(
    {
      dataOcorrencia: { $gte: pReq.query.dataRetiradaInicial, $lte: pReq.query.dataRetiradaFinal },
      codigoFilial: { $in: pReq.usuarioLogado.filiais.map(String) }
    }).populate('tipoOcorrenciaId')

  let pedidosEmAlocacaoAtrasada = []
  ocorrencias.map((elem) => {
    if (elem.tipoOcorrenciaId.codigo === 5)
      pedidosEmAlocacaoAtrasada.push(1)
  }, 0)

  return {
    pedidosNovos: resumo.statusNovo,
    pedidosEmAlocacao: resumo.statusComAlocacao,
    pedidosEmAlocacaoAtrasada: pedidosEmAlocacaoAtrasada ? pedidosEmAlocacaoAtrasada.length : 0,
    pedidosEmViagem: resumo.statusEmViagem,
  };
}

async function listarPedidosEmViagem(pReq) {
  let aux = []
  pReq.query.codigoStatusPedidoTorre = 4;
  pReq.query.limite = 10
  pReq.query.pagina = 1
  pReq.query.ordenacao = "dataRetirada"
  pReq.query.direcao = "DESC"

  let { dados, resumo, totalRegistros } = await listarResumo(pReq)

  dados.map(async (curr) => {
    aux.push({
      pedido: curr.numeroPedido,
      codigoFilial: curr.codigoFilial,
      filial: curr.nomeFilial,
      origem: curr.nomeRemetente,
      cliente: curr.nomeDestinatario,
    })
  }, 0)

  return { pedidoViagem: [...aux] }
}

async function listarPedidosOcorrencias(pReq) {

  let ocorrencias = await Ocorrencia.find({ origem: "PEDIDO", prioridade: "ALTA" }, {}).limit(10).sort({ "dataocorrencia": -1 })

  const dados = await ocorrencias.map((elem) => {
    return {
      _id: elem._id,
      pedido: elem.pedido.numero,
      codigoFilial: elem.pedido.codigoFilial,
      filial: elem.pedido.nomeFilial,
      origem: elem.pedido.origem,
      cliente: elem.pedido.cliente,
      descricao: elem.descricao
    }
  }, 0)

  return { pedidoOcorrencias: [...dados] }
}

async function listarPerformance(pReq) {
  const { resumo, totalRegistros } = await listarResumo(pReq)

  let doc = new PDFDocument({ layout: "landscape", size: "a4", margins: { bottom: 20 } });

  var writableStreamBuffer = new streamBuffers.WritableStreamBuffer({
    initialSize: (100 * 1024),   // start at 100 kilobytes.
    incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.
  });

  doc.pipe(writableStreamBuffer);

  doc.fontSize(25)
    .text(`Teste arquivo PDF - ${format(new Date(), 'yyyy-MM-dd')}`, 100, 100);

  return doc
}

async function listarResumo(pReq) {
  pReq.query.ocorrencia = ['\'AAAA111\'']

  const data1 = moment().startOf('month')
  const data2 = moment()

  const dataInicial = data1.format('YYYY-MM-DDT00:00:00')
  const dataFinal = data2.format('YYYY-MM-DDTHH:mm:ss')

  if ((pReq.query.dataRetiradaInicial && !pReq.query.dataRetiradaFinal) ||
    (!pReq.query.dataRetiradaInicial && pReq.query.dataRetiradaFinal)) {
    pReq.query.dataRetiradaInicial = dataInicial
    pReq.query.dataRetiradaFinal = dataFinal
  } else {
    pReq.query.dataRetiradaInicial = !pReq.query.dataRetiradaInicial ? dataInicial : new Date(pReq.query.dataRetiradaInicial)
    pReq.query.dataRetiradaFinal = !pReq.query.dataRetiradaFinal ? dataFinal : new Date(pReq.query.dataRetiradaFinal)
  }

  let res = await pedidoServico.listar('S', pReq)

  return res
}

function parametrosDisponibilidade(pReq, pTipo) {
  const day = new Date()
  const dataFinal = new Date()
  //const dataInicial = day.setDate(day.getDate() - (day.getDate() - 1)) //1 mes

  let periodoViagemInicial = new Date(new Date().setHours(0, 0, 0, 0))
  let periodoViagemFinal = new Date(moment().add(1, 'days').toString())

  if ((pReq.query.periodoViagemInicial && !pReq.query.periodoViagemFinal) ||
    (!pReq.query.periodoViagemInicial && pReq.query.periodoViagemFinal)) {
    pReq.query.periodoViagemInicial = periodoViagemInicial
    pReq.query.periodoViagemFinal = periodoViagemFinal
  } else {
    pReq.query.periodoViagemInicial = !pReq.query.periodoViagemInicial ? periodoViagemInicial : new Date(pReq.query.periodoViagemInicial)
    pReq.query.periodoViagemFinal = !pReq.query.periodoViagemFinal ? periodoViagemFinal : new Date(pReq.query.periodoViagemFinal)
  }

  pReq.query.dataRetiradaInicial = pReq.query.periodoViagemInicial
  pReq.query.dataRetiradaFinal = pReq.query.periodoViagemFinal

  if (pTipo === 'M') {
    pReq.query.situacao = 'D'
  }

  return pReq
}

const functions = {

  listarOcorrencias: (pReq) => { return listarOcorrencias(pReq) },
  listarOcorrenciasHistorico: (pReq) => { return listarOcorrenciasHistorico(pReq) },
  listarOcorrenciaSla: (pReq) => { return listarOcorrenciaSla(pReq) },
  listarOcorrenciaOrigem: (pReq) => { return listarOcorrenciaOrigem(pReq) },

  listarMotoristas: (pReq) => { return listarMotoristas(pReq) },
  listarMotoristasClassificacoes: (pReq) => { return listarMotoristasClassificacoes(pReq) },
  listarMotoristasStatus: (pReq) => { return listarMotoristasStatus(pReq) },
  listarMotoristasDisponiveis: (pReq) => { return listarMotoristasDisponiveis(pReq) },
  listarMotoristasDisponiveisAlocados: (pReq) => { return listarMotoristasDisponiveisAlocados(pReq) },

  listarVeiculos: (pReq) => { return listarVeiculos(pReq) },
  listarVeiculosDisponiveis: (pReq) => { return listarVeiculosDisponiveis(pReq) },
  listarVeiculosDisponiveisAlocados: (pReq) => { return listarVeiculosDisponiveisAlocados(pReq) },
  listarVeiculosClassificacoes: (pReq) => { return listarVeiculosClassificacoes(pReq) },
  listarVeiculosStatus: (pReq) => { return listarVeiculosStatus(pReq) },

  listarPedidos: (pReq) => { return listarPedidos(pReq) },
  listarPedidosEmViagem: (pReq) => { return listarPedidosEmViagem(pReq) },
  listarPedidosOcorrencias: (pReq) => { return listarPedidosOcorrencias(pReq) },

  listarStatus: (pReq) => { return listarStatus(pReq) },
  listarCriticidade: (pReq) => { return listarCriticidade(pReq) },
  listarTipoOcorrencias: (pReq) => { return listarTipoOcorrencias(pReq) },
  listarPerformance: (pReq) => { return listarPerformance(pReq) },
}

export default functions
