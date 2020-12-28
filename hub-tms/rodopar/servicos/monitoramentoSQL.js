const sqlVeiculos = (pPermissaoFiliais) => `
                              SELECT @@ORDENACAOLINHA@@
                                     VEI.NUMVEI placaVeiculo,
                                     VEI.CODVEI codigoVeiculo,
                                     VEI.CODCMO codigoClassificacaoVeiculo,
                                     CMO.DESCRI descricaoClassificaoVeiculo
                              FROM
                                   RODVEI VEI
                       LEFT JOIN  RODCMO CMO on VEI.CODCMO = CMO.CODCMO -- cad. de classificacao de veiculos
                              WHERE VEI.SITUAC = 1
                             -- AND NUMVEI = 'DBL-4H25'
                              @@FILTRO@@`

const sqlVeiculosSemAlocacaoPorTempo = () => `
SELECT
        placaVeiculo,
        codigoVeiculo,
        manifestoSituacao,
        manifestoDataEmissao
  FROM
       (
         SELECT
                RODMAN.DATEMI manifestoDataEmissao,
                RODVEI.NUMVEI placaVeiculo,
                RODVEI.CODVEI codigoVeiculo,
                RODMAN.SITUAC manifestoSituacao,
                ROW_NUMBER()  OVER(PARTITION BY RODMAN.CODMO1 ORDER BY DATEMI DESC) ordem
          FROM
               RODMAN
          JOIN RODVEI ON (RODMAN.PLACA = RODVEI.CODVEI)
         WHERE
               RODMAN.SITUAC NOT IN ('C') -- Não Cancelados
        ) X
   WHERE X.ordem = 1`


const sqlMotoristas = () => `
SELECT
       @@ORDENACAOLINHA@@
       MOT.CODMOT  codigoMotorista,
       MOT.NOMMOT  nomeMotorista,
       MOT.SITUAC  codigoSituacao,
       MOT.CARTHA  'habilitacao.numeroCNH',
       MOT.CARTDT  'habilitacao.dataCNH',
       MOT.CARTCI  'habilitacao.codigoCidadeCNH',
       MOT.CATECH  'habilitacao.categoriaCNH',
       MOT.VENCHA  'habilitacao.dataVencimentoCNH',
       MOT.CODIFI  'habilitacao.codigoCodificadorCNH'
FROM
      RODMOT MOT -- cad. de motorista
WHERE
      MOT.VENCHA >= GETDATE()
@@FILTRO@@
`

const sqlMotoristasFerias = () => `
    SELECT
            @@ORDENACAOLINHA@@
            CAM.CODCAM  codigoAdvertencia,
            CAM.CODMOT  codigoMotorista,
            MOT.NOMMOT  nomeMotorista,
            CAM.DATREF  dataReferencia,
            MTV.CODMTV  codigoMotivoAdvertencia,
            MTV.DESCRI  descricaoMotivo,
            CAM.OBSERV  descricaoObservacaoAdvertencia
      FROM
           RODCAM_HIS CAM -- Historico de advertencias do veiculo
      JOIN RODMOT MOT on MOT.CODMOT = CAM.CODMOT -- Cad. de motoristas
      JOIN RODMTV MTV on CAM.CODMTV = MTV.CODMTV -- Cad. de motivos de advertencias
      JOIN RODFIL FIL ON FIL.CODFIL = CAM.CODFIL -- cad. de filial
      JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
     WHERE
          CAM.DATREF > GETDATE()
      AND MOT.CODMOT = 470 -- código referente à férias programada
@@FILTRO@@
`


const sqlMotoristasSemAlocacaoPorTempo = () => `
SELECT
               @@ORDENACAOLINHA@@
               codigoMotorista,
               nomeMotorista,
               numeroCPF,
               manifestoSituacao,
               manifestoDataEmissao
        FROM
              (
                SELECT codigoMotorista,
                       manifestoDataEmissao,
                       manifestoSituacao,
                       nomeMotorista,
                       numeroCPF
                 FROM
                       (
                        SELECT RODMAN.DATEMI manifestodataEmissao,
                               RODMAN.CODMO1 codigoMotorista,
                               RODMOT.NOMMOT nomeMotorista,
                               RODMOT.NUMCPF numeroCPF,
                               RODMAN.SITUAC manifestoSituacao,
                               ROW_NUMBER()  OVER(PARTITION BY RODMAN.CODMO1 ORDER BY DATEMI DESC) ordem
                         FROM
                              RODMAN
                         JOIN RODMOT ON (RODMAN.CODMO1 = RODMOT.CODMOT)
                        WHERE RODMAN.SITUAC NOT IN ('C') -- Não Cancelados
                          AND RODMOT.SITUAC = 'A' -- Motoristas Ativos
              ) X
                WHERE X.ordem = 1
             ) k
         @@FILTRO@@`

const procListarViagem = () => `

         DECLARE @RC int
         DECLARE @PAR_TIPO_LISTA char(1)
         DECLARE @PAR_CODFIL smallint
         DECLARE @PAR_SERIE char(3)
         DECLARE @PAR_CODMAN int
         DECLARE @RETORNO nvarchar(500)

         -- TODO: Defina valores de parâmetros aqui.
         set @PAR_TIPO_LISTA = 'V';
         set @PAR_CODFIL = null --30
         set @PAR_SERIE = null --
         set @PAR_CODMAN = null --773

         EXECUTE @RC = [dbo].[PI_GERA_LISTA_VIAGENS]
            @PAR_TIPO_LISTA
           ,@PAR_CODFIL
           ,@PAR_SERIE
           ,@PAR_CODMAN
           ,@RETORNO OUTPUT

         `

const sql = {
  sqlVeiculos,
  sqlVeiculosSemAlocacaoPorTempo,
  sqlMotoristas,
  sqlMotoristasSemAlocacaoPorTempo,
  sqlMotoristasFerias,
  procListarViagem,
}

export default sql
