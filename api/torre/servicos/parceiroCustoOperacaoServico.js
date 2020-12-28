import BaseErro from './base/baseErro'
import _parceiroCustoOperacaoRepositorio from '../repositorios/parceiroCustoOperacaoRepositorio'

const parceiroCustoOperacaoRepositorio = new _parceiroCustoOperacaoRepositorio()

async function listar (pHubParceiroId, pParams) {
  const vFiltro = {}

  if (pHubParceiroId) vFiltro.hubParceiroId = pHubParceiroId
  if (pParams.codigoTipoOperacao) vFiltro.codigoTipoOperacao = pParams.codigoTipoOperacao
  if (pParams.identificacaoClassificacaoVeiculo) vFiltro.identificacaoClassificacaoVeiculo = pParams.identificacaoClassificacaoVeiculo
  if (pParams.descricaoTipoOperacao) vFiltro.descricaoTipoOperacao = pParams.descricaoTipoOperacao
  if (pParams.descricaoClassificacaoVeiculo) vFiltro.descricaoClassificacaoVeiculo = pParams.descricaoClassificacaoVeiculo

  return parceiroCustoOperacaoRepositorio.listar(pParams, vFiltro)
}

async function incluir (body) {
  return parceiroCustoOperacaoRepositorio.incluir(body)
}

async function obter (pId) {
  return parceiroCustoOperacaoRepositorio.obter(pId)
}

function excluir (pId, pOptions) {
  return parceiroCustoOperacaoRepositorio.excluir(pId, pOptions)
}

async function alterar (pId, pBody, pOptions) {
  if (JSON.stringify(pBody) === '{}') throw new BaseErro(400, 'Favor informar os campos a serem atualizados!')

  const vCodigoParceiro = pBody.hubParceiroId
  if (vCodigoParceiro) throw new BaseErro(400, 'O Codigo do parceiro não pode ser alterado!')

  return parceiroCustoOperacaoRepositorio.alterar(pId, pBody, pOptions)
}

const functions = {
  listar: (pParceiroId, pParams) => listar(pParceiroId, pParams),
  excluir: (pId) => excluir(pId),
  incluir: (body) => incluir(body),
  obter: (pId) => obter(pId),
  alterar: (pId, pBody, pOptions) => alterar(pId, pBody, pOptions),
}

export default functions
