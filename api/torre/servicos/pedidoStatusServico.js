import PedidoStatusRepositorio from '../repositorios/pedidoStatusRepositorio'

async function listar (pParams) {
  const repositorio = new PedidoStatusRepositorio()
  return repositorio.listar(pParams, {})
}

const functions = {
  listar: async (pParams) => { return listar(pParams) }
}

export default functions
