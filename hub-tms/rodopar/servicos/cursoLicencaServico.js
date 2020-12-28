import dml from '../funcoes/dml';
import util from '../funcoes/util';
import cursoLicencaSQL from './cursoLicencaSQL';

async function listar(pTipoValidade, req) {
    const vParams = req.query;
    let vFiltro = '';

    const vDataInicialValidade = util.converterData(
        vParams.dataInicialValidade
    );
    const vDataFinalValidade = util.converterData(vParams.dataFinalValidade);
    const vMotoristaCodigo = vParams.motoristaCodigo;
    const vCodigoVeiculo = vParams.codigoVeiculo;


    if (vParams.dataInicialValidade) {
        if (!vDataInicialValidade.valida)
            throw Error(
                `Data inicial informada ${vParams.dataInicialValidade} Inválida!`
            );
        vFiltro += ` AND LCM.PRODAT >= convert(date, '${vParams.dataInicialValidade}', 120)`;
    }

    if (vParams.dataFinalValidade) {
        if (!vDataFinalValidade.valida)
            throw Error(
                `Data final informada ${vParams.dataFinalValidade} Inválida!`
            );
        vFiltro += ` AND LCM.PRODAT <= convert(date, '${vParams.dataFinalValidade}', 120)`;
    }

    if (pTipoValidade.toLowerCase() === 'vencido')
        vFiltro += `AND CAST(LCM.PRODAT AS DATE) < cast(getdate() As Date)  `;
    else if (pTipoValidade.toLowerCase() === 'valido')
        vFiltro += `AND CAST(LCM.PRODAT AS DATE) >= cast(getdate() As Date)  `;

    if (vMotoristaCodigo) vFiltro += ` AND LCM.CODMOT = ${vMotoristaCodigo}`;
    if (vCodigoVeiculo) vFiltro += ` AND LCM.CODVEI = '${vCodigoVeiculo}'`;

    let vOrdenacao = '';

    if (vParams.ordenacao === 'codigoMotorista')
        vOrdenacao = ` LCM.CODMOT`;
    else if (vParams.ordenacao === 'codigoVeiculo')
        vOrdenacao = ` LCM.CODVEI`;
    else if (vParams.ordenacao == 'dataReferencia')
        vOrdenacao += ` LCM.DATREF`;
    else if (vParams.ordenacao == 'observacao')
        vOrdenacao += ` LCM.OBSERV`;
    else if (vParams.ordenacao == 'valorCurso')
        vOrdenacao += ` LCM.VLRCUR`;
    else if (vParams.ordenacao == 'nomeMotorista')
        vOrdenacao += ` MOT.NOMMOT`;
    else if (vParams.ordenacao == 'descricaoCURSO')
        vOrdenacao += ` CUR.DESCRI`;
    else if (vParams.ordenacao == 'numeroAutorizacao')
        vOrdenacao += ` LCM.AUTORI`;
    else if (vParams.ordenacao == 'codigoFilial')
        vOrdenacao += ` LCM.CODFIL`;
    else if (vParams.ordenacao == 'numeroAutorizacao')
        vOrdenacao += ` LCM.AUTORI`;
    else if (vParams.ordenacao == 'dataAlteracao')
        vOrdenacao += ` LCM.DATATU`;
    else if (vParams.ordenacao == 'nomeUsuarioAutorizadoEm')
        vOrdenacao += ` LCM.USUATU`;
    else
        vOrdenacao += ` LCM.PRODAT`;

    return dml.executarSQLListar(
        vParams,
        cursoLicencaSQL.sqlCursoLicencaListar(vParams.permissaoFiliais),
        vFiltro,
        vOrdenacao
    );
}

const cursoLicencaServico = {
    listar: (pTipoValidade, req) => { return listar(pTipoValidade, req); },
};

export default cursoLicencaServico;
