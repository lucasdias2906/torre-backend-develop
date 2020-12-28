import empresaSQL from './empresaSQL';

const dml = require('../funcoes/dml');

async function listar(req) {
  const vParams = req.query;

  let vFiltro = '';
  let vOrdenacao = '';

  if (vParams.grupoId) vFiltro += ` AND E.CODGRU= ${vParams.grupoId}`;

  if (vParams.codigoEmpresa) vFiltro += ` AND E.CODEMP = ${vParams.codigoEmpresa}`;

  if (vParams.descricaoEmpresa) vFiltro += ` AND E.DESCRI like '%${vParams.descricaoEmpresa}%'`;

  vOrdenacao = ` E.CODEMP`; // default
  if (vParams.ordenacao === 'codigoEmpresa') vOrdenacao = ` E.CODEMP`;

  return dml.executarSQLListar(
    vParams,
    empresaSQL.sqlEmpresaListar,
    vFiltro,
    vOrdenacao,
  );
}

async function obter(pEmpresaId) {
  return dml.executarSQLObter(empresaSQL.sqlEmpresaObter, pEmpresaId);
}

const functions = {
  listar: (req) => listar(req),
  obter: (pEmpresaId) => obter(pEmpresaId),
};

export default functions;
