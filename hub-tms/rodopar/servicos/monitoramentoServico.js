import dml from '../funcoes/dml'
import sql from './monitoramentoSQL'

async function listarViagens(req) {
  const vParams = {}
  const vPermissoesFiliais = {}
  const vRetorno = (await dml.executarSQL(sql.procListarViagem(vPermissoesFiliais), vParams)).dados

  const vListagem = vRetorno.map((elem) => ({
    numeroPedido: elem.codigoPedido,
    codigoFilial: elem.codigoFilialPedido,
    placaVeiculo: elem.placaVeiculo,
  }))// .filter((item) => item.numeroPedido === '13887')

  /*
  .filter((item) => item.numeroPedido === '13909x' || item.numeroPedido === '13906x'
     || item.numeroPedido === '19304x'
     || item.numeroPedido === '21652x'
     || item.numeroPedido === '5896x'
     || item.numeroPedido === '17740x'
     || item.numeroPedido === '13943x'
     || item.numeroPedido === '13944x'
     || item.numeroPedido === '21661x'
     || item.numeroPedido === '115106x'
     || item.numeroPedido === '12214x'
     || item.numeroPedido === '17739',
  ) */

  return { dados: vListagem }
}

async function listarVeiculos(req) {
  const vParams = req.query
  const vFiltro = ''
  const vOrdenacao = ' VEI.CODVEI'

  return dml.executarSQLListar(vParams, sql.sqlVeiculos(), vFiltro, vOrdenacao)
}

async function listarVeiculosSemAlocacaoPorTempo(req) {
  const vParams = req.query
  const vFiltro = ''
  const vOrdenacao = ' codigoVeiculo'

  return dml.executarSQLListar(vParams, sql.sqlVeiculosSemAlocacaoPorTempo(), vFiltro, vOrdenacao)
}

async function listarMotoristas(req) {
  const vParams = req.query

  const vFiltro = ''
  const vOrdenacao = ' MOT.CODMOT'

  return dml.executarSQLListar(vParams, sql.sqlMotoristas(), vFiltro, vOrdenacao)
}

async function listarMotoristasSemAlocacaoPorTempo(req) {
  const vParams = req.query

  const vFiltro = ''
  const vOrdenacao = ' codigoMotorista'

  return dml.executarSQLListar(vParams, sql.sqlMotoristasSemAlocacaoPorTempo(), vFiltro, vOrdenacao)
}

async function listarMotoristasFerias(req) {
  const vParams = req.query

  const vFiltro = ''
  const vOrdenacao = ' CAM.CODMOT'

  return dml.executarSQLListar(vParams, sql.sqlMotoristasFerias(), vFiltro, vOrdenacao)
}

const MonitoramentoServico = {
  listarViagens: (req) => listarViagens(req),
  listarVeiculos: (req) => listarVeiculos(req),
  listarVeiculosSemAlocacaoPorTempo: (req) => listarVeiculosSemAlocacaoPorTempo(req),
  listarMotoristaSemAlocacaoPorTempo: (req) => listarMotoristasSemAlocacaoPorTempo(req),
  listarMotoristas: (req) => listarMotoristas(req),
  listarMotoristaFerias: (req) => listarMotoristasFerias(req),
}

export default MonitoramentoServico
