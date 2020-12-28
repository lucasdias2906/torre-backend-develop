const sqlparceiroComercialDetalhes = (pPermissaoFiliais) => `
                              SELECT
                                   @@ORDENACAOLINHA@@

                                   CLI.CODCLIFOR "parceiro.codigoParceiroComercial",
                                   CAST(CLI.CLASSI AS int) "parceiro.identificacaoClassificacao",
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
                                   END "parceiro.descricaoClassificacao",
                                   CLI.FISJUR "parceiro.identificacaoTipoPessoa",
                                   CASE WHEN CLI.FISJUR = 'J' THEN 'JURÍDICO'
                                        WHEN CLI.FISJUR = 'F' THEN 'FÍSICA'
                                        WHEN CLI.FISJUR = 'M' THEN 'MICRO EMPRESA(OPT.SIMPLES)'
                                   END "parceiro.descricacaoTipoPessoa",
                                   CLI.SITUAC "parceiro.identificacaoSituacaoParceiroComercial",
                                   CASE WHEN CLI.SITUAC = 'A' THEN 'ATIVO'
                                        WHEN CLI.SITUAC = 'B' THEN 'BLOQUEADO'
                                        WHEN CLI.SITUAC = 'I' THEN 'INATIVO'
                                   END "parceiro.descricaoSituacaoParceiroComercial",
                                   EMP.CODGRU "parceiro.codigoGrupo",
                                   EMP.CODEMP "parceiro.codigoEmpresa",
                                   EMP.DESCRI "parceiro.descricaoEmpresa",
                                   CLI.CODFIL "parceiro.codigoFilial",
                                   CLI.CODCGC "parceiro.numeroCNPJ",
                                   CLI.RAZSOC "parceiro.nomeRazaoSocial",
                                   CLI.NOMEAB "parceiro.nomeAbreviado",
                                   CLI.INSCRI "parceiro.numeroIE",
                                   CLI.CODCEP "parceiro.numeroCEP",
                                   CLI.TIPLOG "parceiro.tipoLogradouro",
                                   CLI.ENDERE "parceiro.nomeEndereco",
                                   CLI.NUMERO "parceiro.numeroEndereco",
                                   CLI.COMPLE "parceiro.nomeComplemento",
                                   CLI.REFEND "parceiro.nomeReferenciaEndereco",
                                   Case
                                      When Charindex('(',CLI.PRTEL1) > 0 Then
                                        replace(replace(replace(Substring(CLI.PRTEL1,Charindex('(',CLI.PRTEL1),Charindex(')',CLI.PRTEL1)),')',''),'(',''),'_','')
                                   End as "parceiro.numeroDDDTelefone1",
                                   Case
                                      When Charindex(')',CLI.PRTEL1) > 0 Then
                                          replace(replace(Substring(CLI.PRTEL1,Charindex(')',CLI.PRTEL1)+1,len(CLI.PRTEL1)-Charindex(')',CLI.PRTEL1)),'_',''),'-','')
                                   End as "parceiro.numeroTelefone",
                                   Case
                                      When Charindex('(',CLI.PRTEL2) > 0 Then
                                      replace(replace(replace(Substring(CLI.PRTEL2,Charindex('(',CLI.PRTEL2),Charindex(')',CLI.PRTEL2)),')',''),'(',''),'_','')
                                   End as "parceiro.numeroDDDTelefone2",
                                   Case
                                      When Charindex(')',CLI.PRTEL2) > 0 Then
                                          replace(replace(Substring(CLI.PRTEL2,Charindex(')',CLI.PRTEL2)+1,len(CLI.PRTEL2)-Charindex(')',CLI.PRTEL2)),'_',''),'-','')
                                   End as "parceiro.numeroTelefone2",
                                   CLI.BAIRRO "parceiro.nomeBairro",
                                   CLI.CODMUN "parceiro.codigoMunicipio",
                                   MUN.DESCRI "parceiro.nomeMuncipio",
                                   MUN.ESTADO "parceiro.siglaUF",
                                   -- Aba Padrões
                                   CLI.CODSEG "padroes.codigoSeguro",
                                   SEG.DESCRI "padroes.descricaoSeguro",
                                   CLI.CODSE2 "padroes.codigoSeguroRCFDC",
                                   SEGR.DESCRI "padroes.descricaoSeSeguroRCFDC",
                                   -- Aba Parametros
                                   isnull(CLI.OPESEG,'N') "parametros.identificacaoOperacaoSegundaFeira",
                                   isnull(CLI.OPETER,'N') "parametros.identificacaoOperacaoTercaFeira",
                                   isnull(CLI.OPEQUA,'N') "parametros.identificacaoOperacaoQuartaFeira",
                                   isnull(CLI.OPEQUI,'N') "parametros.identificacaoOperacaoQuintaFeira",
                                   isnull(CLI.OPESEX,'N') "parametros.identificacaoOperacaoSextaFeira",
                                   isnull(CLI.OPESAB,'N') "parametros.identificacaoOperacaoSabado",
                                   isnull(CLI.OPEDOM,'N') "parametros.identificacaoOperacaoDomingo",
                                   CLI.HORINI "parametros.horaAtendimentoEntreINI",
                                   CLI.HORFIM "parametros.horaAtendimentoEntreFIM",
                                   CLI.PARINI "parametros.horaNaoAtendimentoEntreINI",
                                   CLI.PARFIM "parametros.horaNaoAntedimentoEntreFIM",
                                   CLI.DATATU 'log.dataAlteracao',
                                   CLI.USUATU 'log.usuarioAlteracao',
                                   CLI.DATINC 'log.dataInclusao',
                                   CLI.USUINC 'log.usuarioInclusao'
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
                             WHERE --CLI.SITUAC='A' --EMP.CODGRU IN (51, 51)
                              FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'}
                              @@FILTRO@@`

const sqlcontatoParceiro = (pPermissaoFiliais) => `
                              SELECT
                                   @@ORDENACAOLINHA@@

                                   CLI.CODCLIFOR "codigoParceiroComercial",
                                   CLI.RAZSOC "nomeRazaoSocial",
                                   CLI.NOMEAB "nomeAbreviado",
                                   CTC.CODTIP "codigoTipoContato",
                                   TIC.DESCRI "descricaoTipoContato",
                                   CTC.NOMECT "nomeContato",
                                   CTC.CODCPF "numeroCPF",
                                   CTC.CODCGC "numeroCPNJ",
                                   CTC.DTNASC "dataNascimento",
                                   Case
                                        When Charindex('(',CTC.TELEFO) > 0 Then
                                        replace(replace(replace(Substring(CTC.TELEFO,Charindex('(',CTC.TELEFO),Charindex(')',CTC.TELEFO)),')',''),'(',''),'_','')
                                    End as "numeroDDDTelefone",
                                    Case
                                        When Charindex(')',CTC.TELEFO) > 0 Then
                                            replace(replace(Substring(CTC.TELEFO,Charindex(')',CTC.TELEFO)+1,len(CTC.TELEFO)-Charindex(')',CTC.TELEFO)),'_',''),'-','')
                                    End as "numeroTelefone",
                                    Case
                                        When Charindex('(',CTC.CELULA) > 0 Then
                                        replace(replace(replace(Substring(CTC.CELULA,Charindex('(',CTC.CELULA),Charindex(')',CTC.CELULA)),')',''),'(',''),'_','')
                                    End as "numeroDDDCelular",
                                    Case
                                        When Charindex(')',CTC.CELULA) > 0 Then
                                            replace(replace(Substring(CTC.CELULA,Charindex(')',CTC.CELULA)+1,len(CTC.CELULA)-Charindex(')',CTC.CELULA)),'_',''),'-','')
                                    End as "numeroCelular",
                                    Case
                                        When Charindex('(',CTC.FAX) > 0 Then
                                        replace(replace(replace(Substring(CTC.FAX,Charindex('(',CTC.FAX),Charindex(')',CTC.FAX)),')',''),'(',''),'_','')
                                    End as "numeroDDDFax",
                                    Case
                                        When Charindex(')',CTC.FAX) > 0 Then
                                            replace(replace(Substring(CTC.FAX,Charindex(')',CTC.FAX)+1,len(CTC.FAX)-Charindex(')',CTC.FAX)),'_',''),'-','')
                                    End as "numeroFax",
                                   CTC.RAMAL "numeroRamalTelefone",
                                   CTC.EMAIL "EmailContato",
                                   CTC.EMAILP "EmailPessoalContato",
                                   CTC.OBSERV "descricaoObservacao",
                                   CTC.INATIV "identificacaoStatusInativoContato",
                                   CASE WHEN CTC.INATIV = 'S' THEN 'INATIVO'
                                        WHEN CTC.INATIV = 'N' THEN 'ATIVO'
                                   END "descricaoStatusContato",
                                   CTC.DATATU 'log.dataAlteracao',
                                   CTC.USUATU 'log.usuarioAlteracao',
                                   CTC.DATINC 'log.dataInclusao'
                                 FROM dbo.RODCLI CLI -- cad. de parceiro comercial (clientes)
                                 LEFT OUTER JOIN  dbo.RODCTC CTC ON CTC.CODCLIFOR = CLI.CODCLIFOR -- cad. contatos parceiro comercial
                                 LEFT OUTER JOIN  dbo.RODTIC TIC ON TIC.CODTIP = CTC.CODTIP -- cad. tipo de contato
                                 JOIN RODFIL FIL ON FIL.CODFIL = CLI.CODFIL -- cad. de filial
                                 JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
                                 WHERE CLI.SITUAC='A'
                                 AND ISNULL(CTC.INATIV,'N')='N'
                                 AND CLI.CLASSI NOT IN(5,6,7)
                                 FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'}
                              @@FILTRO@@`

const sqlcontatoParceiroObter = (pPermissaoFiliais) => `
                              SELECT
                                   CTC.ID     "codigoContato",
                                   TIC.DESCRI "descricaoTipoContato",
                                   CTC.NOMECT "nomeContato",
                                   replace(replace(replace(CTC.CODCPF,'_',''),'-',''),'.','') "numeroCPF",
                                   CTC.DTNASC "dataNascimento",
                                   CTC.RAMAL "numeroRamalTelefone",
                                   CTC.EMAIL "EmailContato",
                                   CTC.EMAILP "EmailPessoalContato",
                                   CTC.OBSERV "descricaoObservacao",
                                   CTC.NIVDEC "nivelDecisao",
                                   GRM.DESCRI "descricaoGrupoEmail"  ,
                                   CASE WHEN CTC.INATIV = 'S' THEN 'INATIVO'
                                   WHEN CTC.INATIV = 'N' THEN 'ATIVO'
                                   END "descricaoStatusContato" ,
                                   CTC.DATATU 'log.dataAlteracao',
                                   CTC.USUATU 'log.usuarioAlteracao',
                                   CTC.DATINC 'log.dataInclusao',
                                   Case
                                        When Charindex('(',CTC.TELEFO) > 0 Then
                                        replace(replace(replace(Substring(CTC.TELEFO,Charindex('(',CTC.TELEFO),Charindex(')',CTC.TELEFO)),')',''),'(',''),'_','')
                                    End as "numeroDDDTelefone",
                                    Case
                                        When Charindex(')',CTC.TELEFO) > 0 Then
                                            replace(replace(Substring(CTC.TELEFO,Charindex(')',CTC.TELEFO)+1,len(CTC.TELEFO)-Charindex(')',CTC.TELEFO)),'_',''),'-','')
                                    End as "numeroTelefone",
                                    Case
                                        When Charindex('(',CTC.CELULA) > 0 Then
                                        replace(replace(replace(Substring(CTC.CELULA,Charindex('(',CTC.CELULA),Charindex(')',CTC.CELULA)),')',''),'(',''),'_','')
                                    End as "numeroDDDCelular",
                                    Case
                                        When Charindex(')',CTC.CELULA) > 0 Then
                                            replace(replace(Substring(CTC.CELULA,Charindex(')',CTC.CELULA)+1,len(CTC.CELULA)-Charindex(')',CTC.CELULA)),'_',''),'-','')
                                    End as "numeroCelular",
                                    Case
                                        When Charindex('(',CTC.FAX) > 0 Then
                                        replace(replace(replace(Substring(CTC.FAX,Charindex('(',CTC.FAX),Charindex(')',CTC.FAX)),')',''),'(',''),'_','')
                                    End as "numeroDDDFax",
                                    Case
                                        When Charindex(')',CTC.FAX) > 0 Then
                                            replace(replace(Substring(CTC.FAX,Charindex(')',CTC.FAX)+1,len(CTC.FAX)-Charindex(')',CTC.FAX)),'_',''),'-','')
                                    End as "numeroFax"
                                 FROM dbo.RODCLI CLI -- cad. de parceiro comercial (clientes)
                                 INNER JOIN  dbo.RODCTC CTC
                                   ON CTC.CODCLIFOR = CLI.CODCLIFOR -- cad. contatos parceiro comercial
                                 LEFT OUTER JOIN  dbo.RODTIC TIC
                                   ON TIC.CODTIP = CTC.CODTIP -- cad. tipo de contato
                                 LEFT OUTER JOIN  dbo.RODGRM GRM
                                   ON GRM.CODIGO = CTC.CODGRM
                                 JOIN RODFIL FIL ON FIL.CODFIL = CLI.CODFIL -- cad. de filial
                                 JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
                                 WHERE CLI.CLASSI NOT IN(5,6,7)
                                 AND FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'}
                                 AND CTC.ID = :pId
                                 `

const sqlcontatoParceiroListar = (pPermissaoFiliais) => `
                                 SELECT
                                      @@ORDENACAOLINHA@@
                                          CTC.ID     "codigoContato",
                                          TIC.DESCRI "descricaoTipoContato",
                                          CTC.NOMECT "nomeContato",
                                          CTC.DTNASC "dataNascimento",
                                          CTC.RAMAL "numeroRamalTelefone",
                                          replace(replace(replace(CTC.CODCPF,'_',''),'-',''),'.','') "numeroCPF",
                                          Case
                                              When Charindex('(',CTC.TELEFO) > 0 Then
                                              replace(replace(replace(Substring(CTC.TELEFO,Charindex('(',CTC.TELEFO),Charindex(')',CTC.TELEFO)),')',''),'(',''),'_','')
                                          End as "numeroDDDTelefone",
                                          Case
                                              When Charindex(')',CTC.TELEFO) > 0 Then
                                                  replace(replace(Substring(CTC.TELEFO,Charindex(')',CTC.TELEFO)+1,len(CTC.TELEFO)-Charindex(')',CTC.TELEFO)),'_',''),'-','')
                                          End as "numeroTelefone",

                                          Case
                                              When Charindex('(',CTC.CELULA) > 0 Then
                                              replace(replace(replace(Substring(CTC.CELULA,Charindex('(',CTC.CELULA),Charindex(')',CTC.CELULA)),')',''),'(',''),'_','')
                                          End as "numeroDDDCelular",
                                          Case
                                              When Charindex(')',CTC.CELULA) > 0 Then
                                                  replace(replace(Substring(CTC.CELULA,Charindex(')',CTC.CELULA)+1,len(CTC.CELULA)-Charindex(')',CTC.CELULA)),'_',''),'-','')
                                          End as "numeroCelular",

                                          Case
                                              When Charindex('(',CTC.FAX) > 0 Then
                                              replace(replace(replace(Substring(CTC.FAX,Charindex('(',CTC.FAX),Charindex(')',CTC.FAX)),')',''),'(',''),'_','')
                                          End as "numeroDDDFax",
                                          Case
                                              When Charindex(')',CTC.FAX) > 0 Then
                                                  replace(replace(Substring(CTC.FAX,Charindex(')',CTC.FAX)+1,len(CTC.FAX)-Charindex(')',CTC.FAX)),'_',''),'-','')
                                          End as "numeroFax",
                                          CLI.CODCLIFOR,
                                        CTC.EMAIL "EmailContato",
                                        CTC.EMAILP "EmailPessoalContato",
                                        CTC.OBSERV "descricaoObservacao",
                                        CTC.NIVDEC "nivelDecisao",
                                        GRM.DESCRI "descricaoGrupoEmail" ,
                                        CTC.DATATU 'log.dataAlteracao',
                                        CTC.USUATU 'log.usuarioAlteracao',
                                        CTC.DATINC 'log.dataInclusao'
                                    FROM dbo.RODCLI CLI
                                    INNER JOIN dbo.RODCTC CTC
                                      ON CTC.CODCLIFOR = CLI.CODCLIFOR -- cad. contatos parceiro comercial
                                    LEFT OUTER JOIN  dbo.RODTIC TIC
                                      ON TIC.CODTIP = CTC.CODTIP -- cad. tipo de contato
                                    LEFT OUTER JOIN  dbo.RODGRM GRM
                                      ON GRM.CODIGO = CTC.CODGRM -- cad. grupo de email
                                    JOIN RODFIL FIL ON FIL.CODFIL = CLI.CODFIL -- cad. de filial
                                    JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
                                    WHERE CLI.CLASSI NOT IN(5,6,7)
                                      AND FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'}
                                    @@FILTRO@@ `

const sql = {
  sqlparceiroComercialDetalhes,
  sqlcontatoParceiro,
  sqlcontatoParceiroObter,
  sqlcontatoParceiroListar,
}

export default sql
