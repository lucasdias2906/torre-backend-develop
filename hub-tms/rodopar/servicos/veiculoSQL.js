const sqlMarca = `SELECT
                    @@ORDENACAOLINHA@@
                    MCV.CODMCV "codigoMarcaVeiculo",
                    MCV.DESCRI "descricacaoMarcaVeiculo",
                    MCV.CODFIL "codigoFilial",
                    EMP.CODEMP "codigoEmpresa"
                FROM  RODMCV MCV
                INNER JOIN  RODFIL FIL ON FIL.CODFIL = MCV.CODFIL
                INNER JOIN  RODEMP EMP ON EMP.CODEMP = FIL.CODEMP `

const sqlModelo = `
                SELECT
                   @@ORDENACAOLINHA@@
                   MDV.CODMDV "codigoModeloVeiculo",
                   MDV.DESCRI "descricacaoModeloVeiculo"
                FROM  RODMDV MDV --CADASTRO DE MODELOS DE VEICULOS
                INNER JOIN  RODMCV MCV ON MCV.CODMCV = MDV.CODMCV
                INNER JOIN  RODFIL FIL ON FIL.CODFIL = MDV.CODFIL
                INNER JOIN  RODEMP EMP ON EMP.CODEMP = FIL.CODEMP
                WHERE EMP.CODEMP = 1
                @@FILTRO@@`

const sqlVeiculo = `
                SELECT
                     @@ORDENACAOLINHA@@

                     VEI.CODVEI "codigoVeiculo",
                     VEI.NUMVEI "identificacaoPlacaVeiculo",
                     --
                     CASE WHEN VEI.TIPVEI = 1 THEN '02 EIXOS TRACIONADADORES'
                          WHEN VEI.TIPVEI = 2 THEN '03 EIXOS TRACIONADORES'
                          WHEN VEI.TIPVEI = 3 THEN 'CARRETA/CONJUNTO'
                          WHEN VEI.TIPVEI = 5 THEN 'ONIBUS'
                          WHEN VEI.TIPVEI = 6 THEN 'MAQUINA/TRATOR'
                          WHEN VEI.TIPVEI = 7 THEN 'SEMI-REBOQUE'
                          WHEN VEI.TIPVEI = 8 THEN 'OUTROS'
                          WHEN VEI.TIPVEI = 9 THEN 'LINHA DE EIXOS'
                          WHEN VEI.TIPVEI = 11 THEN 'RODOTREM'
                          WHEN VEI.TIPVEI = 12 THEN 'EIXOS TRACIONADORES'
                          WHEN VEI.TIPVEI = 13 THEN 'DOLLY'
                          WHEN VEI.TIPVEI = 20 THEN 'SIM-REBOQUE/SUPER SINGLE'
                          WHEN VEI.TIPVEI NOT IN (1,2,3,5,6,7,8,9,11,12,13,20) THEN 'NDA'
                     END AS "descricaoTipoVeiculo",
                     VEI.CODCMO codigoClassificacaoVeiculo,
                     CMO.DESCRI descricaoClassificaoVeiculo,
                     --
                      MCV.DESCRI "descricaoMarca",
                      MDV.DESCRI "descricaoModelo",

                      CLI.RAZSOC "nomeProprietario",

                      CASE WHEN VEI.TIPVIN = 'T' THEN 'TERCEIRO'
                          WHEN VEI.TIPVIN = 'A' THEN 'AGREGADO'
                          WHEN VEI.TIPVIN = 'L' THEN 'ALUGUEL'
                          WHEN VEI.TIPVIN = 'C' THEN 'CLIENTE'
                          WHEN VEI.TIPVIN = 'M' THEN 'COMODATO'
                          WHEN VEI.TIPVIN NOT IN ('T', 'A', 'L', 'C', 'M') THEN 'OUTROS'
                     END "descricaoTipoVinculoProprietario",

                     CASE WHEN VEI.SITUAC = 1 THEN 'ATIVO'
                          WHEN VEI.SITUAC = 2 THEN 'BAIXADO'
                          WHEN VEI.SITUAC = 3 THEN 'INATIVO'
                     END "descricaoSituacaoVeiculo"
                FROM  RODVEI VEI -- cad. de Veiculos
                LEFT OUTER JOIN  RODUNN UNN on VEI.CODUNN = UNN.CODUNN -- cad. unidade de negocio
                LEFT OUTER JOIN  RODMOT MOT on VEI.CODMOT = MOT.CODMOT -- cad. motorista
                LEFT OUTER JOIN  RODCGA CGA on VEI.CODCGA = CGA.CODCGA -- cad. centro de gastos
                LEFT OUTER JOIN  RODCMO CMO on VEI.CODCMO = CMO.CODCMO -- cad. de classificacao de veiculos
                LEFT OUTER JOIN  RODMCV MCV on VEI.CODMCV = MCV.CODMCV -- cad. marca do veículo
                LEFT OUTER JOIN  RODMDV MDV on VEI.CODMDV = MDV.CODMDV -- cad. modelo do veículo
                LEFT OUTER JOIN  RODCLI CLI on VEI.CODPRO = CLI.CODCLIFOR -- cad. parceiro comercial (proprietario)
                LEFT OUTER JOIN  RODGAS GAS on VEI.CODCMB = GAS.CODCMB -- cad. combustivel
                LEFT OUTER JOIN  RODDMP DMP on VEI.CODDMP = DMP.CODDMP -- cad. dimensao de pneus
                LEFT OUTER JOIN  CPOCLA CLA on VEI.CPOCLA = CLA.CPOCLA -- cad. classificacao de veiculos (documentação)
                INNER JOIN  RODFIL FIL ON FIL.CODFIL = VEI.CODFIL -- cad. de filial
                INNER JOIN  RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
                @@FILTRO@@`

const sqlVeiculoDetalhes = (filiais) => `
                SELECT
                    --
                    -- Aba Dados do Veículo
                    --
                    VEI.CODVEI "veiculo.codigoVeiculo",
                    VEI.NUMVEI "veiculo.identificacaoPlacaVeiculo",
                    VEI.ANOFAB "veiculo.numeroAnoFabricacao",
                    VEI.ANOMOD "veiculo.numeroAnoModelo",
                    --
                    VEI.SITUAC "veiculo.identificacaoSituacaoVeiculo",
                    CASE WHEN VEI.SITUAC = 1 THEN 'ATIVO'
                         WHEN VEI.SITUAC = 2 THEN 'BAIXADO'
                         WHEN VEI.SITUAC = 3 THEN 'INATIVO'
                    END "veiculo.descricaoSituacaoVeiculo",
                    --
                    VEI.MOTIVO "veiculo.descricaoMotivoSituacao",
                    --
                    VEI.PLACA2 "veiculo.identificacaoPlacaVeiculo2",
                    VEI.PLACA3 "veiculo.identificacaoPlacaVeiculo3",
                    VEI.PLACA4 "veiculo.identificacaoPlacaDolly",
                    --
                    VEI.CODMCV "veiculo.codigoMarca",
                    MCV.DESCRI "veiculo.descricaoMarca",
                    VEI.CODMDV "veiculo.codigoModeloVeiculo",
                    MDV.DESCRI "veiculo.descricaoModelo",
                    --
                    VEI.TIPVEI "veiculo.identificacaoTipoVeiculo",
                    CASE WHEN VEI.TIPVEI = 1 THEN '02 EIXOS TRACIONADADORES'
                         WHEN VEI.TIPVEI = 2 THEN '03 EIXOS TRACIONADORES'
                         WHEN VEI.TIPVEI = 3 THEN 'CARRETA/CONJUNTO'
                         WHEN VEI.TIPVEI = 5 THEN 'ONIBUS'
                         WHEN VEI.TIPVEI = 6 THEN 'MAQUINA/TRATOR'
                         WHEN VEI.TIPVEI = 7 THEN 'SEMI-REBOQUE'
                         WHEN VEI.TIPVEI = 8 THEN 'OUTROS'
                         WHEN VEI.TIPVEI = 9 THEN 'LINHA DE EIXOS'
                         WHEN VEI.TIPVEI = 11 THEN 'RODOTREM'
                         WHEN VEI.TIPVEI = 12 THEN 'EIXOS TRACIONADORES'
                         WHEN VEI.TIPVEI = 13 THEN 'DOLLY'
                         WHEN VEI.TIPVEI = 20 THEN 'SIM-REBOQUE/SUPER SINGLE'
                         WHEN VEI.TIPVEI NOT IN (1,2,3,5,6,7,8,9,11,12,13,20) THEN 'NDA'
                    END AS "veiculo.descricaoTipoVeiculo",

                    VEI.CHASSI "veiculo.numeroChassi",
                    VEI.DATCAD "veiculo.dataCadastro",
                    VEI.DATBAI "veiculo.dataBaixa",
                    --
                    VEI.CODCMO "veiculo.codigoClassificacaoVeiculo",
                    CMO.DESCRI "veiculo.descricaoClassificaoVeiculo",
                    --
                    VEI.CABCOR "veiculo.descricaoCorVeiculo",
                    --
                    VEI.VLRAQU "veiculo.valorAquisicao",
                    VEI.DATAQU "veiculo.dataAquisicao",
                    --
                    VEI.PROPRI "veiculo.identificacaoVeiculoProprio",
                    --
                    VEI.CODPRO "veiculo.codigoProprietario",
                    CLI.RAZSOC "veiculo.nomeProprietario",
                    --
                    VEI.TIPVIN "veiculo.identificacaoTipoVinculoProprietario",
                    CASE WHEN VEI.TIPVIN = 'T' THEN 'TERCEIRO'
                         WHEN VEI.TIPVIN = 'A' THEN 'AGREGADO'
                         WHEN VEI.TIPVIN = 'L' THEN 'ALUGUEL'
                         WHEN VEI.TIPVIN = 'C' THEN 'CLIENTE'
                         WHEN VEI.TIPVIN = 'M' THEN 'COMODATO'
                         WHEN VEI.TIPVIN NOT IN ('T', 'A', 'L', 'C', 'M') THEN 'OUTROS'
                    END "veiculo.descricaoTipoVinculoProprietario",

                    VEI.CODFIL "veiculo.codigoFilial",

                    --
                    --Aba (aba Informações Complementares)
                    --                    
                    VEI.TARAKG "complementares.quantidadeTarakg",
                    VEI.LOTACA "complementares.quantidadeLotacao",
                    VEI.PESBRU "complementares.quantidadePesoBruto",
                    VEI.CODCMB "complementares.codigoCombustivel",
                    GAS.DESCRI "complementares.descricaoCombustivel",
                    VEI.QTDLIT "complementares.quantidadeLitroTanque",
                    VEI.QTDARL "complementares.quantidadeArla",
                    VEI.CODDMP "complementares.codigoDimensaoPneus",
                    DMP.DESCRI "complementares.descricaoDimensaoPneus",
                    VEI.QTDPNE "complementares.quantidadePneus",
                    VEI.PNESUS "complementares.identificadorUtilizaPneuSuperSingle",
                    CASE WHEN VEI.PNESUS = 'S' THEN 'UTILIZA'
                          WHEN VEI.PNESUS = 'N' THEN 'NAO UTILIZA'
                    END "complementares.descricacaoUtilizaPneuSuperSingle",
                    --
                    VEI.COMPRI "complementares.tamanhoComprimento",
                    VEI.ALTURA "complementares.tamanhoAltura",
                    VEI.LARGUR "complementares.tamanhoLargura",
                    VEI.VENDUA "complementares.dataVencimentoCRLV",
                    VEI.REGRTB "complementares.numeroRegistroANTT",
                    VEI.DATANT "complementares.dataVencimentoANTT",
                    --
                    -- Dados de Rastreadores 1 e 2 do veiculo
                    --
                    VEI.NUMRAS "complementares.numeroRastreador1",
                    VEI.SITRAS "complementares.identificaoSituacaoRastreador1",
                    CASE WHEN VEI.SITRAS = 'S' THEN 'ATIVO'
                          WHEN VEI.SITRAS = 'N' THEN 'NAO ATIVO'
                    END "complementares.descricacaoSituacaoRastreador1",
                    VEI.NUMRA2 "complementares.numeroRastreador2",

                    VEI.TIPRAS "complementares.codigoTipoRastreador",
                    CASE WHEN VEI.TIPRAS = '1' THEN 'AUTORAC'
                         WHEN VEI.TIPRAS = '3' THEN 'OMNILINK'
                         WHEN VEI.TIPRAS = '6' THEN 'SASCAR'
                         WHEN VEI.TIPRAS = '8' THEN 'JABURSAT'
                         WHEN VEI.TIPRAS = '9' THEN 'SITTRACK'
                         WHEN VEI.TIPRAS = '18' THEN '3S'
                         WHEN VEI.TIPRAS = '23' THEN 'ONIXSAT'
                         WHEN VEI.TIPRAS NOT IN ('1', '3', '6', '8', '9', '18', '23') THEN 'NÃO INFORMADO'
                    END "complementares.descricaoTipoRastreador",
                    --
                    -- Dados do log de atualizacao
                    --
                    VEI.DATINC "log.dataInclusao",
                    VEI.USUINC "log.usuarioInclusao",
                    VEI.DATATU "log.dataAlteracao",
                    VEI.USUATU "log.usuarioAlteracao"

                FROM  RODVEI VEI -- cad. de Veiculos
                LEFT OUTER JOIN  RODUNN UNN on VEI.CODUNN = UNN.CODUNN -- cad. unidade de negocio
                LEFT OUTER JOIN  RODMOT MOT on VEI.CODMOT = MOT.CODMOT -- cad. motorista
                LEFT OUTER JOIN  RODCGA CGA on VEI.CODCGA = CGA.CODCGA -- cad. centro de gastos
                LEFT OUTER JOIN  RODCMO CMO on VEI.CODCMO = CMO.CODCMO -- cad. de classificacao de veiculos
                LEFT OUTER JOIN  RODMCV MCV on VEI.CODMCV = MCV.CODMCV -- cad. marca do veículo
                LEFT OUTER JOIN  RODMDV MDV on VEI.CODMDV = MDV.CODMDV -- cad. modelo do veículo
                LEFT OUTER JOIN  RODCLI CLI on VEI.CODPRO = CLI.CODCLIFOR -- cad. parceiro comercial (proprietario)
                LEFT OUTER JOIN  RODGAS GAS on VEI.CODCMB = GAS.CODCMB -- cad. combustivel
                LEFT OUTER JOIN  RODDMP DMP on VEI.CODDMP = DMP.CODDMP -- cad. dimensao de pneus
                LEFT OUTER JOIN  CPOCLA CLA on VEI.CPOCLA = CLA.CPOCLA -- cad. classificacao de veiculos (documentação)
                INNER JOIN  RODFIL FIL ON FIL.CODFIL = VEI.CODFIL -- cad. de filial
                INNER JOIN  RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
                WHERE  VEI.CODVEI = :pId
                 AND (VEI.CODFIL IN(${filiais || "''"}) OR '${filiais}'='-1')
                      `

const sqlVeiculoParametrosLicencas = (filiais) => `
                SELECT
                                        --
                    --Aba (aba Parâmetros / Licenças)
                    --
                    VEI.CATCNH "parametros.categoriaCNHMotorista",
                    --
                    VEI.CODUNN "parametros.codigoUnidadeNegocio",
                    UNN.DESCRI "parametros.descricaoUnidadeNegocio",
                    --
                    VEI.CODCGA "parametros.codigoCentroGasto",
                    CGA.DESCRI "parametros.descricaoCentroGasto",
                    VEI.NUMRAS "parametros.numeroRastreador1",
                    --
                    --Aba (aba Pneus agre./Gestores)
                    --
                    VEI.TER_ALUGSR "desconto.taxaDescontoUsoSemireboque",
                    VEI.PNETER "desconto.identificaoUtilizaPneuTerceiro",
                    CASE WHEN VEI.PNETER = 'S' THEN 'SIM'
                          WHEN VEI.PNETER = 'N' THEN 'NAO'
                    END "desconto.descricacaoUtilizaPneuTerceiro",
                    --
                    --Aba (aba Documentação)
                    --
                    VEI.RENAVA "documentacao.numeroRenavam",
                    VEI.CPOCLA "documentacao.codigoClasseDocumentacao",
                    CLA.DESCRI "documentacao.descricaoClasseDocumentacao",

                    -- Dados do log de atualizacao
                    --
                    VEI.DATINC "log.dataInclusao",
                    VEI.USUINC "log.usuarioInclusao",
                    VEI.DATATU "log.dataAlteracao",
                    VEI.USUATU "log.usuarioAlteracao"

                FROM  RODVEI VEI -- cad. de Veiculos
                LEFT OUTER JOIN  RODUNN UNN on VEI.CODUNN = UNN.CODUNN -- cad. unidade de negocio
                LEFT OUTER JOIN  RODMOT MOT on VEI.CODMOT = MOT.CODMOT -- cad. motorista
                LEFT OUTER JOIN  RODCGA CGA on VEI.CODCGA = CGA.CODCGA -- cad. centro de gastos
                LEFT OUTER JOIN  RODCMO CMO on VEI.CODCMO = CMO.CODCMO -- cad. de classificacao de veiculos
                LEFT OUTER JOIN  RODMCV MCV on VEI.CODMCV = MCV.CODMCV -- cad. marca do veículo
                LEFT OUTER JOIN  RODMDV MDV on VEI.CODMDV = MDV.CODMDV -- cad. modelo do veículo
                LEFT OUTER JOIN  RODCLI CLI on VEI.CODPRO = CLI.CODCLIFOR -- cad. parceiro comercial (proprietario)
                LEFT OUTER JOIN  RODGAS GAS on VEI.CODCMB = GAS.CODCMB -- cad. combustivel
                LEFT OUTER JOIN  RODDMP DMP on VEI.CODDMP = DMP.CODDMP -- cad. dimensao de pneus
                LEFT OUTER JOIN  CPOCLA CLA on VEI.CPOCLA = CLA.CPOCLA -- cad. classificacao de veiculos (documentação)
                INNER JOIN  RODFIL FIL ON FIL.CODFIL = VEI.CODFIL -- cad. de filial
                INNER JOIN  RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
                WHERE VEI.CODVEI = :pId
                      AND (VEI.CODFIL IN(${filiais || "''"}) OR '${filiais}'='-1')
                      `

const sqlTotais = (filiais) => `
SELECT 
     COALESCE(SUM(CASE WHEN VEI.CODCMO = 9  THEN 1 ELSE 0 END),0) 'CavaloToco4X2',  
     COALESCE(SUM(CASE WHEN VEI.CODCMO = 10 THEN 1 ELSE 0 END),0) 'CavaloTruncado6X2',  
     COALESCE(SUM(CASE WHEN VEI.CODCMO = 11 THEN 1 ELSE 0 END),0) 'CavaloTruncado6X4', 
     COALESCE(SUM(CASE WHEN VEI.CODCMO = 12 THEN 1 ELSE 0 END),0) 'BiTremCargaSeca',
     COALESCE(SUM(CASE WHEN VEI.CODCMO = 13 THEN 1 ELSE 0 END),0) 'BiTremGraneleiro',
     COALESCE(SUM(CASE WHEN VEI.CODCMO = 25 THEN 1 ELSE 0 END),0) 'BitrenzaoCargaSeca',
     COALESCE(SUM(CASE WHEN VEI.CODCMO = 67 THEN 1 ELSE 0 END),0) 'RodoTremCargaSeca',
     COALESCE(SUM(CASE WHEN VEI.CODCMO = 69 THEN 1 ELSE 0 END),0) 'RodoTremSider',
     COALESCE(SUM(CASE WHEN VEI.CODCMO = 78 THEN 1 ELSE 0 END),0) 'BitrenzaoSider',
     COALESCE(SUM(CASE WHEN VEI.CODCMO NOT IN(9,	10,11 ,12 ,13 ,25 ,67 ,69 ,78)THEN 1 ELSE 0 END),0) 'Outros',

     COALESCE(SUM(CASE WHEN VEI.TIPVIN = 'T' THEN 1 ELSE 0 END),0) 'Terceiro',
     COALESCE(SUM(CASE WHEN VEI.TIPVIN = 'A' THEN 1 ELSE 0 END),0) 'Agregado',
     COALESCE(SUM(CASE WHEN VEI.TIPVIN = 'L' THEN 1 ELSE 0 END),0) 'Aluguel',
     COALESCE(SUM(CASE WHEN VEI.TIPVIN = 'C' THEN 1 ELSE 0 END),0) 'Cliente',
     COALESCE(SUM(CASE WHEN VEI.TIPVIN = 'M' THEN 1 ELSE 0 END),0) 'Comodato'
FROM  RODVEI VEI
     JOIN RODCMO CMO ON (VEI.CODCMO = CMO.CODCMO)
     JOIN RODFIL FIL ON FIL.CODFIL = VEI.CODFIL
WHERE (VEI.CODFIL IN(${filiais || "''"}) OR '${filiais}'='-1')
`

const sql = {
     sqlVeiculoParametrosLicencas,
     sqlVeiculoDetalhes,
     sqlVeiculo,
     sqlModelo,
     sqlMarca,
     sqlTotais
}

export default sql
