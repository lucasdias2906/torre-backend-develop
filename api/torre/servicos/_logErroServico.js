
import _logErroRepositorio from '../repositorios/_logErroRepositorio'

const logErroRepositorio = new _logErroRepositorio()

async function incluir (pDados) {
  const vErro = { dados: pDados }
  await logErroRepositorio.incluir(vErro)
}

const functions = {
  incluir: (pDados) => incluir(pDados),
}

export default functions
