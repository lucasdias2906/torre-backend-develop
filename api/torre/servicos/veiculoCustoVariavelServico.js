import BaseErro from './base/baseErro';
import veiculoCustoVariavelRepositorio from '../repositorios/veiculoCustoVariavelRepositorio';
import { compareAsc } from 'date-fns';


async function obter(pCustoVariavel, req) {
  const repositorio = new veiculoCustoVariavelRepositorio();
  return repositorio.obter(pCustoVariavel)
}

async function incluir(pCodigoVeiculo, req) {

  const { usuarioLogado, body } = req;
  body.codigoVeiculo = pCodigoVeiculo;
  body.usuarioInclusao = usuarioLogado.login;
  body.usuarioAlteracao = usuarioLogado.login;

  if (new Date(body.dataVigenciaVariavel) < new Date())
    throw new BaseErro(400, 'InformeDataVigencia');

  const repositorio = new veiculoCustoVariavelRepositorio();
  const vRegistro = await repositorio.listar({}, { codigoVeiculo: pCodigoVeiculo, dataVigenciaVariavel: { $gte: new Date() } })

  if (vRegistro.totalRegistros > 0)
    throw new BaseErro(400, "VigenciaFuturaJaCadastrada");

  return await repositorio.incluir(body);
}

async function alterar(pCustoVariavel, req) {

  const { usuarioLogado, body } = req;
  body.usuarioAlteracao = usuarioLogado.login;

  if (new Date(body.dataVigenciaVariavel) < new Date())
    throw new BaseErro(400, 'InformeDataVigencia');

  const repositorio = new veiculoCustoVariavelRepositorio();
  const vRegistro = await repositorio.listar({ _id: pCustoVariavel, dataVigenciaVariavel: { $gte: new Date() } })

  if (vRegistro.totalRegistros > 0)
    return repositorio.alterar(pCustoVariavel, body);
  else
    throw new BaseErro(400, "VigenciaFuturaAtualizada");

}

async function excluir(pCustoVariavel) {

  const repositorio = new veiculoCustoVariavelRepositorio();
  const vRegistro = await repositorio.listar({ _id: pCustoVariavel, dataVigenciaVariavel: { $gte: new Date() } })

  if (vRegistro.totalRegistros > 0)
    return repositorio.excluir(pCustoVariavel)
  else
    throw new BaseErro(400, 'DeletaVigenciaValida');
}

async function listar(pCodigoVeiculo, pParams) {

  const vFiltro = {
    codigoVeiculo: pCodigoVeiculo
  };

  const repositorio = new veiculoCustoVariavelRepositorio();
  const custoVariavel = await repositorio.listar(pParams, vFiltro);
  const { totalRegistros, totalRegistrosPagina, dados } = custoVariavel;

  if (totalRegistros > 0) {

    let dataVigenciaVariavel = "01/01/1900";
    let status = "Vigente";

    const result = dados.map((elem) => {

      if (new Date(elem.dataVigenciaVariavel) > new Date()) {
        status = "Vigência Futura"
      }
      else if (new Date(elem.dataVigenciaVariavel) > new Date(dataVigenciaVariavel)) {
        dataVigenciaVariavel = new Date(elem.dataVigenciaVariavel)
        status = "Vigência Passada"
      }

      return {
        _id: elem._id,
        codigoRegiaoOperacao: elem.codigoRegiaoOperacao,
        dataVigenciaVariavel: elem.dataVigenciaVariavel,
        custoOleoDiesel: elem.custoOleoDiesel,
        custoMediaConsumo: elem.custoMediaConsumo,
        combustivelPorKm: elem.combustivelPorKm,
        custoGalaoArla: elem.custoGalaoArla,
        mediaConsumoArla: elem.mediaConsumoArla,
        arlaPorKm: elem.arlaPorKm,
        custoPneu: elem.custoPneu,
        kmsPorPneu: elem.kmsPorPneu,
        pneuPorKm: elem.pneuPorKm,
        custoLavagem: elem.custoLavagem,
        despesasViagem: elem.despesasViagem,
        comissaoMotorista: elem.comissaoMotorista,
        custoManutencaoKm: elem.custoManutencaoKm,
        usuarioAlteracao: elem.usuarioAlteracao,
        situacao: status,
      };
    }, 0);

    result.map((elem) => {
      compareAsc(new Date(elem.dataVigenciaVariavel), new Date(dataVigenciaVariavel)) === 0 ? elem.situacao = "Vigente" : elem.dataVigenciaVariavel
    }, 0);

    return {
      totalRegistros,
      totalRegistrosPagina,
      dados: result
    };
  }

  return custoVariavel;
}

const functions = {
  obter: (pCustoVariavel, req) => { return obter(pCustoVariavel, req); },
  incluir: (pCodigoVeiculo, req) => { return incluir(pCodigoVeiculo, req) },
  alterar: (pCustoVariavel, req) => { return alterar(pCustoVariavel, req) },
  excluir: (pCustoVariavel) => { return excluir(pCustoVariavel) },
  listar: (pCodigoVeiculo, pParams) => { return listar(pCodigoVeiculo, pParams); }
}

export default functions;
