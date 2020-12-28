import urlHub from '../configuracao/hub'
import BaseErro from './base/baseErro'
import rota from './rotaServico'
import ParceiroRotaRepositorio from '../repositorios/parceiroRotaRepositorio'

const parceiroRotaRepositorio = new ParceiroRotaRepositorio()

async function listar (phubParceiroId, pParams) {
  const vFiltro = {}

  if (phubParceiroId) vFiltro.hubParceiroId = phubParceiroId
  return parceiroRotaRepositorio.listar(pParams, vFiltro)
}

async function listarRotaDetalhe (phubParceiroId, pParams) {
  const vFiltro = {}

  if (phubParceiroId) vFiltro.hubParceiroId = phubParceiroId
  if (pParams.hubParceiroId) vFiltro.hubParceiroId = pParams.hubParceiroId
  if (pParams.hubRotaId) vFiltro.hubRotaId = pParams.hubRotaId
  if (pParams.identificaoSituacaoLinha) vFiltro.identificaoSituacaoLinha = pParams.identificaoSituacaoLinha
  if (pParams.codigoPontoInicial) vFiltro.codigoPontoInicial = pParams.codigoPontoInicial
  if (pParams.nomeMunicipioInicial) vFiltro.nomeMunicipioInicial = pParams.nomeMunicipioInicial
  if (pParams.codigoPontoFinal) vFiltro.codigoPontoFinal = pParams.codigoPontoFinal
  if (pParams.nomeMunicipioFinal) vFiltro.nomeMunicipioFinal = pParams.nomeMunicipioFinal

  const result = await parceiroRotaRepositorio.listar(pParams, vFiltro)

  let pRotaId = ''
  let dadosRota = {}
  const vUrl = `${urlHub.rota}`

  for (var p in result.dados) {
    if (result.dados.hasOwnProperty(p)) {
      pRotaId = result.dados[p].hubRotaId;

      dadosRota = await rota.obter(pRotaId);

      result.dados[p] = {
        _id: result.dados[p]._id,
        hubParceiroId: result.dados[p].hubParceiroId,
        hubRotaId: result.dados[p].hubRotaId,
        identificaoSituacaoLinha: result.dados[p].identificaoSituacaoLinha,
        codigoPontoInicial: result.dados[p].codigoPontoInicial,
        nomeMunicipioInicial: result.dados[p].nomeMunicipioInicial,
        nomeMunicipioFinal: result.dados[p].nomeMunicipioFinal,
        codigoPontoFinal: result.dados[p].codigoPontoFinal,
        dataInclusao: result.dados[p].dataInclusao,
        dataAlteracao: result.dados[p].dataAlteracao,
        siglaUFMunicipioInicial: dadosRota.dados.siglaUFMunicipioInicial,
        siglaUFMunicipioFinal: dadosRota.dados.siglaUFMunicipioFinal,
        quantidadeKmsPadrao: dadosRota.dados.quantidadeKmsPadrao,
      }

    }

  }

  return result

}

async function obter (pId) {
  return parceiroRotaRepositorio.obter(pId)
}

async function incluir (body) {
  return parceiroRotaRepositorio.incluir(body, {})
}

async function excluir (id) {
  return parceiroRotaRepositorio.excluir(id, {})
}

async function alterar (pId, body) {
  if (JSON.stringify(body) === '{}') throw new BaseErro(400, 'Favor informar os campos a serem atualizados!');

  const vCodigoFornecedor = body.hubParceiroId
  if (vCodigoFornecedor) throw new BaseErro(400, 'O Codigo do fornecedor não pode ser alterado!');

  return parceiroRotaRepositorio.alterar(pId, body, {})
}

const functions = {
  listar: (phubParceiroId, pParams) => listar(phubParceiroId, pParams),
  obter: (pId) => obter(pId),
  incluir: (body) => incluir(body),
  excluir: (id) => excluir(id),
  alterar: (pId, body) => alterar(pId, body),
  listarRotaDetalhe: (phubParceiroId, pParams) => listarRotaDetalhe(phubParceiroId, pParams),
}

export default functions
