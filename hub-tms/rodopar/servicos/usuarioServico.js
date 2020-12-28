const dml = require('../funcoes/dml');
const vSql = require('./usuarioSQL');

async function listarFiliais(pLogin, pEmpresaId) {
    let vFiltro = '';
    let vOrdenacao = '';

    if (pLogin) vFiltro += ` AND OPE.LOGIN = '${pLogin}'`;

    if (pEmpresaId) vFiltro += ` AND EMP.CODEMP = ${pEmpresaId}`;

    vOrdenacao = ` FIL.RAZSOC`; // default

    return dml.executarSQLListar(
        [],
        vSql.sqlUsuarioEmpresaFiliais,
        vFiltro,
        vOrdenacao
    );
}

async function listarEmpresas(pLogin, pEmpresaId) {
    let vFiltro = '';
    let vOrdenacao = '';

    if (pLogin) vFiltro += ` AND OPE.LOGIN = '${pLogin}'`;

    if (pEmpresaId) vFiltro += ` AND EMP.CODEMP = ${pEmpresaId}`;

    vOrdenacao = ` EMP.DESCRI`; // default

    return dml.executarSQLListar(
        [],
        vSql.sqlUsuarioEmpresas,
        vFiltro,
        vOrdenacao
    );
}

async function obtemPorLogin(pLogin) {
    return dml.executarSQLObter(vSql.sqlObtemPorLogin, pLogin);
}

const functions = {
    obtemPorLogin: pLogin => {
        return obtemPorLogin(pLogin);
    },
    listarFiliais: (pLogin, pEmpresaId) => {
        return listarFiliais(pLogin, pEmpresaId);
    },
    listarEmpresas: (pLogin, pEmpresaId) => {
        return listarEmpresas(pLogin, pEmpresaId);
    },
};

module.exports = functions;
