import _parceiroTempoMovimentoRepositorio from '../repositorios/parceiroTempoMovimentoRepositorio';

const parceiroTempoMovimentoRepositorio = new _parceiroTempoMovimentoRepositorio();

async function listar(pHubParceiroId, pParams) {
  const vFiltro = {};

  if (pHubParceiroId) vFiltro.hubParceiroId = pHubParceiroId;
  if (pParams.hubFornecedorId) vFiltro.hubFornecedorId = pParams.hubFornecedorId;
  if (pParams.identificacaoClassificacaoVeiculo) vFiltro.identificacaoClassificacaoVeiculo = pParams.identificacaoClassificacaoVeiculo;
  if (pParams.descricaoClassificacaoVeiculo) vFiltro.descricaoClassificacaoVeiculo = pParams.descricaoClassificacaoVeiculo;
  if (pParams.descricaoFornecedor) vFiltro.descricaoFornecedor = pParams.descricaoFornecedor;

  return parceiroTempoMovimentoRepositorio.listar(pParams, vFiltro);
}


async function incluir(body, pOptions) {
  return parceiroTempoMovimentoRepositorio.incluir(body, pOptions);
}


async function obter(pId) {
  return parceiroTempoMovimentoRepositorio.obter(pId);
}

async function excluir(pId) {
  return parceiroTempoMovimentoRepositorio.excluir(pId);
}

async function alterar(pId, pBody, pOptions) {
  return parceiroTempoMovimentoRepositorio.alterar(pId, pBody, pOptions);
}

const functions = {
  excluir: (pId) => excluir(pId),
  listar: (pHubParceiroId, pParams) => listar(pHubParceiroId, pParams),
  incluir: (body) => incluir(body),
  obter: (pId) => obter(pId),
  alterar: (pId, pBody, pOptions) => alterar(pId, pBody, pOptions),
};

export default functions;
