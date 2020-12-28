import BaseErro from './base/baseErro';

import _perfilRepositorio from '../repositorios/perfilRepositorio';

const perfilRepositorio = new _perfilRepositorio();

async function listar(pParams) {
  const vNome = pParams.nome ? pParams.nome : "";
  const vDescricao = pParams.descricao ? pParams.descricao : "";

  const vFiltro = {
    nome: { $regex: '.*' + vNome + '.*', $options: 'i' },
    descricao: { $regex: '.*' + vDescricao + '.*', $options: 'i' }
  };

  return perfilRepositorio.listar(pParams, vFiltro);
}

async function obter(pId) {
  return perfilRepositorio.obter(pId);
}

async function incluir(body) {
  let vPerfilIdSalvo = '';

  if (await perfilRepositorio.perfilNomeExiste(body.nome)) throw new BaseErro(400, 'perfilJaExiste', [body.nome]);

  vPerfilIdSalvo = await perfilRepositorio.incluir(body, {});

  return obter(vPerfilIdSalvo.dados._id);
}

async function alterar(pId, body) {
  body._id = pId;
  await perfilRepositorio.alterar(pId, body, {});
  return obter(pId);
}

async function alterarStatus(pId) {
  const vPerfil = await perfilRepositorio.obter(pId);
  if (vPerfil.dados === null) throw new BaseErro(400, 'perfilNaoEncontrado');
  return perfilRepositorio.alterarStatus(pId, {});
}


const functions = {
  listar: async (pParams) => { return listar(pParams) },
  obter: (pId) => { return obter(pId) },
  incluir: async (body) => { return incluir(body) },
  alterar: async (pId, body) => { return alterar(pId, body) },
  alterarStatus: async (pId) => { return alterarStatus(pId) }
}

export default functions;
