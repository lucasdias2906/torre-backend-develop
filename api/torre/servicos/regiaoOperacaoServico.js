import BaseErro from './base/baseErro';
import RegiaoOperacaoRepositorio from '../repositorios/regiaoOperacaoRepositorio';
import RegiaoOperacaoViagenciaRepositorio from '../repositorios/regiaoOperacaoVigenciaRepositorio';
import Util from '../funcoes/utilitarios'
import { compareAsc } from 'date-fns';

async function listar(pParams) {

  const vRegiaoOperacao = pParams.regiaoOperacao ? pParams.regiaoOperacao : "";
  const vCodigoRegiaoOperacao = pParams.codigoRegiaoOperacao
  let vFiltro = {};

  if (pParams.codigoRegiaoOperacao) {
    vFiltro = {
      regiaoOperacao: { $regex: '.*' + vRegiaoOperacao + '.*', $options: 'i' },
      codigoRegiaoOperacao: vCodigoRegiaoOperacao
    }
  }
  else
    vFiltro = {
      regiaoOperacao: { $regex: '.*' + vRegiaoOperacao + '.*', $options: 'i' },
    }

  const repositorio = new RegiaoOperacaoRepositorio();
  const result = await repositorio.listar({ ordenacao: 'regiaoOperacao' }, vFiltro);
  return result;
}

async function alterar(pId, body) {

  const repositorio = new RegiaoOperacaoRepositorio();
  const vRegistro = await repositorio.listar({}, { regiaoOperacao: body.regiaoOperacao });

  if (vRegistro.totalRegistros > 0) throw new BaseErro(400, "RegiaoOperacaoJaCadastrada", [body.regiaoOperacao]);

  return repositorio.alterar(pId, body);
}

async function incluir(body) {

  const repositorio = new RegiaoOperacaoRepositorio();
  const vRegistro = await repositorio.listar({}, { regiaoOperacao: body.regiaoOperacao })

  if (vRegistro.totalRegistros > 0) throw new BaseErro(400, "RegiaoOperacaoJaCadastrada", [body.regiaoOperacao]);

  let vCodigoRegiaoOperacao = await Util.obterSequencia('codigoRegiaoOperacao');
  body.codigoRegiaoOperacao = vCodigoRegiaoOperacao;

  return repositorio.incluir(body);
}

async function excluir(pId) {

  const repositorio = new RegiaoOperacaoRepositorio();
  return repositorio.excluir(pId)
}

async function obterRegiaoOperacaoVigencia(pCodigoRegiaoOPVigencia) {
  const repositorio = new RegiaoOperacaoViagenciaRepositorio();
  return repositorio.obter(pCodigoRegiaoOPVigencia);
}

async function incluirRegiaoOperacaoVigencia(pCodigoRegiaoOperacao, body) {

  const repositorio = new RegiaoOperacaoViagenciaRepositorio();
  const vRegistro = await repositorio.listar({}, { codigoRegiaoOperacao: pCodigoRegiaoOperacao, vigenciaRegiaoOperacao: { $gte: new Date() } });

  if (vRegistro.totalRegistros > 0) {
    throw new BaseErro(400, "VigenciaFuturaJaCadastrada");
  } else if (new Date(body.vigenciaRegiaoOperacao) < new Date()) {
    throw new BaseErro(400, 'InformeDataVigencia');
  }

  body.codigoRegiaoOperacao = pCodigoRegiaoOperacao;
  return repositorio.incluir(body);
}

async function alterarRegiaoOperacaoVigencia(pCodigoRegiaoOPVigencia, body) {

  const repositorio = new RegiaoOperacaoViagenciaRepositorio();
  const vRegistro = await repositorio.listar({}, { _id: pCodigoRegiaoOPVigencia, vigenciaRegiaoOperacao: { $gte: new Date() } })

  if (new Date(body.vigenciaRegiaoOperacao) < new Date())
    throw new BaseErro(400, 'InformeDataVigencia');

  if (vRegistro.totalRegistros > 0)
    return repositorio.alterar(pCodigoRegiaoOPVigencia, body);
  else
    throw new BaseErro(400, "VigenciaFuturaAtualizada");
}

async function listarRegiaoOperacaoVigencia(pCodigoRegiaoOperacao, pParams) {

  let vFiltro = {
    codigoRegiaoOperacao: pCodigoRegiaoOperacao
  };

  const repositorio = new RegiaoOperacaoViagenciaRepositorio();
  const regiaoOperacaoVigencia = await repositorio.listar(pParams, vFiltro);
  const { totalRegistros, totalRegistrosPagina, dados } = regiaoOperacaoVigencia;

  if (totalRegistros > 0) {

    let vigenciaRegiaoOperacao = "01/01/2010";
    let status = "Vigente";

    const result = dados.map((elem) => {

      if (new Date(elem.vigenciaRegiaoOperacao) > new Date()) {
        status = "Vigência Futura"
      }
      else if (new Date(elem.vigenciaRegiaoOperacao) > new Date(vigenciaRegiaoOperacao)) {
        vigenciaRegiaoOperacao = new Date(elem.vigenciaRegiaoOperacao)
        status = "Vigência Passada"
      }

      return {
        codigoRegiaoOPVigencia: elem._id,
        vigenciaRegiaoOperacao: elem.vigenciaRegiaoOperacao,
        codigoRegiaoOperacao: elem.codigoRegiaoOperacao,
        custoOleoDiesel: elem.custoOleoDiesel,
        custoGalaoArla: elem.custoGalaoArla,
        custoLavagem: elem.custoLavagem,
        despesasViagem: elem.despesasViagem,
        situacao: status,
      };
    }, 0);

    result.map((elem) => {
      compareAsc(new Date(elem.vigenciaRegiaoOperacao), new Date(vigenciaRegiaoOperacao)) === 0 ? elem.situacao = "Vigente" : elem.vigenciaRegiaoOperacao
    }, 0);

    return {
      totalRegistros,
      totalRegistrosPagina,
      dados: result
    };
  }

  return regiaoOperacaoVigencia;
}

async function excluirRegiaoOperacaoVigencia(pCodigoRegiaoOPVigencia) {

  const repositorio = new RegiaoOperacaoViagenciaRepositorio();
  const vRegistro = await repositorio.listar({}, { _id: pCodigoRegiaoOPVigencia, vigenciaRegiaoOperacao: { $gte: new Date() } })

  if (vRegistro.totalRegistros > 0)
    return repositorio.excluir(pCodigoRegiaoOPVigencia)
  else
    throw new BaseErro(400, 'DeletaVigenciaValida');
}

const functions = {
  incluir: (body) => { return incluir(body) },
  alterar: (pId, body) => { return alterar(pId, body) },
  excluir: (pId) => { return excluir(pId) },
  listar: (pParams) => { return listar(pParams); },
  obterRegiaoOperacaoVigencia: (pCodigoRegiaoOPVigencia) => { return obterRegiaoOperacaoVigencia(pCodigoRegiaoOPVigencia) },
  incluirRegiaoOperacaoVigencia: (pCodigoRegiaoOperacao, pParams) => { return incluirRegiaoOperacaoVigencia(pCodigoRegiaoOperacao, pParams) },
  alterarRegiaoOperacaoVigencia: (pCodigoRegiaoOPVigencia, body) => { return alterarRegiaoOperacaoVigencia(pCodigoRegiaoOPVigencia, body) },
  listarRegiaoOperacaoVigencia: (pCodigoRegiaoOperacao, pParams) => { return listarRegiaoOperacaoVigencia(pCodigoRegiaoOperacao, pParams); },
  excluirRegiaoOperacaoVigencia: (pCodigoRegiaoOPVigencia) => { return excluirRegiaoOperacaoVigencia(pCodigoRegiaoOPVigencia) },
}

export default functions;
