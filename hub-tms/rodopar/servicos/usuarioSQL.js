module.exports = {
    sqlUsuarioEmpresas: `SELECT
                        @@ORDENACAOLINHA@@
                           EMP.CODEMP "codigoEmpresa",
                           EMP.DESCRI "descricao",
                           EMP.TIPO "tipo",
                           EMP.CODGRU "codigoGrupo"
                        FROM RODOPE OPE
                        INNER JOIN RODFIL FIL ON FIL.CODFIL = OPE.CODFIL -- Cadastro de Filial
                        INNER JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cadastro de empresa
                        WHERE EMP.CODGRU IN (50,51)
                        @@FILTRO@@`,

    sqlUsuarioEmpresaFiliais: `SELECT
                                @@ORDENACAOLINHA@@
                                  FIL.CODFIL "codigoFilial",
                                  FIL.RAZSOC "razaoSocial",
                                  OPE.ATIVO  "identificadorStatus"
                                FROM RODOPE OPE
                                INNER JOIN RODFIL FIL ON FIL.CODFIL = OPE.CODFIL -- Cadastro de Filial
                                INNER JOIN RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cadastro de empresa
                                WHERE EMP.CODGRU IN (50,51)
                                @@FILTRO@@`,

    sqlObtemPorLogin: `SELECT
                        OPE.LOGIN  "nomeLogin",
                        OPE.NOME   "nomeUsuario",
                        OPE.ATIVO  "identificadorStatus",
                        OPE.TELEFO "numeroTelefone",
                        OPE.RAMAL  "numeroRamal",
                        OPE.CELULA "numeroCelular",
                        OPE.EMAIL  "nomeEmail",
                        OPE.NUMCPF "numeroCPF", 
                        OPE.CODFIL "codigoFilia"
                      FROM RODOPE OPE
                      WHERE OPE.LOGIN = :pId`,
};
