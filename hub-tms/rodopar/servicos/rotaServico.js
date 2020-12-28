import dml from '../funcoes/dml'
import vSql from './rotaSQL'

async function listar (req) {
  const vParams = req.query

  let vFiltro = ''
  let vOrdenacao = ''

  if (vParams.codigoLinha) vFiltro += ` AND LIN.CODLIN ='${vParams.codigoLinha}'`
  if (vParams.identificaoSituacaoLinha) vFiltro += ` AND LIN.SITUAC = '${vParams.identificaoSituacaoLinha}' `
  if (vParams.descricaoStatusLinha) vFiltro += ` AND CASE WHEN LIN.SITUAC = 'A' THEN 'ATIVO' WHEN LIN.SITUAC = 'I' THEN'INATIVA' END = '${vParams.descricaoStatusLinha}' `
  if (vParams.codigoPontoInicial) vFiltro += ` AND LIN.PONINI = '${vParams.codigoPontoInicial}' `
  if (vParams.nomeMunicipioInicial) vFiltro += ` AND MUNI.DESCRI = '${vParams.nomeMunicipioInicial}' `
  if (vParams.siglaUFMunicipioInicial) vFiltro += ` AND MUNI.ESTADO = '${vParams.siglaUFMunicipioInicial}' `
  if (vParams.codigoPontoFinal) vFiltro += ` AND LIN.PONFIM = '${vParams.codigoPontoFinal}' `
  if (vParams.nomeMunicipioFinal) vFiltro += ` AND MUNF.DESCRI = '${vParams.nomeMunicipioFinal}' `
  if (vParams.siglaUFMunicipioFinal) vFiltro += ` AND MUNF.ESTADO = '${vParams.siglaUFMunicipioFinal}' `

  vOrdenacao = '' // default
  if (vParams.ordenacao === 'codigoLinha') vOrdenacao += 'LIN.CODLIN'
  else if (vParams.ordenacao === 'identificaoSituacaoLinha') vOrdenacao += 'LIN.SITUAC'
  else if (vParams.ordenacao === 'descricaoStatusLinha') vOrdenacao += ' CASE WHEN LIN.SITUAC = \'A\' THEN \'ATIVO\' WHEN LIN.SITUAC = \'I\' THEN \'INATIVA\' END '
  else if (vParams.ordenacao === 'codigoPontoInicial') vOrdenacao += 'LIN.PONINI'
  else if (vParams.ordenacao === 'nomeMunicipioInicial') vOrdenacao += 'MUNI.DESCRI'
  else if (vParams.ordenacao === 'siglaUFMunicipioInicial') vOrdenacao += 'MUNI.ESTADO'
  else if (vParams.ordenacao === 'codigoPontoFinal') vOrdenacao += 'LIN.PONFIM'
  else if (vParams.ordenacao === 'nomeMunicipioFinal') vOrdenacao += 'MUNF.DESCRI'
  else if (vParams.ordenacao === 'siglaUFMunicipioFinal') vOrdenacao += 'MUNF.ESTADO'
  else vOrdenacao += ' LIN.CODLIN'

  return dml.executarSQLListar(vParams, vSql.sqlRotaListar(vParams.permissaoFiliais), vFiltro, vOrdenacao)
}

async function obter (pRotaId, pReq) {
  return dml.executarSQLObter(vSql.sqlRotaObter(pReq.query.permissaoFiliais), pRotaId)
}

async function listarTrechos (pRotaId, pReq) {
  const vParams = pReq.query
  const vFiltro = `AND TRE.CODLIN = '${pRotaId}'`
  let vOrdenacao = 'TRE.SEQTRE'

  if (vParams.ordenacao === 'sequenciaTrecho') vOrdenacao = 'TRE.SEQTRE'
  else if (vParams.ordenacao === 'codigoTrecho') vOrdenacao = 'TRE.LINTRE'
  else if (vParams.ordenacao === 'quantidadeKmsTrecho') vOrdenacao = 'TRE.KMTTRE'
  else if (vParams.ordenacao === 'tipoCalculo') vOrdenacao = 'TRE.TIPCAL'

  return dml.executarSQLListar(vParams, vSql.sqlTrechoListar(vParams.permissaoFiliais), vFiltro, vOrdenacao);
}

const functions = {
  listar: (req, res) => listar(req, res),
  obter: (pRotaId, pReq) => obter(pRotaId, pReq),
  listarTrechos: (pRotaId, pReq) => listarTrechos(pRotaId, pReq),
}

export default functions
