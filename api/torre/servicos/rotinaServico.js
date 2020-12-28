import RotinaRepositorio from '../repositorios/rotinaRepositorio'
import RotinaLogRepositorio from '../repositorios/rotinaLogRepositorio'

const rotinaRepositorio = new RotinaRepositorio()
const rotinaLogRepositorio = new RotinaLogRepositorio()

async function incluir(pRotinaTipo) {
  return rotinaRepositorio.incluir(pRotinaTipo, {})
}

async function incluirLog(pRotinaId, pLog) {
  return rotinaLogRepositorio.incluir(pRotinaId, pLog)
}

async function existeRotinaNaoFinalizada(pRotinaTipo) {
  return rotinaRepositorio.existeRotinaNaoFinalizada(pRotinaTipo, {})
}

async function atualizarProcessamento(pId, pObservacao, pStatus, pQtdIncluidos, pQtdAlterados, pQtdErros) {
  rotinaRepositorio.atualizarProcessamento(pId, pObservacao, pStatus, pQtdIncluidos, pQtdAlterados, pQtdErros)
}

async function processar(pRotinaFuncao, pRotinaTipo, pParametros) {
  if (await existeRotinaNaoFinalizada(pRotinaTipo)) return 'EXISTE_ROTINA_NAO_FINALIZADA'
  let vRotina
  let vFuncao
  try {
    vRotina = (await rotinaRepositorio.incluir(pRotinaTipo, {})).dados
    vFuncao = await pRotinaFuncao(pParametros)
    await atualizarProcessamento(vRotina._id, 'OK', 'P', (vFuncao ? vFuncao.qtdOK : 0), 0, (vFuncao ? vFuncao.qtdErro : 0))
  } catch (e) {
    console.log('erro função:', e)
    await atualizarProcessamento(vRotina._id, e, 'E', vFuncao ? vFuncao.qtdOK : 0, 0, vFuncao ? vFuncao.qtdErro : 0)
  }
  return 'OK'
}

const functions = {
  incluir: (pTipo) => incluir(pTipo),
  incluirLog: (pRotinaId, pLog) => incluirLog(pRotinaId, pLog),
  processar: (pRotinaFuncao, pRotinaTipo, pParametros) => processar(pRotinaFuncao, pRotinaTipo, pParametros),
  existeRotinaNaoFinalizada: (pTipo) => existeRotinaNaoFinalizada(pTipo),
  atualizarProcessamento: (pId, pObservacao, pStatus, pQtdIncluidos, pQtdAlterados, pQtdErros) => atualizarProcessamento(pId, pObservacao, pStatus, pQtdIncluidos, pQtdAlterados, pQtdErros)
}
export default functions
