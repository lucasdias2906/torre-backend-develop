import mongoose from 'mongoose';

import Perfil from '../modelos/perfil';
import PerfilPermissao from '../modelos/perfilPermissao';
import Funcionalidade from '../modelos/funcionalidade';
import Modulo from '../modelos/modulo';


import _perfilPermissaoRepositorio from '../repositorios/perfilPermissaoRepositorio';

const perfilPermissaoRepositorio = new _perfilPermissaoRepositorio();

async function validarJSON(pPerfilId, pPerfilPermissoes) {
  let vMensagem = "";

  if (!Array.isArray(pPerfilPermissoes)) return `Favor passar uma array com as permissões!`;

  for (var item of pPerfilPermissoes) {
    const oPerfilPermissao = new PerfilPermissao(item);
    oPerfilPermissao.perfilId = pPerfilId;
    const x = await oPerfilPermissao.validate().catch(function (err) { vMensagem = err.message; });
  }

  return vMensagem;
}

async function criar(pPerfilId, body) {

  const vPermissoes = body.permissoes;

  // Verifica se foi passado um array com as permissões
  const vValidar = await validarJSON(pPerfilId, vPermissoes);
  if (vValidar != "") throw Error(vValidar);

  // limpa as permissões para sobrepor
  await PerfilPermissao.deleteMany({ perfilId: pPerfilId });

  // se estiver valido, faz a gravação das permissões
  for (var item of vPermissoes) {
    const oPerfilPermissao = new PerfilPermissao(item);
    oPerfilPermissao.perfilId = pPerfilId;
    await oPerfilPermissao.save();
  }

  //await Permissao.collection.insertMany(vPermissoes);

  // retorna o que foi gravado
  return PerfilPermissao.find({ perfilId: pPerfilId });
}

async function listarPorPerfil(pPerfilId) {
  //return PerfilPermissao.find({ perfilId: pPerfilId });

  const vIdValido = mongoose.Types.ObjectId.isValid(pPerfilId);

  if (!vIdValido) return [];

  const vPerfil = await Perfil.findOne({ _id: pPerfilId });

  if (!vPerfil) return [];

  let vRetorno = [];
  let vPermissoes = [];



  let vModulos = await Modulo.find({});

  for (var item of vModulos) {

    vPermissoes = await listarPermissoesPorModulo(pPerfilId, item._id);

    vRetorno.push({
      _id: item._id,
      nome: item.nome,
      permissoes: vPermissoes
    });
  }


  //const vFuncionalidades = await Funcionalidade.find({ moduloId: pModuloId });

  return {
    _id: pPerfilId,
    nome: vPerfil.nome,
    descricao: vPerfil.descricao,
    modulos: vRetorno
  };
}

async function listarPermissoesParaLogin(pPerfilId) {
  const vIdValido = mongoose.Types.ObjectId.isValid(pPerfilId);

  if (!vIdValido) return [];

  const vPerfil = await Perfil.findOne({ _id: pPerfilId });

  if (!vPerfil) return [];

  let vRetorno = [];
  let vPermissoes = [];

  let vModulos = await Modulo.find({});

  for (var item of vModulos) {

    vPermissoes = await listarPermissoesPorModulo(pPerfilId, item._id);

    vPermissoes.map(permissao => {
      vRetorno.push({
        moduloId: item._id,
        funcionalidadeId: permissao.funcionalidadeId,
        permiteConsultar: permissao.permiteConsultar,
        permiteAlterar: permissao.permiteAlterar
      });
    });
  }

  return vRetorno;
}

async function incluir(pPerfilId, pPermissoes) {

  // Verifica se foi passado um array com as permissões
  const vValidar = await validarJSON(pPerfilId, pPermissoes);
  if (vValidar != "") throw Error(vValidar);

  // limpa as permissões para sobrepor
  await PerfilPermissao.deleteMany({ perfilId: pPerfilId });

  // se estiver valido, faz a gravação das permissões
  for (var item of pPermissoes) {
    const oPerfilPermissao = new PerfilPermissao(item);
    oPerfilPermissao.perfilId = pPerfilId;
    await oPerfilPermissao.save();
  }

  //await Permissao.collection.insertMany(vPermissoes);

  // retorna o que foi gravado
  return PerfilPermissao.find({ perfilId: pPerfilId });
}

function alterar(pPerfilId, pPermissoes) {
  return PerfilPermissao.findOneAndUpdate({ _id: pId }, { $set: body }, { new: true });
}

function obter(pId) {
  return PerfilPermissao.find({ _id: pId });
}

function obterPorPerfilModuloFuncionalidade(pPerfilId, pModuloId, pFuncionalidadeId) {
  return perfilPermissaoRepositorio.obterPorPerfilModuloFuncionalidade(pPerfilId, pModuloId, pFuncionalidadeId);
}

function buscarTodos() {
  return PerfilPermissao.find({})
}

async function listarPermissoesPorModulo(pPerfilId, pModuloId) {

  let vPerfil = null
  if (pPerfilId != 0) vPerfil = await Perfil.findOne({ _id: pPerfilId });
  const vModulo = await Modulo.findOne({ _id: pModuloId });

  if (vPerfil === null && pPerfilId != 0) throw Error(`Perfil referente ao id ${pPerfilId} informado não encontrado!`);
  if (vModulo === null) throw Error(`Módulo referente ao id ${pModuloId} informado não encontrado!`);

  const vFuncionalidades = await Funcionalidade.find({ moduloId: pModuloId });
  let vRetorno = [];

  for (var item of vFuncionalidades) {
    // verifica se possui permissão
    var vPerfilPermissao = false;

    if (pPerfilId != 0)
      vPerfilPermissao = await PerfilPermissao.findOne({
        moduloId: pModuloId,
        perfilId: pPerfilId,
        funcionalidadeId: item._id
      });
    var vPermiteAlterar = false;
    var vPermiteConsultar = false;
    var vConfigurado = false;

    if (vPerfilPermissao) {
      vPermiteConsultar = vPerfilPermissao.permiteConsultar ? true : false;
      vPermiteAlterar = vPerfilPermissao.permiteAlterar ? true : false;
      vConfigurado = true;
    }

    vRetorno.push({
      funcionalidadeId: item._id,
      funcionalidadeNome: item.nome,
      // moduloId: item.moduloId,
      permiteConsultar: vPermiteConsultar,
      permiteAlterar: vPermiteAlterar,
      permiteConsultarBloqueado: vPermiteConsultar,
      permiteAlterarBloqueado: vPermiteAlterar,
      configurado: vConfigurado
    }
    );
  }

  return vRetorno;
}

function deletar(id) {
  return PerfilPermissao.deleteOne({ _id: id })
}

function inativar(pId) {
  return PerfilPermissao.findOneAndUpdate({ _id: pId }, { $set: { status: 'Inativo' } }, { new: true });
}


const functions = {
  listarPorPerfil: (pPerfilId) => { return listarPorPerfil(pPerfilId); },
  listarPermissoesParaLogin: (pPerfilId) => { return listarPermissoesParaLogin(pPerfilId); },
  listar: async (pParams) => { return listar(pParams) },
  incluir: async (pPerfilId, pPermissoes) => { return incluir(pPerfilId, pPermissoes); },
  alterar: (pPerfilId, pPermissoes) => { return alterar(pPerfilId, pPermissoes) },
  obter: (pId) => { return obter(pId) },
  buscarTodos: () => { return buscarTodos() },
  listarPermissoesPorModulo: async (pId, body) => { return listarPermissoesPorModulo(pId, body) },
  deletar: (id) => { return deletar(id) },
  inativar: (pId) => { return inativar(pId) },
  obterPorPerfilModuloFuncionalidade: (pPerfilId, pModuloId, pFuncionalidadeId) => { return obterPorPerfilModuloFuncionalidade(pPerfilId, pModuloId, pFuncionalidadeId) },
}

export default functions;
