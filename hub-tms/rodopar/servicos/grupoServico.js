const dml = require('../funcoes/dml');
const vSql = require('./grupoSQL');
const empresaServico = require('../servicos/empresaServico');

async function listar(req) {
    const vParams = req.query;

    let vFiltro = '';
    let vOrdenacao = '';

    if (vParams.grupoEmpresaDescricao)
        vFiltro += ` AND G.DESCRI like '%${vParams.grupoEmpresaDescricao}%'`;

    vOrdenacao = ` G.CODEMP`; // default
    if (vParams.ordenacao === 'codigoGrupoEmpresa') vOrdenacao = ` G.CODEMP`;

    return dml.executarSQLListar(
        vParams,
        vSql.sqlGrupoListar,
        vFiltro,
        vOrdenacao
    );
}

async function listarEmpresas(req, pGrupoId) {
    return empresaServico.listar(req, pGrupoId);
}

async function obter(pGrupoId) {
    return dml.executarSQLObter(vSql.sqlGrupoObter, pGrupoId);
}

const functions = {
    listar: (body, res) => {
        return listar(body, res);
    },
    obter: pGrupoId => {
        return obter(pGrupoId);
    },
    listarEmpresas: (req, pGrupoId) => {
        return listarEmpresas(req, pGrupoId);
    },
};

module.exports = functions;
