import BaseErro from './base/baseErro';
import _parceiroTempoLimiteRepositorio from '../repositorios/parceiroTempoLimiteRepositorio';

const parceiroTempoLimiteRepositorio = new _parceiroTempoLimiteRepositorio();

async function listar(pHubParceiroId) {
  const vFiltro = { hubParceiroId: pHubParceiroId }

  return await parceiroTempoLimiteRepositorio.obterPorParceiro(vFiltro)
}

async function incluir(body) {
  return parceiroTempoLimiteRepositorio.incluir(body);
}

async function obter(pId) {
  return parceiroTempoLimiteRepositorio.obter(pId);
}

function excluir(pId, pOptions) {
  return parceiroTempoLimiteRepositorio.excluir(pId, pOptions);
}

async function alterar(pId, pBody, pOptions) {
  if (JSON.stringify(pBody) === '{}') throw new BaseErro(400, 'Favor informar os campos a serem atualizados!');

  const vCodigoParceiro = pBody.hubParceiroId;
  if (vCodigoParceiro) throw new BaseErro(400, 'O Codigo do parceiro não pode ser alterado!');

  return parceiroTempoLimiteRepositorio.alterar(pId, pBody, pOptions);
}

const functions = {
  listar: (pParceiroId) => listar(pParceiroId),
  excluir: (pId) => excluir(pId),
  incluir: (body) => incluir(body),
  obter: (pId) => obter(pId),
  alterar: (pId, pBody, pOptions) => alterar(pId, pBody, pOptions),
};

export default functions;
