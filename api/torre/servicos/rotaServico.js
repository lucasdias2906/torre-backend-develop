import urlHub from '../configuracao/hub';
import _rotaRepositorio from '../repositorios/rotaRepositorio';
import baseServico from './base/baseServico';
import veiculoServico from './veiculoServico';



const rotaRepositorio = new _rotaRepositorio();

function listar(vReq) {
  const vUrl = `${urlHub.rota}`;
  return baseServico.hubListar(vUrl, vReq.query);
}

function obter(pRotaId, pReq) {
  const vUrl = `${urlHub.rota}`;
  return baseServico.hubObter(vUrl, pRotaId, pReq);
}

function listarTrecho(pRotaId, pReq) {
  const vUrl = `${urlHub.rota}/${pRotaId}/trecho`;
  return baseServico.hubListar(vUrl, pReq.query);
}

async function incluir(body) {
  const vRetorno = await rotaRepositorio.incluir(body);
  return obterDadosComplementar(vRetorno.dados._id);
}

async function alterar(pDadoComplementarId, body) {
  await rotaRepositorio.alterar(pDadoComplementarId, body, {});
  return obterDadosComplementar(pDadoComplementarId);
}

async function excluir(pDadoComplementarId) {
  await rotaRepositorio.excluir(pDadoComplementarId);
  return { ok: true };
}

async function listarDadosComplementares(pHubIdRota, req) {
  const vFiltro = { hubRotaId: pHubIdRota };
  const vParams = req.query;
  const vListaClassificacao = (await veiculoServico.listarClassificacao({})).dados;
  const vListaRotas = (await rotaRepositorio.listar(vParams, vFiltro));

  const vRetorno = vListaRotas.dados.map((elem) => {
    let vClassificacao = vListaClassificacao.filter((item) => {
      return item.codigoClassificacao == elem.hubVeiculoClassificacaoId;
    });

    const vItem = JSON.parse(JSON.stringify(elem));
    vItem["hubVeiculoClassificacaoDescricao"] = (vClassificacao.length > 0 && vClassificacao[0].descricaoClassificacao) ? vClassificacao[0].descricaoClassificacao : null;

    return vItem;
  }, 0);

  return {
    totalRegistros: vListaRotas.totalRegistros,
    totalRegistrosPagina: vListaRotas.totalRegistrosPagina,
    dados: vRetorno
  };

}

async function obterDadosComplementar(pDadoComplementarId) {
  const vRetorno = await rotaRepositorio.obter(pDadoComplementarId);
  const vDadoComplementar = JSON.parse(JSON.stringify(vRetorno));
  if (vDadoComplementar.dados) {
    const vVeiculoClassificacao = await veiculoServico.obterClassificacao(vDadoComplementar.dados.hubVeiculoClassificacaoId);
    vDadoComplementar.dados.hubVeiculoClassificacaoDescricao = vVeiculoClassificacao.dados ? vVeiculoClassificacao.dados.descricaoClassificacao : null;
  }
  return vDadoComplementar;
}

const functions = {
  listar: (req) => { return listar(req) },
  obter: (pRotaId, pReq) => { return obter(pRotaId, pReq) },
  listarTrecho: (pRotaId, pReq) => { return listarTrecho(pRotaId, pReq) },
  incluir: (body) => { return incluir(body) },
  alterar: (pDadoComplementarId, body) => { return alterar(pDadoComplementarId, body) },
  excluir: (pDadoComplementarId) => { return excluir(pDadoComplementarId) },
  listarDadosComplementares: (pHubIdRota, req) => { return listarDadosComplementares(pHubIdRota, req) },
  obterDadosComplementar: (pDadoComplementarId) => { return obterDadosComplementar(pDadoComplementarId) },
}

export default functions;
