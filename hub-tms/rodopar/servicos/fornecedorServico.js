import dml from '../funcoes/dml';
import sql from './fornecedorSQL';

async function listaFornecedor(req) {
  const vParams = req.query;
  let vFiltro = '';
  let vOrdenacao = '';

  if (vParams.codigoFornecedor) vFiltro += ` AND CLI.CODCLIFOR = ${vParams.codigoFornecedor}`;
  if (vParams.nomeRazaoSocial) vFiltro += ` AND CLI.RAZSOC LIKE '%${vParams.nomeRazaoSocial}%'`;
  if (vParams.numeroCnpj) vFiltro += ` AND (CLI.CODCGC = '${vParams.numeroCnpj}' or CLI.CODCGC = '${vParams.numeroCnpj}.replace(/[^\d]+/g,'')')`;
  if (vParams.identificacaoClassificacao) vFiltro += ` AND (CLI.CLASSI = '${vParams.identificacaoClassificacao}')`;

  vOrdenacao = '';
  if (vParams.ordenacao === 'codigoFornecedor') vOrdenacao += ' CLI.CODCLIFOR';
  else if (vParams.ordenacao === 'nomeRazaoSocial') vOrdenacao += ' CLI.RAZSOC';
  else vOrdenacao += ' CLI.CODCLIFOR';

  const resultSql = await dml.executarSQLListar(
    vParams,
    sql.sqlfornecedorDetalhes(vParams.permissaoFiliais),
    vFiltro,
    vOrdenacao,
  );

  const { totalRegistros, totalRegistrosPagina, dados } = resultSql;

  const result = dados.map((elem) => ({
    codigoFornecedor: elem.fornecedor.codigoFornecedor,
    nomeRazaoSocial: elem.fornecedor.nomeRazaoSocial,
    identificacaoClassificacao: elem.fornecedor.identificacaoClassificacao,
    descricaoClassificacao: elem.fornecedor.descricaoClassificacao,
    numeroCNPJ:elem.fornecedor.numeroCNPJ
  }), 0);

  return {
    totalRegistros,
    totalRegistrosPagina,
    dados: result,
  };
}

async function listarDetalhes(pCodigoFornecedor, req) {
  const vParams = req.query;

  let vFiltro = '';
  let vOrdenacao = '';

  if (pCodigoFornecedor) vFiltro += ` AND CLI.CODCLIFOR = ${pCodigoFornecedor}`;
  if (vParams.codigoFornecedor) vFiltro += ` AND CLI.CODCLIFOR = ${vParams.codigoFornecedor}`;
  if (vParams.nomeRazaoSocial) vFiltro += ` AND CLI.RAZSOC LIKE '%${vParams.nomeRazaoSocial}%'`;
  if (vParams.numeroCnpj) vFiltro += ` AND (CLI.CODCGC = '${vParams.numeroCnpj}' or CLI.CODCGC = '${vParams.numeroCnpj}.replace(/[^\d]+/g,'')')`;
  if (vParams.identificacaoClassificacao) vFiltro += ` AND (CLI.CLASSI = '${vParams.identificacaoClassificacao}')`;

  vOrdenacao = '';
  if (vParams.ordenacao === 'codigoFornecedor') vOrdenacao += ' CLI.CODCLIFOR';
  else if (vParams.ordenacao === 'nomeRazaoSocial') vOrdenacao += ' CLI.RAZSOC';
  else vOrdenacao += ' CLI.CODCLIFOR';

  const resultSql = await dml.executarSQLListar(
    vParams,
    sql.sqlfornecedorDetalhes(vParams.permissaoFiliais),
    vFiltro,
    vOrdenacao,
  );

  const { dados } = resultSql;

  const result = dados.map((elem) => ({
    parceiro: {
      codigoFornecedor: elem.fornecedor.codigoFornecedor,
      nomeRazaoSocial: elem.fornecedor.nomeRazaoSocial,
      identificacaoClassificacao: elem.fornecedor.identificacaoClassificacao,
      descricaoClassificacao: elem.fornecedor.descricaoClassificacao,
      numeroCNPJ:elem.fornecedor.numeroCNPJ
    }
    ,
  }), 0);

  return { dados: result[0] };
}

const parceiroComercialServico = {
  listaFornecedor: (req) => listaFornecedor(req),
  listarDetalhes: (pCodigoFornecedor, req) => listarDetalhes(pCodigoFornecedor, req),
};

export default parceiroComercialServico;
