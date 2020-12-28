import dml from '../funcoes/dml'
import motoristaSQL from './motoristaSQL'

async function listar(req) {
  const vParams = req.query

  let vFiltro = ''
  let vOrdenacao = ''

  if (vParams.codigoMotorista) vFiltro += ` AND MOT.CODMOT = ${vParams.codigoMotorista}`

  if (vParams.codigoClassificacao) vFiltro += ` AND MOT.CODCMO = '${vParams.codigoClassificacao}'`

  if (vParams.nomeMotorista) vFiltro += ` AND MOT.NOMMOT LIKE '%${vParams.nomeMotorista}%'`

  vParams.numeroCPF = vParams.numeroCPF ? vParams.numeroCPF.replace(/[.-]+/g, '') : vParams.numeroCPF
  if (vParams.numeroCPF) vFiltro += ` AND REPLACE(REPLACE(MOT.NUMCPF, '.', ''),'-','')  LIKE '%${vParams.numeroCPF}%'`

  if (vParams.identificacaoStatusGestoraRisco) {
    vFiltro += ` AND (SELECT GR.SITUAC FROM RODGRI GR
            WHERE GR.CODMOT  = MOT.CODMOT
              AND GR.ID_CODGRI IN (SELECT
                               MAX(GRI.ID_CODGRI)
                        FROM RODGRI GRI
                        WHERE GRI.CODMOT = MOT.CODMOT)) LIKE '${vParams.identificacaoStatusGestoraRisco}'`
  }

  if (vParams.codigoSituacao) vFiltro += ` AND MOT.SITUAC = '${vParams.codigoSituacao}'`

  vOrdenacao = '  MOT.CODMOT' // default
  if (vParams.ordenacao === 'codigoMotorista') vOrdenacao = '  MOT.CODMOT'
  if (vParams.ordenacao === 'codigoClassificacao') vOrdenacao = '  CMO.CODCMO'
  if (vParams.ordenacao === 'descricaoClassificacao') vOrdenacao = '  CMO.DESCRI'
  if (vParams.ordenacao === 'nomeMotorista') vOrdenacao = '  MOT.NOMMOT'
  if (vParams.ordenacao === 'numeroCPF') vOrdenacao = '  MOT.NUMCPF'
  if (vParams.ordenacao === 'identificacaoStatusGestoraRisco') {
    vOrdenacao = ` (SELECT GR.SITUAC FROM RODGRI GR
                                         WHERE GR.CODMOT  = MOT.CODMOT
                                           AND GR.ID_CODGRI IN (SELECT
                                               MAX(GRI.ID_CODGRI)
                                           FROM RODGRI GRI
                                           WHERE GRI.CODMOT = MOT.CODMOT))`
  }
  if (vParams.ordenacao === 'codigoSituacao') vOrdenacao = '  MOT.SITUAC'
  if (vParams.ordenacao === 'descricaoSituacao') {
    vOrdenacao = `CASE WHEN MOT.SITUAC = 'A' THEN 'ATIVO'
                                                                    WHEN MOT.SITUAC = 'I' THEN 'INATIVO'
                                                                    WHEN MOT.SITUAC = 'L' THEN 'AGUARDANDO LIBERACAO'
                                                                END`
  }

  return dml.executarSQLListar(
    vParams,
    motoristaSQL.sqlMotoristaListar(vParams.permissaoFiliais),
    vFiltro,
    vOrdenacao,
  )
}

async function listarClassificacao(req) {
  const vParams = req.query

  let vOrdenacao = ' CMO.DESCRI'

  if (vParams.ordenacao === 'codigoClassificacao') vOrdenacao = ' CMO.CODCMO'
  if (vParams.ordenacao === 'descricaoClassificacao') vOrdenacao = ' CMO.DESCRI'

  return dml.executarSQLListar(
    [],
    motoristaSQL.sqlMotoristaClassificacao,
    {},
    vOrdenacao,
  )
}

async function listarStatusGestorRisco(req) {
  const vParams = req.query

  let vOrdenacao = ' identificacaoStatusGestoraRisco'

  if (vParams.ordenacao === 'identificacaoStatusGestoraRisco') vOrdenacao = ' identificacaoStatusGestoraRisco'
  if (vParams.ordenacao === 'descricaoStatusGestoraRisco') vOrdenacao = ' descricaoStatusGestoraRisco'

  return dml.executarSQLListar(
    [],
    motoristaSQL.sqlMotoristaStatusGestoraRisco,
    {},
    vOrdenacao,
  )
}

async function listarSituacao() {
  const vOrdenacao = ' codigoSituacao'
  return dml.executarSQLListar(
    [],
    motoristaSQL.sqlMotoristaSituacao,
    {},
    vOrdenacao,
  )
}

async function obterDadosPessoais(pMotoristaCodigo, pReq) {
  return dml.executarSQLObter(
    motoristaSQL.sqlMotoristaObterDadosPessoais(pReq.query.permissaoFiliais),
    pMotoristaCodigo,
  )
}

async function obterOutrasInformacoes(pMotoristaCodigo, pReq) {
  return dml.executarSQLObter(
    motoristaSQL.sqlMotoristaObterOutrasInformacoes(pReq.query.permissaoFiliais),
    pMotoristaCodigo,
  )
}

async function obterDocumentacao(pMotoristaCodigo, pReq) {
  return dml.executarSQLObter(
    motoristaSQL.sqlMotoristaObterDocumentacao(pReq.query.permissaoFiliais),
    pMotoristaCodigo,
  )
}

async function listarGerenciamentoRisco(pMotoristaCodigo, req) {
  const vParams = req.query
  const vFiltro = `AND GRI.CODMOT = ${pMotoristaCodigo}`
  let vOrdenacao = 'GRI.CODGRI'

  if (vParams.ordenacao === 'codigoGerenciadorRisco') vOrdenacao = 'GRI.CODGRI'
  else if (vParams.ordenacao === 'nomeGestoraRisco') vOrdenacao = 'CLI.NOMEAB'
  else if (vParams.ordenacao === 'numeroCAD') vOrdenacao = 'GRI.CODGER'
  else if (vParams.ordenacao === 'tipoPadroGR') vOrdenacao = 'GRI.TIPGRI'
  else if (vParams.ordenacao === 'identificacaoStatusGestorRisco') vOrdenacao = 'GRI.SITUAC'
  else if (vParams.ordenacao === 'descricaoStatusGestorRisco') {
    vOrdenacao = `CASE WHEN GRI.SITUAC = 'INAP' THEN 'INAPTO'
                                                                             WHEN GRI.SITUAC = 'APTO' THEN 'APTO'
                                                                             WHEN GRI.SITUAC = 'ALPV' THEN 'AGUARDANDO LIB. PROX. VIAGEM'
                                                                             WHEN GRI.SITUAC = 'APTR' THEN 'APTO, COM RESTRIÇÕES'
                                                                             WHEN GRI.SITUAC = 'INAI' THEN 'INAPTO, INSUFICENCIA DE DADOS'
                                                                             END`
  } else if (vParams.ordenacao === 'dataValidade') vOrdenacao = 'GRI.DATVAL'
  else if (vParams.ordenacao === 'dataGeracaoRisco') vOrdenacao = 'GRI.DATGER'
  else if (vParams.ordenacao === 'descricaoObservacaoGestorRisco') vOrdenacao = 'GRI.GEROBS'

  return dml.executarSQLListar(
    vParams,
    motoristaSQL.sqlMotoristaListarGerenciamentoRisco(vParams.permissaoFiliais),
    vFiltro,
    vOrdenacao,
  )
}

async function listarAnexo(pMotoristaCodigo, req) {
  const vParams = req.query

  let vOrdenacao = 'IMO.CODIMO'
  const vWhere = `AND IMO.CODMOT = ${pMotoristaCodigo}`

  if (vParams.ordenacao === 'codigoImagemMotorista') vOrdenacao = 'IMO.CODIMO'
  if (vParams.ordenacao === 'nomeDocumento') vOrdenacao = 'IMO.CAMFOT'

  return dml.executarSQLListar(
    vParams,
    motoristaSQL.sqlMotoristaListarAnexo(vParams.permissaoFiliais),
    vWhere,
    vOrdenacao,
  )
}

async function obterAnexo(pHubAnexoId, pReq) {
  return dml.executarSQLObter(
    motoristaSQL.sqlMotoristaObterAnexo(pReq.query.permissaoFiliais),
    pHubAnexoId,
  )
}

async function obterTotais(pReq) {
  let vFiltro

  if (pReq.query.totais == 'CLASSIFICACOES') {
    vFiltro = 'MOT.CODCMO IN (5,6,8) AND MOT.SITUAC = \'A\''
  } else {
    vFiltro = 'MOT.SITUAC IN(\'I\',\'A\',\'L\')'
  }

  return dml.executarSQLObter(
    motoristaSQL.sqlTotais(pReq.query.permissaoFiliais, vFiltro),
  )
}

const motoristaServico = {
  listar: (req) => listar(req),
  listarClassificacao: (req) => listarClassificacao(req),
  listarStatusGestorRisco: (req) => listarStatusGestorRisco(req),
  listarSituacao: () => listarSituacao(),
  obterDadosPessoais: (pMotoristaCodigo, pReq) => obterDadosPessoais(pMotoristaCodigo, pReq),
  obterOutrasInformacoes: (pMotoristaCodigo, pReq) => obterOutrasInformacoes(pMotoristaCodigo, pReq),
  obterDocumentacao: (pMotoristaCodigo, pReq) => obterDocumentacao(pMotoristaCodigo, pReq),
  listarGerenciamentoRisco: (pMotoristaCodigo, pReq) => listarGerenciamentoRisco(pMotoristaCodigo, pReq),
  listarAnexo: (pMotoristaCodigo, pReq) => listarAnexo(pMotoristaCodigo, pReq),
  obterAnexo: (pHubAnexoId, pReq) => obterAnexo(pHubAnexoId, pReq),
  obterTotais: (pReq) => obterTotais(pReq),
}

export default motoristaServico
