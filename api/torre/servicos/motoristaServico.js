import urlHub from '../configuracao/hub'
import baseServico from './base/baseServico'
import OcorrenciaServico from '../servicos/ocorrenciaServico'
import utilitarios from '../funcoes/utilitarios'
import _motoristaRepositorio from '../repositorios/motoristaRepositorio'

const motoristaRepositorio = new _motoristaRepositorio()

async function obterDadosComplementares(pHubMotoristaId) {
  return motoristaRepositorio.obterDadosComplementares(pHubMotoristaId)
}

function listar(req) {
  const vUrl = `${urlHub.motorista}`
  return baseServico.hubListar(vUrl, req.query)
}

function obter(pMotoristaCodigo) {
  const vUrl = `${urlHub.motorista}`
  return baseServico.hubListar(vUrl, { codigoMotorista: pMotoristaCodigo })
}

async function incluirOuAtualizar(body) {
  const vHubMotoristaId = body.codigoMotorista
  const vMotorista = (await motoristaRepositorio.obterDadosComplementares(vHubMotoristaId)).dados

  if (!vMotorista) {
    await motoristaRepositorio.incluir(body)
    return motoristaRepositorio.obterDadosComplementares(vHubMotoristaId)
  }
  delete body.codigoMotorista
  await motoristaRepositorio.alterar(vHubMotoristaId, body, {})
  return motoristaRepositorio.obterDadosComplementares(vHubMotoristaId)
}

function listarClassificacao(pReq) {
  const vUrl = `${urlHub.classificacao}/M/classificacao`
  return baseServico.hubListar(vUrl, pReq.query)
}

function listarStatusGestorRisco(pReq) {
  const vUrl = `${urlHub.motorista}/statusGestorRisco`
  return baseServico.hubListar(vUrl, pReq.query)
}

function listarSituacao(pReq) {
  const vUrl = `${urlHub.motorista}/situacao`
  return baseServico.hubListar(vUrl, pReq.query)
}

function obterDadosPessoais(pMotoristaCodigo) {
  const vUrl = `${urlHub.motorista}`
  return baseServico.hubObter(vUrl, `${pMotoristaCodigo}/dadosPessoais`)
}

function obterOutrasInformacoes(pMotoristaCodigo) {
  const vUrl = `${urlHub.motorista}`
  return baseServico.hubObter(vUrl, `${pMotoristaCodigo}/outrasInformacoes`)
}

function obterDocumentacao(pMotoristaCodigo) {
  const vUrl = `${urlHub.motorista}`
  return baseServico.hubObter(vUrl, `${pMotoristaCodigo}/documentacao`)
}

function listarCursosLicencas(pCodigo, pTipoValidade, pReq) {
  pReq.query.motoristaCodigo = pCodigo
  const vUrl = `${urlHub.cursoLicenca}/${pTipoValidade}`
  return baseServico.hubListar(vUrl, pReq.query)
}

async function listarOcorrencias(pCodigoMotorista, pReq) {
  pReq.query.codigoMotorista = pCodigoMotorista

  if (!pCodigoMotorista) throw new BaseErro(400, 'motoristaOcorrenciaNaoInformado')

  const vParams = pReq.query

  const vLimite = vParams.limite || 10
  const vPagina = vParams.pagina || 1
  const vDirecao = vParams.direcao || 'DESC'
  const vOrdenacao = vParams.ordenacao || 'dataReferencia'

  pReq.query.limite = 10000
  pReq.query.pagina = 1

  let ocorrencias = await Promise.all([
    listarOcorrenciasHub(pReq),
    listarOcorrenciasTorre(pReq)
  ]).then(r => r[0].concat(r[1]))

  const vInicio = (vPagina - 1) * vLimite
  const vFim = vPagina * vLimite

  const result = ocorrencias.map((elem, index) => ({
    numeroLinha: index + 1,
    codigoAdvertencia: elem.codigoAdvertencia,
    dataReferencia: new Date(elem.dataReferencia),
    descricaoMotivo: elem.descricaoMotivo,
    descricaoObservacaoAdvertencia: elem.descricaoObservacaoAdvertencia,
    nomeLancadoPor: elem.nomeLancadoPor
  }))

  let ocorrenciasOrdenadas = utilitarios.ordenar(result, vOrdenacao, vDirecao)

  const totalRegistrosPagina = ocorrenciasOrdenadas.slice(vInicio, vFim).length

  return {
    totalRegistros: ocorrenciasOrdenadas.length,
    totalRegistrosPagina,
    dados: ocorrenciasOrdenadas.slice(vInicio, vFim)
  }
}

function listarGerenciamentoRisco(pMotoristaCodigo, pReq) {
  const vUrl = `${urlHub.motorista}/${pMotoristaCodigo}/gerenciamentoRisco`
  return baseServico.hubListar(vUrl, pReq.query)
}

function listarAnexo(pMotoristaCodigo) {
  const vUrl = `${urlHub.motorista}/${pMotoristaCodigo}/anexo`
  return baseServico.hubListar(vUrl, {})
}

function obterAnexo(pHubAnexoId) {
  const vUrl = `${urlHub.motorista}/anexo`
  return baseServico.hubObter(vUrl, pHubAnexoId)
}

async function listarOcorrenciasHub(req) {
  const vUrl = `${urlHub.ocorrencia}/M/ocorrencias`

  const { totalRegistros, dados } = await baseServico.hubListar(vUrl, req.query)

  if (totalRegistros > 0) {

    let ocorrencias = dados.map((elem) => {

      return {
        codigoAdvertencia: elem.codigoAdvertencia,
        dataReferencia: elem.dataReferencia,
        descricaoMotivo: elem.descricaoMotivo,
        descricaoObservacaoAdvertencia: elem.descricaoObservacaoAdvertencia,
        nomeLancadoPor: elem.nomeLancadoPor
      }
    }, 0)

    return ocorrencias
  }

  return []
}

async function listarOcorrenciasTorre(req) {

  const { totalRegistros, dados } = await OcorrenciaServico.listarOcorrencias(req);

  if (totalRegistros > 0) {

    let ocorrencias = dados.map((elem) => {

      return {
        codigoAdvertencia: elem.codigo,
        dataReferencia: elem.abertura.data,
        descricaoMotivo: elem.descricao ? elem.descricao.toUpperCase() : '',
        descricaoObservacaoAdvertencia: elem.descricaoDetalhada ? elem.descricaoDetalhada.toUpperCase() : '',
        nomeLancadoPor: elem.abertura.usuarioLogin ? elem.abertura.usuarioLogin.toUpperCase() : ''
      }
    }, 0)

    return ocorrencias
  }

  return []
}

function obterTotais(req) {
  const vUrl = `${urlHub.motorista}/totais`
  return baseServico.hubListar(vUrl, req.query)
}

const functions = {
  // funções da base Torre
  obterDadosComplementares: (pHubMotoristaId) => obterDadosComplementares(pHubMotoristaId),
  listar: (req) => listar(req),
  obter: (pMotoristaCodigo) => obter(pMotoristaCodigo),
  incluirOuAtualizar: (body) => incluirOuAtualizar(body),

  // funções da base Hub
  listarClassificacao: (pReq) => listarClassificacao(pReq),
  listarStatusGestorRisco: (pReq) => listarStatusGestorRisco(pReq),
  listarSituacao: (pReq) => listarSituacao(pReq),
  obterDadosPessoais: (pMotoristaCodigo) => obterDadosPessoais(pMotoristaCodigo),
  obterOutrasInformacoes: (pMotoristaCodigo) => obterOutrasInformacoes(pMotoristaCodigo),
  obterDocumentacao: (pMotoristaCodigo) => obterDocumentacao(pMotoristaCodigo),
  listarCursosLicencas: (pMotoristaCodigo, pTipoValidade, pReq) => listarCursosLicencas(pMotoristaCodigo, pTipoValidade, pReq),
  listarOcorrencias: (pMotoristaCodigo, req) => listarOcorrencias(pMotoristaCodigo, req),
  listarGerenciamentoRisco: (pMotoristaCodigo, pReq) => listarGerenciamentoRisco(pMotoristaCodigo, pReq),
  listarAnexo: (pMotoristaCodigo) => listarAnexo(pMotoristaCodigo),
  obterAnexo: (pHubAnexoId) => obterAnexo(pHubAnexoId),
  obterTotais: (req) => obterTotais(req)

}

export default functions
