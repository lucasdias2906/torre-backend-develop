import dml from '../funcoes/dml'
import sql from './veiculoSQL'

async function obter(pCodigoVeiculo, req) {
  return dml.executarSQLObter(sql.sqlVeiculoDetalhes(req.query.permissaoFiliais), pCodigoVeiculo)
}

async function obterParametrosLicencas(pCodigoVeiculo, req) {
  return dml.executarSQLObter(sql.sqlVeiculoParametrosLicencas(req.query.permissaoFiliais), pCodigoVeiculo)
}

async function listar(req) {
  const vParams = req.query

  let vFiltro = `WHERE VEI.CODFIL IN(${vParams.permissaoFiliais ? vParams.permissaoFiliais : -1}) `
  let vOrdenacao = ''

  if (vParams.codigoVeiculo) vFiltro += ` AND VEI.CODVEI = '${vParams.codigoVeiculo}'`
  if (vParams.identificacaoPlacaVeiculo) vFiltro += ` AND VEI.NUMVEI LIKE '%${vParams.identificacaoPlacaVeiculo}%'`
  if (vParams.identificacaoTipoVeiculo) vFiltro += ` AND VEI.TIPVEI = ${vParams.identificacaoTipoVeiculo}`
  if (vParams.codigoClassificacao) vFiltro += ` AND VEI.CODCMO = ${vParams.codigoClassificacao}`
  if (vParams.codigoMarca) vFiltro += ` AND VEI.CODMCV = ${vParams.codigoMarca}`
  if (vParams.codigoModeloVeiculo) vFiltro += ` AND VEI.CODMDV = ${vParams.codigoModeloVeiculo}`
  if (vParams.nomeProprietario) vFiltro += ` AND CLI.RAZSOC LIKE '%${vParams.nomeProprietario}%'`
  if (vParams.identificacaoTipoVinculoProprietario) vFiltro += ` AND VEI.TIPVIN = '${vParams.identificacaoTipoVinculoProprietario}'`
  if (vParams.identificacaoSituacaoVeiculo) vFiltro += ` AND VEI.SITUAC = ${vParams.identificacaoSituacaoVeiculo}`

  vOrdenacao = ''
  if (vParams.ordenacao == 'codigoVeiculo') vOrdenacao += ' VEI.CODVEI'
  else if (vParams.ordenacao == 'identificacaoPlacaVeiculo') vOrdenacao += ' VEI.NUMVEI'
  else if (vParams.ordenacao == 'identificacaoTipoVeiculo') {
    vOrdenacao += ` CASE WHEN VEI.TIPVEI = 1 THEN '02 EIXOS TRACIONADADORES'
                                                                                   WHEN VEI.TIPVEI = 2 THEN '03 EIXOS TRACIONADORES'
                                                                                   WHEN VEI.TIPVEI = 3 THEN 'CARRETA/CONJUNTO'
                                                                                   WHEN VEI.TIPVEI = 5 THEN 'ONIBUS'
                                                                                   WHEN VEI.TIPVEI = 6 THEN 'MAQUINA/TRATOR'
                                                                                   WHEN VEI.TIPVEI = 7 THEN 'SEMI-REBOQUE'
                                                                                   WHEN VEI.TIPVEI = 8 THEN 'OUTROS'
                                                                                   WHEN VEI.TIPVEI = 9 THEN 'LINHA DE EIXOS'
                                                                                   WHEN VEI.TIPVEI = 11 THEN 'RODOTREM'
                                                                                   WHEN VEI.TIPVEI = 12 THEN 'EIXOS TRACIONADORES'
                                                                                   WHEN VEI.TIPVEI = 13 THEN 'DOLLY'
                                                                                   WHEN VEI.TIPVEI = 20 THEN 'SIM-REBOQUE/SUPER SINGLE'
                                                                                   WHEN VEI.TIPVEI NOT IN (1,2,3,5,6,7,8,9,11,12,13,20) THEN 'NDA'
                                                                               END`
  } else if (vParams.ordenacao == 'codigoMarca') vOrdenacao += 'VEI.CODMCV'
  else if (vParams.ordenacao == 'codigoModeloVeiculo') vOrdenacao += 'VEI.CODMDV'
  else if (vParams.ordenacao == 'nomeProprietario') vOrdenacao += 'CLI.RAZSOC'
  else if (vParams.ordenacao == 'identificacaoTipoVinculoProprietario') vOrdenacao += 'VEI.TIPVIN'
  else if (vParams.ordenacao == 'identificacaoSituacaoVeiculo') vOrdenacao += 'VEI.SITUAC'
  else vOrdenacao += ' VEI.CODVEI'

  return dml.executarSQLListar(vParams, sql.sqlVeiculo, vFiltro, vOrdenacao)
}

async function listarMarca(req) {
  let vFiltro = ''
  let vOrdenacao = ''

  vOrdenacao = ' MCV.DESCRI'
  vFiltro = ' EMP.CODEMP = 1 '

  return dml.executarSQLListar([], sql.sqlMarca, vFiltro, vOrdenacao)
}

async function listarModelo(pMarcaID) {
  let vFiltro = ''
  let vOrdenacao = ''

  if (pMarcaID) vFiltro += ` AND MCV.CODMCV = ${pMarcaID}`

  vOrdenacao = ' MCV.CODMCV'

  return dml.executarSQLListar([], sql.sqlModelo, vFiltro, vOrdenacao)
}

async function obterTotais(pReq) {
  return dml.executarSQLObter(
    sql.sqlTotais(pReq.query.permissaoFiliais)
  );
}

const VeiculoServico = {
  obter: (pCodigoVeiculo, req) => obter(pCodigoVeiculo, req),
  obterParametrosLicencas: (pCodigoVeiculo, req) => obterParametrosLicencas(pCodigoVeiculo, req),
  listar: (req) => listar(req),
  listarMarca: (req) => listarMarca(req),
  obterTotais: (req) => obterTotais(req),
  listarModelo: (pMarcaID) => listarModelo(pMarcaID),
}

export default VeiculoServico
