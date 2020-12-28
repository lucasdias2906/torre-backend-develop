import dml from '../funcoes/dml'
import sql from './mapaSinoticoSQL'

async function listarViagens(req) {
  const vParams = {}
  const vPermissoesFiliais = {}
  return dml.executarSQL(sql.procListarViagem(vPermissoesFiliais), vParams)
}

async function listarCheckpoints(req) {
  const vParams = req.query
  let vFiltro = 'AND 1=1'
  if (vParams.codigoLinha) vFiltro = ` AND LIN.CODLIN = '${vParams.codigoLinha}'`
  let vOrdenacao = ''
  vOrdenacao = ' HCK.ID_HCK' // default
  return dml.executarSQLListar(vParams, sql.sqlTrechoCheckpoints(), vFiltro, vOrdenacao)
}

const MapaSinoticoServico = {
  listarViagens: (req) => listarViagens(req),
  listarCheckpoints: (req) => listarCheckpoints(req),
}

export default MapaSinoticoServico
