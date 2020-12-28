const sqlCursoLicencaListar = (pPermissaoFiliais) => `
       SELECT
       @@ORDENACAOLINHA@@
       LCM.CODIGO "codigoLancamento",
       LCM.CODCUR "codigoCurso",
       CUR.DESCRI "descricaoCurso",
       LCM.NOTAMO "numeroNotaCurso",
       LCM.LOCCUR "nomeLocalCurso",
       LCM.OBSERV "observacao",
       LCM.VLRCUR "valorCurso",
       LCM.DATREF "dataReferencia",
       LCM.PRODAT "dataValidade",
       LCM.NUMMOP "numeroCursoMOPP",
       LCM.AUTORI "numeroAutorizacao",
       LCM.CODFIL "codigoFilial",
       LCM.DATATU "dataAlteracao",
       LCM.USUATU "nomeUsuarioAutorizadoEm",

       LCM.DATATU 'log.dataAlteracao',
       LCM.USUATU 'log.usuarioAlteracao',
       LCM.DATINC 'log.dataInclusao',
       LCM.USUINC 'log.usuarioInclusao'
     FROM
          RODLCM LCM  -- cad. licenças do motorista
     INNER JOIN RODCUR CUR on CUR.CODCUR = LCM.CODCUR -- cad. de cursos
     LEFT JOIN RODMOT MOT on MOT.CODMOT = LCM.CODMOT -- cad. de motorista
     LEFT JOIN RODVEI VEI on VEI.CODVEI = LCM.CODVEI -- cad. de veiculos
     JOIN RODFIL FIL ON FIL.CODFIL = LCM.CODFIL -- cad. de filial
     JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
     WHERE FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'} -- Filtro multi empresa de acordo com os acessos do usuario logado
 @@FILTRO@@
`;

const sql = {
    sqlCursoLicencaListar,
};

export default sql;
