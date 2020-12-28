import dml from '../funcoes/dml';
import sql from './classificacaoSQL';

async function obter(pTipoClassificacao, pCodigo, pReq) {
  const vParams = pReq.query;
  return dml.executarSQLObter(sql.sqlClassificacaoObter(pTipoClassificacao, vParams.permissaoFiliais), pCodigo);
}

async function listar(pReq) {
  const vParams = pReq.query;
  const vTipoClassificacao = pReq.params.pTipoClassificacao;

  let vFiltro = ` AND CMO.TIPMVP = '${vTipoClassificacao}'`;

  let vOrdenacao = ' CMO.DESCRI';

  if (vParams.ordenacao === 'codigoClassificacao') vOrdenacao = ` CMO.CODCMO`;
  else if (vParams.ordenacao === 'descricaoClassificacao')
    vOrdenacao = ` CMO.DESCRI`;

  return dml.executarSQLListar(
    vParams,
    sql.sqlClassificacaoListar(vParams.permissaoFiliais),
    vFiltro,
    vOrdenacao
  );
}

const classificacaoServico = {
  obter: (pTipoClassificacao, pCodigo, pReq) => obter(pTipoClassificacao, pCodigo, pReq),
  listar: (pReq) => listar(pReq),
};

export default classificacaoServico;
