module.exports = {
    sqlGrupoListar: ` SELECT
                               @@ORDENACAOLINHA@@
                               G.CODEMP codigoGrupoEmpresa,
                               G.DESCRI descricaoGrupEmpresa,
                               G.TIPO   identificacaoEmpresaGrupo
                               FROM  RODEMP G
                               WHERE G.TIPO='G'
                          @@FILTRO@@
        `,
    sqlGrupoObter: `SELECT
                             G.CODEMP codigoGrupoEmpresa,
                             G.DESCRI descricaoGrupEmpresa,
                             G.TIPO   identificacaoEmpresaGrupo
                      FROM  RODEMP G
                     WHERE G.TIPO='G'
                     AND G.CODEMP = :pId
`,
};
