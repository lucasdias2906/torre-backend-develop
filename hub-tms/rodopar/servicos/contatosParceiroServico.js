import dml from '../funcoes/dml';
import sql from './contatosParceirolSQL';

async function listaParceiros(req) {
    const vParams = req.query;
    let vFiltro = '';
    let vOrdenacao = '';

    if (vParams.codigoparceirocomercial)
        vFiltro += ` AND CLI.CODCLIFOR = ${vParams.codigoparceirocomercial}`;
    if (vParams.nomerazaosocial)
        vFiltro += ` AND CLI.RAZSOC LIKE '%${vParams.nomerazaosocial}%'`;
    if (vParams.numerocnpj)
        vFiltro += ` AND (CLI.CODCGC = '${vParams.numerocnpj}' or CLI.CODCGC = '${vParams.numerocnpj}.replace(/[^\d]+/g,'')')`;

    vOrdenacao = '';
    if (vParams.ordenacao === 'codigoparceirocomercial')
        vOrdenacao += ` CLI.CODCLIFOR`;
    else if (vParams.ordenacao == 'nomerazaosocial')
        vOrdenacao += ` CLI.RAZSOC`;
    else if (vParams.ordenacao === 'numerocnpj') vOrdenacao += `CLI.CODCGC`;
    else vOrdenacao += ` CLI.CODCLIFOR`;

    const resultSql = await dml.executarSQLListar(
        vParams,
        sql.sqlparceiroComercialDetalhes,
        vFiltro,
        vOrdenacao
    );

    const { totalRegistros, totalRegistrosPagina, dados } = resultSql;

    const result = dados.map(function(elem) {
        return {
            'parceiro.codigoparceirocomercial':
                elem.parceiro.codigoParceiroComercial,
            'parceiro.numeroCNPJ': elem.parceiro.numeroCNPJ,
            'parceiro.nomeRazaoSocial': elem.parceiro.nomeRazaoSocial,
        };
    }, 0);

    return {
        totalRegistros,
        totalRegistrosPagina,
        dados: result,
    };
}

async function listarDetalhes(req) {
    const vParams = req.query;
    let vFiltro = '';
    let vOrdenacao = '';

    if (vParams.codigoparceirocomercial)
        vFiltro += ` AND CLI.CODCLIFOR = ${vParams.codigoparceirocomercial}`;
    if (vParams.nomerazaosocial)
        vFiltro += ` AND CLI.RAZSOC LIKE '%${vParams.nomerazaosocial}%'`;
    if (vParams.numerocnpj)
        vFiltro += ` AND (CLI.CODCGC = '${vParams.numerocnpj}' or CLI.CODCGC = '${vParams.numerocnpj}.replace(/[^\d]+/g,'')')`;

    vOrdenacao = '';
    if (vParams.ordenacao == 'codigoparceirocomercial')
        vOrdenacao += ` CLI.CODCLIFOR`;
    else if (vParams.ordenacao == 'nomerazaosocial')
        vOrdenacao += ` CLI.RAZSOC`;
    else if (vParams.ordenacao == 'numerocnpj') vOrdenacao += `CLI.CODCGC`;
    else vOrdenacao += ` CLI.CODCLIFOR`;

    return dml.executarSQLListar(
        vParams,
        sql.sqlparceiroComercialDetalhes,
        vFiltro,
        vOrdenacao
    );
}

async function obterContato(req) {
    const vParams = req.query;
    let vFiltro = '';
    let vOrdenacao = '';

    if (vParams.codigoparceirocomercial)
        vFiltro += ` AND CLI.CODCLIFOR = ${vParams.codigoparceirocomercial}`;
    if (vParams.nomerazaosocial)
        vFiltro += ` AND CLI.RAZSOC LIKE '%${vParams.nomerazaosocial}%'`;
    if (vParams.numerocnpj)
        vFiltro += ` AND (CLI.CODCGC = '${vParams.numerocnpj}' or CLI.CODCGC = '${vParams.numerocnpj}.replace(/[^\d]+/g,'')')`;

    vOrdenacao = '';
    if (vParams.ordenacao == 'codigoparceirocomercial')
        vOrdenacao += ` CLI.CODCLIFOR`;
    else if (vParams.ordenacao == 'nomerazaosocial')
        vOrdenacao += ` CLI.RAZSOC`;
    else if (vParams.ordenacao == 'numerocnpj') vOrdenacao += `CLI.CODCGC`;
    else vOrdenacao += ` CLI.CODCLIFOR`;

    return dml.executarSQLListar(
        vParams,
        sql.sqlContatoParceiroListar,
        vFiltro,
        vOrdenacao
    );
}

const parceiroComercialServico = {
    listaParceiros: req => {
        return listaParceiros(req);
    },
    listarDetalhes: req => {
        return listarDetalhes(req);
    },
    obterContato: req => {
        return obterContato(req);
    },
};

export default parceiroComercialServico;
