import BaseErro from './base/baseErro';

import { compareAsc } from 'date-fns';

import VeiculoCustoFixoRepositorio from '../repositorios/veiculoCustoFixoRepositorio';


async function listar(pCodigoVeiculo, pParams) {

  const vFiltro = {
    codigoVeiculo: pCodigoVeiculo
  };

  const repositorio = new VeiculoCustoFixoRepositorio();
  const custoFixo = await repositorio.listar(pParams, vFiltro);
  const { totalRegistros, totalRegistrosPagina, dados } = custoFixo;

  if (totalRegistros > 0) {

    let vigenciaCustoFixo = "01/01/1900";
    let status = "Vigente";

    const result = dados.map((elem) => {

      if (new Date(elem.vigenciaCustoFixo) > new Date()) {
        status = "Vigência Futura"
      }
      else if (new Date(elem.vigenciaCustoFixo) > new Date(vigenciaCustoFixo)) {
        vigenciaCustoFixo = new Date(elem.vigenciaCustoFixo)
        status = "Vigência Passada"
      }

      return {
        _id: elem._id,
        vigenciaCustoFixo: elem.vigenciaCustoFixo,
        custoReposicaoFrota: elem.custoReposicaoFrota,
        custoRemuneracaoFrota: elem.custoMotoristaTotal,
        custoMotoristaTotal: elem.custoMotoristaTotal,
        custoFixoTotal: elem.custoFixoTotal,
        custoDocumentosImpostos: elem.custoDocumentosImpostos,
        custoRastreador: elem.custoRastreador,
        custoSeguro: elem.custoSeguro,
        usuarioAlteracao: elem.usuarioAlteracao,
        situacao: status,
      };
    }, 0);

    result.map((elem) => {
      compareAsc(new Date(elem.vigenciaCustoFixo), new Date(vigenciaCustoFixo)) === 0 ? elem.situacao = "Vigente" : elem.vigenciaCustoFixo
    }, 0);

    return {
      totalRegistros,
      totalRegistrosPagina,
      dados: result
    };
  }

  return custoFixo;
}

async function obter(pCustoFixo, req) {
  const repositorio = new VeiculoCustoFixoRepositorio();
  return repositorio.obter(pCustoFixo)
}

async function incluir(pCodigoVeiculo, req) {

  const { usuarioLogado, body } = req;
  body.codigoVeiculo = pCodigoVeiculo;
  body.usuarioInclusao = usuarioLogado.login;
  body.usuarioAlteracao = usuarioLogado.login;

  if (new Date(body.vigenciaCustoFixo) < new Date())
    throw new BaseErro(400, 'InformeDataVigencia');

  const repositorio = new VeiculoCustoFixoRepositorio();
  const vRegistro = await repositorio.listar({}, { codigoVeiculo: pCodigoVeiculo, vigenciaCustoFixo: { $gte: new Date() } });

  if (vRegistro.totalRegistros > 0) {
    throw new BaseErro(400, "VigenciaFuturaJaCadastrada");
  }

  return repositorio.incluir(body);
}

async function alterar(pCustoFixo, req) {

  const { usuarioLogado, body } = req;
  body.usuarioAlteracao = usuarioLogado.login;

  if (new Date(body.vigenciaCustoFixo) < new Date())
    throw new BaseErro(400, 'InformeDataVigencia');

  const repositorio = new VeiculoCustoFixoRepositorio();
  const vRegistro = await repositorio.listar({}, { _id: pCustoFixo, vigenciaCustoFixo: { $gte: new Date() } })

  if (vRegistro.totalRegistros > 0)
    return repositorio.alterar(pCustoFixo, body);
  else
    throw new BaseErro(400, "VigenciaFuturaAtualizada");
}

async function excluir(pCustoFixo) {

  const repositorio = new VeiculoCustoFixoRepositorio();
  const vRegistro = (await repositorio.obter(pCustoFixo)).dados;

  if (vRegistro && vRegistro.vigenciaCustoFixo <= new Date()) throw new BaseErro(400, 'DeletaVigenciaValida');

  return repositorio.excluir(pCustoFixo)
}

const functions = {
  listar: (pCodigoVeiculo, pParams) => { return listar(pCodigoVeiculo, pParams); },
  obter: (pCustoFixo, req) => { return obter(pCustoFixo, req); },
  incluir: (pCodigoVeiculo, req) => { return incluir(pCodigoVeiculo, req) },
  alterar: (pCustoFixo, req) => { return alterar(pCustoFixo, req) },
  excluir: (pCustoFixo) => { return excluir(pCustoFixo) }
}

export default functions;
