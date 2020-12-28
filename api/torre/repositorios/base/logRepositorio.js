import _log from '../../modelos/_log'

async function logIncluir (pRegistro, pOptions, pTipo) {
  try {
    const vItem = {
      colecao: pRegistro.constructor.modelName,
      chave: pRegistro._id,
      dados: pRegistro,
      usuario: pRegistro.log.usuarioAlteracao,
      tipo: pTipo,
      dataInclusao: new Date(),
    }

    const itemLog = new _log(vItem)

    await itemLog.save(pOptions)
  } catch (e) {
    console.log(e)
  }
}


const functions = {
  logIncluir: (pRegistro, pOptions, pTipo) => logIncluir(pRegistro, pOptions, pTipo),
}

export default functions
