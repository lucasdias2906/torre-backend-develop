import BaseErro from './base/baseErro'

import _moduloRepositorio from '../repositorios/moduloRepositorio'
import _funcionalidadeRepositorio from '../repositorios/funcionalidadeRepositorio'

const moduloRepositorio = new _moduloRepositorio()
const funcionalidadeRepositorio = new _funcionalidadeRepositorio()

function listar () {
  return moduloRepositorio.listar({}, {})
}

async function listarFuncionalidades (pModuloId) {
  const vRetorno = await funcionalidadeRepositorio.listar({}, { moduloId: pModuloId })
  return vRetorno
}

async function listarTodasFuncionalidades () {
  const vRetorno = await funcionalidadeRepositorio.listar({}, {})
  return vRetorno
}

async function incluir (body) {
  const vModulo = (await moduloRepositorio.listar({}, { nome: body.nome })).dados
  if (vModulo.length > 0) throw new BaseErro(400, 'moduloJaCadastrado')
  return moduloRepositorio.incluir(body, {})
}

async function incluirFuncionalidade (pModuloId, body) {
  body.moduloId = pModuloId
  return funcionalidadeRepositorio.incluir(body, {})
}

const functions = {
  listar: (req) => listar(req),
  listarFuncionalidades: (pId) => listarFuncionalidades(pId),
  listarTodasFuncionalidades: () => listarTodasFuncionalidades(),
  incluir: (body) => incluir(body),
  incluirFuncionalidade: (pModuloId, body) => incluirFuncionalidade(pModuloId, body),
}

export default functions
