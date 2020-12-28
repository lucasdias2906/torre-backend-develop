import urlHub from '../configuracao/hub'
import baseServico from './base/baseServico'
import BaseErro from './base/baseErro'
import veiculoSituacaoRepositorio from '../repositorios/veiculoSituacaoRepositorio'
import regiaoOperacaoServico from './regiaoOperacaoServico'
import RegiaoOperacaoVigencia from '../modelos/regiaoOperacaoVigencia'
import OcorrenciaServico from './ocorrenciaServico'
import utilitarios from '../funcoes/utilitarios'

async function obter(pCodigoVeiculo, req) {
  const vUrl = `${urlHub.veiculo}/${pCodigoVeiculo}`
  return baseServico.hubListar(vUrl, req.query)
}

async function obterParametrosLicencas(pCodigoVeiculo, req) {
  const vUrl = `${urlHub.veiculo}/${pCodigoVeiculo}/parametrosLicencas`
  return baseServico.hubListar(vUrl, req.query)
}

async function listar(req) {
  const vUrl = `${urlHub.veiculo}`
  return baseServico.hubListar(vUrl, req.query)
}

async function listarMarca(req) {
  const vUrl = `${urlHub.veiculo}/marca`
  return baseServico.hubListar(vUrl, [])
}

async function listarTipoVinculo(req) {
  const repositorio = new TipoVinculoRepositorio()
  return repositorio.listar({})
}

async function listarTipoVeiculo(req) {
  const repositorio = new TipoVeiculoRepositorio()
  return repositorio.listar({})
}

async function listarVeiculoSituacao(req) {
  const repositorio = new veiculoSituacaoRepositorio()
  return repositorio.listar({})
}

async function listarModelo(pCodigoVeiculo) {
  const vUrl = `${urlHub.veiculo}/${pCodigoVeiculo}/modelo`
  return baseServico.hubListar(vUrl, [])
}

async function listarClassificacao(req) {
  const vUrl = `${urlHub.classificacao}/V/classificacao`
  return baseServico.hubListar(vUrl, req.query)
}

async function obterClassificacao(pCodigo) {
  const vUrl = `${urlHub.classificacao}/V/classificacao`
  return baseServico.hubObter(vUrl, pCodigo)
}

async function listarOcorrencia(req) {

  if (!req.query.codigoVeiculo) throw new BaseErro(400, 'veiculoOcorrenciaNaoInformado')

  const vParams = req.query

  const vLimite = vParams.limite || 10
  const vPagina = vParams.pagina || 1
  const vDirecao = vParams.direcao || 'DESC'
  const vOrdenacao = vParams.ordenacao || 'dataReferencia'

  req.query.limite = 10000
  req.query.pagina = 1

  let ocorrencias = await Promise.all([
    listarOcorrenciasHub(req),
    listarOcorrenciasTorre(req)
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

async function listarCursosLicencas(pCodigo, pTipoValidade, req) {
  req.query.codigoVeiculo = pCodigo
  const vUrl = `${urlHub.cursoLicenca}/${pTipoValidade}`
  return baseServico.hubListar(vUrl, req.query)
}

async function obterRegiaoOPVigencia(pCodigoRegiaoOperacao, pParams) {
  const vDataIni = new Date('2010-01-01')
  const vVigenciaRegiaoOperacao = pParams.vigenciaRegiaoOperacao ? new Date(pParams.vigenciaRegiaoOperacao) : new Date()

  const [dados] = await RegiaoOperacaoVigencia.find({
    codigoRegiaoOperacao: pCodigoRegiaoOperacao,
    vigenciaRegiaoOperacao: { $gte: vDataIni, $lte: vVigenciaRegiaoOperacao },
  }).sort({ vigenciaRegiaoOperacao: 'desc' }).limit(1)

  return dados
}

async function listarRegiaoOperacao(req) {
  const result = await regiaoOperacaoServico.listar(req)
  return { dados: result.dados }
}


async function listarOcorrenciasHub(req) {
  const vUrl = `${urlHub.ocorrencia}/V/ocorrencias`

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

async function obterTotais(pReq) {
  const vUrl = `${urlHub.veiculo}/totais`
  return baseServico.hubListar(vUrl, pReq.query)
}

const functions = {
  obter: (pCodigoVeiculo, req) => obter(pCodigoVeiculo, req),
  obterParametrosLicencas: (pCodigoVeiculo, req) => obterParametrosLicencas(pCodigoVeiculo, req),
  obterRegiaoOPVigencia: (pCodigoRegiaoOperacao, pParams) => obterRegiaoOPVigencia(pCodigoRegiaoOperacao, pParams),
  listar: (req) => listar(req),
  listarMarca: (req) => listarMarca(req),
  listarTipoVinculo: (req) => listarTipoVinculo(req),
  listarTipoVeiculo: (req) => listarTipoVeiculo(req),
  listarVeiculoSituacao: (req) => listarVeiculoSituacao(req),
  listarModelo: (pMarcaID) => listarModelo(pMarcaID),
  listarClassificacao: (req) => listarClassificacao(req),
  obterClassificacao: (pCodigo) => obterClassificacao(pCodigo),
  listarOcorrencia: (req) => listarOcorrencia(req),
  listarRegiaoOperacao: (req) => listarRegiaoOperacao(req),
  listarCursosLicencas: (pCodigoVeiculo, pTipoValidade, req) => listarCursosLicencas(pCodigoVeiculo, pTipoValidade, req),
  obterTotais: (req) => obterTotais(req)
}

export default functions
