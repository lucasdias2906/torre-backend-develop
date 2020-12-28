import dml from '../funcoes/dml';
import sql from './ocorrenciaSQL';

async function obter(pCodigoOcorrencia) {
  return dml.executarSQLObter(sql.sqlOcorrenciaDetalhes, pCodigoOcorrencia);
}

async function listar(req) {
  const vParams = req.query;

  let vOrdenacao = '';
  if (vParams.ordenacao === 'dataReferencia') vOrdenacao += ' CAM.DATREF';
  else if (vParams.ordenacao === 'descricaoMotivo') vOrdenacao += ' MTV.DESCRI';
  else if (vParams.ordenacao === 'descricaoObservacaoAdvertencia') vOrdenacao += ' CAM.OBSERV';
  else if (vParams.ordenacao === 'nomeLancadoPor') vOrdenacao += ' CAM.USUATU';
  else vOrdenacao += ' CAM.CODCAM';
  return dml.executarSQLListar(vParams, sql.sqlOcorrencia(vParams.permissaoFiliais), '', vOrdenacao);
}

async function listarPorTipoOcorrencia(req) {
  const vParams = req.query;
  const vTipoOcorrencia = req.params.pTipoOcorrencia;

  let vFiltro = ` AND MTV.TIPMTV = '${vTipoOcorrencia}'`;
  let vOrdenacao = '';

  if (vParams.codigoVeiculo) vFiltro += ` AND CAM.CODVEI = '${vParams.codigoVeiculo}'`;
  if (vParams.codigoMotorista) vFiltro += ` AND CAM.CODMOT = ${Number(vParams.codigoMotorista)}`;

  vOrdenacao = '';
  if (vParams.ordenacao === 'dataReferencia') vOrdenacao += ' CAM.DATREF';
  else if (vParams.ordenacao === 'descricaoMotivo') vOrdenacao += '  MTV.DESCRI';
  else if (vParams.ordenacao === 'descricaoObservacaoAdvertencia') vOrdenacao += ' CAM.OBSERV';
  else if (vParams.ordenacao === 'nomeLancadoPor') vOrdenacao += ' CAM.USUATU';
  else vOrdenacao += ' CAM.CODCAM';
  return dml.executarSQLListar(vParams, sql.sqlOcorrencia(vParams.permissaoFiliais), vFiltro, vOrdenacao);
}

const OcorrenciaServico = {
  obter: (pCodigoOcorrencia) => obter(pCodigoOcorrencia),
  listar: (req) => listar(req),
  listarPorTipoOcorrencia: (req) => listarPorTipoOcorrencia(req),
};

export default OcorrenciaServico;
