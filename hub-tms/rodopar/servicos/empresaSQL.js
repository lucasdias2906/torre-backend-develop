const sqlEmpresaListar = `SELECT
                              @@ORDENACAOLINHA@@
                              E.CODEMP codigoEmpresa,
                              E.DESCRI descricaoEmpresa,
                              E.TIPO   identificadorTipoGrupoEmpresa,
                              E.CODGRU codigoGrupo,
                              G.DESCRI descricaoGrupo
                         FROM
                              RODEMP E
                         JOIN RODEMP G ON E.CODGRU = G.CODEMP
                        WHERE E.TIPO='E'
                              @@FILTRO@@ `;

const sqlEmpresaObter = `SELECT
                              E.CODEMP codigoEmpresa,
                              E.DESCRI descricaoEmpresa,
                              E.TIPO   identificadorTipoGrupoEmpresa,
                              E.CODGRU codigoGrupo,
                              G.DESCRI descricaoGrupo
                       FROM  RODEMP E
                             JOIN RODEMP G ON E.CODGRU = G.CODEMP
                        WHERE E.TIPO='E'
                     AND E.CODEMP = :pId
                      `;

const sql = {
    sqlEmpresaListar,
    sqlEmpresaObter,
};

export default sql;
