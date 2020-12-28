const sqlClassificacaoListar = (pPermissaoFiliais) => `
               SELECT
               @@ORDENACAOLINHA@@
               CMO.CODCMO "codigoClassificacao",
               CMO.DESCRI "descricaoClassificacao"
               FROM RODCMO CMO -- cad. classificacao
               JOIN RODFIL FIL ON FIL.CODFIL = CMO.CODFIL -- cad. de filial
               JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
               WHERE FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'} -- Filtro multi empresa de acordo com os acessos do usuario logado
               @@FILTRO@@`;

const sqlClassificacaoObter = (pTipoClassificacao, pPermissaoFiliais) => `
               SELECT
               CMO.CODCMO "codigoClassificacao",
               CMO.DESCRI "descricaoClassificacao"
               FROM RODCMO CMO -- cad. classificacao
               JOIN RODFIL FIL ON FIL.CODFIL = CMO.CODFIL -- cad. de filial
               JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
               WHERE FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'} -- Filtro multi empresa de acordo com os acessos do usuario logado
               AND CMO.TIPMVP = '${pTipoClassificacao}'
               AND CMO.CODCMO = :pId`;

const sql = {
    sqlClassificacaoListar,
    sqlClassificacaoObter,
};

export default sql;
