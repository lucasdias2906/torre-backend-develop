import VeiculoClassificacaoRepositorio from '../repositorios/veiculoClassificacaoRepositorio'

const veiculoClassificacaoRepositorio = new VeiculoClassificacaoRepositorio()

async function verificarClassificacao(pCodigoClassificacao) {
  return veiculoClassificacaoRepositorio.verificarClassificacao(pCodigoClassificacao)
}

async function listarClassificacaoUsaCombustivel() {
  return veiculoClassificacaoRepositorio.listarClassificacaoUsaCombustivel()
}

const functions = {
  verificarClassificacao: (pCodigoClassificacao) => verificarClassificacao(pCodigoClassificacao),
  listarClassificacaoUsaCombustivel: () => listarClassificacaoUsaCombustivel(),
}

export default functions
