// @@ORDENACAOLINHA@@

const sqlPedido = (pParams) => {
  // Filtro para Programação de Carga
  let vFiltroPC = '1=2'
  let vFiltroPV = '1=2'
  let vFiltroPVazia = '1=2'
  const vAgrupar = pParams.agrupar

  if (pParams.dataRetiradaInicial && pParams.dataRetiradaFinal) {
    vFiltroPC = `${vFiltroPC} OR (PRC.DATRET >= CONVERT(DATETIME,'${pParams.dataRetiradaInicial}',127)
                                     AND PRC.DATRET <= CONVERT(DATETIME,'${pParams.dataRetiradaFinal}',127)
                                     ) `

    vFiltroPVazia = `${vFiltroPVazia} OR (VAZ.DATSAI >= CONVERT(DATETIME,'${pParams.dataRetiradaInicial}',127)
                                      AND VAZ.DATSAI <= CONVERT(DATETIME,'${pParams.dataRetiradaFinal}',127)
                                      ) `
  }

  if (pParams.dataEntregaInicial && pParams.dataEntregaFinal) {
    vFiltroPC = `${vFiltroPC} OR (PRC.DATENT >= CONVERT(DATETIME,'${pParams.dataEntregaInicial}',127)
                                     AND PRC.DATENT <= CONVERT(DATETIME,'${pParams.dataEntregaFinal}',127)
                                     ) `

    vFiltroPVazia = `${vFiltroPVazia} OR (VAZ.DATPRE >= CONVERT(DATETIME,'${pParams.dataEntregaInicial}',127)
                                     AND VAZ.DATPRE <= CONVERT(DATETIME,'${pParams.dataEntregaFinal}',127)
                                     ) `
  }

  vFiltroPV = vFiltroPC

  if (pParams.dataPrevisaoChegadaInicial && pParams.dataPrevisaoChegadaFinal) {
    vFiltroPV = `${vFiltroPV} OR (LPR.PRECHE >= CONVERT(DATETIME,'${pParams.dataPrevisaoChegadaInicial}',127)
                                   AND LPR.PRECHE <= CONVERT(DATETIME,'${pParams.dataPrevisaoChegadaFinal}',127)
                                  ) `
  }

  let vFiltroPCPV = ''

  if (vAgrupar === 'S') {
    vFiltroPCPV = `AND
                         (
                            (--Filtro para programação de Carga
                              (${vFiltroPC})
                              AND DPR.ID_DPR IS NULL
                            )
                        OR
                           (--Filtro para programação de Veículo
                            (${vFiltroPV})
                            AND DPR.ID_DPR IS NOT NULL
                           )
                     )` // Filtro para programação de carga
  }
  let vSql = ` SELECT
                             ${pParams.resumo !== 'S' ? '@@ORDENACAOLINHA@@' : ''}
                             codigoFilial,
                             nomeFilial,
                             codigoEmpresa,
                             nomeEmpresa,
                             numeroPedido,
                             descricaoStatusPedidoTorre,
                             codigoStatusPedidoTorre,
                             sequenciaOrdenacaoPedido,
                             codigoTipoCarga,
                             descricaoTipoCarga,
                             CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE codigoLinha END codigoLinha,
                             CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE codigoRemetente END codigoRemetente,
                             CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE nomeRemetente END nomeRemetente,
                             CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE codigoDestinatario END codigoDestinatario,
                             CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE nomeDestinatario END nomeDestinatario,
                             0 situacaoRastreador1,
                             0 situacaoRastreador2,
                             0 situacaoRastreador3,
                             ${pParams.ocorrenciasAltas.length > 0 ? `CASE WHEN numeroPedido IN (${pParams.ocorrenciasAltas.map((elem) => `'${elem}'`)}) THEN 1 ELSE 0 END ocorrenciaCriticidadeAlta,` : '0 ocorrenciaCriticidadeAlta,'}
                             ${pParams.ocorrenciasBaixas.length > 0 ? `CASE WHEN numeroPedido IN (${pParams.ocorrenciasBaixas.map((elem) => `'${elem}'`)}) THEN 1 ELSE 0 END ocorrenciaCriticidadeBaixa,` : '0 ocorrenciaCriticidadeBaixa,'}
                             codigoPlacaVeiculo,
                             codigoPlacaVeiculo2,
                             codigoPlacaVeiculo3,
                             codigoPlacaVeiculo4,
                             placa,
                             diferencial,
                             codigoMotorista1,
                             codigoMotorista2,
                            ${vAgrupar === 'S' ? 'MIN(dataRetirada)' : '(dataRetirada)'}  dataRetirada,
                            ${vAgrupar === 'S' ? 'MIN(dataChegada)' : '(dataRetirada)'}   dataChegada,
                            ${vAgrupar === 'S' ? 'COUNT(1) qtd,' : ''}
                             dataChegadaPrevista dataChegadaPrevista
                      FROM
                           (
                            SELECT
                                   CASE WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157)  -- Regra de Tomador, não é John Deere
                                   OR
                                  (PRC.CODTOM in (125,148,149,151,152,154,155,1057)       -- Regra de Tomador é John Deere
                                   AND ISNULL(IPR.ORDCOM,' ') =  ' '))
                                  THEN 'N'
                                  ELSE 'S' END TomadorEhJohnDeere,
                                  COALESCE(LPR.CODFIL,PRC.CODFIL)             codigoFilial,
                                  COALESCE(LPR_FIL.NOMEAB,PRC_FIL.NOMEAB)     nomeFilial,
                                  COALESCE(LPR_EMP.CODEMP,PRC_EMP.CODEMP)     codigoEmpresa,
                                  COALESCE(LPR_EMP.DESCRI,PRC_EMP.DESCRI)     nomeEmpresa,
                                  PRC.CODIGO PRC_CODIGO,
                                  IPR.ORDCOM IPR_ORDCOM,
                                  CASE WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157)  -- Regra de Tomador, não é John Deere
                                  OR
                                  (PRC.CODTOM in (125,148,149,151,152,154,155,157)       -- Regra de Tomador é John Deere
                                  AND ISNULL(IPR.ORDCOM,' ') =  ' '))
                                  THEN CAST(PRC.CODIGO AS VARCHAR(10))
                                  ELSE IPR.ORDCOM END numeroPedido,
                                  CASE WHEN LPR.SITUAC = 'D' THEN 'COM ALOCACAO'
                                  WHEN LPR.SITUAC = 'E' THEN 'EM VIAGEM'
                                  WHEN LPR.SITUAC = 'F' THEN 'VIAGEM FINALIZADA'
                                  WHEN LPR.SITUAC = 'C' THEN 'CANCELADO'
                                  WHEN LPR.SITUAC = 'B' THEN 'BLOQUEADO GER. RISCO'
                                  WHEN PRC.SITUAC IN ('D','M') THEN 'NOVO'
                                  WHEN PRC.SITUAC = 'C' THEN 'CANCELADA'
                                  END AS descricaoStatusPedidoTorre,
                                  CASE WHEN LPR.SITUAC = 'D' THEN 2
                                  WHEN LPR.SITUAC = 'E' THEN 4
                                  WHEN LPR.SITUAC = 'F' THEN 5
                                  WHEN LPR.SITUAC = 'C' THEN 3
                                  WHEN LPR.SITUAC = 'B' THEN 6
                                  WHEN PRC.SITUAC IN ('D','M') THEN 1
                                  WHEN PRC.SITUAC = 'C' THEN 3
                                  END AS codigoStatusPedidoTorre,
                                  CASE WHEN LPR.SITUAC = 'D' THEN 3 -- COM ALOCACAO
                                  WHEN LPR.SITUAC = 'E' THEN 4 -- EM VIAGEM
                                  WHEN LPR.SITUAC = 'F' THEN 5 -- VIAGEM FINALIZADA
                                  WHEN LPR.SITUAC = 'B' THEN 6 -- BLOQUEADO GER. RISCO
                                  WHEN LPR.SITUAC = 'C' THEN 7 -- CANCELADA
                                  WHEN PRC.SITUAC = 'D' THEN 1 -- CADASTRADA
                                  WHEN PRC.SITUAC = 'M' THEN 1 -- MOVIMENTADA
                                  WHEN PRC.SITUAC = 'C' THEN 7 -- CANCELADA
                            END AS sequenciaOrdenacaoPedido,
                            PRC.CODPTC codigoTipoCarga,
                            PTC.DESCRI descricaoTipoCarga,
                            COALESCE(LPR.CODLIN,PRC.CODLIN) codigoLinha,

                            PRC.CODREM codigoRemetente,
                            CLI_PRC.NOMEAB nomeRemetente,
                            COALESCE(IPR.CODDES, LPR.CODDES) "codigoDestinatario",
                            COALESCE(CLI_IPR.NOMEAB, CLI_LPR.NOMEAB) nomeDestinatario,

                            COALESCE(LPR.PLACA,PRC.PLACA) codigoPlacaVeiculo,
                            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PLACA2 ELSE NULL END codigoPlacaVeiculo2,
                            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PLACA3 ELSE NULL END codigoPlacaVeiculo3,
                            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PLACA4 ELSE NULL END codigoPlacaVeiculo4,
                            VEI.NUMVEI placa,
                            COALESCE(LPR.DIFERE,PRC.DIFERE) diferencial,
                            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.CODMO1 ELSE NULL END codigoMotorista1,
                            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.CODMO2 ELSE NULL END codigoMotorista2,
                            PRC.DATRET dataRetirada,
                              PRC.DATENT dataChegada,
                            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PRECHE ELSE NULL END dataChegadaPrevista
                            FROM
                                    RODPRC PRC
                            LEFT JOIN RODPTC PTC on PTC.CODPTC = PRC.CODPTC -- cad. de tipo de carga
                            LEFT JOIN RODIPR IPR on (IPR.CODIGO = PRC.CODIGO -- Destino(s) de programação para pegar agrupador Integrator
                                                    AND IPR.CODFIL = PRC.CODFIL)
                            LEFT JOIN RODFIL PRC_FIL ON (PRC.CODFIL = PRC_FIL.CODFIL)
                            LEFT JOIN RODEMP PRC_EMP ON (PRC_FIL.CODEMP = PRC_EMP.CODEMP)
                            LEFT JOIN RODDPR DPR ON (PRC.CODFIL = DPR.FILPRO
                                                    AND PRC.CODIGO = DPR.CODPRO
                                                    AND DPR.TIPDOC = 'V'
                                                    AND DPR.TIPPRO = 'C')
                            LEFT JOIN RODLPR LPR ON (DPR.CODDOC = LPR.CODLPR -- Associativa PC versus PC
                                              AND DPR.FILDOC = LPR.CODFIL)
                            LEFT JOIN RODVEI VEI ON (LPR.PLACA = VEI.CODVEI)
                            LEFT JOIN RODFIL LPR_FIL ON (LPR.CODFIL = LPR_FIL.CODFIL)
                            LEFT JOIN RODEMP LPR_EMP ON (PRC_FIL.CODEMP = LPR_EMP.CODEMP)
                            LEFT JOIN RODCLI CLI_PRC ON (CLI_PRC.CODCLIFOR = PRC.CODREM)
                            LEFT JOIN RODCLI CLI_IPR ON (CLI_IPR.CODCLIFOR = IPR.CODDES)
                            LEFT JOIN RODCLI CLI_LPR ON (CLI_LPR.CODCLIFOR = LPR.CODDES)
                            WHERE 1=1
                             ${pParams.filtroInternoStatusCodigoTorre}
                            AND (IPR.CODIGO IS NOT NULL OR LPR.CODLPR IS NULL) -- Se for programação de veículo, deve ter Destino de programação
                            ${pParams.codigoTipoCarga ? `AND PRC.CODPTC = ${pParams.codigoTipoCarga}` : ''}
                            ${pParams.codigoFilial ? `AND PRC.CODFIL = ${pParams.codigoFilial}` : ''}

                            ${vFiltroPCPV}

                            --AND PRC.CODFIL IN (51) --1,2,3,38,15,50,51,52)

                            UNION ALL
                            SELECT
                                'N' TomadorEhJohnDeere,
                              VAZ.CODFIL "codigoFilial",
                              FIL.NOMEAB "nomeFilial",
                              --
                              EMP.CODEMP "codigoEmpresa",
                              EMP.DESCRI "nomeEmpresa",
                              --
                              '' PRC_CODIGO,
                              '' IPR_ORDCOM,
                              CAST(VAZ.CODVAZ AS VARCHAR(10)) "numeroPedido",
                              --
                              -- STATUS CODIFICADO DO TMS PARA A TORRE (VIDE EF)
                              --
                              CASE WHEN MAN.SITUAC = 'E' THEN 'EM VIAGEM'
                                  WHEN MAN.SITUAC = 'C' THEN 'CANCELADO'
                                  WHEN MAN.SITUAC = 'B' THEN 'FINALIZADO'
                              END AS "statusPedidoTorre",
                              CASE WHEN MAN.SITUAC = 'E' THEN 4
                              WHEN MAN.SITUAC = 'C' THEN 3
                              WHEN MAN.SITUAC = 'B' THEN 7
                          END codigostatusPedidoTorre,
                              -- STATUS CODIFICADO PARA SEQUENCIAR OS PEDIDOS NA TELA DE ACOMPANHAMENTO DE PEDIDOS DA TORRE
                              CASE WHEN MAN.SITUAC = 'E' THEN 4 -- EM VIAGEM
                                  WHEN MAN.SITUAC = 'C' THEN 7 -- CANCELADA
                                  WHEN MAN.SITUAC = 'B' THEN 5 -- VIAGEM FINALIZADA
                              END AS "sequenciaOrdernacaoPedido",
                              --
                              NULL "codigoTipoCarga",
                              'Deslocamento Vazio' "descricaoTipoCarga",
                              --
                              MAN.CODLIN "codigoLinha",
                              --
                              NULL "codigoRemetente",
                              NULL "nomeRemetente",
                              NULL "codigoDestinatario",
                              NULL "nomeDestinatario",
                              --
                              MAN.PLACA "codigoPlacaVeiculo",
                              MAN.PLACA2 "codigoPlacaVeiculo2",
                              MAN.PLACA3 "codigoPlacaVeiculo3",
                              MAN.PLACA4 "codigoPlacaVeiculo4",
                              --
							  VEI.NUMVEI "placa",							  
                              --
                              VAZ.DIFERE "diferencial",
                              --
                              MAN.CODMO1 "codigoMotorista1",
                              MAN.CODMO2 "codigoMotorista2",
                              --
                                NULL dataRetirada,
                                NULL dataChegada,
                                NULL dataChegadaPrevista
                              -- select count(1) from RODVAZ
                            FROM RODVAZ VAZ -- Busca o manifesto com base na RODVAZ (deslocamento vazio)
                            INNER JOIN RODFIL FIL ON FIL.CODFIL = VAZ.CODFIL -- cad. de filial
                            INNER JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
                            INNER JOIN RODIMA IMA ON (IMA.TIPDOC='D' -- DESLOCAMENTO VAZIO
                                                AND IMA.CODDOC = VAZ.CODVAZ
                                                AND IMA.FILDOC = VAZ.CODFIL --Associativa Manifesto VS Docs OST
                                                )
                            INNER JOIN RODMAN MAN ON MAN.CODMAN = IMA.CODMAN
                                                AND MAN.CODFIL = IMA.FILMAN
                                                AND MAN.SERMAN = IMA.SERMAN
                                                AND MAN.SITUAC IN ('E', 'C', 'B') -- APENAS STATUS EMITIDO, CANCELADO, BAIXADO
                            LEFT JOIN RODVEI VEI ON (MAN.PLACA = VEI.CODVEI)
                            WHERE -- Filtros a serem gerados de acordo com os parametros informados na tela de acompanhamento de pedidos
                                (${vFiltroPVazia})   -- FILTRO NECESSÝRIO POR PERIODO (SEMELHANTE A DATA DE ENTREGA DA PV) VIDE EF
                                AND MAN.SITUAC = 'E' -- STATUS INICIAL QUE SERA EXECUTADO NA MAIOR DAS VEZES E-EM VIAGEM (OUTRO STATUS O USUARIO TEM QUE MUDAR O FILTRO)
                                ${pParams.codigoTipoCarga ? 'AND 1 = 2' : ''}
                                ${pParams.codigoFilial ? `AND VAZ.CODFIL = ${pParams.codigoFilial}` : ''}

                            ) x
                            WHERE 1=1
                            @@FILTRO@@

                            ${vAgrupar === 'S' ? `GROUP BY
                              codigoFilial,
                              nomeFilial,
                              codigoEmpresa,
                              nomeEmpresa,
                              numeroPedido,
                              descricaoStatusPedidoTorre,
                              codigoStatusPedidoTorre,
                              sequenciaOrdenacaoPedido,
                              codigoTipoCarga,
                              descricaoTipoCarga,
                              CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE codigoLinha END,
                              CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE codigoRemetente END,
                              CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE nomeRemetente END ,
                              CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE codigoDestinatario END,
                              CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE nomeDestinatario END ,
                              codigoPlacaVeiculo,
                              codigoPlacaVeiculo2,
                              codigoPlacaVeiculo3,
                              codigoPlacaVeiculo4,
                              placa,
                              diferencial,
                              codigoMotorista1,
                              codigoMotorista2,
                              dataChegadaPrevista
                              ` : ''}


                                                `
  if (pParams.resumo === 'S') {
    vSql = ` SELECT
                     @@ORDENACAOLINHA@@
                     COALESCE(SUM(CASE WHEN codigoStatusPedidoTorre=1 THEN 1 ELSE 0 END),0) qtdStatusNovo,
                     COALESCE(SUM(CASE WHEN codigoStatusPedidoTorre=2 THEN 1 ELSE 0 END),0) qtdStatusComAlocacao,
                     COALESCE(SUM(CASE WHEN codigoStatusPedidoTorre=4 THEN 1 ELSE 0 END),0) qtdStatusEmViagem,
                     COALESCE(SUM(CASE WHEN codigoStatusPedidoTorre=5 THEN 1 ELSE 0 END),0) qtdStatusEmViagemFinalizada,
                     COALESCE(SUM(CASE WHEN codigoStatusPedidoTorre=3 THEN 1 ELSE 0 END),0) qtdStatusCancelado,
                     COALESCE(SUM(CASE WHEN codigoStatusPedidoTorre=6 THEN 1 ELSE 0 END),0) qtdStatusBloqueadoGerRisco,
                     COALESCE(SUM(ocorrenciaCriticidadeAlta),0)  qtdOcorrenciaCriticidadeAlta,
                     COALESCE(SUM(ocorrenciaCriticidadeBaixa),0) qtdOcorrenciaCriticidadeBaixa
               FROM
                   (
                   ${vSql}
                   ) y
           `
  }
  return vSql
}

const sqlObterPedido = (pParams) => {
  const vSql = `SELECT * FROM (
              SELECT  DISTINCT

                PRC.CODIGO "pedido.prCCodigo",
                IPR.ORDCOM "pedido.iprOrdcom",
                LPR.CODLPR "pedido.numeroProgramacaoVeiculo",

                --IPR.CODDES "pedido.codigoDestinatario",
                COALESCE(IPR.CODDES, LPR.CODDES) "pedido.codigoDestinatario",
                COALESCE(CLID.NOMEAB, CLIL.NOMEAB) "pedido.nomeDestinatario",
                CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PRECHE ELSE NULL END "pedido.dataChegadaPrevista",

                COALESCE(LPR.CODFIL,PRC.CODFIL)          "pedido.codigoFilial",
                COALESCE(LPR_FIL.NOMEAB,PRC_FIL.NOMEAB)  "pedido.nomeFilial",
                COALESCE(LPR_EMP.CODEMP,PRC_EMP.CODEMP)  "pedido.codigoEmpresa",
                COALESCE(LPR_EMP.DESCRI,PRC_EMP.DESCRI)  "pedido.nomeEmpresa",

                CASE WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157)
                      OR
                      (PRC.CODTOM in (125,148,149,151,152,154,155,157)
                      AND ISNULL(IPR.ORDCOM,' ') =  ' '))
                THEN CAST(PRC.CODIGO AS VARCHAR(10))
                ELSE IPR.ORDCOM END "pedido.numeroPedido",

                COALESCE(PRC.SITUAC,LPR.SITUAC) "pedido.identificacaoSituacao",

                CASE WHEN LPR.SITUAC = 'D' THEN 'COM ALOCACAO'
                  WHEN LPR.SITUAC = 'E' THEN 'EM VIAGEM'
                  WHEN LPR.SITUAC = 'F' THEN 'VIAGEM FINALIZADA'
                  WHEN LPR.SITUAC = 'C' THEN 'CANCELADO'
                  WHEN LPR.SITUAC = 'B' THEN 'BLOQUEADO GER. RISCO'
                  WHEN PRC.SITUAC IN ('D','M') THEN 'NOVO'
                  WHEN PRC.SITUAC = 'C' THEN 'CANCELADA'
                END AS "pedido.statusPedidoTorre",

                CASE WHEN LPR.SITUAC = 'D' THEN 3 -- COM ALOCACAO
                  WHEN LPR.SITUAC = 'E' THEN 4 -- EM VIAGEM
                  WHEN LPR.SITUAC = 'F' THEN 5 -- VIAGEM FINALIZADA
                  WHEN LPR.SITUAC = 'B' THEN 6 -- BLOQUEADO GER. RISCO
                  WHEN LPR.SITUAC = 'C' THEN 7 -- CANCELADA
                  WHEN PRC.SITUAC = 'D' THEN 1 -- CADASTRADA
                  WHEN PRC.SITUAC = 'M' THEN 1 -- MOVIMENTADA
                  WHEN PRC.SITUAC = 'C' THEN 7 -- CANCELADA
                END AS "pedido.sequenciaOrdenacaoPedido",


                PRC.CODPTC "pedido.codigoTipoCarga",
                PTC.DESCRI "pedido.descricaoTipoCarga",
                --
                PRC.CODTOM "pedido.codigoTomador",
                CLI.NOMEAB "pedido.nomeTomador",
                --
                COALESCE(LPR.CODLIN,PRC.CODLIN) "pedido.codigoLinha",

                PRC.DATREF "pedido.dataPedido",
                PRC.DATRET "pedido.dataRetirada",
                PRC.DATENT "pedido.dataEntrega",

                LPR.DATCHE "pedido.dataChegadaSolicitada",
                LPR.DATSAI "pedido.dataSaida",
                --
                PRC.CODREM "pedido.codigoRemetente",
                CLIR.NOMEAB "pedido.nomeRemetente",
                --
                PRC.TERCOL "pedido.codigoTerminalColeta",
                CLIT.RAZSOC "pedido.nomeTerminalColeta",
                --
                PRC.TERENT "pedido.codigoTerminalEntrega",
                CLIE.RAZSOC "pedido.nomeTerminalEntrega",
                --
                PRC.CODREG "pedido.codigoRegiaoComercial",
                REG.DESCRI "pedido.descricaoRegiaoComercial",
                --
                PRC.CODFRO "pedido.codigoFrota",
                FRO.DESCRI "pedido.descricaoFrota",

                COALESCE(LPR.PLACA,PRC.PLACA) "pedido.codigoPlacaVeiculo",
                VEI.NUMVEI "pedido.placaVeiculo",
                VEI.CODCMO "pedido.codigoClassificacaoVeiculo",
                CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PLACA2 ELSE NULL END "pedido.codigoPlacaVeiculo2",
                CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PLACA3 ELSE NULL END "pedido.codigoPlacaVeiculo3",
                CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PLACA4 ELSE NULL END "pedido.codigoPlacaVeiculo4",

                --
				CASE WHEN DPR.ID_DPR IS NOT NULL THEN VEI2.NUMVEI ELSE NULL END "pedido.placaVeiculo2",
                CASE WHEN DPR.ID_DPR IS NOT NULL THEN VEI3.NUMVEI ELSE NULL END "pedido.placaVeiculo3",
                CASE WHEN DPR.ID_DPR IS NOT NULL THEN VEI4.NUMVEI ELSE NULL END "pedido.placaVeiculo4",
				--
                
                COALESCE(LPR.DIFERE,PRC.DIFERE) "pedido.diferencial",
                CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.CODMO1 ELSE NULL END "pedido.codigoMotorista1",
                CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.CODMO2 ELSE NULL END "pedido.codigoMotorista2",
                MOT1.NOMMOT "pedido.nomeMotorista1",
                MOT2.NOMMOT "pedido.nomeMotorista2",
                --
                PRC.ID_ENDCOL "pedido.identificacaoEnderecoColeta",
                REND.ENDENT "pedido.nomeEnderecoColeta",
                PRC.FILDES "pedido.codiglFilialAtendimento",
                FILA.NOMEAB "pedido.nomeFilialAtendimento",

                -- Aba Container
                --
                COALESCE(PRC.RESERV,LPR.RESERV) "container.numeroReservaCTN",
                COALESCE(PRC.NOMPOR,LPR.NOMPOR) "container.nomePorto",
                COALESCE(PRC.AGENAV,LPR.AGENAV) "container.codigoAgenciaNavegac",
                COALESCE(CLIN.RAZSOC,CLIN.RAZSOC) "container.nomeRazaoSocialAgNaveg",
                COALESCE(PRC.NUMCTN,LPR.NUMCTN) "container.prefixoCTN",
                COALESCE(PRC.COMCTN,LPR.COMCTN) "container.comprimento",
                COALESCE(PRC.TARCTN,LPR.TARCTN) "container.tara",
                COALESCE(PRC.TIPCTN,LPR.TIPCTN) "container.tipoCTN",
                COALESCE(PRC.LOCATR,LPR.LOCATR) "container.codigoAtracArmaz",
                COALESCE(PRC.NOMNAV,LPR.NOMNAV) "container.nomeNavio",
                COALESCE(CLIA.RAZSOC,CLIA.RAZSOC) "container.localAtracArmaz",
                --
                -- Aba Aereo
                --
                COALESCE(PRC.NUMEDI,LPR.NUMEDI) "aereo.numeroDI",
                COALESCE(PRC.NUDTAE,LPR.NUDTAE) "aereo.numeroDTAE",
                COALESCE(PRC.NUDTA1,LPR.NUDTA1) "aereo.numeroDTA1",
                COALESCE(PRC.NUMAWB,LPR.NUMAWB) "aereo.numeroNAWB",
                COALESCE(PRC.NUHAWB,LPR.NUHAWB) "aereo.numeroHAWB",
                --
                -- Aba Informações Adicionais
                --
                COALESCE(PRC.NUMINV,LPR.NUMINV) "adicionais.numeroInvoice",
                --
                LPR.FILORI  "adicionais.codigoFilialOrigem",
                FILO.NOMEAB "adicionais.adicional.nomeFilialOrigem",
                --
                LPR.FILDES  "adicionais.codigoFilialDestino",
                FILD.NOMEAB "adicionais.nomeFilialDestino",
                --
                LPR.CODDES  "adicionais.codigoDestinatario",
                CLID.NOMEAB "adicionais.nomeDestinatario",
                --
                LPR.AEREO   "adicionais.identificacaoAereo",
                LPR.CONTAI  "adicionais.identificacaoContainer",
                LPR.OBSERV  "adicionais.observacaoProgramacao",
                --
                LPR.ID_ENDCOL "adicionais.codigoEnderecoColeta",
                RENC.ENDENT "adicionais.enderecoColeta",
                LPR.ID_ENDCOL "adicionais.codigoEnderecoEntrega",
                RENE.ENDENT "adicionais.enderecoEntrega",
                --
                -- Dados de inclusao e alteracao da progarmação
                --
                COALESCE(PRC.DATINC,LPR.DATINC) "log.dataInclusao",
                COALESCE(PRC.USUINC,LPR.USUINC) "log.usuarioInclusao",
                COALESCE(PRC.DATATU,LPR.DATATU) "log.dataAlteracao",
                COALESCE(PRC.USUATU,LPR.USUATU) "log.usuarioAlteracao",
                --
                -- Aba Destino da programação e produto
                --
                IPR.CODDES "destino.codigoDestinatario",
                CLID.NOMEAB "destino.nomeDestinatario",
                --
                -- Composição da carga
                --
                -- IPR.ID_IPR "IdentificacaoDestinoProduto", -- Suprimido campo destino produto para agrupar por destino
                IPR.SITUAC "composicaoCarga.identificacaoSituacaoDestino",
                IPR.ORDCOM "composicaoCarga.codigoAgrupadorIntegrator",

                CASE WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157)  -- Regra de Tomador, não é John Deere
                  OR
                  (PRC.CODTOM in (125,148,149,151,152,154,155,1057)       -- Regra de Tomador é John Deere
                  AND ISNULL(IPR.ORDCOM,' ') =  ' '))
                  THEN 'N'
                ELSE 'S' END "pedido.TomadorEhJohnDeere"

      FROM RODPRC PRC
      LEFT JOIN RODPTC PTC ON PTC.CODPTC = PRC.CODPTC -- cad. de tipo de carga
      LEFT JOIN RODIPR IPR ON (IPR.CODIGO = PRC.CODIGO -- Destino(s) de programação para pegar agrupador Integrator
                           AND IPR.CODFIL = PRC.CODFIL)
      LEFT JOIN RODFIL PRC_FIL ON (PRC.CODFIL = PRC_FIL.CODFIL)
      LEFT JOIN RODEMP PRC_EMP ON (PRC_FIL.CODEMP = PRC_EMP.CODEMP)
      LEFT JOIN RODDPR DPR ON (PRC.CODFIL = DPR.FILPRO
                           AND PRC.CODIGO = DPR.CODPRO
                           AND DPR.TIPDOC = 'V'
                           AND DPR.TIPPRO = 'C')
      LEFT JOIN RODLPR LPR ON (DPR.CODDOC = LPR.CODLPR -- Associativa PC versus PC
                           AND DPR.FILDOC = LPR.CODFIL)
      LEFT JOIN RODFIL LPR_FIL ON (LPR.CODFIL = LPR_FIL.CODFIL)
      LEFT JOIN RODEMP LPR_EMP ON (PRC_FIL.CODEMP = LPR_EMP.CODEMP)
      LEFT OUTER JOIN RODCLI CLI ON CLI.CODCLIFOR = PRC.CODTOM -- cad. de parceiro comercial (tomador)
      LEFT OUTER JOIN RODCLI CLIR ON CLIR.CODCLIFOR = PRC.CODREM -- cad. de parceiro comercial (remetente)
      LEFT OUTER JOIN RODCLI CLIT ON CLIT.CODCLIFOR = PRC.TERCOL -- cad. de parceiro comercial
      LEFT OUTER JOIN RODCLI CLIE ON CLIE.CODCLIFOR = PRC.TERENT -- cad. de parceiro comercial (terminal de entrega)
      LEFT OUTER JOIN CRMREG REG ON REG.CODREG = PRC.CODREG -- cad. de regiao comercial
      LEFT OUTER JOIN RODFRO FRO ON FRO.CODFRO = PRC.CODFRO -- cad. de frota
      LEFT OUTER JOIN RODVEI VEI ON VEI.CODVEI = COALESCE(LPR.PLACA,PRC.PLACA) -- cad. veiculos
      ---
	  LEFT JOIN RODVEI VEI2 ON (LPR.PLACA2 = VEI2.CODVEI)
      LEFT JOIN RODVEI VEI3 ON (LPR.PLACA3 = VEI3.CODVEI)
      LEFT JOIN RODVEI VEI4 ON (LPR.PLACA4 = VEI4.CODVEI)
	  ---
      LEFT OUTER JOIN RODEND REND ON REND.ID = PRC.ID_ENDCOL -- Cad. de Enderecao de coleta
      LEFT OUTER JOIN RODFIL FILA ON FILA.CODFIL = PRC.FILDES -- cad. de filial (Atendimento)
      LEFT OUTER JOIN RODCLI CLIN ON CLIN.CODCLIFOR = PRC.AGENAV -- cad. de parceiro comercial (navegac.)
      LEFT OUTER JOIN RODCLI CLIA ON CLIA.CODCLIFOR = PRC.LOCATR -- cad. de parceiro comercial (atrac. armazenagem)
      LEFT OUTER JOIN RODFIL FILO ON FILO.CODFIL = LPR.FILORI -- cad. de filial (origem)
      LEFT OUTER JOIN RODFIL FILD ON FILD.CODFIL = LPR.FILDES -- cad. de filial (destino)
      LEFT OUTER JOIN RODEND RENC ON RENC.ID = LPR.ID_ENDCOL -- Cad. de Enderecao de coleta
      LEFT OUTER JOIN RODEND RENE ON RENE.ID = LPR.ID_ENDENT -- Cad. de Enderecao de entrega
      -- Destino (1 ou mais destinos) com base na programação de carga
      LEFT OUTER JOIN RODCLI CLID ON CLID.CODCLIFOR = IPR.CODDES
      LEFT OUTER JOIN RODCLI CLIL ON (CLIL.CODCLIFOR = LPR.CODDES)
      LEFT OUTER JOIN RODMOT MOT1 ON (MOT1.CODMOT = LPR.CODMO1)
      LEFT OUTER JOIN RODMOT MOT2 ON (MOT2.CODMOT = LPR.CODMO2)
      WHERE
              ${pParams.tipo === 'PRC' ? ' PRC.CODIGO = :numeroPedido ' : ' IPR.ORDCOM = :numeroPedido '}
   ) p
   WHERE p."pedido.codigoFilial" = :codigoFilial`

  return vSql
}

const sqlProgramacaoVeiculo = `
SELECT
   distinct
   DPR.FILPRO "programacaoVeiculo.codigoFilial",
   DPR.CODPRO "programacaoVeiculo.numeroPedido",
   LPR.CODLPR "programacaoVeiculo.numeroProgramacaoVeiculo",
   --
   LPR.CODTOM "programacaoVeiculo.codigoTomador",
   CLI.RAZSOC "programacaoVeiculo.nomeTomador",
   --
   LPR.CODREM "programacaoVeiculo.codigoRemetente",
   CLIR.RAZSOC "programacaoVeiculo.nomeRemetente",
   --
   LPR.CODDES "programacaoVeiculo.codigoDestinatario",
   CLID.RAZSOC "programacaoVeiculo.nomeDestinatario"
   --
FROM RODLPR LPR -- Programação do veiculo
INNER JOIN RODCLI CLI on CLI.CODCLIFOR = LPR.CODTOM -- cad. de parceiro comercial (tomador)
INNER JOIN RODCLI CLIR on CLIR.CODCLIFOR = LPR.CODREM -- cad. de parceiro comercial (cliente carga)
INNER JOIN RODCLI CLID on CLID.CODCLIFOR = LPR.CODDES -- cad. de parceiro comercial (Destinatario)
INNER JOIN RODDPR DPR ON DPR.TIPPRO='C' -- Associativa PV vs Docs
                     AND DPR.FILDOC=LPR.CODFIL
                     AND DPR.CODDOC=LPR.CODLPR
                     AND DPR.TIPDOC = 'V' -- FIXADO
WHERE LPR.CODFIL = :codigoFilial  -- Informar a filial da programação do veículo
AND LPR.CODLPR = :numeroProgramacaoVeiculo; -- Informar o numero da programção do veículo`

const sqlObterNumeroPedido = `
SELECT * FROM (
  SELECT
   DISTINCT
   CASE WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157)  -- Regra de Tomador, não é John Deere
           OR
    (PRC.CODTOM in (125,148,149,151,152,154,155,157)       -- Regra de Tomador é John Deere
    AND ISNULL(IPR.ORDCOM,' ') =  ' '))
    THEN 'PRC'
    ELSE 'IPR' END "tipo",
   CASE WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157)  -- Regra de Tomador, não é John Deere
                                 OR
                                 (PRC.CODTOM in (125,148,149,151,152,154,155,157)       -- Regra de Tomador é John Deere
                                 AND ISNULL(IPR.ORDCOM,' ') =  ' '))
                                 THEN CAST(PRC.CODIGO AS VARCHAR(10))
                                 ELSE IPR.ORDCOM END "pedido.numeroPedido",
                 COALESCE(LPR.CODFIL,PRC.CODFIL)  "pedido.codigoFilial"
 FROM RODPRC PRC
    LEFT JOIN RODIPR IPR on (IPR.CODIGO = PRC.CODIGO )
  LEFT JOIN
          RODDPR DPR ON PRC.CODFIL = DPR.FILPRO
                     AND PRC.CODIGO = DPR.CODPRO
                     AND DPR.TIPDOC = 'V'
                     AND DPR.TIPPRO = 'C'
      LEFT JOIN
           RODLPR LPR ON DPR.CODDOC = LPR.CODLPR -- Associativa PC versus PC
                      AND DPR.FILDOC = LPR.CODFIL
      LEFT JOIN
          RODFIL LPR_FIL ON LPR.CODFIL = LPR_FIL.CODFIL
  ) p
   WHERE p."pedido.numeroPedido" = :numeroPedido  AND P."pedido.codigoFilial" = :codigoFilial`

const sqlComposicaoCarga = `
SELECT * FROM (
    SELECT
    PRC.CODFIL "composicaoCarga.codigoFilial",
    CASE WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157)
                      OR
                      (PRC.CODTOM in (125,148,149,151,152,154,155,157)
                      AND ISNULL(IPR.ORDCOM,' ') =  ' '))
                THEN CAST(PRC.CODIGO AS VARCHAR(10))
                ELSE IPR.ORDCOM END "composicaoCarga.numeroPedido",
    PRC.SITUAC "composicaoCarga.identificacaoSituacao",
    CASE WHEN PRC.SITUAC = 'D' THEN 'CADASTRADA'
        WHEN PRC.SITUAC = 'M' THEN 'MOVIMENTADA'
        WHEN PRC.SITUAC = 'B' THEN 'BAIXADA'
        WHEN PRC.SITUAC = 'I' THEN 'BAIXADA'
        WHEN PRC.SITUAC = 'C' THEN 'CANCELADA'
    END "composicaoCarga.descricacaoSituacao",
    --
    -- Dados de inclusao e alteracao da progarmação
    --
    PRC.DATINC "composicaoCarga.dataInclusao",
    PRC.USUINC "composicaoCarga.usuarioInclusao",
    PRC.DATATU "composicaoCarga.dataAlteracao",
    PRC.USUATU "composicaoCarga.usuarioAlteracao",
    --
    -- Composição da carga
    --
    IPR.ID_IPR "composicaoCarga.IdentificacaoDestinoProduto",
    --
    IPR.CODDES "composicaoCarga.codigoDestino",
    IPR.ORDCOM "composicaoCarga.codigoAgrupadorIntegrator",
    --
    IPR.SERIEN "composicaoCarga.serieNotaFiscal",
    IPR.NUMNOT "composicaoCarga.numeroNotaFiscal",
    IPR.DATNOT "composicaoCarga.dataNotaFiscal",
    IPR.CODPROTR "composicaoCarga.codigoProduto",
    PRO.DESCRI "composicaoCarga.descricaoProduto",
    PRO.ESPECI "composicaoCarga.especieProduto",
    IPR.NATURE "composicaoCarga.identificacaoNatureza",
    IPR.ESPECI "composicaoCarga.identificacaoEspecie",
    IPR.QUANTI "composicaoCarga.quantidadeItem",
    IPR.PESOKG "composicaoCarga.pesoKG",
    IPR.CUBAGE "composicaoCarga.identificacaoCubagem",
    CASE WHEN IPR.CUBAGE = 'S' THEN 'SIM'
        WHEN IPR.CUBAGE = 'N' THEN 'NAO'
    END "composicaoCarga.descricaoCubagem",
    IPR.ORDCOM "composicaoCarga.numeroReferenteCliente",
    IPR.LARGUR "composicaoCarga.largura",
    IPR.ALTURA "composicaoCarga.altura",
    IPR.PROFUN "composicaoCarga.profundidade",
    IPR.PESCUB "composicaoCarga.pesoCubagem",
    IPR.PESCAL "composicaoCarga.pesoCalculado",
    IPR.VLRMER "composicaoCarga.valorMercadoria",
    IPR.VMERSE "composicaoCarga.valorMercadoriaSegurada",
    IPR.ITECOM "composicaoCarga.numeroNossaReferencia",
    IPR.NOTNFE "composicaoCarga.numerNotaFiscalEletronica"
  FROM RODPRC PRC -- Programação de carga
  INNER JOIN RODFIL FIL ON FIL.CODFIL = PRC.CODFIL -- cad. de filial
  INNER JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
  -- Destino (1 ou mais destinos) com base na programação de carga
  LEFT OUTER JOIN RODIPR IPR on IPR.CODFIL = PRC.CODFIL AND IPR.CODIGO = PRC.CODIGO -- Destino(s) de programação
  -- Produtos (1 ou mais produtos) com base na programação de carga
  LEFT OUTER JOIN RODPRO PRO on PRO.CODPROTR = IPR.CODPROTR
  )P
WHERE p."composicaoCarga.numeroPedido" = :numeroPedido  AND P."composicaoCarga.codigoFilial" = :codigoFilial`

const storedProcedureGeraProgramacaoVeiculo = `
DECLARE
    @return_value int,
    @CODLPR       int,
    @RETORNO      nvarchar(500)

EXEC
    @return_value = [dbo].[PI_GERA_PV_PRINCIPAL]
    @CODFIL  = :codigoFilial,
    @CODIGO  = :numeroPedido,
    @CODMO1  = :codigoMotorista1,
    @CODMO2  = :codigoMotorista2,
    @PLACA   = :placa,
    @PLACA2  = :placa2,
    @PLACA3  = :placa3,
    @PLACA4  = :placa4,
    @DATSAI  = :dataSaida,
    @USUARIO = :usuario,
    @CODLPR  = @CODLPR OUTPUT,
    @RETORNO = @RETORNO OUTPUT

SELECT
    @CODLPR  as N'programacaoVeiculo.numeroProgramacaoVeiculo',
    @RETORNO as N'programacaoVeiculo.retorno'
`

const sqlPedidosEmViagem = `
SELECT DISTINCT -- DEVIDO DUPLICIDADE NA TABELA RODDPR
    RODDPRC.CODPRO numeroPedido,
    RODDPRC.FILPRO codigoFilial,
    RODFIL.NOMEAB nomeFilial,
    --
    -- ***************************************************************
    -- RECUPERA AS INFORMAÇÕES DO PEDIDO DE CARGA COM BASE NAS VIAGENS
    -- ***************************************************************
    VIA.codigoManifesto,
    VIA.codigoFilialManifesto,
    VIA.serieManifesto,
    --
    --VIA.tipoManifesto,
    --VIA.descricacaoTipoManifesto,
    --
    RODLPR.CODLPR codigoPV,
    RODLPR.CODFIL filialPV,
    --
    -- Veiculo com base no manifesto de carga
    VIA.codigoPlacaVeiculo,
    VEICULO_1.NUMVEI AS placaVeiculo,
    VIA.codigoPlacaVeiculo2,
    VEICULO_2.NUMVEI AS placaVeiculo2,
    VIA.codigoPlacaVeiculo3,
    VEICULO_3.NUMVEI AS placaVeiculo3,
    VIA.codigoPlacaVeiculo4,
    VEICULO_4.NUMVEI AS placaVeiculo4,
    --
    VIA.codigoMotorista1,
    RODMOT.NOMMOT nomeMotorista1,
    VIA.codigoMotorista2,
    VIA.codigoMotorista3
    --
FROM RODDPR, -- BUSCAR A PV COM BASE DOC DE ORIGEM DO MANIFESTO DE CARGA
     RODLPR, -- PV-PROGRAMACAO DO VEICULO
     RODDPR RODDPRC, -- BUSCAR A PC COM BASE NA PV
     RODPRC, -- PC-PROGRAMACAO DE CARGA
    (
      SELECT
       -- *****************************************************************
       -- RECUPERA AS VIAGENS EM ANDAMENTO COM BASE NOS MANIFESTOS DE CARGA
       -- *****************************************************************
       MAN.CODFIL "codigoFilialManifesto",
       MAN.SERMAN "serieManifesto",
       MAN.CODMAN "codigoManifesto",
       --
       MAN.TIPMAN "tipoManifesto",
       CASE
       WHEN MAN.TIPMAN = 1 THEN 'LOTAÇÃO'
       WHEN MAN.TIPMAN = 2 THEN 'Transferência'
       WHEN MAN.TIPMAN = 4 THEN 'Mista'
       WHEN MAN.TIPMAN = 6 THEN 'Distribuição'
       WHEN MAN.TIPMAN = 7 THEN 'Coleta'
       WHEN MAN.TIPMAN = 8 THEN 'Reentrega'
       END "descricacaoTipoManifesto",
       --
       CASE WHEN TIPDOC = 'O' THEN 'O.S.T.'
       WHEN TIPDOC = 'A' THEN 'A.C.T.'
       WHEN TIPDOC = 'C' THEN 'C.T.R.C.'
       END tipoDocumentoEmissao,
       --
       DOC.filialDocOrigemMAN,
       DOC.serieDocOrigemMAN,
       DOC.codigoDocOrigemMAN,
       -- DOC DE ORIGEM PARA BUSCAR A PV
       DOC.DOCPV,
       DOC.filialDocOrigemPV,
       DOC.serieDocOrigemPV,
       DOC.codigoDocOrigemPV,
       --
       MAN.PLACA "codigoPlacaVeiculo",
       MAN.PLACA2 "codigoPlacaVeiculo2",
       MAN.PLACA3 "codigoPlacaVeiculo3",
       MAN.PLACA4 "codigoPlacaVeiculo4",
       --
       MAN.CODMO1 "codigoMotorista1",
       MAN.CODMO2 "codigoMotorista2",
       MAN.CODMO3 "codigoMotorista3",
       --
       ISNULL(DOC.ORDEM,0) AS POSICAO,
       ISNULL(DOC.ORDMAN,0) AS ORDMAN
       --
       FROM RODMAN MAN,
       (
        -- OST ******************************
        SELECT
        RODIMA.FILMAN,
        RODIMA.SERMAN,
        RODIMA.CODMAN,
        RODIMA.ORDEM,
        RODIMA.ORDMAN,
        RODIMA.TIPDOC,
        RODIMA.FILDOC "FilialDocOrigemMAN",
        RODIMA.SERDOC "serieDocOrigemMAN",
        RODIMA.CODDOC "codigoDocOrigemMAN",
        'O' DOCPV, -- OST,
        RODORD.CODFIL "filialDocOrigemPV",
        RODORD.SERORD "serieDocOrigemPV",
        RODORD.CODIGO "codigoDocOrigemPV"
        FROM RODIMA, RODORD
        Where RODORD.CODFIL = RODIMA.FILDOC
        AND  RODORD.SERORD = RODIMA.SERDOC
        AND  RODORD.CODIGO = RODIMA.CODDOC
        AND  RODIMA.TIPDOC = 'O'  -- ****** OST
        --
        UNION ALL
        -- OST COM BASE CTE ******************************
        SELECT
        RODIMA.FILMAN,
               RODIMA.SERMAN,
               RODIMA.CODMAN,
               RODIMA.ORDEM,
               RODIMA.ORDMAN,
               RODIMA.TIPDOC,
               RODIMA.FILDOC "FilialDocOrigemMAN",
               RODIMA.SERDOC "serieDocOrigemMAN",
               RODIMA.CODDOC "codigoDocOrigemMAN",
               'O' DOCPV, -- OST
               RODORD.CODFIL "filialDocOrigemPV",
               RODORD.SERORD "serieDocOrigemPV",
               RODORD.CODIGO "codigoDocOrigemPV"
               FROM RODIMA, RODCON, RODORC, RODORD
               Where  RODCON.CODFIL = RODIMA.FILDOC
               AND  RODCON.SERCON = RODIMA.SERDOC
               AND  RODCON.CODCON = RODIMA.CODDOC
               AND  RODIMA.TIPDOC = 'C'
               -- Recupera a OST com base no CTE
               AND RODORC.CODCON = RODCON.CODCON
               AND RODORC.SERCON = RODCON.SERCON
               AND RODORC.FILCON = RODCON.CODFIL
               --
               AND RODORD.CODFIL = RODORC.FILORD
               AND RODORD.SERORD = RODORC.SERORD
               AND RODORD.CODIGO = RODORC.CODORD
               --
               UNION ALL
               -- ACT ****************************
               SELECT
               RODIMA.FILMAN,
               RODIMA.SERMAN,
               RODIMA.CODMAN,
               RODIMA.ORDEM,
               RODIMA.ORDMAN,
               RODIMA.TIPDOC,
               RODIMA.FILDOC "FilialDocOrigemMAN",
               RODIMA.SERDOC "serieDocOrigemMAN",
               RODIMA.CODDOC "codigoDocOrigemMAN",
               'A' DOCPV, --ACT
               RODCOL.CODFIL "filialDocOrigemPV",
               RODCOL.SERCOL "serieDocOrigemPV",
               RODCOL.CODIGO "codigoDocOrigemPV"
               FROM RODIMA, RODCOL
               Where  RODCOL.CODFIL = RODIMA.FILDOC
               AND  RODCOL.SERCOL = RODIMA.SERDOC
               AND  RODCOL.CODIGO = RODIMA.CODDOC
               AND  RODIMA.TIPDOC = 'A' -- ******* ACT
               --
               UNION ALL
               -- ACT COM BASE CTE ****************************
               SELECT
               RODIMA.FILMAN,
               RODIMA.SERMAN,
               RODIMA.CODMAN,
               RODIMA.ORDEM,
               RODIMA.ORDMAN,
               RODIMA.TIPDOC,
               RODIMA.FILDOC "FilialDocOrigemMAN",
               RODIMA.SERDOC "serieDocOrigemMAN",
               RODIMA.CODDOC "codigoDocOrigemMAN",
               'A' DOCPV, --ACT
               RODCOL.CODFIL "filialDocOrigemPV",
               RODCOL.SERCOL "serieDocOrigemPV",
               RODCOL.CODIGO "codigoDocOrigemPV"
               FROM RODIMA, RODCON, RODCOC, RODCOL
               Where  RODCON.CODFIL = RODIMA.FILDOC
               AND  RODCON.SERCON = RODIMA.SERDOC
               AND  RODCON.CODCON = RODIMA.CODDOC
               AND  RODIMA.TIPDOC = 'C'
               -- Recupera a ACT com base no CTE
               AND RODCOC.CODCON = RODCON.CODCON
               AND RODCOC.SERCON = RODCON.SERCON
               AND RODCOC.FILCON = RODCON.CODFIL
               --
               AND RODCOL.CODIGO = RODCOC.CODCOL
               AND RODCOL.SERCOL = RODCOC.SERCOL
               AND RODCOL.CODFIL = RODCOC.FILCOL
               --
               )  DOC
               --
               WHERE MAN.SITUAC IN ('D','E') -- STATUS=eEM VIAGEM (CASO PRECISAR
                --                              TRAZER MAIS CASOS
                --                              UTILIZAR STATUS-'B'=BAIXADO
                --
                AND MAN.TIPMAN NOT IN (2, 6) -- TRANSFERENCIA (FLUXO DE EXCEÇÃO PARA OUTRA QUERY SEPARADA)
                AND DOC.CODMAN = MAN.CODMAN -- CHAVE DA RODIMA
                AND DOC.FILMAN = MAN.CODFIL -- CHAVE DA RODIMA
                AND DOC.SERMAN = MAN.SERMAN -- CHAVE DA RODIMA
) VIA
INNER JOIN
    RODFIL ON RODFIL.CODFIL = VIA.codigoFilialManifesto
LEFT JOIN
    RODVEI VEICULO_1 ON VEICULO_1.CODVEI = VIA.codigoPlacaVeiculo
LEFT JOIN
    RODVEI VEICULO_2 ON VEICULO_2.CODVEI = VIA.codigoPlacaVeiculo2
LEFT JOIN
    RODVEI VEICULO_3 ON VEICULO_3.CODVEI = VIA.codigoPlacaVeiculo3
LEFT JOIN
    RODVEI VEICULO_4 ON VEICULO_4.CODVEI = VIA.codigoPlacaVeiculo4
LEFT JOIN
    RODMOT ON RODMOT.CODMOT = VIA.codigoMotorista1
WHERE  RODDPR.TIPPRO = 'V' -- Associativa PV vs Docs de origem
  AND  RODDPR.FILDOC = VIA.filialDocOrigemPV
  AND  RODDPR.CODDOC = VIA.codigoDocOrigemPV
  AND  RODDPR.SERDOC = VIA.serieDocOrigemPV
  AND  RODDPR.TIPDOC = VIA.DOCPV -- CONFORME DOC DE ORIGEM
  --
  AND  RODLPR.CODFIL = RODDPR.FILPRO
  AND  RODLPR.CODLPR = RODDPR.CODPRO
  --  BUSCAR O PEDIDO COM BASE NA PV
  AND  RODDPRC.FILDOC = RODLPR.CODFIL
  AND  RODDPRC.CODDOC = RODLPR.CODLPR
  AND  RODDPRC.TIPDOC = 'V'
  AND  RODDPRC.TIPPRO = 'C'
  --   BUSCAR A PC COM BASE NA PV
  AND  RODPRC.CODFIL = RODDPRC.FILPRO
  AND  RODPRC.CODIGO = RODDPRC.CODPRO
  -- AND RODDPRC.CODPRO in ('13525','13524','13524','17307','13446','13505','13522','7448','7450','7456','45524','112395')
  -- AND RODDPRC.CODPRO in ('112395','13524')
  -- AND RODDPRC.CODPRO in ('102052')
  -- AND RODDPRC.CODPRO in ('19358','SC01-C' ,'8834' 'SP-54;SEX;19062020','14100', 'PR-03;QUA;17062020', '14124',' 14127')
  --
ORDER BY codigoManifesto,
         codigoFilialManifesto,
         serieManifesto`

const sqlPedidosNovosAndEmAlocacao = `
SELECT
    PEDIDOS_MONITORAMENTO.numeroPedido               AS numeroPedido,
    PEDIDOS_MONITORAMENTO.codigoFilial               AS codigoFilial,
    PEDIDOS_MONITORAMENTO.statusPedido               AS statusPedido,
    PEDIDOS_MONITORAMENTO.sequenciaOrdenacaoPedido   AS sequenciaOrdenacaoPedido,
    PEDIDOS_MONITORAMENTO.codigoLinha                AS codigoLinha,
    PEDIDOS_MONITORAMENTO.codigoTomador              AS codigoTomador,
    PEDIDOS_MONITORAMENTO.codigoRemetente            AS codigoRemetente,
    PEDIDOS_MONITORAMENTO.codigoDestinatario         AS codigoDestinatario,
    PEDIDOS_MONITORAMENTO.codigoPlacaVeiculo         AS codigoPlacaVeiculo,
    VEICULO_1.NUMVEI                                 AS placaVeiculo,
    VEICULO_1.CODCMO                                 AS codigoClassificacaoVeiculo,
    PEDIDOS_MONITORAMENTO.codigoPlacaVeiculo2        AS codigoPlacaVeiculo2,
    VEICULO_2.NUMVEI                                 AS placaVeiculo2,
    PEDIDOS_MONITORAMENTO.codigoPlacaVeiculo3        AS codigoPlacaVeiculo3,
    VEICULO_3.NUMVEI                                 AS placaVeiculo3,
    PEDIDOS_MONITORAMENTO.codigoPlacaVeiculo4        AS codigoPlacaVeiculo4,
    VEICULO_4.NUMVEI                                 AS placaVeiculo4,
    PEDIDOS_MONITORAMENTO.diferencial                AS diferencial,
    PEDIDOS_MONITORAMENTO.codigoMotorista1           AS codigoMotorista1,
    PEDIDOS_MONITORAMENTO.codigoMotorista2           AS codigoMotorista2,
    PEDIDOS_MONITORAMENTO.dataInicioViagem           AS dataInicioViagem,
    PEDIDOS_MONITORAMENTO.dataRetirada               AS dataColeta,
    PEDIDOS_MONITORAMENTO.dataChegada                AS dataEntrega,
    PEDIDOS_MONITORAMENTO.dataProgramacao            AS dataProgramacao,
    PEDIDOS_MONITORAMENTO.dataPedido                 AS dataPedido
FROM
   (SELECT
        numeroPedido                                 AS numeroPedido,
        codigoFilial                                 AS codigoFilial,
        statusPedidoTorre                            AS statusPedido,
        sequenciaOrdenacaoPedido                     AS sequenciaOrdenacaoPedido,
        codigoTomador                                AS codigoTomador,
        CASE
            WHEN TomadorEhJohnDeere = 'S'
            THEN NULL
            ELSE codigoLinha
            END                                      AS codigoLinha,
        CASE
            WHEN TomadorEhJohnDeere = 'S'
            THEN NULL
            ELSE codigoRemetente
            END                                      AS codigoRemetente,
        CASE
            WHEN TomadorEhJohnDeere = 'S'
            THEN NULL
            ELSE codigoDestinatario
            END                                      AS codigoDestinatario,
        codigoPlacaVeiculo                           AS codigoPlacaVeiculo,
        codigoPlacaVeiculo2                          AS codigoPlacaVeiculo2,
        codigoPlacaVeiculo3                          AS codigoPlacaVeiculo3,
        codigoPlacaVeiculo4                          AS codigoPlacaVeiculo4,
        diferencial                                  AS diferencial,
        codigoMotorista1                             AS codigoMotorista1,
        codigoMotorista2                             AS codigoMotorista2,
        dataInicioViagem                             AS dataInicioViagem,
        MIN(dataRetirada)                            AS dataRetirada,
        MIN(dataChegada)                             AS dataChegada,
        dataProgramacao                              AS dataProgramacao,
        MIN(dataPedido)                              AS dataPedido
    FROM
       (SELECT
            CASE
                WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157) -- Regra de Tomador, não é John Deere
                      OR
                     (PRC.CODTOM in (125,148,149,151,152,154,155,1057) -- Regra de Tomador é John Deere
                      AND ISNULL(IPR.ORDCOM,' ') =  ' '))
                THEN 'N'
                ELSE 'S' END                                                      AS TomadorEhJohnDeere,
            COALESCE(LPR.CODFIL,PRC.CODFIL)                                       AS codigoFilial,
            COALESCE(LPR_FIL.NOMEAB,PRC_FIL.NOMEAB)                               AS nomeFilial,
            COALESCE(LPR_EMP.CODEMP,PRC_EMP.CODEMP)                               AS codigoEmpresa,
            COALESCE(LPR_EMP.DESCRI,PRC_EMP.DESCRI)                               AS nomeEmpresa,
            PRC.CODIGO                                                            AS PRC_CODIGO,
            IPR.ORDCOM                                                            AS IPR_ORDCOM,
            CASE
                WHEN (PRC.CODTOM NOT IN (125,148,149,151,152,154,155,157) -- Regra de Tomador, não é John Deere
                      OR
                     (PRC.CODTOM in (125,148,149,151,152,154,155,157) -- Regra de Tomador é John Deere
                      AND ISNULL(IPR.ORDCOM,' ') =  ' '))
                THEN LTRIM(CAST(PRC.CODIGO AS VARCHAR(10)))
                ELSE LTRIM(IPR.ORDCOM)
                END                                                               AS numeroPedido,
            CASE
                WHEN LPR.SITUAC = 'D' THEN 'COM_ALOCACAO'
                WHEN LPR.SITUAC = 'E' THEN 'EM VIAGEM'
                WHEN LPR.SITUAC = 'F' THEN 'VIAGEM FINALIZADA'
                WHEN LPR.SITUAC = 'C' THEN 'CANCELADO'
                WHEN LPR.SITUAC = 'B' THEN 'BLOQUEADO GER. RISCO'
                WHEN PRC.SITUAC IN ('D','M') THEN 'NOVO'
                WHEN PRC.SITUAC = 'C' THEN 'CANCELADA'
                END                                                               AS statusPedidoTorre,
            CASE
                WHEN LPR.SITUAC = 'D' THEN 3 -- COM_ALOCACAO
                WHEN LPR.SITUAC = 'E' THEN 4 -- EM VIAGEM
                WHEN LPR.SITUAC = 'F' THEN 5 -- VIAGEM FINALIZADA
                WHEN LPR.SITUAC = 'B' THEN 6 -- BLOQUEADO GER. RISCO
                WHEN LPR.SITUAC = 'C' THEN 7 -- CANCELADA
                WHEN PRC.SITUAC = 'D' THEN 1 -- CADASTRADA
                WHEN PRC.SITUAC = 'M' THEN 1 -- MOVIMENTADA
                WHEN PRC.SITUAC = 'C' THEN 7  -- CANCELADA
                END                                                               AS sequenciaOrdenacaoPedido,
            PRC.CODPTC                                                            AS codigoTipoCarga,
            PTC.DESCRI                                                            AS descricaoTipoCarga,
            COALESCE(LPR.CODLIN,PRC.CODLIN)                                       AS codigoLinha,
            PRC.CODTOM                                                            AS codigoTomador,
            PRC.CODREM                                                            AS codigoRemetente,
            IPR.CODDES                                                            AS codigoDestinatario,
            COALESCE(LPR.PLACA,PRC.PLACA)                                         AS codigoPlacaVeiculo,
            CASE
                WHEN DPR.ID_DPR IS NOT NULL
                THEN LPR.PLACA2
                ELSE NULL
                END                                                               AS codigoPlacaVeiculo2,
            CASE
                WHEN DPR.ID_DPR IS NOT NULL
                THEN LPR.PLACA3
                ELSE NULL
                END                                                               AS codigoPlacaVeiculo3,
            CASE
                WHEN DPR.ID_DPR IS NOT NULL
                THEN LPR.PLACA4
                ELSE NULL
                END                                                               AS codigoPlacaVeiculo4,
            COALESCE(LPR.DIFERE,PRC.DIFERE)                                       AS diferencial,
            CASE
                WHEN DPR.ID_DPR IS NOT NULL
                THEN LPR.CODMO1
                ELSE NULL
                END                                                               AS codigoMotorista1,
            CASE
                WHEN DPR.ID_DPR IS NOT NULL
                THEN LPR.CODMO2
                ELSE NULL
                END                                                               AS codigoMotorista2,
            LPR.DATSAI                                                            AS dataInicioViagem,
            PRC.DATRET                                                            AS dataRetirada,
            PRC.DATENT                                                            AS dataChegada,
            LPR.DATINC                                                            AS dataProgramacao,
            PRC.DATREF                                                            AS dataPedido
        FROM
            RODPRC PRC
        LEFT JOIN
            RODPTC PTC ON PTC.CODPTC = PRC.CODPTC -- cad. de tipo de carga
        LEFT JOIN
            RODIPR IPR ON IPR.CODIGO = PRC.CODIGO -- Destino(s) de programação para pegar agrupador Integrator
                       AND IPR.CODFIL = PRC.CODFIL
        LEFT JOIN
            RODFIL PRC_FIL ON PRC.CODFIL = PRC_FIL.CODFIL
        LEFT JOIN
            RODEMP PRC_EMP ON PRC_FIL.CODEMP = PRC_EMP.CODEMP
        LEFT JOIN
            RODDPR DPR ON PRC.CODFIL = DPR.FILPRO
                       AND PRC.CODIGO = DPR.CODPRO
                       AND DPR.TIPDOC = 'V'
                       AND DPR.TIPPRO = 'C'
        LEFT JOIN
             RODLPR LPR ON DPR.CODDOC = LPR.CODLPR -- Associativa PC versus PC
                        AND DPR.FILDOC = LPR.CODFIL
        LEFT JOIN
            RODFIL LPR_FIL ON LPR.CODFIL = LPR_FIL.CODFIL
        LEFT JOIN
            RODEMP LPR_EMP ON PRC_FIL.CODEMP = LPR_EMP.CODEMP
        WHERE
           (
               (PRC.SITUAC IN ('D','M') AND  DPR.ID_DPR IS NULL) -- Programação Carga Não canceladas
                OR
               (LPR.SITUAC IN ('D','E') AND DPR.ID_DPR IS NOT NULL)-- Programação de Veículo Não Canceladas, nem Finalizadas
           )
        AND
           (IPR.CODIGO IS NOT NULL OR LPR.CODLPR IS NULL) -- Se for programação de veículo, deve ter Destino de programação
        --AND PRC.CODFIL IN (51) --1,2,3,38,15,50,51,52)
        UNION ALL
        SELECT
            'N'                                                          AS TomadorEhJohnDeere,
            VAZ.CODFIL                                                   AS codigoFilial,
            FIL.NOMEAB                                                   AS nomeFilial,
            EMP.CODEMP                                                   AS codigoEmpresa,
            EMP.DESCRI                                                   AS nomeEmpresa,
            ''                                                           AS PRC_CODIGO,
            ''                                                           AS IPR_ORDCOM,
            CAST(VAZ.CODVAZ AS VARCHAR(10))                              AS numeroPedido,
            CASE
                WHEN MAN.SITUAC = 'E' THEN 'EM VIAGEM'
                WHEN MAN.SITUAC = 'C' THEN 'CANCELADO'
                WHEN MAN.SITUAC = 'B' THEN 'FINALIZADO'
                END                                                      AS statusPedidoTorre,
            CASE
                WHEN MAN.SITUAC = 'E' THEN 4 -- EM VIAGEM
                WHEN MAN.SITUAC = 'C' THEN 7 -- CANCELADA
                WHEN MAN.SITUAC = 'B' THEN 5 -- VIAGEM FINALIZADA
                END                                                      AS sequenciaOrdernacaoPedido,
            NULL                                                         AS codigoTipoCarga,
            'Deslocamento Vazio'                                         AS descricaoTipoCarga,
            MAN.CODLIN                                                   AS codigoLinha,
            NULL                                                         AS codigoTomador,
            NULL                                                         AS codigoRemetente,
            NULL                                                         AS codigoDestinatario,
            MAN.PLACA                                                    AS codigoPlacaVeiculo,
            MAN.PLACA2                                                   AS codigoPlacaVeiculo2,
            MAN.PLACA3                                                   AS codigoPlacaVeiculo3,
            MAN.PLACA4                                                   AS codigoPlacaVeiculo4,
            VAZ.DIFERE                                                   AS diferencial,
            MAN.CODMO1                                                   AS codigoMotorista1,
            MAN.CODMO2                                                   AS codigoMotorista2,
            NULL                                                         AS dataInicioViagem,
            NULL                                                         AS dataRetirada,
            NULL                                                         AS dataChegada,
            NULL                                                         AS dataProgramacao,
            NULL                                                         AS dataPedido
        FROM
            RODVAZ VAZ -- Busca o manifesto com base na RODVAZ (deslocamento vazio)
        INNER JOIN
            RODFIL FIL ON FIL.CODFIL = VAZ.CODFIL -- cad. de filial
        INNER JOIN
            RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
        INNER JOIN
            RODIMA IMA ON IMA.TIPDOC='D' -- DESLOCAMENTO VAZIO
                       AND IMA.CODDOC = VAZ.CODVAZ
                       AND IMA.FILDOC = VAZ.CODFIL --Associativa Manifesto VS Docs OST
        INNER JOIN
            RODMAN MAN ON MAN.CODMAN = IMA.CODMAN
                       AND MAN.CODFIL = IMA.FILMAN
                       AND MAN.SERMAN = IMA.SERMAN
                       AND MAN.SITUAC IN ('E', 'C', 'B') -- APENAS STATUS EMITIDO, CANCELADO, BAIXADO
        ) PEDIDOS
    WHERE
        PEDIDOS.statusPedidoTorre IN ('COM_ALOCACAO', 'NOVO')
    --  AND PEDIDOS.numeroPedido IN ('45524')
    -- AND PEDIDOS.numeroPedido IN ('11010')
    -- AND PEDIDOS.numeroPedido IN ('112395')
    -- AND PEDIDOS.numeroPedido IN ('19189','13524','SP-44;QUA;17062020', 'SC01-B;QUA;17062020', 'PR-03;QUA;17062020')

    GROUP BY
        -- TomadorEhJohnDeere,
        codigoFilial,
        nomeFilial,
        codigoEmpresa,
        nomeEmpresa,
        numeroPedido,
        statusPedidoTorre,
        sequenciaOrdenacaoPedido,
        codigoTipoCarga,
        descricaoTipoCarga,
        codigoTomador,
        CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE codigoLinha END,
        CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE codigoRemetente END,
        CASE WHEN TomadorEhJohnDeere = 'S' THEN NULL ELSE codigoDestinatario END,
        codigoPlacaVeiculo,
        codigoPlacaVeiculo2,
        codigoPlacaVeiculo3,
        codigoPlacaVeiculo4,
        diferencial,
        codigoMotorista1,
        codigoMotorista2,
        dataProgramacao,
        dataInicioViagem) PEDIDOS_MONITORAMENTO
LEFT JOIN
    RODVEI VEICULO_1 ON VEICULO_1.CODVEI = PEDIDOS_MONITORAMENTO.codigoPlacaVeiculo
LEFT JOIN
    RODVEI VEICULO_2 ON VEICULO_2.CODVEI = PEDIDOS_MONITORAMENTO.codigoPlacaVeiculo2
LEFT JOIN
    RODVEI VEICULO_3 ON VEICULO_3.CODVEI = PEDIDOS_MONITORAMENTO.codigoPlacaVeiculo3
LEFT JOIN
    RODVEI VEICULO_4 ON VEICULO_4.CODVEI = PEDIDOS_MONITORAMENTO.codigoPlacaVeiculo4
 --  WHERE numeroPedido IN ('73490', '17368')
 --  WHERE numeroPedido IN ('8834','112395')
`

const sqlPontosPassagemPedido = `
SELECT DISTINCT
    tipoDocumentoEmissao as tipoDocumentoEmissao,
    codigoLinha          as codigoLinha,
    codigoTomador        as codigoTomador,
    TOM.NOMEAB           as nomeTomador,
    codigoRemetente      as codigoRemetente,
    REM.NOMEAB           as nomeRemetente,
    codigoDestinatario   as codigoDestinatario,
    DES.NOMEAB           as nomeDestinatario,
    dataRetirada         as dataColeta,
    dataChegadaPrevista  as dataEntrega,
    POSICAO              as POSICAO,
    ORDMAN               as ORDMAN
FROM (
SELECT -- DEVIDO DUPLICIDADE NA TABELA RODDPR
    VIA.tipoDocumentoEmissao,
    --
    RODLPR.CODLIN "codigoLinha",
    RODLPR.CODTOM "codigoTomador",
    RODLPR.CODREM "codigoRemetente",
    RODLPR.CODDES "codigoDestinatario",
    -- Veiculo com base no manifesto de carga
    RODPRC.DATRET dataRetirada,
    CASE WHEN RODLPR.PRECHE IS NOT NULL
         THEN RODLPR.PRECHE
         ELSE RODPRC.DATENT
         END dataChegadaPrevista,
    --
    -- Ordem da viagem de acordo com o Manifesto de carga
    VIA.POSICAO,
    VIA.ORDMAN
    --
FROM RODDPR, -- BUSCAR A PV COM BASE DOC DE ORIGEM DO MANIFESTO DE CARGA
     RODLPR, -- PV-PROGRAMACAO DO VEICULO
     RODDPR RODDPRC, -- BUSCAR A PC COM BASE NA PV
     RODPRC, -- PC-PROGRAMACAO DE CARGA
    (
      SELECT
       -- *****************************************************************
       -- RECUPERA AS VIAGENS EM ANDAMENTO COM BASE NOS MANIFESTOS DE CARGA
       -- *****************************************************************
       MAN.CODFIL "codigoFilialManifesto",
       MAN.SERMAN "serieManifesto",
       MAN.CODMAN "codigoManifesto",
       --
       MAN.TIPMAN "tipoManifesto",
       CASE
       WHEN MAN.TIPMAN = 1 THEN 'LOTAÇÃO'
       WHEN MAN.TIPMAN = 2 THEN 'Transferência'
       WHEN MAN.TIPMAN = 4 THEN 'Mista'
       WHEN MAN.TIPMAN = 6 THEN 'Distribuição'
       WHEN MAN.TIPMAN = 7 THEN 'Coleta'
       WHEN MAN.TIPMAN = 8 THEN 'Reentrega'
       END "descricacaoTipoManifesto",
       --
       CASE WHEN TIPDOC = 'O' THEN 'O.S.T.'
       WHEN TIPDOC = 'A' THEN 'A.C.T.'
       WHEN TIPDOC = 'C' THEN 'C.T.R.C.'
       END tipoDocumentoEmissao,
       --
       DOC.filialDocOrigemMAN,
       DOC.serieDocOrigemMAN,
       DOC.codigoDocOrigemMAN,
       -- DOC DE ORIGEM PARA BUSCAR A PV
       DOC.DOCPV,
       DOC.filialDocOrigemPV,
       DOC.serieDocOrigemPV,
       DOC.codigoDocOrigemPV,
       --
       MAN.PLACA "codigoPlacaVeiculo",
       MAN.PLACA2 "codigoPlacaVeiculo2",
       MAN.PLACA3 "codigoPlacaVeiculo3",
       MAN.PLACA4 "codigoPlacaVeiculo4",
       --
       MAN.CODMO1 "codigoMotorista1",
       MAN.CODMO2 "codigoMotorista2",
       MAN.CODMO3 "codigoMotorista3",
       --
       ISNULL(DOC.ORDEM,0) AS POSICAO,
       ISNULL(DOC.ORDMAN,0) AS ORDMAN
       --
       FROM RODMAN MAN,
       (
        -- OST ******************************
        SELECT
        RODIMA.FILMAN,
        RODIMA.SERMAN,
        RODIMA.CODMAN,
        RODIMA.ORDEM,
        RODIMA.ORDMAN,
        RODIMA.TIPDOC,
        RODIMA.FILDOC "FilialDocOrigemMAN",
        RODIMA.SERDOC "serieDocOrigemMAN",
        RODIMA.CODDOC "codigoDocOrigemMAN",
        'O' DOCPV, -- OST,
        RODORD.CODFIL "filialDocOrigemPV",
        RODORD.SERORD "serieDocOrigemPV",
        RODORD.CODIGO "codigoDocOrigemPV"
        FROM RODIMA, RODORD
        Where RODORD.CODFIL = RODIMA.FILDOC
        AND  RODORD.SERORD = RODIMA.SERDOC
        AND  RODORD.CODIGO = RODIMA.CODDOC
        AND  RODIMA.TIPDOC = 'O'  -- ****** OST
        --
        UNION ALL
        -- OST COM BASE CTE ******************************
        SELECT
        RODIMA.FILMAN,
               RODIMA.SERMAN,
               RODIMA.CODMAN,
               RODIMA.ORDEM,
               RODIMA.ORDMAN,
               RODIMA.TIPDOC,
               RODIMA.FILDOC "FilialDocOrigemMAN",
               RODIMA.SERDOC "serieDocOrigemMAN",
               RODIMA.CODDOC "codigoDocOrigemMAN",
               'O' DOCPV, -- OST
               RODORD.CODFIL "filialDocOrigemPV",
               RODORD.SERORD "serieDocOrigemPV",
               RODORD.CODIGO "codigoDocOrigemPV"
               FROM RODIMA, RODCON, RODORC, RODORD
               Where  RODCON.CODFIL = RODIMA.FILDOC
               AND  RODCON.SERCON = RODIMA.SERDOC
               AND  RODCON.CODCON = RODIMA.CODDOC
               AND  RODIMA.TIPDOC = 'C'
               -- Recupera a OST com base no CTE
               AND RODORC.CODCON = RODCON.CODCON
               AND RODORC.SERCON = RODCON.SERCON
               AND RODORC.FILCON = RODCON.CODFIL
               --
               AND RODORD.CODFIL = RODORC.FILORD
               AND RODORD.SERORD = RODORC.SERORD
               AND RODORD.CODIGO = RODORC.CODORD
               --
               UNION ALL
               -- ACT ****************************
               SELECT
               RODIMA.FILMAN,
               RODIMA.SERMAN,
               RODIMA.CODMAN,
               RODIMA.ORDEM,
               RODIMA.ORDMAN,
               RODIMA.TIPDOC,
               RODIMA.FILDOC "FilialDocOrigemMAN",
               RODIMA.SERDOC "serieDocOrigemMAN",
               RODIMA.CODDOC "codigoDocOrigemMAN",
               'A' DOCPV, --ACT
               RODCOL.CODFIL "filialDocOrigemPV",
               RODCOL.SERCOL "serieDocOrigemPV",
               RODCOL.CODIGO "codigoDocOrigemPV"
               FROM RODIMA, RODCOL
               Where  RODCOL.CODFIL = RODIMA.FILDOC
               AND  RODCOL.SERCOL = RODIMA.SERDOC
               AND  RODCOL.CODIGO = RODIMA.CODDOC
               AND  RODIMA.TIPDOC = 'A' -- ******* ACT
               --
               UNION ALL
               -- ACT COM BASE CTE ****************************
               SELECT
               RODIMA.FILMAN,
               RODIMA.SERMAN,
               RODIMA.CODMAN,
               RODIMA.ORDEM,
               RODIMA.ORDMAN,
               RODIMA.TIPDOC,
               RODIMA.FILDOC "FilialDocOrigemMAN",
               RODIMA.SERDOC "serieDocOrigemMAN",
               RODIMA.CODDOC "codigoDocOrigemMAN",
               'A' DOCPV, --ACT
               RODCOL.CODFIL "filialDocOrigemPV",
               RODCOL.SERCOL "serieDocOrigemPV",
               RODCOL.CODIGO "codigoDocOrigemPV"
               FROM RODIMA, RODCON, RODCOC, RODCOL
               Where  RODCON.CODFIL = RODIMA.FILDOC
               AND  RODCON.SERCON = RODIMA.SERDOC
               AND  RODCON.CODCON = RODIMA.CODDOC
               AND  RODIMA.TIPDOC = 'C'
               -- Recupera a ACT com base no CTE
               AND RODCOC.CODCON = RODCON.CODCON
               AND RODCOC.SERCON = RODCON.SERCON
               AND RODCOC.FILCON = RODCON.CODFIL
               --
               AND RODCOL.CODIGO = RODCOC.CODCOL
               AND RODCOL.SERCOL = RODCOC.SERCOL
               AND RODCOL.CODFIL = RODCOC.FILCOL
               --
               )  DOC
               --
  WHERE MAN.SITUAC = 'E' -- STATUS=eEM VIAGEM (CASO PRECISAR
                       --                              TRAZER MAIS CASOS
                       --                              UTILIZAR STATUS-'B'=BAIXADO
                       --
                       AND MAN.TIPMAN NOT IN (2, 6) -- TRANSFERENCIA (FLUXO DE EXCEÇÃO PARA OUTRA QUERY SEPARADA)
                       AND DOC.CODMAN = MAN.CODMAN -- CHAVE DA RODIMA
                       AND DOC.FILMAN = MAN.CODFIL -- CHAVE DA RODIMA
                       AND DOC.SERMAN = MAN.SERMAN -- CHAVE DA RODIMA
) VIA
WHERE  RODDPR.TIPPRO = 'V' -- Associativa PV vs Docs de origem
  AND  RODDPR.FILDOC = VIA.filialDocOrigemPV
  AND  RODDPR.CODDOC = VIA.codigoDocOrigemPV
  AND  RODDPR.SERDOC = VIA.serieDocOrigemPV
  AND  RODDPR.TIPDOC = VIA.DOCPV -- CONFORME DOC DE ORIGEM
  --
  AND  RODLPR.CODFIL = RODDPR.FILPRO
  AND  RODLPR.CODLPR = RODDPR.CODPRO
  --  BUSCAR O PEDIDO COM BASE NA PV
  AND  RODDPRC.FILDOC = RODLPR.CODFIL
  AND  RODDPRC.CODDOC = RODLPR.CODLPR
  AND  RODDPRC.TIPDOC = 'V'
  AND  RODDPRC.TIPPRO = 'C'
  --   BUSCAR A PC COM BASE NA PV
  AND  RODPRC.CODFIL = RODDPRC.FILPRO
  AND  RODPRC.CODIGO = RODDPRC.CODPRO
  AND  RODDPRC.CODPRO = :numeroPedido
  AND  RODDPRC.FILPRO = :codigoFilial) AS PASSAGENS
INNER JOIN RODCLI TOM
ON TOM.CODCLIFOR = codigoTomador
INNER JOIN RODCLI REM
ON REM.CODCLIFOR = codigoRemetente
INNER JOIN RODCLI DES
ON DES.CODCLIFOR = codigoDestinatario
ORDER BY POSICAO,
         ORDMAN`

const storedProcedureFimViagem = `
DECLARE @RETURN_VALUE INT,
   @P_RETORNO NVARCHAR(500)

EXEC @RETURN_VALUE = [DBO].[PI_BAIXA_PV]
   @P_CODFIL = :codigoFilial,
   @P_NUMEROPEDIDO = :numeroPedido,
   @P_USUARIO = :usuario,
   @P_RETORNO = @P_RETORNO OUTPUT

SELECT @P_RETORNO AS N'retorno', 'value' = @RETURN_VALUE`

const sqlPedidoAgrupados = (pParams) => {
  const vSql = `SELECT @@ORDENACAOLINHA@@ P.* FROM (
    SELECT
            COALESCE(LPR.CODFIL,PRC.CODFIL)             codigoFilial,
            COALESCE(LPR_FIL.NOMEAB,PRC_FIL.NOMEAB)     nomeFilial,
            COALESCE(LPR_EMP.CODEMP,PRC_EMP.CODEMP)     codigoEmpresa,
            COALESCE(LPR_EMP.DESCRI,PRC_EMP.DESCRI)     nomeEmpresa,
            PRC.CODIGO codigoFilialPedido,
            CAST(PRC.CODIGO AS VARCHAR(10)) numeroPedido,
            CASE WHEN isnull(LPR.SITUAC,'x') = 'D' THEN 'COM ALOCACAO'
              WHEN isnull(LPR.SITUAC,'x') = 'E' THEN 'EM VIAGEM'
              WHEN isnull(LPR.SITUAC,'x')= 'F' THEN 'VIAGEM FINALIZADA'
              WHEN isnull(LPR.SITUAC,'x') = 'C' THEN 'CANCELADO'
              WHEN isnull(LPR.SITUAC,'x') = 'B' THEN 'BLOQUEADO GER. RISCO'
              WHEN PRC.SITUAC IN ('D','M') THEN 'NOVO'
              WHEN PRC.SITUAC = 'C' THEN 'CANCELADA'
            END AS statusPedidoTorre,
            PRC.CODPTC codigoTipoCarga,
            PTC.DESCRI descricaoTipoCarga,
            COALESCE(LPR.CODLIN,PRC.CODLIN) codigoLinha,
            PRC.CODREM codigoRemetente,
            CLI_PRC.NOMEAB nomeRemetente,
            COALESCE(IPR.CODDES, LPR.CODDES) "codigoDestinatario",
            COALESCE(CLI_IPR.NOMEAB, CLI_LPR.NOMEAB) nomeDestinatario,
            COALESCE(LPR.PLACA,PRC.PLACA) codigoPlacaVeiculo,
            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PLACA2 ELSE NULL END codigoPlacaVeiculo2,
            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PLACA3 ELSE NULL END codigoPlacaVeiculo3,
            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PLACA4 ELSE NULL END codigoPlacaVeiculo4,
            COALESCE(LPR.DIFERE,PRC.DIFERE) diferencial,
            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.CODMO1 ELSE NULL END codigoMotorista1,
            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.CODMO2 ELSE NULL END codigoMotorista2,
            PRC.DATRET dataRetirada,
            PRC.DATENT dataChegada,
            CASE WHEN DPR.ID_DPR IS NOT NULL THEN LPR.PRECHE ELSE NULL END dataChegadaPrevista
            FROM RODPRC PRC
            LEFT JOIN RODPTC PTC on PTC.CODPTC = PRC.CODPTC -- cad. de tipo de carga
            LEFT JOIN RODIPR IPR on (IPR.CODIGO = PRC.CODIGO -- Destino(s) de programação para pegar agrupador Integrator
                                AND IPR.CODFIL = PRC.CODFIL)
            LEFT JOIN RODFIL PRC_FIL ON (PRC.CODFIL = PRC_FIL.CODFIL)
            LEFT JOIN RODEMP PRC_EMP ON (PRC_FIL.CODEMP = PRC_EMP.CODEMP)
            LEFT JOIN RODDPR DPR ON (PRC.CODFIL = DPR.FILPRO
                                AND PRC.CODIGO = DPR.CODPRO
                                AND DPR.TIPDOC = 'V'
                            AND DPR.TIPPRO = 'C')
            LEFT JOIN RODLPR LPR ON (DPR.CODDOC = LPR.CODLPR -- Associativa PC versus PC
                          AND DPR.FILDOC = LPR.CODFIL)
            LEFT JOIN RODFIL LPR_FIL ON (LPR.CODFIL = LPR_FIL.CODFIL)
            LEFT JOIN RODEMP LPR_EMP ON (PRC_FIL.CODEMP = LPR_EMP.CODEMP)
            LEFT JOIN RODCLI CLI_PRC ON (CLI_PRC.CODCLIFOR = PRC.CODREM)
            LEFT JOIN RODCLI CLI_IPR ON (CLI_IPR.CODCLIFOR = IPR.CODDES)
            LEFT JOIN RODCLI CLI_LPR ON (CLI_LPR.CODCLIFOR = LPR.CODDES)
            WHERE PRC.CODFIL = ${pParams.codigoFilial} AND IPR.ORDCOM = '${pParams.numeroPedido}'
                        ) P `

  return vSql
}

const sql = {
  sqlObterPedido,
  sqlObterNumeroPedido,
  sqlPedido,
  sqlPedidoAgrupados,
  sqlComposicaoCarga,
  sqlProgramacaoVeiculo,
  storedProcedureGeraProgramacaoVeiculo,
  storedProcedureFimViagem,
  sqlPedidosEmViagem,
  sqlPedidosNovosAndEmAlocacao,
  sqlPontosPassagemPedido,
}

export default sql
