import Funcionalidade from '../modelos/funcionalidade'

const funcionalidadeServico = {
  buscarTodos: () => Funcionalidade.find({}),
}

export default funcionalidadeServico
