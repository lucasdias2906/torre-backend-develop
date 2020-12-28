
const sqlRotaListar = (pPermissaoFiliais) => ` SELECT
                               @@ORDENACAOLINHA@@
                               LIN.CODLIN codigoLinha,
                               LIN.SITUAC identificaoSituacaoLinha,
                               CASE WHEN LIN.SITUAC = 'A' THEN 'ATIVO'
                               WHEN LIN.SITUAC = 'I' THEN 'INATIVA' END descricaoStatusLinha,
                               MUNI.DESCRI nomeMunicipioInicial,
                               MUNF.DESCRI nomeMunicipioFinal
                      FROM
                           dbo.RODLIN LIN
                      JOIN dbo.RODMUN MUNI ON LIN.PONINI = MUNI.CODITN
                      JOIN dbo.RODMUN MUNF ON LIN.PONFIM = MUNF.CODITN
                      JOIN dbo.RODFIL FIL  ON FIL.CODFIL = LIN.CODFIL
                      JOIN dbo.RODEMP EMP  ON EMP.CODEMP = FIL.CODEMP
                     WHERE FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'} 
                     @@FILTRO@@
        `;

const sqlRotaObter = (pPermissaoFiliais) => ` SELECT
                            LIN.CODLIN codigoLinha,
                            LIN.SITUAC identificaoSituacaoLinha,
                            LIN.KMTPLA quantidadeKmsPadrao,
                            CASE
                            WHEN LIN.SITUAC = 'A' THEN
                                'ATIVO'
                            WHEN LIN.SITUAC = 'I' THEN
                                'INATIVA'
                            END descricaoStatusLinha,
                            LIN.PONINI codigoPontoInicial,
                            MUNI.DESCRI nomeMunicipioInicial,
                            MUNI.ESTADO siglaUFMunicipioInicial,
                            LIN.PONFIM codigoPontoFinal,
                            MUNF.DESCRI nomeMunicipioFinal,
                            MUNF.ESTADO siglaUFMunicipioFinal,
                            LIN.DATINC 'log.dataInclusao',
                            NULL       'log.usuarioInclusao',
                            LIN.DATATU 'log.dataAlteracao',
                            LIN.USUATU 'log.usuarioAlteracao'
                        FROM dbo.RODLIN LIN
                        JOIN dbo.RODMUN MUNI ON LIN.PONINI = MUNI.CODITN
                        JOIN dbo.RODMUN MUNF ON LIN.PONFIM = MUNF.CODITN
                        JOIN dbo.RODFIL FIL  ON FIL.CODFIL = LIN.CODFIL
                        JOIN dbo.RODEMP EMP  ON EMP.CODEMP = FIL.CODEMP
                        WHERE LIN.CODLIN = :pId 
                        AND FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'} 
`;

const sqlTrechoListar = (pPermissaoFiliais) => ` SELECT @@ORDENACAOLINHA@@
                                 TRE.ID_TRE identificadorTrecho,
                                 TRE.CODLIN codigoRota,
                                 TRE.SEQTRE sequenciaTrecho,
                                 TRE.LINTRE codigoTrecho,
                                 TRE.KMTTRE quantidadeKmsTrecho,
                                 TRE.VLRTRE valorTrecho,
                                 TRE.TIPCAL tipoCalculo,
                                 TRE.DATINC 'log.dataInclusao',
                                 TRE.USUINC 'log.usuarioInclusao',
                                 TRE.DATATU 'log.dataAlteracao',
                                 TRE.USUATU 'log.usuarioAlteracao'
                                 FROM dbo.RODTRE TRE -- Cadastro de Linhas
                        JOIN dbo.RODLIN LIN ON LIN.CODLIN = TRE.CODLIN -- cad. de rotas (linhas)
                        JOIN dbo.RODFIL FIL ON FIL.CODFIL = LIN.CODFIL -- cad. de filial
                        JOIN dbo.RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
                        JOIN dbo.RODLIN LINT ON LINT.CODLIN = TRE.LINTRE -- cad. de rotas (linhas)
                        JOIN dbo.RODMUN MUNI ON LINT.PONINI = MUNI.CODITN -- cad. de municipios
                        JOIN dbo.RODMUN MUNF ON LINT.PONFIM = MUNF.CODITN -- cad. de municipios
                        WHERE FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'} 
                        @@FILTRO@@`; // EMP.CODEMP = 1; -- Filtro multi empresa de acordo com os acessos do usuario logado


const sql = {
  sqlRotaListar,
  sqlRotaObter,
  sqlTrechoListar,
};

export default sql;
