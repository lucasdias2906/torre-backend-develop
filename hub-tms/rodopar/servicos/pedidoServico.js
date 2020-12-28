import dml from '../funcoes/dml'
import sql from './pedidoSQL'

async function listar(req) {
  const vParams = req.body

  let vFiltro = ''
  let vOrdenacao = ''
  vParams.filtroInternoStatusCodigoTorre = ''

  if (vParams.agrupar === 'S') vOrdenacao = 'SEQUENCIAORDENACAOPEDIDO, CODIGOFILIAL, MIN(DATARETIRADA)'
  else vOrdenacao = 'SEQUENCIAORDENACAOPEDIDO, CODIGOFILIAL, DATARETIRADA'

  if (vParams.numeroPedido) vFiltro += ` AND x.numeroPedido = '${vParams.numeroPedido}'`
  if (vParams.descricaoStatusPedidoTorre) vFiltro += ` AND x.descricaoStatusPedidoTorre = '${vParams.descricaoStatusPedidoTorre}'`
  if (vParams.codigoStatusPedidoTorre) vFiltro += ` AND x.codigoStatusPedidoTorre = '${vParams.codigoStatusPedidoTorre}'`
  if (vParams.diferencial) vFiltro += ` AND x.diferencial like '%${vParams.diferencial}%'`
  if (vParams.placaVeiculo) vFiltro += ` AND x.codigoPlacaVeiculo = '${vParams.placaVeiculo}'`
  if (vParams.codigoLinha) vFiltro += ` AND x.codigoLinha = '${vParams.codigoLinha}'`
  if (vParams.codigoRemetente) vFiltro += ` AND x.codigoRemetente = '${vParams.codigoRemetente}'`
  if (vParams.codigoDestinatario) vFiltro += ` AND x.codigoDestinatario = '${vParams.codigoDestinatario}'`
  if (vParams.codigoStatusPedidoTorre) vFiltro += `AND x.codigoStatusPedidoTorre = '${vParams.codigoStatusPedidoTorre}'`

  // filtro default se não selecionar nenhum status no filtro
  // este filtro está colocado dentro da consulta (redundante com o filtro externo) para tentar otimizar performance
  if (!vParams.codigoStatusPedidoTorre) {
    vFiltro += 'AND x.codigoStatusPedidoTorre IN (1,2,4)' // Novos, Com alocação ou em viagem
    vParams.filtroInternoStatusCodigoTorre = `AND
                         (
                           (PRC.SITUAC IN ('D','M') AND  DPR.ID_DPR IS NULL) -- Programação Carga Não canceladas
                          OR
                         (LPR.SITUAC IN ('D','E') AND DPR.ID_DPR IS NOT NULL)-- Programação de Veículo Não Canceladas, nem Finalizadas
                        ) `
  } else if (vParams.codigoStatusPedidoTorre === '1') { // NOVOS
    vParams.filtroInternoStatusCodigoTorre = "AND (PRC.SITUAC IN ('D','M') AND  DPR.ID_DPR IS NULL)"
  } else if (vParams.codigoStatusPedidoTorre === '1') { // COM ALOCAÇÃO
    vParams.filtroInternoStatusCodigoTorre = "AND LPR.SITUAC IN ('D')"
  } else if (vParams.codigoStatusPedidoTorre === '3') { // CANCELADO
    vParams.filtroInternoStatusCodigoTorre = "AND LPR.SITUAC IN ('C')"
  } else if (vParams.codigoStatusPedidoTorre === '4') { // EM VIAGEM
    vParams.filtroInternoStatusCodigoTorre = "AND LPR.SITUAC IN ('E')"
  } else if (vParams.codigoStatusPedidoTorre === '5') { // VIAGEM FINALIZADA
    vParams.filtroInternoStatusCodigoTorre = "AND LPR.SITUAC IN ('F')"
  } else if (vParams.codigoStatusPedidoTorre === '6') { // BLOQUEADO GER. RISCO
    vParams.filtroInternoStatusCodigoTorre = "AND LPR.SITUAC IN ('B')"
  }

  // if (vParams.rota) vFiltro += ` AND P.ROTA = ${vParams.rota}`;
  const vListagem = await dml.executarSQLListar(vParams, sql.sqlPedido(vParams), vFiltro, vOrdenacao)

  if (vParams.agrupar === 'N') return vListagem

  vParams.resumo = 'S'
  vOrdenacao = null
  vParams.pagina = 1

  const vResumo = (await dml.executarSQLListar(vParams, sql.sqlPedido(vParams), vFiltro, vOrdenacao)).dados

  const vRetornoResumo = {
    statusNovo: vResumo.length > 0 ? vResumo[0].qtdStatusNovo : 0,
    statusComAlocacao: vResumo.length > 0 ? vResumo[0].qtdStatusComAlocacao : 0,
    statusEmViagem: vResumo.length > 0 ? vResumo[0].qtdStatusEmViagem : 0,
    statusViagemFinalizada: vResumo.length > 0 ? vResumo[0].qtdStatusEmViagemFinalizada : 0,
    statusCancelado: vResumo.length > 0 ? vResumo[0].qtdStatusCancelado : 0,
    statusBloqueadoGerRisco: vResumo.length > 0 ? vResumo[0].qtdStatusBloqueadoGerRisco : 0,
    statusCadastrada: vResumo.length > 0 ? vResumo[0].qtdStatusCadastrada : 0,
    statusMovimentada: vResumo.length > 0 ? vResumo[0].qtdStatusMovimentada : 0,
    ocorrenciaCriticidadeAlta: vResumo.length > 0 ? vResumo[0].qtdOcorrenciaCriticidadeAlta : 0,
    ocorrenciaCriticidadeBaixa: vResumo.length > 0 ? vResumo[0].qtdOcorrenciaCriticidadeBaixa : 0,
  }

  return {
    resumo: vRetornoResumo,
    totalRegistros: vListagem.totalRegistros,
    totalRegistrosPagina: vListagem.totalRegistrosPagina,
    dados: vListagem.dados,
  }
}

async function obter(req) {
  const vParams = req.query
  const vRetorno = (await dml.executarSQL(sql.sqlObterNumeroPedido, vParams)).dados

  let dados = null
  if (vRetorno.length > 0) [dados] = (await dml.executarSQL(sql.sqlObterPedido(vRetorno[0]), vParams)).dados

  return { dados }
}

async function listarComposicaoCarga(req) {
  const vParams = req.query

  const vLimite = vParams.limite || 10
  const vPagina = vParams.pagina || 1

  const pc = (await dml.executarSQL(sql.sqlComposicaoCarga, vParams)).dados

  const result = pc.map((elem, index) => ({
    numeroLinha: index + 1,
    codigoFilial: elem.composicaoCarga.codigoFilial,
    numeroPedido: elem.composicaoCarga.numeroPedido,
    identificacaoSituacao: elem.composicaoCarga.identificacaoSituacao,
    descricacaoSituacao: elem.composicaoCarga.descricacaoSituacao,
    dataInclusao: elem.composicaoCarga.dataInclusao,
    usuarioInclusao: elem.composicaoCarga.usuarioInclusao,
    dataAlteracao: elem.composicaoCarga.dataAlteracao,
    usuarioAlteracao: elem.composicaoCarga.usuarioAlteracao,
    IdentificacaoDestinoProduto: elem.composicaoCarga.IdentificacaoDestinoProduto,
    codigoDestino: elem.composicaoCarga.codigoDestino,
    codigoAgrupadorIntegrator: elem.composicaoCarga.codigoAgrupadorIntegrator,
    serieNotaFiscal: elem.composicaoCarga.serieNotaFiscal,
    numeroNotaFiscal: elem.composicaoCarga.numeroNotaFiscal,
    dataNotaFiscal: elem.composicaoCarga.dataNotaFiscal,
    codigoProduto: elem.composicaoCarga.codigoProduto,
    descricaoProduto: elem.composicaoCarga.descricaoProduto,
    especieProduto: elem.composicaoCarga.especieProduto,
    identificacaoNatureza: elem.composicaoCarga.identificacaoNatureza,
    identificacaoEspecie: elem.composicaoCarga.identificacaoEspecie,
    quantidadeItem: elem.composicaoCarga.quantidadeItem,
    pesoKG: elem.composicaoCarga.pesoKG,
    identificacaoCubagem: elem.composicaoCarga.identificacaoCubagem,
    descricaoCubagem: elem.composicaoCarga.descricaoCubagem,
    numeroReferenteCliente: elem.composicaoCarga.numeroReferenteCliente,
    largura: elem.composicaoCarga.largura,
    altura: elem.composicaoCarga.altura,
    profundidade: elem.composicaoCarga.profundidade,
    pesoCubagem: elem.composicaoCarga.pesoCubagem,
    pesoCalculado: elem.composicaoCarga.pesoCalculado,
    valorMercadoria: elem.composicaoCarga.valorMercadoria,
    valorMercadoriaSegurada: elem.composicaoCarga.valorMercadoriaSegurada,
    numeroNossaReferencia: elem.composicaoCarga.numeroNossaReferencia,
    numerNotaFiscalEletronica: elem.composicaoCarga.numerNotaFiscalEletronica,
  }))

  const vInicio = (vPagina - 1) * vLimite
  const vFim = vPagina * vLimite

  const totalRegistrosPagina = result.slice(vInicio, vFim).length

  return {
    totalRegistros: result.length,
    totalRegistrosPagina,
    dados: result.slice(vInicio, vFim),
  }
}

async function listarProgramacaoVeiculo(req) {
  const vParams = req.query

  const vLimite = vParams.limite || 10
  const vPagina = vParams.pagina || 1

  const pv = (await dml.executarSQL(sql.sqlProgramacaoVeiculo, vParams)).dados

  const result = pv.map((elem, index) => ({
    numeroLinha: index + 1,
    codigoFilial: elem.programacaoVeiculo.codigoFilial,
    numeroPedido: elem.programacaoVeiculo.numeroPedido,
    numeroProgramacaoVeiculo: elem.programacaoVeiculo.numeroProgramacaoVeiculo,
    codigoTomador: elem.programacaoVeiculo.codigoTomador,
    nomeTomador: elem.programacaoVeiculo.nomeTomador,
    codigoRemetente: elem.programacaoVeiculo.codigoRemetente,
    nomeRemetente: elem.programacaoVeiculo.nomeRemetente,
    codigoDestinatario: elem.programacaoVeiculo.codigoDestinatario,
    nomeDestinatario: elem.programacaoVeiculo.nomeDestinatario,
  }))

  const vInicio = (vPagina - 1) * vLimite
  const vFim = vPagina * vLimite

  const totalRegistrosPagina = result.slice(vInicio, vFim).length

  return {
    totalRegistros: result.length,
    totalRegistrosPagina,
    dados: result.slice(vInicio, vFim),
  }
}

async function gerarProgramacaoVeiculo(req) {
  const vParams = {
    numeroPedido: req.query.numeroPedido,
    codigoFilial: req.query.codigoFilial,
    codigoMotorista1: req.body.codigoMotorista1 || null,
    codigoMotorista2: req.body.codigoMotorista2 || null,
    placa: req.body.placa1 || null,
    placa2: req.body.placa2 || null,
    placa3: req.body.placa3 || null,
    placa4: req.body.placa4 || null,
    dataSaida: req.body.dataSaida || null,
    usuario: req.body.usuarioLogado.toUpperCase() || 'TORRE',
  }

  const pv = (await dml.executarSQL(sql.storedProcedureGeraProgramacaoVeiculo, vParams)).dados

  const result = pv.map((elem) => ({
    numeroProgramacaoVeiculo: elem.programacaoVeiculo.numeroProgramacaoVeiculo,
    retorno: elem.programacaoVeiculo.retorno,
  }))

  return result
}

async function registrarFimDaViagem(req) {
  const vParams = {
    numeroPedido: req.query.numeroPedido,
    codigoFilial: req.query.codigoFilial,
    usuario: req.body.usuarioLogado,
  }

  const retorno = (await dml.executarSQL(sql.storedProcedureFimViagem, vParams)).dados

  return retorno
}

async function listarPedidosEmViagem(req) {
  const vParams = req.query

  const pedido = (await dml.executarSQL(sql.sqlPedidosEmViagem, vParams)).dados

  const result = pedido.map((elem) => ({
    numeroPedido: elem.numeroPedido,
    codigoFilial: elem.codigoFilial,
    nomeFilial: elem.nomeFilial,
    codigoManifesto: elem.codigoManifesto,
    codigoFilialManifesto: elem.codigoFilialManifesto,
    serieManifesto: elem.serieManifesto,
    numeroProgramacaoVeiculo: elem.codigoPV,
    codigoFilialProgramacaoVeiculo: elem.filialPV,
    codigoPlacaVeiculo: elem.codigoPlacaVeiculo,
    placaVeiculo: elem.placaVeiculo,
    codigoPlacaVeiculo2: elem.codigoPlacaVeiculo2,
    placaVeiculo2: elem.placaVeiculo2,
    codigoPlacaVeiculo3: elem.codigoPlacaVeiculo3,
    placaVeiculo3: elem.placaVeiculo3,
    codigoPlacaVeiculo4: elem.codigoPlacaVeiculo4,
    placaVeiculo4: elem.placaVeiculo4,
    codigoMotorista1: elem.codigoMotorista1,
    nomeMotorista1: elem.nomeMotorista1,
    codigoMotorista2: elem.codigoMotorista2,
  }))

  return {
    dados: result,
  }
}

async function listarPedidosNovosAndEmAlocacao(req) {
  const vParams = req.query

  const pedido = (await dml.executarSQL(sql.sqlPedidosNovosAndEmAlocacao, vParams)).dados

  const result = pedido.map((elem) => ({
    numeroPedido: elem.numeroPedido,
    codigoFilial: elem.codigoFilial,
    statusPedido: elem.statusPedido,
    codigoPlacaVeiculo: elem.codigoPlacaVeiculo,
    placaVeiculo: elem.placaVeiculo,
    codigoPlacaVeiculo2: elem.codigoPlacaVeiculo2,
    placaVeiculo2: elem.placaVeiculo2,
    codigoPlacaVeiculo3: elem.codigoPlacaVeiculo3,
    placaVeiculo3: elem.placaVeiculo3,
    codigoPlacaVeiculo4: elem.codigoPlacaVeiculo4,
    placaVeiculo4: elem.placaVeiculo4,
    codigoMotorista1: elem.codigoMotorista1,
    codigoMotorista2: elem.codigoMotorista2,
    dataInicioViagem: elem.dataInicioViagem,
    dataProgramacao: elem.dataProgramacao,
    dataColeta: elem.dataColeta,
    dataPedido: elem.dataPedido,
  }))

  return {
    dados: result,
  }
}

async function listarPontosPassagemPedido(req) {
  const vParams = req.query

  const pv = (await dml.executarSQL(sql.sqlPontosPassagemPedido, vParams)).dados

  const result = pv.map((elem) => ({
    tipoDocumentoEmissao: elem.tipoDocumentoEmissao,
    codigoTomador: elem.codigoTomador,
    nomeTomador: elem.nomeTomador,
    codigoRemetente: elem.codigoRemetente,
    nomeRemetente: elem.nomeRemetente,
    codigoDestinatario: elem.codigoDestinatario,
    nomeDestinatario: elem.nomeDestinatario,
    dataColeta: elem.dataColeta,
    dataEntrega: elem.dataEntrega,
  }))

  return {
    dados: result,
  }
}

async function listarAgrupados(req) {
  const vParams = req.body

  let vOrdenacao = 'numeroPedido'
  if (vParams.ordenacao === 'statusPedidoTorre') vOrdenacao = ' statusPedidoTorre '
  if (vParams.ordenacao === 'codigoLinha') vOrdenacao = ' codigoLinha '
  if (vParams.ordenacao === 'descricaoTipoCarga') vOrdenacao = ' descricaoTipoCarga '
  if (vParams.ordenacao === 'diferencial') vOrdenacao = ' diferencial '
  if (vParams.ordenacao === 'codigoPlacaVeiculo') vOrdenacao = ' codigoPlacaVeiculo '
  if (vParams.ordenacao === 'dataRetirada') vOrdenacao = '  dataRetirada '
  if (vParams.ordenacao === 'nomeRemetente') vOrdenacao = '  nomeRemetente '
  if (vParams.ordenacao === 'nomeDestinatario') vOrdenacao = '  nomeDestinatario '

  return dml.executarSQLListar(vParams, sql.sqlPedidoAgrupados(vParams), {}, vOrdenacao)
}

const PedidoServico = {
  listar: (req) => listar(req),
  listarAgrupados: (req) => listarAgrupados(req),
  obter: (req) => obter(req),
  listarComposicaoCarga: (req) => listarComposicaoCarga(req),
  listarProgramacaoVeiculo: (req) => listarProgramacaoVeiculo(req),
  gerarProgramacaoVeiculo: (req) => gerarProgramacaoVeiculo(req),
  registrarFimDaViagem: (req) => registrarFimDaViagem(req),
  listarPedidosEmViagem: (req) => listarPedidosEmViagem(req),
  listarPedidosNovosAndEmAlocacao: (req) => listarPedidosNovosAndEmAlocacao(req),
  listarPontosPassagemPedido: (req) => listarPontosPassagemPedido(req),
}

export default PedidoServico
