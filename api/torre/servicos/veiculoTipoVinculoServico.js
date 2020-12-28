import _veiculoTipoVinculoRepositorio from '../repositorios/veiculoTipoVinculoRepositorio'

const veiculoTipoVinculoRepositorio = new _veiculoTipoVinculoRepositorio()

async function listar (req) {
  return veiculoTipoVinculoRepositorio.listar(req)
}

const functions = {
  listar: (req) => listar(req),
}

export default functions
