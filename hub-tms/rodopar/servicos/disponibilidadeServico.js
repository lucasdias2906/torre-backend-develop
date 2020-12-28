import dml from '../funcoes/dml'
import sql from './disponibilidadeSQL'

async function listarVeiculo(req) {
  const vParams = req.query
  let vFiltro = ''
  const vOrdenacao = 'VEI.CODVEI'

  vFiltro = `WHERE VEI.CODFIL ${(vParams.permissaoFiliais && vParams.permissaoFiliais != -1) ? `IN (${vParams.permissaoFiliais}) ` : 'IS NULL '}` // WHERE VEI.CODFIL IN (${vParams.permissaoFiliais})`;
  if (vParams.codigoClassificacaoVeiculo) vFiltro = `${vFiltro} AND VEI.CODCMO = '${vParams.codigoClassificacaoVeiculo}'`

  if (vParams.tracionador != 'T') {
    if (vParams.classificacao && vParams.tracionador == 'S') vFiltro = `${vFiltro} AND VEI.CODCMO IN (${vParams.classificacao})`
    if (vParams.classificacao && vParams.tracionador == 'N') vFiltro = `${vFiltro} AND VEI.CODCMO NOT IN (${vParams.classificacao})`
  }

  if (vParams.identificacaoVeiculoProprio && vParams.identificacaoVeiculoProprio == 'S') vFiltro = `${vFiltro} AND VEI.PROPRI = 'S'`
  if (vParams.codigoTipoVeiculo) vFiltro = `${vFiltro} AND VEI.TIPVEI = '${vParams.codigoTipoVeiculo}'`
  vFiltro = `${vFiltro} AND VEI.SITUAC = 1`

  if (vParams.placa) vFiltro = `${vFiltro} AND VEI.NUMVEI = '${vParams.placa}'`

  // PROGRAMAÇÃO DE CARGA
  vFiltro = `${vFiltro} AND NOT EXISTS(
                            SELECT 1
                            FROM RODPRC PRC
                            WHERE
                                (PRC.PLACA = VEI.CODVEI)
                                AND ((PRC.DATREF BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)
                                OR PRC.DATENT BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)))
                        )`

  // PROGRAMAÇÃO DE VEÍCULO
  vFiltro = `${vFiltro} AND NOT EXISTS(
                            SELECT 1
                            FROM RODLPR LPR
                            WHERE
                                ((LPR.PLACA = VEI.CODVEI) AND LPR.SITUAC IN ('D', 'E'))
                                AND ((CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) >= LPR.DATSAI AND  CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) <= LPR.DATCHE) OR
                                (CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) >= LPR.DATSAI AND CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) <= LPR.DATCHE))
                        )`

  // ADVERTENCIA
  vFiltro = `${vFiltro} AND NOT EXISTS(
                            SELECT 1
                            FROM RODCAM CAM
                            WHERE
                                CAM.CODVEI = VEI.CODVEI
                                AND CAM.DATREF BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)
                        )`

  // ORDEM DE SERVIÇO
  vFiltro = `${vFiltro} AND NOT EXISTS (
                            SELECT 1
                            FROM OSEORD ORD
                            WHERE
                                ORD.CODVEI = VEI.CODVEI
                                AND (ORD.DATREF BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND  CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)
                                OR ORD.PREVEN BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND  CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127))
                                AND ORD.SITUAC = 'A'
                        )`

  // MANIFESTO
  vFiltro = `${vFiltro} AND NOT EXISTS(
                            SELECT 1
                            FROM RODMAN MAN
                            WHERE MAN.SITUAC IN('D','E') AND (MAN.PLACA = VEI.CODVEI)
                              AND (((MAN.DATINI BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)
                              OR MAN.DATLME BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND  CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)))
                              OR (CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) >= MAN.DATLME AND CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) <= MAN.DATINI))
                        )`

  vFiltro = `${vFiltro}                 `

  return dml.executarSQLListar(vParams, sql.sqlDisponibilidadeVeiculo(vParams.periodoViagemInicial, vParams.periodoViagemFinal, vParams.placa), vFiltro, vOrdenacao)
}

async function obterQuantidadeVeiculo(req) {
  const vParams = req.query
  let vFiltro = ''

  vFiltro = `WHERE VEI.CODFIL ${(vParams.permissaoFiliais && vParams.permissaoFiliais != -1) ? `IN (${vParams.permissaoFiliais}) ` : 'IS NULL '}` // WHERE VEI.CODFIL IN (${vParams.permissaoFiliais})`;
  if (vParams.codigoClassificacaoVeiculo) vFiltro = `${vFiltro} AND VEI.CODCMO = '${vParams.codigoClassificacaoVeiculo}'`

  if (vParams.tracionador != 'T') {
    if (vParams.classificacao && vParams.tracionador == 'S') vFiltro = `${vFiltro} AND VEI.CODCMO IN (${vParams.classificacao})`
    if (vParams.classificacao && vParams.tracionador == 'N') vFiltro = `${vFiltro} AND VEI.CODCMO NOT IN (${vParams.classificacao})`
  }

  if (vParams.identificacaoVeiculoProprio && vParams.identificacaoVeiculoProprio == 'S') vFiltro = `${vFiltro} AND VEI.PROPRI = 'S'`
  if (vParams.codigoTipoVeiculo) vFiltro = `${vFiltro} AND VEI.TIPVEI = '${vParams.codigoTipoVeiculo}'`
  vFiltro = `${vFiltro} AND VEI.SITUAC = 1`

  if (vParams.placa) vFiltro = `${vFiltro} AND VEI.NUMVEI = '${vParams.placa}'`

  // PROGRAMAÇÃO DE CARGA
  vFiltro = `${vFiltro} AND NOT EXISTS(
                            SELECT 1
                            FROM RODPRC PRC
                            WHERE
                                (PRC.PLACA = VEI.CODVEI)
                                AND ((PRC.DATREF BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)
                                OR PRC.DATENT BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)))
                        )`

  // PROGRAMAÇÃO DE VEÍCULO
  vFiltro = `${vFiltro} AND NOT EXISTS(
                            SELECT 1
                            FROM RODLPR LPR
                            WHERE
                                ((LPR.PLACA = VEI.CODVEI) AND LPR.SITUAC IN ('D', 'E'))
                                AND ((CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) >= LPR.DATSAI AND  CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) <= LPR.DATCHE) OR
                                (CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) >= LPR.DATSAI AND CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) <= LPR.DATCHE))
                        )`

  // ADVERTENCIA
  vFiltro = `${vFiltro} AND NOT EXISTS(
                            SELECT 1
                            FROM RODCAM CAM
                            WHERE
                                CAM.CODVEI = VEI.CODVEI
                                AND CAM.DATREF BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)
                        )`

  // ORDEM DE SERVIÇO
  vFiltro = `${vFiltro} AND NOT EXISTS (
                            SELECT 1
                            FROM OSEORD ORD
                            WHERE
                                ORD.CODVEI = VEI.CODVEI
                                AND (ORD.DATREF BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND  CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)
                                OR ORD.PREVEN BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND  CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127))
                                AND ORD.SITUAC = 'A'
                        )`

  // MANIFESTO
  vFiltro = `${vFiltro} AND NOT EXISTS(
                            SELECT 1
                            FROM RODMAN MAN
                            WHERE MAN.SITUAC IN('D','E') AND (MAN.PLACA = VEI.CODVEI)
                              AND (((MAN.DATINI BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)
                              OR MAN.DATLME BETWEEN CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) AND  CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)))
                              OR (CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) >= MAN.DATLME AND CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) <= MAN.DATINI))
                        )`

  vFiltro = `${vFiltro}                 `

  // return dml.executarSQLListar(vParams, sql.sqlDisponibilidadeVeiculo(vParams.periodoViagemInicial, vParams.periodoViagemFinal, vParams.placa), vFiltro, vOrdenacao);
  return dml.executarSQLObter(sql.sqlDisponibilidadeVeiculoQuantidade(vParams.permissaoFiliais) + vFiltro)
}

async function listarMotorista(req) {
  const vParams = req.query
  let vFiltro = ''
  let vOrdenacao = ''

  const vPlaca = vParams.placa || 'XXXXXXXXX'

  vOrdenacao = ' CASE WHEN VEI.CODVEI IS NULL THEN 1 ELSE 0 END' // Lista primeiro os motoristas associados ao veículo informado

  if (vParams.ordenacao === 'codigoMotorista') vOrdenacao += ', MOT.CODMOT'
  if (vParams.ordenacao === 'nomeMotorista') vOrdenacao += ', MOT.NOMMOT'
  if (vParams.ordenacao === 'identificacaoRegistrado') vOrdenacao += ',  MOT.EMPREG'

  vFiltro = ' AND 1 = 1 '

  if (vParams.codigoMotorista) vFiltro = `${vFiltro} AND (MOT.CODMOT = ${vParams.codigoMotorista})`
  if (vParams.nomeMotorista) vFiltro = `${vFiltro} AND (MOT.NOMMOT LIKE '%${vParams.nomeMotorista}%')`
  vParams.numeroCPF = vParams.numeroCPF ? vParams.numeroCPF.replace(/[.-]+/g, '') : vParams.numeroCPF
  if (vParams.numeroCPF) vFiltro += ` AND REPLACE(REPLACE(MOT.NUMCPF, '.', ''),'-','')  LIKE '%${vParams.numeroCPF}%'`
  if (vParams.identificacaoRegistrado && vParams.identificacaoRegistrado == 'S') vFiltro = `${vFiltro} AND (MOT.EMPREG = 'S')`


  // T) Todos D) Disponíveis I) Indisponíveis

  if (vParams.situacao === 'D') {
    vFiltro = `${vFiltro} AND MOT.SITUAC = 'A'` // 1) Situação Ativo
    vFiltro = `${vFiltro}  AND (
                                 (CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) >= MOT.CARTDT AND CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) <= MOT.VENCHA)
                                 AND
                                 (CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) >= MOT.CARTDT AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) <= MOT.VENCHA)
                                )
                               ` // 2) CNH vigente no período da viagem
    vFiltro = `${vFiltro} AND (
                              SUBSTRING(MOT.CATECH, 1, 1) >= '${vParams.categoriaCNH}'
                              OR
                              SUBSTRING(MOT.CATECH, 2, 1) >= '${vParams.categoriaCNH}'
                              )
                              ` // 3) Verifica a Categoria da CNH
    vFiltro = `${vFiltro} AND NOT EXISTS
                              (SELECT 1
                                 FROM
                                      RODCAM_HIS CAM
                               WHERE
                                    CAM.CODMOT = MOT.CODMOT
                                AND CAM.DATREF >= CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127)
                                AND CAM.DATREF <= CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)
                              )` // 4) Verifica se possui alguma advertência

    vFiltro = `${vFiltro} AND NOT EXISTS
                                         (SELECT 1
                                                   FROM
                                          RODMAN MAN
                                           WHERE MAN.SITUAC = 'D'
                                             AND (MAN.CODMO1 = MOT.CODMOT OR MAN.CODMO2 = MOT.CODMOT)
                                             AND (
                                             (CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) >= MAN.DATINI AND  CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) <= MAN.DATLME)
                                              OR
                                             (CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) >= MAN.DATINI AND  CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) <= MAN.DATLME)
                                           )
                                          )` // 5) Verifica se não possui nenhum manifesto no período

    vFiltro = `${vFiltro} AND NOT EXISTS
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
                                               (CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) >= LPR.DATSAI AND CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) <= LPR.PRECHE)
                                               OR
                                               (CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) >= LPR.DATSAI AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) <= LPR.PRECHE)
                                               )
                                        )` // 6) Verifica se não possui nenhuma Programação de Veículo no período
  }

  return dml.executarSQLListar(vParams, sql.sqlDisponibilidadeMotorista(vParams.periodoViagemInicial, vParams.periodoViagemFinal, vParams.categoriaCNH, vPlaca, vParams.permissaoFiliais), vFiltro, vOrdenacao)
}

async function obterQuantidadeMotorista(req) {
  const vParams = req.query
  let vFiltro = ''

  vFiltro = ' AND 1 = 1 '

  // T) Todos D) Disponíveis I) Indisponíveis

  if (vParams.situacao === 'D') {
    vFiltro = `${vFiltro} AND MOT.SITUAC = 'A'` // 1) Situação Ativo
    vFiltro = `${vFiltro}  AND (
                                 (CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) >= MOT.CARTDT AND CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) <= MOT.VENCHA)
                                 AND
                                 (CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) >= MOT.CARTDT AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) <= MOT.VENCHA)
                                )
                               ` // 2) CNH vigente no período da viagem
    vFiltro = `${vFiltro} AND (
                              SUBSTRING(MOT.CATECH, 1, 1) >= '${vParams.categoriaCNH}'
                              OR
                              SUBSTRING(MOT.CATECH, 2, 1) >= '${vParams.categoriaCNH}'
                              )
                              ` // 3) Verifica a Categoria da CNH
    vFiltro = `${vFiltro} AND NOT EXISTS
                              (SELECT 1
                                 FROM
                                      RODCAM_HIS CAM
                               WHERE
                                    CAM.CODMOT = MOT.CODMOT
                                AND CAM.DATREF >= CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127)
                                AND CAM.DATREF <= CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127)
                              )` // 4) Verifica se possui alguma advertência

    vFiltro = `${vFiltro} AND NOT EXISTS
                                         (SELECT 1
                                                   FROM
                                          RODMAN MAN
                                           WHERE MAN.SITUAC = 'D'
                                             AND (MAN.CODMO1 = MOT.CODMOT OR MAN.CODMO2 = MOT.CODMOT)
                                             AND (
                                             (CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) >= MAN.DATINI AND  CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) <= MAN.DATLME)
                                              OR
                                             (CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) >= MAN.DATINI AND  CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) <= MAN.DATLME)
                                           )
                                          )` // 5) Verifica se não possui nenhum manifesto no período

    vFiltro = `${vFiltro} AND NOT EXISTS
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
                                               (CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) >= LPR.DATSAI AND CONVERT(DATETIME,'${vParams.periodoViagemInicial}',127) <= LPR.PRECHE)
                                               OR
                                               (CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) >= LPR.DATSAI AND CONVERT(DATETIME,'${vParams.periodoViagemFinal}',127) <= LPR.PRECHE)
                                               )
                                        )` // 6) Verifica se não possui nenhuma Programação de Veículo no período
  }

  return dml.executarSQLObter(sql.sqlDisponibilidadeMotoristaQuantidade(vParams.permissaoFiliais) + vFiltro)
}

const disponibilidadeServico = {
  listarVeiculo: (req) => listarVeiculo(req),
  obterQuantidadeVeiculo: (req) => obterQuantidadeVeiculo(req),
  listarMotorista: (req) => listarMotorista(req),
  obterQuantidadeMotorista: (req) => obterQuantidadeMotorista(req),
}

export default disponibilidadeServico
