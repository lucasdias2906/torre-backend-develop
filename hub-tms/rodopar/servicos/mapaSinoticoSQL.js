const procListarViagem = (pPermissaoFiliais) => `

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

const sqlTrechoCheckpoints = () => `
SELECT
         @@ORDENACAOLINHA@@
         LIN.CODLIN,
         HOR.CODTOM,
         CLI.NOMEAB,
         HCK.CODHOR,
         HCK.DESCRI descricao,
         HCK.LATITU latitude,
         HCK.LONGIT longitude,
         HCK.RAIOMT,
         HCK.DURACA
  FROM
        RODLIN LIN
JOIN RODHOR HOR ON HOR.CODLIN = LIN.CODLIN
LEFT JOIN  RODCLI CLI ON CLI.CODCLIFOR = HOR.CODTOM
JOIN  RODHCK HCK ON HCK.CODHOR = HOR.CODHOR
WHERE 1=1
  @@FILTRO@@
`


const sql = {
  procListarViagem,
  sqlTrechoCheckpoints,
}

export default sql
