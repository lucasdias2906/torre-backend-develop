const dml = require('../funcoes/dml');
const vSql = require('./filialSQL');

async function listar(req) {
    const vParams = req.query;

    let vFiltro = '';
    let vOrdenacao = '';

    if (vParams.nomeRazaoSocial)
        vFiltro += ` AND FIL.RAZSOC like '%${vParams.nomeRazaoSocial}%'`;

    if (vParams.codigoFilial) vFiltro += ` AND FIL.CODFIL = ${vParams.CODFIL}`;

    vOrdenacao = ` FIL.CODFIL`; // default
    if (vParams.ordenacao === 'codigoFilial') vOrdenacao = ` FIL.CODFIL`;

    return dml.executarSQLListar(
        vParams,
        vSql.sqlFilialListar,
        vFiltro,
        vOrdenacao
    );
}

async function listarPorEmpresa(req, pEmpresaId) {
    const vParams = req.query;
    let vFiltro = ` AND  FIL.CODEMP = ${pEmpresaId}`;
    let vOrdenacao = '';

    if (vParams.nomeRazaoSocial)
        vFiltro += ` AND FIL.RAZSOC like '%${vParams.nomeRazaoSocial}%'`;

    if (vParams.codigoFilial)
        vFiltro += ` AND FIL.CODFIL = ${vParams.codigoFilial}`;

    vOrdenacao = ` FIL.CODFIL`; // default

    return dml.executarSQLListar(
        vParams,
        vSql.sqlFilialListar,
        vFiltro,
        vOrdenacao
    );
}

async function obter(pFilialCodigo) {
    return dml.executarSQLObter(vSql.sqlFilialObter, pFilialCodigo);
}

const functions = {
    listar: (body, res) => {
        return listar(body, res);
    },
    listarPorEmpresa: (req, pEmpresaId) => {
        return listarPorEmpresa(req, pEmpresaId);
    },
    obter: pFilialCodigo => {
        return obter(pFilialCodigo);
    },
};

export default functions;
