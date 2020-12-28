module.exports = {
    sqlTipoCargaListar: ` SELECT
                               @@ORDENACAOLINHA@@
                               
                               PTC.CODPTC codigoTipoOperacao,
                               PTC.DESCRI descricaoTipoOperacao
                               FROM  dbo.RODPTC PTC
                               WHERE 1=1
                          @@FILTRO@@
        `,
    sqlTipoCargaObter: `SELECT
                        PTC.CODPTC codigoTipoOperacao,
                        PTC.DESCRI descricaoTipoOperacao
                        FROM  dbo.RODPTC PTC
                        WHERE PTC.CODPTC = :pId
`,
};
