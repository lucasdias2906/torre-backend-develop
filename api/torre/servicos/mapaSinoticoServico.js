import moment from 'moment'
import urlHub from '../configuracao/hub'
import MapaSinoticoRepositorio from '../repositorios/mapaSinoticoRepositorio'
import PedidoMonitoramentoRepositorio from '../repositorios/pedidoMonitoramentoRepositorio'
import PedidoMonitoramentoCheckpointRepositorio from '../repositorios/pedidoMonitoramentoCheckpointRepositorio'
import LogApiGoogleRepositorio from '../repositorios/logApiGoogleRepositorio'
import BaseServico from './base/baseServico'
import rastreadorServico from './rastreadorServico'
import { placa } from './pedidoServico'
import poligonoServico from './poligonoServico'
import parceiroTempoMovimentoServico from './parceiroTempoMovimentoServico'
import parametroGeralServico from './parametroGeralServico'
import mapaServico from './mapaServico'
import util from '../funcoes/utilitarios'
import enums from '../modelos/_enums'
import pLimit from 'p-limit'

const geolib = require('geolib')
const groupArray = require('group-array')

const mapaSinoticoRepositorio = new MapaSinoticoRepositorio()
const pedidoMonitoramentoRepositorio = new PedidoMonitoramentoRepositorio()
const pedidoMonitoramentoCheckpointRepositorio = new PedidoMonitoramentoCheckpointRepositorio()
const logApiGoogleRepositorio = new LogApiGoogleRepositorio()


// Obtém os tempos de carretamento e descarga do tomador
async function obterTempoCarregamentoDescarga(pItem) {
  const vTemposTomador = await parceiroTempoMovimentoServico.listar(pItem.codigoTomador, { query: {} })
  let vTempoCarregamento = null
  let vTempoDescarga = null

  if (vTemposTomador) {
    if (vTemposTomador.dados) {
      const temposRemetente = vTemposTomador.dados.filter((tempo) => tempo.hubFornecedorId === pItem.codigoLocalColeta)
      if (temposRemetente.length > 0) {
        vTempoCarregamento = temposRemetente[0].tempoCarregamento
      }
      const temposDestinatario = vTemposTomador.dados.filter((tempo) => tempo.hubFornecedorId === pItem.codigoLocalEntrega)
      if (temposDestinatario.length > 0) {
        vTempoDescarga = temposDestinatario[0].tempoDescarga
      }
    }
  }

  return {
    tempoCarregamento: vTempoCarregamento,
    tempoDescarga: vTempoDescarga,
  }
}

async function gerarEtapaColetaRemetente(pItem, pTempoCarregamento) {
  let vRetornoOk = 1
  let vLatitudeFinal = 0
  let vLongitudeFinal = 0
  let vRaio = 0
  const poligonoColetaRemetente = await poligonoServico.obterPoligonoColeta(pItem.codigoLocalColeta)
  const coordenadasPoligono = []
  if (poligonoColetaRemetente && poligonoColetaRemetente.dados) { // se for um polígono considera o primeiro ponto para traçar a rota
    poligonoColetaRemetente.dados.pontos.map((ponto, index) => {
      if (index === 0) { // se for um polígono considera como posição da etapa
        vLatitudeFinal = ponto.latitude
        vLongitudeFinal = ponto.longitude
      }
      coordenadasPoligono.push([ponto.latitude, ponto.longitude])
    })
    // une o último ponto ao primeiro
    coordenadasPoligono.push([poligonoColetaRemetente.dados.pontos[0].latitude, poligonoColetaRemetente.dados.pontos[0].longitude])
  } else { // senão considera o que vier da procedure, neste caso, vai ter somente um ponto, será uma circunferência
    coordenadasPoligono.push([pItem.latitudeLocalColeta, pItem.longitudeLocalColeta])
    vLatitudeFinal = pItem.latitudeLocalColeta || 0
    vLongitudeFinal = pItem.longitudeLocalColeta || 0
    vRaio = pItem.raioMetrosLocalColeta || 999
  }

  const horasParaAdicionarEmDataEntrada = parseInt(pTempoCarregamento.split(':')[0], 0)
  const minutosParaAdicionarEmDataEntrada = parseInt(pTempoCarregamento.split(':')[1], 0)

  let vDataHoraPlanejadaSaida = null
  if (pItem.dataColeta) {
    vDataHoraPlanejadaSaida = moment(pItem.dataColeta).add(horasParaAdicionarEmDataEntrada, 'hours').add(minutosParaAdicionarEmDataEntrada, 'minutes')
  } else vRetornoOk = 0 // mapa inconsistente

  if (vLatitudeFinal === 0 || vLongitudeFinal === 0) vRetornoOk = 0

  const vEtapaMapaSinoticoColeta = {
    descricao: `Realizar coleta em  ${pItem.codigoLocalColeta} - ${pItem.nomeLocalColeta}${vRetornoOk === 0 ? '(Latitude ou Longitude não informado!)' : ''}`,
    ordem: 1,
    concluido: false,
    checkpoint: null,
    status: vRetornoOk === 0 ? 'I' : 'P', //
    posicao: { latitude: vLatitudeFinal, longitude: vLongitudeFinal },
    poligono: {
      tipo: 'COLETA',
      idParceiroComercial: pItem.codigoLocalColeta,
      tempoPrevistoDentroDoPoligono: pTempoCarregamento,
      dataHoraPlanejadaEntrada: pItem.dataColeta,
      dataHoraPlanejadaSaida: vDataHoraPlanejadaSaida,
      dataHoraPrevistaEntrada: pItem.dataColeta,
      dataHoraPrevistaSaida: vDataHoraPlanejadaSaida,
      raio: vRaio,
      pontos: {
        type: 'Polygon',
        coordinates: [coordenadasPoligono],
      },
    },
  }
  console.log("AAAAAAAAAAAAAA", vEtapaMapaSinoticoColeta.poligono.pontos.coordinates)
  return vEtapaMapaSinoticoColeta
}

async function gerarEtapaEntregaDestinatario(pItem, pTempoDescarga) {
  let vRetornoOk = 1
  let vLatitudeFinal = 0
  let vLongitudeFinal = 0
  let vRaio = 0
  const poligonoColetaDestinatario = await poligonoServico.obterPoligonoEntrega(pItem.codigoLocalEntrega)
  const coordenadasPoligono = []

  if (poligonoColetaDestinatario && poligonoColetaDestinatario.dados) { // se possui poligono cadastrado na torre
    poligonoColetaDestinatario.dados.pontos.map((ponto, index) => {
      if (index === 0) { // se for um polígono considera o primeiro ponto para traçar a rota
        vLatitudeFinal = ponto.latitude
        vLongitudeFinal = ponto.longitude
      }
      coordenadasPoligono.push([ponto.latitude, ponto.longitude])
    })

    // une o último ponto ao primeiro
    coordenadasPoligono.push([poligonoColetaDestinatario.dados.pontos[0].latitude, poligonoColetaDestinatario.dados.pontos[0].longitude])

  } else { // senão considera o que vier da procedure, neste caso, vai ter somente um ponto, será uma circunferência
    coordenadasPoligono.push([pItem.latitudeLocalEntrega, pItem.longitudeLocalEntrega])
    vLatitudeFinal = pItem.latitudeLocalEntrega || 0
    vLongitudeFinal = pItem.longitudeLocalEntrega || 0
    vRaio = pItem.raioMetrosLocalEntrega || 999
  }

  const horasParaAdicionarEmDataEntrada = parseInt(pTempoDescarga.split(':')[0], 0)
  const minutosParaAdicionarEmDataEntrada = parseInt(pTempoDescarga.split(':')[1], 0)
  const vDataHoraPlanejadaSaida = moment(pItem.dataEntrega).add(horasParaAdicionarEmDataEntrada, 'hours').add(minutosParaAdicionarEmDataEntrada, 'minutes')

  if (vLatitudeFinal === 0 || vLongitudeFinal === 0) vRetornoOk = 0

  const vEtapaMapaSinoticoColeta = {
    descricao: `Realizar entrega em  ${pItem.codigoLocalEntrega} - ${pItem.nomeLocalEntrega}${vRetornoOk === 0 ? '(Latitude ou Longitude não informado!)' : ''}`,
    ordem: 1,
    concluido: false,
    checkpoint: null,
    status: vRetornoOk === 0 ? 'I' : 'P', //
    posicao: { latitude: vLatitudeFinal, longitude: vLongitudeFinal },
    poligono: {
      tipo: 'ENTREGA',
      idParceiroComercial: pItem.codigoLocalEntrega,
      tempoPrevistoDentroDoPoligono: pTempoDescarga,
      dataHoraPlanejadaEntrada: pItem.dataEntrega,
      dataHoraPlanejadaSaida: vDataHoraPlanejadaSaida,
      dataHoraPrevistaEntrada: pItem.dataEntrega,
      dataHoraPrevistaSaida: vDataHoraPlanejadaSaida,
      raio: vRaio,
      pontos: {
        type: 'Polygon',
        coordinates: [coordenadasPoligono],
      },
    },
  }

  console.log("EEEEEEEEEEEEEEEEEE", vEtapaMapaSinoticoColeta.poligono.pontos.coordinates)
  return vEtapaMapaSinoticoColeta
}

function gerarEtapaCheckpoint(pCheckpoint) {
  let vRetornoOk = 1
  if (pCheckpoint.latitude === null) vRetornoOk = 0
  if (pCheckpoint.longitude === null) vRetornoOk = 0
  const coordenadasPoligono = [pCheckpoint.latitude, pCheckpoint.longitude]
  const vEtapaMapaSinoticoColeta = {
    descricao: `Checkpoint : ${pCheckpoint.descricao}`,
    ordem: 1,
    concluido: false,
    status: vRetornoOk === 0 ? 'I' : 'P', //
    checkpoint: {
      dataHoraPlanejadaPassagem: null,
      dataHoraPrevistaPassagem: null,
      dataHoraPassagem: null,
      dataHoraPrevistaSaida: null,
      localizacao: { latitude: pCheckpoint.latitude, longitude: pCheckpoint.longitude },
    },
    posicao: { latitude: pCheckpoint.latitude, longitude: pCheckpoint.longitude },
    poligono: {
      tipo: 'CHECKPOINT',
      idParceiroComercial: 0,
      tempoPrevistoDentroDoPoligono: 0,
      dataHoraPlanejadaEntrada: null,
      dataHoraPlanejadaSaida: null,
      dataHoraPrevistaEntrada: null,
      dataHoraPrevistaSaida: null,
      pontos: {
        type: 'Polygon',
        coordinates: [coordenadasPoligono],
      },
    },
  }

  console.log("bbbbbbbbbbbbbbbbbb", vEtapaMapaSinoticoColeta.poligono.pontos.coordinates)
  return vEtapaMapaSinoticoColeta
}

function obterParametro(pParametros, pParametroNome) {
  const vRetorno = pParametros.filter((item) => item.codigo === pParametroNome)
  if (vRetorno.length > 0) return vRetorno[0].valor
  return null
}

async function gerarMapa(pPedidoTrechos, pTempoCarregamento, pTempoDescarga) {
  const pItem = pPedidoTrechos[0]
  let vPosicaoLatitudeAtual = 0
  let vPosicaoLongitudeAtual = 0

  let pPontosColeta = util.excluirDuplicadosArray(pPedidoTrechos, ['codigoLocalColeta'])
  const vEtapasMapa = []
  let vEtapa
  let vTempoDescarga
  let vTempoCarregamento
  let vTempos
  let limit = pLimit(5)

  for (const c in pPontosColeta) {
    await Promise.all([
      await limit(async () => {
        vTempos = await obterTempoCarregamentoDescarga(pPontosColeta[c])
        vTempoCarregamento = vTempos.tempoCarregamento || pTempoCarregamento
        vTempoDescarga = vTempos.tempoDescarga || pTempoDescarga

        vEtapa = await gerarEtapaColetaRemetente(pPontosColeta[c], vTempoCarregamento)
        vEtapa.ordem = vEtapasMapa.length + 1
        vEtapasMapa.push(vEtapa)
      })
    ])
  }

  vPosicaoLatitudeAtual = vEtapasMapa[0].posicao.latitude
  vPosicaoLongitudeAtual = vEtapasMapa[0].posicao.longitude

  // const vQueryCheckpoints = { query: { codigoLinha: pItem.codigoLinhaTrecho } }
  // const vCheckpoints = (await listarCheckpoints(vQueryCheckpoints)).dados
  const vCheckpoints = (await listarCheckpointsMonitoramento(pItem.codigoLinhaTrecho)).dados
  for (let j = 0; j < vCheckpoints.length; j += 1) {
    const vEtapaCheckpoint = gerarEtapaCheckpoint(vCheckpoints[j])
    vEtapaCheckpoint.ordem = vEtapasMapa.length + 1

    console.log("Estou batendo aqui")
    vEtapasMapa.push(vEtapaCheckpoint)
  }

  let pPontosEntrega = util.excluirDuplicadosArray(pPedidoTrechos, ['codigoLocalEntrega'])

  for (const i in pPontosEntrega) {
    const item = pPontosEntrega[i]
    if (item.status === 'I') vMapaInconsistente = true
    vEtapa = await gerarEtapaEntregaDestinatario(item, vTempoDescarga)
    vEtapa.ordem = vEtapasMapa.length + 1
    vEtapasMapa.push(vEtapa)
  }

  const vMapaInconsistente = vEtapasMapa.filter((item) => item.status === 'I').length > 0 // verifica se algumas das etapas está inconsistente

  const vMapa = {
    numeroPedido: pItem.codigoPedido,
    codigoFilial: pItem.codigoFilialPedido,
    posicaoAtual: { latitude: vPosicaoLatitudeAtual, longitude: vPosicaoLongitudeAtual },
    status: vMapaInconsistente ? 'I' : 'P',
    etapas: vEtapasMapa,
  }

  return vMapa
}

async function processarMapaSinotico(pReq) {

  // Expurgo de Log da API do Google
  await expurgarLogsApiGoogle()

  // Expurgo de Log do Rastreador
  await expurgarLogsRastreador()

  // Obtém os parametros gerais
  const vListaParametrosGeral = (await parametroGeralServico.listar()).dados

  const vParametroGeralTempoPadraoCarregamento = obterParametro(vListaParametrosGeral, enums.PARAMETROS.TEMPO_PADRAO_CARREGAMENTO)
  if (!vParametroGeralTempoPadraoCarregamento) return 'PARAMETRO_INSUFICIENTE_TEMPO_PADRAO_CARREGAMENTO'

  const vParametroGeralTempoPadraoDescarga = obterParametro(vListaParametrosGeral, enums.PARAMETROS.TEMPO_PADRAO_DESCARGA)
  if (!vParametroGeralTempoPadraoDescarga) return 'PARAMETRO_INSUFICIENTE_TEMPO_PADRAO_DESCARGA'

  // Obtém as viagens em andamento
  // const vViagensTemp = (await listarViagens(pReq)).dados
  const vViagensTemp = (await pedidoMonitoramentoRepositorio.listarDisponiveisMonitoramentoEmViagem()).dados //.filter(item => item.numeroPedido === '130528')

  //const vViagensSemDuplicidade = util.excluirDuplicadosArray(vViagensTemp, ['codigoPedido', 'codigoFilialPedido'])

  const vViagensAgrupadoPorPedido = groupArray(vViagensTemp, ['codigoAgrupadorTorre', 'codigoFilialPedido'])

  let vQtdIncluidos = 0
  let vQtdExistentes = 0
  let vQtdErros = 0
  let cont = 0
  let vObservacao = 'Processado!'
  let vPedidos

  let limit = pLimit(5)

  for (const item in vViagensAgrupadoPorPedido) {
    try {

      await Promise.all([
        await limit(async () => {

          const vListaPedidos = vViagensAgrupadoPorPedido[item]
          vPedidos = vListaPedidos[Object.keys(vListaPedidos)]
          cont += 1
          vPedidos = vListaPedidos[Object.keys(vListaPedidos)]

          console.log(`MAPA SINOTICO - Pedido: ${vPedidos[0].codigoPedido} / ${vPedidos[0].codigoFilialPedido}`)
          const vPedido = (await mapaSinoticoRepositorio.obterPorPedido(vPedidos[0].codigoPedido, vPedidos[0].codigoFilialPedido)).dados
          let vExiste = vPedido != null
          const vJaEmViagem = vPedido ? vPedido.status === "V" : false

          // se ainda não foi processado, exclui
          if (vExiste && !vJaEmViagem) {
            console.log(`    mapa excluído`)
            await mapaSinoticoRepositorio.excluirMapa(vPedidos[0].codigoPedido, vPedidos[0].codigoFilialPedido)
            vExiste = false
          }

          if (!vExiste) {
            let vListaPedidoTrechos = []
            for (let i = 0; i < vPedidos.length; i += 1) {
              vListaPedidoTrechos.push(vPedidos[i])
            }
            const vMapa = await gerarMapa(vListaPedidoTrechos, vParametroGeralTempoPadraoCarregamento, vParametroGeralTempoPadraoDescarga)
            if (vMapa.status === 'I') vObservacao = `${vObservacao} Pedido: ${vMapa.numeroPedido} inconsistente!`
            await mapaSinoticoRepositorio.incluir(vMapa)
            vQtdIncluidos = vQtdIncluidos + 1
            console.log(`    mapa gerado`)
          } else {
            vQtdExistentes += 1
          }
          //}

        }),
        timeout(30) //3 segundos
      ])

    } catch (e) {
      vQtdErros = + 1
      vObservacao = `${vObservacao} +  Pedido: ${vPedidos[0].codigoPedido} > ${e}`;
    }
  }

  return 'OK'
}

async function listar(req) {
  return mapaSinoticoRepositorio.listar({}, {})
}

async function obter(pId) {
  return mapaSinoticoRepositorio.obter(pId)
}

function mapaDadosVazio(pNumeroPedido, pCodigoFilial) {
  return {
    dados: {
      _id: '12345678',
      status: 'I',
      numeroPedido: pNumeroPedido,
      codigoFilial: pCodigoFilial,
      posicaoAtual: {
        latitude: null,
        longitude: null,
      },
      etapas: [
        {
          descricao: '(Dados para este mapa não foram gerados!)',
          tipo: 'COLETA',
          ordem: 1,
          concluido: true,
          atraso: false,
          posicao: {
            latitude: null,
            longitude: null,
          },
        },
        {
          descricao: '(Dados para este mapa não foram gerados!)',
          tipo: 'ENTREGA',
          ordem: 2,
          concluido: true,
          atraso: true,
          posicao: {
            latitude: null,
            longitude: null,
          },
        },
      ],
    },
  }
}

async function obterDetalhado(pNumeroPedido, pCodigoFilial) {

  const vRetorno = (await mapaSinoticoRepositorio.obterPorPedido(
    pNumeroPedido,
    pCodigoFilial,
  )).dados

  console.log()

  if (!vRetorno) {
    return mapaDadosVazio(pNumeroPedido, pCodigoFilial)
  } else {

    // o segundo parametro ele tem que receber a placa, pq nisso o rastreador consegue puxar a posicao do veiculo certa e en seguida coloca no mapa
    await assinalarUltimaPosicaoVeiculoPrincipal(vRetorno._id, );

  }

  let vDados
  let vInformacoesAdicionais

  const vEtapas = []
  if (vRetorno) { // monta as etapas
    for (let i = 0; i < vRetorno.etapas.length; i += 1) {
      vInformacoesAdicionais = []
      const vInfo = vRetorno.etapas[i].poligono
      const vInfoCheckpoint = vRetorno.etapas[i].checkpoint

      if (vInfo.tipo === enums.TIPO_POLIGONO_VERIFICACAO.COLETA || vInfo.tipo === enums.TIPO_POLIGONO_VERIFICACAO.ENTREGA) {
        vInformacoesAdicionais.push({ rotulo: 'Data/Hora Planejada de Entrada', valor: vInfo.dataHoraPlanejadaEntrada ? util.formatarData(vInfo.dataHoraPlanejadaEntrada) : '--:--' })
        vInformacoesAdicionais.push({ rotulo: 'Data/Hora Planejada de Saida', valor: vInfo.dataHoraPlanejadaSaida ? util.formatarData(vInfo.dataHoraPlanejadaSaida) : '--:--' })
        vInformacoesAdicionais.push({ rotulo: 'Data/Hora Prevista de Entrada', valor: vInfo.dataHoraPrevistaEntrada ? util.formatarData(vInfo.dataHoraPrevistaEntrada) : '--:--' })
        vInformacoesAdicionais.push({ rotulo: 'Data/Hora Prevista de Saída', valor: vInfo.dataHoraPrevistaSaida ? util.formatarData(vInfo.dataHoraPrevistaSaida) : '--:--' })
        vInformacoesAdicionais.push({ rotulo: 'Data/Hora Entrada Efetiva', valor: vInfo.dataEntrada ? util.formatarData(vInfo.dataEntrada) : '--:--' })
        vInformacoesAdicionais.push({ rotulo: 'Data/Hora Saída Efetiva', valor: vInfo.dataSaida ? util.formatarData(vInfo.dataSaida) : '--:--' })
        vInformacoesAdicionais.push({ rotulo: 'Tempo Permanência Previsto', valor: vInfo.tempoPrevistoDentroDoPoligono ? vInfo.tempoPrevistoDentroDoPoligono : '--:-- hr(s)' })
        vInformacoesAdicionais.push({ rotulo: 'Tempo Permanência Real', valor: vInfo.tempoDentroDoPoligono ? vInfo.tempoDentroDoPoligono : '--:-- hr(s)' })
      } else {
        vInformacoesAdicionais.push({ rotulo: 'Data/Hora Planejada de Passagem', valor: vInfoCheckpoint.dataHoraPlanejadaEntrada ? util.formatarData(vInfoCheckpoint.dataHoraPlanejadaEntrada) : '--:--' })
        vInformacoesAdicionais.push({ rotulo: 'Data/Hora Prevista de Passagem', valor: vInfoCheckpoint.dataHoraPrevistaPassagem ? util.formatarData(vInfoCheckpoint.dataHoraPrevistaPassagem) : '--:--' })
        vInformacoesAdicionais.push({ rotulo: 'Data/Hora Efetiva de Passagem', valor: vInfoCheckpoint.dataHoraPassagem ? util.formatarData(vInfoCheckpoint.dataHoraPassagem) : '--:--' })
      }

      vEtapas.push({
        _id: vRetorno.etapas[i]._id,
        posicao: vRetorno.etapas[i].posicao,
        concluido: vRetorno.etapas[i].concluido,
        atraso: vRetorno.etapas[i].atraso,
        descricao: vRetorno.etapas[i].descricao,
        ordem: vRetorno.etapas[i].ordem,
        checkpoint: vRetorno.etapas[i].checkpoint,
        poligono: vRetorno.etapas[i].poligono,
        informacoesAdicionais: vInformacoesAdicionais,
      })
    }
  }

  if (vRetorno) {
    vDados = {
      _id: vRetorno._id,
      numeroPedido: pNumeroPedido,
      codigoFilial: pCodigoFilial,
      posicaoAtual: { latitude: vRetorno.posicaoAtual.latitude, longitude: vRetorno.posicaoAtual.longitude },
      etapas: vEtapas,
    }
  }

  return { dados: vDados }
}

async function listarEtapas(pId) {
  const mapaSinotico = await mapaSinoticoRepositorio.obter(pId)

  return mapaSinotico ? mapaSinotico.dados.etapas : null
}

async function ultimaPosicaoEstahContidaNoPoligono(pId, pIdEtapa) {
  const mapaSinotico = await mapaSinoticoRepositorio.obter(pId)

  const { latitude, longitude } = mapaSinotico.dados.posicaoAtual
  const estaContidaNoPoligono = await mapaSinoticoRepositorio.ultimaPosicaoEstahContidaNoPoligono(pIdEtapa, latitude, longitude)
  const etapaContidaCirculo = await mapaSinoticoRepositorio.ultimaPosicaoEstahContidaNoCirculo(pIdEtapa, latitude, longitude)
  return estaContidaNoPoligono || etapaContidaCirculo
}

async function obterEtapa(pId, pIdEtapa) {
  const mapaSinotico = await mapaSinoticoRepositorio.obter(pId)

  const etapas = mapaSinotico ? mapaSinotico.dados.etapas : {}

  return etapas ? etapas.filter((etapa) => etapa._id == pIdEtapa) : null
}

async function obterPorPedido(
  pNumeroPedido,
  pCodigoFilial,
) {
  return mapaSinoticoRepositorio.obterPorPedido(
    pNumeroPedido,
    pCodigoFilial,
  )
}

async function assinalarUltimaPosicaoVeiculoPrincipal(pId, pPlacaVeiculo) {
  // obter posição atual, já está retornando dados reais do rastreador
  // const posicaoAtual = await rastreadorServico.listar(req);
  const req = { query: { placa: pPlacaVeiculo } }
  console.log("REQ", req)
  const rastreador = (await rastreadorServico.incluir(req))
  console.log("RASTREADOR", rastreador);
  const posicaoAtual = rastreador ? rastreador.dados : null

  if (posicaoAtual) {
    console.log("BBBBBBBBB", posicaoAtual)
    const vRetorno = await mapaSinoticoRepositorio.alterar({ _id: pId },
      {
        posicaoAtual: { latitude: posicaoAtual.latitude, longitude: posicaoAtual.longitude },
        ultimaPosicaoRastreadorPrincipal:
        {
          latitude: posicaoAtual.latitude,
          longitude: posicaoAtual.longitude,
          placaVeiculo: pPlacaVeiculo,
          dataVerificacao: util.obterDataCorrente(),
        }
      })


    return vRetorno
  }
  else {
    return null
  }
}

async function obterProximaEtapa(pId) {
  const mapaSinotico = await mapaSinoticoRepositorio.obter(pId)
  return mapaSinotico.dados.etapas.filter((ms) => !ms.concluido)[0]
}

async function obterProximaDaProximaEtapa(pId) {
  const mapaSinotico = await mapaSinoticoRepositorio.obter(pId)
  return mapaSinotico.dados.etapas.filter((ms) => !ms.concluido)[1]
}

async function marcarEtapaConcluida(id, pMapaSinotico) {
  return mapaSinoticoRepositorio.marcarEtapaConcluida(id, pMapaSinotico, {})
}

function recalcularDataEmFuncaoTempoPermanencia(tempoInicial, tempoPrevistoDentroDoPoligono) {
  let horasParaAdicionarEmDataEntrada = null
  let minutosParaAdicionarEmDataEntrada = null

  horasParaAdicionarEmDataEntrada = parseInt(tempoPrevistoDentroDoPoligono.split(':')[0])
  minutosParaAdicionarEmDataEntrada = parseInt(tempoPrevistoDentroDoPoligono.split(':')[1])

  return moment(tempoInicial).add(horasParaAdicionarEmDataEntrada, 'hours').add(minutosParaAdicionarEmDataEntrada, 'minutes')
}

async function registrarPrevisaoChegadaAoPoligono(idEtapaMapaSinotico, novaPrevisaoChegada) {
  // OBTER INFORMAÇÕES DA ETAPA
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  const etapa = await mapaSinoticoRepositorio.obterDadosEtapa(idEtapaMapaSinotico)

  const {
    dataHoraPlanejadaEntrada,
    dataHoraPlanejadaSaida,
    tempoPrevistoDentroDoPoligono,
  } = etapa.etapas[0].poligono

  const atraso = dataHoraPlanejadaEntrada < new Date(novaPrevisaoChegada)
  // ********************************************************************************************************************
  // ********************************************************************************************************************

  // ALTERAR DATA DE PREVISÃO DE ENTRADA OBTIDA NO MONITORAMENTO
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  await mapaSinoticoRepositorio.alterarEtapaDataPrevistaEntrada(idEtapaMapaSinotico, new Date(novaPrevisaoChegada))
  // ********************************************************************************************************************
  // ********************************************************************************************************************

  // ALTERAR INDICADOR DE ATRASO (S/N) DE ACORDO COM PREVISÃO CHEGADA vs PLANEJAMENTO CHEGADA
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  await mapaSinoticoRepositorio.alterarEtapaAtraso(idEtapaMapaSinotico, atraso)
  // ********************************************************************************************************************
  // ********************************************************************************************************************

  // ALTERAR DATA PREVISTA DE SAÍDA
  // SE HÁ ATRASO, A DATA PREVISTA DE SAÍDA, SERÁ RECALCULADA A PARTIR DA NOVA PREVISÃO DE CHEGADA
  // SE NÃO HÁ ATRASO, A DATA PREVISTA DE SAÍDA, SERÁ A DATA PLANEJADA DE SAÍDA
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  const novaDataHoraPlanejadaSaida =
    atraso
      ? recalcularDataEmFuncaoTempoPermanencia(new Date(novaPrevisaoChegada), tempoPrevistoDentroDoPoligono)
      : new Date(dataHoraPlanejadaSaida)

  await mapaSinoticoRepositorio.alterarEtapaDataPrevistaSaida(idEtapaMapaSinotico, novaDataHoraPlanejadaSaida)
  // ********************************************************************************************************************
  // ********************************************************************************************************************
}

async function registrarEntradaEmPoligono(idEtapaMapaSinotico, dataHoraEntradaEfetiva) {
  // OBTER INFORMAÇÕES DA ETAPA
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  const etapa = await mapaSinoticoRepositorio.obterDadosEtapa(idEtapaMapaSinotico)
  const idMapaSinotico = etapa._id

  const {
    dataHoraPlanejadaEntrada,
    dataHoraPlanejadaSaida,
    tempoPrevistoDentroDoPoligono,
  } = etapa.etapas[0].poligono

  const atraso = dataHoraPlanejadaEntrada < new Date(dataHoraEntradaEfetiva)
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  // ALTERAR STATUS DO Mapa sinótico para VIAGEM
  await mapaSinoticoRepositorio.alterarStatusParaViagem(idMapaSinotico)
  // ALTERAR DATA DE ENTRADA REAL OBTIDA NO MONITORAMENTO
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  await mapaSinoticoRepositorio.alterarEtapaDataEntrada(idEtapaMapaSinotico, dataHoraEntradaEfetiva)
  // ********************************************************************************************************************
  // ********************************************************************************************************************

  // ALTERAR INDICADOR DE ATRASO (S/N) DE ACORDO COM PREVISÃO CHEGADA vs PLANEJAMENTO CHEGADA
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  await mapaSinoticoRepositorio.alterarEtapaAtraso(idEtapaMapaSinotico, atraso)
  // ********************************************************************************************************************
  // ********************************************************************************************************************

  // CALCULAR NOVA DATA DE PREVISÃO DE SAÍDA A PARTIR DO TEMPO PREVISTO DE PERMANÊNCIA
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  const novaDataHoraPlanejadaSaida = atraso
    ? recalcularDataEmFuncaoTempoPermanencia(new Date(dataHoraEntradaEfetiva), tempoPrevistoDentroDoPoligono)
    : new Date(dataHoraPlanejadaSaida)

  await mapaSinoticoRepositorio.alterarEtapaDataPrevistaSaida(idEtapaMapaSinotico, novaDataHoraPlanejadaSaida)
  // ********************************************************************************************************************
  // ********************************************************************************************************************
}

async function registrarSaidaDoPoligono(idEtapaMapaSinotico, dataHoraSaidaEfetiva) {
  // OBTER INFORMAÇÕES DA ETAPA
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  const etapa = await mapaSinoticoRepositorio.obterDadosEtapa(idEtapaMapaSinotico)

  const {
    dataEntrada,
  } = etapa.etapas[0].poligono
  // ********************************************************************************************************************
  // ********************************************************************************************************************

  // const {
  //   tempoExcedido,
  //   dataLimiteProgramacao,
  //   dataEfetivaProgramacao,
  //   rastreador,
  //   ultimaComunicacao,
  //   novaPrevisaoChegada,
  //   dataHoraEntradaEfetiva,
  //   dataHoraSaidaEfetiva
  // } = informacoesAdicionais

  // ALTERAR DATA DE SAÍDA REAL OBTIDA NO MONITORAMENTO
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  await mapaSinoticoRepositorio.alterarEtapaDataSaida(idEtapaMapaSinotico, dataHoraSaidaEfetiva)
  // ********************************************************************************************************************
  // ********************************************************************************************************************

  // ALTERAR DATA DE SAÍDA REAL OBTIDA NO MONITORAMENTO
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  const tempoDentroDoPoligono = util.calcularTempoPermanencia(dataEntrada, dataHoraSaidaEfetiva)

  await mapaSinoticoRepositorio.alterarEtapaTempoDentroDoPoligono(idEtapaMapaSinotico, tempoDentroDoPoligono)
  // ********************************************************************************************************************
  // ********************************************************************************************************************

  // ALTERAR INDICADOR DE ETAPA CONCLUÍDA
  // ********************************************************************************************************************
  // ********************************************************************************************************************
  await mapaSinoticoRepositorio.alterarEtapaConcluido(idEtapaMapaSinotico)
  // ********************************************************************************************************************
  // ********************************************************************************************************************
}

// verifica se a posição atual passou do checkpoint em relação a posição da próxima etapa
function passouCheckpoint(posicaoAtual, posicaoCheckpoint, posicaoProximaEtapa) {
  if (!posicaoAtual) return false
  const distanciaPosicaoAtual = geolib.getPreciseDistance(
    { latitude: posicaoAtual.latitude, longitude: posicaoAtual.longitude },
    { latitude: posicaoProximaEtapa.latitude, longitude: posicaoProximaEtapa.longitude },
  )

  const distanciaPosicaoCheckpoint = geolib.getPreciseDistance(
    { latitude: posicaoCheckpoint.latitude, longitude: posicaoCheckpoint.longitude },
    { latitude: posicaoProximaEtapa.latitude, longitude: posicaoProximaEtapa.longitude },
  )
  // somente passou do checkpoint se a posição atual estiver mais próxima do que a posição do checkpoint
  return distanciaPosicaoAtual < distanciaPosicaoCheckpoint
}

async function registrarPassagemCheckpoint(idEtapaMapaSinotico, dataHoraPasssagemEfetiva) {
  await mapaSinoticoRepositorio.registrarPassagemCheckpoint(idEtapaMapaSinotico, dataHoraPasssagemEfetiva)
}


// Atualiza a previsão em todas as etapas do mapa
async function recalculaPrevisaoTodasEtapas(idMapaSinotico, posicaoAtual) {
  if (!posicaoAtual) return // não é posivel recalcular sem a posição atual

  const mapaSinotico = await mapaSinoticoRepositorio.obter(idMapaSinotico)

  const mapaEtapas = await listarEtapas(idMapaSinotico)

  // let vPosicao = 0
  let vNovaPrevisaoChegada = util.obterDataCorrente()
  let vRetornoGoogleOK = true

  // Percorrer todas as etapas do Mapa Sinótico
  for (let vPosicao = 0; vPosicao < mapaEtapas.length; vPosicao += 1) {
    let vOrigem
    let vDestino

    const etapa = mapaEtapas[vPosicao]
    const etapaAnterior = mapaEtapas[vPosicao - 1]

    if (!etapa.poligono.dataEntrada && (!etapa.checkpoint || !etapa.checkpoint.dataHoraPassagem)) { // se não entrou ainda a origem ou não passou pelo checkpoint

      const vEtapaTipo = etapa.poligono.tipo
      // vPosicao += 1 // incrementa a partir da posição que ele está

      // Identificar LAT/LONG da Origem (para acionamento da API do Google)
      if (vPosicao === 0) {
        vOrigem = {
          lat: posicaoAtual.latitude,
          lng: posicaoAtual.longitude
        }
      }
      else {
        vOrigem = {
          lat: etapaAnterior.posicao.latitude,
          lng: etapaAnterior.posicao.longitude
        }
      }

      // Identificar LAT/LONG do Destino (para acionamento da API do Google)
      vDestino = {
        lat: etapa.posicao.latitude,
        lng: etapa.posicao.longitude
      }

      const vRetorno = await mapaServico.calcularPrevisaoDeChegadaApiGoogle(vOrigem, vDestino)

      const logApiGoogle = {
        numeroPedido: mapaSinotico.dados.numeroPedido,
        codigoFilial: mapaSinotico.dados.codigoFilial,
        etapaMapaSinotico: etapa.ordem,
        dataHora: util.obterDataCorrente(),
        origem: vOrigem,
        destino: vDestino,
        retornoDuracaoSegundos: vRetorno ? vRetorno.duration.value : 0,
        retornoDuracaoDescritivo: vRetorno ? vRetorno.duration.text : null
      }

      logApiGoogleRepositorio.incluir(logApiGoogle)

      if (!vRetorno) vRetornoGoogleOK = false // sinaliza que a api não retornou resultados

      const vDuracaoSegundos = vRetorno ? vRetorno.duration.value : 0

      vNovaPrevisaoChegada = vNovaPrevisaoChegada.add(vDuracaoSegundos, 'seconds')

      if (vEtapaTipo === enums.TIPO_POLIGONO_VERIFICACAO.CHECKPOINT) {
        await mapaSinoticoRepositorio.alterarEtapaDataPrevistaPassagem(etapa._id, vRetornoGoogleOK ? vNovaPrevisaoChegada : null)
      }
      else {
        await mapaSinoticoRepositorio.alterarEtapaDataPrevistaEntrada(etapa._id, vRetornoGoogleOK ? vNovaPrevisaoChegada : null)
        const diferenca = util.diferencaData(etapa.poligono.dataHoraPlanejadaSaida, etapa.poligono.dataHoraPlanejadaEntrada)
        vNovaPrevisaoChegada = vNovaPrevisaoChegada.add(diferenca)
        await mapaSinoticoRepositorio.alterarEtapaDataPrevistaSaida(etapa._id, vRetornoGoogleOK ? vNovaPrevisaoChegada : null)
      }
    }
  }
}

async function listarViagens(pReq) {
  return BaseServico.hubListar(`${urlHub.mapaSinotico}/listarViagens`, pReq.query)
}

async function listarCheckpoints(pReq) {
  return BaseServico.hubListar(`${urlHub.mapaSinotico}/listarCheckpoints`, pReq.query)
}

async function listarCheckpointsMonitoramento(pCodigoLinha) {
  return pedidoMonitoramentoCheckpointRepositorio.listarPorLinha(pCodigoLinha)
}

async function expurgarLogsApiGoogle() {
  const vQtdDiasExpurgoLog = await parametroGeralServico.obterPorCodigo('monitoramento', 'QTD_DIAS_EXPURGO_API_GOOGLE')
  const ret = await logApiGoogleRepositorio.expurgarLogsAntigos(vQtdDiasExpurgoLog)
  console.log('Qtde de Logs API Google Expurgados: ', ret.n)
}

async function expurgarLogsRastreador() {
  const vQtdDiasExpurgoLog = await parametroGeralServico.obterPorCodigo('monitoramento', 'QTD_DIAS_EXPURGO_RASTREADOR')
  const ret = await logApiGoogleRepositorio.expurgarLogsAntigos(vQtdDiasExpurgoLog)
  console.log('Qtde de Logs Rastreador Expurgados: ', ret.n)
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const functions = {
  processarMapaSinotico: async (pReq) => processarMapaSinotico(pReq),
  listar: (req) => listar(req),
  // incluir: (body) => incluir(body),
  marcarEtapaConcluida: (id, pMapaSinotico) => marcarEtapaConcluida(id, pMapaSinotico),
  obter: (pId) => obter(pId),
  obterDetalhado: (pNumeroPedido, pCodigoFilial) => obterDetalhado(pNumeroPedido, pCodigoFilial),
  listarEtapas: (pId) => listarEtapas(pId),
  ultimaPosicaoEstahContidaNoPoligono: (pId, pIdEtapa) => ultimaPosicaoEstahContidaNoPoligono(pId, pIdEtapa),
  obterEtapa: (pId, pIdEtapa) => obterEtapa(pId, pIdEtapa),
  obterPorPedido: (pNumeroPedido, pCodigoFilial) => obterPorPedido(pNumeroPedido, pCodigoFilial),
  assinalarUltimaPosicaoVeiculoPrincipal: (pId, pPlacaVeiculo) => assinalarUltimaPosicaoVeiculoPrincipal(pId, pPlacaVeiculo),
  obterProximaEtapa: (pId) => obterProximaEtapa(pId),
  obterProximaDaProximaEtapa: (pId) => obterProximaDaProximaEtapa(pId),
  registrarPrevisaoChegadaAoPoligono: (idEtapaMapaSinotico, novaPrevisaoChegada) => registrarPrevisaoChegadaAoPoligono(idEtapaMapaSinotico, novaPrevisaoChegada),
  registrarEntradaEmPoligono: (idEtapaMapaSinotico, dataHoraEntradaEfetiva) => registrarEntradaEmPoligono(idEtapaMapaSinotico, dataHoraEntradaEfetiva),
  registrarSaidaDoPoligono: (idEtapaMapaSinotico, dataHoraSaidaEfetiva) => registrarSaidaDoPoligono(idEtapaMapaSinotico, dataHoraSaidaEfetiva),
  registrarPassagemCheckpoint: (idEtapaMapaSinotico, dataHoraPassagemEfetiva) => registrarPassagemCheckpoint(idEtapaMapaSinotico, dataHoraPassagemEfetiva),
  passouCheckpoint: (posicaoAtual, posicaoCheckpoint, posicaoProximaEtapa) => passouCheckpoint(posicaoAtual, posicaoCheckpoint, posicaoProximaEtapa),
  recalculaPrevisaoTodasEtapas: async (idMapaSinotico, posicaoAtual) => recalculaPrevisaoTodasEtapas(idMapaSinotico, posicaoAtual),

  listarViagens: async (pReq) => listarViagens(pReq),
  listarCheckpoints: async (pReq) => listarCheckpoints(pReq),
}

export default functions
