

const sqlfornecedorDetalhes = (pPermissaoFiliais) => `
                              SELECT
                                   @@ORDENACAOLINHA@@

                                   CLI.CODCLIFOR "fornecedor.codigoFornecedor",                                   
                                   CLI.RAZSOC "fornecedor.nomeRazaoSocial",
                                   CAST(CLI.CLASSI AS int) "fornecedor.identificacaoClassificacao",
                                   CASE WHEN CLI.CLASSI = 0 THEN 'CLIENTE/FORNECEDOR'
                                     WHEN CLI.CLASSI = 1 THEN 'CLIENTE'
                                     WHEN CLI.CLASSI = 2 THEN 'FORNECEDOR'
                                     WHEN CLI.CLASSI = 3 THEN 'CARRETEIRO'
                                     WHEN CLI.CLASSI = 4 THEN 'AVULSO'
                                     WHEN CLI.CLASSI = 5 THEN 'FUNCIONARIO'
                                     WHEN CLI.CLASSI = 6 THEN 'IMPOSTO'
                                     WHEN CLI.CLASSI = 7 THEN 'FINANCIAMENTO'
                                     WHEN CLI.CLASSI = 8 THEN 'CLIENTE/CARRETEIRO'
                                     WHEN CLI.CLASSI = 9 THEN 'FORNECEDOR/CARRETEIRO'
                                     WHEN CLI.CLASSI = 10 THEN 'CLIENTE/FUNCIONARIO'
                                     WHEN CLI.CLASSI = 11 THEN 'CLIENTE/FORNECEDOR/CARRETEIRO'
                                   END "fornecedor.descricaoClassificacao",
                                   CLI.CODCGC "fornecedor.numeroCNPJ"
                             FROM dbo.RODCLI CLI
                             INNER JOIN dbo.RODFIL FIL
                               ON FIL.CODFIL = CLI.CODFIL
                             INNER JOIN dbo.RODEMP EMP
                               ON EMP.CODEMP = FIL.CODEMP
                             LEFT OUTER JOIN dbo.RODMUN MUN
                               ON MUN.CODMUN = CLI.CODMUN
                             LEFT OUTER JOIN dbo.RODSEG SEG
                               ON SEG.CODSEG = CLI.CODSEG
                             LEFT OUTER JOIN dbo.RODSEG SEGR
                               ON SEGR.CODSEG = CLI.CODSE2
                             WHERE FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'} -- Filtro multi empresa de acordo com os acessos do usuario logado
                             
                              @@FILTRO@@`;

const sql = {
  sqlfornecedorDetalhes,
};

export default sql;
