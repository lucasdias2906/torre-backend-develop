import moment from 'moment'
import pLimit from 'p-limit'

import utilitario from '../funcoes/utilitarios'
import monitoramentoHub from './monitoramentoHub'

import rotinaServico from './rotinaServico'
import mapaServico from './mapaServico'
import mapaSinoticoServico from './mapaSinoticoServico'
import pedidoServico from './pedidoServico'
import rastreadorServico from './rastreadorServico'
import monitoramentoGatilhosServico from './monitoramentoGatilhosServico'
import parametroGeralServico from './parametroGeralServico'
import veiculoClassificacaoServico from './veiculoClassificacaoServico'
import MotoristaServico from '../servicos/motoristaServico'
import PedidoMonitoramentoRepositorio from '../repositorios/pedidoMonitoramentoRepositorio'
import PedidoMonitoramentoCheckpointRepositorio from '../repositorios/pedidoMonitoramentoCheckpointRepositorio'
import LogApiGoogleRepositorio from '../repositorios/logApiGoogleRepositorio'

const logApiGoogleRepositorio = new LogApiGoogleRepositorio()

async function formatarData(pData) {
  return moment(pData).format('DD/MM/YYYY HH:mm')
}

async function obterPrevisaoChegada(posicaoAtual, posicaoAlvo) {
  const { latitude: latitudeAtual, longitude: longitudeAtual } = posicaoAtual
  const { latitude: latitudeAlvo, longitude: longitudeAlvo } = posicaoAlvo

  const coordenadasAtuais = {
    lat: latitudeAtual,
    lng: longitudeAtual,
  }

  const coordenadasAlvo = {
    lat: latitudeAlvo,
    lng: longitudeAlvo,
  }

  return mapaServico.calcularPrevisaoDeChegadaApiGoogle(coordenadasAtuais, coordenadasAlvo)
}

async function monitorarPedidosNovosAndEmAlocacaoItem(pedido, parametros) {

  const { numeroPedido, codigoFilial } = pedido
  console.log(`MONITORAMENTO PEDIDO ==> ${numeroPedido} / ${codigoFilial}`)

  await monitoramentoGatilhosServico.monitorarAlocacaoPedidoDentroPrazo(pedido, parametros)

  await monitoramentoGatilhosServico.monitorarAlocacaoPedidoTempoExcedido(pedido, parametros)

  await monitoramentoGatilhosServico.monitorarConfirmacaoAlocacaoParaPedido(pedido, parametros)

  //await monitoramentoGatilhosServico.monitorarRastreadorCavaloSemComunicacao(pedido, parametros)

  // await monitoramentoGatilhosServico.monitorarRastreadorCarretaSemComunicacao(pedido, parametros)
}

async function monitorarPedidosNovosAndEmAlocacao() {
  const repositorio = new PedidoMonitoramentoRepositorio()

  const pedidosNovosOrEmAlocacao = await repositorio.listarDisponiveisMonitoramentoNovosOrEmAlocacao()

  const vListaParametrosGeral = (await parametroGeralServico.listar()).dados

  let vQtdOk = 0
  let vQtdErro = 0

  const limit = pLimit(5) // limitar a 5 registros em paralelo

  async function ProcessarPedidosNovosAndEmAlocacao(pedido) {
    await Promise.all([
      await monitorarPedidosNovosAndEmAlocacaoItem(pedido, vListaParametrosGeral),
      timeout(300) //3 segundos
    ])
  }

  const promises = pedidosNovosOrEmAlocacao.dados.map(async (pedido) => {
    try {
      await limit(async () => { await ProcessarPedidosNovosAndEmAlocacao(pedido, vListaParametrosGeral) })
      vQtdOk += 1
    } catch (e) {
      vQtdErro += 1
      console.log("erro processamento pedido: ", pedido.numeroPedido)
      console.log(e)
      rotinaServico.incluirLog(null, `Pedido: ${pedido.numeroPedido} - ${e}`)
    }
  })

  await Promise.all(promises)
  return {
    qtdOK: vQtdOk,
    qtdErro: vQtdErro,
  }
}

async function monitorarPedidosEmViagemItem(pedido, parametros) {
  // Obter informações do Pedido em Viagem

  const { numeroPedido, codigoFilial } = pedido
  const mapaSinotico = await mapaSinoticoServico.obterPorPedido(numeroPedido, codigoFilial)
  const { _id: idMapaSinotico } = mapaSinotico.dados

  console.log(`MONITORAMENTO PEDIDO ==> ${numeroPedido} / ${codigoFilial}`)

  // Obter informações da Próxima Etapa definda no Mapa Sinótico do Pedido
  const proximaEtapa = await mapaSinoticoServico.obterProximaEtapa(idMapaSinotico)

  if (!proximaEtapa) return
  // Obter informações da Próxima da Próxima Etapa definda no Mapa Sinótico do Pedido para verificação do checkpoint
  const proximaDaProximaEtapa = await mapaSinoticoServico.obterProximaDaProximaEtapa(idMapaSinotico)

  const { checkpoint, poligono, _id: idProximaEtapa } = proximaEtapa

  const tipoPoligono = checkpoint ? null : poligono.tipo

  const tipoProximaEtapa = checkpoint ? 'CHECKPOINT' : (poligono ? 'POLIGONO' : null)

  const posicaoAlvo = { latitude: proximaEtapa.posicao.latitude, longitude: proximaEtapa.posicao.longitude }

  let vRastreador = null
  try {
    vRastreador = await rastreadorServico.incluir({ query: { placa: pedido.placaVeiculo } })
  }
  catch (error) {
    console.log('Erro ao acessar rastreador: ', error)
  }

  let posicaoAtual
  let estimativaChegada

  if (vRastreador) { // somente se rasterador estiver ativo
    const ultimaPosicao = await mapaSinoticoServico.assinalarUltimaPosicaoVeiculoPrincipal(
      idMapaSinotico,
      pedido.placaVeiculo, // placaVeiculo
    )

    const {
      latitude: latitudeUltimaPosicao,
      longitude: longitudeUltimaPosicao,
    } = ultimaPosicao.dados.posicaoAtual

    posicaoAtual = {
      latitude: latitudeUltimaPosicao,
      longitude: longitudeUltimaPosicao,
      dataHora: ultimaPosicao.dados.ultimaPosicaoRastreadorPrincipal.dataVerificacao,
      idRastreador: vRastreador || vRastreador.dados.idRastreador,
    }

    const previsaoChegada = await obterPrevisaoChegada(
      posicaoAtual,
      posicaoAlvo
    )

    // LOGAR ACIONAMENTO DA API DO GOOGLE
    // Foi necessário remontar a mesma estrutura de LAT/LONG de dentro da rotina
    // de acionamento, para que o LOG fique armazenado de forma idêntica ao que foi
    // consumido na API
  
    const origem = {
      lat: posicaoAtual.latitude,
      lng: posicaoAtual.longitude,
    }
  
    const destino = {
      lat: posicaoAlvo.latitude,
      lng: posicaoAlvo.longitude,
    }
    
    const logApiGoogle = {
      numeroPedido: numeroPedido,
      codigoFilial: codigoFilial,
      etapaMapaSinotico: proximaEtapa.ordem,
      dataHora: utilitario.obterDataCorrente(),
      origem: origem,
      destino: destino,
      retornoDuracaoSegundos: previsaoChegada ? previsaoChegada.duration.value : 0,
      retornoDuracaoDescritivo: previsaoChegada ? previsaoChegada.duration.text : null
    }

    logApiGoogleRepositorio.incluir(logApiGoogle)

    const dataCorrente = new Date()

    if (previsaoChegada != null) {

      estimativaChegada = {
        duracao: previsaoChegada.duration.text,
        duracaoEmSegundos: previsaoChegada.duration.value,
        tempoTotal: dataCorrente.setSeconds(
          dataCorrente.getSeconds() + previsaoChegada.duration.value,
        ),
        horaEstimada: await formatarData(
          dataCorrente.setSeconds(
            dataCorrente.getSeconds() + previsaoChegada.duration.value,
          ),
        ),
      }

    }
    else {

      estimativaChegada = {
        duracao: 'INDISPONIVEL',
        duracaoEmSegundos: 100000,
        tempoTotal: dataCorrente.setSeconds(
          dataCorrente.getSeconds() + 100000,
        ),
        horaEstimada: await formatarData(
          dataCorrente.setSeconds(
            dataCorrente.getSeconds() + 100000,
          ),
        ),
      }

    }
  }

  const proximaEtapaMonitoramento = {
    idMapaSinotico,
    idProximaEtapa,
    tipo: tipoProximaEtapa,
    tipoPoligono,
    chegadaPlanejada: poligono.dataHoraPlanejadaEntrada,
    dataEntrada: poligono.dataEntrada,
    dataHoraPrevisaoSaida: poligono.dataHoraPrevistaSaida,
    idParceiroComercial: poligono.idParceiroComercial
  }

  await monitoramentoGatilhosServico.monitorarPedidoRastreadorCavaloSemComunicacao(pedido, parametros, posicaoAtual)

  await monitoramentoGatilhosServico.monitorarAtrasoChegadaAreaColeta(pedido, proximaEtapaMonitoramento, estimativaChegada, posicaoAtual)

  await monitoramentoGatilhosServico.monitorarRegistroEntradaAreaColeta(pedido, proximaEtapaMonitoramento)

  await monitoramentoGatilhosServico.monitorarRegistroTempoExcedidoAreaColeta(pedido, proximaEtapaMonitoramento, posicaoAtual)

  await monitoramentoGatilhosServico.monitorarRegistroSaidaAreaColeta(pedido, proximaEtapaMonitoramento, posicaoAtual)

  await monitoramentoGatilhosServico.monitorarAtrasoChegadaAreaEntrega(pedido, proximaEtapaMonitoramento, estimativaChegada, posicaoAtual)

  await monitoramentoGatilhosServico.monitorarRegistroEntradaAreaEntrega(pedido, proximaEtapaMonitoramento)

  await monitoramentoGatilhosServico.monitorarRegistroTempoExcedidoAreaEntrega(pedido, proximaEtapaMonitoramento, posicaoAtual)

  await monitoramentoGatilhosServico.monitorarRegistroSaidaAreaEntrega(pedido, proximaEtapaMonitoramento, posicaoAtual)

  await mapaSinoticoServico.recalculaPrevisaoTodasEtapas(idMapaSinotico, posicaoAtual)

  await monitoramentoGatilhosServico.monitorarRegistroPassagemCheckpoint(proximaEtapa, proximaDaProximaEtapa, posicaoAtual)
}

// monitorar pedidos em viagem
async function monitorarPedidosEmViagem() {
  const repositorio = new PedidoMonitoramentoRepositorio()

  let vQtdOk = 0
  let vQtdErro = 0
  const vListaParametrosGeral = (await parametroGeralServico.listar()).dados

  // obter uma lista de pedidos a serem monitorados
  const pedidosEmViagem = utilitario.excluirDuplicadosArray((await repositorio.listarDisponiveisMonitoramentoEmViagem()).dados, ['numeroPedido', 'codigoFilial'])

  async function ProcessarItemViagem(pedido) {

    const vExisteMapa = (await mapaSinoticoServico.obterPorPedido(pedido.numeroPedido, pedido.codigoFilial)).dados
    if (vExisteMapa && (vExisteMapa.status === 'P' // só processa se o mapa sinótico estiver consistente
      || vExisteMapa.status === 'V')) { // ou em viagem

      await Promise.all([
        await monitorarPedidosEmViagemItem(pedido, vListaParametrosGeral),
        timeout(300)
      ])
      vQtdOk += 1
    }
  }

  const limit = pLimit(5) // limitar a 5 registros em paralelo

  const vRetorno = pedidosEmViagem.map(async (pedido) => {
    return limit(async () => { await ProcessarItemViagem(pedido) })
  })

  await Promise.all(vRetorno)

  return {
    qtdOk: vQtdOk,
    qtdErro: vQtdErro,
  }
}

async function monitorarMotoristasItem(motorista, parametros) {
  const vRetorno = await monitoramentoGatilhosServico.monitorarMotoristaVencimentoCNH(motorista, parametros)
  return 'OK'
}

async function monitorarMotoristas() {
  let vQtdOk = 0
  let vQtdErro = 0
  const limit = pLimit(5) // limitar a 10 registros em paralelo
  const vListaParametrosGeral = (await parametroGeralServico.listar()).dados

  let vTemp

  const delay = ms => new Promise(res => setTimeout(res, ms))

  console.log('MONITORAMENTO DE MOTORISTAS SEM ALOCAÇÃO POR TEMPO')
  console.log('*******************************************************************')

  const listagemMotoristasSemAlocacaoPorTempo = await monitoramentoHub.listarMotoristaSemAlocacaoPorTempo({})
  vTemp = listagemMotoristasSemAlocacaoPorTempo.dados.map(async (item) => {

    await delay(1000)

    try {
      console.log('    MOTORISTA -->', item.codigoMotorista)
      await limit(() => monitoramentoGatilhosServico.monitorarMotoristaSemAlocacaoPorTempo(item, vListaParametrosGeral))
      vQtdOk += 1
    }
    catch (e) {
      vQtdErro += 1
      console.log('    Erro motorista alocacão por tempo:', e)
    }
  })

  await Promise.all(vTemp)

  console.log()
  console.log('MONITORAMENTO DE FERIAS MOTORISTAS')
  console.log('*******************************************************************')

  const listagemMotoristasFerias = await monitoramentoHub.listarMotoristasFerias()

  vTemp = listagemMotoristasFerias.dados.map(async (item) => {

    await delay(1000)

    try {
      console.log('    MOTORISTA -->', item.codigoMotorista)
      await limit(() => monitoramentoGatilhosServico.monitorarMotoristaFerias(item, vListaParametrosGeral))
      vQtdOk += 1
    }
    catch (e) {
      vQtdErro += 1
      console.log('    Erro motorista verificação férias:', e)
    }
  })

  await Promise.all(vTemp)

  console.log()
  console.log('MONITORAMENTO DE MOTORISTAS VENCIMENTO CNH')
  console.log('*******************************************************************')

  const listagemMotoristas = await monitoramentoHub.listarMotoristas()

  vTemp = listagemMotoristas.dados.map(async (item) => {

    await delay(1000)

    try {
      console.log('    MOTORISTA -->', item.codigoMotorista)
      await limit(() => monitorarMotoristasItem(item, vListaParametrosGeral))
      vQtdOk += 1
    }
    catch (e) {
      vQtdErro += 1
      console.log('    Erro motorista vencimento cnh:', e)
    }
  })

  await Promise.all(vTemp)

  console.log('Fim...')

  return {
    qtdOk: vQtdOk,
    qtdErro: vQtdErro,
  }
}

async function monitorarVeiculosItem(veiculo, parametros) {
  console.log('    VEICULO -->', veiculo.placaVeiculo)
  await monitoramentoGatilhosServico.monitorarVeiculoRastreadorCavaloSemComunicacao(veiculo, parametros)
  await monitoramentoGatilhosServico.monitorarVeiculoRastreadorCarretaSemComunicacao(veiculo, parametros)
  return 'OK'
}

async function monitorarVeiculos() {
  let vQtdOk = 0
  let vQtdErro = 0
  const limit = pLimit(5) // limitar a 10 registros em paralelo

  const vListaParametrosGeral = (await parametroGeralServico.listar()).dados
  const vVeiculosClassificacaoUsaCombustivel = (await veiculoClassificacaoServico.listarClassificacaoUsaCombustivel()).dados

  // Listagem Genérica
  const vListagemVeiculosTemp = (await monitoramentoHub.listarVeiculos({})).dados

  const vListagemVeiculos = vListagemVeiculosTemp.map((veiculo) => {
    const vUsaCombustivel = vVeiculosClassificacaoUsaCombustivel.filter((classificacao) => classificacao.codigoClassificacao === veiculo.codigoClassificacaoVeiculo).length > 0

    return {
      codigoVeiculo: veiculo.codigoVeiculo,
      placaVeiculo: veiculo.placaVeiculo,
      usaCombustivel: vUsaCombustivel,
    }
  })

  const delay = ms => new Promise(res => setTimeout(res, ms))

  console.log('MONITORAMENTO DE VEÍCULOS')
  console.log('*******************************************************************')

  const vTemp = vListagemVeiculos.map(async (item) => {

    await delay(1000)

    try {
      await limit(() => monitorarVeiculosItem(item, vListaParametrosGeral))
      vQtdOk += 1
    }
    catch (e) {
      vQtdErro += 1
      console.log('    Erro verificação veículo item:', e)
    }
  })

  await Promise.all(vTemp)
  // fim Listagem Genérica

  return {
    qtdOk: vQtdOk,
    qtdErro: vQtdErro,
  }
}

async function monitorarOperacaoDiario() {
  const vRetornoMotoristas = await monitorarMotoristas()
  const vRetornoVeiculos = await monitorarVeiculos()

  return {
    qtdOk: vRetornoMotoristas.qtdOk + vRetornoVeiculos.qtdOk,
    qtdErro: vRetornoMotoristas.qtdErro + vRetornoVeiculos.qtdErro,
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function monitorarOperacao() {
  const vRetorno01 = await monitorarPedidosNovosAndEmAlocacao()
  const vRetorno02 = await monitorarPedidosEmViagem()

  // await monitorarPedidosRegrasGerais();
  // await monitorarPedidos();

  // vObservacao = `${vObservacao} Processamento Novos ou em Alocação: Qtd Erros: ${vRetorno01.qtdErro} qtd OK: ${vRetorno01.qtdOK}`
  // vObservacao = `${vObservacao} Processamento Viagem: Qtd Erros: ${vRetorno02.qtdErro} qtd OK: ${vRetorno02.qtdOK}`
  // vObservacao = `${vObservacao} Processamento Veículos: Qtd Erros: ${vRetorno03.qtdErro} qtd OK: ${vRetorno03.qtdOK}`
  //vObservacao = `${vObservacao} Processamento Veículos: Qtd Erros: ${vRetorno04.qtdErro} qtd OK: ${vRetorno04.qtdOK}`

  // const vQtdOK = vRetorno02.qtdOK
  // const vQtdErro = vRetorno02.qtdErro
  return {
    qtdOk: 0,
    qtdErro: 0,
  }
}

async function obterPedidosParaMonitoramento() {
  const repositorio = new PedidoMonitoramentoRepositorio()

  const delay = ms => new Promise(res => setTimeout(res, ms))

  let pedido
  let pedidoParaMonitoramento
  let pedidoParaMonitoramentoConsultado
  let filtro

  /// COLETANDO PEDIDOS NOVOS E EM ALOCAÇÃO
  /// *******************************************************************************************
  try {
    const pedidosNovosOrEmAlocacao = (await pedidoServico.listarPedidosNovosAndEmAlocacao({})).dados

    for (let i = 0; i < pedidosNovosOrEmAlocacao.length; i++) {

      pedido = pedidosNovosOrEmAlocacao[i]

      let pedidoParaMonitoramento
      
      pedidoParaMonitoramento = {
        numeroPedido: pedido.numeroPedido,
        codigoFilial: pedido.codigoFilial,
        codigoPedido: pedido.numeroPedido,
        codigoFilialPedido: pedido.codigoFilial,
        codigoAgrupadorTorre: null,
        statusPedido: pedido.statusPedido,
        codigoPlacaVeiculo: pedido.codigoPlacaVeiculo,
        placaVeiculo: pedido.placaVeiculo,
        codigoPlacaVeiculo2: pedido.codigoPlacaVeiculo2,
        placaVeiculo2: pedido.placaVeiculo2,
        codigoPlacaVeiculo3: pedido.codigoPlacaVeiculo3,
        placaVeiculo3: pedido.placaVeiculo3,
        codigoPlacaVeiculo4: pedido.codigoPlacaVeiculo4,
        placaVeiculo4: pedido.placaVeiculo4,
        codigoMotorista1: pedido.codigoMotorista1,
        codigoMotorista2: pedido.codigoMotorista2,
        nomeMotorista: null,
        dataInicioViagem: pedido.dataInicioViagem,
        dataProgramacao: pedido.dataProgramacao,
        dataColeta: pedido.dataColeta,
        dataPedido: pedido.dataPedido,
        nomeFilial: null,
        codigoTomador: null,
        nomeTomador: null,
        codigoRemetente: null,
        nomeRemetente: null,
        codigoDestinatario: null,
        nomeDestinatario: null,    
        codigoLinhaTrecho: null,
        codigoLocalColeta: null,
        nomeLocalColeta: null,
        latitudeLocalColeta: null,
        longitudeLocalColeta: null,
        raioMetrosLocalColeta: null,
        codigoLocalEntrega: null,
        nomeLocalEntrega: null,
        latitudeLocalEntrega: null,
        longitudeLocalEntrega: null,
        raioMetrosLocalEntrega: null,
        dataEntrega: null,
        tipoMonitoramento: 'NOVO_ALOCACAO',
        statusMonitoramento: 'PENDENTE_INFORMACAO',
        qtdeAtualizacoes: 0
      }

      pedidoParaMonitoramentoConsultado = await (await repositorio.obterPorPedidoAndFilial(pedido.numeroPedido, pedido.codigoFilial)).dados

      // Se o Pedido já foi encontrado na base de Monitoramento do MongoDB (torrePedidoMonitoramento)
      // então o pedido será atualizado com algumas informações retornadas do Rodopar
      // caso contrário, o pedido será inserido na base do MongoDB
      if (!pedidoParaMonitoramentoConsultado) {
        await repositorio.incluir(pedidoParaMonitoramento)
      }
      else {
        // Pedidos que já estão na base do MongoDB para Monitoramento, não podem ser alterados nesta rotina,
        // pois alguns dados podem ser perdidos uma vez que há uma outra Rotina para atualização dos Pedidos para Monitoramento
        // ver função --> atualizarPedidosParaMonitoramento()
        if (pedidoParaMonitoramentoConsultado.statusMonitoramento === 'PENDENTE_INFORMACAO') {
          filtro = {
            numeroPedido: pedido.numeroPedido,
            codigoFilial: pedido.codigoFilial
          }
          await repositorio.alterar(filtro, pedidoParaMonitoramento)
        }
      }
    }
    console.log('---Obtenção de pedidos novos/alocação: OK')
  }
  catch (error) {
    console.log('---Ocorreu erro ao obter pedidos novos/alocação: ', error)
  }

  /// COLETANDO PEDIDOS EM VIAGEM
  /// *******************************************************************************************
  try {
    const pedidosEmViagem = (await monitoramentoHub.listarViagensMapaSinotico())

    for (let i = 0; i < pedidosEmViagem.length; i++) {

      await delay(300)

      pedido = pedidosEmViagem[i]

      pedidoParaMonitoramentoConsultado = await (await repositorio.obterPorPedidoAndFilial(pedido.codigoPedido, pedido.codigoFilialPedido)).dados

      let nomeMotorista = pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.nomeMotorista : null

      if (nomeMotorista === null) {
        try {
          const motoristaConsulta = pedido.codigoMotorista1 ? await MotoristaServico.obterDadosPessoais(pedido.codigoMotorista1) : null
          nomeMotorista = motoristaConsulta && motoristaConsulta.dados != null ? motoristaConsulta.dados.documentos.nomeMotorista : null
        }
        catch (error) {
          console.log('---Ocorreu erro ao consulta motorista do pedido: ', error)
        }
      }

      pedidoParaMonitoramento = {
        numeroPedido: pedido.codigoPedido,
        codigoFilial: pedido.codigoFilialPedido,
        codigoPedido: pedido.codigoPedido,
        codigoFilialPedido: pedido.codigoFilialPedido,
        codigoAgrupadorTorre: pedido.codigoAgrupadorTorre,
        statusPedido: 'EM VIAGEM',
        codigoPlacaVeiculo: pedido.placaVeiculo,
        placaVeiculo: pedido.Veiculo,
        codigoPlacaVeiculo2: pedido.placaVeiculo2,
        placaVeiculo2: pedido.Veiculo2,
        codigoPlacaVeiculo3: pedido.placaoVeiculo3,
        placaVeiculo3: pedido.Veiculo3,
        codigoPlacaVeiculo4: pedido.placaVeiculo4,
        placaVeiculo4: pedido.Veiculo4,
        codigoMotorista1: pedido.codigoMotorista1,
        codigoMotorista2: pedido.codigoMotorista2,
        nomeMotorista: nomeMotorista,
        dataInicioViagem: pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.dataInicioViagem || null : null,
        dataProgramacao: pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.dataProgramacao || null : null,
        dataColeta: pedido.dataColeta,
        dataPedido: pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.dataPedido || null : null,
        nomeFilial: pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.nomeFilial || null : null,
        codigoTomador: pedido.codigoTomador,
        nomeTomador: pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.nomeTomador || null : null,
        codigoRemetente: pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.codigoRemetente || null : null,
        nomeRemetente: pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.nomeRemetente || null : null,
        codigoDestinatario: pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.codigoDestinatario || null : null,
        nomeDestinatario: pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.nomeDestinatario || null : null,
        codigoLinhaTrecho: pedido.codigoLinhaTrecho.toUpperCase(),
        codigoLocalColeta: pedido.codigoLocalColeta,
        nomeLocalColeta: pedido.nomeLocalColeta,
        latitudeLocalColeta: pedido.latitudeLocalColeta,
        longitudeLocalColeta: pedido.longitudeLocalColeta,
        raioMetrosLocalColeta: pedido.raioMetrosLocalColeta,
        codigoLocalEntrega: pedido.codigoLocalEntrega,
        nomeLocalEntrega: pedido.nomeLocalEntrega,
        latitudeLocalEntrega: pedido.latitudeLocalEntrega,
        longitudeLocalEntrega: pedido.longitudeLocalEntrega,
        raioMetrosLocalEntrega: pedido.raioMetrosLocalEntrega,
        dataEntrega: pedido.dataEntrega,
        tipoMonitoramento: 'EM_VIAGEM',
        statusMonitoramento: pedidoParaMonitoramentoConsultado ? pedidoParaMonitoramentoConsultado.statusMonitoramento : 'PENDENTE_INFORMACAO',
        qtdeAtualizacoes: pedidoParaMonitoramentoConsultado ? (pedidoParaMonitoramentoConsultado.qtdeAtualizacoes + 1) : 0
      }

      // Se o Pedido já foi encontrado na base de Monitoramento do MongoDB (torrePedidoMonitoramento)
      // então o pedido será atualizado com algumas informações retornadas do Rodopar
      // caso contrário, o pedido será inserido na base do MongoDB
      if (!pedidoParaMonitoramentoConsultado) {
        await repositorio.incluir(pedidoParaMonitoramento)
      }
      else {
        filtro = {
          numeroPedido: pedido.codigoPedido,
          codigoFilial: pedido.codigoFilialPedido
        }

        await repositorio.alterar(filtro, pedidoParaMonitoramento)
      }
    }

    const pedidosParaMonitoramentoEmViagem = (await repositorio.listarDisponiveisMonitoramentoEmViagem()).dados

    for (let i = 0; i < pedidosParaMonitoramentoEmViagem.length; i++) {

      await delay(300)

      const pedidoParaMonitoramentoEmViagem = pedidosParaMonitoramentoEmViagem[i]

      const aindaEmViagem = pedidosEmViagem.some(pedido => pedido.codigoPedido == pedidoParaMonitoramentoEmViagem.numeroPedido && pedido.codigoFilialPedido == pedidoParaMonitoramentoEmViagem.codigoFilial)

      if (!aindaEmViagem) {
        await finalizarMonitoramentoPedido(pedidoParaMonitoramentoEmViagem)
      }
    }
      
    console.log('---Obtenção de pedidos em viagem: OK')
  }
  catch (error) {
    console.log('---Ocorreu erro ao obter pedidos em viagem: ', error)
  }
}

async function finalizarMonitoramentoPedido(pedidoMonitoramento) {
  const repositorio = new PedidoMonitoramentoRepositorio()

  pedidoMonitoramento.statusMonitoramento = 'FINALIZADO'
  pedidoMonitoramento.log = {}

  const filtro = {
    numeroPedido: pedidoMonitoramento.numeroPedido,
    codigoFilial: pedidoMonitoramento.codigoFilial
  }

  try {
    await repositorio.alterar(filtro, pedidoMonitoramento)
    console.log('---Atualização de Pedidos Não Monitorado: OK')
  }
  catch (error) {
    console.log('---Ocorreu erro ao alterar pedido não monitorado: ', error)
  }
}

async function atualizarPedidosParaMonitoramento() {
  const repositorio = new PedidoMonitoramentoRepositorio()
  const repositorioCheckpoint = new PedidoMonitoramentoCheckpointRepositorio()

  let pedidoMonitoramento
  let filtro
  let reqPedido
  let pedidoEditado = null
  let pedidoConsultaTMS = null

  /// VARRER PEDIDOS PARA MONITORAMENTO COMPLEMENTANDO INFORMAÇÕES ADICIONAIS
  /// PEDIDOS QUE AINDA NÃO SOFRERAM NENHUMA ATUALIZAÇÃO (STATUS = PENDENTE_INFORMACAO)
  /// *******************************************************************************************
  const pedidosPendenteInformacaoNovosAlocacao = await (await repositorio.listarPendentesInformacaoNovosOrEmAlocacao()).dados

  for (let i = 0; i < pedidosPendenteInformacaoNovosAlocacao.length; i++) {

    pedidoMonitoramento = pedidosPendenteInformacaoNovosAlocacao[i]

    reqPedido = {
      query: {
        numeroPedido: pedidoMonitoramento.numeroPedido,
        codigoFilial: pedidoMonitoramento.codigoFilial
      }
    }

    console.log('---ATUALIZA PEDIDO ==> ', reqPedido.query.numeroPedido, ' / ', reqPedido.query.codigoFilial)

    try {
      pedidoConsultaTMS = await pedidoServico.obter(reqPedido)

      if (pedidoConsultaTMS != null) {

        // Se o Pedido não foi retornado na consulta do TMS, ele será FINALIZADO para Monitoramento
        // *****************************************************************************
        if (!pedidoConsultaTMS.dados) {
          await finalizarMonitoramentoPedido(pedidoMonitoramento)
        }
        else {
          pedidoEditado = {
            numeroPedido: pedidoMonitoramento.numeroPedido,
            codigoFilial: pedidoMonitoramento.codigoFilial,
            codigoPedido: pedidoMonitoramento.codigoPedido,
            codigoFilialPedido: pedidoMonitoramento.codigoFilialPedido,
            codigoAgrupadorTorre: pedidoMonitoramento.codigoAgrupadorTorre,

            // DADOS DO TMS
            statusPedido: pedidoConsultaTMS.dados.pedido.statusPedidoTorre,
            codigoPlacaVeiculo: pedidoConsultaTMS.dados.pedido.codigoPlacaVeiculo,
            placaVeiculo: pedidoConsultaTMS.dados.pedido.placaVeiculo,
            codigoPlacaVeiculo2: pedidoConsultaTMS.dados.pedido.codigoPlacaVeiculo2,
            placaVeiculo2: pedidoConsultaTMS.dados.pedido.placaVeiculo2,
            codigoPlacaVeiculo3: pedidoConsultaTMS.dados.pedido.codigoPlacaVeiculo3,
            placaVeiculo3: pedidoConsultaTMS.dados.pedido.placaVeiculo3,
            codigoPlacaVeiculo4: pedidoConsultaTMS.dados.pedido.codigoPlacaVeiculo4,
            placaVeiculo4: pedidoConsultaTMS.dados.pedido.placaVeiculo4,
            codigoMotorista1: pedidoConsultaTMS.dados.pedido.codigoMotorista1,
            codigoMotorista2: pedidoConsultaTMS.dados.pedido.codigoMotorista2,
            nomeMotorista: pedidoConsultaTMS.dados.pedido.nomeMotorista1,
            dataInicioViagem: pedidoMonitoramento.dataInicioViagem || null,
            dataProgramacao: pedidoMonitoramento.dataProgramacao || null,
            dataColeta: pedidoConsultaTMS.dados.pedido.dataRetirada,
            dataPedido: pedidoConsultaTMS.dados.pedido.dataPedido,

            nomeFilial: pedidoConsultaTMS.dados.pedido.nomeFilial,
            codigoTomador: pedidoConsultaTMS.dados.pedido.codigoTomador,
            nomeTomador: pedidoConsultaTMS.dados.pedido.nomeTomador,
            codigoRemetente: pedidoConsultaTMS.dados.pedido.codigoRemetente,
            nomeRemetente: pedidoConsultaTMS.dados.pedido.nomeRemetente,
            codigoDestinatario: pedidoConsultaTMS.dados.pedido.codigoDestinatario,
            nomeDestinatario: pedidoConsultaTMS.dados.pedido.nomeDestinatario,
      
            codigoLinhaTrecho: pedidoMonitoramento.codigoLinhaTrecho || null,
            codigoLocalColeta: pedidoMonitoramento.codigoLocalColeta || null,
            nomeLocalColeta: pedidoMonitoramento.nomeLocalColeta || null,
            latitudeLocalColeta: pedidoMonitoramento.latitudeLocalColeta || null,
            longitudeLocalColeta: pedidoMonitoramento.longitudeLocalColeta || null,
            raioMetrosLocalColeta: pedidoMonitoramento.raioMetrosLocalColeta || null,
            codigoLocalEntrega: pedidoMonitoramento.codigoLocalEntrega || null,
            nomeLocalEntrega: pedidoMonitoramento.nomeLocalEntrega || null,
            latitudeLocalEntrega: pedidoMonitoramento.latitudeLocalEntrega || null,
            longitudeLocalEntrega: pedidoMonitoramento.longitudeLocalEntrega || null,
            raioMetrosLocalEntrega: pedidoMonitoramento.raioMetrosLocalEntrega || null,
            dataEntrega: pedidoMonitoramento.dataEntrega || null,

            tipoMonitoramento: pedidoMonitoramento.tipoMonitoramento,
            statusMonitoramento: 'DISPONIVEL_MONITORAMENTO',
            qtdeAtualizacoes: 1
          }

          filtro = {
            numeroPedido: pedidoEditado.numeroPedido,
            codigoFilial: pedidoEditado.codigoFilial
          }

          try {
            await repositorio.alterar(filtro, pedidoEditado)
          }
          catch (error) {
            console.log('---Ocorreu erro ao alterar pedido: ', error)
          }
        }
      }
    }
    catch (error) {
      console.log('---Ocorreu erro ao consultar pedido: ', error)
    }
  }

  console.log('---Etapa 1 Finalizada: Pendentes Informação (Novos/Alocação)')
  console.log()

  /// VARRER PEDIDOS PARA MONITORAMENTO COMPLEMENTANDO INFORMAÇÕES ADICIONAIS
  /// PEDIDOS QUE AINDA NÃO SOFRERAM NENHUMA ATUALIZAÇÃO (STATUS = PENDENTE_INFORMACAO)
  /// *******************************************************************************************
  const pedidosPendenteInformacaoEmViagem = await (await repositorio.listarPendentesInformacaoEmViagem()).dados

  for (let i = 0; i < pedidosPendenteInformacaoEmViagem.length; i++) {

    pedidoMonitoramento = pedidosPendenteInformacaoEmViagem[i]

    reqPedido = {
      query: {
        numeroPedido: pedidoMonitoramento.numeroPedido,
        codigoFilial: pedidoMonitoramento.codigoFilial
      }
    }

    console.log('---ATUALIZA PEDIDO ==> ', reqPedido.query.numeroPedido, ' / ', reqPedido.query.codigoFilial)

    try {
      pedidoConsultaTMS = await pedidoServico.obter(reqPedido)

      if (pedidoConsultaTMS != null) {

        // Se o Pedido não foi retornado na consulta do TMS, ele será FINALIZADO para Monitoramento
        // *****************************************************************************
        if (!pedidoConsultaTMS.dados) {
          await finalizarMonitoramentoPedido(pedidoMonitoramento)
        }
        else {
          pedidoEditado = {
            numeroPedido: pedidoMonitoramento.numeroPedido,
            codigoFilial: pedidoMonitoramento.codigoFilial,
            codigoPedido: pedidoMonitoramento.codigoPedido,
            codigoFilialPedido: pedidoMonitoramento.codigoFilialPedido,
            codigoAgrupadorTorre: pedidoMonitoramento.codigoAgrupadorTorre,

            // DADOS DO TMS
            statusPedido: pedidoMonitoramento.statusPedido || null,
            codigoPlacaVeiculo: pedidoMonitoramento.codigoPlacaVeiculo || null,
            placaVeiculo: pedidoMonitoramento.placaVeiculo || null,
            codigoPlacaVeiculo2: pedidoMonitoramento.codigoPlacaVeiculo2 || null,
            placaVeiculo2: pedidoMonitoramento.placaVeiculo2 || null,
            codigoPlacaVeiculo3: pedidoMonitoramento.codigoPlacaVeiculo3 || null,
            placaVeiculo3: pedidoMonitoramento.placaVeiculo3 || null,
            codigoPlacaVeiculo4: pedidoMonitoramento.codigoPlacaVeiculo4 || null,
            placaVeiculo4: pedidoMonitoramento.placaVeiculo4 || null,
            codigoMotorista1: pedidoMonitoramento.codigoMotorista1 || null,
            codigoMotorista2: pedidoMonitoramento.codigoMotorista2 || null,
            nomeMotorista: pedidoMonitoramento.nomeMotorista || null,
            dataInicioViagem: pedidoMonitoramento.dataInicioViagem || null,
            dataProgramacao: pedidoMonitoramento.dataProgramacao || null,
            dataColeta: pedidoMonitoramento.dataColeta || null,
            dataPedido: pedidoMonitoramento.dataPedido || null,

            nomeFilial: pedidoConsultaTMS.dados.pedido.nomeFilial,
            codigoTomador: pedidoConsultaTMS.dados.pedido.codigoTomador,
            nomeTomador: pedidoConsultaTMS.dados.pedido.nomeTomador,
            codigoRemetente: pedidoConsultaTMS.dados.pedido.codigoRemetente,
            nomeRemetente: pedidoConsultaTMS.dados.pedido.nomeRemetente,
            codigoDestinatario: pedidoConsultaTMS.dados.pedido.codigoDestinatario,
            nomeDestinatario: pedidoConsultaTMS.dados.pedido.nomeDestinatario,
      
            codigoLinhaTrecho: pedidoMonitoramento.codigoLinhaTrecho || null,
            codigoLocalColeta: pedidoMonitoramento.codigoLocalColeta || null,
            nomeLocalColeta: pedidoMonitoramento.nomeLocalColeta || null,
            latitudeLocalColeta: pedidoMonitoramento.latitudeLocalColeta || null,
            longitudeLocalColeta: pedidoMonitoramento.longitudeLocalColeta || null,
            raioMetrosLocalColeta: pedidoMonitoramento.raioMetrosLocalColeta || null,
            codigoLocalEntrega: pedidoMonitoramento.codigoLocalEntrega || null,
            nomeLocalEntrega: pedidoMonitoramento.nomeLocalEntrega || null,
            latitudeLocalEntrega: pedidoMonitoramento.latitudeLocalEntrega || null,
            longitudeLocalEntrega: pedidoMonitoramento.longitudeLocalEntrega || null,
            raioMetrosLocalEntrega: pedidoMonitoramento.raioMetrosLocalEntrega || null,
            dataEntrega: pedidoMonitoramento.dataEntrega || null,

            tipoMonitoramento: pedidoMonitoramento.tipoMonitoramento,
            statusMonitoramento: 'DISPONIVEL_MONITORAMENTO',
            qtdeAtualizacoes: 1
          }

          filtro = {
            numeroPedido: pedidoEditado.numeroPedido,
            codigoFilial: pedidoEditado.codigoFilial
          }

          try {
            await repositorio.alterar(filtro, pedidoEditado)
          }
          catch (error) {
            console.log('---Ocorreu erro ao alterar pedido: ', error)
          }
        }
      }
    }
    catch (error) {
      console.log('---Ocorreu erro ao consultar pedido: ', error)
    }
  }

  console.log('---Etapa 2 Finalizada: Pendentes Informação (Em Viagem)')
  console.log()

  /// VARRER PEDIDOS PARA MONITORAMENTO COMPLEMENTANDO INFORMAÇÕES ADICIONAIS
  /// PEDIDOS QUE JÁ TIVERAM AO MENOS UMA ATUALIZAÇÃO (STATUS = DISPONIVEL_MONITORAMENTO)
  /// SERÃO RETORNADOS PRIMEIRO OS QUE TEM 'MENOS' ATUALIZAÇÕES, E POR ÚLTIMOS OS QUE TEM 'MAIS' ATUALIZAÇÕES
  /// *******************************************************************************************
  const pedidosDisponiveisParaMonitoramentoNovosEmAlocacao = await (await repositorio.listarDisponiveisMonitoramentoNovosEmAlocacaoMaisAntigos()).dados

  for (let i = 0; i < pedidosDisponiveisParaMonitoramentoNovosEmAlocacao.length; i++) {

    pedidoMonitoramento = pedidosDisponiveisParaMonitoramentoNovosEmAlocacao[i]

    reqPedido = {
      query: {
        numeroPedido: pedidoMonitoramento.numeroPedido,
        codigoFilial: pedidoMonitoramento.codigoFilial
      }
    }

    console.log('---ATUALIZA PEDIDO ==> ', reqPedido.query.numeroPedido, ' / ', reqPedido.query.codigoFilial)

    try {
      pedidoConsultaTMS = await pedidoServico.obter(reqPedido)

      if (pedidoConsultaTMS != null) {

        // Se o Pedido não foi retornado na consulta do TMS, ele será FINALIZADO para Monitoramento
        // Ele também será FINALIZADO para Monitoramento, caso não apresente qualquer uma das
        // três situações: NOVO / COM ALOCACAO / EM VIAGEM
        // *****************************************************************************
        if (!pedidoConsultaTMS.dados) {
          await finalizarMonitoramentoPedido(pedidoMonitoramento)
        }
        else if (pedidoConsultaTMS.dados.pedido.statusPedidoTorre !== 'NOVO' &&
            pedidoConsultaTMS.dados.pedido.statusPedidoTorre !== 'COM ALOCACAO' &&
            pedidoConsultaTMS.dados.pedido.statusPedidoTorre !== 'EM VIAGEM') {

          await finalizarMonitoramentoPedido(pedidoMonitoramento)
        }
        else {
          pedidoEditado = {
            numeroPedido: pedidoMonitoramento.numeroPedido,
            codigoFilial: pedidoMonitoramento.codigoFilial,
            codigoPedido: pedidoMonitoramento.codigoPedido,
            codigoFilialPedido: pedidoMonitoramento.codigoFilialPedido,
            codigoAgrupadorTorre: pedidoMonitoramento.codigoAgrupadorTorre || null,

            // DADOS DO TMS
            statusPedido: pedidoConsultaTMS.dados.pedido.statusPedidoTorre,
            codigoPlacaVeiculo: pedidoConsultaTMS.dados.pedido.codigoPlacaVeiculo,
            placaVeiculo: pedidoConsultaTMS.dados.pedido.placaVeiculo,
            codigoPlacaVeiculo2: pedidoConsultaTMS.dados.pedido.codigoPlacaVeiculo2,
            placaVeiculo2: pedidoConsultaTMS.dados.pedido.placaVeiculo2,
            codigoPlacaVeiculo3: pedidoConsultaTMS.dados.pedido.codigoPlacaVeiculo3,
            placaVeiculo3: pedidoConsultaTMS.dados.pedido.placaVeiculo3,
            codigoPlacaVeiculo4: pedidoConsultaTMS.dados.pedido.codigoPlacaVeiculo4,
            placaVeiculo4: pedidoConsultaTMS.dados.pedido.placaVeiculo4,
            codigoMotorista1: pedidoConsultaTMS.dados.pedido.codigoMotorista1,
            codigoMotorista2: pedidoConsultaTMS.dados.pedido.codigoMotorista2,
            nomeMotorista: pedidoConsultaTMS.dados.pedido.nomeMotorista1,
            dataInicioViagem: pedidoMonitoramento.dataInicioViagem || null,
            dataProgramacao: pedidoMonitoramento.dataProgramacao || null,
            dataColeta: pedidoConsultaTMS.dados.pedido.dataRetirada,
            dataPedido: pedidoConsultaTMS.dados.pedido.dataPedido,

            nomeFilial: pedidoConsultaTMS.dados.pedido.nomeFilial,
            codigoTomador: pedidoConsultaTMS.dados.pedido.codigoTomador,
            nomeTomador: pedidoConsultaTMS.dados.pedido.nomeTomador,
            codigoRemetente: pedidoConsultaTMS.dados.pedido.codigoRemetente,
            nomeRemetente: pedidoConsultaTMS.dados.pedido.nomeRemetente,
            codigoDestinatario: pedidoConsultaTMS.dados.pedido.codigoDestinatario,
            nomeDestinatario: pedidoConsultaTMS.dados.pedido.nomeDestinatario,
      
            codigoLinhaTrecho: pedidoMonitoramento.codigoLinhaTrecho || null,
            codigoLocalColeta: pedidoMonitoramento.codigoLocalColeta || null,
            nomeLocalColeta: pedidoMonitoramento.nomeLocalColeta || null,
            latitudeLocalColeta: pedidoMonitoramento.latitudeLocalColeta || null,
            longitudeLocalColeta: pedidoMonitoramento.longitudeLocalColeta || null,
            raioMetrosLocalColeta: pedidoMonitoramento.raioMetrosLocalColeta || null,
            codigoLocalEntrega: pedidoMonitoramento.codigoLocalEntrega || null,
            nomeLocalEntrega: pedidoMonitoramento.nomeLocalEntrega || null,
            latitudeLocalEntrega: pedidoMonitoramento.latitudeLocalEntrega || null,
            longitudeLocalEntrega: pedidoMonitoramento.longitudeLocalEntrega || null,
            raioMetrosLocalEntrega: pedidoMonitoramento.raioMetrosLocalEntrega || null,
            dataEntrega: pedidoMonitoramento.dataEntrega || null,
        
            tipoMonitoramento: pedidoMonitoramento.tipoMonitoramento,
            statusMonitoramento: 'DISPONIVEL_MONITORAMENTO',
            qtdeAtualizacoes: pedidoMonitoramento.qtdeAtualizacoes + 1
          }

          filtro = {
            numeroPedido: pedidoEditado.numeroPedido,
            codigoFilial: pedidoEditado.codigoFilial
          }

          try {
            await repositorio.alterar(filtro, pedidoEditado)
          }
          catch (error) {
            console.log('---Ocorreu erro ao alterar pedido: ', error)
          }
        }
      }
    }
    catch (error) {
      console.log('---Ocorreu erro ao consultar pedido: ', error)
    }
  }

  console.log('---Etapa 3 Finalizada: Disponíveis Monitoramento (Novos/Alocação)')
  console.log()

  /// VARRER PEDIDOS PARA MONITORAMENTO COMPLEMENTANDO INFORMAÇÕES ADICIONAIS
  /// PEDIDOS QUE JÁ TIVERAM AO MENOS UMA ATUALIZAÇÃO (STATUS = DISPONIVEL_MONITORAMENTO)
  /// SERÃO RETORNADOS PRIMEIRO OS QUE TEM 'MENOS' ATUALIZAÇÕES, E POR ÚLTIMOS OS QUE TEM 'MAIS' ATUALIZAÇÕES
  /// *******************************************************************************************
  const pedidosDisponiveisParaMonitoramentoEmViagem = await (await repositorio.listarDisponiveisMonitoramentoEmViagemMaisAntigos()).dados

  for (let i = 0; i < pedidosDisponiveisParaMonitoramentoEmViagem.length; i++) {

    pedidoMonitoramento = pedidosDisponiveisParaMonitoramentoEmViagem[i]

    reqPedido = {
      query: {
        numeroPedido: pedidoMonitoramento.numeroPedido,
        codigoFilial: pedidoMonitoramento.codigoFilial
      }
    }

    console.log('---ATUALIZA PEDIDO ==> ', reqPedido.query.numeroPedido, ' / ', reqPedido.query.codigoFilial)

    try {
      pedidoConsultaTMS = await pedidoServico.obter(reqPedido)

      if (pedidoConsultaTMS != null) {

        // Se o Pedido não foi retornado na consulta do TMS, ele será FINALIZADO para Monitoramento
        // Ele também será FINALIZADO para Monitoramento, caso não apresente qualquer uma das
        // três situações: NOVO / COM ALOCACAO / EM VIAGEM
        // *****************************************************************************
        if (!pedidoConsultaTMS.dados) {
          await finalizarMonitoramentoPedido(pedidoMonitoramento)
        }
        else if (pedidoConsultaTMS.dados.pedido.statusPedidoTorre !== 'NOVO' &&
            pedidoConsultaTMS.dados.pedido.statusPedidoTorre !== 'COM ALOCACAO' &&
            pedidoConsultaTMS.dados.pedido.statusPedidoTorre !== 'EM VIAGEM') {

          await finalizarMonitoramentoPedido(pedidoMonitoramento)
        }
        else {
          pedidoEditado = {
            numeroPedido: pedidoMonitoramento.numeroPedido,
            codigoFilial: pedidoMonitoramento.codigoFilial,
            codigoPedido: pedidoMonitoramento.codigoPedido,
            codigoFilialPedido: pedidoMonitoramento.codigoFilialPedido,
            codigoAgrupadorTorre: pedidoMonitoramento.codigoAgrupadorTorre || null,

            // DADOS DO TMS
            statusPedido: pedidoMonitoramento.statusPedido || null,
            codigoPlacaVeiculo: pedidoMonitoramento.codigoPlacaVeiculo || null,
            placaVeiculo: pedidoMonitoramento.placaVeiculo || null,
            codigoPlacaVeiculo2: pedidoMonitoramento.codigoPlacaVeiculo2 || null,
            placaVeiculo2: pedidoMonitoramento.placaVeiculo2 || null,
            codigoPlacaVeiculo3: pedidoMonitoramento.codigoPlacaVeiculo3 || null,
            placaVeiculo3: pedidoMonitoramento.placaVeiculo3 || null,
            codigoPlacaVeiculo4: pedidoMonitoramento.codigoPlacaVeiculo4 || null,
            placaVeiculo4: pedidoMonitoramento.placaVeiculo4 || null,
            codigoMotorista1: pedidoMonitoramento.codigoMotorista1 || null,
            codigoMotorista2: pedidoMonitoramento.codigoMotorista2 || null,
            nomeMotorista: pedidoMonitoramento.nomeMotorista || null,
            dataInicioViagem: pedidoMonitoramento.dataInicioViagem || null,
            dataProgramacao: pedidoMonitoramento.dataProgramacao || null,
            dataColeta: pedidoMonitoramento.dataColeta || null,
            dataPedido: pedidoMonitoramento.dataPedido || null,

            nomeFilial: pedidoConsultaTMS.dados.pedido.nomeFilial,
            codigoTomador: pedidoConsultaTMS.dados.pedido.codigoTomador,
            nomeTomador: pedidoConsultaTMS.dados.pedido.nomeTomador,
            codigoRemetente: pedidoConsultaTMS.dados.pedido.codigoRemetente,
            nomeRemetente: pedidoConsultaTMS.dados.pedido.nomeRemetente,
            codigoDestinatario: pedidoConsultaTMS.dados.pedido.codigoDestinatario,
            nomeDestinatario: pedidoConsultaTMS.dados.pedido.nomeDestinatario,
      
            codigoLinhaTrecho: pedidoMonitoramento.codigoLinhaTrecho || null,
            codigoLocalColeta: pedidoMonitoramento.codigoLocalColeta || null,
            nomeLocalColeta: pedidoMonitoramento.nomeLocalColeta || null,
            latitudeLocalColeta: pedidoMonitoramento.latitudeLocalColeta || null,
            longitudeLocalColeta: pedidoMonitoramento.longitudeLocalColeta || null,
            raioMetrosLocalColeta: pedidoMonitoramento.raioMetrosLocalColeta || null,
            codigoLocalEntrega: pedidoMonitoramento.codigoLocalEntrega || null,
            nomeLocalEntrega: pedidoMonitoramento.nomeLocalEntrega || null,
            latitudeLocalEntrega: pedidoMonitoramento.latitudeLocalEntrega || null,
            longitudeLocalEntrega: pedidoMonitoramento.longitudeLocalEntrega || null,
            raioMetrosLocalEntrega: pedidoMonitoramento.raioMetrosLocalEntrega || null,
            dataEntrega: pedidoMonitoramento.dataEntrega || null,
        
            tipoMonitoramento: pedidoMonitoramento.tipoMonitoramento,
            statusMonitoramento: 'DISPONIVEL_MONITORAMENTO',
            qtdeAtualizacoes: pedidoMonitoramento.qtdeAtualizacoes + 1
          }

          filtro = {
            numeroPedido: pedidoEditado.numeroPedido,
            codigoFilial: pedidoEditado.codigoFilial
          }

          try {
            await repositorio.alterar(filtro, pedidoEditado)
          }
          catch (error) {
            console.log('---Ocorreu erro ao alterar pedido: ', error)
          }
        }
      }
    }
    catch (error) {
      console.log('---Ocorreu erro ao consultar pedido: ', error)
    }
  }

  console.log('---Etapa 4 Finalizada: Disponíveis Monitoramento (Em Viagem)')
  console.log()

  const delay = ms => new Promise(res => setTimeout(res, ms))

  // Esta etapa se refere à trazer do TMS algumas informações sobre Linha/Trecho para
  // dentro do MongoDB, evitando assim, consumos excessivos do TMS quando da execução
  // do Monitoramento de fato.
  // ********************************************************************************
  const linhas = await repositorio.listarLinhasTrecho()

  linhas.map(async linha => {

    if (linha !== null) {

      const linhaUpper = linha.toUpperCase()

      await delay(300)

      try {
        await repositorioCheckpoint.excluirCheckpointsPorLinha(linhaUpper)
      }
      catch (error) {
        console.log('---Ocorreu erro ao excluir checkpoints: ', error)
      }

      const reqLinha = {
        query: {
          codigoLinha: linhaUpper
        }
      }
      
      let checkpoints = []
      try {
        checkpoints = (await mapaSinoticoServico.listarCheckpoints(reqLinha)).dados
      }
      catch (error) {
        console.log('---Ocorreu erro ao obter checkpoints: ', error)
      }

      checkpoints.map(async checkpoint => {

        try {
          await repositorioCheckpoint.incluir(checkpoint)
        }
        catch (error) {
          console.log('---Ocorreu erro ao inserir checkpoints: ', linhaUpper)
        }
      })
    }
  })

  console.log('---Etapa 5 Finalizada: Checkpoints')
  console.log()

}

const functions = {
  monitorarOperacaoDiario: () => monitorarOperacaoDiario(),
  monitorarOperacao: () => monitorarOperacao(),
  monitorarPedidosEmViagem: () => monitorarPedidosEmViagem(),
  monitorarPedidosNovosAndEmAlocacao: () => monitorarPedidosNovosAndEmAlocacao(),
  obterPedidosParaMonitoramento: () => obterPedidosParaMonitoramento(),
  atualizarPedidosParaMonitoramento: () => atualizarPedidosParaMonitoramento()
}


export default functions
