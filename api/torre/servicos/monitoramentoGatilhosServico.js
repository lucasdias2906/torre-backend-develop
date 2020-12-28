// import ocorrenciaServico from './ocorrenciaServico'
import moment from 'moment'
import rastreadorServico from './rastreadorServico'
import mapaSinoticoServico from './mapaSinoticoServico'
import ocorrenciaServico from './ocorrenciaServico'
import enums from '../modelos/_enums'
import util from '../funcoes/utilitarios'

// Funções PRIVADAS
// **************************************************************************************

function formatarDataMoment(pData) {
  return pData.format('DD/MM/YYYY HH:mm')
}

function formatarData(pData) {
  return moment(pData).format('DD/MM/YYYY HH:mm')
}

async function salvarOcorrencia(
  tipoOcorrenciaCodigo,
  pedido,
  informacoesAdicionais,
  proximaEtapa,
) {
  await ocorrenciaServico.incluirOcorrenciaAutomatica(
    tipoOcorrenciaCodigo,
    pedido.numeroPedido,
    pedido.codigoFilial,
    informacoesAdicionais,
    proximaEtapa ? proximaEtapa : null    
  )
}

async function salvarOcorrenciaVeiculo(
  tipoOcorrenciaCodigo,
  veiculo,
  informacoesAdicionais,
) {
  await ocorrenciaServico.incluirOcorrenciaAutomaticaVeiculo(
    tipoOcorrenciaCodigo,
    veiculo.codigoVeiculo,
    informacoesAdicionais,
  )
}

async function salvarOcorrenciaMotorista(
  tipoOcorrenciaCodigo,
  motorista,
  informacoesAdicionais,
) {
  await ocorrenciaServico.incluirOcorrenciaAutomaticaMotorista(
    tipoOcorrenciaCodigo,
    motorista.codigoMotorista,
    informacoesAdicionais,
  )
}


async function estahContidoNoPoligono(proximaEtapa) {
  return mapaSinoticoServico.ultimaPosicaoEstahContidaNoPoligono(proximaEtapa.idMapaSinotico, proximaEtapa.idProximaEtapa)
}

async function estahAtrasadoNaChegadaAoPoligono(
  proximaEtapa,
  previsaoChegada,
  tipoPoligonoParaAveriguacao,
  posicaoAtual,
) {
  const semAtraso = { atraso: false }

  if (proximaEtapa.tipo !== 'POLIGONO') return semAtraso

  if (proximaEtapa.dataEntrada) return semAtraso // se já entrou não precisa mais sinalizar que está atrasado

  if (proximaEtapa.tipoPoligono !== tipoPoligonoParaAveriguacao) return semAtraso

  if (!previsaoChegada) return semAtraso

  const duracaoEstimada = previsaoChegada.duracaoEmSegundos

  const dt = new Date()
  dt.setSeconds(dt.getSeconds() + duracaoEstimada)

  const chegadaEstimada = dt

  // ATUALIZAR PREVISÃO DE CHEGADA EM ETAPA DO MAPA SINÓTICO
  await mapaSinoticoServico.registrarPrevisaoChegadaAoPoligono(proximaEtapa.idProximaEtapa, chegadaEstimada)

  // // Recalcula a previsão de chagada em todas as etapas do mapa
  // await mapaSinoticoServico.recalculaPrevisaoTodasEtapas(proximaEtapa.idMapaSinotico, posicaoAtual)

  if (proximaEtapa.chegadaPlanejada > chegadaEstimada) return semAtraso

  var ms = moment(chegadaEstimada, 'DD/MM/YYYY HH:mm:ss').diff(
    moment(previsaoChegada.horaEstimada, 'DD/MM/YYYY HH:mm:ss')
  )

  var d = moment.duration(ms)

  var tempoEstimado = Math.abs(Math.floor(d.asHours())) + moment.utc(ms).format(':mm')

  return {
    atraso: true,
    informacoesAdicionais:
    {
      novaPrevisaoChegada: chegadaEstimada,
      tempoEstimado: tempoEstimado
    }
  }
}

async function entrouNoPoligono(
  proximaEtapa,
  tipoPoligonoParaAveriguacao,
) {
  const naoEntrou = { entrou: false }

  if (proximaEtapa.tipo !== 'POLIGONO') return naoEntrou

  if (proximaEtapa.tipoPoligono !== tipoPoligonoParaAveriguacao) return naoEntrou

  if (proximaEtapa.dataEntrada) return naoEntrou

  const contidoNoPoligono = await estahContidoNoPoligono(proximaEtapa)

  if (!contidoNoPoligono) return naoEntrou

  return {
    entrou: true,
    informacoesAdicionais:
    {
      dataHoraEntradaEfetiva: util.obterDataCorrente(),
    }
  }
}

async function excedeuTempoNoPoligono(
  proximaEtapa,
  posicaoAtual,
  tipoPoligonoParaAveriguacao,
) {
  const naoExcedeu = { excedeu: false }

  if (proximaEtapa.tipo !== 'POLIGONO') return naoExcedeu

  if (proximaEtapa.tipoPoligono !== tipoPoligonoParaAveriguacao) return naoExcedeu

  if (!proximaEtapa.dataEntrada) return naoExcedeu

  if (proximaEtapa.dataSaida) return naoExcedeu

  if (!proximaEtapa.dataHoraPrevisaoSaida) return naoExcedeu

  const dataCorrente = util.obterDataCorrente()

  if (proximaEtapa.dataHoraPrevisaoSaida > dataCorrente) return naoExcedeu

  const contidoNoPoligono = await estahContidoNoPoligono(proximaEtapa, posicaoAtual)

  if (!contidoNoPoligono) return naoExcedeu

  return {
    excedeu: true,
    informacoesAdicionais:
    {
      dataHoraPrevisaoSaida: formatarDataMoment(moment(proximaEtapa.dataHoraPrevisaoSaida))
    }
  }
}

async function saiuDoPoligono(
  proximaEtapa,
  posicaoAtual,
  tipoPoligonoParaAveriguacao,
) {
  const naoSaiu = { saiu: false }

  if (proximaEtapa.tipo !== 'POLIGONO') return naoSaiu

  if (proximaEtapa.tipoPoligono !== tipoPoligonoParaAveriguacao) return naoSaiu

  if (!proximaEtapa.dataEntrada) return naoSaiu

  if (proximaEtapa.dataSaida) return naoSaiu

  const contidoNoPoligono = await estahContidoNoPoligono(proximaEtapa, posicaoAtual)

  if (contidoNoPoligono) return naoSaiu

  return {
    saiu: true,
    informacoesAdicionais:
    {
      dataHoraSaidaEfetiva: util.obterDataCorrente(),
    }
  }
}

function passouCheckpoint(
  proximaEtapa,
  proximaDaProximaEtapa,
  posicaoAtual,
  tipoPoligonoParaAveriguacao,
) {
  const naoPassou = { naoPassou: false }

  if (proximaEtapa.poligono.tipo !== tipoPoligonoParaAveriguacao) return naoPassou

  const vPassouCheckpoint = mapaSinoticoServico.passouCheckpoint(posicaoAtual, proximaEtapa.posicao, proximaDaProximaEtapa.posicao)
  if (!vPassouCheckpoint) return naoPassou

  return {
    passou: true,
    informacoesAdicionais:
    {
      dataHoraPassagemEfetiva: util.obterDataCorrente(),
    }
  }
}

function obterParametro(pParametros, pOcorrenciaTipoCodigo, pParametroNome) {
  // const vRetorno = pParametros.filter((item) => item.ocorrenciaTipoCodigo === pOcorrenciaTipoCodigo && item.nome === pParametroNome)
  const vRetorno = pParametros.filter((item) => item.codigo === pParametroNome)
  if (vRetorno.length > 0) return vRetorno[0].valor
  return null
}

// Funções PÚBLICAS
// **************************************************************************************
// Tipo de Ocorrência - Alocação Veículo/Motorista realizado no Pedido dentro do prazo
// Objetivo - Gerado quando a alocação do pedido ocorre dentro do prazo conforme parâmetros
async function monitorarAlocacaoPedidoDentroPrazo(pedido, parametros) {
  const prazoAlocacaoVeiculoAposFeitoPedido = obterParametro(parametros, enums.OCORRENCIA.ALOCACAO_VEICULO_MOTORISTA_DENTRO_PRAZO, 'PRAZO_ALOCACAO_VEICULO_APOS_FEITO_PEDIDO')
  if (!prazoAlocacaoVeiculoAposFeitoPedido) return 'PARAMETROS_INSUFICIENTES'
  const prazoVerificacaoAlocacaoVeiculo = obterParametro(parametros, enums.OCORRENCIA.ALOCACAO_VEICULO_MOTORISTA_DENTRO_PRAZO, 'PRAZO_VERIFICACAO_ALOCACAO_VEICULO')
  if (!prazoVerificacaoAlocacaoVeiculo) return 'PARAMETROS_INSUFICIENTES'

  let { statusPedido, dataInicioViagem, dataProgramacao, dataPedido, dataColeta } = pedido

  dataInicioViagem = moment(dataInicioViagem)
  dataProgramacao = moment(dataProgramacao)
  dataPedido = moment(dataPedido)
  dataColeta = moment(dataColeta)

  // Status do Pedido deve ser em alocação
  if (statusPedido !== 'COM_ALOCACAO') return 'STATUS_NAO_ALOCACAO'

  // Desconsiderar Pedidos que ainda não existam PVs
  if (!dataProgramacao) return 'PEDIDO_SEM_DATAPROGRAMACAO'

  // Desconsiderar Pedidos que não possuem Data de Início de Viagem
  if (!dataInicioViagem) return 'Sem data Início Viagem'

  // Desconsiderar Pedidos que não possuem Data de Início de Viagem
  if (!dataColeta) return 'SEM_DATA'

  // Considerar como exemplo, 48 horas de prazo para verificação de alocação
  // Pedidos que iniciam Viagem nas próximas 48 Horas deverão ser verificados
  const dataLimiteVerificaAlocacaoVeiculo = moment(dataColeta).subtract(prazoVerificacaoAlocacaoVeiculo, 'hours')
  if (util.obterDataCorrente() < dataLimiteVerificaAlocacaoVeiculo) return 'FORA_DO_PRAZO_VERIFICACAO'

  // Considerar como exemplo, 2 horas de prazo para alocação
  const dataLimiteAlocacaoVeiculo = moment(dataPedido).add(prazoAlocacaoVeiculoAposFeitoPedido, 'hours')
  if (dataProgramacao > dataLimiteAlocacaoVeiculo) return 'PEDIDO_NAO_ESTA_DENTRO_PRAZO'

  // Desconsiderar Pedidos que foram Programados FORA DO PRAZO ESTABELECIDO
  // if (dataProgramacao > dataLimiteAlocacaoVeiculo) return 'fora do prazo'
  const informacoesAdicionais = {
    dataColeta: formatarDataMoment(dataColeta),
    dataInicioViagem: formatarDataMoment(dataInicioViagem),
    dataLimiteProgramacao: formatarDataMoment(dataLimiteAlocacaoVeiculo),
    dataEfetivaProgramacao: formatarDataMoment(dataProgramacao),
  }

  await salvarOcorrencia(enums.OCORRENCIA.ALOCACAO_VEICULO_MOTORISTA_DENTRO_PRAZO, pedido, informacoesAdicionais)
  return 'OK'
}

// **************************************************************************************
// Tipo de Ocorrência - Alocação Veículo/Motorista realizado no Pedido fora do prazo - tempo excedido
// Objetivo - Alocação Veículo/Motorista no Pedido não realizada - tempo excedido
async function monitorarAlocacaoPedidoTempoExcedido(pedido, parametros) {
  const prazoAlocacaoVeiculoAposFeitoPedido = obterParametro(parametros, enums.OCORRENCIA.ALOCACAO_VEICULO_MOTORISTA_TEMPO_EXCEDIDO, 'PRAZO_ALOCACAO_VEICULO_APOS_FEITO_PEDIDO')
  if (!prazoAlocacaoVeiculoAposFeitoPedido) return 'PARAMETROS_INSUFICIENTES'
  const prazoVerificacaoAlocacaoVeiculo = obterParametro(parametros, enums.OCORRENCIA.ALOCACAO_VEICULO_MOTORISTA_TEMPO_EXCEDIDO, 'PRAZO_VERIFICACAO_ALOCACAO_VEICULO')
  if (!prazoVerificacaoAlocacaoVeiculo) return 'PARAMETROS_INSUFICIENTES'

  let { statusPedido, dataInicioViagem, dataProgramacao, dataPedido, dataColeta } = pedido

  dataInicioViagem = moment(dataInicioViagem)
  dataProgramacao = moment(dataProgramacao)
  dataPedido = moment(dataPedido)
  dataColeta = moment(dataColeta)

  // Considerar somente pedidos NOVOS que não foram alocados ainda
  if (statusPedido !== 'NOVO') return 'PEDIDO_STATUS_DEVE_SER_NOVO'

  // Desconsiderar Pedidos sem Data Pedido
  if (!dataPedido) return 'SEM_DATA_PEDIDO'

  // Desconsiderar Pedidos que ainda não existam PVs
  if (!dataProgramacao) return 'SEM_DATA_PROGRAMACAO'

  // Considerar como exemplo, 48 horas de prazo para verificação de alocação
  // Pedidos que iniciam Viagem nas próximas 48 Horas deverão ser verificados
  const dataLimiteVerificaAlocacaoVeiculo = moment(dataColeta).subtract(prazoVerificacaoAlocacaoVeiculo, 'hours')
  if (util.obterDataCorrente() < dataLimiteVerificaAlocacaoVeiculo) return 'FORA_DO_PRAZO_VERIFICACAO'

  // Considerar como exemplo, 2 horas de prazo para alocação
  const dataLimiteAlocacaoVeiculo = moment(dataPedido).add(prazoAlocacaoVeiculoAposFeitoPedido, 'hours')
  if (util.obterDataCorrente() < dataLimiteAlocacaoVeiculo) return 'PEDIDO_ESTA_DENTRO_PRAZO'

  const informacoesAdicionais = {
    tempoExcedido: true,
    dataColeta: formatarDataMoment(dataColeta),
    dataInicioViagem: formatarDataMoment(dataInicioViagem),
    dataLimiteProgramacao: formatarDataMoment(dataLimiteAlocacaoVeiculo),
    dataEfetivaProgramacao: formatarDataMoment(dataProgramacao)
  }

  await salvarOcorrencia(enums.OCORRENCIA.ALOCACAO_VEICULO_MOTORISTA_TEMPO_EXCEDIDO, pedido, informacoesAdicionais)

  return 'OK'
}

// **************************************************************************************
// Tipo de Ocorrência - Confirmação de Alocação para o Pedido
// Objetivo - Confirmação de Alocação para o Pedido
async function monitorarConfirmacaoAlocacaoParaPedido(pedido, parametros) {

  let { statusPedido, dataInicioViagem, dataProgramacao, dataPedido, dataColeta } = pedido

  dataInicioViagem = moment(dataInicioViagem)
  dataProgramacao = moment(dataProgramacao)
  dataPedido = moment(dataPedido)
  dataColeta = moment(dataColeta)

  // Considerar somente pedidos COM_ALOCACAO que não foram alocados
  if (statusPedido !== 'COM_ALOCACAO') return 'STATUS_DEVE_SER_COM_ALOCACAO'

  // Desconsiderar Pedidos sem Data Pedido
  if (!dataPedido) return 'SEM_DATA_PEDIDO'

  // Desconsiderar Pedidos que ainda não existam PVs
  if (!dataProgramacao) return 'SEM_DATA_PROGRAMACAO'

  const informacoesAdicionais = {
    tempoExcedido: true,
    dataColeta: formatarDataMoment(dataColeta),
    dataInicioViagem: formatarDataMoment(dataInicioViagem),
    dataLimiteProgramacao: null,
    dataEfetivaProgramacao: formatarDataMoment(dataProgramacao)
  }

  await salvarOcorrencia(enums.OCORRENCIA.CONFIRMACAO_ALOCACAO_PEDIDO, pedido, informacoesAdicionais)

  return 'OK'
}

async function monitorarRastreadorCavaloSemComunicacao(pedido, parametros) {
  const prazoVerificacaoCavalo = obterParametro(parametros, enums.OCORRENCIA.RASTREADOR_CAVALO_SEM_COMUNICACAO, 'PRAZO_VERIFICACAO_CAVALO')
  if (!prazoVerificacaoCavalo) return 'PARAMETROS_INSUFICIENTES'


  const { placaVeiculo } = pedido

  const reqRastreador = { query: { placa: placaVeiculo } }

  const posicaoAtual = await rastreadorServico.listar(reqRastreador)

  const { idRastreador = null, dataHora = null } = posicaoAtual || {}

  const dataHoraUltimaComunicao = dataHora && moment(dataHora)

  const dataLimiteRastreadorSemComunicacao = moment(util.obterDataCorrente()).subtract(prazoVerificacaoCavalo, 'hours')

  // Comunicação do Rastreador ocorreu no Tempo Previsto
  if (idRastreador && dataHoraUltimaComunicao > dataLimiteRastreadorSemComunicacao) return 'COMUNICACAO_CAVALO_OK'

  const informacoesAdicionais = {
    rastreador: idRastreador || 'Não Encontrado',
    ultimaComunicacao: dataHoraUltimaComunicao ? formatarDataMoment(dataHoraUltimaComunicao) : 'Indefinida',
  }

  await salvarOcorrencia(enums.OCORRENCIA.RASTREADOR_CAVALO_SEM_COMUNICACAO, pedido, informacoesAdicionais)

  return 'OK'
}

async function monitorarRastreadorCarretaSemComunicacao(pedido, parametros) {
  const prazoVerificacaoCarreta = obterParametro(parametros, enums.OCORRENCIA.RASTREADOR_CARRETA_SEM_COMUNICACAO, 'PRAZO_VERIFICACAO_CARRETA')
  if (!prazoVerificacaoCarreta) return 'PARAMETROS_INSUFICIENTES'

  const { placaVeiculo2, placaVeiculo3, placaVeiculo4 } = pedido

  const dataLimiteRastreadorSemComunicacao = moment(util.obterDataCorrente()).subtract(prazoVerificacaoCarreta, 'hours')

  let rastreadorSemComunicacao = false

  var informacoesAdicionais = {
    rastreadorVeiculo2: null,
    ultimaComunicacaoVeiculo2: null,
    rastreadorVeiculo3: null,
    ultimaComunicacaoVeiculo3: null,
    rastreadorVeiculo4: null,
    ultimaComunicacaoVeiculo4: null
  }

  if (placaVeiculo2) {
    const reqRastreador = { query: { placa: placaVeiculo2 } }
    const posicaoAtual = await rastreadorServico.listar(reqRastreador)
    const { idRastreador = null, dataHora = null } = posicaoAtual || {}
    const dataHoraUltimaComunicao = dataHora && moment(dataHora)
    if (!idRastreador || dataHoraUltimaComunicao > dataLimiteRastreadorSemComunicacao) {
      rastreadorSemComunicacao = true
      informacoesAdicionais.rastreadorVeiculo2 = idRastreador || 'Não Encontrado'
      informacoesAdicionais.ultimaComunicacaoVeiculo2 = dataHoraUltimaComunicao ? formatarDataMoment(dataHoraUltimaComunicao) : 'Indefinida'
    }
  }

  if (placaVeiculo3) {
    const reqRastreador = { query: { placa: placaVeiculo3 } }
    const posicaoAtual = await rastreadorServico.listar(reqRastreador)
    const { idRastreador = null, dataHora = null } = posicaoAtual || {}
    const dataHoraUltimaComunicao = dataHora && moment(dataHora)
    if (!idRastreador || dataHoraUltimaComunicao > dataLimiteRastreadorSemComunicacao) {
      rastreadorSemComunicacao = true
      informacoesAdicionais.rastreadorVeiculo3 = idRastreador || 'Não Encontrado'
      informacoesAdicionais.ultimaComunicacaoVeiculo3 = dataHoraUltimaComunicao ? formatarDataMoment(dataHoraUltimaComunicao) : 'Indefinida'
    }
  }

  if (placaVeiculo4) {
    const reqRastreador = { query: { placa: placaVeiculo4 } }
    const posicaoAtual = await rastreadorServico.listar(reqRastreador)
    const { idRastreador = null, dataHora = null } = posicaoAtual || {}
    const dataHoraUltimaComunicao = dataHora && moment(dataHora)
    if (!idRastreador || dataHoraUltimaComunicao > dataLimiteRastreadorSemComunicacao) {
      rastreadorSemComunicacao = true
      informacoesAdicionais.rastreadorVeiculo4 = idRastreador || 'Não Encontrado'
      informacoesAdicionais.ultimaComunicacaoVeiculo4 = dataHoraUltimaComunicao ? formatarDataMoment(dataHoraUltimaComunicao) : 'Indefinida'
    }
  }

  // Comunicação do Rastreador ocorreu no Tempo Previsto
  if (!rastreadorSemComunicacao) return

  await salvarOcorrencia(enums.OCORRENCIA.RASTREADOR_CARRETA_SEM_COMUNICACAO, pedido, informacoesAdicionais)

  return 'OK'
}


async function monitorarPedidoRastreadorCavaloSemComunicacao(pedido, parametros, posicaoAtual) {
  const prazoVerificacaoCavalo = obterParametro(parametros, enums.OCORRENCIA.RASTREADOR_CAVALO_SEM_COMUNICACAO, 'PRAZO_VERIFICACAO_CAVALO')
  if (!prazoVerificacaoCavalo) return 'PARAMETROS_INSUFICIENTES'
  if (!pedido.placaVeiculo) return 'PEDIDO_PLACA_NAO_INFORMADA'

  // const { placaVeiculo } = pedido

  // const reqRastreador = { query: { placa: placaVeiculo } }

  const { idRastreador = null, dataHora = null } = posicaoAtual || {}

  const dataHoraUltimaComunicacao = dataHora// && moment(dataHora)

  const dataLimiteRastreadorSemComunicacao = util.obterDataCorrente().subtract(prazoVerificacaoCavalo, 'hours')

  // Comunicação do Rastreador ocorreu no Tempo Previsto
  if (idRastreador && dataHoraUltimaComunicacao > dataLimiteRastreadorSemComunicacao) return 'COMUNICACAO_CAVALO_OK'

  const informacoesAdicionais = {
    rastreador: idRastreador || 'Não Encontrado',
    ultimaComunicacao: dataHoraUltimaComunicacao ? formatarDataMoment(dataHoraUltimaComunicacao) : 'Indefinida',
  }

  await salvarOcorrencia(enums.OCORRENCIA.RASTREADOR_PEDIDO_CAVALO_SEM_COMUNICACAO, pedido, informacoesAdicionais)

  return 'OK'
}

async function monitorarPedidoRastreadorCarretaSemComunicacao(pedido, parametros, posicaoAtual) {
  const prazoVerificacaoCavalo = obterParametro(parametros, enums.OCORRENCIA.RASTREADOR_PEDIDO_CARRETA_SEM_COMUNICACAO, 'PRAZO_VERIFICACAO_CAVALO')
  if (!prazoVerificacaoCavalo) return 'PARAMETROS_INSUFICIENTES'
  if (!pedido.placaVeiculo) return 'PEDIDO_PLACA_NAO_INFORMADA'

  // const { placaVeiculo } = pedido

  // const reqRastreador = { query: { placa: placaVeiculo } }

  const { idRastreador = null, dataHora = null } = posicaoAtual || {}

  const dataHoraUltimaComunicacao = dataHora// && moment(dataHora)

  const dataLimiteRastreadorSemComunicacao = util.obterDataCorrente().subtract(prazoVerificacaoCavalo, 'hours')

  // Comunicação do Rastreador ocorreu no Tempo Previsto
  if (idRastreador && dataHoraUltimaComunicacao > dataLimiteRastreadorSemComunicacao) return 'COMUNICACAO_CAVALO_OK'

  const informacoesAdicionais = {
    rastreador: idRastreador || 'Não Encontrado',
    ultimaComunicacao: dataHoraUltimaComunicacao ? formatarDataMoment(dataHoraUltimaComunicacao) : 'Indefinida',
  }

  await salvarOcorrencia(enums.OCORRENCIA.RASTREADOR_PEDIDO_CARRETA_SEM_COMUNICACAO, pedido, informacoesAdicionais)

  return 'OK'
}


async function monitorarAtrasoChegadaAreaColeta(
  pedido,
  proximaEtapa,
  previsaoChegada,
  posicaoAtual,
) {
  if (!posicaoAtual) return 'SEM_POSICAO_ATUAL' // Rastreador nunca respondeu
  const verificacaoAtraso = await estahAtrasadoNaChegadaAoPoligono(proximaEtapa, previsaoChegada, enums.TIPO_POLIGONO_VERIFICACAO.COLETA, posicaoAtual)

  if (!verificacaoAtraso.atraso) return 'SEM_ATRASO'

  const { informacoesAdicionais } = verificacaoAtraso

  await salvarOcorrencia(enums.OCORRENCIA.ATRASO_CHEGADA_AREA_COLETA, pedido, informacoesAdicionais, proximaEtapa)
  return 'OK'
}

async function monitorarRegistroEntradaAreaColeta(
  pedido,
  proximaEtapa,
) {
  const verificacaoEntrada = await entrouNoPoligono(proximaEtapa, enums.TIPO_POLIGONO_VERIFICACAO.COLETA)

  if (!verificacaoEntrada.entrou) return 'NAO_ENTROU_AREA_COLETA'

  const { informacoesAdicionais } = verificacaoEntrada

  await salvarOcorrencia(enums.OCORRENCIA.REGISTRO_ENTRADA_AREA_COLETA, pedido, informacoesAdicionais, proximaEtapa)

  return 'OK'
}

async function monitorarRegistroTempoExcedidoAreaColeta(
  pedido,
  proximaEtapa,
  posicaoAtual,
) {
  const verificacaoTempoExcedido = await excedeuTempoNoPoligono(proximaEtapa, posicaoAtual, enums.TIPO_POLIGONO_VERIFICACAO.COLETA)

  if (!verificacaoTempoExcedido.excedeu) return

  const { informacoesAdicionais } = verificacaoTempoExcedido

  await salvarOcorrencia(enums.OCORRENCIA.TEMPO_EXCEDIDO_AREA_COLETA, pedido, informacoesAdicionais, proximaEtapa)
}

async function monitorarRegistroSaidaAreaColeta(
  pedido,
  proximaEtapa,
  posicaoAtual,
) {
  const verificacaoSaida = await saiuDoPoligono(proximaEtapa, posicaoAtual, enums.TIPO_POLIGONO_VERIFICACAO.COLETA)

  if (!verificacaoSaida.saiu) return

  const { informacoesAdicionais } = verificacaoSaida

  // // recalcula previsão de chegada para as próximas etapas
  // await mapaSinoticoServico.recalculaPrevisaoTodasEtapas(proximaEtapa.idMapaSinotico, posicaoAtual)

  await salvarOcorrencia(enums.OCORRENCIA.REGISTRO_SAIDA_AREA_COLETA, pedido, informacoesAdicionais, proximaEtapa)
}

async function monitorarAtrasoChegadaAreaEntrega(
  pedido,
  proximaEtapa,
  previsaoChegada,
  posicaoAtual,
) {
  const verificacaoAtraso = await estahAtrasadoNaChegadaAoPoligono(proximaEtapa, previsaoChegada, enums.TIPO_POLIGONO_VERIFICACAO.ENTREGA, posicaoAtual)

  if (!verificacaoAtraso.atraso) return

  const { informacoesAdicionais } = verificacaoAtraso

  await salvarOcorrencia(enums.OCORRENCIA.ATRASO_CHEGADA_AREA_ENTREGA, pedido, informacoesAdicionais, proximaEtapa)
}

async function monitorarRegistroEntradaAreaEntrega(
  pedido,
  proximaEtapa,
) {
  const verificacaoEntrada = await entrouNoPoligono(proximaEtapa, enums.TIPO_POLIGONO_VERIFICACAO.ENTREGA)

  if (!verificacaoEntrada.entrou) return

  const { informacoesAdicionais } = verificacaoEntrada

  await salvarOcorrencia(enums.OCORRENCIA.REGISTRO_ENTRADA_AREA_ENTREGA, pedido, informacoesAdicionais, proximaEtapa)
}

async function monitorarRegistroTempoExcedidoAreaEntrega(
  pedido,
  proximaEtapa,
  posicaoAtual,
) {
  const verificacaoTempoExcedido = await excedeuTempoNoPoligono(proximaEtapa, posicaoAtual, enums.TIPO_POLIGONO_VERIFICACAO.ENTREGA)

  if (!verificacaoTempoExcedido.excedeu) return

  const { informacoesAdicionais } = verificacaoTempoExcedido

  await salvarOcorrencia(enums.OCORRENCIA.TEMPO_EXCEDIDO_AREA_ENTREGA, pedido, informacoesAdicionais, proximaEtapa)
}

async function monitorarRegistroSaidaAreaEntrega(
  pedido,
  proximaEtapa,
  posicaoAtual,
) {
  const verificacaoSaida = await saiuDoPoligono(proximaEtapa, posicaoAtual, enums.TIPO_POLIGONO_VERIFICACAO.ENTREGA)

  if (!verificacaoSaida.saiu) return

  const { informacoesAdicionais } = verificacaoSaida

  await salvarOcorrencia(enums.OCORRENCIA.REGISTRO_SAIDA_AREA_ENTREGA, pedido, informacoesAdicionais, proximaEtapa)
}

async function monitorarRegistroPassagemCheckpoint(
  proximaEtapa,
  proximaDaProximaEtapa,
  posicaoAtual,
) {
  if (!posicaoAtual) return false
  const verificacaoPassouCheckpoint = passouCheckpoint(proximaEtapa, proximaDaProximaEtapa, posicaoAtual, enums.TIPO_POLIGONO_VERIFICACAO.CHECKPOINT)

  if (!verificacaoPassouCheckpoint.passou) return

  const { informacoesAdicionais } = verificacaoPassouCheckpoint

  await mapaSinoticoServico.registrarPassagemCheckpoint(proximaEtapa.id, informacoesAdicionais.dataHoraPassagemEfetiva)
  return 'OK'
}

// async function verificarVencimentoExameMedicoCNHMotorista(
//   pedido,
//   parametrosGerais
// ) {
//   // verificar se faz um a um ou todos os motoristas

//   var agora = new Date();
//   const dataLimiteVerificarExameMedicoCNHMotorista = new Date();
//   const dataVencimentoCNH = new Date();
//   dataLimiteVerificarExameMedicoCNHMotorista.setHours(
//     dataVencimentoCNH.getHours() + parametrosGerais.prazoVerificacaoCNH
//   );

//   if (dataLimiteVerificarExameMedicoCNHMotorista <= agora) return;

//   var codigoOcorrencia = 20;
//   var ocorrencia =
//     " Data limite exame médico CNH do Motorista." +
//     dataLimiteVerificarExameMedicoCNHMotorista;
//   var informacoesAdicionais = {
//     dataLimiteExameMedicoCNHMotorista: dataLimiteVerificarExameMedicoCNHMotorista
//   };
//   await salvarOcorrencia(
//     codigoOcorrencia,
//     ocorrencia,
//     pedido,
//     informacoesAdicionais
//   );
// }

// ---------------------- Monitoramento Veículos ----------------------------------------- //
async function monitorarVeiculoRastreadorCavaloSemComunicacao(veiculo, parametros) {
  if (!veiculo.usaCombustivel) return 'NAO_EH_CAVALO'
  const prazoVerificacaoCavalo = obterParametro(parametros, enums.OCORRENCIA.RASTREADOR_CAVALO_SEM_COMUNICACAO, 'PRAZO_VERIFICACAO_CAVALO')
  if (!prazoVerificacaoCavalo) return 'PARAMETROS_INSUFICIENTES'

  const { placaVeiculo } = veiculo

  const reqRastreador = { query: { placa: placaVeiculo } }

  const posicaoAtual = await rastreadorServico.listar(reqRastreador)

  const { idRastreador = null, dataHora = null } = posicaoAtual || {}

  const dataHoraUltimaComunicao = dataHora && moment(dataHora)

  const dataLimiteRastreadorSemComunicacao = moment(util.obterDataCorrente()).subtract(prazoVerificacaoCavalo, 'hours')

  // Comunicação do Rastreador ocorreu no Tempo Previsto
  if (idRastreador && dataHoraUltimaComunicao > dataLimiteRastreadorSemComunicacao) return `COMUNICACAO_CAVALO_OK:  ${dataHoraUltimaComunicao}`

  const informacoesAdicionais = {
    rastreador: idRastreador || 'Não Encontrado',
    ultimaComunicacao: dataHoraUltimaComunicao ? formatarDataMoment(dataHoraUltimaComunicao) : 'Indefinida',
  }

  await salvarOcorrenciaVeiculo(enums.OCORRENCIA.RASTREADOR_CAVALO_SEM_COMUNICACAO, veiculo, informacoesAdicionais)

  return 'OK'
}

async function monitorarVeiculoSemAlocacaoPorTempo(motorista, parametros) {
  const prazoMaximoSemAlocacaoMotorista = obterParametro(parametros, enums.OCORRENCIA.RASTREADOR_CAVALO_SEM_COMUNICACAO, 'PRAZO_MAXIMO_SEM_ALOCACAO_MOTORISTA')
  if (!prazoMaximoSemAlocacaoMotorista) return 'PARAMETROS_INSUFICIENTES'

  const dataLimiteVerificarMotoristaSemAlocacao = util.obterDataCorrente().add(-prazoMaximoSemAlocacaoMotorista, 'days')

  if (motorista.manifestoDataEmissao > dataLimiteVerificarMotoristaSemAlocacao) return 'ALOCADO_RECENTEMENTE'
  if (motorista.manifestoSituacao !== 'B') return 'MANIFESTO_DIFERENTE_DE_BAIXADO'

  const informacoesAdicionais = {}

  await salvarOcorrenciaMotorista(enums.OCORRENCIA.MOTORISTA_SEM_ALOCACAO_POR_TEMPO, motorista, informacoesAdicionais)

  return 'OK'
}

async function monitorarVeiculoRastreadorCarretaSemComunicacao(veiculo, parametros) {
  if (veiculo.usaCombustivel) return 'NAO_EH_CARRETA'
  const prazoVerificacaoCavalo = obterParametro(parametros, enums.OCORRENCIA.RASTREADOR_CARRETA_SEM_COMUNICACAO, 'PRAZO_VERIFICACAO_CAVALO')
  if (!prazoVerificacaoCavalo) return 'PARAMETROS_INSUFICIENTES'

  const { placaVeiculo } = veiculo

  const reqRastreador = { query: { placa: placaVeiculo } }

  const posicaoAtual = await rastreadorServico.listar(reqRastreador)

  const { idRastreador = null, dataHora = null } = posicaoAtual || {}

  const dataHoraUltimaComunicao = dataHora && moment(dataHora)

  const dataLimiteRastreadorSemComunicacao = moment(util.obterDataCorrente()).subtract(prazoVerificacaoCavalo, 'hours')

  // Comunicação do Rastreador ocorreu no Tempo Previsto
  if (idRastreador && dataHoraUltimaComunicao > dataLimiteRastreadorSemComunicacao) return `COMUNICACAO_CAVALO_OK:  ${dataHoraUltimaComunicao}`

  const informacoesAdicionais = {
    rastreador: idRastreador || 'Não Encontrado',
    ultimaComunicacao: dataHoraUltimaComunicao ? formatarDataMoment(dataHoraUltimaComunicao) : 'Indefinida',
  }

  await salvarOcorrenciaVeiculo(enums.OCORRENCIA.RASTREADOR_CARRETA_SEM_COMUNICACAO, veiculo, informacoesAdicionais)

  return 'OK'
}

async function monitorarMotoristaSemAlocacaoPorTempo(motorista, parametros) {
  const prazoMaximoSemAlocacaoMotorista = obterParametro(parametros, enums.OCORRENCIA.MOTORISTA_SEM_ALOCACAO_POR_TEMPO, 'PRAZO_MAXIMO_SEM_ALOCACAO_MOTORISTA')

  if (!prazoMaximoSemAlocacaoMotorista) return 'PARAMETROS_INSUFICIENTES'

  const dataLimiteVerificarMotoristaSemAlocacao = util.obterDataCorrente().add(-prazoMaximoSemAlocacaoMotorista, 'days')

  const vManifestoDataEmissao = util.converterParaData(motorista.manifestoDataEmissao)

  if (vManifestoDataEmissao > dataLimiteVerificarMotoristaSemAlocacao) return 'ALOCADO_RECENTEMENTE'

  if (motorista.manifestoSituacao !== 'B') return 'MANIFESTO_DIFERENTE_DE_BAIXADO'

  const informacoesAdicionais = {}

  await salvarOcorrenciaMotorista(enums.OCORRENCIA.MOTORISTA_SEM_ALOCACAO_POR_TEMPO, motorista, informacoesAdicionais)

  return 'OK'
}


async function monitorarMotoristaVencimentoCNH(motorista, parametros) {
  const quantidadeDiasAnterioresVencimentoCNH = obterParametro(parametros, enums.OCORRENCIA.VENCIMENTO_CNH_MOTORISTA, 'QUANTIDADE_DIAS_ANTERIORES_VENCIMENTO_CNH')

  if (!quantidadeDiasAnterioresVencimentoCNH) return 'PARAMETROS_INSUFICIENTES'

  if (motorista.codigoSituacao !== 'A') return 'MOTORSTA_DEVE_ESTAR_ATIVO'

  const vDataLimiteVerificarCNH = util.obterDataCorrente().add(quantidadeDiasAnterioresVencimentoCNH, 'days')

  if (!motorista.habilitacao.dataVencimentoCNH) return 'DATA_VENCIMENTO_CNH_NAO_INFORMADO'

  const vDataVencimentoCNH = util.converterParaData(motorista.habilitacao.dataVencimentoCNH)

  if (vDataVencimentoCNH > vDataLimiteVerificarCNH) return 'CNH_LONGE_DE_VENCER'

  const informacoesAdicionais = {}

  await salvarOcorrenciaMotorista(enums.OCORRENCIA.VENCIMENTO_CNH_MOTORISTA, motorista, informacoesAdicionais)

  return 'OK'
}


async function monitorarMotoristaFerias(motorista, parametros) {
  const quantidadeDiasAnterioresAlertaFerias = obterParametro(parametros, enums.OCORRENCIA.ALERTA_FERIAS_MOTORISTA, 'QUANTIDADE_DIAS_ANTERIORES_ALERTA_FERIAS')
  if (!quantidadeDiasAnterioresAlertaFerias) return 'PARAMETROS_INSUFICIENTES'

  const dataLimiteVerificarFerias = util.obterDataCorrente().add(quantidadeDiasAnterioresAlertaFerias, 'days')
  const vDataReferencia = util.converterParaData(motorista.dataReferencia)

  if (vDataReferencia < dataLimiteVerificarFerias) return 'FERIAS_PERIODO_VERIFICACAO_PASSOU'

  const informacoesAdicionais = {}

  await salvarOcorrenciaMotorista(enums.OCORRENCIA.ALERTA_FERIAS_MOTORISTA, motorista, informacoesAdicionais)

  return 'OK'
}

const functions = {
  // Pedidos novos ou emm alocação
  monitorarAlocacaoPedidoDentroPrazo: (pedido, parametros) => monitorarAlocacaoPedidoDentroPrazo(pedido, parametros),
  monitorarAlocacaoPedidoTempoExcedido: (pedido, parametros) => monitorarAlocacaoPedidoTempoExcedido(pedido, parametros),
  monitorarConfirmacaoAlocacaoParaPedido: (pedido, parametros) => monitorarConfirmacaoAlocacaoParaPedido(pedido, parametros),
  monitorarRastreadorCavaloSemComunicacao: (pedido, parametros) => monitorarRastreadorCavaloSemComunicacao(pedido, parametros),
  monitorarRastreadorCarretaSemComunicacao: (pedido, parametros) => monitorarRastreadorCarretaSemComunicacao(pedido, parametros),

  // Pedidos em viagem
  monitorarAtrasoChegadaAreaColeta: (pedido, proximaEtapa, previsaoChegada, posicaoAtual) => monitorarAtrasoChegadaAreaColeta(pedido, proximaEtapa, previsaoChegada, posicaoAtual),
  monitorarRegistroEntradaAreaColeta: (pedido, proximaEtapa) => monitorarRegistroEntradaAreaColeta(pedido, proximaEtapa),
  monitorarRegistroTempoExcedidoAreaColeta: (pedido, proximaEtapa, previsaoChegada) => monitorarRegistroTempoExcedidoAreaColeta(pedido, proximaEtapa, previsaoChegada),
  monitorarRegistroSaidaAreaColeta: (pedido, proximaEtapa, previsaoChegada) => monitorarRegistroSaidaAreaColeta(pedido, proximaEtapa, previsaoChegada),
  monitorarAtrasoChegadaAreaEntrega: (pedido, proximaEtapa, previsaoChegada, posicaoAtual) => monitorarAtrasoChegadaAreaEntrega(pedido, proximaEtapa, previsaoChegada, posicaoAtual),
  monitorarRegistroEntradaAreaEntrega: (pedido, proximaEtapa) => monitorarRegistroEntradaAreaEntrega(pedido, proximaEtapa),
  monitorarRegistroTempoExcedidoAreaEntrega: (pedido, proximaEtapa, previsaoChegada) => monitorarRegistroTempoExcedidoAreaEntrega(pedido, proximaEtapa, previsaoChegada),
  monitorarRegistroSaidaAreaEntrega: (pedido, proximaEtapa, previsaoChegada) => monitorarRegistroSaidaAreaEntrega(pedido, proximaEtapa, previsaoChegada),

  monitorarPedidoRastreadorCavaloSemComunicacao: async (pedido, parametros, posicaoAtual) => monitorarPedidoRastreadorCavaloSemComunicacao(pedido, parametros, posicaoAtual),
  monitorarPedidoRastreadorCarretaSemComunicacao: async (pedido, parametros, posicaoAtual) => monitorarPedidoRastreadorCarretaSemComunicacao(pedido, parametros, posicaoAtual),

  // Passagem checkpoint - não gera ocorrência
  monitorarRegistroPassagemCheckpoint: (proximaEtapa, proximaDaProximaEtapa, posicaoAtual) => monitorarRegistroPassagemCheckpoint(proximaEtapa, proximaDaProximaEtapa, posicaoAtual),

  // Veículos
  monitorarVeiculoSemAlocacaoPorTempo: (motorista, parametros) => monitorarVeiculoSemAlocacaoPorTempo(motorista, parametros),
  monitorarVeiculoRastreadorCavaloSemComunicacao: (veiculo, parametros) => monitorarVeiculoRastreadorCavaloSemComunicacao(veiculo, parametros),
  monitorarVeiculoRastreadorCarretaSemComunicacao: (veiculo, parametros) => monitorarVeiculoRastreadorCarretaSemComunicacao(veiculo, parametros),

  // Motorista
  monitorarMotoristaSemAlocacaoPorTempo: (motorista, parametros) => monitorarMotoristaSemAlocacaoPorTempo(motorista, parametros),
  monitorarMotoristaFerias: (motorista, parametros) => monitorarMotoristaFerias(motorista, parametros),
  monitorarMotoristaVencimentoCNH: (motorista, parametros) => monitorarMotoristaVencimentoCNH(motorista, parametros),

}

export default functions
