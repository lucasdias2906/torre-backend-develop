const
  sqlDisponibilidadeVeiculo = (
    periodoViagemInicial,
    periodoViagemFinal,
  ) => `SELECT
             @@ORDENACAOLINHA@@
             VEI.CODVEI codigoVeiculo,
             VEI.NUMVEI placa,
             VEI.PLACA2 codigoVeiculo2,
             VEI2.NUMVEI placa2,
             VEI.PLACA3 codigoVeiculo3,
             VEI3.NUMVEI placa3,
		   VEI.PLACA4 codigoVeiculo4,
             VEI4.NUMVEI placa4,
             RODFILPREF.NOMEAB filialPreferencial,
             VEI.NUMVEI identificacaoPlacaVeiculo,
             VEI.TIPVEI codigoTipoVeiculo,
             CASE WHEN VEI.TIPVEI = 1 THEN '02 EIXOS TRACIONADORES'
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
                     END AS descricaoTipoVeiculo,
             CASE WHEN VEI.CODCMO IN (27, 9, 10, 33, 14, 29, 24, 11, 31, 30, 32, 46, 43, 73, 44, 26, 28, 47, 72) THEN 'S' ELSE 'N' END AS tracionador,	                     
             VEI.CODCMO codigoClassificacaoVeiculo,
             CMO.DESCRI descricaoClassificaoVeiculo,
             MOT.CODMOT codigoMotoristaPreferencial,
             MOT.NOMMOT nomeMotoristaPreferencial,
             VEI.PROPRI identificacaoVeiculoProprio,
             VEI.CODPRO codigoProprietario,
             CLI.RAZSOC nomeProprietario,
             (SELECT TOP 1 FIL.NOMEAB
              FROM RODMAN MAN
              JOIN RODFIL FIL ON (MAN.FILDES = FIL.CODFIL)
             WHERE MAN.PLACA = VEI.CODVEI
             ORDER
                BY MAN.DATEMI DESC) destinoUltimoManifesto,
             CASE WHEN VEI.SITUAC = 1 THEN 'ATIVO'
                WHEN VEI.SITUAC = 2 THEN 'BAIXADO'
                WHEN VEI.SITUAC = 3 THEN 'INATIVO'
             END "descricaoSituacaoVeiculo",

             CASE WHEN EXISTS(
                  SELECT 1
                  FROM RODPRC PRC
                  WHERE
                      (PRC.PLACA = VEI.CODVEI )
                      AND ((PRC.DATREF BETWEEN CONVERT(DATETIME,'${periodoViagemInicial}',127) AND CONVERT(DATETIME,'${periodoViagemFinal}',127)
                      OR PRC.DATENT BETWEEN CONVERT(DATETIME,'${periodoViagemInicial}',127) AND CONVERT(DATETIME,'${periodoViagemFinal}',127)))
             )THEN 0
             ELSE 1 END "regras.VerificaProgramacaoCargaOK",

             CASE WHEN EXISTS(
                  SELECT 1
                  FROM RODLPR LPR
                  WHERE
                      ((LPR.PLACA = VEI.CODVEI) AND LPR.SITUAC IN ('D', 'E'))
                      AND ((CONVERT(DATETIME,'${periodoViagemInicial}',127) >= LPR.DATSAI AND  CONVERT(DATETIME,'${periodoViagemFinal}',127) <= LPR.DATCHE)
                      OR (CONVERT(DATETIME,'${periodoViagemFinal}',127) >= LPR.DATSAI AND CONVERT(DATETIME,'${periodoViagemInicial}',127) <= LPR.DATCHE))
             )THEN 0
             ELSE 1 END "regras.VerificaProgramacaoVeiculoOK",

             CASE WHEN EXISTS(
                  SELECT 1
                  FROM RODCAM CAM
                  WHERE
                      CAM.CODVEI = VEI.CODVEI
                      AND CAM.DATREF BETWEEN CONVERT(DATETIME,'${periodoViagemInicial}',127) AND CONVERT(DATETIME,'${periodoViagemFinal}',127)
             )THEN 0
             ELSE 1 END "regras.VerificaAdvertenciaOK",

             CASE WHEN EXISTS(
                  SELECT 1
                  FROM OSEORD ORD
                  WHERE
                      ORD.CODVEI = VEI.CODVEI AND ORD.SITUAC = 'A'
                      AND (ORD.DATREF BETWEEN CONVERT(DATETIME,'${periodoViagemInicial}',127) AND  CONVERT(DATETIME,'${periodoViagemFinal}',127)
                      OR ORD.PREVEN BETWEEN CONVERT(DATETIME,'${periodoViagemInicial}',127) AND  CONVERT(DATETIME,'${periodoViagemFinal}',127))) THEN 0
             ELSE 1 END "regras.VerificaOrdermServicoOK",

             CASE WHEN EXISTS(
                  SELECT 1
                  FROM RODMAN MAN
                  WHERE MAN.SITUAC IN('D','E')
                      AND (MAN.PLACA = VEI.CODVEI)
                      AND (((MAN.DATINI BETWEEN CONVERT(DATETIME,'${periodoViagemInicial}',127) AND CONVERT(DATETIME,'${periodoViagemFinal}',127)
                      OR MAN.DATLME BETWEEN CONVERT(DATETIME,'${periodoViagemInicial}',127) AND  CONVERT(DATETIME,'${periodoViagemFinal}',127)))
                      OR( CONVERT(DATETIME,'${periodoViagemFinal}',127) >= MAN.DATLME AND CONVERT(DATETIME,'${periodoViagemInicial}',127) <= MAN.DATINI))
             )THEN 0
             ELSE 1 END "regras.VerificaManifestoOK"

          FROM RODVEI VEI
          LEFT JOIN RODCMO CMO on VEI.CODCMO = CMO.CODCMO -- cad. de classificacao de veiculos
          LEFT JOIN RODVEI VEI2 ON (VEI.PLACA2 = VEI2.CODVEI)
          LEFT JOIN RODVEI VEI3 ON (VEI.PLACA3 = VEI3.CODVEI)
          LEFT JOIN RODVEI VEI4 ON (VEI.PLACA4 = VEI4.CODVEI)
          LEFT JOIN RODCLI RODCLIPREF ON (VEI.CLIALO = RODCLIPREF.CODCLIFOR)
          LEFT JOIN RODFIL RODFILPREF ON (RODCLIPREF.CODFIL = RODFILPREF.CODFIL)
          LEFT JOIN RODMOT MOT ON (VEI.CODMOT = MOT.CODMOT)
          LEFT JOIN  RODCLI CLI on (VEI.CODPRO = CLI.CODCLIFOR) -- cad. parceiro comercial (proprietario)
          JOIN RODFIL FIL ON FIL.CODFIL = CMO.CODFIL -- cad. de filial
          JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
          @@FILTRO@@`

const
  sqlDisponibilidadeVeiculoQuantidade = (
  ) => `SELECT
               COUNT(0) as quantidadeVeiculosDisponiveis
          FROM RODVEI VEI
          LEFT JOIN RODCMO CMO on VEI.CODCMO = CMO.CODCMO -- cad. de classificacao de veiculos
          LEFT JOIN RODVEI VEI2 ON (VEI.PLACA2 = VEI2.CODVEI)
          LEFT JOIN RODVEI VEI3 ON (VEI.PLACA3 = VEI3.CODVEI)
          LEFT JOIN RODVEI VEI4 ON (VEI.PLACA4 = VEI4.CODVEI)
          LEFT JOIN RODCLI RODCLIPREF ON (VEI.CLIALO = RODCLIPREF.CODCLIFOR)
          LEFT JOIN RODFIL RODFILPREF ON (RODCLIPREF.CODFIL = RODFILPREF.CODFIL)
          LEFT JOIN RODMOT MOT ON (VEI.CODMOT = MOT.CODMOT)
          LEFT JOIN  RODCLI CLI on (VEI.CODPRO = CLI.CODCLIFOR) -- cad. parceiro comercial (proprietario)
          JOIN RODFIL FIL ON FIL.CODFIL = CMO.CODFIL -- cad. de filial
          JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
          `

const
  sqlDisponibilidadeMotorista = (
    periodoViagemInicial,
    periodoViagemFinal,
    pCategoriaCNH,
    pPlaca,
    pPermissaoFiliais,
  ) => `SELECT
               @@ORDENACAOLINHA@@
               UNN.CODUNN codigoUnidadeNegocio,
               UNN.DESCRI descricaoUnidadeNegocio,
               MOT.CODCMO codigoClassificacao,
               CMO.DESCRI descricaoClassificacao,
               (SELECT TOP 1 FIL.NOMEAB
                  FROM RODMAN MAN
                  JOIN RODFIL FIL ON (MAN.FILDES = FIL.CODFIL)
                 WHERE MAN.CODMO1 = MOT.CODMOT
                 ORDER
                    BY MAN.DATEMI DESC) destinoUltimoManifesto,
               VEIFIXO.NUMVEI   placaFixa,
               MOT.VEICFIX      placaEhFixa,
               MOT.CODMOT       codigoMotorista,
               MOT.NOMMOT       nomeMotorista,
               MOT.NUMCPF       numeroCPF,
               MOT.EMPREG       identificacaoRegistrado,
               MOT.SITUAC       codigoSituacao,
               CASE WHEN MOT.SITUAC = 'A' THEN 'ATIVO'
                    WHEN MOT.SITUAC = 'I' THEN 'INATIVO'
                    WHEN MOT.SITUAC = 'L' THEN 'AGUARDANDO LIBERACAO'
               END descricaoSituacao,
               MOT.CARTDT 'habilitacao.dataCNH',
               MOT.VENCHA 'habilitacao.dataVencimentoCNH',
               MOT.CATECH 'habilitacao.categoriaCNH',
               CASE WHEN MOT.SITUAC = 'A' THEN 1
                    ELSE 0
               END "regras.VerificaSituacaoOK",
               CASE WHEN
                                 (
                                  (CONVERT(DATETIME,'${periodoViagemInicial}',127) >= MOT.CARTDT AND  CONVERT(DATETIME,'${periodoViagemInicial}',127) <= MOT.VENCHA)
                                  AND
                                  (CONVERT(DATETIME,'${periodoViagemFinal}',127) >= MOT.CARTDT AND  CONVERT(DATETIME,'${periodoViagemFinal}',127) <= MOT.VENCHA)
                                  ) THEN 1
               ELSE 0 END "regras.VerificaVigenciaCNHOK",
               CASE
                WHEN    (
                          SUBSTRING(MOT.CATECH, 1, 1) >= '${pCategoriaCNH}'
                           OR
                          SUBSTRING(MOT.CATECH, 2, 1) >= '${pCategoriaCNH}'
                        )
                THEN 1
                ELSE 0 END "regras.VerificaCategoriaCNHOK",
                CASE WHEN NOT EXISTS(
                                  SELECT 1
                                    FROM
                                         RODCAM_HIS CAM
                                   WHERE
                                        CAM.CODMOT = MOT.CODMOT
                                    AND CAM.DATREF >= CONVERT(DATETIME,'${periodoViagemInicial}',127)
                                    AND CAM.DATREF <= CONVERT(DATETIME,'${periodoViagemFinal}',127)
                                 )
                THEN 1
                ELSE 0 END "regras.VerificaAdvertenciasOK",
                CASE WHEN NOT EXISTS
                              (SELECT 1
                                 FROM
                                      RODMAN MAN
                               WHERE MAN.SITUAC = 'D'
                                 AND (MAN.CODMO1 = MOT.CODMOT OR MAN.CODMO2 = MOT.CODMOT)
                                 AND (
                                      (CONVERT(DATETIME,'${periodoViagemInicial}',127) >= MAN.DATINI AND  CONVERT(DATETIME,'${periodoViagemInicial}',127) <= MAN.DATLME)
                                      OR
                                      (CONVERT(DATETIME,'${periodoViagemFinal}',127) >= MAN.DATINI AND  CONVERT(DATETIME,'${periodoViagemFinal}',127) <= MAN.DATLME)
                                     )
                              )
               THEN 1
               ELSE 0 END "regras.VerificaManifestoOK",
               CASE WHEN NOT EXISTS
                (SELECT 1
                FROM
                     RODLPR LPR
              WHERE
                    (
                      LPR.CODMO1 = MOT.CODMOT OR
                      (LPR.CODMO2 = MOT.CODMOT AND LPR.CODMO2 IS NOT NULL) OR
                      (LPR.CODMO3 = MOT.CODMOT AND LPR.CODMO3 IS NOT NULL)
                    )
                AND LPR.SITUAC IN ('D')
                AND (
                     (CONVERT(DATETIME,'${periodoViagemInicial}',127) >= LPR.DATSAI AND CONVERT(DATETIME,'${periodoViagemInicial}',127) <= LPR.DATCHE)
                     OR
                     (CONVERT(DATETIME,'${periodoViagemFinal}',127) >= LPR.DATSAI AND CONVERT(DATETIME,'${periodoViagemFinal}',127) <= LPR.DATCHE)
                    )
                )
               THEN 1
               ELSE 0 END "regras.VerificaProgramacaoOK"
           FROM
                RODMOT MOT
      LEFT JOIN RODUNN UNN ON (MOT.CODUNN = UNN.CODUNN)
      LEFT JOIN RODCMO CMO on (MOT.CODCMO = CMO.CODCMO) -- cad. classificacao motorista
      LEFT JOIN RODVEI VEI ON (MOT.CODMOT = VEI.CODMOT AND VEI.CODVEI = '${pPlaca}')
      LEFT JOIN RODVEI VEIFIXO ON (MOT.PLACAV = VEIFIXO.CODVEI)
      JOIN RODFIL FIL ON FIL.CODFIL = CMO.CODFIL -- cad. de filial
      JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
      WHERE FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais !== -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'} -- Filtro multi empresa de acordo com os acessos do usuario logado
      @@FILTRO@@
          `

const
  sqlDisponibilidadeMotoristaQuantidade = (
    pPermissaoFiliais,
  ) => `SELECT
               COUNT(0) as quantidadeMotoristasDisponiveis
          FROM
               RODMOT MOT
          LEFT JOIN RODUNN UNN ON (MOT.CODUNN = UNN.CODUNN)
          LEFT JOIN RODCMO CMO on (MOT.CODCMO = CMO.CODCMO) -- cad. classificacao motorista
          LEFT JOIN RODVEI VEI ON (MOT.CODMOT = VEI.CODMOT AND VEI.CODVEI = 'XXXXXXXXX')
          LEFT JOIN RODVEI VEIFIXO ON (MOT.PLACAV = VEIFIXO.CODVEI)
          JOIN RODFIL FIL ON FIL.CODFIL = CMO.CODFIL -- cad. de filial
          JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
          WHERE FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais !== -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'} -- Filtro multi empresa de acordo com os acessos do usuario logado
          `

const sql = {
  sqlDisponibilidadeVeiculo,
  sqlDisponibilidadeVeiculoQuantidade,
  sqlDisponibilidadeMotorista,
  sqlDisponibilidadeMotoristaQuantidade,
}

export default sql
