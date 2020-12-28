module.exports = {
    sqlFilialListar: `SELECT
                              @@ORDENACAOLINHA@@
                              FIL.CODEMP codigoEmpresa,
                              FIL.CODFIL codigoFilial,
                              FIL.RAZSOC nomeRazaoSocial,
                              FIL.NOMEAB nomeFantasia
                         FROM RODEMP EMP
                         JOIN RODFIL FIL ON FIL.CODEMP = EMP.CODEMP -- Cadastro de Filial
                         JOIN RODEMP GRP ON GRP.CODEMP = EMP.CODGRU -- Cadastro de Grupo
                         JOIN RODMUN MUN ON MUN.CODMUN = FIL.CODMUN -- Cadastro de municipios
                         JOIN RODPAI PAI ON PAI.CODPAI = MUN.CODPAI -- Cadastro de PAIS
                        WHERE EMP.TIPO='E'
                              @@FILTRO@@
                     `,
    sqlFilialObter: `SELECT
                              FIL.CODEMP codigoEmpresa,
                              FIL.CODFIL codigoFilial,
                              FIL.RAZSOC nomeRazaoSocial,
                              FIL.NOMEAB nomeFantasia,
                              FIL.CODCGC numeroCNPJ,
                              FIL.ATIVA identificadorStatus,
                              CASE WHEN FIL.ATIVA = 'S' THEN 'ATIVO'
                              WHEN FIL.ATIVA = 'N' THEN 'INATIVA'END descricaoStatus,
                              FIL.ENDERE nomeEndereco,
                              FIL.NUMERO numeroEndereco,
                              FIL.SIGLUF siglaUF,
                              FIL.CPLEND nomeComplemento,
                              FIL.BAIRRO nomeBairro,
                              FIL.CODCEP numeroCEP,
                              FIL.CODMUN codigoMunicipio,
                              MUN.DESCRI descricaoMunicipio,
                              PAI.DESCRI codigoPais,
                              FIL.LATITU numeroLatitude,
                              FIL.LONGIT numeroLongitude,
                              FIL.TELEFO numeroTelefone,
                              EMP.CODGRU codigoGrupoEmpresa,
                              GRP.DESCRI nomeGrupo,
                              EMP.DESCRI nomeEmpresa
                          FROM RODEMP EMP
                          JOIN RODFIL FIL ON FIL.CODEMP = EMP.CODEMP
                          JOIN RODEMP GRP ON GRP.CODEMP = EMP.CODGRU
                          JOIN RODMUN MUN ON MUN.CODMUN = FIL.CODMUN
                          JOIN RODPAI PAI ON PAI.CODPAI = MUN.CODPAI
               WHERE EMP.TIPO='E'
                     AND
                           FIL.CODFIL = :pId
`,
};
