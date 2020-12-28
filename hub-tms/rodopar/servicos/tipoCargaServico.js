const dml = require('../funcoes/dml');
const vSql = require('./tipoCargaSQL');

async function listar(req) {
    const vParams = req.query;

    const vFiltro = '';
    let vOrdenacao = '';

    vOrdenacao = ` ptc.DESCRI`;
    if (vParams.ordenacao === '"codigoTipoOperacao"')
        vOrdenacao = ` ptc.CODPTC`;

    console.log('Antes executarSQLListar-tipoCargaServico.js');

    return dml.executarSQLListar(
        vParams,
        vSql.sqlTipoCargaListar,
        vFiltro,
        vOrdenacao
    );
}

async function obter(pTpCargaId) {
    return dml.executarSQLObter(vSql.sqlTipoCargaObter, pTpCargaId);
}

const functions = {
    listar: (body, res) => {
        return listar(body, res);
    },
    obter: pTpCargaId => {
        return obter(pTpCargaId);
    },
};

module.exports = functions;
