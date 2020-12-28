const sqlOcorrencia = (pPermissaoFiliais) => `
               SELECT
                    @@ORDENACAOLINHA@@
                    CAM.CODCAM "codigoAdvertencia",
                    --CAM.CODMOT "codigoMotorista",
                    --MOT.NOMMOT "nomeMotorista",
                    --CAM.CODVEI "codigoVeiculo",
                    --VEI.NUMVEI "numeroVeiculo",
                    CAM.DATREF "dataReferencia",
                    --MTV.CODMTV "codigoMotivoAdvertencia",
                    MTV.DESCRI "descricaoMotivo",
                    CAM.OBSERV "descricaoObservacaoAdvertencia",
                    CAM.USUATU "nomeLancadoPor",
                    --CAM.CODFIL "codigoFilial",
                    --EMP.CODEMP "codigoEmpresa"

                    CAM.DATATU 'log.dataAlteracao',
                    CAM.USUATU 'log.usuarioAlteracao',
                    CAM.DATINC 'log.dataInclusao',
                    CAM.USUINC 'log.usuarioInclusao'

               FROM  RODCAM_HIS CAM -- Historico de advertencias do veiculo
               LEFT OUTER JOIN  RODMOT MOT on MOT.CODMOT = CAM.CODMOT -- Cad. de motoristas
               LEFT OUTER JOIN  RODVEI VEI on VEI.CODVEI = CAM.CODVEI -- Cad. de veiculos
               INNER JOIN  RODMTV MTV on CAM.CODMTV = MTV.CODMTV -- Cad. de motivos de advertencias
               INNER JOIN  RODFIL FIL ON FIL.CODFIL = CAM.CODFIL -- cad. de filial
               INNER JOIN  RODEMP EMP ON EMP.CODEMP = FIL.CODEMP -- Cad. de empresas
               WHERE FIL.CODFIL ${(pPermissaoFiliais && pPermissaoFiliais != -1) ? `IN (${pPermissaoFiliais})` : 'IS NULL'} -- Filtro multi empresa de acordo com os acessos do usuario logado
               @@FILTRO@@`;

const sql = {
    sqlOcorrencia,
};

export default sql;
